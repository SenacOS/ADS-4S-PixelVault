import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { createApplication } from '../server/app.mjs';
import { createMercadoPagoGateway, checkoutUrl } from '../server/mercadopago-gateway.mjs';
import { initializeDatabase } from '../scripts/init-db.mjs';

function provider() {
  const state = { creates: 0, preferences: [], payments: [], lost: false, badSeller: false, badPreference: false };
  const gateway = createMercadoPagoGateway({ accessToken: 'SECRET-FIXTURE', environment: 'test', sellerId: '100', buyerId: '200',
    fetchImpl: async (url, options) => {
      const u = new URL(url);
      let result;
      if (u.pathname === '/users/me') result = { id: 100, site_id: 'MLB', tags: state.badSeller ? [] : ['test_user'] };
      else if (u.pathname === '/users/200') result = { id: 200, site_id: 'MLB', tags: ['test_user'] };
      else if (options.method === 'POST') {
        state.creates++;
        const body = JSON.parse(options.body);
        result = { ...body, id: `100-pref-${state.creates}`, collector_id: 100, init_point: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=fixture' };
        state.preferences.push(result);
        if (state.lost) throw new Error('Timeout with SECRET-FIXTURE');
        if (state.badPreference) result = { ...result, collector_id: 999 };
      } else if (u.pathname === '/checkout/preferences/search') {
        const elements = state.preferences.filter((p) => p.external_reference === u.searchParams.get('external_reference'));
        result = { elements, total: elements.length };
      } else if (u.pathname.startsWith('/checkout/preferences/')) result = state.preferences.find((p) => p.id === u.pathname.split('/').at(-1));
      else if (u.pathname === '/v1/payments/search') result = { results: state.payments, paging: { total: state.payments.length } };
      else result = state.payments.find((p) => String(p.id) === u.pathname.split('/').at(-1));
      return { ok: true, json: async () => result };
    } });
  function payment(orderId, overrides = {}) {
    state.payments = [{ id: 123, collector_id: 100, payer: { id: 200 }, external_reference: orderId,
      currency_id: 'BRL', transaction_amount: 104.8, transaction_amount_refunded: 0,
      metadata: { pixelvault_order_id: orderId, environment: 'test' }, status: 'approved', ...overrides }];
  }
  return { state, gateway, payment };
}
async function fixture(run) {
  const directory = mkdtempSync(join(tmpdir(), 'pixelvault-checkout-'));
  const databasePath = join(directory, 'test.sqlite');
  initializeDatabase(databasePath);
  const fake = provider();
  let app;
  let base;
  async function start(mode = 'mercadopago') {
    app = createApplication({ databasePath, paymentMode: mode, checkoutGateway: fake.gateway, logger: {} });
    const address = await app.listen(); base = `http://127.0.0.1:${address.port}`;
  }
  async function call(path, { token, body, method = body ? 'POST' : 'GET' } = {}) {
    const r = await fetch(base + path, { method, headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
    return { status: r.status, body: await r.json() };
  }
  async function login(role = 'player') { return (await call('/api/sessions', { body: { email: `${role === 'player' ? 'jogador' : role}@pixelvault.example`, password: 'demo123' } })).body.token; }
  try {
    await start();
    await run({ ...fake, call, login, get app() { return app; }, async restart(mode) { await app.close(); await start(mode); } });
  } finally { await app?.close(); rmSync(directory, { recursive: true, force: true }); }
}
const body = { requestId: 'checkout-fixture-0001', productIds: ['orbit-raiders', 'neon-expansion'] };

test('checkout HTTP: autenticação, corpo estrito, catálogo servidor e isolamento', async () => fixture(async ({ call, login, state }) => {
  assert.equal((await call('/api/checkouts', { body })).status, 401);
  const token = await login();
  for (const bad of [{ ...body, total: 1 }, { ...body, productIds: [] }, { ...body, productIds: ['orbit-raiders', 'orbit-raiders'] }, { ...body, productIds: ['missing'] }, { ...body, usuarioId: 'admin-demo' }]) {
    assert.ok([400, 409].includes((await call('/api/checkouts', { token, body: bad })).status));
  }
  const result = await call('/api/checkouts', { token, body });
  assert.equal(result.status, 200); assert.equal(result.body.totalCents, 10480); assert.equal(result.body.status, 'PENDENTE');
  assert.equal(state.creates, 1);
  assert.equal((await call(`/api/checkouts/${body.requestId}`, { token: await login('admin') })).status, 404);
  assert.equal((await call('/api/users/player-demo/library')).status, 401);
  assert.equal((await call('/api/users/player-demo/library', { token: await login('admin') })).status, 403);
  assert.equal((await call('/api/checkouts', { token: await login('admin'), body })).status, 409);
  assert.equal((await call(`/api/checkouts/${body.requestId}/reconcile`, { token, body: { status: 'approved' } })).status, 400);
  assert.doesNotMatch(JSON.stringify(result), /SECRET-FIXTURE|access_token|payer/);
}));

test('replay concorrente/reinício preserva pedido e preço congelado; não repete POST externo', async () => fixture(async (f) => {
  let token = await f.login();
  const results = await Promise.all(Array.from({ length: 5 }, () => f.call('/api/checkouts', { token, body })));
  assert.ok(results.every((r) => r.status === 200 && r.body.orderId === results[0].body.orderId));
  f.app.database.prepare('UPDATE produto SET preco_centavos = 123 WHERE id = ?').run('orbit-raiders');
  await f.restart(); token = await f.login();
  const replay = await f.call('/api/checkouts', { token, body });
  assert.equal(replay.body.totalCents, 10480); assert.equal(replay.body.orderId, results[0].body.orderId); assert.equal(f.state.creates, 1);
  assert.equal((await f.call('/api/checkouts', { token, body: { ...body, productIds: ['orbit-raiders'] } })).status, 409);
}));

test('resposta perdida e reinício recuperam preferência por busca sem nova criação', async () => fixture(async (f) => {
  f.state.lost = true;
  let token = await f.login();
  const lost = await f.call('/api/checkouts', { token, body }); assert.equal(lost.status, 502); assert.doesNotMatch(JSON.stringify(lost), /SECRET/);
  await f.restart(); token = await f.login();
  const recovered = await f.call('/api/checkouts', { token, body });
  assert.equal(recovered.status, 200); assert.ok(recovered.body.checkoutUrl); assert.equal(f.state.creates, 1);
}));

test('recuperação sem resultado ou ambígua não cria outra preferência nem concede itens', async () => fixture(async (f) => {
  f.state.lost = true; const token = await f.login();
  await f.call('/api/checkouts', { token, body });
  const pref = f.state.preferences[0]; f.state.preferences = [];
  const missing = await f.call('/api/checkouts', { token, body });
  assert.equal(missing.body.uncertain, true); assert.equal(missing.body.checkoutUrl, null);
  f.state.preferences = [pref, { ...pref, id: '100-second' }];
  assert.equal((await f.call('/api/checkouts', { token, body })).status, 502); assert.equal(f.state.creates, 1);
  assert.deepEqual((await f.call('/api/me/library', { token })).body.products, []);
}));

test('reconciliação válida concede biblioteca transacional, idempotente e restaurável', async () => fixture(async (f) => {
  let token = await f.login();
  const order = (await f.call('/api/checkouts', { token, body })).body;
  f.payment(order.orderId);
  const results = await Promise.all(Array.from({ length: 4 }, () => f.call(`/api/checkouts/${body.requestId}/reconcile`, { token, body: {} })));
  assert.ok(results.every((r) => r.body.status === 'APROVADO'));
  assert.equal(f.app.database.prepare('SELECT count(*) AS n FROM pagamento WHERE pedido_id = ?').get(order.orderId).n, 1);
  assert.equal((await f.call('/api/me/library', { token })).body.products.length, 2);
  assert.equal((await f.call('/api/me/library', { token: await f.login('admin') })).body.products.length, 0);
  await f.restart(); token = await f.login();
  assert.equal((await f.call('/api/me/library', { token })).body.products.length, 2);
}));

test('pendência, recusa e cancelamento não concedem; cliente não confirma por URL', async () => fixture(async (f) => {
  const token = await f.login(); const order = (await f.call('/api/checkouts', { token, body })).body;
  for (const [status, expected] of [['pending', 'PENDENTE'], ['rejected', 'RECUSADO'], ['cancelled', 'CANCELADO']]) {
    f.payment(order.orderId, { status });
    const r = await f.call(`/api/checkouts/${body.requestId}/reconcile?status=approved&payment_id=999`, { token, body: {} });
    assert.equal(r.body.status, expected); assert.equal((await f.call('/api/me/library', { token })).body.products.length, 0);
  }
}));

test('divergências remotas, comprador real, reembolso parcial e múltiplas aprovações são recusados', async () => fixture(async (f) => {
  const token = await f.login(); const order = (await f.call('/api/checkouts', { token, body })).body;
  for (const bad of [{ collector_id: 999 }, { payer: { id: 999 } }, { external_reference: 'other' }, { currency_id: 'USD' }, { transaction_amount: 1 }, { metadata: {} }, { transaction_amount_refunded: 0.01 }, { status_detail: 'partially_refunded' }, { status: 'unknown' }]) {
    f.payment(order.orderId, bad);
    assert.equal((await f.call(`/api/checkouts/${body.requestId}/reconcile`, { token, body: {} })).status, 502);
  }
  f.payment(order.orderId); f.state.payments.push({ ...f.state.payments[0], id: 124 });
  assert.equal((await f.call(`/api/checkouts/${body.requestId}/reconcile`, { token, body: {} })).status, 502);
  assert.equal((await f.call('/api/me/library', { token })).body.products.length, 0);
}));

test('falha de concessão faz rollback do pagamento/estado e pode ser reconciliada novamente', async () => fixture(async (f) => {
  const token = await f.login('admin'); const order = (await f.call('/api/checkouts', { token, body })).body;
  f.payment(order.orderId);
  f.app.database.exec("CREATE TRIGGER block_grant BEFORE INSERT ON item_biblioteca BEGIN SELECT RAISE(ABORT, 'fixture'); END;");
  assert.equal((await f.call(`/api/checkouts/${body.requestId}/reconcile`, { token, body: {} })).status, 500);
  assert.equal((await f.call(`/api/checkouts/${body.requestId}`, { token })).body.status, 'PENDENTE');
  assert.equal(f.app.database.prepare('SELECT count(*) AS n FROM pagamento WHERE pedido_id = ?').get(order.orderId).n, 0);
  f.app.database.exec('DROP TRIGGER block_grant;');
  assert.equal((await f.call(`/api/checkouts/${body.requestId}/reconcile`, { token, body: {} })).body.status, 'APROVADO');
  assert.equal((await f.call('/api/me/library', { token })).body.products.length, 2);
}));

test('credencial de vendedor real bloqueia POST; preferência divergente é rejeitada', async () => fixture(async (f) => {
  f.state.badSeller = true; const token = await f.login();
  assert.equal((await f.call('/api/checkouts', { token, body })).body.error.code, 'TEST_ACCOUNT_REQUIRED'); assert.equal(f.state.creates, 0);
  f.state.badSeller = false; f.state.badPreference = true;
  assert.equal((await f.call('/api/checkouts', { token, body })).status, 502);
}));

test('URL de checkout aceita somente HTTPS Mercado Pago brasileiro sem credenciais/portas', () => {
  for (const url of ['http://www.mercadopago.com.br/a', 'https://mercadopago.com.br.evil/a', 'https://evil/a', 'https://u:p@www.mercadopago.com.br/a', 'https://www.mercadopago.com.br:8080/a']) assert.throws(() => checkoutUrl(url));
  assert.match(checkoutUrl('https://www.mercadopago.com.br/checkout/a'), /^https:/);
  assert.throws(() => createMercadoPagoGateway({ accessToken: 'fixture', environment: 'production', sellerId: '1', buyerId: '2' }));
});

test('alternar servidor para simulated não permite aprovar pedido remoto pela rota legada', async () => fixture(async (f) => {
  const token = await f.login(); const order = (await f.call('/api/checkouts', { token, body })).body;
  await f.restart('simulated');
  const blocked = await f.call('/api/payments', { body: { pedidoId: order.orderId } });
  assert.equal(blocked.status, 409); assert.equal(blocked.body.error.code, 'CHECKOUT_REQUIRED');
  assert.equal(f.app.database.prepare('SELECT count(*) AS n FROM pagamento WHERE pedido_id = ?').get(order.orderId).n, 0);
}));

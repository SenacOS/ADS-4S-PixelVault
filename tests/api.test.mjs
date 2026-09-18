import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { createApplication } from '../server/app.mjs';
import { loadConfig } from '../server/config.mjs';
import { initializeDatabase } from '../scripts/init-db.mjs';

async function withApi(run, options = {}) {
  const temporaryDirectory = mkdtempSync(join(tmpdir(), 'pixelvault-api-test-'));
  const databasePath = join(temporaryDirectory, 'test.sqlite');
  initializeDatabase(databasePath);
  const logs = [];
  const application = createApplication({
    databasePath,
    paymentMode: options.paymentMode,
    gateway: options.gateway,
    logger: { info(entry) { logs.push(entry); } },
  });
  const address = await application.listen({ port: 0 });
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    await run({ application, baseUrl, databasePath, logs });
  } finally {
    await application.close();
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}

async function jsonRequest(baseUrl, pathname, options) {
  const response = await fetch(`${baseUrl}${pathname}`, options);
  return { response, body: await response.json() };
}

test('GET /health informa disponibilidade e modo simulated sem detalhes locais', async () => {
  await withApi(async ({ baseUrl }) => {
    const { response, body } = await jsonRequest(baseUrl, '/health');
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'application/json; charset=utf-8');
    assert.deepEqual(body, {
      status: 'ok',
      paymentMode: 'simulated',
      paymentAvailable: true,
    });
    assert.doesNotMatch(JSON.stringify(body), /sqlite|pixelvault-api-test/i);
  });
});

test('GET /api/products preserva UX-10, agrupa e ordena produtos e plataformas', async () => {
  await withApi(async ({ baseUrl }) => {
    const { response, body } = await jsonRequest(baseUrl, '/api/products');
    assert.equal(response.status, 200);
    assert.deepEqual(body.products.map(({ id }) => id), ['neon-expansion', 'orbit-raiders']);
    assert.equal(body.products[0].priceCents, 2490);
    assert.equal(body.products[0].type, 'DLC');
    assert.deepEqual(body.products[0].activationStore, {
      id: 'loja-demo',
      name: 'Loja de demonstração (fictícia)',
    });
    assert.deepEqual(body.products[1].cloudPlatforms.map(({ id }) => id), [
      'boosteroid',
      'geforce-now',
    ]);
    assert.equal(new Set(body.products.map(({ id }) => id)).size, 2);
  });
});

test('biblioteca diferencia usuário existente com itens, vazia e inexistente', async () => {
  await withApi(async ({ baseUrl }) => {
    const player = await jsonRequest(baseUrl, '/api/users/player-demo/library');
    assert.equal(player.response.status, 200);
    assert.deepEqual(player.body.items.map(({ product }) => product.name), [
      'Neon Expansion',
      'Orbit Raiders',
    ]);
    assert.ok(player.body.items.every(({ activationKey }) => activationKey.fictional));

    const admin = await jsonRequest(baseUrl, '/api/users/admin-demo/library');
    assert.equal(admin.response.status, 200);
    assert.deepEqual(admin.body, { userId: 'admin-demo', items: [] });

    const missing = await jsonRequest(baseUrl, '/api/users/unknown/library');
    assert.equal(missing.response.status, 404);
    assert.equal(missing.body.error.code, 'USER_NOT_FOUND');

    const invalid = await jsonRequest(baseUrl, '/api/users/%ZZ/library');
    assert.equal(invalid.response.status, 400);
    assert.equal(invalid.body.error.code, 'INVALID_USER_ID');
  });
});

test('POST /api/payments cria pagamento aprovado e biblioteca em transação', async () => {
  await withApi(async ({ application, baseUrl }) => {
    application.database.exec(`
      DELETE FROM chave_ativacao;
      DELETE FROM item_biblioteca;
      DELETE FROM pagamento;
    `);

    const result = await jsonRequest(baseUrl, '/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pedidoId: 'pedido-demo-001' }),
    });

    assert.equal(result.response.status, 201);
    assert.equal(result.body.mode, 'simulated');
    assert.equal(result.body.pedidoId, 'pedido-demo-001');
    assert.equal(result.body.status, 'APROVADO');
    assert.equal(result.body.valorCentavos, 10480);
    assert.match(result.body.referencia, /^FICTICIA-SIMULADA-/);
    assert.equal(application.database.prepare('SELECT COUNT(*) AS total FROM pagamento').get().total, 1);
    assert.equal(application.database.prepare('SELECT COUNT(*) AS total FROM item_biblioteca').get().total, 2);
    assert.equal(application.database.prepare('SELECT COUNT(*) AS total FROM chave_ativacao').get().total, 2);
    assert.deepEqual(application.database.prepare('PRAGMA foreign_key_check').all(), []);
  });
});

test('POST /api/payments é idempotente por pedido e reutiliza o estado persistido', async () => {
  await withApi(async ({ application, baseUrl }) => {
    application.database.exec(`
      DELETE FROM chave_ativacao;
      DELETE FROM item_biblioteca;
      DELETE FROM pagamento;
    `);
    const request = () => jsonRequest(baseUrl, '/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pedidoId: 'pedido-demo-001' }),
    });

    const first = await request();
    const second = await request();
    assert.equal(first.response.status, 201);
    assert.equal(second.response.status, 200);
    assert.deepEqual(second.body, first.body);
    assert.equal(application.database.prepare('SELECT COUNT(*) AS total FROM pagamento').get().total, 1);
    assert.equal(application.database.prepare('SELECT COUNT(*) AS total FROM item_biblioteca').get().total, 2);
    assert.equal(application.database.prepare('SELECT COUNT(*) AS total FROM chave_ativacao').get().total, 2);
  });
});

test('POST /api/payments rejeita pedidos inexistentes, vazios e com total divergente', async () => {
  await withApi(async ({ application, baseUrl }) => {
    application.database.exec(`
      INSERT INTO pedido (id, usuario_id, total_centavos)
      VALUES ('pedido-vazio', 'admin-demo', 100);
      INSERT INTO pedido (id, usuario_id, total_centavos)
      VALUES ('pedido-divergente', 'admin-demo', 100);
      INSERT INTO item_pedido (id, pedido_id, produto_id, preco_unitario_centavos)
      VALUES ('item-divergente', 'pedido-divergente', 'orbit-raiders', 200);
    `);
    const post = (pedidoId) => jsonRequest(baseUrl, '/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pedidoId }),
    });

    const missing = await post('nao-existe');
    const empty = await post('pedido-vazio');
    const mismatch = await post('pedido-divergente');
    assert.equal(missing.response.status, 404);
    assert.equal(missing.body.error.code, 'PEDIDO_NOT_FOUND');
    assert.equal(empty.response.status, 409);
    assert.equal(empty.body.error.code, 'EMPTY_ORDER');
    assert.equal(mismatch.response.status, 409);
    assert.equal(mismatch.body.error.code, 'ORDER_TOTAL_MISMATCH');
  });
});

test('falha do gateway executa rollback sem pagamento, biblioteca ou chave parcial', async () => {
  const failingGateway = { createPayment() { throw new Error('falha controlada de teste'); } };
  await withApi(async ({ application, baseUrl }) => {
    application.database.exec(`
      INSERT INTO pedido (id, usuario_id, total_centavos)
      VALUES ('pedido-rollback', 'admin-demo', 7990);
      INSERT INTO item_pedido (id, pedido_id, produto_id, preco_unitario_centavos)
      VALUES ('item-rollback', 'pedido-rollback', 'orbit-raiders', 7990);
    `);
    const result = await jsonRequest(baseUrl, '/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pedidoId: 'pedido-rollback' }),
    });
    assert.equal(result.response.status, 500);
    assert.deepEqual(result.body, {
      error: { code: 'INTERNAL_ERROR', message: 'Ocorreu um erro interno.' },
    });
    assert.equal(application.database.prepare("SELECT COUNT(*) AS total FROM pagamento WHERE pedido_id = 'pedido-rollback'").get().total, 0);
    assert.equal(application.database.prepare("SELECT COUNT(*) AS total FROM biblioteca WHERE usuario_id = 'admin-demo'").get().total, 0);
  }, { gateway: failingGateway });
});

test('contrato estrito rejeita JSON, mídia, campos extras e dados financeiros', async () => {
  await withApi(async ({ baseUrl, databasePath, logs }) => {
    const invalidJson = await jsonRequest(baseUrl, '/api/payments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{',
    });
    assert.equal(invalidJson.response.status, 400);
    assert.equal(invalidJson.body.error.code, 'INVALID_JSON');

    const missingBody = await jsonRequest(baseUrl, '/api/payments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
    });
    assert.equal(missingBody.body.error.code, 'INVALID_BODY');

    const missingId = await jsonRequest(baseUrl, '/api/payments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}',
    });
    assert.equal(missingId.body.error.code, 'INVALID_BODY');

    const invalidId = await jsonRequest(baseUrl, '/api/payments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pedidoId: '' }),
    });
    assert.equal(invalidId.body.error.code, 'INVALID_PEDIDO_ID');

    const unsupportedMedia = await jsonRequest(baseUrl, '/api/payments', {
      method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: '{}',
    });
    assert.equal(unsupportedMedia.response.status, 415);
    assert.equal(unsupportedMedia.body.error.code, 'UNSUPPORTED_MEDIA_TYPE');

    const unsupported = await jsonRequest(baseUrl, '/api/payments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pedidoId: 'pedido-demo-001', note: 'x' }),
    });
    assert.equal(unsupported.body.error.code, 'UNSUPPORTED_FIELD');

    const secretValue = '4111111111111111';
    const forbidden = await jsonRequest(baseUrl, '/api/payments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pedidoId: 'pedido-demo-001', cardNumber: secretValue }),
    });
    assert.equal(forbidden.body.error.code, 'FORBIDDEN_PAYMENT_DATA');
    assert.doesNotMatch(JSON.stringify(forbidden.body), new RegExp(secretValue));
    assert.doesNotMatch(JSON.stringify(logs), new RegExp(secretValue));
    assert.doesNotMatch(readFileSync(databasePath).toString('utf8'), new RegExp(secretValue));
  });
});

test('limite de corpo, rota inexistente e método incorreto usam erros estáveis', async () => {
  await withApi(async ({ baseUrl }) => {
    const tooLarge = await jsonRequest(baseUrl, '/api/payments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pedidoId: 'x'.repeat(17 * 1024) }),
    });
    assert.equal(tooLarge.response.status, 413);
    assert.equal(tooLarge.body.error.code, 'BODY_TOO_LARGE');

    const missingRoute = await jsonRequest(baseUrl, '/missing');
    assert.equal(missingRoute.response.status, 404);
    assert.equal(missingRoute.body.error.code, 'ROUTE_NOT_FOUND');

    const wrongMethod = await jsonRequest(baseUrl, '/health', { method: 'POST' });
    assert.equal(wrongMethod.response.status, 405);
    assert.equal(wrongMethod.response.headers.get('allow'), 'GET');
    assert.equal(wrongMethod.body.error.code, 'METHOD_NOT_ALLOWED');
  });
});

test('modo mercadopago permanece observável e falha 503 sem fallback', async () => {
  await withApi(async ({ baseUrl }) => {
    const health = await jsonRequest(baseUrl, '/health');
    assert.deepEqual(health.body, {
      status: 'ok',
      paymentMode: 'mercadopago',
      paymentAvailable: false,
    });

    const payment = await jsonRequest(baseUrl, '/api/payments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pedidoId: 'pedido-demo-001' }),
    });
    assert.equal(payment.response.status, 503);
    assert.equal(payment.body.error.code, 'PAYMENT_MODE_NOT_IMPLEMENTED');
    assert.doesNotMatch(JSON.stringify(payment.body), /FICTICIA-SIMULADA/);
  }, { paymentMode: 'mercadopago' });
});

test('pagamento persistido com valor divergente é rejeitado', async () => {
  await withApi(async ({ application, baseUrl }) => {
    application.database.prepare(`
      UPDATE pagamento SET valor_centavos = ? WHERE pedido_id = ?
    `).run(1, 'pedido-demo-001');
    const result = await jsonRequest(baseUrl, '/api/payments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pedidoId: 'pedido-demo-001' }),
    });
    assert.equal(result.response.status, 409);
    assert.equal(result.body.error.code, 'PAYMENT_VALUE_MISMATCH');
  });
});

test('configuração inválida e banco ausente impedem inicialização', () => {
  assert.throws(() => loadConfig({ API_PORT: 'abc' }), /API_PORT/);
  assert.throws(() => loadConfig({ PAYMENT_MODE: 'unknown' }), /PAYMENT_MODE/);
  assert.throws(
    () => createApplication({ databasePath: join(tmpdir(), `missing-${Date.now()}.sqlite`) }),
    /Banco local não encontrado/,
  );
});

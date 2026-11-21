import assert from 'node:assert/strict';
import test from 'node:test';
import { mapCheckout, validCheckoutUrl } from '../src/integrations/checkoutClient.mjs';
import { sanitizeVault } from '../src/persistence/vault.mjs';
import { makeJsonExport } from '../src/domain/jsonExport.mjs';
import { createCatalogSession, createSessionRequest } from '../src/integrations/catalogSession.mjs';

const item = { id: 'game', name: 'Jogo', type: 'JOGO', priceCents: 500, description: 'Teste', activationStore: { name: 'Loja' }, cloudPlatforms: [{ name: 'Cloud' }] };
const checkout = { id: 'checkout-client-0001', orderId: 'order', environment: 'test', mode: 'mercadopago', status: 'PENDENTE', items: [item], totalCents: 500, checkoutUrl: 'https://www.mercadopago.com.br/checkout/test' };

test('cliente rejeita resumo/URL inválido e não infere aprovação do retorno do navegador', () => {
  for (const bad of [{ totalCents: 1 }, { status: 'approved' }, { environment: 'production' }, { checkoutUrl: 'https://evil.example' }, { items: [] }]) assert.throws(() => mapCheckout({ ...checkout, ...bad }));
  assert.equal(mapCheckout(checkout).status, 'PENDENTE');
  assert.equal(validCheckoutUrl('https://user:pass@www.mercadopago.com.br/'), false);
});

test('snapshot retoma referência por conta, exclui credenciais/URL e exporta aquisição de teste honestamente', () => {
  const product = mapCheckout(checkout).items[0];
  const snapshot = sanitizeVault({ version: 2, catalog: [product], catalogDirty: false, outbox: [], users: {
    player: { cart: [product], library: [], remoteLibrary: [product], order: { id: 'order', items: [product], mode: 'mercadopago-test' },
      remoteCheckout: { id: checkout.id, productIds: ['game'], token: 'SECRET', checkoutUrl: checkout.checkoutUrl } },
    other: { cart: [], library: [], order: null },
  } });
  assert.deepEqual(snapshot.users.player.remoteCheckout, { id: checkout.id, productIds: ['game'] });
  assert.equal(snapshot.users.other.remoteCheckout, undefined);
  assert.doesNotMatch(JSON.stringify(snapshot), /SECRET|checkoutUrl/);
  const exported = JSON.parse(makeJsonExport(snapshot, 'player').content);
  assert.equal(exported.biblioteca.length, 1); assert.equal(exported.pedido.simulado, false); assert.equal(exported.pedido.ambiente, 'teste');
  assert.doesNotMatch(JSON.stringify(exported), /remoteCheckout|checkoutUrl|productIds/);
});

test('troca de sessão invalida resultado remoto capturado antes do logout, inclusive mesmo usuário', async () => {
  const session = createCatalogSession(async (path) => path === '/api/sessions' ? { token: 'a'.repeat(64), user: { id: 'player', role: 'player' } } : {});
  await session.login('fixture', 'fixture');
  let finish;
  const request = createSessionRequest(session, () => new Promise((resolve) => { finish = resolve; }));
  const result = request('player', '/api/checkouts');
  session.logout(); await session.login('fixture', 'fixture'); finish();
  await assert.rejects(result, (error) => error.cancelled === true);
  await assert.rejects(request('other', '/api/me/library'), /Entre novamente/);
  let rejectDelayed;
  const failureRequest = createSessionRequest(session, () => new Promise((_resolve, reject) => { rejectDelayed = reject; }));
  const failed = failureRequest('player', '/api/checkouts');
  session.logout(); await session.login('fixture', 'fixture'); rejectDelayed(new Error('Erro da sessão anterior.'));
  await assert.rejects(failed, (error) => error.cancelled === true);
});

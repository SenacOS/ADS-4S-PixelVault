import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { createApplication } from '../server/app.mjs';
import { demoPasswordHash } from '../server/catalog-service.mjs';
import { initializeDatabase } from '../scripts/init-db.mjs';
import { catalogRequest, fetchCatalog, toApiProduct } from '../src/integrations/catalogApi.mjs';
import { createBrowserStorage } from '../src/persistence/vaultStorage.mjs';
import { createVault } from '../src/persistence/vault.mjs';
import { createCatalogSession } from '../src/integrations/catalogSession.mjs';

const demo = { id: 'sync-game', name: 'Jogo sincronizado', type: 'Jogo', price: 12.5, description: 'Teste', activationStore: 'Loja teste', compatibleWith: ['GeForce NOW'] };

test('cliente não arredonda silenciosamente preços inválidos de cache ou fila antiga', () => {
  for (const price of [1.005, 0, 1000000.01, Infinity]) assert.throws(() => toApiProduct({ ...demo, price }), /Preço inválido/);
  assert.equal(toApiProduct({ ...demo, price: 0.1 + 0.2 }).priceCents, 30);
});
const memoryStorage = () => { const values = new Map(); return createBrowserStorage({ getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }); };

async function fixture(run) {
  const directory = mkdtempSync(join(tmpdir(), 'pixelvault-sync-'));
  const databasePath = join(directory, 'server.sqlite');
  initializeDatabase(databasePath);
  let app;
  async function start() {
    app = createApplication({ databasePath, logger: {} });
    const address = await app.listen();
    return `http://127.0.0.1:${address.port}`;
  }
  try {
    const url = await start();
    const session = await catalogRequest(url, '/api/sessions', { method: 'POST', body: { email: 'admin@pixelvault.example', password: 'demo123' } });
    const request = (path, options) => catalogRequest(url, path, { ...options, token: session.token });
    await run({ url, request, session, database: app.database, getDatabase: () => app.database, async restart() { await app.close(); return start(); } });
  } finally { await app?.close(); rmSync(directory, { recursive: true, force: true }); }
}

test('REST CRUD autorizado, compatibilidades e exclusão idempotente', async () => {
  await fixture(async ({ url, request, database }) => {
    const body = { operationId: 'create-1', product: toApiProduct(demo) };
    await assert.rejects(catalogRequest(url, '/api/products', { method: 'POST', body }), (error) => error.status === 401);
    const player = await catalogRequest(url, '/api/sessions', { method: 'POST', body: { email: 'jogador@pixelvault.example', password: 'demo123' } });
    await assert.rejects(catalogRequest(url, '/api/products', { method: 'POST', body, token: player.token }), (error) => error.status === 403);
    const first = await request('/api/products', { method: 'POST', body });
    assert.deepEqual(await request('/api/products', { method: 'POST', body }), first);
    assert.equal((await request(`/api/products/${demo.id}`)).product.name, demo.name);
    const updated = await request(`/api/products/${demo.id}`, { method: 'PUT', body: { operationId: 'update-1', baseRevision: first.product.revision,
      product: toApiProduct({ ...demo, name: 'Alterado', compatibleWith: ['Boosteroid'] }) } });
    assert.notEqual(updated.product.revision, first.product.revision);
    assert.equal(updated.product.cloudPlatforms[0].name, 'Boosteroid');
    const removal = { method: 'DELETE', body: { operationId: 'delete-1', baseRevision: updated.product.revision } };
    await request(`/api/products/${demo.id}`, removal);
    await request(`/api/products/${demo.id}`, removal);
    await assert.rejects(request(`/api/products/${demo.id}`), (error) => error.status === 404);
    assert.deepEqual(database.prepare('PRAGMA foreign_key_check').all(), []);
    assert.equal(database.prepare('SELECT count(*) AS n FROM catalog_operation').get().n, 3);
  });
});

test('descrição multilinha do formulário é aceita, mantendo rejeição de controle inválido', async () => {
  await fixture(async ({ request }) => {
    const description = 'Primeira linha\nSegunda linha';
    const result = await request('/api/products', { method: 'POST', body: { operationId: 'multiline', product: toApiProduct({ ...demo, description }) } });
    assert.equal(result.product.description, description);
    await assert.rejects(request('/api/products', { method: 'POST', body: { operationId: 'control-invalid', product: toApiProduct({ ...demo, id: 'control-invalid', description: 'Texto\u0000inválido' }) } }), (error) => error.status === 400);
  });
});

test('conflitos, payload inválido e histórico preservam banco e compatibilidades', async () => {
  await fixture(async ({ request, database }) => {
    const first = await request('/api/products', { method: 'POST', body: { operationId: 'create-2', product: toApiProduct(demo) } });
    await assert.rejects(request(`/api/products/${demo.id}`, { method: 'PUT', body: { operationId: 'bad-platform', baseRevision: first.product.revision,
      product: toApiProduct({ ...demo, compatibleWith: ['Inexistente'], activationStore: 'Nao deve criar' }) } }), (error) => error.status === 400);
    assert.equal(database.prepare("SELECT COUNT(*) AS n FROM loja_ativacao WHERE nome = 'Nao deve criar'").get().n, 0);
    const second = await request(`/api/products/${demo.id}`, { method: 'PUT', body: { operationId: 'update-2', baseRevision: first.product.revision, product: toApiProduct({ ...demo, name: 'Mudou' }) } });
    await assert.rejects(request(`/api/products/${demo.id}`, { method: 'PUT', body: { operationId: 'stale', baseRevision: first.product.revision, product: toApiProduct(demo) } }), (error) => error.code === 'REVISION_CONFLICT');
    await assert.rejects(request('/api/products', { method: 'POST', body: { operationId: 'create-2', product: toApiProduct({ ...demo, name: 'Diferente' }) } }), (error) => error.code === 'OPERATION_REUSED');
    assert.equal((await request(`/api/products/${demo.id}`)).product.revision, second.product.revision);
    const orbit = (await request('/api/products/orbit-raiders')).product;
    await assert.rejects(request('/api/products/orbit-raiders', { method: 'DELETE', body: { operationId: 'history', baseRevision: orbit.revision } }), (error) => error.code === 'PRODUCT_IN_USE');
    assert.equal((await request('/api/products/orbit-raiders')).product.cloudPlatforms.length, 2);
  });
});

test('recibo persiste após reinício; sessão é revogada e hash demo é verificável', async () => {
  await fixture(async ({ url, request, database, restart, session }) => {
    await assert.rejects(catalogRequest(url, '/api/sessions', { method: 'POST', body: { email: session.user.email, password: 'errada' } }), (error) => error.status === 401);
    const encoded = database.prepare("SELECT senha_hash FROM usuario WHERE id = 'admin-demo'").get().senha_hash;
    assert.match(encoded, /^scrypt:/);
    const body = { operationId: 'restart-create', product: toApiProduct(demo) };
    const first = await request('/api/products', { method: 'POST', body });
    const nextUrl = await restart();
    await assert.rejects(catalogRequest(nextUrl, '/api/products', { method: 'POST', body, token: session.token }), (error) => error.status === 401);
    const next = await catalogRequest(nextUrl, '/api/sessions', { method: 'POST', body: { email: session.user.email, password: 'demo123' } });
    assert.deepEqual(await catalogRequest(nextUrl, '/api/products', { method: 'POST', body, token: next.token }), first);
    await catalogRequest(nextUrl, '/api/sessions/current', { method: 'DELETE', token: next.token });
    await assert.rejects(catalogRequest(nextUrl, '/api/products', { method: 'POST', body, token: next.token }), (error) => error.status === 401);
    const preflight = await fetch(`${nextUrl}/api/products`, { method: 'OPTIONS', headers: { Origin: 'http://127.0.0.1:8097', 'Access-Control-Request-Headers': 'Authorization, Content-Type' } });
    assert.equal(preflight.status, 204);
    const blocked = await fetch(`${nextUrl}/api/sessions`, { method: 'OPTIONS', headers: { Origin: 'https://untrusted.example' } });
    assert.equal(blocked.status, 403);
  });
});

test('outbox durável retoma resposta perdida sem duplicação e ordena create/update/delete', async () => {
  await fixture(async ({ request }) => {
    const storage = memoryStorage();
    let vault = createVault({ storage, initialProducts: [] });
    await vault.load();
    await vault.changeCatalog('POST', demo.id, demo, 'admin-demo');
    await vault.changeCatalog('PUT', demo.id, { ...demo, name: 'Editado offline' }, 'admin-demo');
    let dropped = false;
    await assert.rejects(vault.synchronize(async (path, options) => {
      const response = await request(path, options);
      if (options?.method === 'POST' && !dropped) { dropped = true; throw new Error('Resposta perdida'); }
      return response;
    }, 'admin-demo'), /perdida/);
    assert.equal((await storage.load()).outbox.length, 2);
    await vault.dispose();
    vault = createVault({ storage, initialProducts: [] });
    await vault.load();
    await vault.synchronize(request, 'admin-demo');
    assert.equal((await storage.load()).outbox.length, 0);
    assert.equal((await request(`/api/products/${demo.id}`)).product.name, 'Editado offline');
    await vault.changeCatalog('DELETE', demo.id, null, 'admin-demo');
    await vault.synchronize(request, 'admin-demo');
    await assert.rejects(request(`/api/products/${demo.id}`), (error) => error.status === 404);
    assert.deepEqual((await storage.load()).catalog.map((item) => item.id), (await request('/api/products')).products.map(item=>item.id));
    assert.equal((await storage.load()).catalog.length, 32);
  });
});

test('edição durante HTTP permanece na fila e revisão é encadeada', async () => {
  await fixture(async ({ request }) => {
    const storage = memoryStorage();
    const vault = createVault({ storage, initialProducts: [] });
    await vault.load();
    await vault.changeCatalog('POST', demo.id, demo, 'admin-demo');
    let edited = false;
    await vault.synchronize(async (path, options) => {
      const response = await request(path, options);
      if (options?.method === 'POST' && !edited) {
        edited = true;
        await vault.changeCatalog('PUT', demo.id, { ...demo, name: 'Durante envio' }, 'admin-demo');
      }
      return response;
    }, 'admin-demo');
    assert.equal((await request(`/api/products/${demo.id}`)).product.name, 'Durante envio');
    assert.equal((await storage.load()).outbox.length, 0);
  });
});

test('conflito não apaga fila; descarte explícito recupera servidor e preserva usuário', async () => {
  await fixture(async ({ url, request }) => {
    const storage = memoryStorage();
    const vault = createVault({ storage, initialProducts: [] });
    await vault.load();
    await vault.changeCatalog('POST', demo.id, demo, 'admin-demo');
    await vault.synchronize(request, 'admin-demo');
    const original = (await storage.load()).catalog.find((item) => item.id === demo.id);
    await request(`/api/products/${demo.id}`, { method: 'PUT', body: { operationId: 'other-device', baseRevision: original.revision, product: toApiProduct({ ...demo, name: 'Outro aparelho' }) } });
    await vault.changeCatalog('PUT', demo.id, { ...original, name: 'Meu aparelho' }, 'admin-demo');
    await assert.rejects(vault.synchronize(request, 'admin-demo'), (error) => error.status === 409);
    assert.equal((await storage.load()).outbox.length, 1);
    await vault.update((value) => ({ ...value, users: { player: { cart: [demo], library: [], order: null } } }));
    await vault.discardCatalog(() => fetchCatalog(url));
    const restored = await storage.load();
    assert.equal(restored.catalog.find((item) => item.id === demo.id).name, 'Outro aparelho');
    assert.equal(restored.outbox.length, 0);
    assert.equal(restored.users.player.cart.length, 1);
  });
});

test('migração 3.1 preserva catálogo antigo sem inferir exclusões; novas operações sem segredos', async () => {
  const storage = memoryStorage();
  await storage.save({ version: 1, catalog: [demo], catalogDirty: true, users: {} });
  const vault = createVault({ storage, initialProducts: [] });
  await vault.load();
  assert.equal((await storage.load()).version, 2);
  await assert.rejects(vault.synchronize(() => { throw new Error('não deve enviar'); }, 'admin-demo'), /antigo/);
  assert.equal((await storage.load()).catalog[0].name, demo.name);
  await vault.discardCatalog(async () => []);
  await vault.changeCatalog('POST', demo.id, { ...demo, password: 'SECRET', token: 'SECRET' }, 'admin-demo');
  assert.doesNotMatch(JSON.stringify(await storage.load()), /SECRET|password|token/);
  await assert.rejects(vault.synchronize(async () => ({}), 'player-demo'), /conta administrativa/);
});

test('ACK inválido e falha local após sucesso remoto preservam fila e permitem replay', async () => {
  await fixture(async ({ request }) => {
    const base = memoryStorage();
    let failSave = false;
    const storage = { ...base, async save(value) { if (failSave) throw new Error('Disco indisponível'); await base.save(value); } };
    const vault = createVault({ storage, initialProducts: [] });
    await vault.load();
    await vault.changeCatalog('POST', demo.id, demo, 'admin-demo');
    await vault.changeCatalog('PUT', demo.id, { ...demo, name: 'Segunda' }, 'admin-demo');
    await vault.changeCatalog('PUT', demo.id, { ...demo, name: 'Terceira' }, 'admin-demo');
    await assert.rejects(vault.synchronize(async () => ({}), 'admin-demo'));
    assert.equal((await base.load()).outbox.length, 3);
    await assert.rejects(vault.synchronize(async (path, options) => { const result = await request(path, options); failSave = true; return result; }, 'admin-demo'), /Disco/);
    assert.equal((await base.load()).outbox.length, 3);
    failSave = false;
    await vault.synchronize(request, 'admin-demo');
    assert.equal((await request(`/api/products/${demo.id}`)).product.name, 'Terceira');
    await vault.changeCatalog('DELETE', demo.id, null, 'admin-demo');
    await assert.rejects(vault.synchronize(async () => ({ deleted: 'outro' }), 'admin-demo'), /inválida/);
    assert.equal((await base.load()).outbox.length, 1);
    await vault.synchronize(request, 'admin-demo');
  });
});

test('atualização remota atrasada não esconde alteração nova nem descarte concorrente', async () => {
  const storage = memoryStorage();
  const vault = createVault({ storage, initialProducts: [] });
  await vault.load();
  const result = await vault.synchronize(async () => {
    await vault.changeCatalog('POST', demo.id, demo, 'admin-demo');
    return { products: [] };
  }, 'admin-demo');
  assert.equal(result, false);
  await assert.rejects(vault.discardCatalog(async () => {
    await vault.changeCatalog('PUT', demo.id, { ...demo, name: 'Alteração recente' }, 'admin-demo');
    return [];
  }), /outra alteração/);
  assert.equal((await storage.load()).catalog[0].name, 'Alteração recente');
  assert.equal((await storage.load()).outbox.length, 2);
});

test('login atrasado após logout é cancelado e resposta inválida não libera sessão', async () => {
  let release;
  let revoked = false;
  const session = createCatalogSession(async (path) => {
    if (path.endsWith('/current')) { revoked = true; return {}; }
    return new Promise((resolve) => { release = resolve; });
  });
  const pending = session.login('admin@pixelvault.example', 'demo123');
  session.logout();
  release({ token: 'a'.repeat(64), user: { id: 'admin-demo', role: 'admin' } });
  await assert.rejects(pending, (error) => error.cancelled);
  assert.equal(session.current, null);
  assert.equal(revoked, true);
  const invalid = createCatalogSession(async () => ({}));
  await assert.rejects(invalid.login('x', 'x'), (error) => error.status === 502);
  assert.equal(invalid.current, null);
  await assert.rejects(catalogRequest('http://local', '/api/sessions', { fetchImpl: async () => ({ ok: false, status: 401, json() { throw new SyntaxError('malformed'); } }) }), (error) => error.status === 401);
});

test('migração de credenciais atualiza apenas marcadores antigos e preserva hash customizado', async () => {
  await fixture(async ({ database, restart, getDatabase }) => {
    const custom = demoPasswordHash('custom-admin');
    database.prepare("UPDATE usuario SET senha_hash = ? WHERE id = 'admin-demo'").run(custom);
    database.prepare("UPDATE usuario SET senha_hash = 'HASH-FICTICIO-NAO-AUTENTICAVEL-PLAYER' WHERE id = 'player-demo'").run();
    const url = await restart();
    assert.equal(getDatabase().prepare("SELECT senha_hash FROM usuario WHERE id = 'admin-demo'").get().senha_hash, custom);
    const player = await catalogRequest(url, '/api/sessions', { method: 'POST', body: { email: 'jogador@pixelvault.example', password: 'demo123' } });
    assert.equal(player.user.role, 'player');
  });
});

test('leitura iniciada antes do CRUD não sobrescreve catálogo depois do ACK', async () => {
  await fixture(async ({ request }) => {
    const storage = memoryStorage();
    const vault = createVault({ storage, initialProducts: [] });
    await vault.load();
    let release;
    const stale = vault.refresh(() => new Promise((resolve) => { release = resolve; }));
    await vault.changeCatalog('POST', demo.id, demo, 'admin-demo');
    await vault.synchronize(request, 'admin-demo');
    release([]);
    assert.equal(await stale, false);
    assert.equal((await storage.load()).catalog.some((item) => item.id === demo.id), true);
  });
});

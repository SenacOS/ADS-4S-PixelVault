import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';

import { createApplication } from '../server/app.mjs';
import { initializeDatabase } from '../scripts/init-db.mjs';
import { fetchCatalog, mapApiProducts } from '../src/integrations/catalogApi.mjs';
import { createVault, userData } from '../src/persistence/vault.mjs';
import { createBrowserStorage, createSQLiteStorage } from '../src/persistence/vaultStorage.mjs';

const product = { id: 'game', name: 'Jogo', type: 'Jogo', price: 79.9, description: 'Demo', activationStore: 'Loja', compatibleWith: ['Cloud'], activationKey: 'FICTICIA' };
const apiBody = { products: [{ id: 'remote', name: 'Remoto', type: 'JOGO', priceCents: 7990, description: 'Demo API', activationStore: { id: 'store', name: 'Loja API' }, cloudPlatforms: [{ id: 'cloud', name: 'Cloud API' }] }] };

function browserStorage() {
  const values = new Map();
  return createBrowserStorage({ getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) });
}

// Exercise the same SQL and async interface as expo-sqlite on a real SQLite file.
function sqliteStorage(path) {
  const db = new DatabaseSync(path);
  return { db, storage: createSQLiteStorage({
    async execAsync(sql) { db.exec(sql); },
    async getFirstAsync(sql) { return db.prepare(sql).get() ?? null; },
    async runAsync(sql, ...params) { return db.prepare(sql).run(...params); },
  }) };
}

test('SQLite móvel: reabre arquivo, preserva compatibilidades e separa contas', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'pixelvault-mobile-'));
  let db;
  try {
    const path = join(directory, 'mobile.sqlite');
    let opened = sqliteStorage(path);
    db = opened.db;
    const vault = createVault({ storage: opened.storage, initialProducts: [product] });
    await vault.load();
    await vault.update((value) => ({ ...value, catalogDirty: true, users: {
      player: { cart: [product], library: [product], order: { id: 'demo', items: [product] } },
      admin: { cart: [], library: [], order: null },
    } }));
    db.close();
    opened = sqliteStorage(path);
    db = opened.db;
    const restored = await createVault({ storage: opened.storage, initialProducts: [] }).load();
    assert.deepEqual(restored.catalog[0].compatibleWith, ['Cloud']);
    assert.equal(userData(restored, 'player').order.total, 79.9);
    assert.equal(userData(restored, 'player').library.length, 1);
    assert.deepEqual(userData(restored, 'admin').cart, []);
    assert.deepEqual(userData(restored, 'unknown').library, []);
    assert.equal(restored.catalogDirty, true);
  } finally {
    db?.close();
    rmSync(directory, { recursive: true, force: true });
  }
});

test('web: catálogo vazio é restaurado sem reinstalar a seed', async () => {
  const storage = browserStorage();
  const vault = createVault({ storage, initialProducts: [product] });
  await vault.load();
  await vault.update((value) => ({ ...value, catalog: [], catalogDirty: true }));
  const restored = await createVault({ storage, initialProducts: [product] }).load();
  assert.deepEqual(restored.catalog, []);
});

test('persistência usa lista de campos permitidos e exclui formulários/segredos', async () => {
  const storage = browserStorage();
  const vault = createVault({ storage, initialProducts: [product] });
  await vault.load();
  await vault.update((value) => ({ ...value, password: 'SECRET', token: 'SECRET', checkoutForm: { cardNumber: 'SECRET' }, users: {
    player: { password: 'SECRET', cart: [{ ...product, cvv: 'SECRET' }], library: [], order: { id: 'demo', items: [product], printedName: 'SECRET' } },
  } }));
  assert.doesNotMatch(JSON.stringify(await storage.load()), /SECRET|password|token|cardNumber|cvv|printedName/);
});

test('escritas concorrentes mantêm ordem e uma falha não publica sucesso', async () => {
  const base = browserStorage();
  let fail = false;
  const seen = [];
  const vault = createVault({ storage: { ...base, async save(value) { if (fail) throw new Error('disk full'); await base.save(value); } }, initialProducts: [], onChange: (value) => seen.push(value) });
  await assert.rejects(vault.update((value) => value), /Aguarde/);
  await vault.load();
  await Promise.all([
    vault.update((value) => ({ ...value, catalog: [product] })),
    vault.update((value) => ({ ...value, catalog: [...value.catalog, { ...product, id: 'second' }] })),
  ]);
  assert.equal((await base.load()).catalog.length, 2);
  fail = true;
  await assert.rejects(vault.update((value) => ({ ...value, catalog: [] })), /disk full/);
  assert.equal(seen.at(-1).catalog.length, 2);
  fail = false;
  await vault.update((value) => ({ ...value, catalogDirty: true }));
  assert.equal((await base.load()).catalog.length, 2);
});

test('leitura inválida ou versão futura não é sobrescrita', async () => {
  for (const payload of ['{', JSON.stringify({ version: 2 }), JSON.stringify({ version: 1, catalogDirty: false, catalog: null, users: {} })]) {
    let writes = 0;
    const storage = createBrowserStorage({ getItem: () => payload, setItem() { writes += 1; } });
    await assert.rejects(createVault({ storage, initialProducts: [] }).load());
    assert.equal(writes, 0);
  }
});

test('resposta remota atrasada preserva CRUD local ainda não enviado', async () => {
  const storage = browserStorage();
  const vault = createVault({ storage, initialProducts: [product] });
  await vault.load();
  let release;
  const pending = vault.refresh(() => new Promise((resolve) => { release = resolve; }));
  await vault.update((value) => ({ ...value, catalog: [], catalogDirty: true }));
  release(mapApiProducts(apiBody));
  assert.equal(await pending, false);
  assert.deepEqual((await storage.load()).catalog, []);
});

test('rede indisponível preserva catálogo e recuperação atualiza cache', async () => {
  const storage = browserStorage();
  const vault = createVault({ storage, initialProducts: [product] });
  await vault.load();
  await assert.rejects(vault.refresh(() => Promise.reject(new Error('offline'))));
  assert.equal((await storage.load()).catalog[0].id, 'game');
  assert.equal(await vault.refresh(async () => mapApiProducts(apiBody)), true);
  const restored = await createVault({ storage, initialProducts: [] }).load();
  assert.equal(restored.catalog[0].price, 79.9);
  assert.equal(restored.catalog[0].activationStore, 'Loja API');
  assert.deepEqual(restored.catalog[0].compatibleWith, ['Cloud API']);
});

test('resposta atrasada de instância desmontada não grava sobre uma nova sessão', async () => {
  const storage = browserStorage();
  const old = createVault({ storage, initialProducts: [product] });
  await old.load();
  let release;
  const pending = old.refresh(() => new Promise((resolve) => { release = resolve; }));
  old.dispose();
  const current = createVault({ storage, initialProducts: [] });
  await current.load();
  await current.update((value) => ({ ...value, catalog: [], catalogDirty: true }));
  release(mapApiProducts(apiBody));
  await assert.rejects(pending, /encerrado/);
  assert.deepEqual((await storage.load()).catalog, []);
});

test('encerramento é idempotente e aguarda a fila antes de fechar o driver', async () => {
  const base = browserStorage();
  let closes = 0;
  const vault = createVault({ storage: { ...base, async close() { closes += 1; } }, initialProducts: [] });
  await vault.load();
  const first = vault.dispose();
  assert.equal(vault.dispose(), first);
  await first;
  assert.equal(closes, 1);
  await assert.rejects(vault.update((value) => value), /encerrado/);
});

test('cliente trata HTTP, JSON, contrato inválido e timeout', async () => {
  await assert.rejects(fetchCatalog(''), /Configure/);
  await assert.rejects(fetchCatalog('http://local', { fetchImpl: async () => ({ ok: false }) }));
  await assert.rejects(fetchCatalog('http://local', { fetchImpl: async () => ({ ok: true, json() { throw new Error('JSON'); } }) }));
  assert.throws(() => mapApiProducts({ products: [{ ...apiBody.products[0], priceCents: 1.5 }] }));
  assert.throws(() => mapApiProducts({ products: [apiBody.products[0], apiBody.products[0]] }));
  assert.throws(() => mapApiProducts({ products: [{ ...apiBody.products[0], cloudPlatforms: [] }] }));
  await assert.rejects(fetchCatalog('http://local', { timeoutMs: 10, fetchImpl: (_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(new Error('timeout')), { once: true });
  }) }), /timeout/);
});

test('integração: cliente consulta API real e persiste catálogo no SQLite', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'pixelvault-catalog-sync-'));
  let application;
  let mobile;
  try {
    const serverPath = join(directory, 'server.sqlite');
    initializeDatabase(serverPath);
    application = createApplication({ databasePath: serverPath, logger: {} });
    const address = await application.listen();
    const url = `http://127.0.0.1:${address.port}`;
    mobile = sqliteStorage(join(directory, 'mobile.sqlite'));
    const vault = createVault({ storage: mobile.storage, initialProducts: [] });
    await vault.load();
    assert.equal(await vault.refresh(() => fetchCatalog(url)), true);
    const snapshot = await mobile.storage.load();
    assert.equal(snapshot.catalog.length, 32);
    assert.equal(snapshot.catalog.find((item) => item.id === 'orbit-raiders').price, 79.9);
    const response = await fetch(`${url}/api/products`, { headers: { Origin: 'http://localhost:8081' } });
    assert.equal(response.headers.get('access-control-allow-origin'), '*');
  } finally {
    await application?.close();
    mobile?.db.close();
    rmSync(directory, { recursive: true, force: true });
  }
});

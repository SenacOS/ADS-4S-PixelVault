import assert from 'node:assert/strict';
import test from 'node:test';

import { makeJsonExport, shareJsonFile } from '../src/domain/jsonExport.mjs';

const product = { id: 'jogo', name: 'Jogo teste', type: 'Jogo', price: 79.9, description: 'Demonstração', activationStore: 'Loja demo', compatibleWith: ['GeForce NOW', 'Boosteroid'], activationKey: 'CHAVE-EXCLUIR' };
const snapshot = () => ({ version: 2, catalog: [product], catalogDirty: false, legacyDirty: false, outbox: [], users: {} });
const date = new Date('2026-11-20T16:00:00.123Z');
const parse = (data, id = 'player') => JSON.parse(makeJsonExport(data, id, date).content);

test('JSON versionado preserva catálogo, centavos, loja e plataformas sem mutação', () => {
  const value = snapshot();
  const before = JSON.stringify(value);
  const artifact = makeJsonExport(value, 'player', date);
  assert.equal(artifact.name, 'pixelvault-dados-2026-11-20T16-00-00-123Z.json');
  const data = JSON.parse(artifact.content);
  assert.equal(data.formato, 'pixelvault-dados');
  assert.equal(data.versao, 1);
  assert.equal(data.geradoEm, date.toISOString());
  assert.equal(data.catalogo[0].precoCentavos, 7990);
  assert.deepEqual(data.catalogo[0].plataformasCloud, product.compatibleWith);
  assert.equal(data.catalogo[0].lojaAtivacao, 'Loja demo');
  assert.deepEqual(data.carrinho, []);
  assert.equal(data.pedido, null);
  assert.equal(data.origem, 'cache-local');
  assert.equal(JSON.stringify(value), before);
});

test('exporta só a conta selecionada e recalcula totais em centavos', () => {
  const value = snapshot();
  const otherProduct = { ...product, id: 'dlc', type: 'DLC', price: 24.9 };
  value.users = {
    player: { cart: [product, otherProduct], library: [product], order: { id: 'pedido-demo', items: [product, otherProduct], total: 0, quantity: 999 } },
    other: { cart: [{ ...product, name: 'OUTRA-CONTA' }], library: [], order: null },
  };
  const result = parse(value);
  assert.equal(result.totalCarrinhoCentavos, 10480);
  assert.equal(result.pedido.totalCentavos, 10480);
  assert.equal(result.pedido.quantidade, 2);
  assert.equal(result.pedido.simulado, true);
  assert.equal(result.biblioteca.length, 1);
  assert.doesNotMatch(JSON.stringify(result), /OUTRA-CONTA/);
  assert.equal(parse(value, 'other').carrinho[0].nome, 'OUTRA-CONTA');
  assert.deepEqual(JSON.parse(makeJsonExport(value, undefined, date).content).carrinho, []);
});

test('whitelist exclui credenciais, formulários, identidades, chaves e conteúdo da fila', () => {
  const value = snapshot();
  Object.assign(value, { password: 'SEGREDO', session: { token: 'SEGREDO' }, checkoutForm: { cardNumber: 'SEGREDO' } });
  value.catalog = [{ ...product, token: 'SEGREDO', cvv: 'SEGREDO' }];
  value.catalogDirty = true;
  value.outbox = [{ actorId: 'SEGREDO', product: { name: 'SEGREDO' } }];
  value.users.player = { email: 'SEGREDO', cart: [product], library: [product], order: { id: 'demo', items: [product], printedName: 'SEGREDO' } };
  const content = makeJsonExport(value, 'player', date).content;
  assert.doesNotMatch(content, /SEGREDO|CHAVE-EXCLUIR|password|token|cardNumber|printedName|activationKey|actorId/);
  const data = JSON.parse(content);
  assert.equal(data.sincronizacao.alteracoesPendentes, 1);
  assert.equal(data.sincronizacao.catalogoAlteradoLocalmente, true);
});

test('catálogo vazio, legado e valores decimais são representados corretamente', () => {
  const empty = snapshot();
  empty.catalog = [];
  assert.deepEqual(parse(empty).catalogo, []);
  const legacy = { ...snapshot(), version: 1, catalogDirty: true };
  assert.equal(parse(legacy).sincronizacao.legadoSemHistorico, true);
  assert.equal(parse(legacy).sincronizacao.alteracoesPendentes, 0);
  const decimal = snapshot();
  decimal.users.player = { cart: [{ ...product, price: 0.1 }, { ...product, id: 'two', price: 0.2 }], library: [], order: null };
  assert.equal(parse(decimal).totalCarrinhoCentavos, 30);
  decimal.catalog = [{ ...product, price: 0.1 + 0.2 }];
  assert.equal(parse(decimal).catalogo[0].precoCentavos, 30);
});

test('recusa dados monetários ou campos compostos inválidos antes de gerar arquivo', () => {
  for (const price of [NaN, Infinity, -1, Number.MAX_SAFE_INTEGER]) assert.throws(() => parse({ ...snapshot(), catalog: [{ ...product, price }] }));
  assert.throws(() => parse({ ...snapshot(), catalog: [{ ...product, description: { token: 'SEGREDO' } }] }));
  assert.throws(() => makeJsonExport(null, 'player'));
  assert.throws(() => makeJsonExport(snapshot(), 'player', new Date('invalid')));
  for (const price of [1.005, 1.001]) assert.throws(() => parse({ ...snapshot(), catalog: [{ ...product, price }] }), (error) => error.code === 'INVALID_EXPORT_PRICE');
});

test('entrega nativa verifica disponibilidade e usa MIME/UTI corretos sem afirmar envio', async () => {
  const artifact = makeJsonExport(snapshot(), 'player', date);
  let shared = false;
  await assert.rejects(shareJsonFile(artifact, { available: async () => false, write: () => { throw new Error('Não deve escrever'); }, share: () => {} }), /indisponível/);
  const message = await shareJsonFile(artifact, { available: async () => true,
    write(value) { assert.equal(value.content, artifact.content); return 'file:///cache/export.json'; },
    async share(uri, options) { shared = true; assert.equal(uri, 'file:///cache/export.json'); assert.equal(options.mimeType, 'application/json'); assert.equal(options.UTI, 'public.json'); },
  });
  assert.equal(shared, true);
  assert.match(message, /preparado/);
  assert.doesNotMatch(message, /enviado|salvo com sucesso/);
});

test('falha ao escrever ou compartilhar é propagada para feedback de erro', async () => {
  const artifact = makeJsonExport(snapshot(), 'player', date);
  let shared = false;
  await assert.rejects(shareJsonFile(artifact, { available: async () => true, write() { throw new Error('Sem espaço'); }, share() { shared = true; } }), /Sem espaço/);
  assert.equal(shared, false);
  await assert.rejects(shareJsonFile(artifact, { available: async () => true, write: () => 'file:///cache/export.json', share() { throw new Error('Falha do compartilhamento'); } }), /Falha do compartilhamento/);
});

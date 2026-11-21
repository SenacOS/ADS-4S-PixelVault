import assert from 'node:assert/strict';
import test from 'node:test';

import {
  addCartItem, addOrderToLibrary, authenticate, authenticateLocalPlayer, calculateTotal, createProduct,
  deleteProduct, filterProducts, parsePrice, removeCartItem, updateProduct,
  validateProductForm, validateRegistration, validateRequired,
} from '../src/domain/prototypeLogic.mjs';

const orbit = { id: 'orbit', name: 'Orbit Raiders', type: 'Jogo', price: 79.9, compatibleWith: ['GeForce NOW', 'Boosteroid'] };
const neon = { id: 'neon', name: 'Neon Expansion', type: 'DLC', price: 24.9, compatibleWith: ['GeForce NOW'] };
const products = [orbit, neon];

test('normaliza preços fictícios com vírgula ou ponto', () => {
  assert.equal(parsePrice('79,90'), 79.9);
  assert.equal(parsePrice('79.90'), 79.9);
  assert.equal(parsePrice('R$ 1.234,56'), 1234.56);
  assert.equal(parsePrice('0'), null);
});

test('filtra catálogo por cloud e preserva Todos', () => {
  assert.equal(filterProducts(products, 'Todos').length, 2);
  assert.deepEqual(filterProducts(products, 'Boosteroid').map(({ id }) => id), ['orbit']);
  assert.deepEqual(filterProducts([neon], 'Boosteroid'), []);
});

test('adiciona sem duplicar, remove e calcula total derivado', () => {
  const first = addCartItem([], orbit);
  const duplicate = addCartItem(first.items, orbit);
  const complete = addCartItem(duplicate.items, neon);
  assert.equal(first.added, true);
  assert.equal(duplicate.added, false);
  assert.strictEqual(duplicate.items, first.items);
  assert.equal(calculateTotal([]), 0);
  assert.equal(calculateTotal(first.items), 79.9);
  assert.equal(calculateTotal(complete.items), 104.8);
  assert.deepEqual(removeCartItem(complete.items, 'orbit').map(({ id }) => id), ['neon']);
  assert.deepEqual(removeCartItem([orbit], 'orbit'), []);
});

test('valida obrigatórios e autentica somente igualdade exata', () => {
  assert.deepEqual(validateRequired({ name: '  ', email: 'ok' }, ['name', 'email']), { name: 'Campo obrigatório.' });
  const accounts = [{ email: 'jogador@pixelvault.example', password: 'demo123', role: 'player' }];
  assert.equal(authenticate(accounts, ' jogador@pixelvault.example ', 'demo123')?.role, 'player');
  assert.equal(authenticate(accounts, 'jogador@pixelvault.example', 'Demo123'), null);
});

test('checkout aceita somente os dois campos preenchidos após trim', () => {
  assert.deepEqual(validateRequired({ cardNumber: '', printedName: ' Pessoa ' }, ['cardNumber', 'printedName']), { cardNumber: 'Campo obrigatório.' });
  assert.deepEqual(validateRequired({ cardNumber: '0000', printedName: 'Pessoa' }, ['cardNumber', 'printedName']), {});
});

test('valida formulário administrativo completo e preço positivo', () => {
  const valid = { name: 'Item', type: 'Jogo', price: '12,50', description: 'Teste', compatibleWith: ['Boosteroid'], activationStore: 'Loja fictícia' };
  assert.deepEqual(validateProductForm(valid), {});
  const errors = validateProductForm({ ...valid, type: 'Outro', price: '-1', compatibleWith: [] });
  assert.deepEqual(Object.keys(errors).sort(), ['compatibleWith', 'price', 'type']);
});

test('rejeita subcentavos e valores fora do contrato do servidor antes de salvar', () => {
  const form = { name: 'Item', type: 'Jogo', price: '12,50', description: 'Teste', compatibleWith: ['Boosteroid'], activationStore: 'Loja' };
  for (const price of ['1,005', '1000000,01']) assert.equal(typeof validateProductForm({ ...form, price }).price, 'string');
  assert.deepEqual(validateProductForm({ ...form, price: '1000000,00' }), {});
  for (const [field, count] of [['name', 201], ['activationStore', 201], ['description', 2001]]) assert.equal(typeof validateProductForm({ ...form, [field]: 'a'.repeat(count) })[field], 'string');
});

test('cadastro rejeita e-mail repetido normalizado sem alterar a exigência de senha exata', () => {
  const accounts = [{ email: 'jogador@pixelvault.example', password: 'demo123' }];
  assert.equal(validateRegistration(accounts, { name: 'Outro', email: ' JOGADOR@PIXELVAULT.EXAMPLE ', password: 'outra456' }).email, 'E-mail já cadastrado.');
  assert.deepEqual(validateRegistration(accounts, { name: 'Novo', email: 'novo@pixelvault.example', password: 'demo456' }), {});
  assert.equal(authenticate(accounts, ' JOGADOR@PIXELVAULT.EXAMPLE ', 'demo123')?.email, accounts[0].email);
  assert.equal(authenticate(accounts, accounts[0].email, 'Demo123'), null);
});

test('perfil local reconhece apenas jogador cadastrado nesta sessão, nunca admin ou seed', () => {
  const local = { id: 'registered-1', role: 'player', email: 'local@pixelvault.example', password: 'demo456' };
  assert.equal(authenticateLocalPlayer([local], ' LOCAL@PIXELVAULT.EXAMPLE ', 'demo456'), local);
  assert.equal(authenticateLocalPlayer([local], local.email, 'Demo456'), null);
  assert.equal(authenticateLocalPlayer([{ ...local, role: 'admin' }], local.email, local.password), null);
  assert.equal(authenticateLocalPlayer([{ ...local, id: 'player-demo' }], local.email, local.password), null);
});

test('CRUD local cria, edita e exclui sem mutar lista anterior', () => {
  const form = { name: 'Item', type: 'DLC', price: '10,50', description: 'Teste', compatibleWith: ['GeForce NOW'], activationStore: 'Loja fictícia' };
  const created = createProduct(products, form, 'local-1');
  assert.equal(products.length, 2);
  assert.equal(created[2].price, 10.5);
  assert.equal(created[2].priceLabel, 'R$ 10,50');
  const updated = updateProduct(created, 'local-1', { ...form, name: 'Item editado', price: '11' });
  assert.equal(created[2].name, 'Item');
  assert.equal(updated[2].name, 'Item editado');
  assert.deepEqual(deleteProduct(updated, 'local-1').map(({ id }) => id), ['orbit', 'neon']);
});

test('biblioteca inclui pedido de dois itens de forma idempotente', () => {
  const order = { id: 'pedido-1', items: products };
  const once = addOrderToLibrary([], order);
  const twice = addOrderToLibrary(once, order);
  assert.equal(once.length, 2);
  assert.equal(twice.length, 2);
  assert.deepEqual(twice.map(({ id }) => id), ['orbit', 'neon']);
});

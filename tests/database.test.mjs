import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';

import { initializeDatabase } from '../scripts/init-db.mjs';

const expectedTables = [
  'biblioteca', 'carrinho', 'chave_ativacao', 'compatibilidade_produto',
  'item_biblioteca', 'item_carrinho', 'item_pedido', 'loja_ativacao',
  'pagamento', 'pedido', 'plataforma_cloud', 'produto', 'usuario',
];

function withDatabase(run) {
  const temporaryDirectory = mkdtempSync(join(tmpdir(), 'pixelvault-db-test-'));
  const databasePath = join(temporaryDirectory, 'test.sqlite');
  initializeDatabase(databasePath);
  const database = new DatabaseSync(databasePath);
  database.exec('PRAGMA foreign_keys = ON;');

  try {
    return run(database);
  } finally {
    database.close();
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}

function rows(database, sql) {
  return database.prepare(sql).all().map((row) => ({ ...row }));
}

function expectConstraint(database, sql, pattern) {
  assert.throws(() => database.exec(sql), pattern);
}

test('cria exatamente as 13 tabelas e uma seed sem violações de FK', () => {
  withDatabase((database) => {
    const tables = rows(database, "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name");
    assert.deepEqual(tables.map(({ name }) => name), expectedTables);
    assert.deepEqual(rows(database, 'PRAGMA foreign_key_check'), []);
    assert.equal(database.prepare('PRAGMA foreign_keys').get().foreign_keys, 1);
    assert.equal(database.prepare('SELECT COUNT(*) AS total FROM usuario').get().total, 2);
    assert.equal(database.prepare('SELECT COUNT(*) AS total FROM item_carrinho').get().total, 0);
  });
});

test('consulta catálogo, compatibilidades, pedido e pagamento da demonstração', () => {
  withDatabase((database) => {
    const catalog = rows(database, `
      SELECT p.id, p.nome, p.tipo, p.preco_centavos,
             group_concat(pc.nome, ', ') AS plataformas
      FROM produto p
      JOIN compatibilidade_produto cp ON cp.produto_id = p.id
      JOIN plataforma_cloud pc ON pc.id = cp.plataforma_cloud_id
      GROUP BY p.id, p.nome, p.tipo, p.preco_centavos
      ORDER BY p.id DESC
    `);
    assert.deepEqual(catalog, [
      { id: 'orbit-raiders', nome: 'Orbit Raiders', tipo: 'JOGO', preco_centavos: 7990, plataformas: 'GeForce NOW, Boosteroid' },
      { id: 'neon-expansion', nome: 'Neon Expansion', tipo: 'DLC', preco_centavos: 2490, plataformas: 'GeForce NOW' },
    ]);

    const order = { ...database.prepare(`
      SELECT p.id, COUNT(ip.id) AS quantidade, p.total_centavos,
             SUM(ip.preco_unitario_centavos) AS soma_itens,
             pg.status AS pagamento_status, pg.valor_centavos AS pagamento_valor
      FROM pedido p
      JOIN item_pedido ip ON ip.pedido_id = p.id
      JOIN pagamento pg ON pg.pedido_id = p.id
      GROUP BY p.id, p.total_centavos, pg.status, pg.valor_centavos
    `).get() };
    assert.deepEqual(order, {
      id: 'pedido-demo-001', quantidade: 2, total_centavos: 10480,
      soma_itens: 10480, pagamento_status: 'APROVADO', pagamento_valor: 10480,
    });
  });
});

test('consulta os dois itens da biblioteca com loja e chaves fictícias', () => {
  withDatabase((database) => {
    const library = rows(database, `
      SELECT p.nome AS produto, la.nome AS loja, ca.codigo AS chave
      FROM item_biblioteca ib
      JOIN produto p ON p.id = ib.produto_id
      JOIN loja_ativacao la ON la.id = p.loja_ativacao_id
      JOIN chave_ativacao ca ON ca.item_biblioteca_id = ib.id
      ORDER BY p.nome
    `);
    assert.equal(library.length, 2);
    assert.deepEqual(library.map(({ produto }) => produto), ['Neon Expansion', 'Orbit Raiders']);
    assert.ok(library.every(({ loja }) => loja === 'Loja de demonstração (fictícia)'));
    assert.ok(library.every(({ chave }) => chave.includes('FICTICIA')));
  });
});

test('rejeita violações locais e preserva inserção válida no carrinho', () => {
  withDatabase((database) => {
    expectConstraint(database,
      "INSERT INTO usuario VALUES ('outro', 'Outro', 'jogador@pixelvault.example', 'HASH-FICTICIO', 'JOGADOR')",
      /UNIQUE constraint failed: usuario.email/);
    expectConstraint(database,
      "INSERT INTO usuario VALUES ('papel-invalido', 'Outro', 'outro@pixelvault.example', 'HASH-FICTICIO', 'VISITANTE')",
      /CHECK constraint failed/);
    expectConstraint(database,
      "INSERT INTO produto VALUES ('tipo-invalido', 'loja-demo', 'Inválido', 'PACOTE', 100, 'Teste')",
      /CHECK constraint failed/);
    expectConstraint(database,
      "INSERT INTO produto VALUES ('preco-invalido', 'loja-demo', 'Inválido', 'JOGO', 0, 'Teste')",
      /CHECK constraint failed/);

    database.exec("INSERT INTO item_carrinho VALUES ('carrinho-player-demo', 'orbit-raiders')");
    assert.equal(database.prepare('SELECT COUNT(*) AS total FROM item_carrinho').get().total, 1);
    expectConstraint(database,
      "INSERT INTO item_carrinho VALUES ('carrinho-player-demo', 'orbit-raiders')",
      /UNIQUE constraint failed: item_carrinho.carrinho_id, item_carrinho.produto_id/);
    expectConstraint(database,
      "INSERT INTO item_carrinho VALUES ('carrinho-inexistente', 'orbit-raiders')",
      /FOREIGN KEY constraint failed/);
    expectConstraint(database,
      "INSERT INTO pagamento VALUES ('pagamento-duplicado', 'pedido-demo-001', 'APROVADO', 10480, 'OUTRA-REFERENCIA-FICTICIA')",
      /UNIQUE constraint failed: pagamento.pedido_id/);
    expectConstraint(database,
      "INSERT INTO item_biblioteca VALUES ('item-biblioteca-duplicado', 'biblioteca-player-demo', 'orbit-raiders', 'item-pedido-neon-001')",
      /UNIQUE constraint failed/);
    database.exec("DELETE FROM chave_ativacao WHERE id = 'chave-neon-001'");
    expectConstraint(database,
      "INSERT INTO chave_ativacao VALUES ('chave-repetida', 'item-biblioteca-neon-001', 'PV-ORBIT-DEMO-CHAVE-FICTICIA')",
      /UNIQUE constraint failed: chave_ativacao.codigo/);

    assert.deepEqual(rows(database, 'PRAGMA foreign_key_check'), []);
  });
});

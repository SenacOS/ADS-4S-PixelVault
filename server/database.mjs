import { existsSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

const REQUIRED_TABLES = [
  'biblioteca',
  'chave_ativacao',
  'compatibilidade_produto',
  'item_biblioteca',
  'item_pedido',
  'loja_ativacao',
  'pagamento',
  'pedido',
  'plataforma_cloud',
  'produto',
  'usuario',
];

export function openDatabase(databasePath) {
  if (!existsSync(databasePath)) {
    throw new Error('Banco local não encontrado. Execute npm run db:init.');
  }

  let database;
  try {
    database = new DatabaseSync(databasePath);
    database.exec('PRAGMA foreign_keys = ON;');

    const foreignKeysEnabled = database.prepare('PRAGMA foreign_keys').get().foreign_keys;
    if (foreignKeysEnabled !== 1) {
      throw new Error('Não foi possível habilitar as chaves estrangeiras.');
    }

    const placeholders = REQUIRED_TABLES.map(() => '?').join(', ');
    const rows = database.prepare(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table' AND name IN (${placeholders})
    `).all(...REQUIRED_TABLES);

    if (rows.length !== REQUIRED_TABLES.length) {
      throw new Error('O esquema do banco local é incompatível.');
    }

    return database;
  } catch (error) {
    database?.close();
    throw error;
  }
}

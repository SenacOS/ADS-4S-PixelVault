import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

export const catalogAdditions = JSON.parse(readFileSync(new URL('../src/data/catalogExpansion.json', import.meta.url), 'utf8'));
const EDITION = 'catalog-30-games-v1';

export function applyCatalogExpansion(database, { track = true } = {}) {
  if (track) database.exec('CREATE TABLE IF NOT EXISTS app_migration (id TEXT PRIMARY KEY);');
  database.exec('BEGIN IMMEDIATE;');
  try {
    if (track && database.prepare('SELECT id FROM app_migration WHERE id = ?').get(EDITION)) { database.exec('COMMIT;'); return 0; }
    let inserted = 0;
    function ensureName(table, preferredId, name) {
      const existing = database.prepare(`SELECT id FROM ${table} WHERE nome = ?`).get(name);
      if (existing) return existing.id;
      const occupied = database.prepare(`SELECT id FROM ${table} WHERE id = ?`).get(preferredId);
      const id = occupied ? randomUUID() : preferredId;
      database.prepare(`INSERT INTO ${table} (id,nome) VALUES (?,?)`).run(id,name);
      return id;
    }
    for (const product of catalogAdditions) {
      // An existing ID belongs to its current owner; never overwrite its fields or platforms.
      if (database.prepare('SELECT id FROM produto WHERE id = ?').get(product.id)) continue;
      const storeId = ensureName('loja_ativacao','loja-demo','Loja de demonstração (fictícia)');
      database.prepare("INSERT INTO produto (id,loja_ativacao_id,nome,tipo,preco_centavos,descricao) VALUES (?,?,?,'JOGO',?,?)")
        .run(product.id, storeId, product.name, product.priceCents, product.description);
      for (const name of product.compatibleWith) {
        const platformId = name === 'GeForce NOW' ? 'geforce-now' : 'boosteroid';
        const id = ensureName('plataforma_cloud',platformId,name);
        database.prepare('INSERT INTO compatibilidade_produto (produto_id,plataforma_cloud_id) VALUES (?,?)').run(product.id,id);
      }
      inserted++;
    }
    if (track) database.prepare('INSERT INTO app_migration (id) VALUES (?)').run(EDITION);
    database.exec('COMMIT;');
    return inserted;
  } catch (error) { database.exec('ROLLBACK;'); throw error; }
}

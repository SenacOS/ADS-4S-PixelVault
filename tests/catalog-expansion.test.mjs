import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { inflateSync } from 'node:zlib';
import test from 'node:test';
import { initializeDatabase } from '../scripts/init-db.mjs';
import { applyCatalogExpansion, catalogAdditions } from '../server/catalog-expansion.mjs';
import { createVault } from '../src/persistence/vault.mjs';

const extras = catalogAdditions.map(p=>({id:p.id,name:p.name,price:p.priceCents/100,type:'Jogo',description:p.description,activationStore:'Loja de demonstração (fictícia)',compatibleWith:p.compatibleWith}));
const original = {id:'orbit-raiders',name:'Orbit editado pelo usuário',price:90,type:'Jogo',description:'Edição preservada',activationStore:'Loja',compatibleWith:['Cloud']};
function memory(saved) { return { async load(){return structuredClone(saved);}, async save(value){saved=structuredClone(value);} }; }
function fixture(run) {
  const directory=mkdtempSync(join(tmpdir(),'pixelvault-expansion-'));const path=join(directory,'test.sqlite');initializeDatabase(path);const db=new DatabaseSync(path);db.exec('PRAGMA foreign_keys=ON');
  try{return run(db);}finally{db.close();rmSync(directory,{recursive:true,force:true});}
}
function removeExtras(db) {for(const p of catalogAdditions){db.prepare('DELETE FROM compatibilidade_produto WHERE produto_id=?').run(p.id);db.prepare('DELETE FROM produto WHERE id=?').run(p.id);}}

test('schema e seed SQL sozinhos criam o catálogo completo e mantêm paridade com o JSON', () => {
  const db = new DatabaseSync(':memory:');
  try {
    db.exec(readFileSync(new URL('../database/schema.sql', import.meta.url), 'utf8'));
    db.exec(readFileSync(new URL('../database/seed.sql', import.meta.url), 'utf8'));
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM produto').get().n, 32);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM produto WHERE tipo = 'JOGO'").get().n, 31);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM produto WHERE tipo = 'DLC'").get().n, 1);
    for (const product of catalogAdditions) {
      const saved = db.prepare('SELECT nome, tipo, preco_centavos, descricao, loja_ativacao_id FROM produto WHERE id = ?').get(product.id);
      assert.deepEqual({ ...saved }, {
        nome: product.name, tipo: 'JOGO', preco_centavos: product.priceCents,
        descricao: product.description, loja_ativacao_id: 'loja-demo',
      });
      const platforms = db.prepare(`SELECT pc.nome FROM compatibilidade_produto cp
        JOIN plataforma_cloud pc ON pc.id = cp.plataforma_cloud_id WHERE cp.produto_id = ? ORDER BY pc.nome`).all(product.id);
      assert.deepEqual(platforms.map(p => p.nome), [...product.compatibleWith].sort());
    }
    assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(), []);
    assert.equal(applyCatalogExpansion(db), 0);
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM produto').get().n, 32);
  } finally { db.close(); }
});

test('catálogo novo tem32IDs únicos, 30novos jogos e33PNGs locais válidos distintos',()=>fixture(db=>{
  assert.equal(catalogAdditions.length,30);assert.equal(new Set(catalogAdditions.map(p=>p.id)).size,30);
  const ids=['orbit-raiders','neon-expansion',...catalogAdditions.map(p=>p.id)];
  assert.deepEqual(db.prepare('SELECT id FROM produto ORDER BY id').all().map(p=>p.id),[...ids].sort());
  assert.equal(db.prepare("SELECT count(*) n FROM produto WHERE tipo='JOGO'").get().n,31);
  const hashes=new Set();const registry=readFileSync(new URL('../src/data/catalogCovers.js',import.meta.url),'utf8');
  for(const id of [...ids,'catalog-generic']){
    const png=readFileSync(new URL(`../assets/covers/${id}.png`,import.meta.url));assert.deepEqual([...png.subarray(0,8)],[137,80,78,71,13,10,26,10]);assert.equal(png.readUInt32BE(16),768);assert.equal(png.readUInt32BE(20),432);
    const chunks=[];for(let offset=8;offset<png.length;){const n=png.readUInt32BE(offset);if(png.toString('ascii',offset+4,offset+8)==='IDAT')chunks.push(png.subarray(offset+8,offset+8+n));offset+=n+12;}
    assert.equal(inflateSync(Buffer.concat(chunks)).length,(768*3+1)*432);hashes.add(createHash('sha256').update(png).digest('hex'));assert.ok(registry.includes(`assets/covers/${id}.png`));
  }
  assert.equal(hashes.size,33);assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(),[]);
}));

test('migração de banco antigo preserva edições, pedidos e exclusões posteriores',()=>fixture(db=>{
  removeExtras(db);const before=db.prepare('SELECT * FROM pedido').all();
  const custom=catalogAdditions[0];db.prepare("INSERT INTO produto VALUES (?,'loja-demo','Personalizado','DLC',123,'Preservar')").run(custom.id);db.prepare("INSERT INTO compatibilidade_produto VALUES (?,'boosteroid')").run(custom.id);
  assert.equal(applyCatalogExpansion(db),29);assert.equal(db.prepare('SELECT nome FROM produto WHERE id=?').get(custom.id).nome,'Personalizado');assert.equal(db.prepare('SELECT count(*) n FROM compatibilidade_produto WHERE produto_id=?').get(custom.id).n,1);assert.deepEqual(db.prepare('SELECT * FROM pedido').all(),before);
  const deleted=catalogAdditions[1].id;db.prepare('DELETE FROM compatibilidade_produto WHERE produto_id=?').run(deleted);db.prepare('DELETE FROM produto WHERE id=?').run(deleted);
  assert.equal(applyCatalogExpansion(db),0);assert.equal(db.prepare('SELECT id FROM produto WHERE id=?').get(deleted),undefined);
}));

test('migração transacional falha sem inserir parcialmente nem marcar versão',()=>fixture(db=>{
  removeExtras(db);const blocked=catalogAdditions[3].id;
  db.exec(`CREATE TRIGGER block_seed BEFORE INSERT ON produto WHEN NEW.id='${blocked}' BEGIN SELECT RAISE(ABORT,'fixture'); END;`);
  assert.throws(()=>applyCatalogExpansion(db),/fixture/);assert.equal(db.prepare('SELECT count(*) n FROM produto').get().n,2);assert.equal(db.prepare('SELECT count(*) n FROM app_migration').get().n,0);
  db.exec('DROP TRIGGER block_seed');assert.equal(applyCatalogExpansion(db),30);
}));

test('migração preserva loja/plataforma com ID reservado já personalizado',()=>fixture(db=>{
  removeExtras(db);db.prepare('UPDATE loja_ativacao SET nome=? WHERE id=?').run('Loja personalizada','loja-demo');db.prepare('UPDATE plataforma_cloud SET nome=? WHERE id=?').run('Cloud personalizada','geforce-now');
  assert.equal(applyCatalogExpansion(db),30);
  assert.equal(db.prepare('SELECT nome FROM loja_ativacao WHERE id=?').get('loja-demo').nome,'Loja personalizada');
  assert.equal(db.prepare('SELECT nome FROM plataforma_cloud WHERE id=?').get('geforce-now').nome,'Cloud personalizada');
  const added=db.prepare('SELECT l.nome FROM produto p JOIN loja_ativacao l ON l.id=p.loja_ativacao_id WHERE p.id=?').get(catalogAdditions[0].id);assert.equal(added.nome,'Loja de demonstração (fictícia)');assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(),[]);
}));

test('cache antigo recebe só extras uma vez, preserva contas/outbox/edições e DELETE pendente',async()=>{
  const blocked=extras[0];const outbox=[{id:'op-delete',method:'DELETE',productId:blocked.id,actorId:'admin-demo',baseRevision:null,before:blocked,product:null}];
  const users={player:{cart:[original],library:[original],order:null,remoteCheckout:{id:'checkout-preservado-001',productIds:['orbit-raiders']}}};
  const storage=memory({version:2,catalog:[original],catalogDirty:true,users,outbox,legacyDirty:false});
  let vault=createVault({storage,initialProducts:[original,...extras],catalogAdditions:extras,catalogEdition:2});await vault.load();
  let saved=await storage.load();assert.equal(saved.catalog.length,30);assert.equal(saved.catalog[0].price,90);assert.equal(saved.catalog.some(p=>p.id==='neon-expansion'),false);assert.equal(saved.catalog.some(p=>p.id===blocked.id),false);assert.equal(saved.outbox[0].method,'DELETE');assert.deepEqual(saved.users.player.remoteCheckout,users.player.remoteCheckout);assert.equal(saved.users.player.cart[0].price,90);assert.equal(saved.catalogEdition,2);
  await vault.update(v=>({...v,catalog:v.catalog.filter(p=>p.id!==extras[2].id)}));await vault.dispose();
  vault=createVault({storage,initialProducts:[original,...extras],catalogAdditions:extras,catalogEdition:2});await vault.load();saved=await storage.load();assert.equal(saved.catalog.some(p=>p.id===extras[2].id),false);assert.equal(saved.catalogEdition,2);await vault.dispose();
});

test('falha ao salvar migração do cache não publica nem perde dados; refresh/descarte preservam marcador',async()=>{
  const stored={version:2,catalog:[original],catalogDirty:false,users:{},outbox:[]};let seen=0;
  const storage=memory(stored);const failing={load:()=>storage.load(),save:async()=>{throw new Error('disk full');}};
  const failed=createVault({storage:failing,initialProducts:[original,...extras],catalogAdditions:extras,catalogEdition:2,onChange:()=>{seen++;}});await assert.rejects(failed.load(),/disk full/);assert.equal(seen,0);assert.deepEqual(await storage.load(),stored);
  const vault=createVault({storage,initialProducts:[original,...extras],catalogAdditions:extras,catalogEdition:2});await vault.load();await vault.refresh(async()=>[original]);assert.equal((await storage.load()).catalogEdition,2);await vault.discardCatalog(async()=>[original]);assert.equal((await storage.load()).catalogEdition,2);await vault.dispose();
});

test('cache v1 legado recebe os30extras sem inventar outbox ou restaurar original excluído',async()=>{
  const storage=memory({version:1,catalog:[original],catalogDirty:true,users:{}});
  const vault=createVault({storage,initialProducts:[original,...extras],catalogAdditions:extras,catalogEdition:2});await vault.load();
  const saved=await storage.load();assert.equal(saved.catalog.length,31);assert.equal(saved.version,2);assert.equal(saved.legacyDirty,true);assert.equal(saved.catalogDirty,true);assert.deepEqual(saved.outbox,[]);assert.equal(saved.catalog.some(p=>p.id==='neon-expansion'),false);assert.equal(saved.catalog[0].price,90);await vault.dispose();
});

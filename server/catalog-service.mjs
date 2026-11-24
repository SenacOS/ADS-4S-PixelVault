import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { readFileSync } from 'node:fs';

import { AppError } from './errors.mjs';

const hash = (value) => createHash('sha256').update(value).digest('hex');
export function demoPasswordHash(id) {
  const salt = `pixelvault-demo-${id}`;
  return `scrypt:${salt}:${scryptSync('demo123', salt, 64).toString('hex')}`;
}

function requiredText(value, max = 200, multiline = false) {
  const invalidControl = multiline ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/u : /[\u0000-\u001f]/u;
  if (typeof value !== 'string' || !value.trim() || value.length > max || invalidControl.test(value)) {
    throw new AppError(400, 'INVALID_PRODUCT', 'Preencha os dados do produto corretamente.');
  }
  return value.trim();
}

function identifier(value) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/u.test(value)) {
    throw new AppError(400, 'INVALID_IDENTIFIER', 'Identificador inválido.');
  }
  return value;
}

function parseProduct(value, id) {
  if (!value || Array.isArray(value) || Object.keys(value).some((key) => !['id', 'name', 'type', 'priceCents', 'description', 'activationStore', 'cloudPlatforms'].includes(key))) {
    throw new AppError(400, 'INVALID_PRODUCT', 'Produto inválido.');
  }
  if (identifier(value.id) !== id || !['JOGO', 'DLC'].includes(value.type)
    || !Number.isSafeInteger(value.priceCents) || value.priceCents <= 0 || value.priceCents > 100000000
    || !Array.isArray(value.cloudPlatforms) || !value.cloudPlatforms.length || value.cloudPlatforms.length > 20) {
    throw new AppError(400, 'INVALID_PRODUCT', 'Produto inválido.');
  }
  const platforms = [...new Set(value.cloudPlatforms.map((name) => requiredText(name)))].sort();
  return { id, name: requiredText(value.name), type: value.type, priceCents: value.priceCents,
    description: requiredText(value.description, 2000, true), activationStore: requiredText(value.activationStore), cloudPlatforms: platforms };
}

export function createCatalogService(database, repositories) {
  database.exec(readFileSync(new URL('../database/migrations/001_catalog_sync.sql', import.meta.url), 'utf8'));
  for (const [id, marker] of [['admin-demo', 'ADMIN'], ['player-demo', 'PLAYER']]) {
    database.prepare('UPDATE usuario SET senha_hash = ? WHERE id = ? AND senha_hash = ?')
      .run(demoPasswordHash(id), id, `HASH-FICTICIO-NAO-AUTENTICAVEL-${marker}`);
  }
  const sessions = new Map();
  const attempts = new Map();
  const getProduct = (id) => {
    identifier(id);
    const product = repositories.listProducts().find((item) => item.id === id);
    if (!product) throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Produto não encontrado.');
    return product;
  };
  function authenticate(authorization) {
    const credential = typeof authorization === 'string' ? authorization.replace(/^Bearer /u, '') : '';
    const session = sessions.get(credential);
    if (!session || session.expires < Date.now()) {
      sessions.delete(credential);
      throw new AppError(401, 'AUTH_REQUIRED', 'Entre novamente para sincronizar.');
    }
    return session.user;
  }
  function authorize(authorization) {
    const user = authenticate(authorization);
    if (user.role !== 'admin') throw new AppError(403, 'ADMIN_REQUIRED', 'Apenas administradores podem alterar o catálogo.');
    return user;
  }
  return {
    authenticate,
    getProduct,
    login(body, address = 'local') {
      const now = Date.now();
      const attempt = attempts.get(address);
      if (attempt && attempt.until > now && attempt.count >= 10) throw new AppError(429, 'LOGIN_LIMIT', 'Aguarde um minuto antes de tentar novamente.');
      if (!body || typeof body.email !== 'string' || body.email.length > 254
        || typeof body.password !== 'string' || body.password.length > 128 || !body.password) {
        throw new AppError(400, 'INVALID_LOGIN', 'Informe e-mail e senha.');
      }
      const row = database.prepare('SELECT * FROM usuario WHERE email = ?').get(body.email.trim().toLowerCase());
      const [algorithm, salt, expected] = (row?.senha_hash ?? '').split(':');
      const actual = scryptSync(body.password, salt || 'pixelvault-invalid', 64);
      if (algorithm !== 'scrypt' || !/^[a-f0-9]{128}$/u.test(expected ?? '') || !timingSafeEqual(actual, Buffer.from(expected, 'hex'))) {
        attempts.set(address, { until: attempt?.until > now ? attempt.until : now + 60000, count: attempt?.until > now ? attempt.count + 1 : 1 });
        throw new AppError(401, 'INVALID_CREDENTIALS', 'E-mail ou senha inválidos.');
      }
      attempts.delete(address);
      for (const [key, value] of sessions) if (value.expires < now) sessions.delete(key);
      if (sessions.size >= 1000) throw new AppError(503, 'SESSION_LIMIT', 'Tente novamente mais tarde.');
      const token = randomBytes(32).toString('hex');
      const user = { id: row.id, name: row.nome, email: row.email, role: row.papel === 'ADMIN' ? 'admin' : 'player' };
      sessions.set(token, { user, expires: now + 8 * 60 * 60 * 1000 });
      return { user, token };
    },
    logout(authorization) { sessions.delete(String(authorization || '').replace(/^Bearer /u, '')); },
    mutate(method, pathId, body, authorization) {
      const actor = authorize(authorization);
      if (!body || Array.isArray(body) || Object.keys(body).some((key) => !['operationId', 'baseRevision', 'product'].includes(key))) {
        throw new AppError(400, 'INVALID_OPERATION', 'Operação inválida.');
      }
      const operationId = identifier(body.operationId);
      const id = identifier(pathId || body.product?.id);
      const product = method === 'DELETE' ? null : parseProduct(body.product, id);
      if (method !== 'POST' && (typeof body.baseRevision !== 'string' || !/^[a-f0-9]{64}$/u.test(body.baseRevision))) {
        throw new AppError(400, 'REVISION_REQUIRED', 'Informe a revisão original do produto.');
      }
      const signature = hash(JSON.stringify({ actor: actor.id, method, id, product, baseRevision: body.baseRevision ?? null }));
      database.exec('BEGIN IMMEDIATE;');
      try {
        const receipt = database.prepare('SELECT * FROM catalog_operation WHERE id = ?').get(operationId);
        if (receipt) {
          if (receipt.actor_id !== actor.id || receipt.request_hash !== signature) throw new AppError(409, 'OPERATION_REUSED', 'Identificador de operação já utilizado.');
          database.exec('COMMIT;');
          return JSON.parse(receipt.response_json);
        }
        const existing = repositories.listProducts().find((item) => item.id === id);
        if (method === 'POST' && existing) throw new AppError(409, 'PRODUCT_EXISTS', 'Este produto já existe.');
        if (method !== 'POST' && !existing) throw new AppError(409, 'PRODUCT_REMOVED', 'O produto foi removido no servidor.');
        if (method !== 'POST' && existing.revision !== body.baseRevision) throw new AppError(409, 'REVISION_CONFLICT', 'O produto mudou no servidor. Revise o conflito antes de reenviar.');
        if (method === 'DELETE') {
          const references = database.prepare('SELECT (SELECT COUNT(*) FROM item_pedido WHERE produto_id = ?) + (SELECT COUNT(*) FROM item_biblioteca WHERE produto_id = ?) + (SELECT COUNT(*) FROM item_carrinho WHERE produto_id = ?) AS total').get(id, id, id);
          if (references.total) throw new AppError(409, 'PRODUCT_IN_USE', 'Produto com histórico ou carrinho no servidor não pode ser excluído.');
          database.prepare('DELETE FROM compatibilidade_produto WHERE produto_id = ?').run(id);
          database.prepare('DELETE FROM produto WHERE id = ?').run(id);
        } else {
          const platforms = product.cloudPlatforms.map((name) => database.prepare('SELECT id FROM plataforma_cloud WHERE nome = ?').get(name));
          if (platforms.some((platform) => !platform)) throw new AppError(400, 'INVALID_PLATFORM', 'Selecione uma plataforma cadastrada.');
          let store = database.prepare('SELECT id FROM loja_ativacao WHERE nome = ?').get(product.activationStore);
          if (!store) {
            store = { id: `store-${hash(product.activationStore).slice(0, 32)}` };
            database.prepare('INSERT INTO loja_ativacao (id, nome) VALUES (?, ?)').run(store.id, product.activationStore);
          }
          if (method === 'POST') database.prepare('INSERT INTO produto (id, loja_ativacao_id, nome, tipo, preco_centavos, descricao) VALUES (?, ?, ?, ?, ?, ?)').run(id, store.id, product.name, product.type, product.priceCents, product.description);
          else {
            database.prepare('UPDATE produto SET loja_ativacao_id = ?, nome = ?, tipo = ?, preco_centavos = ?, descricao = ? WHERE id = ?').run(store.id, product.name, product.type, product.priceCents, product.description, id);
            database.prepare('DELETE FROM compatibilidade_produto WHERE produto_id = ?').run(id);
          }
          for (const platform of platforms) database.prepare('INSERT INTO compatibilidade_produto VALUES (?, ?)').run(id, platform.id);
        }
        const result = method === 'DELETE' ? { deleted: id } : { product: getProduct(id) };
        database.prepare('INSERT INTO catalog_operation VALUES (?, ?, ?, ?)').run(operationId, actor.id, signature, JSON.stringify(result));
        database.exec('COMMIT;');
        return result;
      } catch (error) { database.exec('ROLLBACK;'); throw error; }
    },
  };
}

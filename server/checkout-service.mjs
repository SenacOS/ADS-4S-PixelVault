import { createHash, randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { AppError } from './errors.mjs';

function transaction(database, work) {
  database.exec('BEGIN IMMEDIATE;');
  try { const result = work(); database.exec('COMMIT;'); return result; }
  catch (error) { database.exec('ROLLBACK;'); throw error; }
}
export function createCheckoutService({ database, repositories, gateway }) {
  database.exec(readFileSync(new URL('../database/migrations/002_checkout.sql', import.meta.url), 'utf8'));
  const jobs = new Map();
  function requireGateway() {
    if (!gateway) throw new AppError(503, 'CHECKOUT_NOT_CONFIGURED', 'Configure o backend com as credenciais de teste para usar o checkout.');
  }
  function owned(id, user) {
    const row = database.prepare('SELECT * FROM checkout_operation WHERE id = ? AND usuario_id = ?').get(id, user.id);
    if (!row) throw new AppError(404, 'CHECKOUT_NOT_FOUND', 'Pedido não encontrado para este perfil.');
    return row;
  }
  function summary(row) {
    const snapshot = JSON.parse(row.snapshot);
    return { id: row.id, orderId: row.pedido_id, items: snapshot.items, totalCents: snapshot.totalCents,
      status: row.status, checkoutUrl: row.checkout_url, environment: 'test', mode: 'mercadopago', uncertain: row.phase === 'REQUESTING' };
  }
  function serialize(id, work) {
    const previous = jobs.get(id) ?? Promise.resolve();
    const next = previous.catch(() => {}).then(work);
    jobs.set(id, next);
    void next.finally(() => { if (jobs.get(id) === next) jobs.delete(id); }).catch(() => {});
    return next;
  }
  async function prepare(id, user) {
    let row = owned(id, user);
    if (row.phase === 'READY') return summary(row);
    await gateway.verifyTestIdentity();
    // A durable compare-and-set prevents a second POST after crash or in another process.
    const claim = database.prepare("UPDATE checkout_operation SET phase = 'REQUESTING' WHERE id = ? AND phase = 'NEW'").run(id);
    row = owned(id, user);
    const order = { ...JSON.parse(row.snapshot), orderId: row.pedido_id };
    const result = claim.changes === 1 ? await gateway.create(order) : await gateway.recover(order);
    if (result) database.prepare("UPDATE checkout_operation SET phase = 'READY', preference_id = ?, checkout_url = ? WHERE id = ? AND phase = 'REQUESTING'")
      .run(result.preferenceId, result.checkoutUrl, id);
    return summary(owned(id, user));
  }
  return {
    get(id, user) { return summary(owned(id, user)); },
    async create(body, user) {
      requireGateway();
      if (!body || Array.isArray(body) || Object.keys(body).some((key) => !['requestId', 'productIds'].includes(key))
        || typeof body.requestId !== 'string' || !/^[\w-]{16,100}$/u.test(body.requestId) || !Array.isArray(body.productIds)
        || !body.productIds.length || body.productIds.length > 50 || new Set(body.productIds).size !== body.productIds.length
        || !body.productIds.every((id) => typeof id === 'string' && /^[\w.-]{1,128}$/u.test(id))) {
        throw new AppError(400, 'INVALID_CHECKOUT', 'Informe uma solicitação válida e produtos únicos; valores são calculados pelo servidor.');
      }
      const ids = [...body.productIds].sort();
      const signature = createHash('sha256').update(JSON.stringify({ user: user.id, ids })).digest('hex');
      transaction(database, () => {
        const prior = database.prepare('SELECT * FROM checkout_operation WHERE id = ?').get(body.requestId);
        if (prior) {
          if (prior.usuario_id !== user.id || prior.signature !== signature) throw new AppError(409, 'CHECKOUT_CONFLICT', 'Solicitação já utilizada. Retome o pedido original.');
          return;
        }
        const catalog = repositories.listProducts();
        const items = ids.map((id) => {
          const product = catalog.find((p) => p.id === id);
          if (!product) throw new AppError(409, 'CHECKOUT_PRODUCT_MISSING', 'Produto indisponível no servidor. Atualize o catálogo.');
          return product;
        });
        const totalCents = items.reduce((sum, item) => sum + item.priceCents, 0);
        if (!Number.isSafeInteger(totalCents) || totalCents < 1 || totalCents > 100000000) throw new AppError(400, 'CHECKOUT_TOTAL_LIMIT', 'Total do pedido fora do limite de teste.');
        const orderId = randomUUID();
        database.prepare('INSERT INTO pedido (id, usuario_id, total_centavos) VALUES (?, ?, ?)').run(orderId, user.id, totalCents);
        for (const item of items) database.prepare('INSERT INTO item_pedido (id, pedido_id, produto_id, preco_unitario_centavos) VALUES (?, ?, ?, ?)').run(randomUUID(), orderId, item.id, item.priceCents);
        database.prepare('INSERT INTO checkout_operation (id, pedido_id, usuario_id, signature, snapshot) VALUES (?, ?, ?, ?, ?)')
          .run(body.requestId, orderId, user.id, signature, JSON.stringify({ items, totalCents }));
      });
      return serialize(body.requestId, () => prepare(body.requestId, user));
    },
    async reconcile(id, user) {
      requireGateway();
      owned(id, user);
      return serialize(id, async () => {
        const row = owned(id, user);
        if (row.status === 'APROVADO') return summary(row);
        const order = { ...JSON.parse(row.snapshot), orderId: row.pedido_id };
        const result = await gateway.reconcile(order);
        if (!['APROVADO', 'PENDENTE', 'RECUSADO', 'CANCELADO'].includes(result.status)) throw new Error('Estado remoto inválido.');
        transaction(database, () => {
          const current = owned(id, user);
          if (current.status === 'APROVADO') return;
          database.prepare('UPDATE checkout_operation SET status = ?, payment_id = ? WHERE id = ?').run(result.status, result.paymentId, id);
          if (result.status !== 'APROVADO') return;
          if (!result.paymentId) throw new Error('Pagamento confirmado sem identificador.');
          repositories.addPayment({ id: randomUUID(), orderId: row.pedido_id, status: 'APROVADO', valueCents: order.totalCents, externalReference: `MP-TEST-${result.paymentId}` });
          let library = repositories.findLibraryByUser(user.id);
          if (!library) { library = { id: randomUUID() }; repositories.addLibrary(library.id, user.id); }
          for (const item of repositories.listOrderItems(row.pedido_id)) {
            if (repositories.findLibraryItem(library.id, item.produto_id)) continue;
            const libraryItemId = randomUUID();
            repositories.addLibraryItem({ id: libraryItemId, libraryId: library.id, productId: item.produto_id, orderItemId: item.id });
            repositories.addActivationKey({ id: randomUUID(), libraryItemId, code: `PV-DEMO-FICTICIA-${randomUUID()}` });
          }
        });
        return summary(owned(id, user));
      });
    },
    library(user) {
      // Only confirmed remote acquisitions; seed/demo purchases do not prove payment.
      const productIds = new Set(database.prepare(`SELECT DISTINCT ip.produto_id FROM checkout_operation co JOIN item_pedido ip ON ip.pedido_id = co.pedido_id WHERE co.usuario_id = ? AND co.status = 'APROVADO'`).all(user.id).map((row) => row.produto_id));
      return { products: repositories.listProducts().filter((p) => productIds.has(p.id)), environment: 'test' };
    },
  };
}

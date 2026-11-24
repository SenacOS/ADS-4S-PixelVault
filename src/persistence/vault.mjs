import { calculateTotal, formatCurrency } from '../domain/prototypeLogic.mjs';
import { mapApiProducts, toApiProduct } from '../integrations/catalogApi.mjs';

function product(value) {
  if (!value || typeof value.id !== 'string' || !value.id
    || typeof value.name !== 'string' || !value.name.trim()
    || !['Jogo', 'DLC'].includes(value.type)
    || !Number.isFinite(value.price) || value.price <= 0
    || typeof value.description !== 'string'
    || typeof value.activationStore !== 'string'
    || !Array.isArray(value.compatibleWith)
    || !value.compatibleWith.every((name) => typeof name === 'string' && name.length > 0)) {
    throw new Error('Produto persistido inválido.');
  }
  // Whitelist fields: never persist forms, credentials or session objects.
  return {
    id: value.id, name: value.name, type: value.type, price: value.price,
    priceLabel: formatCurrency(value.price), description: value.description,
    activationStore: value.activationStore, compatibleWith: [...value.compatibleWith],
    activationKey: typeof value.activationKey === 'string' ? value.activationKey : 'Chave fictícia de demonstração',
    revision: typeof value.revision === 'string' ? value.revision : null,
  };
}

function products(values) {
  if (!Array.isArray(values)) throw new Error('Lista persistida inválida.');
  const result = values.map(product);
  if (new Set(result.map((item) => item.id)).size !== result.length) throw new Error('Produtos duplicados.');
  return result;
}

export function emptyUser() { return { cart: [], library: [], order: null }; }

export function userData(snapshot, userId) {
  return Object.hasOwn(snapshot.users, userId) ? snapshot.users[userId] : emptyUser();
}

export function sanitizeVault(value) {
  if (!value || ![1, 2].includes(value.version) || typeof value.catalogDirty !== 'boolean'
    || !value.users || typeof value.users !== 'object' || Array.isArray(value.users)) {
    throw new Error('Armazenamento incompatível. Os dados existentes foram preservados.');
  }
  const users = Object.fromEntries(Object.entries(value.users).map(([id, data]) => {
    let order = null;
    if (data.order !== null) {
      if (!data.order || typeof data.order.id !== 'string') throw new Error('Pedido inválido.');
      const items = products(data.order.items);
      order = { id: data.order.id, items, quantity: items.length, total: calculateTotal(items), ...(data.order.mode === 'mercadopago-test' ? { mode: 'mercadopago-test' } : {}) };
    }
    let remoteCheckout;
    if (data.remoteCheckout) {
      if (!/^[\w-]{16,100}$/u.test(data.remoteCheckout.id ?? '') || !Array.isArray(data.remoteCheckout.productIds)
        || !data.remoteCheckout.productIds.every((value) => typeof value === 'string')) throw new Error('Referência de checkout inválida.');
      remoteCheckout = { id: data.remoteCheckout.id, productIds: [...data.remoteCheckout.productIds] };
    }
    return [id, { cart: products(data.cart), library: products(data.library), order,
      ...(data.remoteLibrary ? { remoteLibrary: products(data.remoteLibrary) } : {}), ...(remoteCheckout ? { remoteCheckout } : {}) }];
  }));
  const outbox = value.version === 1 ? [] : (value.outbox ?? []).map((op) => {
    if (!['POST', 'PUT', 'DELETE'].includes(op.method) || typeof op.id !== 'string' || typeof op.productId !== 'string' || typeof op.actorId !== 'string') throw new Error('Fila inválida.');
    return { id: op.id, method: op.method, productId: op.productId, actorId: op.actorId,
      baseRevision: typeof op.baseRevision === 'string' ? op.baseRevision : null,
      before: op.before ? product(op.before) : null, product: op.product ? product(op.product) : null };
  });
  return { version: 2, catalog: products(value.catalog), catalogDirty: value.catalogDirty, users, outbox,
    ...(Number.isSafeInteger(value.catalogEdition) && value.catalogEdition > 0 ? { catalogEdition: value.catalogEdition } : {}),
    legacyDirty: value.version === 1 ? value.catalogDirty : Boolean(value.legacyDirty) };
}

export function createVault({ storage, initialProducts, catalogAdditions = [], catalogEdition = 0, onChange = (_value) => {} }) {
  let current;
  let disposed = false;
  let closePromise;
  let queue = Promise.resolve();
  let syncing = false;
  let catalogEpoch = 0;
  function enqueue(operation) {
    const result = queue.then(operation);
    queue = result.catch(() => {});
    return result;
  }
  return {
    load() {
      return enqueue(async () => {
        if (disposed) throw new Error('Armazenamento encerrado.');
        const saved = await storage.load();
        if (disposed) throw new Error('Armazenamento encerrado.');
        const value = sanitizeVault(saved ?? { version: 1, catalog: initialProducts, catalogDirty: false, users: {} });
        const upgrade = catalogEdition > (value.catalogEdition ?? 0);
        if (upgrade) {
          const blocked = new Set([...value.catalog.map((p) => p.id), ...value.outbox.map((op) => op.productId)]);
          value.catalog = [...value.catalog, ...catalogAdditions.filter((p) => !blocked.has(p.id)).map(product)];
          value.catalogEdition = catalogEdition;
        }
        if (saved === null || saved.version !== value.version || upgrade) await storage.save(value);
        current = value;
        if (!disposed) onChange(value);
        return value;
      });
    },
    update(transform) {
      return enqueue(async () => {
        if (disposed) throw new Error('Armazenamento encerrado.');
        if (!current) throw new Error('Aguarde a leitura dos dados locais.');
        const transformed = transform(current);
        const changesCatalog = transformed.catalog !== current.catalog || transformed.outbox !== current.outbox
          || transformed.catalogDirty !== current.catalogDirty || transformed.legacyDirty !== current.legacyDirty;
        const value = sanitizeVault(transformed);
        await storage.save(value);
        current = value;
        if (changesCatalog) catalogEpoch += 1;
        if (!disposed) onChange(value);
        return value;
      });
    },
    async refresh(client) {
      const startedAt = catalogEpoch;
      const catalog = await client();
      let blocked = false;
      await this.update((value) => {
        blocked = value.catalogDirty || startedAt !== catalogEpoch;
        return blocked ? value : { ...value, catalog };
      });
      return !blocked;
    },
    changeCatalog(method, productId, nextProduct, actorId) {
      return this.update((value) => {
        if (value.legacyDirty) throw new Error('Revise o catálogo antigo antes de criar novas alterações.');
        const before = value.catalog.find((item) => item.id === productId) ?? null;
        const op = { id: `op-${Date.now()}-${Math.random().toString(36).slice(2)}`, method, productId, actorId,
          baseRevision: before?.revision ?? null, before, product: nextProduct };
        const catalog = method === 'DELETE' ? value.catalog.filter((item) => item.id !== productId)
          : method === 'POST' ? [...value.catalog, nextProduct]
            : value.catalog.map((item) => item.id === productId ? nextProduct : item);
        return { ...value, catalog, catalogDirty: true, outbox: [...value.outbox, op] };
      });
    },
    async synchronize(request, actorId, isAuthorized = () => true) {
      if (syncing) return false;
      syncing = true;
      try {
        while (true) {
          await queue;
          if (disposed) throw new Error('Armazenamento encerrado.');
          if (current.legacyDirty || (current.catalogDirty && !current.outbox.length)) throw new Error('Catálogo antigo sem histórico: revise e confirme se deseja recarregar a versão do servidor.');
          let op = current.outbox[0];
          if (!op) break;
          if (!isAuthorized() || op.actorId !== actorId) throw new Error('Entre na conta administrativa que criou as alterações para sincronizar.');
          if (op.method !== 'POST' && !op.baseRevision) {
            const body = await request(`/api/products/${encodeURIComponent(op.productId)}`);
            const remote = mapApiProducts({ products: [body.product] })[0];
            if (JSON.stringify(toApiProduct(remote)) !== JSON.stringify(toApiProduct(op.before))) throw new Error('O produto mudou no servidor. Recarregue a versão do servidor após revisar suas alterações.');
            await this.update((value) => ({ ...value, outbox: value.outbox.map((item) => item.id === op.id ? { ...item, baseRevision: remote.revision } : item) }));
            op = current.outbox[0];
          }
          if (disposed || !isAuthorized()) throw new Error('Entre novamente para sincronizar.');
          const result = await request(op.method === 'POST' ? '/api/products' : `/api/products/${encodeURIComponent(op.productId)}`, {
            method: op.method, body: { operationId: op.id, baseRevision: op.baseRevision, ...(op.product ? { product: toApiProduct(op.product) } : {}) },
          });
          let revision = null;
          if (op.method === 'DELETE') {
            if (result?.deleted !== op.productId) throw new Error('Confirmação de exclusão inválida. A alteração continua pendente.');
          } else {
            const confirmed = mapApiProducts({ products: [result?.product] })[0];
            if (confirmed.id !== op.productId || !/^[a-f0-9]{64}$/u.test(confirmed.revision ?? '')) throw new Error('Confirmação de produto inválida. A alteração continua pendente.');
            revision = confirmed.revision;
          }
          await this.update((value) => {
            // The ack removes only the sent operation; edits added during HTTP remain queued.
            let patched = false;
            const outbox = value.outbox.filter((item) => item.id !== op.id).map((item) => {
              if (patched || item.productId !== op.productId) return item;
              patched = true;
              return { ...item, baseRevision: revision };
            });
            return { ...value, outbox, catalogDirty: outbox.length > 0,
              catalog: value.catalog.map((item) => item.id === op.productId ? { ...item, revision } : item) };
          });
        }
        return await this.refresh(async () => mapApiProducts(await request('/api/products')));
      } finally { syncing = false; }
    },
    async discardCatalog(client) {
      if (syncing) throw new Error('Aguarde a sincronização terminar antes de recarregar.');
      await queue;
      const expected = current;
      const catalog = await client();
      return this.update((value) => {
        if (value !== expected) throw new Error('Houve outra alteração local. Revise novamente antes de descartar.');
        return { ...value, catalog, catalogDirty: false, legacyDirty: false, outbox: [] };
      });
    },
    dispose() {
      disposed = true;
      closePromise ??= queue.then(() => storage.close?.());
      return closePromise;
    },
  };
}

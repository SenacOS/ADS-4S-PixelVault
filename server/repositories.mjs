export function createRepositories(database) {
  const productRows = database.prepare(`
    SELECT
      p.id AS product_id,
      p.nome AS product_name,
      p.tipo AS product_type,
      p.preco_centavos AS price_cents,
      p.descricao AS description,
      la.id AS store_id,
      la.nome AS store_name,
      pc.id AS platform_id,
      pc.nome AS platform_name
    FROM produto p
    JOIN loja_ativacao la ON la.id = p.loja_ativacao_id
    LEFT JOIN compatibilidade_produto cp ON cp.produto_id = p.id
    LEFT JOIN plataforma_cloud pc ON pc.id = cp.plataforma_cloud_id
    ORDER BY p.nome COLLATE BINARY, p.id COLLATE BINARY,
             pc.nome COLLATE BINARY, pc.id COLLATE BINARY
  `);
  const userById = database.prepare('SELECT id FROM usuario WHERE id = ?');
  const libraryItems = database.prepare(`
    SELECT
      ib.id AS item_id,
      p.id AS product_id,
      p.nome AS product_name,
      p.tipo AS product_type,
      la.id AS store_id,
      la.nome AS store_name,
      ca.codigo AS activation_code
    FROM biblioteca b
    JOIN item_biblioteca ib ON ib.biblioteca_id = b.id
    JOIN produto p ON p.id = ib.produto_id
    JOIN loja_ativacao la ON la.id = p.loja_ativacao_id
    LEFT JOIN chave_ativacao ca ON ca.item_biblioteca_id = ib.id
    WHERE b.usuario_id = ?
    ORDER BY p.nome COLLATE BINARY, p.id COLLATE BINARY
  `);
  const orderById = database.prepare(`
    SELECT id, usuario_id, total_centavos
    FROM pedido
    WHERE id = ?
  `);
  const orderItems = database.prepare(`
    SELECT id, produto_id, preco_unitario_centavos
    FROM item_pedido
    WHERE pedido_id = ?
    ORDER BY id COLLATE BINARY
  `);
  const paymentByOrder = database.prepare(`
    SELECT id, pedido_id, status, valor_centavos, referencia_externa
    FROM pagamento
    WHERE pedido_id = ?
  `);
  const insertPayment = database.prepare(`
    INSERT INTO pagamento (id, pedido_id, status, valor_centavos, referencia_externa)
    VALUES (?, ?, ?, ?, ?)
  `);
  const libraryByUser = database.prepare('SELECT id FROM biblioteca WHERE usuario_id = ?');
  const insertLibrary = database.prepare('INSERT INTO biblioteca (id, usuario_id) VALUES (?, ?)');
  const libraryItemByProduct = database.prepare(`
    SELECT id FROM item_biblioteca WHERE biblioteca_id = ? AND produto_id = ?
  `);
  const insertLibraryItem = database.prepare(`
    INSERT INTO item_biblioteca (id, biblioteca_id, produto_id, item_pedido_id)
    VALUES (?, ?, ?, ?)
  `);
  const insertActivationKey = database.prepare(`
    INSERT INTO chave_ativacao (id, item_biblioteca_id, codigo)
    VALUES (?, ?, ?)
  `);

  return {
    listProducts() {
      const products = new Map();
      for (const row of productRows.all()) {
        let product = products.get(row.product_id);
        if (!product) {
          product = {
            id: row.product_id,
            name: row.product_name,
            type: row.product_type,
            priceCents: row.price_cents,
            description: row.description,
            activationStore: { id: row.store_id, name: row.store_name },
            cloudPlatforms: [],
          };
          products.set(row.product_id, product);
        }
        if (row.platform_id !== null) {
          product.cloudPlatforms.push({ id: row.platform_id, name: row.platform_name });
        }
      }
      return [...products.values()];
    },

    findUser(userId) {
      return userById.get(userId);
    },

    listLibrary(userId) {
      return libraryItems.all(userId).map((row) => ({
        id: row.item_id,
        product: { id: row.product_id, name: row.product_name, type: row.product_type },
        activationStore: { id: row.store_id, name: row.store_name },
        activationKey: row.activation_code === null
          ? null
          : { code: row.activation_code, fictional: true },
      }));
    },

    findOrder(orderId) {
      return orderById.get(orderId);
    },

    listOrderItems(orderId) {
      return orderItems.all(orderId);
    },

    findPaymentByOrder(orderId) {
      return paymentByOrder.get(orderId);
    },

    addPayment(payment) {
      insertPayment.run(
        payment.id,
        payment.orderId,
        payment.status,
        payment.valueCents,
        payment.externalReference,
      );
    },

    findLibraryByUser(userId) {
      return libraryByUser.get(userId);
    },

    addLibrary(libraryId, userId) {
      insertLibrary.run(libraryId, userId);
    },

    findLibraryItem(libraryId, productId) {
      return libraryItemByProduct.get(libraryId, productId);
    },

    addLibraryItem(item) {
      insertLibraryItem.run(item.id, item.libraryId, item.productId, item.orderItemId);
    },

    addActivationKey(key) {
      insertActivationKey.run(key.id, key.libraryItemId, key.code);
    },
  };
}

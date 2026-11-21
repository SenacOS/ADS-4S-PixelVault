function cents(value) {
  const result = Math.round(value * 100);
  if (!Number.isFinite(value) || !Number.isSafeInteger(result) || result < 0) throw new Error('Valor monetário inválido para exportação.');
  if (Math.abs(value * 100 - result) > 0.000001) {
    throw Object.assign(new Error('Corrija os preços para no máximo duas casas decimais antes de exportar.'), { code: 'INVALID_EXPORT_PRICE' });
  }
  return result;
}

function item(product) {
  if (!product || typeof product.id !== 'string' || typeof product.name !== 'string'
    || !['Jogo', 'DLC'].includes(product.type) || typeof product.description !== 'string' || typeof product.activationStore !== 'string'
    || !Array.isArray(product.compatibleWith) || !product.compatibleWith.every((name) => typeof name === 'string')) {
    throw new Error('Produto inválido para exportação.');
  }
  return { id: product.id, nome: product.name, tipo: product.type,
    precoCentavos: cents(product.price), descricao: product.description,
    lojaAtivacao: product.activationStore, plataformasCloud: [...product.compatibleWith] };
}

export function makeJsonExport(snapshot, userId, generatedAt = new Date()) {
  if (!snapshot || ![1, 2].includes(snapshot.version) || !Array.isArray(snapshot.catalog) || !snapshot.users) {
    throw new Error('Aguarde o carregamento dos dados locais.');
  }
  if (snapshot.outbox !== undefined && !Array.isArray(snapshot.outbox)) throw new Error('Estado de sincronização inválido.');
  const current = typeof userId === 'string' && Object.hasOwn(snapshot.users, userId) ? snapshot.users[userId] : { cart: [], library: [], order: null };
  const cart = current.cart.map(item);
  const orderItems = current.order ? current.order.items.map(item) : [];
  if (current.order && typeof current.order.id !== 'string') throw new Error('Pedido inválido para exportação.');
  const sum = (items) => {
    const total = items.reduce((value, product) => value + product.precoCentavos, 0);
    if (!Number.isSafeInteger(total)) throw new Error('Total inválido para exportação.');
    return total;
  };
  const timestamp = new Date(generatedAt).toISOString();
  // Export contract is intentionally independent from the internal snapshot.
  const data = {
    formato: 'pixelvault-dados', versao: 1, geradoEm: timestamp,
    demonstrativo: true, origem: 'cache-local', moeda: 'BRL',
    sincronizacao: { catalogoAlteradoLocalmente: Boolean(snapshot.catalogDirty),
      alteracoesPendentes: snapshot.outbox?.length ?? 0,
      legadoSemHistorico: Boolean(snapshot.legacyDirty || (snapshot.version === 1 && snapshot.catalogDirty)) },
    catalogo: snapshot.catalog.map(item), carrinho: cart, totalCarrinhoCentavos: sum(cart),
    biblioteca: (current.remoteLibrary ?? current.library).map(item),
    pedido: current.order ? { id: current.order.id, simulado: current.order.mode !== 'mercadopago-test', ...(current.order.mode === 'mercadopago-test' ? { ambiente: 'teste' } : {}), itens: orderItems, quantidade: orderItems.length, totalCentavos: sum(orderItems) } : null,
  };
  return { name: `pixelvault-dados-${timestamp.replace(/[:.]/gu, '-')}.json`, content: `${JSON.stringify(data, null, 2)}\n` };
}

export async function shareJsonFile(artifact, { available, write, share }) {
  if (!await available()) throw new Error('Compartilhamento de arquivos indisponível neste aparelho.');
  const uri = await write(artifact);
  await share(uri, { mimeType: 'application/json', UTI: 'public.json', dialogTitle: 'Exportar dados em JSON' });
  // The native API cannot distinguish sending from dismissing the share sheet.
  return 'Arquivo JSON preparado. Opções de compartilhamento encerradas.';
}

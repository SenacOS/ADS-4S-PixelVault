import { mapApiProducts } from './catalogApi.mjs';

export function validCheckoutUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ['www.mercadopago.com.br', 'sandbox.mercadopago.com.br'].includes(url.hostname)
      && !url.username && !url.password && !url.port;
  } catch { return false; }
}
export function mapCheckout(value) {
  if (!value || !/^[\w-]{16,100}$/u.test(value.id ?? '') || typeof value.orderId !== 'string'
    || value.environment !== 'test' || value.mode !== 'mercadopago'
    || !['PENDENTE', 'APROVADO', 'RECUSADO', 'CANCELADO'].includes(value.status)
    || !Number.isSafeInteger(value.totalCents) || value.totalCents <= 0
    || (value.checkoutUrl !== null && !validCheckoutUrl(value.checkoutUrl))) throw new Error('Resposta de checkout inválida.');
  const items = mapApiProducts({ products: value.items });
  if (!items.length || value.items.reduce((sum, item) => sum + item.priceCents, 0) !== value.totalCents) throw new Error('Resumo remoto inconsistente.');
  return { id: value.id, orderId: value.orderId, items, totalCents: value.totalCents, checkoutUrl: value.checkoutUrl, status: value.status, uncertain: Boolean(value.uncertain) };
}
export const checkoutMessage = (status) => ({
  PENDENTE: 'Pagamento pendente. Consulte novamente após concluir no Mercado Pago.',
  APROVADO: 'Pagamento aprovado e confirmado pelo servidor. Itens liberados na biblioteca.',
  RECUSADO: 'Pagamento recusado. Nenhum novo item foi liberado; tente novamente no mesmo checkout.',
  CANCELADO: 'Pagamento cancelado. Nenhum novo item foi liberado.',
}[status]);

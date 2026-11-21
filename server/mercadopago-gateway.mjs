import { AppError } from './errors.mjs';

const fail = () => new AppError(502, 'PAYMENT_PROVIDER_INVALID', 'A confirmação do Mercado Pago divergiu do pedido. Nenhum item foi liberado.');
export function checkoutUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !['www.mercadopago.com.br', 'sandbox.mercadopago.com.br'].includes(url.hostname)
      || url.username || url.password || url.port) throw fail();
    return url.href;
  } catch { throw fail(); }
}

export function createMercadoPagoGateway({ accessToken, environment, sellerId, buyerId, returnUrl, fetchImpl = globalThis.fetch, timeoutMs = 8000 }) {
  if (environment !== 'test' || !accessToken || !/^\d+$/u.test(String(sellerId)) || !/^\d+$/u.test(String(buyerId)) || String(sellerId) === String(buyerId)) {
    throw new Error('Configure credenciais, ambiente test e identificadores distintos de vendedor/comprador de teste.');
  }
  if (returnUrl) {
    const url = new URL(returnUrl);
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error('MERCADO_PAGO_RETURN_URL deve usar HTTPS.');
  }
  async function request(path, body) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(`https://api.mercadopago.com${path}`, {
        method: body ? 'POST' : 'GET', signal: controller.signal, redirect: 'error',
        headers: { Authorization: `Bearer ${accessToken}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      if (!response.ok) throw new AppError(502, 'PAYMENT_PROVIDER_UNAVAILABLE', 'Mercado Pago indisponível ou configuração recusada. Consulte novamente sem criar outro pedido.');
      return await response.json();
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(502, 'PAYMENT_PROVIDER_UNAVAILABLE', 'Não foi possível confirmar a comunicação com o Mercado Pago. Consulte novamente.');
    } finally { clearTimeout(timer); }
  }
  let identity;
  async function verifyTestIdentity() {
    if (!identity) identity = (async () => {
      const seller = await request('/users/me');
      const buyer = await request(`/users/${buyerId}`);
      if (String(seller.id) !== String(sellerId) || seller.site_id !== 'MLB' || !seller.tags?.includes('test_user')
        || String(buyer.id) !== String(buyerId) || buyer.site_id !== 'MLB'
        || (buyer.tags !== undefined && !buyer.tags.includes('test_user'))) {
        throw new AppError(503, 'TEST_ACCOUNT_REQUIRED', 'O checkout exige vendedor e comprador brasileiros de teste.');
      }
      return true;
    })().catch((error) => { identity = null; throw error; });
    return identity;
  }
  function validatePreference(pref, order) {
    if (typeof pref?.id !== 'string' || !/^[\w-]+$/u.test(pref.id) || String(pref.collector_id) !== String(sellerId)
      || pref.external_reference !== order.orderId || !Array.isArray(pref.items) || pref.items.length !== order.items.length) throw fail();
    const seen = new Set();
    for (const item of pref.items) {
      const expected = order.items.find((p) => p.id === item.id);
      if (!expected || seen.has(item.id) || item.quantity !== 1 || item.currency_id !== 'BRL'
        || typeof item.unit_price !== 'number' || Math.abs(item.unit_price * 100 - expected.priceCents) > 0.000001) throw fail();
      seen.add(item.id);
    }
    return { preferenceId: pref.id, checkoutUrl: checkoutUrl(pref.init_point) };
  }
  return {
    verifyTestIdentity,
    async create(order) {
      await verifyTestIdentity();
      const pref = await request('/checkout/preferences', {
        external_reference: order.orderId,
        metadata: { pixelvault_order_id: order.orderId, environment: 'test' },
        items: order.items.map((p) => ({ id: p.id, title: p.name, quantity: 1, currency_id: 'BRL', unit_price: p.priceCents / 100 })),
        ...(returnUrl ? { back_urls: { success: returnUrl, pending: returnUrl, failure: returnUrl } } : {}),
      });
      return validatePreference(pref, order);
    },
    async recover(order) {
      await verifyTestIdentity();
      const result = await request(`/checkout/preferences/search?external_reference=${encodeURIComponent(order.orderId)}&limit=2`);
      if (!Array.isArray(result.elements) || !Number.isInteger(result.total) || result.total > 1 || result.elements.length > 1) throw fail();
      if (result.total === 0 && result.elements.length === 0) return null;
      const candidate = result.elements[0];
      if (result.total !== 1 || typeof candidate?.id !== 'string' || !/^[\w-]+$/u.test(candidate.id)) throw fail();
      return validatePreference(await request(`/checkout/preferences/${candidate.id}`), order);
    },
    async reconcile(order) {
      await verifyTestIdentity();
      const found = await request(`/v1/payments/search?external_reference=${encodeURIComponent(order.orderId)}&sort=date_created&criteria=desc&limit=50`);
      if (!Array.isArray(found.results) || !Number.isInteger(found.paging?.total) || found.paging.total !== found.results.length || found.results.length > 50) throw fail();
      if (!found.results.length) return { status: 'PENDENTE', paymentId: null };
      const payments = [];
      const ids = new Set();
      for (const candidate of found.results) {
        if (!/^\d+$/u.test(String(candidate.id)) || ids.has(String(candidate.id))) throw fail();
        ids.add(String(candidate.id));
        const p = await request(`/v1/payments/${candidate.id}`);
        if (String(p.id) !== String(candidate.id) || p.external_reference !== order.orderId
          || String(p.collector_id) !== String(sellerId) || String(p.payer?.id) !== String(buyerId)
          || p.currency_id !== 'BRL' || typeof p.transaction_amount !== 'number'
          || Math.abs(p.transaction_amount * 100 - order.totalCents) > 0.000001
          || p.metadata?.pixelvault_order_id !== order.orderId || p.metadata?.environment !== 'test'
          || (p.transaction_amount_refunded ?? 0) !== 0 || p.status_detail === 'partially_refunded') throw fail();
        const status = { approved: 'APROVADO', pending: 'PENDENTE', in_process: 'PENDENTE', authorized: 'PENDENTE', rejected: 'RECUSADO', cancelled: 'CANCELADO' }[p.status];
        if (!status) throw fail();
        payments.push({ status, paymentId: String(p.id) });
      }
      const approved = payments.filter((p) => p.status === 'APROVADO');
      if (approved.length > 1) throw fail();
      return approved[0] ?? payments.find((p) => p.status === 'PENDENTE') ?? payments[0];
    },
  };
}

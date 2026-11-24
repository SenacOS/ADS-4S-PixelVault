// E2E fixture only: real PixelVault HTTP/SQLite, simulated Mercado Pago transport.
export function createCheckoutEvidenceProvider() {
  const state = { status: 'PENDENTE', creates: 0, preferences: new Map(), pauseCreation: false, release: null };
  return { state, gateway: {
    async verifyTestIdentity() {},
    async create(order) {
      if (state.pauseCreation) { await new Promise((resolve) => { state.release = resolve; }); state.release = null; }
      state.creates++;
      const result = { preferenceId: `fixture-${order.orderId}`, checkoutUrl: `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=fixture-${order.orderId}` };
      state.preferences.set(order.orderId, result); return result;
    },
    async recover(order) { return state.preferences.get(order.orderId) ?? null; },
    async reconcile() { return { status: state.status, paymentId: state.status === 'PENDENTE' ? null : String(900000 + state.creates) }; },
  } };
}

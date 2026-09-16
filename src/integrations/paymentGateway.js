const integrationSummary = Object.freeze({
  mode: 'simulated',
  status: 'Sem pagamento real nesta fase',
});

/**
 * Expõe o limite da integração sem conectar a serviços externos.
 *
 * @returns {{ mode: string, status: string }}
 */
export function getPaymentIntegrationSummary() {
  return integrationSummary;
}

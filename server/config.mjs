import { resolve } from 'node:path';

const PAYMENT_MODES = new Set(['simulated', 'mercadopago']);

export function loadConfig(environment = process.env) {
  const host = environment.API_HOST || '127.0.0.1';
  const rawPort = environment.API_PORT || '3000';
  const port = Number(rawPort);
  const paymentMode = environment.PAYMENT_MODE || 'simulated';
  let mercadoPago;
  if (paymentMode === 'mercadopago') {
    if (environment.MERCADO_PAGO_ENVIRONMENT !== 'test' || !environment.MERCADO_PAGO_ACCESS_TOKEN
      || !/^\d+$/u.test(environment.MERCADO_PAGO_TEST_SELLER_ID ?? '') || !/^\d+$/u.test(environment.MERCADO_PAGO_TEST_BUYER_ID ?? '')) {
      throw new Error('Configure MERCADO_PAGO_ENVIRONMENT=test, ACCESS_TOKEN e TEST_SELLER_ID/TEST_BUYER_ID no backend privado.');
    }
    mercadoPago = { environment: environment.MERCADO_PAGO_ENVIRONMENT, accessToken: environment.MERCADO_PAGO_ACCESS_TOKEN,
      sellerId: environment.MERCADO_PAGO_TEST_SELLER_ID, buyerId: environment.MERCADO_PAGO_TEST_BUYER_ID,
      returnUrl: environment.MERCADO_PAGO_RETURN_URL || undefined };
  }

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('API_PORT deve ser um número inteiro entre 1 e 65535.');
  }

  if (!PAYMENT_MODES.has(paymentMode)) {
    throw new Error('PAYMENT_MODE deve ser simulated ou mercadopago.');
  }

  return {
    host,
    port,
    paymentMode,
    mercadoPago,
    databasePath: resolve(environment.PIXELVAULT_DB_PATH || 'database/pixelvault.sqlite'),
  };
}

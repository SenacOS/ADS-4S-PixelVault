import { resolve } from 'node:path';

const PAYMENT_MODES = new Set(['simulated', 'mercadopago']);

export function loadConfig(environment = process.env) {
  const host = environment.API_HOST || '127.0.0.1';
  const rawPort = environment.API_PORT || '3000';
  const port = Number(rawPort);
  const paymentMode = environment.PAYMENT_MODE || 'simulated';

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
    databasePath: resolve(environment.PIXELVAULT_DB_PATH || 'database/pixelvault.sqlite'),
  };
}

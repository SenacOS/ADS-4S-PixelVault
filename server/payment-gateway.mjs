import { createHash } from 'node:crypto';

import { AppError } from './errors.mjs';

export class SimulatedPaymentGateway {
  createPayment({ idempotencyKey }) {
    const suffix = createHash('sha256').update(idempotencyKey).digest('hex').slice(0, 20).toUpperCase();
    return {
      status: 'APROVADO',
      externalReference: `FICTICIA-SIMULADA-${suffix}`,
    };
  }
}

export class UnavailableMercadoPagoGateway {
  createPayment() {
    throw new AppError(
      503,
      'PAYMENT_MODE_NOT_IMPLEMENTED',
      'O modo Mercado Pago não está implementado nesta versão.',
    );
  }
}

export function createPaymentGateway(paymentMode) {
  return paymentMode === 'simulated'
    ? new SimulatedPaymentGateway()
    : new UnavailableMercadoPagoGateway();
}

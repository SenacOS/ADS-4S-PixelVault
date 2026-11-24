import { randomUUID } from 'node:crypto';

import { AppError } from './errors.mjs';

const VALID_PAYMENT_STATES = new Set(['PENDENTE', 'APROVADO', 'RECUSADO', 'ERRO']);

function serializePayment(payment, paymentMode, created) {
  return {
    created,
    payment: {
      mode: paymentMode,
      pedidoId: payment.pedido_id,
      paymentId: payment.id,
      status: payment.status,
      valorCentavos: payment.valor_centavos,
      referencia: payment.referencia_externa,
    },
  };
}

export function createPaymentService({ database, repositories, gateway, paymentMode }) {
  return {
    create(orderId) {
      if (paymentMode !== 'simulated') {
        gateway.createPayment({
          pedidoId: orderId,
          valorCentavos: 0,
          idempotencyKey: `pixelvault:${orderId}`,
        });
      }

      database.exec('BEGIN IMMEDIATE;');
      try {
        const order = repositories.findOrder(orderId);
        if (!order) {
          throw new AppError(404, 'PEDIDO_NOT_FOUND', 'Pedido não encontrado.');
        }

        const items = repositories.listOrderItems(orderId);
        if (items.length === 0) {
          throw new AppError(409, 'EMPTY_ORDER', 'O pedido não possui itens.');
        }

        const itemsTotal = items.reduce(
          (total, item) => total + item.preco_unitario_centavos,
          0,
        );
        if (itemsTotal !== order.total_centavos) {
          throw new AppError(409, 'ORDER_TOTAL_MISMATCH', 'O total do pedido é inconsistente.');
        }

        const existingPayment = repositories.findPaymentByOrder(orderId);
        if (existingPayment) {
          if (existingPayment.valor_centavos !== order.total_centavos) {
            throw new AppError(
              409,
              'PAYMENT_VALUE_MISMATCH',
              'O pagamento existente possui valor inconsistente.',
            );
          }
          database.exec('COMMIT;');
          return serializePayment(existingPayment, paymentMode, false);
        }

        const paymentId = randomUUID();
        const gatewayResult = gateway.createPayment({
          pedidoId: orderId,
          valorCentavos: order.total_centavos,
          idempotencyKey: `pixelvault:${orderId}`,
        });

        if (!VALID_PAYMENT_STATES.has(gatewayResult.status)) {
          throw new Error('Gateway retornou um estado inválido.');
        }

        const payment = {
          id: paymentId,
          pedido_id: orderId,
          status: gatewayResult.status,
          valor_centavos: order.total_centavos,
          referencia_externa: gatewayResult.externalReference,
        };
        repositories.addPayment({
          id: payment.id,
          orderId,
          status: payment.status,
          valueCents: payment.valor_centavos,
          externalReference: payment.referencia_externa,
        });

        if (payment.status === 'APROVADO') {
          let library = repositories.findLibraryByUser(order.usuario_id);
          if (!library) {
            library = { id: randomUUID() };
            repositories.addLibrary(library.id, order.usuario_id);
          }

          for (const item of items) {
            if (repositories.findLibraryItem(library.id, item.produto_id)) {
              continue;
            }
            const libraryItemId = randomUUID();
            repositories.addLibraryItem({
              id: libraryItemId,
              libraryId: library.id,
              productId: item.produto_id,
              orderItemId: item.id,
            });
            const keyId = randomUUID();
            repositories.addActivationKey({
              id: keyId,
              libraryItemId,
              code: `PV-DEMO-FICTICIA-${keyId.toUpperCase()}`,
            });
          }
        }

        database.exec('COMMIT;');
        return serializePayment(payment, paymentMode, true);
      } catch (error) {
        try {
          database.exec('ROLLBACK;');
        } catch {
          // Preserve the original error if SQLite already closed the transaction.
        }
        throw error;
      }
    },
  };
}

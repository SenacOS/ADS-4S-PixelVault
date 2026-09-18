import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';

import { openDatabase } from './database.mjs';
import { AppError, errorResponse } from './errors.mjs';
import { createPaymentGateway } from './payment-gateway.mjs';
import { createPaymentService } from './payment-service.mjs';
import { createRepositories } from './repositories.mjs';

const JSON_CONTENT_TYPE = 'application/json; charset=utf-8';
const MAX_BODY_BYTES = 16 * 1024;
const FORBIDDEN_PAYMENT_FIELDS = new Set([
  'access_token', 'accesstoken', 'amount', 'card', 'card_number', 'cardnumber',
  'credential', 'credentials', 'cvv', 'expiry', 'expiration', 'nome_impresso',
  'nomeimpresso', 'numero_cartao', 'numerocartao', 'secret', 'token', 'total',
  'total_centavos', 'totalcentavos', 'validade', 'valor', 'valor_centavos',
  'valorcentavos',
]);

function sendJson(response, status, body, headers = {}) {
  response.writeHead(status, {
    'Content-Type': JSON_CONTENT_TYPE,
    ...headers,
  });
  response.end(JSON.stringify(body));
}

function safePathname(requestUrl) {
  try {
    return new URL(requestUrl || '/', 'http://127.0.0.1').pathname;
  } catch {
    return '/';
  }
}

function normalizedRoute(pathname) {
  if (/^\/api\/users\/[^/]*\/library$/u.test(pathname)) {
    return '/api/users/:userId/library';
  }
  return pathname;
}

function validateIdentifier(value, code) {
  if (
    typeof value !== 'string'
    || value.length === 0
    || value.length > 128
    || /[\u0000-\u001f\u007f]/u.test(value)
  ) {
    throw new AppError(400, code, 'Identificador inválido.');
  }
  return value;
}

async function readJsonBody(request) {
  const contentType = request.headers['content-type'];
  if (typeof contentType !== 'string' || contentType.split(';', 1)[0].trim().toLowerCase() !== 'application/json') {
    request.resume();
    throw new AppError(415, 'UNSUPPORTED_MEDIA_TYPE', 'O corpo deve usar application/json.');
  }

  const declaredLength = Number(request.headers['content-length']);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    request.resume();
    throw new AppError(413, 'BODY_TOO_LARGE', 'O corpo excede o limite permitido.');
  }

  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      throw new AppError(413, 'BODY_TOO_LARGE', 'O corpo excede o limite permitido.');
    }
    chunks.push(chunk);
  }

  if (size === 0) {
    throw new AppError(400, 'INVALID_BODY', 'O corpo da requisição é obrigatório.');
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new AppError(400, 'INVALID_JSON', 'O JSON informado é inválido.');
  }
}

function parsePaymentBody(body) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new AppError(400, 'INVALID_BODY', 'O corpo deve ser um objeto com pedidoId.');
  }

  const keys = Object.keys(body);
  const additionalFields = keys.filter((key) => key !== 'pedidoId');
  if (additionalFields.length > 0) {
    const forbidden = additionalFields.some((key) => FORBIDDEN_PAYMENT_FIELDS.has(key.toLowerCase()));
    throw new AppError(
      400,
      forbidden ? 'FORBIDDEN_PAYMENT_DATA' : 'UNSUPPORTED_FIELD',
      forbidden
        ? 'Dados financeiros ou credenciais não são aceitos.'
        : 'O corpo contém campo não suportado.',
    );
  }

  if (keys.length !== 1 || !Object.hasOwn(body, 'pedidoId')) {
    throw new AppError(400, 'INVALID_BODY', 'O campo pedidoId é obrigatório.');
  }

  return validateIdentifier(body.pedidoId, 'INVALID_PEDIDO_ID');
}

function methodNotAllowed(response, allowedMethod) {
  sendJson(
    response,
    405,
    { error: { code: 'METHOD_NOT_ALLOWED', message: 'Método não permitido.' } },
    { Allow: allowedMethod },
  );
}

export function createApplication({
  databasePath,
  paymentMode = 'simulated',
  logger = console,
  gateway = createPaymentGateway(paymentMode),
} = {}) {
  const database = openDatabase(databasePath);
  const repositories = createRepositories(database);
  const paymentService = createPaymentService({ database, repositories, gateway, paymentMode });

  const server = createServer(async (request, response) => {
    const startedAt = performance.now();
    const requestId = randomUUID();
    const pathname = safePathname(request.url);
    let responseStatus = 500;

    response.on('finish', () => {
      responseStatus = response.statusCode;
      logger.info?.({
        requestId,
        method: request.method,
        pathname: normalizedRoute(pathname),
        status: responseStatus,
        durationMs: Math.round(performance.now() - startedAt),
      });
    });

    try {
      if (pathname === '/health') {
        if (request.method !== 'GET') {
          methodNotAllowed(response, 'GET');
          return;
        }
        sendJson(response, 200, {
          status: 'ok',
          paymentMode,
          paymentAvailable: paymentMode === 'simulated',
        });
        return;
      }

      if (pathname === '/api/products') {
        if (request.method !== 'GET') {
          methodNotAllowed(response, 'GET');
          return;
        }
        sendJson(response, 200, { products: repositories.listProducts() });
        return;
      }

      const libraryMatch = /^\/api\/users\/([^/]*)\/library$/u.exec(pathname);
      if (libraryMatch) {
        if (request.method !== 'GET') {
          methodNotAllowed(response, 'GET');
          return;
        }
        let userId;
        try {
          userId = decodeURIComponent(libraryMatch[1]);
        } catch {
          throw new AppError(400, 'INVALID_USER_ID', 'Identificador de usuário inválido.');
        }
        validateIdentifier(userId, 'INVALID_USER_ID');
        if (!repositories.findUser(userId)) {
          throw new AppError(404, 'USER_NOT_FOUND', 'Usuário não encontrado.');
        }
        sendJson(response, 200, { userId, items: repositories.listLibrary(userId) });
        return;
      }

      if (pathname === '/api/payments') {
        if (request.method !== 'POST') {
          methodNotAllowed(response, 'POST');
          return;
        }
        const body = await readJsonBody(request);
        const orderId = parsePaymentBody(body);
        const result = paymentService.create(orderId);
        sendJson(response, result.created ? 201 : 200, result.payment);
        return;
      }

      throw new AppError(404, 'ROUTE_NOT_FOUND', 'Rota não encontrada.');
    } catch (error) {
      const failure = errorResponse(error);
      sendJson(response, failure.status, failure.body);
    }
  });

  let closed = false;
  return {
    server,
    database,
    async listen({ host = '127.0.0.1', port = 0 } = {}) {
      await new Promise((resolve, reject) => {
        const onError = (error) => reject(error);
        server.once('error', onError);
        server.listen(port, host, () => {
          server.off('error', onError);
          resolve();
        });
      });
      return server.address();
    },
    async close() {
      if (closed) return;
      closed = true;
      if (server.listening) {
        await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
      }
      database.close();
    },
  };
}

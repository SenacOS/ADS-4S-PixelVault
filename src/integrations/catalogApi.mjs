import { formatCurrency } from '../domain/prototypeLogic.mjs';

export function mapApiProducts(body) {
  if (!body || !Array.isArray(body.products)) throw new Error('Resposta de catálogo inválida.');
  const products = body.products.map((item) => {
    if (!item || typeof item.id !== 'string' || !item.id || typeof item.name !== 'string' || !item.name.trim()
      || !['JOGO', 'DLC'].includes(item.type) || !Number.isSafeInteger(item.priceCents) || item.priceCents <= 0
      || typeof item.description !== 'string' || typeof item.activationStore?.name !== 'string'
      || !Array.isArray(item.cloudPlatforms) || !item.cloudPlatforms.length
      || !item.cloudPlatforms.every((platform) => typeof platform?.name === 'string' && platform.name.length > 0)) {
      throw new Error('Resposta de catálogo inválida.');
    }
    const price = item.priceCents / 100;
    return {
      id: item.id, name: item.name, type: item.type === 'JOGO' ? 'Jogo' : 'DLC',
      price, priceLabel: formatCurrency(price), description: item.description,
      activationStore: item.activationStore.name,
      compatibleWith: item.cloudPlatforms.map((platform) => platform.name),
      activationKey: 'Chave fictícia de demonstração',
      revision: typeof item.revision === 'string' ? item.revision : null,
    };
  });
  if (new Set(products.map((item) => item.id)).size !== products.length) throw new Error('Produtos duplicados na API.');
  return products;
}

export async function fetchCatalog(baseUrl, { fetchImpl = globalThis.fetch, timeoutMs = 5000 } = {}) {
  if (!baseUrl || !/^https?:\/\//u.test(baseUrl)) throw new Error('Configure a URL da API para atualizar o catálogo.');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(`${baseUrl.replace(/\/$/u, '')}/api/products`, { signal: controller.signal });
    if (!response.ok) throw new Error('Não foi possível consultar o catálogo.');
    return mapApiProducts(await response.json());
  } finally {
    clearTimeout(timer);
  }
}

/** @param {string} baseUrl @param {string} path @param {{method?: string, body?: object, token?: string, fetchImpl?: typeof fetch, timeoutMs?: number}} options */
export async function catalogRequest(baseUrl, path, { method = 'GET', body, token, fetchImpl = globalThis.fetch, timeoutMs = 5000 } = {}) {
  if (!baseUrl || !/^https?:\/\//u.test(baseUrl)) throw new Error('Configure a URL da API.');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(`${baseUrl.replace(/\/$/u, '')}${path}`, {
      method, signal: controller.signal,
      headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    let result;
    try { result = await response.json(); }
    catch {
      throw Object.assign(new Error('Resposta inválida do servidor.'), { status: response.ok ? 502 : response.status });
    }
    if (!response.ok) {
      const error = new Error(result?.error?.message || 'Falha de comunicação com o servidor.');
      Object.assign(error, { status: response.status, code: result?.error?.code });
      throw error;
    }
    return result;
  } finally { clearTimeout(timer); }
}

export function toApiProduct(product) {
  const priceCents = Math.round(product.price * 100);
  if (!Number.isFinite(product.price) || !Number.isSafeInteger(priceCents) || priceCents < 1 || priceCents > 100000000 || Math.abs(product.price * 100 - priceCents) > 0.000001) {
    throw new Error('Preço inválido para sincronizar. Corrija o produto para um valor em centavos antes de reenviar.');
  }
  return { id: product.id, name: product.name, type: product.type === 'Jogo' ? 'JOGO' : 'DLC',
    priceCents, description: product.description,
    activationStore: product.activationStore, cloudPlatforms: [...product.compatibleWith].sort() };
}

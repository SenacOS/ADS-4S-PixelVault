export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function parsePrice(value) {
  const raw = String(value).trim().replace(/^R\$\s*/, '');
  const normalized = raw.includes(',') ? raw.replace(/\./g, '').replace(',', '.') : raw;
  const price = Number(normalized);
  return Number.isFinite(price) && price > 0 ? price : null;
}

export function filterProducts(products, filter) {
  return filter === 'Todos'
    ? products
    : products.filter((product) => product.compatibleWith.includes(filter));
}

export function addCartItem(items, product) {
  if (items.some((item) => item.id === product.id)) return { items, added: false };
  return { items: [...items, product], added: true };
}

export function removeCartItem(items, productId) {
  return items.filter((item) => item.id !== productId);
}

export function calculateTotal(items) {
  return Number(items.reduce((total, item) => total + item.price, 0).toFixed(2));
}

export function validateRequired(values, fields) {
  return Object.fromEntries(
    fields
      .filter((field) => !String(values[field] ?? '').trim())
      .map((field) => [field, 'Campo obrigatório.']),
  );
}

export function authenticate(accounts, email, password) {
  return accounts.find((account) => account.email.trim().toLowerCase() === email.trim().toLowerCase() && account.password === password) ?? null;
}

export function validateRegistration(accounts, form) {
  const errors = validateRequired(form, ['name', 'email', 'password']);
  if (!errors.email && accounts.some((account) => account.email.trim().toLowerCase() === form.email.trim().toLowerCase())) errors.email = 'E-mail já cadastrado.';
  return errors;
}

export function authenticateLocalPlayer(accounts, email, password) {
  return authenticate(accounts.filter((account) => account.role === 'player' && account.id?.startsWith('registered-')), email, password);
}

export function validateProductForm(form) {
  const errors = validateRequired(form, ['name', 'type', 'price', 'description', 'activationStore']);
  if (!['Jogo', 'DLC'].includes(form.type)) errors.type = 'Selecione Jogo ou DLC.';
  const price = parsePrice(form.price);
  if (price === null) errors.price = 'Informe um preço numérico positivo.';
  else {
    const cents = Math.round(price * 100);
    if (!Number.isSafeInteger(cents) || cents > 100000000) errors.price = 'Preço máximo permitido: R$ 1.000.000,00.';
    else if (Math.abs(price * 100 - cents) > 0.000001) errors.price = 'Use no máximo duas casas decimais.';
    else if (cents < 1) errors.price = 'Informe um preço de pelo menos R$ 0,01.';
  }
  for (const [field, max] of Object.entries({ name: 200, activationStore: 200, description: 2000 })) {
    const text = String(form[field] ?? '');
    if (text.length > max) errors[field] = `Use até ${max} caracteres.`;
    const invalidControl = field === 'description' ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/u : /[\u0000-\u001f]/u;
    if (invalidControl.test(text)) errors[field] = 'Remova os caracteres de controle inválidos.';
  }
  if (!form.compatibleWith?.length) errors.compatibleWith = 'Selecione ao menos um serviço cloud.';
  return errors;
}

export function createProduct(products, form, id) {
  const price = parsePrice(form.price);
  return [...products, { ...form, id, price, priceLabel: formatCurrency(price), activationKey: `PV-${id.toUpperCase()}-DEMO (chave fictícia)` }];
}

export function updateProduct(products, productId, form) {
  const price = parsePrice(form.price);
  return products.map((product) =>
    product.id === productId
      ? { ...product, ...form, price, priceLabel: formatCurrency(price) }
      : product,
  );
}

export function deleteProduct(products, productId) {
  return products.filter((product) => product.id !== productId);
}

export function addOrderToLibrary(library, order) {
  const knownIds = new Set(library.map((item) => item.id));
  return [...library, ...order.items.filter((item) => !knownIds.has(item.id))];
}

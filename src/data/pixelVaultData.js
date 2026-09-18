export const PRODUCTS = Object.freeze([
  Object.freeze({
    id: 'orbit-raiders',
    name: 'Orbit Raiders',
    type: 'Jogo',
    price: 79.9,
    priceLabel: 'R$ 79,90',
    compatibleWith: Object.freeze(['GeForce NOW', 'Boosteroid']),
    activationStore: 'Loja de demonstração (fictícia)',
    activationKey: 'PV-ORBIT-DEMO (chave fictícia)',
    description: 'Descrição demonstrativa. O conteúdo final ainda não foi aprovado.',
  }),
  Object.freeze({
    id: 'neon-expansion',
    name: 'Neon Expansion',
    type: 'DLC',
    price: 24.9,
    priceLabel: 'R$ 24,90',
    compatibleWith: Object.freeze(['GeForce NOW']),
    activationStore: 'Loja de demonstração (fictícia)',
    activationKey: 'PV-NEON-DEMO (chave fictícia)',
    description: 'Expansão demonstrativa para a jornada visual do PixelVault.',
  }),
]);

export const CART_SUMMARY = Object.freeze({
  quantity: 2,
  total: 104.8,
  totalLabel: 'R$ 104,80',
});

// Credenciais exclusivamente acadêmicas: não são segredos nem autenticação real.
export const DEMO_ACCOUNTS = Object.freeze([
  Object.freeze({ id: 'player-demo', name: 'Jogador de demonstração', email: 'jogador@pixelvault.example', password: 'demo123', role: 'player' }),
  Object.freeze({ id: 'admin-demo', name: 'Curador de demonstração', email: 'admin@pixelvault.example', password: 'demo123', role: 'admin' }),
]);

export const DEMO_ORDER = Object.freeze({
  id: 'PEDIDO-DEMO-001 (identificador fictício)',
  paymentNotice: 'Pagamento simulado — nenhuma cobrança será realizada',
});

export const DEMO_PROFILES = Object.freeze([
  Object.freeze({ id: 'player', label: 'Preencher jogador', accountId: 'player-demo' }),
  Object.freeze({
    id: 'admin',
    label: 'Preencher administrador',
    accountId: 'admin-demo',
  }),
]);

export const PLAYER_NAVIGATION = Object.freeze([
  Object.freeze({ label: 'Catálogo', destination: 'wf03' }),
  Object.freeze({ label: 'Carrinho', destination: 'wf05' }),
  Object.freeze({ label: 'Biblioteca', destination: 'wf08' }),
]);

export const FEEDBACKS = Object.freeze({
  registration: 'Cadastro concluído. Entre com as credenciais de demonstração.',
  added: 'Item adicionado ao carrinho.',
  duplicate: 'Este item já está no carrinho.',
  created: 'Item cadastrado na lista local.',
  updated: 'Alterações salvas na lista local.',
  deleted: 'Item excluído da lista local.',
});

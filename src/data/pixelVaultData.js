export const PRODUCTS = Object.freeze([
  Object.freeze({
    id: 'orbit-raiders',
    name: 'Orbit Raiders',
    type: 'Jogo',
    price: 79.9,
    priceLabel: 'R$ 79,90',
    compatibleWith: Object.freeze(['GeForce NOW', 'Boosteroid']),
    activationStore: 'PixelVault',
    activationKey: 'PV-ORBIT-7K2M',
    description: 'Aventura cooperativa entre estações orbitais e mundos distantes.',
  }),
  Object.freeze({
    id: 'neon-expansion',
    name: 'Neon Expansion',
    type: 'DLC',
    price: 24.9,
    priceLabel: 'R$ 24,90',
    compatibleWith: Object.freeze(['GeForce NOW']),
    activationStore: 'PixelVault',
    activationKey: 'PV-NEON-4P8R',
    description: 'Expansão com novas missões, cenários e desafios em Neon City.',
  }),
]);

export const CART_SUMMARY = Object.freeze({
  quantity: 2,
  total: 104.8,
  totalLabel: 'R$ 104,80',
});

// Credenciais exclusivamente acadêmicas: não são segredos nem autenticação real.
export const DEMO_ACCOUNTS = Object.freeze([
  Object.freeze({
    id: 'player-demo',
    name: 'Jogador de demonstração',
    email: 'jogador@pixelvault.example',
    password: 'demo123',
    role: 'player',
  }),
  Object.freeze({
    id: 'admin-demo',
    name: 'Curador de demonstração',
    email: 'admin@pixelvault.example',
    password: 'demo123',
    role: 'admin',
  }),
]);

export const PLAYER_NAVIGATION = Object.freeze([
  Object.freeze({ label: 'Catálogo', destination: 'wf03' }),
  Object.freeze({ label: 'Carrinho', destination: 'wf05' }),
  Object.freeze({ label: 'Biblioteca', destination: 'wf08' }),
]);

export const FEEDBACKS = Object.freeze({
  registration: 'Cadastro concluído. Entre com suas credenciais.',
  added: 'Item adicionado ao carrinho.',
  duplicate: 'Este item já está no carrinho.',
  created: 'Item cadastrado com sucesso.',
  updated: 'Alterações salvas com sucesso.',
  deleted: 'Item excluído com sucesso.',
});

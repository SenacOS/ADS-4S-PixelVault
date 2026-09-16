PRAGMA foreign_keys = ON;

BEGIN IMMEDIATE;

INSERT INTO usuario (id, nome, email, senha_hash, papel) VALUES
  ('player-demo', 'Jogador de demonstração', 'jogador@pixelvault.example', 'HASH-FICTICIO-NAO-AUTENTICAVEL-PLAYER', 'JOGADOR'),
  ('admin-demo', 'Curador de demonstração', 'admin@pixelvault.example', 'HASH-FICTICIO-NAO-AUTENTICAVEL-ADMIN', 'ADMIN');

INSERT INTO loja_ativacao (id, nome) VALUES
  ('loja-demo', 'Loja de demonstração (fictícia)');

INSERT INTO plataforma_cloud (id, nome) VALUES
  ('geforce-now', 'GeForce NOW'),
  ('boosteroid', 'Boosteroid');

INSERT INTO produto (id, loja_ativacao_id, nome, tipo, preco_centavos, descricao) VALUES
  ('orbit-raiders', 'loja-demo', 'Orbit Raiders', 'JOGO', 7990, 'Descrição demonstrativa. O conteúdo final ainda não foi aprovado.'),
  ('neon-expansion', 'loja-demo', 'Neon Expansion', 'DLC', 2490, 'Expansão demonstrativa para a jornada visual do PixelVault.');

INSERT INTO compatibilidade_produto (produto_id, plataforma_cloud_id) VALUES
  ('orbit-raiders', 'geforce-now'),
  ('orbit-raiders', 'boosteroid'),
  ('neon-expansion', 'geforce-now');

INSERT INTO carrinho (id, usuario_id) VALUES
  ('carrinho-player-demo', 'player-demo');

INSERT INTO pedido (id, usuario_id, total_centavos) VALUES
  ('pedido-demo-001', 'player-demo', 10480);

INSERT INTO item_pedido (id, pedido_id, produto_id, preco_unitario_centavos) VALUES
  ('item-pedido-orbit-001', 'pedido-demo-001', 'orbit-raiders', 7990),
  ('item-pedido-neon-001', 'pedido-demo-001', 'neon-expansion', 2490);

INSERT INTO pagamento (id, pedido_id, status, valor_centavos, referencia_externa) VALUES
  ('pagamento-demo-001', 'pedido-demo-001', 'APROVADO', 10480, 'REFERENCIA-TESTE-SEM-VALOR-COMERCIAL');

INSERT INTO biblioteca (id, usuario_id) VALUES
  ('biblioteca-player-demo', 'player-demo');

INSERT INTO item_biblioteca (id, biblioteca_id, produto_id, item_pedido_id) VALUES
  ('item-biblioteca-orbit-001', 'biblioteca-player-demo', 'orbit-raiders', 'item-pedido-orbit-001'),
  ('item-biblioteca-neon-001', 'biblioteca-player-demo', 'neon-expansion', 'item-pedido-neon-001');

INSERT INTO chave_ativacao (id, item_biblioteca_id, codigo) VALUES
  ('chave-orbit-001', 'item-biblioteca-orbit-001', 'PV-ORBIT-DEMO-CHAVE-FICTICIA'),
  ('chave-neon-001', 'item-biblioteca-neon-001', 'PV-NEON-DEMO-CHAVE-FICTICIA');

COMMIT;

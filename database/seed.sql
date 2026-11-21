PRAGMA foreign_keys = ON;

BEGIN IMMEDIATE;

INSERT INTO usuario (id, nome, email, senha_hash, papel) VALUES
  ('player-demo', 'Jogador de demonstração', 'jogador@pixelvault.example', 'scrypt:pixelvault-demo-player-demo:fad0b44ced80548fe54faedce1acfc0f69b615169fc2c12f4f5480e012299360924b6d38294f464de5a279cb5d78a5681956c6ee9f52141500ac7064390bd7c3', 'JOGADOR'),
  ('admin-demo', 'Curador de demonstração', 'admin@pixelvault.example', 'scrypt:pixelvault-demo-admin-demo:e275dcbcd5a0aa2a5089087ce5c02fb3e1d467481e1ff95fb5000c8d99c715d94b8bdbddca10efc8c5dc8c5f6e3a45ae30faa34278f830ec5bdd8f22914d50ae', 'ADMIN');

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

-- Catálogo ampliado: 30 jogos adicionais, também usados pelo cache e migração legada.
INSERT INTO produto (id, loja_ativacao_id, nome, tipo, preco_centavos, descricao) VALUES
  ('pv-aurora-quest', 'loja-demo', 'Aurora Quest', 'JOGO', 1990, 'Explore florestas luminosas e encontre relíquias perdidas. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-crystal-harbor', 'loja-demo', 'Crystal Harbor', 'JOGO', 2690, 'Navegue entre ilhas e descubra histórias à beira-mar. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-solar-drifters', 'loja-demo', 'Solar Drifters', 'JOGO', 3390, 'Pilote uma nave por planetas e estações distantes. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-ember-citadel', 'loja-demo', 'Ember Citadel', 'JOGO', 4090, 'Defenda uma fortaleza e desvende caminhos secretos. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-moonlight-valley', 'loja-demo', 'Moonlight Valley', 'JOGO', 4790, 'Atravesse montanhas e vales em uma jornada de exploração. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-iron-circuit', 'loja-demo', 'Iron Circuit', 'JOGO', 5490, 'Corra por uma cidade futurista repleta de desafios. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-skybound-isles', 'loja-demo', 'Skybound Isles', 'JOGO', 6190, 'Explore florestas luminosas e encontre relíquias perdidas. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-ocean-echoes', 'loja-demo', 'Ocean Echoes', 'JOGO', 6890, 'Navegue entre ilhas e descubra histórias à beira-mar. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-frostfall-keep', 'loja-demo', 'Frostfall Keep', 'JOGO', 7590, 'Pilote uma nave por planetas e estações distantes. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-desert-horizon', 'loja-demo', 'Desert Horizon', 'JOGO', 8290, 'Defenda uma fortaleza e desvende caminhos secretos. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-prism-runner', 'loja-demo', 'Prism Runner', 'JOGO', 8990, 'Atravesse montanhas e vales em uma jornada de exploração. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-starlight-nomads', 'loja-demo', 'Starlight Nomads', 'JOGO', 9690, 'Corra por uma cidade futurista repleta de desafios. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-verdant-guardians', 'loja-demo', 'Verdant Guardians', 'JOGO', 1990, 'Explore florestas luminosas e encontre relíquias perdidas. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-thunder-peaks', 'loja-demo', 'Thunder Peaks', 'JOGO', 2690, 'Navegue entre ilhas e descubra histórias à beira-mar. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-coral-odyssey', 'loja-demo', 'Coral Odyssey', 'JOGO', 3390, 'Pilote uma nave por planetas e estações distantes. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-clockwork-haven', 'loja-demo', 'Clockwork Haven', 'JOGO', 4090, 'Defenda uma fortaleza e desvende caminhos secretos. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-obsidian-knights', 'loja-demo', 'Obsidian Knights', 'JOGO', 4790, 'Atravesse montanhas e vales em uma jornada de exploração. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-comet-trails', 'loja-demo', 'Comet Trails', 'JOGO', 5490, 'Corra por uma cidade futurista repleta de desafios. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-saffron-dunes', 'loja-demo', 'Saffron Dunes', 'JOGO', 6190, 'Explore florestas luminosas e encontre relíquias perdidas. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-misty-outpost', 'loja-demo', 'Misty Outpost', 'JOGO', 6890, 'Navegue entre ilhas e descubra histórias à beira-mar. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-glacier-voyage', 'loja-demo', 'Glacier Voyage', 'JOGO', 7590, 'Pilote uma nave por planetas e estações distantes. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-tidal-legends', 'loja-demo', 'Tidal Legends', 'JOGO', 8290, 'Defenda uma fortaleza e desvende caminhos secretos. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-copper-canyon', 'loja-demo', 'Copper Canyon', 'JOGO', 8990, 'Atravesse montanhas e vales em uma jornada de exploração. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-celestial-forge', 'loja-demo', 'Celestial Forge', 'JOGO', 9690, 'Corra por uma cidade futurista repleta de desafios. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-jade-expedition', 'loja-demo', 'Jade Expedition', 'JOGO', 1990, 'Explore florestas luminosas e encontre relíquias perdidas. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-midnight-metro', 'loja-demo', 'Midnight Metro', 'JOGO', 2690, 'Navegue entre ilhas e descubra histórias à beira-mar. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-silver-summit', 'loja-demo', 'Silver Summit', 'JOGO', 3390, 'Pilote uma nave por planetas e estações distantes. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-sunken-compass', 'loja-demo', 'Sunken Compass', 'JOGO', 4090, 'Defenda uma fortaleza e desvende caminhos secretos. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-crimson-bastion', 'loja-demo', 'Crimson Bastion', 'JOGO', 4790, 'Atravesse montanhas e vales em uma jornada de exploração. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.'),
  ('pv-zenith-frontier', 'loja-demo', 'Zenith Frontier', 'JOGO', 5490, 'Corra por uma cidade futurista repleta de desafios. Jogo fictício para aprendizado; compatibilidade cloud ilustrativa.');

INSERT INTO compatibilidade_produto (produto_id, plataforma_cloud_id) VALUES
  ('pv-aurora-quest', 'geforce-now'),
  ('pv-aurora-quest', 'boosteroid'),
  ('pv-crystal-harbor', 'geforce-now'),
  ('pv-solar-drifters', 'boosteroid'),
  ('pv-ember-citadel', 'geforce-now'),
  ('pv-ember-citadel', 'boosteroid'),
  ('pv-moonlight-valley', 'geforce-now'),
  ('pv-iron-circuit', 'boosteroid'),
  ('pv-skybound-isles', 'geforce-now'),
  ('pv-skybound-isles', 'boosteroid'),
  ('pv-ocean-echoes', 'geforce-now'),
  ('pv-frostfall-keep', 'boosteroid'),
  ('pv-desert-horizon', 'geforce-now'),
  ('pv-desert-horizon', 'boosteroid'),
  ('pv-prism-runner', 'geforce-now'),
  ('pv-starlight-nomads', 'boosteroid'),
  ('pv-verdant-guardians', 'geforce-now'),
  ('pv-verdant-guardians', 'boosteroid'),
  ('pv-thunder-peaks', 'geforce-now'),
  ('pv-coral-odyssey', 'boosteroid'),
  ('pv-clockwork-haven', 'geforce-now'),
  ('pv-clockwork-haven', 'boosteroid'),
  ('pv-obsidian-knights', 'geforce-now'),
  ('pv-comet-trails', 'boosteroid'),
  ('pv-saffron-dunes', 'geforce-now'),
  ('pv-saffron-dunes', 'boosteroid'),
  ('pv-misty-outpost', 'geforce-now'),
  ('pv-glacier-voyage', 'boosteroid'),
  ('pv-tidal-legends', 'geforce-now'),
  ('pv-tidal-legends', 'boosteroid'),
  ('pv-copper-canyon', 'geforce-now'),
  ('pv-celestial-forge', 'boosteroid'),
  ('pv-jade-expedition', 'geforce-now'),
  ('pv-jade-expedition', 'boosteroid'),
  ('pv-midnight-metro', 'geforce-now'),
  ('pv-silver-summit', 'boosteroid'),
  ('pv-sunken-compass', 'geforce-now'),
  ('pv-sunken-compass', 'boosteroid'),
  ('pv-crimson-bastion', 'geforce-now'),
  ('pv-zenith-frontier', 'boosteroid');

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

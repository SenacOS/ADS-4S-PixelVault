PRAGMA foreign_keys = ON;

BEGIN IMMEDIATE;

CREATE TABLE usuario (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE CHECK (email = lower(email)),
  senha_hash TEXT NOT NULL,
  papel TEXT NOT NULL CHECK (papel IN ('JOGADOR', 'ADMIN'))
);

CREATE TABLE loja_ativacao (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE
);

CREATE TABLE plataforma_cloud (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE
);

CREATE TABLE produto (
  id TEXT PRIMARY KEY,
  loja_ativacao_id TEXT NOT NULL,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('JOGO', 'DLC')),
  preco_centavos INTEGER NOT NULL CHECK (preco_centavos > 0),
  descricao TEXT NOT NULL,
  FOREIGN KEY (loja_ativacao_id) REFERENCES loja_ativacao(id) ON DELETE RESTRICT
);

CREATE TABLE compatibilidade_produto (
  produto_id TEXT NOT NULL,
  plataforma_cloud_id TEXT NOT NULL,
  PRIMARY KEY (produto_id, plataforma_cloud_id),
  FOREIGN KEY (produto_id) REFERENCES produto(id) ON DELETE RESTRICT,
  FOREIGN KEY (plataforma_cloud_id) REFERENCES plataforma_cloud(id) ON DELETE RESTRICT
);

CREATE TABLE carrinho (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL UNIQUE,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE RESTRICT
);

CREATE TABLE item_carrinho (
  carrinho_id TEXT NOT NULL,
  produto_id TEXT NOT NULL,
  PRIMARY KEY (carrinho_id, produto_id),
  FOREIGN KEY (carrinho_id) REFERENCES carrinho(id) ON DELETE CASCADE,
  FOREIGN KEY (produto_id) REFERENCES produto(id) ON DELETE RESTRICT
);

CREATE TABLE pedido (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  total_centavos INTEGER NOT NULL CHECK (total_centavos > 0),
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE RESTRICT
);

CREATE TABLE item_pedido (
  id TEXT PRIMARY KEY,
  pedido_id TEXT NOT NULL,
  produto_id TEXT NOT NULL,
  preco_unitario_centavos INTEGER NOT NULL CHECK (preco_unitario_centavos > 0),
  UNIQUE (pedido_id, produto_id),
  FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE RESTRICT,
  FOREIGN KEY (produto_id) REFERENCES produto(id) ON DELETE RESTRICT
);

CREATE TABLE pagamento (
  id TEXT PRIMARY KEY,
  pedido_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('PENDENTE', 'APROVADO', 'RECUSADO', 'ERRO')),
  valor_centavos INTEGER NOT NULL CHECK (valor_centavos > 0),
  referencia_externa TEXT UNIQUE,
  FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE RESTRICT
);

CREATE TABLE biblioteca (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL UNIQUE,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE RESTRICT
);

CREATE TABLE item_biblioteca (
  id TEXT PRIMARY KEY,
  biblioteca_id TEXT NOT NULL,
  produto_id TEXT NOT NULL,
  item_pedido_id TEXT NOT NULL UNIQUE,
  UNIQUE (biblioteca_id, produto_id),
  FOREIGN KEY (biblioteca_id) REFERENCES biblioteca(id) ON DELETE RESTRICT,
  FOREIGN KEY (produto_id) REFERENCES produto(id) ON DELETE RESTRICT,
  FOREIGN KEY (item_pedido_id) REFERENCES item_pedido(id) ON DELETE RESTRICT
);

CREATE TABLE chave_ativacao (
  id TEXT PRIMARY KEY,
  item_biblioteca_id TEXT NOT NULL UNIQUE,
  codigo TEXT NOT NULL UNIQUE,
  FOREIGN KEY (item_biblioteca_id) REFERENCES item_biblioteca(id) ON DELETE RESTRICT
);

CREATE INDEX idx_produto_loja_ativacao ON produto(loja_ativacao_id);
CREATE INDEX idx_compatibilidade_plataforma ON compatibilidade_produto(plataforma_cloud_id);
CREATE INDEX idx_item_carrinho_produto ON item_carrinho(produto_id);
CREATE INDEX idx_pedido_usuario ON pedido(usuario_id);
CREATE INDEX idx_item_pedido_produto ON item_pedido(produto_id);
CREATE INDEX idx_item_biblioteca_produto ON item_biblioteca(produto_id);

-- Invariantes transacionais reservadas para a camada de servico do Prompt 15:
-- 1. cada produto deve possuir ao menos uma compatibilidade;
-- 2. pedido.total_centavos deve igualar a soma de seus itens;
-- 3. pagamento.valor_centavos deve igualar pedido.total_centavos;
-- 4. a biblioteca so recebe itens apos pagamento APROVADO.

COMMIT;

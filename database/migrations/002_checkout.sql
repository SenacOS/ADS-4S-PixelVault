CREATE TABLE IF NOT EXISTS checkout_operation (
  id TEXT PRIMARY KEY,
  pedido_id TEXT NOT NULL UNIQUE REFERENCES pedido(id) ON DELETE RESTRICT,
  usuario_id TEXT NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
  signature TEXT NOT NULL,
  snapshot TEXT NOT NULL,
  phase TEXT NOT NULL DEFAULT 'NEW' CHECK (phase IN ('NEW','REQUESTING','READY')),
  preference_id TEXT UNIQUE,
  checkout_url TEXT,
  status TEXT NOT NULL DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE','APROVADO','RECUSADO','CANCELADO')),
  payment_id TEXT UNIQUE
);
CREATE INDEX IF NOT EXISTS idx_checkout_usuario ON checkout_operation(usuario_id);

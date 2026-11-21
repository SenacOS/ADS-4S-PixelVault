-- Additive: preserves the relational data and historical purchases.
CREATE TABLE IF NOT EXISTS catalog_operation (
  id TEXT PRIMARY KEY,
  actor_id TEXT NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
  request_hash TEXT NOT NULL,
  response_json TEXT NOT NULL
);

// The mobile cache is separate from the server's relational database.
export const VAULT_SCHEMA = `
  CREATE TABLE IF NOT EXISTS mobile_vault (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    payload TEXT NOT NULL
  );
`;

export function createSQLiteStorage(database) {
  return {
    async load() {
      await database.execAsync(VAULT_SCHEMA);
      const row = await database.getFirstAsync('SELECT payload FROM mobile_vault WHERE id = 1');
      return row ? JSON.parse(row.payload) : null;
    },
    async save(value) {
      await database.runAsync(
        'INSERT INTO mobile_vault (id, payload) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET payload = excluded.payload',
        JSON.stringify(value),
      );
    },
    async close() { await database.closeAsync?.(); },
  };
}

export function createBrowserStorage(storage) {
  const key = 'pixelvault.mobile.v1';
  return {
    async load() {
      const value = storage.getItem(key);
      return value === null ? null : JSON.parse(value);
    },
    async save(value) { storage.setItem(key, JSON.stringify(value)); },
  };
}

import { openDatabaseAsync } from 'expo-sqlite';

import { createSQLiteStorage } from './vaultStorage.mjs';

export async function openStorage() {
  const database = await openDatabaseAsync('pixelvault-mobile.sqlite');
  return createSQLiteStorage(database);
}

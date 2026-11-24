import { createBrowserStorage } from './vaultStorage.mjs';

export async function openStorage() {
  return createBrowserStorage(window.localStorage);
}

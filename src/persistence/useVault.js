import { useEffect, useRef, useState } from 'react';

import { PRODUCTS } from '../data/pixelVaultData';
import { catalogRequest, fetchCatalog } from '../integrations/catalogApi.mjs';
import { createCatalogSession, createSessionRequest } from '../integrations/catalogSession.mjs';
import { openStorage } from './openStorage';
import { createVault } from './vault.mjs';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export function useVault() {
  const [data, setData] = useState(null);
  const [storageError, setStorageError] = useState('');
  const [networkMessage, setNetworkMessage] = useState('Catálogo disponível no dispositivo.');
  const [syncing, setSyncing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const vault = useRef(null);
  const [session] = useState(() => createCatalogSession((path, options) => catalogRequest(apiUrl, path, options)));

  useEffect(() => {
    let active = true;
    let instance;
    async function initialize() {
      try {
        const storage = await openStorage();
        if (!active) { await storage.close?.(); return; }
        instance = createVault({ storage, initialProducts: PRODUCTS, catalogAdditions: PRODUCTS.slice(2), catalogEdition: 2, onChange(value) { if (active) setData(value); } });
        await instance.load();
        if (!active) { await instance.dispose(); return; }
        vault.current = instance;
        setStorageError('');
        if (apiUrl) {
          setSyncing(true);
          try {
            const updated = await instance.refresh(() => fetchCatalog(apiUrl));
            if (active) setNetworkMessage(updated ? 'Catálogo atualizado pela API.' : 'Dados locais mais recentes preservados. Consulte as pendências no painel de sincronização.');
          } catch {
            if (active) setNetworkMessage('API indisponível. Continue com o catálogo salvo no dispositivo.');
          } finally {
            if (active) setSyncing(false);
          }
        }
      } catch {
        await instance?.dispose().catch(() => {});
        if (active) setStorageError('Não foi possível abrir os dados locais. Os dados existentes foram preservados. Tente novamente.');
      }
    }
    void initialize();
    return () => {
      active = false;
      session.logout();
      void instance?.dispose().catch(() => {});
      vault.current = null;
    };
  }, [attempt, session]);

  async function update(transform) {
    setSaving(true);
    try {
      if (!vault.current) throw new Error('Armazenamento indisponível.');
      await vault.current.update(transform);
      setStorageError('');
      return true;
    } catch {
      setStorageError('Não foi possível salvar. A alteração não foi confirmada; tente novamente.');
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function refresh() {
    if (!vault.current || syncing) return;
    setSyncing(true);
    try {
      const auth = session.current;
      if (auth?.user.role === 'admin') {
        const updated = await vault.current.synchronize((path, options) => catalogRequest(apiUrl, path, { ...options, token: auth.token }), auth.user.id, () => session.current === auth);
        if (updated) setNetworkMessage('Catálogo sincronizado com o servidor.');
      } else {
        const updated = await vault.current.refresh(() => fetchCatalog(apiUrl));
        setNetworkMessage(updated ? 'Catálogo atualizado pela API.' : 'Alterações pendentes preservadas. Entre no administrador para sincronizar.');
      }
    } catch (error) {
      setNetworkMessage(apiUrl ? `Sincronização pendente: ${error.message}` : 'Configure EXPO_PUBLIC_API_URL para sincronizar. Os dados locais foram mantidos.');
    } finally {
      setSyncing(false);
    }
  }

  async function login(email, password) {
    if (!apiUrl) return null;
    try {
      const user = await session.login(email, password);
      setNetworkMessage('Conectado ao servidor. Use Sincronizar catálogo para enviar alterações pendentes.');
      return user;
    } catch (error) {
      if (error.cancelled) throw error;
      session.logout();
      if (error.status) throw error;
      setNetworkMessage('Modo offline demonstrativo. Entre novamente com a API disponível para sincronizar.');
      return null;
    }
  }

  function logout() {
    session.logout();
  }

  function useLocalProfile() {
    session.logout();
    setNetworkMessage('Conta local demonstrativa, não cadastrada no servidor.');
  }

  function isRemoteUser(id) { return session.current?.user.id === id; }
  const checkoutRequest = createSessionRequest(session, (path, options) => catalogRequest(apiUrl, path, options));

  async function changeCatalog(method, id, product, actorId) {
    setSaving(true);
    try {
      await vault.current.changeCatalog(method, id, product, actorId);
      setStorageError('');
      setNetworkMessage('Alteração salva no dispositivo; envio ao servidor pendente.');
      return true;
    } catch (error) {
      setStorageError(`Não foi possível confirmar a alteração: ${error.message}`);
      return false;
    } finally { setSaving(false); }
  }

  async function discardCatalog() {
    setSaving(true);
    try {
      await vault.current.discardCatalog(() => fetchCatalog(apiUrl));
      setStorageError('');
      setNetworkMessage('Catálogo do servidor recuperado. Alterações locais descartadas por confirmação.');
    } catch (error) { setNetworkMessage(`Não foi possível recarregar: ${error.message}`); }
    finally { setSaving(false); }
  }

  return { data, update, refresh, login, logout, useLocalProfile, isRemoteUser, checkoutRequest, connected: Boolean(apiUrl), changeCatalog, discardCatalog, storageError, networkMessage, syncing, saving, retry: () => setAttempt((value) => value + 1) };
}

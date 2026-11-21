// Credentials live only in this instance, never in the local vault.
export function createSessionRequest(session, request) {
  return async (id, path, options = {}) => {
    const auth = session.current;
    if (!auth || auth.user.id !== id) throw new Error('Entre novamente com uma conta do servidor e a API disponível para pagar em teste.');
    let result;
    try { result = await request(path, { ...options, token: auth.token, timeoutMs: 30000 }); }
    catch (error) {
      if (session.current !== auth) throw Object.assign(new Error('Operação cancelada após sair do perfil.'), { cancelled: true });
      throw error;
    }
    if (session.current !== auth) throw Object.assign(new Error('Operação cancelada após sair do perfil.'), { cancelled: true });
    return result;
  };
}

export function createCatalogSession(request) {
  let current = null;
  let generation = 0;
  const cancelled = () => Object.assign(new Error('Login cancelado.'), { cancelled: true });
  return {
    get current() { return current; },
    async login(email, password) {
      const attempt = ++generation;
      let auth;
      try { auth = await request('/api/sessions', { method: 'POST', body: { email, password } }); }
      catch (error) { if (generation !== attempt) throw cancelled(); throw error; }
      if (generation !== attempt) {
        if (auth?.token) void request('/api/sessions/current', { method: 'DELETE', token: auth.token }).catch(() => {});
        throw cancelled();
      }
      if (!/^[a-f0-9]{64}$/u.test(auth?.token ?? '') || typeof auth?.user?.id !== 'string' || !['admin', 'player'].includes(auth?.user?.role)) {
        throw Object.assign(new Error('Resposta de autenticação inválida.'), { status: 502 });
      }
      current = auth;
      return auth.user;
    },
    logout() {
      generation += 1;
      const auth = current;
      current = null;
      if (auth) void request('/api/sessions/current', { method: 'DELETE', token: auth.token }).catch(() => {});
    },
  };
}

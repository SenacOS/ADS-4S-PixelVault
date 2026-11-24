import { useRef, useState } from 'react';
import { Linking, View } from 'react-native';

import AccessScreens from './AccessScreens';
import AdminScreens from './AdminScreens';
import StorefrontScreens from './StorefrontScreens';
import { getInitialDemoRoute } from '../data/demoRoutes';
import { DEMO_ACCOUNTS, FEEDBACKS, PRODUCTS } from '../data/pixelVaultData';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import FeedbackBanner from '../components/FeedbackBanner';
import ScreenShell from '../components/ScreenShell';
import { useVault } from '../persistence/useVault';
import { userData } from '../persistence/vault.mjs';
import { makeJsonExport } from '../domain/jsonExport.mjs';
import { deliverJson } from '../integrations/exportDelivery';
import { mapApiProducts } from '../integrations/catalogApi.mjs';
import { checkoutMessage, mapCheckout, validCheckoutUrl } from '../integrations/checkoutClient.mjs';
import {
  addCartItem, addOrderToLibrary, authenticate, authenticateLocalPlayer, calculateTotal, createProduct,
  filterProducts, removeCartItem, updateProduct,
  validateProductForm, validateRegistration, validateRequired,
} from '../domain/prototypeLogic.mjs';

const ACCESS_ROUTES = new Set(['wf01', 'wf02', 'st01']);
const ADMIN_ROUTES = new Set(['wf09', 'wf10-new', 'wf10-edit', 'wf11']);
const EMPTY_ADMIN_FORM = Object.freeze({ name: '', type: '', price: '', description: '', compatibleWith: [], activationStore: '' });
const INITIAL_ACCOUNTS = /** @type {Array<{ id: string, name: string, email: string, password: string, role: string }>} */ (
  DEMO_ACCOUNTS.map((account) => ({ ...account }))
);

function productToForm(product) {
  if (!product) return { ...EMPTY_ADMIN_FORM, compatibleWith: [] };
  return { name: product.name, type: product.type, price: String(product.price).replace('.', ','), description: product.description, compatibleWith: [...product.compatibleWith], activationStore: product.activationStore };
}

export default function PixelVaultApp() {
  const vault = useVault();
  const [route, setRoute] = useState(getInitialDemoRoute);
  const [profile, setProfile] = useState(null);
  const catalog = vault.data?.catalog ?? [];
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
  const [checkoutForm, setCheckoutForm] = useState({ cardNumber: '', printedName: '' });
  const [adminForm, setAdminForm] = useState(productToForm());
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [discardConfirmation, setDiscardConfirmation] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [exporting, setExporting] = useState(false);
  const exportLock = useRef(false);
  const checkoutLock = useRef(false);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [remoteCheckout, setRemoteCheckout] = useState(null);
  const profileRef = useRef(profile);
  profileRef.current = profile;
  // Direct evidence routes retain the original demo player context.
  const userId = profile?.id ?? 'player-demo';
  const currentUser = vault.data && (!vault.connected || profile) ? userData(vault.data, userId) : { cart: [], library: [], order: null };
  const { cart, order } = currentUser;
  const library = vault.connected ? currentUser.remoteLibrary ?? [] : currentUser.library;

  function updateUser(transform) {
    return vault.update((current) => ({ ...current, users: { ...current.users, [userId]: transform(userData(current, userId)) } }));
  }

  const selectedProduct = catalog.find((product) => product.id === selectedProductId) ?? catalog[0] ?? null;
  const cartTotal = calculateTotal(cart);

  async function exportJson() {
    if (exportLock.current || !vault.data || vault.saving) return;
    exportLock.current = true;
    setExporting(true);
    try {
      const artifact = makeJsonExport(vault.data, profile?.id);
      const message = await deliverJson(artifact);
      setFeedback({ message, tone: 'info' });
    } catch (error) {
      setFeedback({ message: error.code === 'INVALID_EXPORT_PRICE' ? error.message : 'Não foi possível exportar o JSON. Tente novamente.', tone: 'error' });
    } finally { exportLock.current = false; setExporting(false); }
  }

  function navigate(destination) {
    if (destination === 'wf01') { vault.logout(); profileRef.current = null; setProfile(null); setRemoteCheckout(null); setCheckoutForm({ cardNumber: '', printedName: '' }); setLoginForm({ email: '', password: '' }); }
    setErrors({}); setFeedback(null); setRoute(destination);
  }

  async function submitLogin() {
    if (loggingIn) return;
    const fieldErrors = validateRequired(loginForm, ['email', 'password']);
    let account = null;
    if (!Object.keys(fieldErrors).length) {
      setLoggingIn(true);
      try {
        const local = authenticateLocalPlayer(accounts, loginForm.email, loginForm.password);
        if (local) { vault.useLocalProfile(); account = local; }
        else account = await vault.login(loginForm.email.trim(), loginForm.password) ?? authenticate(accounts, loginForm.email, loginForm.password);
      }
      catch (error) { if (!error.cancelled) { setErrors({ email: error.message }); setRoute('st01'); } return; }
      finally { setLoggingIn(false); }
    }
    if (!account) {
      setErrors(Object.keys(fieldErrors).length ? fieldErrors : { email: 'E-mail ou senha não reconhecidos.' });
      setFeedback(null); setRoute('st01'); return;
    }
    setProfile(account); profileRef.current = account; setRemoteCheckout(null); setLoginForm({ email: '', password: '' }); setErrors({}); setFeedback(null); setRoute(account.role === 'admin' ? 'wf09' : 'wf03');
    if (vault.isRemoteUser(account.id)) {
      try { await restoreRemoteLibrary(account.id); }
      catch (error) { if (profileRef.current?.id === account.id && !error.cancelled) setFeedback({ message: 'Biblioteca remota indisponível. Consulte novamente com a API disponível.', tone: 'error' }); }
    }
  }

  function submitRegistration() {
    const fieldErrors = validateRegistration(accounts, registerForm);
    if (Object.keys(fieldErrors).length) { setErrors(fieldErrors); return; }
    const account = { ...registerForm, name: registerForm.name.trim(), email: registerForm.email.trim().toLowerCase(), id: `registered-${Date.now()}-${Math.random().toString(36).slice(2)}`, role: 'player' };
    setAccounts((current) => [...current, account]);
    setLoginForm({ email: account.email, password: account.password });
    setRegisterForm({ name: '', email: '', password: '' }); setErrors({});
    setFeedback({ message: FEEDBACKS.registration, tone: 'success' }); setRoute('wf01');
  }

  function openDetails(productId) { setSelectedProductId(productId); navigate('wf04'); }

  async function addSelectedToCart() {
    if (!selectedProduct) return;
    const result = addCartItem(cart, selectedProduct);
    const saved = await updateUser((current) => ({ ...current, cart: addCartItem(current.cart, selectedProduct).items }));
    if (!saved) return;
    setFeedback({ message: result.added ? FEEDBACKS.added : FEEDBACKS.duplicate, tone: result.added ? 'success' : 'info' });
  }

  async function submitCheckout() {
    if (vault.connected) { await prepareRemoteCheckout(); return; }
    const fieldErrors = validateRequired(checkoutForm, ['cardNumber', 'printedName']);
    if (Object.keys(fieldErrors).length) { setErrors(fieldErrors); setRoute('st05'); return; }
    if (!cart.length) { setFeedback({ message: 'Adicione um item antes de confirmar a compra.', tone: 'error' }); return; }
    const nextOrder = { id: `PEDIDO-DEMO-${String(Date.now()).slice(-6)} (identificador fictício)`, items: [...cart], quantity: cart.length, total: calculateTotal(cart) };
    const saved = await updateUser((current) => ({ ...current, order: nextOrder, library: addOrderToLibrary(current.library, nextOrder) }));
    if (!saved) return;
    setCheckoutForm({ cardNumber: '', printedName: '' }); setErrors({}); setFeedback(null); setRoute('wf07');
  }

  async function restoreRemoteLibrary(actorId) {
    const body = await vault.checkoutRequest(actorId, '/api/me/library');
    const remoteLibrary = mapApiProducts(body);
    if (profileRef.current?.id !== actorId || !vault.isRemoteUser(actorId)) return;
    const saved = await vault.update((current) => ({ ...current, users: { ...current.users,
      [actorId]: { ...userData(current, actorId), remoteLibrary } } }));
    if (!saved) throw new Error('Não foi possível salvar a biblioteca confirmada. Consulte novamente.');
  }

  async function remoteAction(action) {
    if (checkoutLock.current) return;
    checkoutLock.current = true; setCheckoutBusy(true);
    const actorId = profileRef.current?.id;
    try {
      if (!actorId || !vault.isRemoteUser(actorId)) throw new Error('Entre novamente com uma conta do servidor e a API disponível para continuar a compra.');
      await action(actorId);
    } catch (error) {
      if (!error.cancelled && profileRef.current?.id === actorId) setFeedback({ message: error.message, tone: 'error' });
    } finally { checkoutLock.current = false; setCheckoutBusy(false); }
  }

  async function prepareRemoteCheckout() {
    await remoteAction(async (actorId) => {
      let pending = currentUser.remoteCheckout;
      if (!pending) {
        if (!cart.length) throw new Error('Adicione um produto ao carrinho.');
        pending = { id: `checkout-${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`, productIds: cart.map((item) => item.id) };
        const saved = await updateUser((current) => ({ ...current, remoteCheckout: pending }));
        if (!saved) return;
      }
      let body;
      try { body = await vault.checkoutRequest(actorId, '/api/checkouts', { method: 'POST', body: { requestId: pending.id, productIds: pending.productIds } }); }
      catch (error) {
        if ([400, 409, 503].includes(error.status)) {
          try { await vault.checkoutRequest(actorId, `/api/checkouts/${pending.id}`); }
          catch (lookupError) {
            // Clear only after an authenticated 404 proves no owned order exists.
            if (lookupError.status === 404 && vault.isRemoteUser(actorId)) await updateUser((current) => ({ ...current, remoteCheckout: current.remoteCheckout?.id === pending.id ? null : current.remoteCheckout }));
          }
        }
        throw error;
      }
      const result = mapCheckout(body);
      if (profileRef.current?.id !== actorId || !vault.isRemoteUser(actorId)) return;
      setRemoteCheckout(result);
      setFeedback({ message: result.uncertain ? 'Criação ainda não confirmada. Retome este pedido para consultar sem duplicar.' : checkoutMessage(result.status), tone: 'info' });
    });
  }

  async function reconcileCheckout() {
    await remoteAction(async (actorId) => {
      const pending = currentUser.remoteCheckout;
      if (!pending) throw new Error('Prepare um pedido primeiro.');
      const result = mapCheckout(await vault.checkoutRequest(actorId, `/api/checkouts/${pending.id}/reconcile`, { method: 'POST', body: {} }));
      if (result.status === 'APROVADO') {
        await restoreRemoteLibrary(actorId);
        const saved = await updateUser((current) => ({ ...current, order: { id: result.orderId, items: result.items, quantity: result.items.length, total: result.totalCents / 100, mode: 'mercadopago-test' } }));
        if (!saved) return;
      }
      if (profileRef.current?.id !== actorId || !vault.isRemoteUser(actorId)) return;
      setRemoteCheckout(result); setFeedback({ message: checkoutMessage(result.status), tone: result.status === 'APROVADO' ? 'success' : 'info' });
      if (result.status === 'APROVADO') setRoute('wf07');
    });
  }

  async function openRemoteCheckout() {
    await remoteAction(async () => {
      if (!validCheckoutUrl(remoteCheckout?.checkoutUrl)) throw new Error('Retome o pedido para obter uma URL de checkout válida.');
      await Linking.openURL(remoteCheckout.checkoutUrl);
    });
  }

  async function newRemoteOrder() {
    await remoteAction(async (actorId) => {
      const pending = currentUser.remoteCheckout;
      if (!pending) return;
      const confirmed = mapCheckout(await vault.checkoutRequest(actorId, `/api/checkouts/${pending.id}`));
      if (confirmed.status !== 'APROVADO') throw new Error('Consulte o pedido atual antes de iniciar outro.');
      const saved = await updateUser((current) => ({ ...current, remoteCheckout: null }));
      if (saved && profileRef.current?.id === actorId && vault.isRemoteUser(actorId)) { setRemoteCheckout(null); setFeedback(null); setRoute('wf05'); }
    });
  }

  function openAdminForm(mode, productId) {
    const product = catalog.find((item) => item.id === productId);
    if (productId) setSelectedProductId(productId);
    setAdminForm(mode === 'edit' ? productToForm(product) : productToForm());
    navigate(mode === 'edit' ? 'wf10-edit' : 'wf10-new');
  }

  async function submitAdminForm(mode) {
    const fieldErrors = validateProductForm(adminForm);
    if (Object.keys(fieldErrors).length) { setErrors(fieldErrors); return; }
    const id = mode === 'edit' ? selectedProductId : `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const product = mode === 'edit' ? updateProduct(catalog, id, adminForm).find((item) => item.id === id) : createProduct([], adminForm, id)[0];
    const saved = await vault.changeCatalog(mode === 'edit' ? 'PUT' : 'POST', id, product, profile?.id ?? 'admin-demo');
    if (!saved) return;
    if (mode === 'edit') {
      setFeedback({ message: FEEDBACKS.updated, tone: 'success' });
    } else {
      setFeedback({ message: FEEDBACKS.created, tone: 'success' });
    }
    setErrors({}); setRoute('wf09');
  }

  async function confirmDelete() {
    if (!await vault.changeCatalog('DELETE', selectedProductId, null, profile?.id ?? 'admin-demo')) return;
    setFeedback({ message: FEEDBACKS.deleted, tone: 'success' }); setRoute('wf09');
  }

  if (!vault.data) return <ScreenShell title="Preparando seus dados"><AppText>Carregando dados salvos no dispositivo...</AppText>{vault.storageError ? <><FeedbackBanner message={vault.storageError} tone="error" /><AppButton label="Tentar abrir novamente" onPress={vault.retry} /></> : null}</ScreenShell>;

  const exportButton = profile?.role === 'admin' ? <AppButton label={exporting ? 'Preparando JSON...' : 'Exportar dados em JSON'} disabled={exporting || vault.saving} onPress={exportJson} variant="ghost" /> : null;
  const shared = { route, onNavigate: navigate, feedback, errors, exportButton,
    connected: vault.connected, checkoutBusy, remoteCheckout, hasPendingCheckout: Boolean(currentUser.remoteCheckout),
    onOpenRemoteCheckout: openRemoteCheckout, onReconcileCheckout: reconcileCheckout, onNewRemoteOrder: newRemoteOrder,
    onRefreshLibrary: () => remoteAction(restoreRemoteLibrary) };
  function frame(content) {
    return <View testID={`pixelvault-route-${route}`} style={{ flex: 1 }}><View pointerEvents={vault.saving || loggingIn ? 'none' : 'auto'} style={{ flex: 1 }}>{content}</View>{loggingIn ? <AppText>Validando acesso...</AppText> : null}{vault.saving ? <AppText>Salvando no dispositivo...</AppText> : null}{vault.storageError ? <FeedbackBanner message={vault.storageError} tone="error" /> : null}</View>;
  }
  if (ACCESS_ROUTES.has(route)) {
    return frame(<AccessScreens {...shared} accounts={accounts} loginForm={loginForm} onChangeLogin={setLoginForm} onChangeRegister={setRegisterForm} onSubmitLogin={submitLogin} onSubmitRegistration={submitRegistration} registerForm={registerForm} />);
  }
  if (ADMIN_ROUTES.has(route)) {
    const syncPanel = <View style={{ gap: 8 }}><AppButton label={vault.syncing ? 'Atualizando catálogo...' : 'Atualizar catálogo da API'} disabled={vault.syncing} onPress={vault.refresh} variant="ghost" /><FeedbackBanner message={vault.networkMessage} /><AppText>{vault.data.outbox.length} alterações pendentes de envio.{vault.data.legacyDirty ? ' Catálogo antigo: revise os dados antes de recarregar.' : ''}</AppText><AppButton label={vault.syncing ? 'Sincronizando...' : 'Sincronizar catálogo'} disabled={vault.syncing} onPress={vault.refresh} variant="secondary" />{vault.data.catalogDirty ? <AppButton label={discardConfirmation ? 'Confirmar descarte e recarregar' : 'Recarregar versão do servidor'} disabled={vault.syncing} onPress={() => { if (discardConfirmation) { void vault.discardCatalog(); setDiscardConfirmation(false); } else setDiscardConfirmation(true); }} variant="ghost" /> : null}{discardConfirmation ? <><AppText>As alterações locais do catálogo serão descartadas. Carrinho e biblioteca serão mantidos.</AppText><AppButton label="Cancelar descarte" onPress={() => setDiscardConfirmation(false)} variant="ghost" /></> : null}</View>;
    return frame(<AdminScreens {...shared} syncPanel={syncPanel} adminForm={adminForm} catalog={catalog} onChangeAdminForm={setAdminForm} onConfirmDelete={confirmDelete} onOpenForm={openAdminForm} onSelectProduct={setSelectedProductId} onSubmitAdminForm={submitAdminForm} selectedProduct={selectedProduct} />);
  }
  return frame(<StorefrontScreens {...shared} activeFilter={activeFilter} cart={cart} cartTotal={cartTotal} catalog={catalog} checkoutForm={checkoutForm} filteredProducts={filterProducts(catalog, activeFilter)} library={library} networkMessage={vault.networkMessage} syncing={vault.syncing} onRefreshCatalog={vault.refresh} onAddToCart={addSelectedToCart} onChangeCheckout={setCheckoutForm} onChangeFilter={setActiveFilter} onOpenDetails={openDetails} onRemoveFromCart={(id) => updateUser((current) => ({ ...current, cart: removeCartItem(current.cart, id) }))} onSubmitCheckout={submitCheckout} order={order} profile={profile} selectedProduct={selectedProduct} />);
}

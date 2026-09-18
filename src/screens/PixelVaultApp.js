import { useRef, useState } from 'react';

import AccessScreens from './AccessScreens';
import AdminScreens from './AdminScreens';
import StorefrontScreens from './StorefrontScreens';
import { getInitialDemoRoute } from '../data/demoRoutes';
import { DEMO_ACCOUNTS, FEEDBACKS, PRODUCTS } from '../data/pixelVaultData';
import {
  addCartItem, addOrderToLibrary, authenticate, calculateTotal, createProduct,
  deleteProduct, filterProducts, removeCartItem, updateProduct,
  validateProductForm, validateRequired,
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
  const [route, setRoute] = useState(getInitialDemoRoute);
  const [profile, setProfile] = useState(null);
  const [catalog, setCatalog] = useState(() => PRODUCTS.map((product) => ({ ...product, compatibleWith: [...product.compatibleWith] })));
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [cart, setCart] = useState([]);
  const [library, setLibrary] = useState([]);
  const [order, setOrder] = useState(null);
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
  const [checkoutForm, setCheckoutForm] = useState({ cardNumber: '', printedName: '' });
  const [adminForm, setAdminForm] = useState(productToForm());
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const localId = useRef(0);

  const selectedProduct = catalog.find((product) => product.id === selectedProductId) ?? catalog[0] ?? null;
  const cartTotal = calculateTotal(cart);

  function navigate(destination) { setErrors({}); setFeedback(null); setRoute(destination); }

  function submitLogin() {
    const fieldErrors = validateRequired(loginForm, ['email', 'password']);
    const account = Object.keys(fieldErrors).length ? null : authenticate(accounts, loginForm.email, loginForm.password);
    if (!account) {
      setErrors(Object.keys(fieldErrors).length ? fieldErrors : { email: 'Credencial de demonstração não reconhecida.' });
      setFeedback(null); setRoute('st01'); return;
    }
    setProfile(account); setErrors({}); setFeedback(null); setRoute(account.role === 'admin' ? 'wf09' : 'wf03');
  }

  function submitRegistration() {
    const fieldErrors = validateRequired(registerForm, ['name', 'email', 'password']);
    if (Object.keys(fieldErrors).length) { setErrors(fieldErrors); return; }
    const account = { ...registerForm, id: `registered-${accounts.length + 1}`, role: 'player' };
    setAccounts((current) => [...current, account]);
    setLoginForm({ email: account.email, password: account.password });
    setRegisterForm({ name: '', email: '', password: '' }); setErrors({});
    setFeedback({ message: FEEDBACKS.registration, tone: 'success' }); setRoute('wf01');
  }

  function openDetails(productId) { setSelectedProductId(productId); navigate('wf04'); }

  function addSelectedToCart() {
    if (!selectedProduct) return;
    const result = addCartItem(cart, selectedProduct);
    setCart(result.items);
    setFeedback({ message: result.added ? FEEDBACKS.added : FEEDBACKS.duplicate, tone: result.added ? 'success' : 'info' });
  }

  function submitCheckout() {
    const fieldErrors = validateRequired(checkoutForm, ['cardNumber', 'printedName']);
    if (Object.keys(fieldErrors).length) { setErrors(fieldErrors); setRoute('st05'); return; }
    const nextOrder = { id: `PEDIDO-DEMO-${String(Date.now()).slice(-6)} (identificador fictício)`, items: [...cart], quantity: cart.length, total: calculateTotal(cart) };
    setOrder(nextOrder); setLibrary((current) => addOrderToLibrary(current, nextOrder));
    setCheckoutForm({ cardNumber: '', printedName: '' }); setErrors({}); setFeedback(null); setRoute('wf07');
  }

  function openAdminForm(mode, productId) {
    const product = catalog.find((item) => item.id === productId);
    if (productId) setSelectedProductId(productId);
    setAdminForm(mode === 'edit' ? productToForm(product) : productToForm());
    navigate(mode === 'edit' ? 'wf10-edit' : 'wf10-new');
  }

  function submitAdminForm(mode) {
    const fieldErrors = validateProductForm(adminForm);
    if (Object.keys(fieldErrors).length) { setErrors(fieldErrors); return; }
    if (mode === 'edit') {
      setCatalog((current) => updateProduct(current, selectedProductId, adminForm));
      setFeedback({ message: FEEDBACKS.updated, tone: 'success' });
    } else {
      localId.current += 1;
      setCatalog((current) => createProduct(current, adminForm, `local-${localId.current}`));
      setFeedback({ message: FEEDBACKS.created, tone: 'success' });
    }
    setErrors({}); setRoute('wf09');
  }

  function confirmDelete() {
    setCatalog((current) => deleteProduct(current, selectedProductId));
    setFeedback({ message: FEEDBACKS.deleted, tone: 'success' }); setRoute('wf09');
  }

  const shared = { route, onNavigate: navigate, feedback, errors };
  if (ACCESS_ROUTES.has(route)) {
    return <AccessScreens {...shared} accounts={accounts} loginForm={loginForm} onChangeLogin={setLoginForm} onChangeRegister={setRegisterForm} onSubmitLogin={submitLogin} onSubmitRegistration={submitRegistration} registerForm={registerForm} />;
  }
  if (ADMIN_ROUTES.has(route)) {
    return <AdminScreens {...shared} adminForm={adminForm} catalog={catalog} onChangeAdminForm={setAdminForm} onConfirmDelete={confirmDelete} onOpenForm={openAdminForm} onSelectProduct={setSelectedProductId} onSubmitAdminForm={submitAdminForm} selectedProduct={selectedProduct} />;
  }
  return <StorefrontScreens {...shared} activeFilter={activeFilter} cart={cart} cartTotal={cartTotal} catalog={catalog} checkoutForm={checkoutForm} filteredProducts={filterProducts(catalog, activeFilter)} library={library} onAddToCart={addSelectedToCart} onChangeCheckout={setCheckoutForm} onChangeFilter={setActiveFilter} onOpenDetails={openDetails} onRemoveFromCart={(id) => setCart((current) => removeCartItem(current, id))} onSubmitCheckout={submitCheckout} order={order} profile={profile} selectedProduct={selectedProduct} />;
}

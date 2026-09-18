import { FlatList, StyleSheet, View } from 'react-native';

import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import BottomNavigation from '../components/BottomNavigation';
import EmptyState from '../components/EmptyState';
import FeedbackBanner from '../components/FeedbackBanner';
import LabeledField from '../components/LabeledField';
import ProductCard from '../components/ProductCard';
import ScreenShell from '../components/ScreenShell';
import { DEMO_ORDER } from '../data/pixelVaultData';
import { formatCurrency } from '../domain/prototypeLogic.mjs';
import { colors, radius, spacing } from '../theme/tokens';

const PLAYER_ROUTES = new Set(['wf03', 'wf04', 'wf05', 'wf08', 'st02', 'st03', 'st04']);

export default function StorefrontScreens(props) {
  const footer = PLAYER_ROUTES.has(props.route) ? <BottomNavigation active={activeDestination(props.route)} onNavigate={props.onNavigate} /> : undefined;
  if (props.route === 'wf03' || props.route === 'st02') return <CatalogScreen {...props} footer={footer} />;
  if (props.route === 'wf04') return <DetailScreen {...props} footer={footer} />;
  if (props.route === 'wf05' || props.route === 'st03') return <CartScreen {...props} footer={footer} />;
  if (props.route === 'wf06' || props.route === 'st05') return <CheckoutScreen {...props} />;
  if (props.route === 'wf07') return <ResultScreen {...props} />;
  return <LibraryScreen {...props} footer={footer} />;
}

function activeDestination(route) {
  if (route === 'wf05' || route === 'st03') return 'wf05';
  if (route === 'wf08' || route === 'st04') return 'wf08';
  return 'wf03';
}

function CatalogScreen({ activeFilter, cart, feedback, filteredProducts, footer, onChangeFilter, onNavigate, onOpenDetails, route }) {
  const products = route === 'st02' ? [] : filteredProducts;
  const header = (
    <View style={styles.listHeader}>
      <View accessibilityLabel={`Filtro ativo: ${activeFilter}`} style={styles.filterGroup}>
        {['Todos', 'GeForce NOW', 'Boosteroid'].map((filter) => <AppButton key={filter} label={`${activeFilter === filter ? 'Selecionado: ' : ''}${filter}`} onPress={() => onChangeFilter(filter)} variant={activeFilter === filter ? 'primary' : 'ghost'} />)}
      </View>
      {cart.length ? <FeedbackBanner message={`${cart.length} ${cart.length === 1 ? 'item' : 'itens'} no carrinho.`} /> : null}
      {feedback ? <FeedbackBanner message={feedback.message} tone={feedback.tone} /> : null}
    </View>
  );
  return (
    <ScreenShell eyebrow={products.length ? 'WF-03 · CATÁLOGO' : 'ST-02 · CATÁLOGO VAZIO'} title="Descobrir jogos" description="Catálogo local demonstrativo. Compatibilidade cloud pode mudar." footer={footer} scroll={false}>
      <FlatList data={products} keyExtractor={(item) => item.id} ListHeaderComponent={header} ListEmptyComponent={<EmptyState actionLabel="Limpar filtro" description={`Nenhum item encontrado para o filtro ativo ${activeFilter}.`} onAction={() => { onChangeFilter('Todos'); onNavigate('wf03'); }} title="Nenhum resultado" />} ListFooterComponent={<AppButton label="Sair do perfil" onPress={() => onNavigate('wf01')} variant="ghost" />} ItemSeparatorComponent={Separator} renderItem={({ item }) => <ProductCard product={item}><AppButton label={`Ver detalhes de ${item.name}`} onPress={() => onOpenDetails(item.id)} /></ProductCard>} contentContainerStyle={styles.listContent} keyboardShouldPersistTaps="handled" />
    </ScreenShell>
  );
}

function DetailScreen({ cart, feedback, footer, onAddToCart, onNavigate, selectedProduct }) {
  if (!selectedProduct) return <ScreenShell eyebrow="WF-04 · DETALHES" title="Item indisponível"><EmptyState actionLabel="Voltar ao catálogo" description="O item selecionado não existe mais na lista local." onAction={() => onNavigate('wf03')} title="Produto não encontrado" /></ScreenShell>;
  const inCart = cart.some((item) => item.id === selectedProduct.id);
  return (
    <ScreenShell eyebrow="WF-04 · DETALHES" title={selectedProduct.name} footer={footer}>
      <ProductCard product={selectedProduct} />
      <View style={styles.section}><AppText variant="heading">Compatível com</AppText><AppText>{selectedProduct.compatibleWith.join(', ')}</AppText><AppText variant="secondary">A disponibilidade nos serviços cloud pode mudar.</AppText></View>
      <View style={styles.section}><AppText variant="heading">Ativação em</AppText><AppText>{selectedProduct.activationStore}</AppText></View>
      {feedback ? <FeedbackBanner message={feedback.message} tone={feedback.tone} /> : null}
      <View style={styles.actions}>
        <AppButton label={inCart ? 'Já está no carrinho' : 'Adicionar ao carrinho'} onPress={onAddToCart} variant={inCart ? 'secondary' : 'primary'} />
        <AppButton label={`Ver carrinho (${cart.length})`} onPress={() => onNavigate('wf05')} />
        <AppButton label="Voltar ao catálogo" onPress={() => onNavigate('wf03')} variant="ghost" />
      </View>
    </ScreenShell>
  );
}

function CartScreen({ cart, cartTotal, footer, onNavigate, onRemoveFromCart }) {
  const empty = cart.length === 0;
  return (
    <ScreenShell eyebrow={empty ? 'ST-03 · CARRINHO VAZIO' : 'WF-05 · CARRINHO'} title="Seu carrinho" footer={footer} scroll={false}>
      <FlatList data={cart} keyExtractor={(item) => item.id} ListEmptyComponent={<EmptyState actionLabel="Explorar catálogo" description="Adicione itens para habilitar o checkout. Total atual: R$ 0,00." onAction={() => onNavigate('wf03')} title="Nenhum item no carrinho" />} ListFooterComponent={<View style={styles.listFooter}><OrderSummary items={cart} total={cartTotal} /><AppButton disabled={empty} label="Continuar para checkout" onPress={() => onNavigate('wf06')} /></View>} ItemSeparatorComponent={Separator} renderItem={({ item }) => <ProductCard context="cart" product={item}><AppButton label={`Remover: ${item.name}`} onPress={() => onRemoveFromCart(item.id)} variant="ghost" /></ProductCard>} contentContainerStyle={styles.listContent} />
    </ScreenShell>
  );
}

function CheckoutScreen({ cart, cartTotal, checkoutForm, errors, onChangeCheckout, onNavigate, onSubmitCheckout, route }) {
  return (
    <ScreenShell eyebrow={route === 'st05' ? 'ST-05 · CHECKOUT COM ERRO' : 'WF-06 · CHECKOUT'} title="Finalizar compra simulada">
      <ProductList items={cart} context="cart" />
      <OrderSummary items={cart} total={cartTotal} />
      <FeedbackBanner message={DEMO_ORDER.paymentNotice} />
      <View style={styles.form}>
        <LabeledField error={errors.cardNumber} keyboardType="number-pad" label="Número do cartão fictício" onChangeText={(cardNumber) => onChangeCheckout({ ...checkoutForm, cardNumber })} placeholder="Somente demonstração" value={checkoutForm.cardNumber} />
        <LabeledField error={errors.printedName} label="Nome impresso fictício" onChangeText={(printedName) => onChangeCheckout({ ...checkoutForm, printedName })} onSubmitEditing={onSubmitCheckout} placeholder="Somente demonstração" value={checkoutForm.printedName} />
      </View>
      {route === 'st05' ? <FeedbackBanner message="Revise os campos indicados. Nenhum pedido foi criado." tone="error" /> : null}
      <View style={styles.actions}><AppButton disabled={!cart.length} label="Confirmar simulação" onPress={onSubmitCheckout} /><AppButton label="Voltar ao carrinho" onPress={() => onNavigate('wf05')} variant="ghost" /></View>
    </ScreenShell>
  );
}

function ResultScreen({ onNavigate, order }) {
  const currentOrder = order ?? { id: 'PEDIDO-DEMO-PENDENTE (identificador fictício)', items: [], quantity: 0, total: 0 };
  return (
    <ScreenShell eyebrow="WF-07 · RESULTADO" title="Simulação concluída">
      <FeedbackBanner message="Resultado demonstrativo. Não houve cobrança." tone="success" />
      <View style={styles.section}><AppText variant="label">Pedido</AppText><AppText>{currentOrder.id}</AppText><AppText>Quantidade: {currentOrder.quantity} itens</AppText><AppText variant="heading">Total: {formatCurrency(currentOrder.total)}</AppText></View>
      <FeedbackBanner message={DEMO_ORDER.paymentNotice} />
      <View style={styles.actions}><AppButton label="Abrir biblioteca" onPress={() => onNavigate('wf08')} /><AppButton label="Voltar ao catálogo" onPress={() => onNavigate('wf03')} variant="ghost" /></View>
    </ScreenShell>
  );
}

function LibraryScreen({ footer, library, onNavigate }) {
  const empty = library.length === 0;
  return (
    <ScreenShell eyebrow={empty ? 'ST-04 · BIBLIOTECA VAZIA' : 'WF-08 · BIBLIOTECA'} title="Minha biblioteca" description="Aquisições simuladas; chaves e lojas são fictícias." footer={footer} scroll={false}>
      <FlatList data={library} keyExtractor={(item) => item.id} ListEmptyComponent={<EmptyState actionLabel="Ir ao catálogo" description="Não há aquisições demonstrativas nesta sessão." onAction={() => onNavigate('wf03')} title="Biblioteca vazia" />} ItemSeparatorComponent={Separator} renderItem={({ item }) => <ProductCard context="library" product={item} />} contentContainerStyle={styles.listContent} />
    </ScreenShell>
  );
}

function ProductList({ context, items }) {
  return <View accessibilityRole="list" style={styles.list}>{items.map((item) => <ProductCard context={context} key={item.id} product={item} />)}</View>;
}

function OrderSummary({ items, total }) {
  return <View accessibilityLabel="Resumo do pedido" style={styles.summary}><AppText variant="heading">Resumo</AppText><AppText>Quantidade: {items.length}</AppText><AppText variant="heading">Total: {formatCurrency(total)}</AppText></View>;
}

function Separator() { return <View style={styles.separator} />; }

const styles = StyleSheet.create({
  filterGroup: { width: '100%', gap: spacing.sm }, list: { width: '100%', gap: spacing.lg }, listHeader: { gap: spacing.lg, marginBottom: spacing.lg }, listFooter: { gap: spacing.lg, marginTop: spacing.lg }, listContent: { flexGrow: 1, paddingBottom: spacing.lg }, separator: { height: spacing.lg },
  section: { width: '100%', padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  summary: { width: '100%', padding: spacing.lg, gap: spacing.sm, borderRadius: radius.lg, borderWidth: 2, borderColor: colors.accentDark, backgroundColor: colors.accentSurface },
  actions: { width: '100%', gap: spacing.md }, form: { width: '100%', gap: spacing.lg },
});

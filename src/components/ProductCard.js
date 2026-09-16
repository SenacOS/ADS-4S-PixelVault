import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '../theme/tokens';
import AppText from './AppText';

/**
 * @param {{ product: import('../data/pixelVaultData').PRODUCTS[number], context?: 'catalog'|'cart'|'library'|'admin', children?: import('react').ReactNode }} props
 */
export default function ProductCard({ product, context = 'catalog', children }) {
  return (
    <View accessibilityLabel={`${product.name}, ${product.type}, ${product.priceLabel}`} style={styles.card}>
      <View
        accessibilityLabel={`Capa ilustrativa neutra de ${product.name}; arte final não aprovada`}
        accessibilityRole="image"
        style={styles.cover}
      >
        <AppText variant="eyebrow" style={styles.coverText}>CAPA ILUSTRATIVA</AppText>
        <AppText variant="heading" style={styles.coverInitial}>{product.name.slice(0, 2).toUpperCase()}</AppText>
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={styles.flex}>
            <AppText variant="heading">{product.name}</AppText>
            <AppText variant="secondary">Tipo: {product.type}</AppText>
          </View>
          <AppText variant="label" style={styles.price}>{product.priceLabel}</AppText>
        </View>
        <AppText variant="secondary">Compatível com: {product.compatibleWith.join(', ')}</AppText>
        {context !== 'catalog' ? (
          <AppText variant="secondary">Ativação em: {product.activationStore}</AppText>
        ) : null}
        {context === 'library' ? (
          <AppText variant="secondary">Chave: {product.activationKey}</AppText>
        ) : null}
        {children ? <View style={styles.actions}>{children}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cover: {
    minHeight: 112,
    padding: spacing.lg,
    backgroundColor: colors.surfaceRaised,
    justifyContent: 'space-between',
  },
  coverText: { color: colors.textMuted },
  coverInitial: { color: colors.accent },
  content: { padding: spacing.lg, gap: spacing.sm },
  titleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, alignItems: 'flex-start' },
  flex: { flexGrow: 1, flexShrink: 1, minWidth: 180 },
  price: { color: colors.accent },
  actions: { gap: spacing.sm, paddingTop: spacing.sm },
});

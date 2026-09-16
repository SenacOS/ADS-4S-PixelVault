import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '../theme/tokens';
import AppText from './AppText';

/** @param {{ message: string, tone?: 'info'|'success'|'error' }} props */
export default function FeedbackBanner({ message, tone = 'info' }) {
  const prefix = tone === 'error' ? 'Erro' : tone === 'success' ? 'Sucesso' : 'Informação';

  return (
    <View accessibilityRole="alert" accessibilityLiveRegion="polite" style={[styles.base, styles[tone]]}>
      <AppText style={styles.text}>{prefix}: {message}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { width: '100%', borderLeftWidth: 4, borderRadius: radius.sm, padding: spacing.md },
  info: { backgroundColor: colors.accentDark, borderLeftColor: colors.accent },
  success: { backgroundColor: '#123c2c', borderLeftColor: colors.success },
  error: { backgroundColor: '#4a1f2a', borderLeftColor: colors.danger },
  text: { fontWeight: '700' },
});

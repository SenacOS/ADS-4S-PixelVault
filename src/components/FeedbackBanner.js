import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '../theme/tokens';
import AppText from './AppText';

/** @param {{ message: string, tone?: 'info'|'success'|'error' }} props */
export default function FeedbackBanner({ message, tone = 'info' }) {
  const prefix = tone === 'error' ? 'Erro' : tone === 'success' ? 'Sucesso' : 'Informação';

  return (
    <View accessibilityRole="alert" accessibilityLiveRegion="polite" style={[styles.base, styles[tone]]}>
      <AppText style={[styles.text, styles[`${tone}Text`]]}>{prefix}: {message}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { width: '100%', borderLeftWidth: 4, borderRadius: radius.sm, padding: spacing.md },
  info: { backgroundColor: colors.accentSurface, borderLeftColor: colors.accentDark },
  success: { backgroundColor: colors.successSurface, borderLeftColor: colors.success },
  error: { backgroundColor: colors.dangerSurface, borderLeftColor: colors.danger },
  infoText: { color: colors.accentDark },
  successText: { color: colors.success },
  errorText: { color: colors.danger },
  text: { fontWeight: '700' },
});

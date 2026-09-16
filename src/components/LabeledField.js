import { StyleSheet, TextInput, View } from 'react-native';

import { getEvidenceFontScale } from '../data/demoRoutes';
import { colors, layout, radius, spacing, type } from '../theme/tokens';
import AppText from './AppText';

/**
 * @param {import('react-native').TextInputProps & { label: string, error?: string }} props
 */
export default function LabeledField({ label, error, style, ...inputProps }) {
  const errorId = `${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-error`;
  const evidenceScale = getEvidenceFontScale();

  return (
    <View style={styles.group}>
      <AppText variant="label">{label}</AppText>
      <TextInput
        accessibilityLabel={label}
        accessibilityHint={error}
        allowFontScaling
        placeholderTextColor={colors.textSubtle}
        style={[styles.input, { fontSize: type.body * evidenceScale }, error && styles.inputError, style]}
        {...inputProps}
      />
      {error ? (
        <AppText nativeID={errorId} accessibilityLiveRegion="polite" style={styles.error}>
          Erro: {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { width: '100%', gap: spacing.sm },
  input: {
    minHeight: layout.minTouchTarget,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: type.body,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  inputError: { borderColor: colors.danger, borderWidth: 2 },
  error: { color: colors.danger, fontWeight: '700' },
});

import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { colors, layout, radius, spacing } from '../theme/tokens';
import AppText from './AppText';

/**
 * @param {{ label: string, onPress: () => void, variant?: 'primary'|'secondary'|'ghost'|'danger', disabled?: boolean, accessibilityHint?: string }} props
 */
export default function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  accessibilityHint,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onBlur={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !disabled && styles[`${variant}Pressed`],
        disabled && styles.disabled,
        focused && styles.focused,
      ]}
    >
      <AppText style={[styles.label, variant === 'danger' && styles.dangerLabel, disabled && styles.disabledLabel]}>
        {label}{disabled ? ' — indisponível' : ''}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    maxWidth: '100%',
    minHeight: layout.minTouchTarget,
    minWidth: layout.minTouchTarget,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  primary: { backgroundColor: colors.accent, borderColor: colors.accent },
  secondary: { backgroundColor: colors.surfaceRaised, borderColor: colors.border },
  ghost: { backgroundColor: 'transparent', borderColor: colors.border },
  danger: { backgroundColor: colors.danger, borderColor: colors.danger },
  primaryPressed: { backgroundColor: colors.accentPressed, borderColor: colors.accentPressed },
  secondaryPressed: { backgroundColor: colors.accentSurface, borderColor: colors.accentDark },
  ghostPressed: { backgroundColor: colors.surfaceRaised, borderColor: colors.accentDark },
  dangerPressed: { transform: [{ scale: 0.99 }], borderColor: colors.focus },
  disabled: { backgroundColor: colors.disabled, borderColor: colors.disabledBorder },
  focused: { borderColor: colors.focus, borderWidth: 3 },
  label: { width: '100%', color: colors.text, fontWeight: '800', textAlign: 'center' },
  dangerLabel: { color: colors.background },
  disabledLabel: { color: colors.disabledText },
});

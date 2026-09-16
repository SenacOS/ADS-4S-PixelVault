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
  const usesLightLabel = disabled || variant === 'secondary' || variant === 'ghost';

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
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        focused && styles.focused,
      ]}
    >
      <AppText style={[styles.label, usesLightLabel && styles.lightLabel]}>
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
  disabled: { backgroundColor: colors.disabled, borderColor: colors.disabled },
  focused: { borderColor: colors.warning, borderWidth: 3 },
  pressed: { opacity: 0.72 },
  label: { width: '100%', color: colors.background, fontWeight: '800', textAlign: 'center' },
  lightLabel: { color: colors.text },
});

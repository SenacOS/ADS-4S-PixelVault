import { StyleSheet, Text } from 'react-native';

import { getEvidenceFontScale } from '../data/demoRoutes';
import { colors, type } from '../theme/tokens';

const fontMetrics = Object.freeze({
  title: { fontSize: type.title, lineHeight: 42 },
  heading: { fontSize: type.heading, lineHeight: 31 },
  body: { fontSize: type.body, lineHeight: 24 },
  secondary: { fontSize: type.secondary, lineHeight: 21 },
  label: { fontSize: type.body, lineHeight: 22 },
  eyebrow: { fontSize: type.secondary, lineHeight: 20 },
});

const variants = StyleSheet.create({
  title: { color: colors.text, fontSize: type.title, fontWeight: '800', lineHeight: 42 },
  heading: { color: colors.text, fontSize: type.heading, fontWeight: '800', lineHeight: 31 },
  body: { color: colors.text, fontSize: type.body, lineHeight: 24 },
  secondary: { color: colors.textMuted, fontSize: type.secondary, lineHeight: 21 },
  label: { color: colors.textMuted, fontSize: type.body, fontWeight: '700', lineHeight: 22 },
  eyebrow: {
    color: colors.accentDark,
    fontSize: type.secondary,
    fontWeight: '800',
    letterSpacing: 1.2,
    lineHeight: 20,
  },
});

/**
 * Texto comum com escala de fonte nativa habilitada e variantes mínimas.
 *
 * @param {import('react-native').TextProps & { variant?: keyof typeof variants }} props
 */
export default function AppText({ variant = 'body', style, accessibilityRole, ...props }) {
  const evidenceScale = getEvidenceFontScale();
  const metrics = fontMetrics[variant];
  const semanticRole = accessibilityRole ?? (variant === 'title' || variant === 'heading' ? 'header' : undefined);
  return (
    <Text
      accessibilityRole={semanticRole}
      allowFontScaling
      maxFontSizeMultiplier={2}
      style={[
        styles.base,
        variants[variant],
        { fontSize: metrics.fontSize * evidenceScale, lineHeight: metrics.lineHeight * evidenceScale },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: { maxWidth: '100%', flexShrink: 1 },
});

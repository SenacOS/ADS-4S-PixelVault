import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '../theme/tokens';
import AppButton from './AppButton';
import AppText from './AppText';

/** @param {{ title: string, description: string, actionLabel: string, onAction: () => void }} props */
export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <View accessibilityRole="summary" style={styles.container}>
      <AppText variant="heading">{title}</AppText>
      <AppText variant="secondary">{description}</AppText>
      <AppButton label={actionLabel} onPress={onAction} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: spacing.xl,
    gap: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
});

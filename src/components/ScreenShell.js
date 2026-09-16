import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, spacing } from '../theme/tokens';
import AppText from './AppText';

/**
 * @param {{ title: string, eyebrow: string, description?: string, children: import('react').ReactNode, footer?: import('react').ReactNode, scroll?: boolean }} props
 */
export default function ScreenShell({ title, eyebrow, description, children, footer, scroll = true }) {
  const content = (
    <View style={[styles.inner, !scroll && styles.flex]}>
      <View style={styles.header}>
        <AppText variant="eyebrow">{eyebrow}</AppText>
        <AppText variant="title">{title}</AppText>
        {description ? <AppText variant="secondary">{description}</AppText> : null}
      </View>
      <View style={[styles.body, !scroll && styles.flex]}>{children}</View>
    </View>
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
        style={styles.flex}
      >
        {scroll ? (
          <ScrollView
            automaticallyAdjustKeyboardInsets
            contentContainerStyle={[styles.content, footer && styles.contentWithFooter]}
            keyboardShouldPersistTaps="handled"
            style={styles.flex}
          >
            {content}
          </ScrollView>
        ) : <View style={[styles.content, styles.flex, footer && styles.contentWithFooter]}>{content}</View>}
        {footer}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  contentWithFooter: { paddingBottom: spacing.xl },
  inner: { width: '100%', maxWidth: layout.maxContentWidth, minWidth: 0, gap: spacing.xl, flexShrink: 1 },
  header: { width: '100%', gap: spacing.sm },
  body: { width: '100%', gap: spacing.lg },
});

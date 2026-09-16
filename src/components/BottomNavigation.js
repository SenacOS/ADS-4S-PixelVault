import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { PLAYER_NAVIGATION } from '../data/pixelVaultData';
import { colors, layout, spacing } from '../theme/tokens';
import AppText from './AppText';

/** @param {{ active: string, onNavigate: (route: string) => void }} props */
export default function BottomNavigation({ active, onNavigate }) {
  const [focusedDestination, setFocusedDestination] = useState(/** @type {string|null} */ (null));

  return (
    <View accessibilityRole="tablist" style={styles.navigation}>
      {PLAYER_NAVIGATION.map((item) => {
        const selected = active === item.destination;
        return (
          <Pressable
            key={item.destination}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            accessibilityState={{ selected }}
            onBlur={() => setFocusedDestination(null)}
            onFocus={() => setFocusedDestination(item.destination)}
            onPress={() => onNavigate(item.destination)}
            style={[
              styles.item,
              selected && styles.selected,
              focusedDestination === item.destination && styles.focused,
            ]}
          >
            <AppText variant="secondary" style={[styles.label, selected && styles.selectedLabel]}>
              {selected ? 'Ativo: ' : ''}{item.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navigation: {
    minHeight: layout.bottomNavigationHeight,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  item: {
    flex: 1,
    minHeight: layout.minTouchTarget,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: { borderTopWidth: 4, borderTopColor: colors.accent, backgroundColor: colors.accentDark },
  focused: { borderWidth: 3, borderColor: colors.warning },
  label: { textAlign: 'center' },
  selectedLabel: { color: colors.text, fontWeight: '800' },
});

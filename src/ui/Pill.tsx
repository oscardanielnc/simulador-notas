import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { color, font, radius, size } from '@/theme/tokens';

interface Props {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  accessibilityLabel?: string;
  style?: ViewStyle;
  big?: boolean;
}

export function Pill({ label, onPress, icon, accessibilityLabel, style, big }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      hitSlop={6}
      style={({ pressed }) => [styles.pill, big && styles.big, pressed && styles.pressed, style]}
    >
      <Text style={[styles.text, big && styles.bigText]}>{label}</Text>
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: color.tint,
  },
  big: { width: 40, height: 40, justifyContent: 'center', paddingHorizontal: 0 },
  pressed: { opacity: 0.6 },
  text: { fontFamily: font.medium, fontSize: size.label, color: color.strong },
  bigText: { fontSize: 20, lineHeight: 24 },
});

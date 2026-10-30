import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatGrade } from '@/core/grading';
import { es } from '@/i18n/es';
import { color, font, numbers, radius, selectable, shadow, size } from '@/theme/tokens';
import { ProgressRing } from '@/ui/ProgressRing';
import { StarIcon } from '@/ui/StarIcon';

interface Props {
  label: string;
  value: number;
  selected: boolean;
  real: boolean;
  onPress: () => void;
}

/** Darkest card: the most important number on screen. */
export function FinalGradeCard({ label, value, selected, real, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.card, selectable(selected)]}
    >
      {real && <StarIcon corner color={color.starOnDark} />}
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {formatGrade(value)}
          <Text style={styles.outOf}> {es.course.outOf}</Text>
        </Text>
      </View>
      <ProgressRing value={value} size={80} tone="dark" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.card,
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: color.accent,
    ...shadow.card,
  },
  label: { fontFamily: font.medium, fontSize: size.label, color: color.onDark, opacity: 0.85 },
  value: { ...numbers, fontFamily: font.semibold, fontSize: size.final, color: color.onDark },
  outOf: { fontFamily: font.regular, fontSize: 14, color: color.onDark, opacity: 0.75 },
});

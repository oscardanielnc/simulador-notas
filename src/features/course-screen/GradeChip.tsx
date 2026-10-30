import { Pressable, StyleSheet, Text } from 'react-native';

import { isFailing } from '@/core/grading';
import { color, font, gradeColor, numbers, radius, selectable, shadow, size } from '@/theme/tokens';
import { StarIcon } from '@/ui/StarIcon';

interface Props {
  name: string;
  value: number;
  weight: string;
  selected: boolean;
  real: boolean;
  hasChildren: boolean;
  onPress: () => void;
  onDrill: () => void;
}

export function GradeChip({
  name,
  value,
  weight,
  selected,
  real,
  hasChildren,
  onPress,
  onDrill,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.chip, selectable(selected)]}
    >
      {real && <StarIcon corner />}
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      <Text style={[styles.value, { color: gradeColor(isFailing(value)) }]}>
        {hasChildren ? value.toFixed(1) : value}
      </Text>
      <Text style={styles.weight} numberOfLines={1}>
        {weight}
      </Text>
      {hasChildren && (
        <Pressable onPress={onDrill} hitSlop={8} style={styles.chevron} accessibilityRole="button">
          <Text style={styles.chevronText}>›</Text>
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: radius.chip,
    backgroundColor: color.surfaceChip,
    ...shadow.chip,
  },
  name: { fontFamily: font.medium, fontSize: size.small, color: color.secondary },
  value: { ...numbers, fontFamily: font.semibold, fontSize: size.chip },
  weight: { fontFamily: font.regular, fontSize: size.small, color: color.muted },
  chevron: { position: 'absolute', right: 4, top: '35%' },
  chevronText: { fontFamily: font.semibold, fontSize: 16, color: color.secondary },
});

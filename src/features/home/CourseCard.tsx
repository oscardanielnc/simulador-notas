import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatGrade, isFailing } from '@/core/grading';
import type { Course } from '@/core/tree';
import { es } from '@/i18n/es';
import { color, font, gradeColor, numbers, radius, selectable, shadow, size } from '@/theme/tokens';
import { ProgressRing } from '@/ui/ProgressRing';
import { StarIcon } from '@/ui/StarIcon';

interface Props {
  course: Course;
  value: number;
  complete: boolean;
  onPress: () => void;
}

export function CourseCard({ course, value, complete, onPress }: Props) {
  const failing = isFailing(value);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={es.course.open(course.name)}
      style={({ pressed }) => [styles.card, selectable(pressed)]}
    >
      {complete && <StarIcon corner size={16} label={es.a11y.complete} />}
      <View style={styles.info}>
        <Text style={styles.name}>{course.name}</Text>
        <Text style={styles.meta}>
          {course.code} · {es.home.credits(course.credits)}
        </Text>
      </View>
      <Text style={[styles.value, { color: gradeColor(failing) }]}>{formatGrade(value)}</Text>
      <ProgressRing
        value={value}
        size={36}
        color={failing ? color.danger : color.secondary}
        track={color.track}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: radius.card,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: color.surface,
    ...shadow.card,
  },
  info: { flex: 1 },
  name: { fontFamily: font.semibold, fontSize: 15, color: color.text },
  meta: { fontFamily: font.regular, fontSize: size.small, color: color.secondary, marginTop: 2 },
  value: { ...numbers, fontFamily: font.semibold, fontSize: 20 },
});

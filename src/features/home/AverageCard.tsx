import { StyleSheet, Text, View } from 'react-native';

import type { AverageResult } from '@/core/average';
import { formatGrade } from '@/core/grading';
import { es } from '@/i18n/es';
import { color, font, numbers, radius, shadow, size } from '@/theme/tokens';
import { ProgressRing } from '@/ui/ProgressRing';

interface Props {
  average: AverageResult;
  totalCourses: number;
}

/** Credit-weighted average of every course, always at the top of home (ADR 0009). */
export function AverageCard({ average, totalCourses }: Props) {
  return (
    <View style={styles.card} accessibilityLabel={es.home.average}>
      <View style={styles.text}>
        <Text style={styles.label}>{es.home.average}</Text>
        <Text style={styles.value} testID="general-average">
          {formatGrade(average.value)}
          <Text style={styles.outOf}> {es.course.outOf}</Text>
        </Text>
        <Text style={styles.progress}>
          {es.home.progress(average.completeCourses, totalCourses, average.credits)}
        </Text>
      </View>
      <ProgressRing value={average.value} size={76} />
    </View>
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
  text: { flex: 1 },
  label: { fontFamily: font.medium, fontSize: size.label, color: color.onDark, opacity: 0.85 },
  value: { ...numbers, fontFamily: font.semibold, fontSize: size.final, color: color.onDark },
  outOf: { fontFamily: font.regular, fontSize: 14, color: color.onDark, opacity: 0.75 },
  progress: { fontFamily: font.regular, fontSize: size.small, color: color.onDark, opacity: 0.85 },
});

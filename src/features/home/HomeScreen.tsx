import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { generalAverage, isComplete } from '@/core/average';
import { simValue } from '@/core/grades';
import { courses } from '@/data/courses';
import { es } from '@/i18n/es';
import { useGradesStore } from '@/store/grades.store';
import { color, font, size, space } from '@/theme/tokens';

import { AverageCard } from './AverageCard';
import { CourseCard } from './CourseCard';

export function HomeScreen({ onOpen }: { onOpen: (courseId: string) => void }) {
  const all = useGradesStore((s) => s.grades);
  const insets = useSafeAreaInsets();
  const gradesOf = (id: string) => all[id] ?? {};
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <AverageCard average={generalAverage(courses, gradesOf)} totalCourses={courses.length} />
      <Text style={styles.title}>{es.home.title}</Text>
      <View style={styles.list}>
        {courses.map((c) => (
          <CourseCard
            key={c.id}
            course={c}
            value={simValue(c.root, gradesOf(c.id))}
            complete={isComplete(c, gradesOf(c.id))}
            onPress={() => onOpen(c.id)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  content: { paddingHorizontal: space.screen },
  title: {
    fontFamily: font.semibold,
    fontSize: size.title,
    color: color.text,
    marginTop: 20,
    marginBottom: 10,
  },
  list: { gap: space.gap },
});

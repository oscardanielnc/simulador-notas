import { ScrollView, StyleSheet, View } from 'react-native';

import { showsReal, simValue } from '@/core/grades';
import type { GradeNode } from '@/core/tree';
import { useCourseGrades } from '@/store/grades.store';
import { space } from '@/theme/tokens';

import { CriterionCard } from './CriterionCard';
import { FinalGradeCard } from './FinalGradeCard';
import { UnsavedNotice } from './UnsavedNotice';

interface Props {
  courseId: string;
  /** Header card: the course root, or the node drilled into. */
  head: GradeNode;
  headLabel: string;
  selectedId: string;
  onSelect: (id: string) => void;
  onDrill: (id: string) => void;
}

/** Final card + one card per criterion (F02). */
export function CourseTree({ courseId, head, headLabel, selectedId, onSelect, onDrill }: Props) {
  const grades = useCourseGrades(courseId);
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <UnsavedNotice />
      <FinalGradeCard
        label={headLabel}
        value={simValue(head, grades)}
        selected={selectedId === head.id}
        real={showsReal(head, grades)}
        onPress={() => onSelect(head.id)}
      />
      <View style={styles.list}>
        {head.children.map((node) => (
          <CriterionCard
            key={node.id}
            parent={head}
            node={node}
            grades={grades}
            selectedId={selectedId}
            onSelect={onSelect}
            onDrill={onDrill}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.screen - 2, paddingTop: 8, paddingBottom: 16 },
  list: { gap: space.gap, marginTop: space.gap },
});

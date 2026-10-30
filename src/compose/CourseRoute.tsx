import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { firstPending } from '@/core/grades';
import { findNode, ROOT_ID, type GradeNode } from '@/core/tree';
import { courseById } from '@/data/courses';
import { CourseTree } from '@/features/course-screen/CourseTree';
import { EditorSheet } from '@/features/grade-editor/EditorSheet';
import { es } from '@/i18n/es';
import { useGradesStore } from '@/store/grades.store';
import { color, font, size } from '@/theme/tokens';
import { BackIcon } from '@/ui/BackIcon';

interface Props {
  courseId: string;
  nodeId?: string;
  onBack: () => void;
  onDrill: (nodeId: string) => void;
}

const titleOf = (node: GradeNode) =>
  node.id === ROOT_ID
    ? es.course.finalGrade
    : node.fullName
      ? `${node.name} · ${node.fullName}`
      : node.name;

/** Course screen: tree on top, editor sheet always at the bottom (F02, F03). */
export function CourseRoute({ courseId, nodeId = ROOT_ID, onBack, onDrill }: Props) {
  const course = courseById(courseId);
  const head = course && findNode(course.root, nodeId);
  // Opens on the first grade still missing its real value (F02).
  const [selectedId, setSelectedId] = useState(() =>
    head ? firstPending(head, useGradesStore.getState().grades[courseId] ?? {}).id : nodeId,
  );
  const insets = useSafeAreaInsets();
  if (!course || !head) {
    return <Text style={styles.missing}>{es.course.notFound}</Text>;
  }
  const selected = findNode(head, selectedId) ?? head;
  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel={es.course.back}
          hitSlop={8}
          style={styles.back}
        >
          <BackIcon />
        </Pressable>
        <Text style={styles.title} numberOfLines={2}>
          {head.id === ROOT_ID ? course.name : `${course.name} · ${head.name}`}
        </Text>
      </View>
      <View style={styles.body}>
        <CourseTree
          courseId={courseId}
          head={head}
          headLabel={titleOf(head)}
          selectedId={selected.id}
          onSelect={setSelectedId}
          onDrill={onDrill}
        />
      </View>
      <EditorSheet
        key={selected.id}
        courseId={courseId}
        node={selected}
        title={titleOf(selected)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    marginBottom: 4,
  },
  back: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: color.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { flex: 1, fontFamily: font.semibold, fontSize: size.title, color: color.text },
  body: { flex: 1 },
  missing: { margin: 24, fontFamily: font.medium, color: color.text },
});

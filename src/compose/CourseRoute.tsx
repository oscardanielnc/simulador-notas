import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { findNode, ROOT_ID, type GradeNode } from '@/core/tree';
import { courseById } from '@/data/courses';
import { CourseTree } from '@/features/course-screen/CourseTree';
import { EditorSheet } from '@/features/grade-editor/EditorSheet';
import { es } from '@/i18n/es';
import { color, font, size } from '@/theme/tokens';

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

/** Course screen: tree on top, editor sheet at the bottom once something is tapped (F02, F03). */
export function CourseRoute({ courseId, nodeId = ROOT_ID, onBack, onDrill }: Props) {
  const course = courseById(courseId);
  const head = course && findNode(course.root, nodeId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  if (!course || !head) {
    return <Text style={styles.missing}>{es.course.notFound}</Text>;
  }
  const selected = selectedId === null ? undefined : findNode(head, selectedId);
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
          <Text style={styles.backText}>←</Text>
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
          selectedId={selected?.id ?? null}
          onSelect={setSelectedId}
          onDrill={onDrill}
        />
      </View>
      {selected && (
        <Animated.View entering={SlideInDown.duration(220)} exiting={SlideOutDown.duration(180)}>
          <EditorSheet
            key={selected.id}
            courseId={courseId}
            node={selected}
            title={titleOf(selected)}
            onClose={() => setSelectedId(null)}
          />
        </Animated.View>
      )}
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
  backText: { fontFamily: font.semibold, fontSize: 16, color: color.strong },
  title: { flex: 1, fontFamily: font.semibold, fontSize: size.title, color: color.text },
  body: { flex: 1 },
  missing: { margin: 24, fontFamily: font.medium, color: color.text },
});

import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { hasHiddenReal, rulerStar, showsReal, simValue } from '@/core/grades';
import { isFailing } from '@/core/grading';
import type { GradeNode } from '@/core/tree';
import { es } from '@/i18n/es';
import { useCourseGrades, useGradesStore } from '@/store/grades.store';
import { color, font, gradeColor, numbers, radius, size } from '@/theme/tokens';
import { Pill } from '@/ui/Pill';
import { StarIcon } from '@/ui/StarIcon';

import { RulerPicker } from './RulerPicker';

interface Props {
  courseId: string;
  node: GradeNode;
  /** Name shown for the node; a leaf with fullName reads "PC · Práctica calificada". */
  title: string;
}

/** Bottom sheet that edits the selected element (F03). Remount it per selection. */
export function EditorSheet({ courseId, node, title }: Props) {
  const grades = useCourseGrades(courseId);
  const { setValue, markReal, unmarkReal, restoreReal } = useGradesStore.getState();
  const insets = useSafeAreaInsets();
  const isLeaf = node.children.length === 0;
  const [current, setCurrent] = useState(() => Math.round(simValue(node, grades)));

  const change = (v: number) => {
    setCurrent(v);
    setValue(courseId, node.id, v);
  };

  const showReal = () => {
    restoreReal(courseId, node.id);
    const after = useGradesStore.getState().grades[courseId] ?? {};
    setCurrent(Math.round(simValue(node, after)));
  };

  const real = isLeaf && showsReal(node, grades);

  return (
    <View style={[styles.sheet, { paddingBottom: 16 + insets.bottom }]}>
      <View style={styles.row}>
        <Text style={styles.name} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.actions}>
          {hasHiddenReal(node, grades) && (
            <Pill label={es.editor.showReal} onPress={showReal} style={styles.onSheet} />
          )}
          {isLeaf &&
            (real ? (
              <Pill
                label={es.editor.unmarkReal}
                onPress={() => unmarkReal(courseId, node.id)}
                style={styles.onSheet}
              />
            ) : (
              <Pill
                label={es.editor.markReal}
                icon={<StarIcon size={12} />}
                onPress={() => markReal(courseId, node.id)}
                style={styles.onSheet}
              />
            ))}
        </View>
      </View>
      <Text style={[styles.value, { color: gradeColor(isFailing(current)) }]}>{current}</Text>
      <View style={styles.ruler}>
        <RulerPicker value={current} onChange={change} star={rulerStar(node, grades)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: color.tint,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingTop: 16,
    paddingHorizontal: 16,
    shadowColor: color.text,
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -6 },
    elevation: 24,
  },
  onSheet: { backgroundColor: color.bg },
  ruler: { marginHorizontal: -16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  name: { flex: 1, fontFamily: font.semibold, fontSize: 14, color: color.text },
  actions: { flexDirection: 'row', gap: 6 },
  value: { ...numbers, textAlign: 'center', fontFamily: font.semibold, fontSize: size.editor },
});

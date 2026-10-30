import { Pressable, StyleSheet, Text, View } from 'react-native';

import { showsReal, simValue, type CourseGrades } from '@/core/grades';
import { formatGrade, isFailing, weightLabel } from '@/core/grading';
import type { GradeNode } from '@/core/tree';
import {
  color,
  font,
  gradeColor,
  numbers,
  radius,
  selectable,
  shadow,
  size,
  space,
} from '@/theme/tokens';
import { ProgressBar } from '@/ui/ProgressBar';
import { StarIcon } from '@/ui/StarIcon';

import { GradeChip } from './GradeChip';

const COLUMNS = 4;

interface Props {
  parent: GradeNode;
  node: GradeNode;
  grades: CourseGrades;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDrill: (id: string) => void;
}

function rows<T>(items: T[]): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += COLUMNS) out.push(items.slice(i, i + COLUMNS));
  return out;
}

export function CriterionCard({ parent, node, grades, selectedId, onSelect, onDrill }: Props) {
  const v = simValue(node, grades);
  const isLeaf = node.children.length === 0;
  return (
    <Pressable
      onPress={() => onSelect(node.id)}
      accessibilityRole="button"
      accessibilityState={{ selected: selectedId === node.id }}
      style={[styles.card, selectable(selectedId === node.id)]}
    >
      {showsReal(node, grades) && <StarIcon corner />}
      <View style={styles.label}>
        <Text style={styles.labelText}>{node.name}</Text>
        <Text style={styles.labelText}>{weightLabel(parent, node)}</Text>
      </View>
      <Text style={[styles.value, { color: gradeColor(isFailing(v)) }]}>
        {isLeaf ? v : formatGrade(v)}
      </Text>
      <ProgressBar value={v} />
      {rows(node.children).map((row, r) => (
        <View key={r} style={styles.chipRow}>
          {row.map((child) => (
            <GradeChip
              key={child.id}
              name={child.name}
              value={simValue(child, grades)}
              weight={weightLabel(node, child)}
              selected={selectedId === child.id}
              real={showsReal(child, grades)}
              hasChildren={child.children.length > 0}
              onPress={() => onSelect(child.id)}
              onDrill={() => onDrill(child.id)}
            />
          ))}
          {Array.from({ length: COLUMNS - row.length }, (_, i) => (
            <View key={`pad-${i}`} style={styles.pad} />
          ))}
        </View>
      ))}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    padding: 12,
    backgroundColor: color.surface,
    ...shadow.card,
  },
  label: { flexDirection: 'row', justifyContent: 'space-between' },
  labelText: { fontFamily: font.medium, fontSize: size.label, color: color.secondary },
  value: { ...numbers, fontFamily: font.semibold, fontSize: size.criterion, marginBottom: 4 },
  chipRow: { flexDirection: 'row', gap: space.chipGap, marginTop: 10 },
  pad: { flex: 1 },
});

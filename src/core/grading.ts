import type { GradeNode } from './tree';

export const PASSING_GRADE = 10.5;

const totalWeight = (node: GradeNode) => node.children.reduce((s, c) => s + c.weight, 0);

/** Exact weighted value of a node, no intermediate rounding (ADR 0003). */
export function value(node: GradeNode, leafValue: (leafId: string) => number): number {
  if (node.children.length === 0) return leafValue(node.id);
  const total = totalWeight(node);
  return node.children.reduce((s, c) => s + (value(c, leafValue) * c.weight) / total, 0);
}

export function isFailing(v: number): boolean {
  return v < PASSING_GRADE;
}

/** "40%" for percent parents, "2k · 40%" for unit parents. */
export function weightLabel(parent: GradeNode, child: GradeNode): string {
  const pct = `${Math.round((child.weight / totalWeight(parent)) * 100)}%`;
  return parent.unit === 'units' ? `${child.weight}k · ${pct}` : pct;
}

export function formatGrade(v: number): string {
  return v.toFixed(2);
}

/** University rounding of a course grade: half up (10.5 → 11), guarding float noise. */
export function roundOfficial(v: number): number {
  return Math.floor(v + 0.5 + 1e-9);
}

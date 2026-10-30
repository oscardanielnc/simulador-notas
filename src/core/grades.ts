import { value } from './grading';
import { leaves, type GradeNode } from './tree';

export interface LeafGrade {
  sim: number;
  real: number | null;
}

export type CourseGrades = Readonly<Record<string, LeafGrade>>;

const EMPTY: LeafGrade = { sim: 0, real: null };

export function gradeOf(grades: CourseGrades, leafId: string): LeafGrade {
  return grades[leafId] ?? EMPTY;
}

export function simValue(node: GradeNode, grades: CourseGrades): number {
  return value(node, (id) => gradeOf(grades, id).sim);
}

function mapLeaves(
  node: GradeNode,
  grades: CourseGrades,
  fn: (g: LeafGrade) => LeafGrade,
): CourseGrades {
  const next: Record<string, LeafGrade> = { ...grades };
  for (const leaf of leaves(node)) next[leaf.id] = fn(gradeOf(grades, leaf.id));
  return next;
}

/** Sets sim of every leaf under node; real is never touched. */
export function setSubtree(grades: CourseGrades, node: GradeNode, v: number): CourseGrades {
  const sim = Math.max(0, Math.min(20, Math.round(v)));
  return mapLeaves(node, grades, (g) => ({ ...g, sim }));
}

export function markReal(grades: CourseGrades, leaf: GradeNode): CourseGrades {
  return mapLeaves(leaf, grades, (g) => ({ ...g, real: g.sim }));
}

export function unmarkReal(grades: CourseGrades, leaf: GradeNode): CourseGrades {
  return mapLeaves(leaf, grades, (g) => ({ ...g, real: null }));
}

/** "Ver real": leaves with a real value show it again. */
export function restoreReal(grades: CourseGrades, node: GradeNode): CourseGrades {
  return mapLeaves(node, grades, (g) => (g.real === null ? g : { ...g, sim: g.real }));
}

const leafShowsReal = (g: LeafGrade) => g.real !== null && g.sim === g.real;

/** Star on a chip or card: every leaf under it shows its real grade. */
export function showsReal(node: GradeNode, grades: CourseGrades): boolean {
  return leaves(node).every((l) => leafShowsReal(gradeOf(grades, l.id)));
}

/** "Ver real" is offered when some leaf hides its real grade behind a simulation. */
export function hasHiddenReal(node: GradeNode, grades: CourseGrades): boolean {
  return leaves(node).some((l) => {
    const g = gradeOf(grades, l.id);
    return g.real !== null && g.sim !== g.real;
  });
}

/** Ruler tick that gets the star, or null. */
export function rulerStar(node: GradeNode, grades: CourseGrades): number | null {
  const reals = leaves(node).map((l) => gradeOf(grades, l.id).real);
  const first = reals[0] ?? null;
  return reals.every((r) => r === first) ? first : null;
}

/** App start: real wins, otherwise the last sim. */
export function onAppStart(grades: CourseGrades): CourseGrades {
  const next: Record<string, LeafGrade> = {};
  for (const [id, g] of Object.entries(grades)) {
    next[id] = g.real === null ? g : { ...g, sim: g.real };
  }
  return next;
}

/** Drops saved leaves that no longer exist in the template; new leaves default to 0. */
export function reconcile(grades: CourseGrades, root: GradeNode): CourseGrades {
  const next: Record<string, LeafGrade> = {};
  for (const leaf of leaves(root)) {
    const g = grades[leaf.id];
    if (g) next[leaf.id] = g;
  }
  return next;
}

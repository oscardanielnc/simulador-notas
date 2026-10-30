import { z } from 'zod';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import * as grades from '@/core/grades';
import type { CourseGrades } from '@/core/grades';
import { findNode, type Course, type GradeNode } from '@/core/tree';
import { courseById, courses } from '@/data/courses';

import { storage } from './storage';

export const SCHEMA_VERSION = 1;

type AllGrades = Readonly<Record<string, CourseGrades>>;

interface GradesState {
  grades: AllGrades;
  setValue: (courseId: string, nodeId: string, v: number) => void;
  markReal: (courseId: string, leafId: string) => void;
  unmarkReal: (courseId: string, leafId: string) => void;
  restoreReal: (courseId: string, nodeId: string) => void;
}

const savedSchema = z.object({
  grades: z.record(
    z.string(),
    z.record(
      z.string(),
      z.object({
        sim: z.number().int().min(0).max(20),
        real: z.number().int().min(0).max(20).nullable(),
      }),
    ),
  ),
});

/** Hydration: keep known courses, reconcile with the template, only real grades survive (F05). */
export function hydrate(saved: unknown, list: readonly Course[] = courses): AllGrades {
  const parsed = savedSchema.safeParse(saved);
  if (!parsed.success) return {};
  const next: Record<string, CourseGrades> = {};
  for (const course of list) {
    const g = parsed.data.grades[course.id];
    if (g) next[course.id] = grades.onAppStart(grades.reconcile(g, course.root));
  }
  return next;
}

/** What reaches the phone storage: real grades only (ADR 0009). */
export function onlyReal(all: AllGrades): AllGrades {
  const next: Record<string, CourseGrades> = {};
  for (const [courseId, g] of Object.entries(all)) next[courseId] = grades.onAppStart(g);
  return next;
}

type NodeOp = (g: CourseGrades, node: GradeNode) => CourseGrades;

export const useGradesStore = create<GradesState>()(
  persist(
    (set) => {
      const apply = (courseId: string, nodeId: string, op: NodeOp) =>
        set((s) => {
          const node = courseById(courseId)?.root;
          const target = node && findNode(node, nodeId);
          if (!target) return s;
          return { grades: { ...s.grades, [courseId]: op(s.grades[courseId] ?? {}, target) } };
        });
      return {
        grades: {},
        setValue: (c, n, v) => apply(c, n, (g, node) => grades.setSubtree(g, node, v)),
        markReal: (c, n) => apply(c, n, grades.markReal),
        unmarkReal: (c, n) => apply(c, n, grades.unmarkReal),
        restoreReal: (c, n) => apply(c, n, grades.restoreReal),
      };
    },
    {
      name: 'grades',
      version: SCHEMA_VERSION,
      storage: createJSONStorage(() => storage),
      partialize: (s) => ({ grades: onlyReal(s.grades) }),
      merge: (saved, current) => ({ ...current, grades: hydrate(saved) }),
    },
  ),
);

const NO_GRADES: CourseGrades = {};

export function useCourseGrades(courseId: string): CourseGrades {
  return useGradesStore((s) => s.grades[courseId] ?? NO_GRADES);
}

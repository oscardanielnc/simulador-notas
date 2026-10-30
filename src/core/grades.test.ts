import template from './fixtures/example-course.json';
import {
  gradeOf,
  hasHiddenReal,
  markReal,
  onAppStart,
  reconcile,
  restoreReal,
  rulerStar,
  setSubtree,
  showsReal,
  simValue,
  unmarkReal,
  type CourseGrades,
} from './grades';
import { buildCourse, findNode, type CourseTemplate, type GradeNode } from './tree';

const course = buildCourse(template as CourseTemplate);
const node = (id: string) => findNode(course.root, id) as GradeNode;

describe('setSubtree', () => {
  it('changes every descendant leaf sim and never real', () => {
    const start: CourseGrades = { pc1: { sim: 5, real: 5 } };
    const next = setSubtree(start, node('pc'), 12);
    expect(['pc1', 'pc2', 'pc3', 'pc4'].map((id) => gradeOf(next, id))).toEqual([
      { sim: 12, real: 5 },
      { sim: 12, real: null },
      { sim: 12, real: null },
      { sim: 12, real: null },
    ]);
    expect(gradeOf(next, 'lab1').sim).toBe(0);
    expect(start.pc1).toEqual({ sim: 5, real: 5 });
  });

  it('clamps to 0..20', () => {
    expect(gradeOf(setSubtree({}, node('pc1'), 25), 'pc1').sim).toBe(20);
    expect(gradeOf(setSubtree({}, node('pc1'), -3), 'pc1').sim).toBe(0);
  });
});

describe('the EX1/EX2 star scenario', () => {
  it('follows grading-rules.md step by step', () => {
    let g: CourseGrades = setSubtree({}, node('ex1'), 10);
    g = markReal(g, node('ex1'));
    g = setSubtree(g, node('ex2'), 14);
    expect(showsReal(node('ex1'), g)).toBe(true);
    expect(showsReal(node('ex'), g)).toBe(false);

    g = setSubtree(g, node('ex'), 13);
    expect(gradeOf(g, 'ex1')).toEqual({ sim: 13, real: 10 });
    expect(gradeOf(g, 'ex2')).toEqual({ sim: 13, real: null });
    expect(showsReal(node('ex1'), g)).toBe(false);
    expect(hasHiddenReal(node('ex'), g)).toBe(true);

    g = setSubtree(g, node('ex'), 10);
    expect(showsReal(node('ex1'), g)).toBe(true);
    expect(showsReal(node('ex2'), g)).toBe(false);
  });
});

describe('real marks', () => {
  it('marks, unmarks and restores', () => {
    let g = markReal(setSubtree({}, node('lab1'), 9), node('lab1'));
    expect(gradeOf(g, 'lab1')).toEqual({ sim: 9, real: 9 });
    g = setSubtree(g, node('lab1'), 15);
    g = restoreReal(g, node('lab'));
    expect(gradeOf(g, 'lab1').sim).toBe(9);
    g = unmarkReal(g, node('lab1'));
    expect(gradeOf(g, 'lab1')).toEqual({ sim: 9, real: null });
  });

  it('puts the ruler star only when all leaves share the same real', () => {
    let g = markReal(setSubtree({}, node('lab'), 12), node('lab1'));
    expect(rulerStar(node('lab1'), g)).toBe(12);
    expect(rulerStar(node('lab'), g)).toBeNull();
    g = markReal(g, node('lab2'));
    expect(rulerStar(node('lab'), g)).toBe(12);
  });
});

describe('onAppStart', () => {
  it('real wins, otherwise keeps the last sim', () => {
    const g = onAppStart({ a: { sim: 15, real: 10 }, b: { sim: 7, real: null } });
    expect(g).toEqual({ a: { sim: 10, real: 10 }, b: { sim: 7, real: null } });
  });
});

describe('reconcile', () => {
  it('drops unknown leaves and new leaves start at 0', () => {
    const g = reconcile({ pc1: { sim: 4, real: null }, gone: { sim: 9, real: 9 } }, course.root);
    expect(g).toEqual({ pc1: { sim: 4, real: null } });
    expect(simValue(node('pc'), g)).toBe(1);
  });
});

import { generalAverage, isComplete, realCourseGrade } from './average';
import { markReal, setSubtree, type CourseGrades } from './grades';
import { buildCourse, type Course } from './tree';

const course = (id: string, credits: number): Course =>
  buildCourse({
    id,
    name: id,
    code: id,
    credits,
    version: 1,
    children: [
      { id: 'a', name: 'A', weight: 40 },
      { id: 'b', name: 'B', weight: 60 },
    ],
  });

const allReal = (c: Course, a: number, b: number): CourseGrades => {
  const [na, nb] = c.root.children;
  if (!na || !nb) throw new Error('fixture');
  let g = setSubtree(setSubtree({}, na, a), nb, b);
  g = markReal(markReal(g, na), nb);
  return g;
};

describe('isComplete', () => {
  it('needs a real value on every leaf', () => {
    const c = course('x', 3);
    expect(isComplete(c, {})).toBe(false);
    expect(isComplete(c, { a: { sim: 0, real: 12 } })).toBe(false);
    expect(isComplete(c, allReal(c, 12, 14))).toBe(true);
  });

  it('ignores simulation on top of real values', () => {
    const c = course('x', 3);
    const g = setSubtree(allReal(c, 12, 14), c.root, 20);
    expect(isComplete(c, g)).toBe(true);
    expect(realCourseGrade(c, g)).toBe(13);
  });
});

describe('generalAverage', () => {
  it('is null with no complete course', () => {
    expect(generalAverage([course('x', 3)], () => ({})).value).toBeNull();
  });

  it('weights rounded real course grades by credits, skipping incomplete courses', () => {
    const soc = course('soc', 2);
    const mat = course('mat', 3);
    const bio = course('bio', 4);
    const grades: Record<string, CourseGrades> = {
      soc: allReal(soc, 12, 15), // 13.8 -> 14
      mat: allReal(mat, 9, 12), // 10.8 -> 11
      bio: { a: { sim: 20, real: 20 } },
    };
    const r = generalAverage([soc, mat, bio], (id) => grades[id] ?? {});
    expect(r.value).toBeCloseTo((14 * 2 + 11 * 3) / 5, 10);
    expect(r).toMatchObject({ completeCourses: 2, credits: 5 });
  });
});

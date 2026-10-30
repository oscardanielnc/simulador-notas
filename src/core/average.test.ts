import { generalAverage, isComplete, officialCourseGrade } from './average';
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

const graded = (c: Course, a: number, b: number): CourseGrades => {
  const [na, nb] = c.root.children;
  if (!na || !nb) throw new Error('fixture');
  return setSubtree(setSubtree({}, na, a), nb, b);
};

const allReal = (c: Course, a: number, b: number): CourseGrades => {
  const [na, nb] = c.root.children;
  if (!na || !nb) throw new Error('fixture');
  return markReal(markReal(graded(c, a, b), na), nb);
};

describe('isComplete', () => {
  it('needs a real value on every leaf', () => {
    const c = course('x', 3);
    expect(isComplete(c, {})).toBe(false);
    expect(isComplete(c, { a: { sim: 0, real: 12 } })).toBe(false);
    expect(isComplete(c, allReal(c, 12, 14))).toBe(true);
  });
});

describe('officialCourseGrade', () => {
  it('rounds the shown grade half up', () => {
    const c = course('x', 3);
    expect(officialCourseGrade(c, graded(c, 12, 15))).toBe(14); // 13.8
    expect(officialCourseGrade(c, graded(c, 9, 11))).toBe(10); // 10.2
  });
});

describe('generalAverage', () => {
  it('starts at 0 with every course counted', () => {
    expect(generalAverage([course('x', 3), course('y', 2)], () => ({}))).toEqual({
      value: 0,
      completeCourses: 0,
      credits: 5,
    });
  });

  it('weights rounded course grades by credits, real or not, missing grades as 0', () => {
    const soc = course('soc', 2);
    const mat = course('mat', 3);
    const bio = course('bio', 4);
    const grades: Record<string, CourseGrades> = {
      soc: allReal(soc, 12, 15), // 13.8 -> 14
      mat: graded(mat, 9, 12), // 10.8 -> 11, simulated
      bio: { a: { sim: 20, real: 20 } }, // 8 -> 8
    };
    const r = generalAverage([soc, mat, bio], (id) => grades[id] ?? {});
    expect(r.value).toBeCloseTo((14 * 2 + 11 * 3 + 8 * 4) / 9, 10);
    expect(r).toMatchObject({ completeCourses: 1, credits: 9 });
  });
});

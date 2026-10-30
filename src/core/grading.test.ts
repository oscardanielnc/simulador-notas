import template from './fixtures/example-course.json';
import { formatGrade, isFailing, roundOfficial, value, weightLabel } from './grading';
import { buildCourse, findNode, type CourseTemplate, type GradeNode } from './tree';

const course = buildCourse(template as CourseTemplate);
const node = (id: string) => findNode(course.root, id) as GradeNode;
const grades: Record<string, number> = {
  pc1: 14,
  pc2: 14,
  pc3: 16,
  pc4: 3,
  lab1: 6,
  lab2: 9,
  ex1: 18,
  ex2: 18,
};
const leafValue = (id: string) => grades[id] ?? 0;

describe('value', () => {
  it('averages equal-weight children without intermediate rounding', () => {
    expect(value(node('pc'), leafValue)).toBe(11.75);
  });

  it('normalizes unit weights', () => {
    expect(value(node('ex'), (id) => (id === 'ex1' ? 10 : 15))).toBeCloseTo(13, 10);
  });

  it('computes the final grade from percent weights', () => {
    expect(formatGrade(value(course.root, leafValue))).toBe('13.60');
  });
});

describe('isFailing', () => {
  it('fails below 10.5 and passes at 10.5', () => {
    expect(isFailing(10.49)).toBe(true);
    expect(isFailing(10.5)).toBe(false);
  });
});

describe('weightLabel', () => {
  it('shows percent or units with percent', () => {
    expect(weightLabel(course.root, node('pc'))).toBe('20%');
    expect(weightLabel(node('pc'), node('pc1'))).toBe('25%');
    expect(weightLabel(node('ex'), node('ex1'))).toBe('2k · 40%');
  });
});

describe('roundOfficial', () => {
  it('rounds half up and survives float noise', () => {
    expect(roundOfficial(10.5)).toBe(11);
    expect(roundOfficial(10.49)).toBe(10);
    expect(roundOfficial(0.3 * 35 + 0)).toBe(11);
    expect(roundOfficial(10.499999999999998)).toBe(11);
  });
});

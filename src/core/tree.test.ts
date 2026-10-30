import template from './fixtures/example-course.json';
import { buildCourse, leaves, validateTemplate, type CourseTemplate } from './tree';

const valid = template as CourseTemplate;

describe('buildCourse', () => {
  it('defaults missing weights to equal and keeps the tree', () => {
    const course = buildCourse(valid);
    expect(leaves(course.root).map((l) => l.id)).toEqual([
      'pc1',
      'pc2',
      'pc3',
      'pc4',
      'lab1',
      'lab2',
      'ex1',
      'ex2',
    ]);
    expect(course.root.children[0]?.children[0]?.weight).toBe(1);
  });
});

describe('validateTemplate', () => {
  it('accepts the example', () => {
    expect(validateTemplate(valid)).toEqual([]);
  });

  it('rejects duplicated ids', () => {
    const t = {
      ...valid,
      children: [...valid.children.slice(0, 2), { id: 'pc', name: 'X', weight: 50 }],
    };
    expect(validateTemplate(t).join()).toMatch('pc: duplicated id');
  });

  it('rejects percent weights that do not sum 100', () => {
    const t = {
      ...valid,
      children: [
        { id: 'a', name: 'A', weight: 40 },
        { id: 'b', name: 'B', weight: 50 },
      ],
    };
    expect(validateTemplate(t).join()).toMatch('sum 90');
  });

  it('rejects more than 14 children', () => {
    const children = Array.from({ length: 15 }, (_, i) => ({ id: `n${i}`, name: `N${i}` }));
    expect(validateTemplate({ ...valid, children }).join()).toMatch('more than 14');
  });

  it('rejects weight <= 0', () => {
    const t = {
      ...valid,
      children: [
        { id: 'a', name: 'A', weight: 0 },
        { id: 'b', name: 'B', weight: 100 },
      ],
    };
    expect(validateTemplate(t).join()).toMatch('a: weight must be > 0');
  });
});

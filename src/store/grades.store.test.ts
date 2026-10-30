import { gradeOf } from '@/core/grades';
import { courseById } from '@/data/courses';

import { hydrate, useGradesStore } from './grades.store';

jest.mock('expo-sqlite/kv-store', () => {
  const data = new Map<string, string>();
  return {
    __esModule: true,
    default: {
      getItem: (k: string) => Promise.resolve(data.get(k) ?? null),
      setItem: (k: string, v: string) => Promise.resolve(void data.set(k, v)),
      removeItem: (k: string) => Promise.resolve(void data.delete(k)),
    },
  };
});

const MAT = 'matematica';
const grades = () => useGradesStore.getState().grades[MAT] ?? {};

beforeEach(() => useGradesStore.setState({ grades: {} }));

describe('grades store', () => {
  it('setValue on a unit moves every leaf under it', () => {
    useGradesStore.getState().setValue(MAT, 'u1', 14);
    expect(['u1-te', 'u1-ex', 'u1-es'].map((id) => gradeOf(grades(), id).sim)).toEqual([
      14, 14, 14,
    ]);
    expect(gradeOf(grades(), 'u2-ex').sim).toBe(0);
  });

  it('markReal, unmarkReal and restoreReal', () => {
    const s = useGradesStore.getState();
    s.setValue(MAT, 'u1-ex', 12);
    s.markReal(MAT, 'u1-ex');
    expect(gradeOf(grades(), 'u1-ex')).toEqual({ sim: 12, real: 12 });
    s.setValue(MAT, 'u1-ex', 18);
    s.restoreReal(MAT, 'u1');
    expect(gradeOf(grades(), 'u1-ex').sim).toBe(12);
    s.unmarkReal(MAT, 'u1-ex');
    expect(gradeOf(grades(), 'u1-ex').real).toBeNull();
  });

  it('ignores unknown courses and nodes', () => {
    useGradesStore.getState().setValue('nope', 'u1', 5);
    useGradesStore.getState().setValue(MAT, 'nope', 5);
    expect(useGradesStore.getState().grades).toEqual({});
  });
});

describe('hydrate', () => {
  const mat = courseById(MAT);
  if (!mat) throw new Error('fixture');

  it('applies real wins and drops stale leaves and courses', () => {
    const saved = {
      grades: {
        [MAT]: {
          'u1-ex': { sim: 18, real: 11 },
          'u1-te': { sim: 7, real: null },
          old: { sim: 1, real: 1 },
        },
        gone: { x: { sim: 1, real: null } },
      },
    };
    expect(hydrate(saved, [mat])).toEqual({
      [MAT]: { 'u1-ex': { sim: 11, real: 11 }, 'u1-te': { sim: 7, real: null } },
    });
  });

  it('starts empty on corrupt data', () => {
    expect(hydrate({ grades: { [MAT]: { 'u1-ex': { sim: 99, real: null } } } }, [mat])).toEqual({});
    expect(hydrate(undefined, [mat])).toEqual({});
  });
});

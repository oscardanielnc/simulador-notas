import { fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useGradesStore } from '@/store/grades.store';
import { color } from '@/theme/tokens';

import { CourseRoute } from './CourseRoute';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

const renderCourse = (courseId: string) =>
  render(
    <SafeAreaProvider initialMetrics={metrics}>
      <CourseRoute courseId={courseId} onBack={jest.fn()} onDrill={jest.fn()} />
    </SafeAreaProvider>,
  );

/** Moves the ruler one step per call, like a screen reader swipe. */
const bump = async (times = 1) => {
  for (let i = 0; i < times; i++) {
    await fireEvent(screen.getByLabelText('Regla de notas'), 'accessibilityAction', {
      nativeEvent: { actionName: 'increment' },
    });
  }
};
const markAllReal = (courseId: string, ids: string[]) => {
  const s = useGradesStore.getState();
  for (const id of ids) {
    s.setValue(courseId, id, 12);
    s.markReal(courseId, id);
  }
};
const firstText = (text: string) => {
  const [first] = screen.getAllByText(text);
  if (!first) throw new Error(`no ${text}`);
  return first;
};
const stars = () => screen.queryAllByTestId('corner-star').length;

beforeEach(() => useGradesStore.setState({ grades: {} }));

describe('course screen', () => {
  it('warns that only real grades are saved', async () => {
    await renderCourse('sociologia');
    expect(screen.getByText(/Solo se guardan las notas con estrella/)).toBeTruthy();
  });

  it('starts every grade at 0 with the first leaf selected', async () => {
    await renderCourse('matematica');
    expect(screen.getAllByText('0.00')).toHaveLength(3); // one per unit
    expect(screen.getByLabelText('Regla de notas')).toBeTruthy();
  });

  it('opens on the first grade without a real value', async () => {
    markAllReal('sociologia', ['u1-pc']);
    await renderCourse('sociologia');
    expect(screen.getByText('EVAL · Evaluación')).toBeTruthy();
  });

  it('opens on the last grade when every grade is real', async () => {
    const units = ['u1', 'u2', 'u3'];
    const codes = ['ep', 'pt', 'pc', 'campo'];
    markAllReal(
      'antropologia',
      units.flatMap((u) => codes.map((c) => (u === 'u3' && c === 'ep' ? 'u3-ef' : `${u}-${c}`))),
    );
    await renderCourse('antropologia');
    expect(screen.getByText('CAMPO · Prácticas de campo')).toBeTruthy();
  });

  it('selecting a chip shows its full name in the sheet', async () => {
    await renderCourse('antropologia');
    await fireEvent.press(firstText('EXAM'));
    expect(screen.getByText('EXAM · Examen parcial I')).toBeTruthy();
  });

  it('+ changes the number and every parent', async () => {
    await renderCourse('antropologia');
    await fireEvent.press(firstText('EXAM'));
    await bump(10);
    expect(screen.getAllByText('10').length).toBeGreaterThan(0);
    expect(screen.getByText('3.00')).toBeTruthy(); // Unidad I: 10 x 30%
    expect(screen.getByText(/^0\.90/)).toBeTruthy(); // final: 3 x 30%
  });

  it('shows and hides the real star like the EX1/EX2 scenario', async () => {
    await renderCourse('matematica');
    await fireEvent.press(firstText('EXAM'));
    await bump(10);
    await fireEvent.press(screen.getByText('Marcar real'));
    expect(stars()).toBe(1);

    await fireEvent.press(screen.getByText('Unidad I'));
    await bump(); // 7.5 rounds to 8, + makes 9 on every leaf
    expect(stars()).toBe(0);
    expect(screen.getByText('Ver real')).toBeTruthy();

    await bump(); // 10 again: EX1 equals its real
    expect(stars()).toBe(1);
  });

  it('paints grades below 10.5 in danger red', async () => {
    await renderCourse('gestion-informacion');
    await fireEvent.press(firstText('Unidad I'));
    await bump(10);
    expect(screen.getAllByText('10')[0]).toHaveStyle({ color: color.danger });
    await bump();
    expect(screen.getAllByText('11')[0]).toHaveStyle({ color: color.text });
  });
});

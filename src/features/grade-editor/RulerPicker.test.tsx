import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { State } from 'react-native-gesture-handler';
import { fireGestureHandler, getByGestureTestId } from 'react-native-gesture-handler/jest-utils';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { CourseRoute } from '@/compose/CourseRoute';
import { useGradesStore } from '@/store/grades.store';

import { flingTarget } from './ruler-logic';
import { STEP } from './RulerPicker';

const WIDTH = 390;
const metrics = {
  frame: { x: 0, y: 0, width: WIDTH, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

// Matemática opens on its first pending leaf: Unidad I · TE.
const COURSE = 'matematica';
const LEAF = 'u1-te';

const flush = () => act(async () => {});
const sim = (leaf = LEAF) => useGradesStore.getState().grades[COURSE]?.[leaf]?.sim ?? 0;
const real = (leaf = LEAF) => useGradesStore.getState().grades[COURSE]?.[leaf]?.real ?? null;

async function open() {
  await render(
    <SafeAreaProvider initialMetrics={metrics}>
      <CourseRoute courseId={COURSE} onBack={jest.fn()} onDrill={jest.fn()} />
    </SafeAreaProvider>,
  );
  await fireEvent(screen.getByLabelText('Regla de notas'), 'layout', {
    nativeEvent: { layout: { x: 0, y: 0, width: WIDTH, height: 100 } },
  });
}

/** Drags by `steps` numbers (positive = higher grades) in `frames` moves, then releases. */
async function drag(steps: number, velocityX = 0, frames = 3) {
  const dx = -steps * STEP;
  const moves = Array.from({ length: frames }, (_, k) => ({
    translationX: (dx * (k + 1)) / frames,
  }));
  fireGestureHandler(getByGestureTestId('ruler-pan'), [
    { state: State.BEGAN, translationX: 0 },
    { state: State.ACTIVE, translationX: 0 },
    ...moves,
    { state: State.END, translationX: dx, velocityX },
  ]);
  await flush();
}

/** Taps `offset` numbers right (+) or left (−) of the center line. */
async function tapAt(offset: number) {
  const x = WIDTH / 2 + offset * STEP;
  fireGestureHandler(getByGestureTestId('ruler-tap'), [
    { state: State.BEGAN, x },
    { state: State.ACTIVE, x },
    { state: State.END, x },
  ]);
  await flush();
}

beforeEach(() => useGradesStore.setState({ grades: {} }));

describe('ruler picker: fast input never desyncs the card', () => {
  it('a slow drag stores exactly the number under the line', async () => {
    await open();
    await drag(15);
    expect(sim()).toBe(15);
  });

  it('a fast fling stores the number it lands on, not one before it', async () => {
    await open();
    await drag(12, -1200, 1);
    expect(sim()).toBe(flingTarget(12, -1200, STEP));
  });

  it('twenty quick back-and-forth flings end on the last landing number', async () => {
    await open();
    let expected = 0;
    const plan: [number, number][] = [
      [9, -3000],
      [-4, 2500],
      [7, -900],
      [3, -100],
      [-11, 4000],
      [14, -1800],
      [-2, 600],
      [5, -2200],
      [-6, 1500],
      [2, 0],
      [8, -5000],
      [-20, 9000],
      [15, -10],
      [1, -400],
      [-3, 300],
      [4, -700],
      [-1, 50],
      [2, -1200],
      [-5, 2000],
      [3, -300],
    ];
    for (const [steps, v] of plan) {
      const released = Math.min(20, Math.max(0, expected + steps));
      expected = flingTarget(released, v, STEP);
      await drag(steps, v, 1);
      expect(sim()).toBe(expected);
    }
  });

  it('mark real right after a fast fling saves the shown number', async () => {
    await open();
    await drag(15, -60, 1);
    const landed = flingTarget(15, -60, STEP);
    await fireEvent.press(screen.getByText('Marcar real'));
    expect(real()).toBe(landed);
    expect(sim()).toBe(landed);
  });

  it('a touch that stops the strip without dragging keeps a whole number', async () => {
    await open();
    await drag(10);
    fireGestureHandler(getByGestureTestId('ruler-pan'), [
      { state: State.BEGAN },
      { state: State.FAILED },
    ]);
    await flush();
    expect(sim()).toBe(10);
  });
});

describe('ruler picker: tap a number', () => {
  it('tapping 16 while 12 is centered selects 16', async () => {
    await open();
    await drag(12);
    await tapAt(4);
    expect(sim()).toBe(16);
  });

  it('tapping left goes down and the edges stay in 0..20', async () => {
    await open();
    await tapAt(3);
    expect(sim()).toBe(3);
    await tapAt(-2);
    expect(sim()).toBe(1);
    await tapAt(-4);
    expect(sim()).toBe(0);
    await drag(20);
    await tapAt(3);
    expect(sim()).toBe(20);
  });

  it('mixing taps, flings and mark real keeps card and ruler equal', async () => {
    await open();
    await tapAt(4); // 4
    await drag(8, -900, 1); // released at 12, lands further
    const landed = flingTarget(12, -900, STEP);
    expect(sim()).toBe(landed);
    await tapAt(-1);
    expect(sim()).toBe(landed - 1);
    await fireEvent.press(screen.getByText('Marcar real'));
    expect(real()).toBe(landed - 1);
  });

  it('the unit card follows the tapped grade', async () => {
    await open();
    await tapAt(4); // TE = 4 → Unidad I = 4 × 15% = 0.60 → final = 0.60 × 30% = 0.18
    expect(screen.getByText('0.60')).toBeTruthy();
    expect(screen.getByText(/^0\.18/)).toBeTruthy();
  });
});

import { clampGrade, createCommitGate, flingTarget, tapTarget } from './ruler-logic';

const STEP = 48;

describe('ruler math', () => {
  it('clamps to 0..20', () => {
    expect(clampGrade(-3)).toBe(0);
    expect(clampGrade(25)).toBe(20);
    expect(clampGrade(7.4)).toBe(7.4);
  });

  it('a slow release lands on the nearest whole number', () => {
    expect(flingTarget(14.4, 0, STEP)).toBe(14);
    expect(flingTarget(14.6, 0, STEP)).toBe(15);
  });

  it('a fast fling goes further but never leaves 0..20', () => {
    expect(flingTarget(12, -800, STEP)).toBe(15);
    expect(flingTarget(12, -20000, STEP)).toBe(20);
    expect(flingTarget(3, 20000, STEP)).toBe(0);
  });

  it('a tap picks the number under the finger', () => {
    const width = 390;
    expect(tapTarget(12, width / 2, width, STEP)).toBe(12);
    expect(tapTarget(12, width / 2 + 4 * STEP, width, STEP)).toBe(16);
    expect(tapTarget(12, width / 2 - 2 * STEP + 10, width, STEP)).toBe(10);
    expect(tapTarget(19, width, width, STEP)).toBe(20);
  });
});

describe('commit gate', () => {
  it('a late live value from a finished touch is dropped', () => {
    const gate = createCommitGate();
    expect(gate.live(1, 5)).toBe(true);
    expect(gate.commit(1, 6)).toBe(true);
    expect(gate.live(1, 7)).toBe(false);
  });

  it('an older commit never overwrites a newer touch', () => {
    const gate = createCommitGate();
    expect(gate.commit(3, 9)).toBe(true);
    expect(gate.commit(2, 4)).toBe(false);
    expect(gate.live(4, 10)).toBe(true);
  });

  it('whatever the arrival order, the newest touch decides the final number', () => {
    // Many fast touches; each sends live values then its commit, and messages arrive shuffled.
    let seed = 7;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let run = 0; run < 500; run++) {
      const messages: { kind: 'live' | 'commit'; gen: number; v: number }[] = [];
      const touches = 2 + Math.floor(rand() * 6);
      const finals: number[] = [];
      for (let gen = 1; gen <= touches; gen++) {
        for (let k = 0; k < 4; k++)
          messages.push({ kind: 'live', gen, v: Math.floor(rand() * 21) });
        const v = Math.floor(rand() * 21);
        finals.push(v);
        messages.push({ kind: 'commit', gen, v });
      }
      // Worst case: fully random arrival order.
      const shuffled = [...messages].sort(() => rand() - 0.5);
      const gate = createCommitGate();
      let shown = -1;
      for (const m of shuffled) {
        if (m.kind === 'live' ? gate.live(m.gen, m.v) : gate.commit(m.gen, m.v)) shown = m.v;
      }
      expect(shown).toBe(finals[touches - 1]);
    }
  });

  it('tells its own updates apart from outside changes', () => {
    const gate = createCommitGate(12);
    expect(gate.isOutside(12)).toBe(false);
    gate.commit(1, 15);
    expect(gate.isOutside(15)).toBe(false);
    expect(gate.isOutside(9)).toBe(true); // e.g. "Ver real"
    expect(gate.isOutside(9)).toBe(false);
  });
});

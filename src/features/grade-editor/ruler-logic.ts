/** Pure helpers behind RulerPicker. The worklet ones also run on the UI thread. */

export const MAX_GRADE = 20;

export const clampGrade = (v: number) => {
  'worklet';
  return Math.min(MAX_GRADE, Math.max(0, v));
};

/** Whole number a release lands on: the fling carries the strip a little further. */
export const flingTarget = (pos: number, velocityX: number, step: number) => {
  'worklet';
  return Math.round(clampGrade(pos - (velocityX / step) * 0.18));
};

/** Whole number under a tap; `x` is measured from the ruler's left edge. */
export const tapTarget = (pos: number, x: number, width: number, step: number) => {
  'worklet';
  return Math.round(clampGrade(pos + (x - width / 2) / step));
};

/**
 * Orders what the UI thread reports to JS. Every touch gets a bigger generation number.
 * A final value (commit) always wins over live values from its own or an older touch,
 * so a late live update can never overwrite the number the strip landed on.
 * It also remembers the last number it let through, so the picker can tell its own
 * updates apart from outside changes (Ver real, screen reader).
 */
export function createCommitGate(initial = 0) {
  let committed = -1;
  let reported = initial;
  const pass = (v: number) => {
    reported = v;
    return true;
  };
  return {
    live: (gen: number, v: number) => gen > committed && pass(v),
    commit: (gen: number, v: number) => {
      if (gen < committed) return false;
      committed = gen;
      return pass(v);
    },
    /** True when `v` is not what the picker last reported; remembers it from now on. */
    isOutside: (v: number) => v !== reported && pass(v),
  };
}

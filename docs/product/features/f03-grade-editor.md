# F03 · Grade editor (ruler slider)

- Fixed bottom sheet, always visible; `tint` background, upward shadow, top corners 28 (design/tokens.md § Editor sheet).
- Row 1: selected element's **name only** (no extra explanation); a leaf with `fullName` shows "PC · Práctica calificada" + buttons "Ver real" / "Marcar real ★" / "Quitar real" (rules in grading-rules.md).
- Row 2: the number picker, full width; its center number, shown large, is the current grade (no separate big number, changed 2026-10-30). No `−` / `+` buttons (removed 2026-10-30: dragging is enough).

Number picker (changed 2026-10-30)

- Floating numbers with a short line under each, no ruler background. The numbers grow and darken near the center line and fade toward the edges.
- Fling: release velocity carries it a few numbers further, then it eases out onto an integer (UI thread, `withTiming` + cubic ease-out).
- Tap a number: it slides to the center and becomes the grade (added 2026-11-01; users tapped 16 instead of dragging from 12).
- Every touch ends with one explicit commit of the number it lands on, sent at release, before the animation ends. Live values while dragging are only a preview; a generation counter drops any that arrive late (fixed 2026-11-01: a fast fling could leave the card one number behind the ruler).

- Horizontal strip with ticks 0–20 moving under a fixed center indicator. ≥ 32 dp between integers. Long ticks at 0, 5, 10, 15, 20, numbers under every tick.
- Drag to scroll, snaps to integers, haptic tick (`expo-haptics` selection) on every change. Values outside 0–20 are impossible.
- ★ above the real value's tick (grading-rules.md § Ruler star).
- Implement with `react-native-gesture-handler` + `react-native-reanimated`; the visible number updates on the UI thread, the store is written on each integer change.

Acceptance

- The card and the ruler always show the same number, however fast the user drags, flings or taps (`RulerPicker.test.tsx`).
- Going from 0 to 20 needs one comfortable swipe or a fling; screen readers move it one step with the adjustable increment/decrement actions.

# F03 · Grade editor (ruler slider)

- Fixed bottom sheet, light lavender, top corners 28.
- Row 1: selected element's **name only** (no extra explanation); a leaf with `fullName` shows "PC · Práctica calificada" + buttons "Ver real" / "Marcar real ★" / "Quitar real" (rules in grading-rules.md).
- Row 2: the current integer, large (red if < 10.5).
- Row 3: `−` button · ruler · `+` button.

Ruler

- Horizontal strip with ticks 0–20 moving under a fixed center indicator. ≥ 32 dp between integers. Long ticks at 0, 5, 10, 15, 20, numbers under every tick.
- Drag to scroll, snaps to integers, haptic tick (`expo-haptics` selection) on every change. Values outside 0–20 are impossible.
- ★ above the real value's tick (grading-rules.md § Ruler star).
- Implement with `react-native-gesture-handler` + `react-native-reanimated`; the visible number updates on the UI thread, the store is written on each integer change.

Acceptance

- Going from 0 to 20 needs one comfortable swipe or two; landing on an exact integer never needs the +/− buttons, but they work.

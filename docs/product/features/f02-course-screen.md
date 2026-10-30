# F02 · Course screen

Layout (top to bottom), see design/mockup-v4.html:

1. Header: round back button + course name.
2. Final grade card: darkest purple, white text, value `/20`, progress ring (red ring if < 10.5).
3. One card per criterion: name, weight, value (2 decimals), progress bar, and its children as chips in a 4-column grid (name, integer grade, weight label).
4. Fixed bottom sheet: F03.

Behavior

- Tapping any card or chip selects it. Only the selected element gets a visible border (semi-thick, accent purple). Nothing else has borders: soft shadow only.
- The editor sheet is always visible. On open, the selected element is the first leaf (reading order) without a real grade; if every leaf is real, the last leaf (changed 2026-10-30, `core/grades.firstPending`).
- A criterion with 0 children is itself a leaf: its card shows an integer and is edited directly.
- A chip that has its own children shows a small chevron. Tapping it selects it; tapping the chevron drills down: a screen with the same layout where that node is the header card. Back returns.
- ★ icon at the top-right corner of any element that shows its real grade (F04).

Acceptance

- 14 chips fit without horizontal scroll (4 columns, wraps to 4 rows).
- Every number updates in the same frame as the slider moves.

# Grading rules

Single source of truth for every calculation. All of these live in `src/core/` as pure functions with tests.

## Tree

- A course is a tree. Root = final grade. Any node may have 0–14 children. Depth is unlimited.
- Leaves hold the grades. Parents are always computed, never stored.

## Weights

- Each child has a `weight` relative to its siblings. Missing weights → all siblings equal.
- The parent declares how weights are written: `percent` (40, 60) or `units` (2k, 3k).
- Math is always normalized: `value(parent) = Σ value(child) × weight / Σ weights`.
- Display: `percent` → "40%"; `units` → "2k · 40%".

## Precision

- Leaves are integers 0–20 (slider).
- Parents and the final grade are shown with exactly 2 decimals. **No intermediate rounding**: a parent uses its children's exact values (4 practices 14, 14, 16, 3 → 11.75, not 12).

## Colors by grade

- `value < 10.5` → danger red. `value ≥ 10.5` → base text color. Applies to leaves, parents, final grade and the ring.

## Real vs simulated (two layers per leaf)

- Each leaf stores `sim` (what is shown) and `real` (optional, `null` = never marked).
- All leaves start at `sim = 0`, `real = null`.
- The user can always move the slider; that only changes `sim`.
- **Real badge (★ icon, never ✨)**: shown automatically on a leaf when `real !== null && sim === real`.
- A parent shows ★ when every leaf under it shows ★.
- "Marcar real" on a leaf → `real = sim`. If the leaf already shows ★ the button reads "Quitar real" → `real = null` (sim unchanged).
- "Ver real" (visible when any leaf under the selection has `real !== null && sim !== real`) → those leaves get `sim = real`.

## Editing a parent

- Selecting a parent and moving the slider sets `sim` of **every leaf below it** to that integer. `real` is never touched.
- Example: EX1 real 10, EX2 sim 14. Move Exámenes to 13 → both 13, no ★. Move to 10 → EX1 shows ★ again (equals its real), EX2 doesn't.
- When a parent is selected, the slider starts at `round(value)`; nothing changes until the user moves it.

## Persistence and app start

- Every change is saved on the phone immediately (`sim` and `real`).
- On app start, for each leaf: if `real !== null` → `sim = real`; else keep the last `sim`.

## Ruler star

- The ruler shows ★ above the tick equal to the selected leaf's `real`. For a parent, only if all its leaves have the same `real`.

## Course completion and general average (home)

Decided by Oscar on 2026-10-30.

- A course is **complete** when every leaf has `real !== null`. Complete courses get ★ on their home card.
- The general average uses **only real grades** and **only complete courses**.
- Course grade for the average = `value()` of the root using each leaf's `real`, then **rounded to an integer** the way the university does (half up: 10.5 → 11, 10.49 → 10). Guard float noise with a small epsilon.
- `generalAverage = Σ round(realGrade) × credits / Σ credits` over complete courses, shown with 2 decimals. No complete course → `null` (shown as `—`).
- Example: Sociología (2 cr) real 13.6 → 14, Matemática (3 cr) real 10.5 → 11 → (14×2 + 11×3) / 5 = 12.20.

# Tokens

## Color (purple ramp)

| Token       | Hex                  | Use                                       |
| ----------- | -------------------- | ----------------------------------------- |
| bg          | #FFFFFF              | Screen                                    |
| surface     | #F6F5FE              | Criterion cards, bottom sheet             |
| surfaceChip | #FFFFFF              | Chips                                     |
| tint        | #EEEDFE              | Buttons, back button                      |
| track       | #E4E2FA              | Progress bar track                        |
| muted       | #AFA9EC              | Weight labels, ruler ticks                |
| secondary   | #7F77DD              | Labels, progress fill, selection border   |
| accent      | #534AB7              | Final card bg, ruler indicator, ★         |
| strong      | #3C3489              | Button text, real tick number             |
| text        | #26215C              | Body text                                 |
| danger      | #E24B4A              | Grades < 10.5                             |
| shadow      | rgba(83,74,183,0.08) | Cards (y 2, blur 12), chips (y 1, blur 6) |

## Type

Plus Jakarta Sans (`@expo-google-fonts/plus-jakarta-sans`), weights 400/500/600, tabular numbers for grades.
Sizes: final 38 · criterion value 24 · editor value 36 · chip value 17 · title 16 · label 12 · small 11.

## Shape and spacing

Radii: phone sheet top 28 · cards 20 · chips 14 · pills 999. Card padding 12–16. Gap between cards 12. Chip grid: 4 columns, gap 6.
Selection border: 2.5 dp `secondary`. Every card reserves the 2.5 dp transparent border so selecting never shifts layout.

## Motion

Value changes: no animation on numbers (instant). Progress bar and ring: 150 ms ease-out. Selection border: 120 ms fade. Haptic selection tick on each integer.

## Ring (changed twice on 2026-10-30)

- Lavender cards (home course cards): ring with track `track`, fill `secondary`, or `danger` when < 10.5. No label.
- Dark cards (final grade, general average): one ring, no disc, no label. Groove `#40389A` (darker than the card), fill a diagonal gradient `#C9C3FF` → `#FFFFFF`; `danger` stays as is when < 10.5. Nothing is drawn at 0. Inspired by iOS Activity rings: dark groove, bright fill.
- Rejected: white/22% track with pink fill (low contrast), white disc with a ring and the number inside (Oscar: "círculo dentro de círculo").

## Editor sheet (changed 2026-10-30)

Always visible. Background `tint`, upward shadow (`text`, 18%, blur 20, elevation 24). The picker is floating numbers (15, scale 1.35 at center, opacity 0.2 at 4 steps) over short `muted` lines, 40 dp apart, center line `accent`. No handle, no −/+ buttons, no white ruler strip (rejected: looked like a ruler and hid the star).
Hidden until the first tap on a grade; slides up (220 ms). Background `tint`, upward shadow (`text`, 18%, blur 20, elevation 24), a grabber handle (40×5, `muted`) that hides it. Ruler and buttons sit on white so they stand out from the sheet.

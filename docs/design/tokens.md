# Tokens

## Color (purple ramp)

| Token        | Hex                  | Use                                       |
| ------------ | -------------------- | ----------------------------------------- |
| bg           | #FFFFFF              | Screen                                    |
| surface      | #F6F5FE              | Criterion cards, bottom sheet             |
| surfaceChip  | #FFFFFF              | Chips                                     |
| tint         | #EEEDFE              | Buttons, back button                      |
| track        | #E4E2FA              | Progress bar track                        |
| muted        | #AFA9EC              | Weight labels, ruler ticks                |
| secondary    | #7F77DD              | Labels, progress fill, selection border   |
| accent       | #534AB7              | Final card bg, ruler indicator, ★         |
| strong       | #3C3489              | Button text, real tick number             |
| text         | #26215C              | Body text                                 |
| danger       | #E24B4A              | Grades < 10.5                             |
| dangerOnDark | #F09595              | Ring on the final card when failing       |
| shadow       | rgba(83,74,183,0.08) | Cards (y 2, blur 12), chips (y 1, blur 6) |

## Type

Plus Jakarta Sans (`@expo-google-fonts/plus-jakarta-sans`), weights 400/500/600, tabular numbers for grades.
Sizes: final 38 · criterion value 24 · editor value 36 · chip value 17 · title 16 · label 12 · small 11.

## Shape and spacing

Radii: phone sheet top 28 · cards 20 · chips 14 · pills 999. Card padding 12–16. Gap between cards 12. Chip grid: 4 columns, gap 6.
Selection border: 2.5 dp `secondary`. Every card reserves the 2.5 dp transparent border so selecting never shifts layout.

## Motion

Value changes: no animation on numbers (instant). Progress bar and ring: 150 ms ease-out. Selection border: 120 ms fade. Haptic selection tick on each integer.

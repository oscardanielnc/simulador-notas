# F01 · Home: courses and general average

Changed by Oscar on 2026-10-30: no course picker. Home always lists every course template (7 today).

Layout (top to bottom)

1. **General average card** (darkest purple, like the final grade card): "Promedio general", value with 2 decimals `/20` (red ring if < 10.5), and "N de 7 cursos completos · C créditos". Always visible; shows `—` while no course is complete.
2. One card per course: full name, code, credits ("3 créditos"), current final grade (2 decimals, red if < 10.5), small progress ring, and ★ at the top-right corner when the course is **complete**.

Rules: [grading-rules.md](../grading-rules.md) § General average.

Behavior

- Tapping a card opens F02.
- ★ on a course card means "every grade of this course has a real value". A card without ★ tells the student some grade is still missing; she opens it to see which chip has no ★.

Acceptance

- 7 cards, each with name, code and credits.
- With no complete course the general average shows `—`.
- Completing every real grade of a course adds its ★ and makes it count in the general average.

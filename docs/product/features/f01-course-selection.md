# F01 · Home: courses and general average

Changed by Oscar on 2026-10-30: no course picker, no footer hint. Home always lists every course template (7 today).

Layout (top to bottom)

1. **General average card** (darkest purple): "Promedio general", value with 2 decimals `/20`, ring, and "N de 7 cursos completos · 18 créditos". Always visible, computed from day one.
2. One card per course, in this order: Sociología, Gestión de la Información, Antropología, Filosofía General, Lenguaje y Comunicación, Matemática, Biología Celular y Molecular. Each shows full name, credits as a filled pill tag ("3 créditos"), code in muted text, current grade (2 decimals, red if < 10.5), a ring with the rounded grade, and ★ at the top-right corner when the course is **complete**.

Rules: [grading-rules.md](../grading-rules.md) § General average.

Behavior

- Tapping a card opens F02.
- ★ on a course card means "every grade of this course has a real value". A card without ★ tells the student some grade is still missing; she opens it to see which chip has no ★.

Acceptance

- 7 cards, each with name, code and credits.
- With nothing graded the general average shows 0.00.
- Any grade change (real or simulated) moves the general average; completing every real grade of a course adds its ★.

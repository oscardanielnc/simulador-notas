# Course template format

One JSON file per course in `src/data/courses/`, validated with Zod at test time and at app start.

```json
{
  "id": "example-course",
  "name": "Curso de ejemplo",
  "code": "0000XX0000",
  "credits": 3,
  "version": 1,
  "childWeightUnit": "percent",
  "children": [
    {
      "id": "pc",
      "name": "Prácticas",
      "weight": 20,
      "children": [
        { "id": "pc1", "name": "PC1" },
        { "id": "pc2", "name": "PC2" },
        { "id": "pc3", "name": "PC3" },
        { "id": "pc4", "name": "PC4" }
      ]
    },
    {
      "id": "lab",
      "name": "Laboratorio",
      "weight": 30,
      "children": [
        { "id": "lab1", "name": "LAB1", "fullName": "Laboratorio 1" },
        { "id": "lab2", "name": "LAB2" }
      ]
    },
    {
      "id": "ex",
      "name": "Exámenes",
      "weight": 50,
      "childWeightUnit": "units",
      "children": [
        { "id": "ex1", "name": "EX1", "weight": 2 },
        { "id": "ex2", "name": "EX2", "weight": 3 }
      ]
    }
  ]
}
```

Rules

- `id` unique inside the course and stable forever (saved grades are keyed by it). Renaming = change `name`, never `id`.
- `childWeightUnit`: `percent` | `units`, default `percent`. With `percent`, sibling weights must sum 100 (test fails otherwise).
- `weight` > 0. Omitted on all siblings → equal weights.
- `code` (syllabus code) and `credits` (integer > 0) are required: home shows them and credits weight the general average.
- Max 14 children per node. Short names (≤ 8 chars) for leaves: they render as chips.
- `version` goes up when the tree changes. On load, saved leaves whose id no longer exists are dropped; new leaves start at 0.

Naming (Oscar, 2026-10-30)

- Sections (direct children of the root) keep their full name: "Unidad III".
- Leaves render as chips and use a short code: PC (práctica calificada), EP/EF (examen parcial/final), LAB, TE (trabajos encargados), EG (exposición grupal), PT (plan de trabajo), CAMPO, REG, FICHA, EVAL. The long name goes in `fullName` and is shown in the editor sheet.
- Leaf ids are `<unit>-<code>` (`u3-ef`) and never change.

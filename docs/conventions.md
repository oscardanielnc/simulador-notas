# Conventions

- TypeScript strict. No `any`.
- `core/` functions are pure and return new objects; never mutate inputs.
- Grades: integers for leaves (`0..20`); computed values are `number`, formatted only at render with `formatGrade(v)` → 2 decimals.
- Ids from templates are stable keys; never derive ids from names.
- Every user-facing string comes from `src/i18n/es.ts`.
- Components ≤ 150 lines; one file per component with its test.
- Conventional Commits. No AI marks (commit-msg hook strips them).

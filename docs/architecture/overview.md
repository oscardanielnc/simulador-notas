# Architecture

Single Expo app (no monorepo, no backend in v1, ADR 0001).

```
src/
  app/                 Expo Router routes: index (home), course/[id], course/[id]/node/[nodeId]
  core/                PURE TypeScript, zero React/Expo imports (hexagonal domain)
    tree.ts            types + build/validate tree from template
    grading.ts         value(), isFailing(), weightLabel()
    average.ts         isComplete(), realCourseGrade(), generalAverage()
    grades.ts          setSubtree(), markReal(), unmarkReal(), restoreReal(), onAppStart(), showsReal()
    *.test.ts
  data/courses/        JSON templates + schema.ts (Zod) + index.ts (static imports)
  features/
    home/              general average card + course cards
    course-screen/     FinalGradeCard, CriterionCard, GradeChip, screen
    grade-editor/      EditorSheet, RulerPicker
  store/               grades.store.ts (Zustand + persist) — the only place that talks to storage
  theme/               tokens.ts, fonts
  i18n/es.ts           all user-facing strings (Spanish)
```

Dependency rule: `core` imports nothing from the app. `features` import `core`, `store`, `theme`, `i18n`; never another feature. Forced with `import/no-restricted-paths`.

Data flow

```
template JSON ─► core.buildTree ─► screen renders tree
slider ─► store.setSubtree(courseId, nodeId, v) ─► core (pure) ─► new grades ─► persist
```

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
  compose/             screens that join features (CourseRoute = course-screen + grade-editor)
  ui/                  shared visual pieces: StarIcon, ProgressRing, ProgressBar, Pill
  store/               grades.store.ts (Zustand + persist) — the only place that talks to storage
  theme/               tokens.ts, fonts
  i18n/es.ts           all user-facing strings (Spanish)
```

Dependency rule: `core` imports nothing from the app. `features` import `core`, `data`, `store`, `theme`, `i18n`, `ui`; never another feature or a route. `compose` and `app` join features. Forced with `no-restricted-imports` in eslint.config.mjs.

Data flow

```
template JSON ─► core.buildTree ─► screen renders tree
slider ─► store.setSubtree(courseId, nodeId, v) ─► core (pure) ─► new grades ─► persist
```

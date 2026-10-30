# Mis notas

Android app for a university student in Peru: pick a course, see its grading tree, record
real grades and drag a number picker to ask "what do I need in the final exam?". Every
parent grade and the credit-weighted general average recompute as you drag.

**Download:** [latest APK](https://github.com/oscardanielnc/simulador-notas/releases/latest)
(Android, arm64).

## What it does

- **A course is a weighted tree.** Final grade → units → evaluations, each with its own
  weight. One recursive formula covers every syllabus; nothing is rounded until the course
  grade (`src/core/grading.ts`).
- **Two layers per grade.** `sim` is what you drag; `real` is what actually happened, marked
  with ★. Only real grades are saved, so after a restart the screen shows exactly what is
  confirmed and everything else is 0 (`src/core/grades.ts`, ADR 0009).
- **General average from day one.** Each course enters rounded half up (10.5 → 11, as the
  university records it) and weighted by its credits (`src/core/average.ts`).
- **Number picker on the UI thread.** Gesture Handler + Reanimated worklets move the numbers;
  JavaScript hears only whole integers, with a haptic tick each time and a fling that eases
  onto a whole number (`src/features/grade-editor/RulerPicker.tsx`, ADR 0005).
- **No backend, no account.** Zustand `persist` over `expo-sqlite/kv-store`; the saved JSON
  is validated with Zod and reconciled with the course templates on start (ADR 0007).

## Numbers

|         |                                                                            |
| ------- | -------------------------------------------------------------------------- |
| Tests   | 53 (core, store, components)                                               |
| APK     | 21 MB, down from 112 MB: arm64 only, R8, compressed native libs (ADR 0010) |
| Courses | 7 JSON templates in `src/data/courses/`, validated at test time            |

## Stack

Expo SDK 57 · React Native 0.86 · Expo Router · TypeScript strict · Zustand · Zod ·
Reanimated 4 · Gesture Handler · react-native-svg · Jest + Testing Library · EAS Build.

## Layout

```
src/
  core/        pure TypeScript: tree, grading, real/simulated, average (no React)
  data/        course templates + Zod schema
  store/       Zustand + persist, the only code that touches storage
  features/    home, course-screen, grade-editor (never import each other)
  compose/     screens that join features
  app/         Expo Router routes
```

Decisions live in [`docs/adr/`](docs/adr/README.md); grading rules in
[`docs/product/grading-rules.md`](docs/product/grading-rules.md).

## Run

```sh
pnpm install
pnpm start        # Expo dev server
pnpm check        # lint, typecheck, tests, unicode check
pnpm build:apk    # Android APK through EAS
```

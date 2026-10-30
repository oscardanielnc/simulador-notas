# Build plan — run end to end on "comienza el proyecto"

Report progress to Oscar in Spanish, one short line per step. Commit after each step (Conventional Commits).

## 0 · Preflight

- `node -v` (24, `.nvmrc`), `pnpm -v`. Missing → install with corepack.
- `git init`, branch `main`.
- `npx eas-cli whoami`. Not logged in → stop and give Oscar ONE command: `npx eas-cli login`.

## 1 · Course templates from Oscar's input

- Read everything in `input/cursos/` (Spanish text files or syllabus photos). Convert each course to `src/data/courses/<id>.json` per `docs/product/course-format.md`.
- Anything ambiguous (weights that don't add up, unclear names) → list it to Oscar in one table and continue with the best reading, marked `// TODO confirm` in a `notes` field.
- Empty folder → use `example-course.json` only and tell Oscar.

## 2 · Scaffold

- Expo SDK 57 + Expo Router + TypeScript strict, pnpm. Match Kawsay's versions (`D:\OSCAR\Documents\Dev\1-portafolio\kawsay\apps\mobile\package.json`).
- Deps: zustand, zod, expo-sqlite, expo-haptics, react-native-gesture-handler, react-native-reanimated, react-native-svg, @expo-google-fonts/plus-jakarta-sans.
- Jest + jest-expo + @testing-library/react-native. ESLint (with `import/no-restricted-paths` for the rule in architecture/overview.md) + Prettier.
- Husky: pre-commit (lint-staged, `scripts/check-unicode.mjs` from the standard), commit-msg (strip AI trailers).
- `app.json`: name "Mis notas" (working name), slug `simulador-notas`, android package `dev.oscarnavarro.simuladornotas`, portrait, white splash.
- `eas.json`: profile `personal` → `distribution: internal`, `android.buildType: apk`. Script `build:apk` = `eas build -p android --profile personal --non-interactive`.

## 3 · Core (TDD)

Write tests first from `docs/product/grading-rules.md`, then code:

- value() with percent, units and missing weights · 14,14,16,3 → 11.75 · final 13.60 for the example with PC 11.75, LAB 7.5, EX 18
- isFailing: 10.49 true, 10.5 false
- setSubtree changes every descendant leaf's sim, never real
- the EX1/EX2 ★ scenario step by step
- onAppStart: real wins, otherwise last sim
- template validation: duplicated ids, percent not summing 100, >14 children, weight ≤ 0 all fail
- every file in src/data/courses passes validation

## 4 · Store

Zustand + persist (F05). Actions: setValue, markReal, unmarkReal, restoreReal. Hydration applies onAppStart + template reconciliation. Tests for each action.

## 5 · UI

Follow `docs/design/` exactly; open `mockup-v4.html` as the visual source of truth.
Order: theme + fonts → RulerPicker → EditorSheet → GradeChip → CriterionCard → FinalGradeCard → course screen → drill-down route → home (general average + course cards).
Component tests by visible text/role: selecting a chip shows its name in the sheet; + changes the number and the parent; ★ appears/disappears per the EX scenario; numbers < 10.5 get the danger style.

## 6 · CI

`.github/workflows/ci.yml`: install → lint → typecheck → test → unicode check.

## 7 · APK

- `pnpm check` green first.
- `pnpm build:apk`. Give Oscar the download link/QR that EAS prints.
- If EAS fails and the Android SDK exists locally: `npx expo prebuild -p android` + `android/gradlew assembleRelease`, and give the APK path.

## 8 · Final report to Oscar (Spanish, short)

| What | Where |, APK link, test count, open TODOs from step 1, then the 5 key concepts in teacher mode (ruler with gestures/reanimated, weighted tree recursion, two-layer state, Zustand persist, EAS build), each saved as a lesson in the vault.

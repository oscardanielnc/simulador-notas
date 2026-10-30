# F05 · Local persistence

- Zustand store with `persist`, storage = `expo-sqlite/kv-store` (AsyncStorage-compatible API, no extra native module).
- Saved shape: `{ grades: { [courseId]: { [leafId]: { sim: number, real: number | null } } }, schemaVersion: 1 }`.
- Only real grades are written (`partialize` keeps leaves with `real !== null`, ADR 0009).
- On hydration: apply the app-start rule (real or 0) and reconcile with template versions (course-format.md).
- Write on every integer change (cheap: a few hundred bytes).

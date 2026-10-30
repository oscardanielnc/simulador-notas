# F05 · Local persistence

- Zustand store with `persist`, storage = `expo-sqlite/kv-store` (AsyncStorage-compatible API, no extra native module).
- Saved shape: `{ grades: { [courseId]: { [leafId]: { sim: number, real: number | null } } }, schemaVersion: 1 }`.
- On hydration: apply the app-start rule (real wins) and reconcile with template versions (course-format.md).
- Write on every integer change (cheap: a few hundred bytes).

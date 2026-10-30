# 0007 · Plain Zustand persist over SQLite + Drizzle

Context: state is a small JSON (<10 KB). Kawsay uses SQLite + Drizzle for relational data.
Decision: Zustand `persist` on `expo-sqlite/kv-store`. No migrations framework; `schemaVersion` field + a migrate function.

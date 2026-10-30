import type { StateStorage } from 'zustand/middleware';

/**
 * The web build only exists to record the app for the portfolio (ADR 0011), so it keeps
 * grades in localStorage instead of loading SQLite's WebAssembly build.
 */
export const storage: StateStorage = {
  getItem: (key) => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
  removeItem: (key) => localStorage.removeItem(key),
};

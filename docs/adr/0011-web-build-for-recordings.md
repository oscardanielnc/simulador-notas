# 0011 · Web build only to record the app

Context: the portfolio shows each project running, never an animated explainer. This app ships only as an Android APK, and no emulator was set up on the build machine.
Decision (2026-10-30): build the same code for the web with react-native-web (`pnpm web`, served on `localhost:4180`) and record it with the portfolio's Playwright pipeline at a phone viewport. The only web-specific code is `src/store/storage.web.ts`, which keeps grades in `localStorage` instead of loading SQLite's WebAssembly build. The recording seeds sample grades, never the real user's.
Consequence: the web build is not a product and is not deployed. If a web feature diverges from Android, the APK wins.

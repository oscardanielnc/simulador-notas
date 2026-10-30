# 0001 · Expo app, APK through EAS, no backend

Context: v1 has one user, all data is hers and stays on her phone. Oscar wants an installable APK.
Options: PWA (no APK) · Expo + EAS build · bare React Native.
Decision: Expo SDK 57 (same as Kawsay), Expo Router, EAS `personal` profile with `buildType: apk`. No backend, no monorepo: nothing to share between packages.
Consequence: adding classmates' sync later means adding an API; `core/` is pure so it can move to a package then.

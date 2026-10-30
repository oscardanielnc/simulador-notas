# 0010 · Small APK: arm64 only, R8, compressed native libraries

Context: the 1.2.0 APK weighed 112 MB. 89 MB were native libraries for 4 CPU types; x86 and x86_64 only run on emulators, and the Java code was not minified.
Decision (2026-10-30): `expo-build-properties` with `buildArchs: ["arm64-v8a"]` (every Android phone since ~2017), `enableMinifyInReleaseBuilds` + `enableShrinkResourcesInReleaseBuilds` (R8), and `useLegacyPackaging` (native libs stored compressed in the APK).
Consequence: much smaller download and install. A 32-bit-only phone can no longer install it; add `armeabi-v7a` back if that ever matters. R8 can strip classes used only by reflection: test the APK after every native dependency change.

#!/usr/bin/env node
// Fails when a file contains bidi controls or invisible characters
// (Trojan Source, CVE-2021-42574, invisible identifiers, and payloads hidden in
// variation selectors or tag characters).
// Emoji glue (ZWJ, VS15/VS16, flag tag sequences) is allowed.
//
//   node scripts/check-unicode.mjs          staged files (pre-commit)
//   node scripts/check-unicode.mjs --all    every tracked file (CI)
//   node scripts/check-unicode.mjs a.ts b   explicit paths
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const BAD = new Map([
  [0x061c, 'ARABIC LETTER MARK'],
  [0x200e, 'LEFT-TO-RIGHT MARK'],
  [0x200f, 'RIGHT-TO-LEFT MARK'],
  [0x202a, 'LRE'],
  [0x202b, 'RLE'],
  [0x202c, 'PDF'],
  [0x202d, 'LRO'],
  [0x202e, 'RLO'],
  [0x2066, 'LRI'],
  [0x2067, 'RLI'],
  [0x2068, 'FSI'],
  [0x2069, 'PDI'],
  [0x200b, 'ZERO WIDTH SPACE'],
  [0x2060, 'WORD JOINER'],
  [0x180e, 'MONGOLIAN VOWEL SEPARATOR'],
  [0x00ad, 'SOFT HYPHEN'],
  [0xfeff, 'BOM / ZERO WIDTH NO-BREAK SPACE'],
  [0x115f, 'HANGUL CHOSEONG FILLER'],
  [0x1160, 'HANGUL JUNGSEONG FILLER'],
  [0x3164, 'HANGUL FILLER'],
  [0xffa0, 'HALFWIDTH HANGUL FILLER'],
]);
const name = (cp) =>
  BAD.get(cp) ??
  (cp >= 0x2061 && cp <= 0x2064
    ? 'INVISIBLE MATH OPERATOR'
    : cp >= 0xfe00 && cp <= 0xfe0d
      ? 'VARIATION SELECTOR'
      : cp >= 0xe0100 && cp <= 0xe01ef
        ? 'VARIATION SELECTOR SUPPLEMENT'
        : cp >= 0xe0000 && cp <= 0xe007f
          ? 'TAG CHARACTER'
          : null);

const git = (args) => {
  const r = spawnSync('git', args, { encoding: 'buffer', maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) throw new Error(`git ${args.join(' ')} failed: ${r.stderr}`);
  return r.stdout;
};
const list = (buf) => buf.toString('utf8').split('\0').filter(Boolean);

const argv = process.argv.slice(2);
const staged = argv.length === 0;
const files =
  argv[0] === '--all'
    ? list(git(['ls-files', '-z']))
    : staged
      ? list(git(['diff', '--cached', '--name-only', '-z', '--diff-filter=ACMR']))
      : argv;

let found = 0;
for (const file of files) {
  let buf;
  try {
    buf = staged ? git(['show', `:${file}`]) : readFileSync(file);
  } catch {
    continue;
  }
  if (buf.subarray(0, 8000).includes(0)) continue; // binary
  const lines = buf.toString('utf8').split('\n');
  lines.forEach((line, i) => {
    let col = 0,
      inFlag = false;
    for (const ch of line) {
      const cp = ch.codePointAt(0);
      col++;
      if (cp === 0x1f3f4) {
        inFlag = true;
        continue;
      } // 🏴 starts a flag tag sequence
      if (inFlag && cp >= 0xe0020 && cp <= 0xe007f) {
        if (cp === 0xe007f) inFlag = false;
        continue;
      }
      inFlag = false;
      if (cp === 0xfeff && i === 0 && col === 1) continue; // BOM at the very start is harmless
      const n = name(cp);
      if (n) {
        found++;
        console.error(
          `${file}:${i + 1}:${col}  U+${cp.toString(16).toUpperCase().padStart(4, '0')} ${n}`,
        );
      }
    }
  });
}
if (found) {
  console.error(
    `\n✖ ${found} invisible or bidi character(s). Remove them, or write them as escapes (\\u200B) if they are really needed.`,
  );
  process.exit(1);
}

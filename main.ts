// One Emoji, One Smile — entry program.
// Reads the single chosen emoji from one-emoji.txt, checks it really is
// exactly one emoji, and drops it into /output/entry.txt for the judge.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const raw = readFileSync(new URL("./one-emoji.txt", import.meta.url), "utf8");

function fail(reason: string): never {
  console.error(`INVALID: ${reason}`);
  process.exit(1);
}

// Every rule the sealed gate enforces, checked here first: one piece of
// text, 1 to 8 characters, not only whitespace, and pictographic.
function validateEmoji(candidate: string): string {
  if (candidate.length === 0) fail("entry is empty");
  if (candidate.length > 8) fail(`entry is ${candidate.length} characters, gate allows at most 8`);
  if (/^\s+$/.test(candidate)) fail("entry is only whitespace");
  if (/\s/.test(candidate)) fail("entry contains whitespace");
  if ([...candidate].length !== 1) fail("entry is not a single character");
  if (!/\p{Extended_Pictographic}/u.test(candidate)) fail("entry is not an emoji");
  return candidate;
}

const emoji = validateEmoji(raw.endsWith("\n") ? raw.slice(0, -1) : raw);

const dest = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const bytes = Buffer.byteLength(emoji, "utf8");
mkdirSync(dest, { recursive: true });
const target = join(dest, "entry.txt");
writeFileSync(target, emoji, "utf8");
console.log(emoji);
console.log(`OK: one emoji, ${bytes} bytes, written to ${target}.`);

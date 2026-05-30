import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, "..", "public", "icons");
const svg = readFileSync(join(iconsDir, "icon.svg"));

let sharp: typeof import("sharp");
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error("Install sharp first: pnpm add -D sharp");
  process.exit(1);
}

const sizes = [16, 48, 128];

for (const size of sizes) {
  const png = await sharp(svg).resize(size, size).png().toBuffer();
  writeFileSync(join(iconsDir, `icon${size}.png`), png);
  console.log(`Generated icon${size}.png`);
}

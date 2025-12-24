// api/scripts/copy-activate.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const items = [
  {
    src: path.join(__dirname, "license", "fingerprint.mjs"),
    dest: path.join(
      __dirname,
      "..",
      "dist",
      "scripts",
      "license",
      "fingerprint.mjs"
    ),
  },
];

for (const item of items) {
  if (!fs.existsSync(item.src)) {
    console.warn(`[copy] missing ${item.src}, skipping`);
    continue;
  }
  const destDir = path.dirname(item.dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(item.src, item.dest);
  console.log(`[copy] ${path.basename(item.dest)} copied to dist`);
}

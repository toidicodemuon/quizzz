// api/scripts/copy-public-key.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcPath = path.join(__dirname, "..", "lc", "public.pem");
const destDir = path.join(__dirname, "..", "dist", "lc");
const destPath = path.join(destDir, "public.pem");

if (!fs.existsSync(srcPath)) {
  console.warn("[copy] public.pem missing, skipping");
  process.exit(0);
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(srcPath, destPath);
console.log("[copy] public.pem copied to dist/lc");

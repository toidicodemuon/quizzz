// api/scripts/copy-start-bat.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcPath = path.join(__dirname, "start.bat");
const destPath = path.join(__dirname, "..", "dist", "start.bat");

const destDir = path.dirname(destPath);
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

if (fs.existsSync(srcPath)) {
  fs.copyFileSync(srcPath, destPath);
  console.log("[copy] start.bat copied to dist");
} else {
  console.warn("[copy] start.bat missing, skipping");
}

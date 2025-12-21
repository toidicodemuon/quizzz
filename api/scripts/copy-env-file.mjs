// api/scripts/copy-env-file.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcPath = path.join(__dirname, "..", ".env");
const destPath = path.join(__dirname, "..", "dist", ".env");

const distDir = path.dirname(destPath);
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

if (fs.existsSync(srcPath)) {
  fs.copyFileSync(srcPath, destPath);
  console.log(".env file copied to dist folder");
} else {
  console.warn(
    "Warning: .env file not found at root of /api. Skipping copy. Your application may fail if it requires this file."
  );
}

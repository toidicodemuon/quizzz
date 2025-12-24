// api/scripts/copy-package-json.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// read package.json
const packageJsonPath = path.join(__dirname, "..", "package.json");
const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");
const packageJson = JSON.parse(packageJsonContent);

// Keep only production dependencies
const prodPackageJson = {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  main: "src/index.js", // entry point in dist
  author: packageJson.author,
  license: packageJson.license,
  dependencies: packageJson.dependencies,
  prisma: {
    seed: "node prisma/seed.js",
  },
  scripts: {
    start: "cross-env NODE_ENV=production node src/index.js",
    "license:create": "node scripts/license/activate.mjs",
    postinstall: "npx prisma generate && license:create",
  },
};

// The path to the dist folder
const destPath = path.join(__dirname, "..", "dist", "package.json");

const distDir = path.dirname(destPath);
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Write the new package.json to the dist folder
fs.writeFileSync(destPath, JSON.stringify(prodPackageJson, null, 2));

console.log("Cleaned package.json for production copied to dist/package.json");

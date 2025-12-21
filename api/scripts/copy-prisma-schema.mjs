// api/scripts/copy-prisma-schema.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcPath = path.join(__dirname, "..", "prisma", "schema.prisma");
const destPath = path.join(__dirname, "..", "dist", "prisma", "schema.prisma");

const destDir = path.dirname(destPath);
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(srcPath, destPath);

console.log("prisma/schema.prisma copied to dist/prisma/schema.prisma");

const subjectsSrcDir = path.join(__dirname, "..", "prisma", "seeders", "subjects");
const subjectsDestDir = path.join(
  __dirname,
  "..",
  "dist",
  "prisma",
  "seeders",
  "subjects"
);

if (fs.existsSync(subjectsSrcDir)) {
  fs.mkdirSync(subjectsDestDir, { recursive: true });
  const jsonFiles = fs
    .readdirSync(subjectsSrcDir)
    .filter((file) => file.endsWith(".json"));
  jsonFiles.forEach((file) => {
    fs.copyFileSync(
      path.join(subjectsSrcDir, file),
      path.join(subjectsDestDir, file)
    );
  });
  if (jsonFiles.length > 0) {
    console.log("prisma/seeders/subjects/*.json copied to dist/prisma/seeders/subjects");
  }
}

const { series, parallel } = require("gulp");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs/promises");

const cwd = __dirname;
const distDir = path.join(cwd, "dist");
const scriptsDir = path.join(cwd, "scripts");
const publicDir = path.join(cwd, "public");

function run(command, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
      shell: true,
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed: ${command} ${args.join(" ")}`));
      }
    });
  });
}

function runScript(scriptName) {
  const scriptPath = path.join(scriptsDir, scriptName);
  return run("node", [scriptPath]);
}

const clean = async () => {
  await fs.rm(distDir, { recursive: true, force: true });
};

const routes = () => run("npx", ["tsoa", "spec-and-routes"]);
const compile = () => run("npx", ["tsc", "-p", "tsconfig.json"]);

const copyEnv = () => runScript("copy-env-file.mjs");
const copyPackageJson = () => runScript("copy-package-json.mjs");
const copyPrismaSchema = () => runScript("copy-prisma-schema.mjs");
const copyPublic = async () => {
  try {
    await fs.stat(publicDir);
  } catch (err) {
    if (err && err.code === "ENOENT") {
      console.warn("[copy] public folder missing, skipping");
      return;
    }
    throw err;
  }
  const dest = path.join(distDir, "public");
  await fs.mkdir(dest, { recursive: true });
  await fs.cp(publicDir, dest, { recursive: true });
  console.log("[copy] public folder copied to dist/public");
};

const minifyJs = () => runScript("minify.mjs");
const obfuscateJs = () => runScript("obfuscate.mjs");

const copy = parallel(copyEnv, copyPackageJson, copyPrismaSchema, copyPublic);
const optimize = series(minifyJs, obfuscateJs);

const build = series(clean, routes, compile, copy, optimize);

exports.clean = clean;
exports.routes = routes;
exports.compile = compile;
exports.copy = copy;
exports.optimize = optimize;
exports.build = build;
exports.default = build;

import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import { minify } from "terser";

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

async function minifyFile(file) {
  try {
    const code = await readFile(file, "utf8");
    const result = await minify(code, {
      compress: true,
      mangle: { toplevel: false },
      format: { comments: false },
    });
    if (result.code) {
      await writeFile(file, result.code, "utf8");
      return true;
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : e;
    console.error("Minify failed for", file, message);
  }
  return false;
}

async function run() {
  const dist = join(process.cwd(), "dist");
  try {
    const s = await stat(dist);
    if (!s.isDirectory()) return;
  } catch {
    return;
  }
  let count = 0;
  for await (const file of walk(dist)) {
    if (extname(file) === ".js") {
      const ok = await minifyFile(file);
      if (ok) count++;
    }
  }
  console.log(`[minify] Minified ${count} JS files in dist`);
}

run();

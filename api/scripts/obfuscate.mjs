import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import JavaScriptObfuscator from 'javascript-obfuscator';

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

const options = {
  compact: true,
  target: 'node',
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: false,
  stringArray: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayThreshold: 0.75,
  stringArrayEncoding: ['base64'],
  simplify: true,
  numbersToExpressions: true,
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false,
  renameProperties: false,
  selfDefending: false,
  transformObjectKeys: false,
  unicodeEscapeSequence: false,
  sourceMap: false,
};

async function obfuscateFile(file) {
  try {
    const code = await readFile(file, 'utf8');
    const result = JavaScriptObfuscator.obfuscate(code, options);
    const out = result.getObfuscatedCode();
    if (out && out.length) {
      await writeFile(file, out, 'utf8');
      return true;
    }
  } catch (e) {
    console.error('Obfuscate failed for', file, e?.message || e);
  }
  return false;
}

async function run() {
  const dist = join(process.cwd(), 'dist');
  try {
    const s = await stat(dist);
    if (!s.isDirectory()) return;
  } catch {
    return;
  }
  let count = 0;
  for await (const file of walk(dist)) {
    if (extname(file) === '.js') {
      const ok = await obfuscateFile(file);
      if (ok) count++;
    }
  }
  console.log(`[obfuscate] Obfuscated ${count} JS files in dist`);
}

run();


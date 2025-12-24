import fs from "fs";
import path from "path";
import readline from "readline";
import dotenv from "dotenv";
import { pathToFileURL } from "url";

dotenv.config();

const args = process.argv.slice(2);

function getArg(flag, fallback) {
  const index = args.indexOf(flag);
  if (index >= 0 && args[index + 1]) return args[index + 1];
  return fallback;
}

function resolvePath(rawPath) {
  return path.isAbsolute(rawPath)
    ? rawPath
    : path.resolve(process.cwd(), rawPath);
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function parseKeys(raw) {
  if (!raw) return [];
  return String(raw)
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean);
}

function normalizeApiBase(raw) {
  if (!raw) return "";
  let value = String(raw).trim();
  if (!value.includes("://")) {
    value = `http://${value}`;
  }
  const parsed = new URL(value);
  let pathname = parsed.pathname.replace(/\/+$/, "");
  const suffix = "/license/create";
  if (pathname.toLowerCase().endsWith(suffix)) {
    pathname = pathname.slice(0, -suffix.length);
  }
  parsed.pathname = pathname || "";
  parsed.search = "";
  parsed.hash = "";
  return parsed.toString().replace(/\/$/, "");
}

function joinUrl(base, pathname) {
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const normalizedPath = pathname.startsWith("/")
    ? pathname.slice(1)
    : pathname;
  return new URL(normalizedPath, normalizedBase).toString();
}

async function downloadFingerprintModule(apiBase, token) {
  const url = joinUrl(apiBase, "/license/fingerprint");
  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Fingerprint download failed: ${response.status} ${text}`);
  }
  const source = await response.text();
  const targetDir = path.resolve(process.cwd(), "scripts", "license");
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const tempPath = path.join(targetDir, "fingerprint.mjs");
  fs.writeFileSync(tempPath, source, "utf8");
  return { tempDir: targetDir, tempPath };
}

async function loadFingerprintModule(tempPath) {
  const moduleUrl = `${pathToFileURL(tempPath).href}?v=${Date.now()}`;
  const mod = await import(moduleUrl);
  if (!mod || typeof mod.getFingerprint !== "function") {
    throw new Error("Fingerprint module missing getFingerprint export.");
  }
  return mod;
}

function promptText(question, masked = false) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    if (masked) {
      rl.stdoutMuted = false;
      rl._writeToOutput = function _writeToOutput(stringToWrite) {
        if (rl.stdoutMuted) {
          const masked = String(stringToWrite).replace(/[^\r\n]/g, "*");
          rl.output.write(masked);
        } else {
          rl.output.write(stringToWrite);
        }
      };
    }

    rl.question(question, (answer) => {
      rl.close();
      resolve(String(answer || "").trim());
    });

    if (masked) {
      rl.stdoutMuted = true;
    }
  });
}

async function requestJson(url, options) {
  if (typeof fetch !== "function") {
    throw new Error("Global fetch is not available in this Node runtime.");
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status} ${text}`);
  }
  return response.json();
}

const apiBase = normalizeApiBase(
  getArg("--url", process.env.LICENSE_URL || "")
);
if (!apiBase) {
  console.error("LICENSE_URL is required (e.g. http://host:3000/api).");
  process.exit(1);
}

const identifier = await promptText("Admin username/email: ");
const password = await promptText("Admin password: ", true);
if (!identifier || !password) {
  console.error("Admin username and password are required.");
  process.exit(1);
}

const loginUrl = joinUrl(apiBase, "/auth/login");
let accessToken;
try {
  const loginResult = await requestJson(loginUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });
  accessToken = loginResult?.accessToken;
} catch (err) {
  console.error(`Login failed: ${String(err)}`);
  process.exit(1);
}

if (!accessToken) {
  console.error("Login response missing accessToken.");
  process.exit(1);
}

let fingerprintTempDir = "";
let fingerprintTempPath = "";
let cleanupFingerprint = false;
let fingerprintModule;
try {
  const downloaded = await downloadFingerprintModule(apiBase, accessToken);
  fingerprintTempDir = downloaded.tempDir;
  fingerprintTempPath = downloaded.tempPath;
  fingerprintModule = await loadFingerprintModule(fingerprintTempPath);
} catch (err) {
  console.error(`Failed to load fingerprint module: ${String(err)}`);
  process.exit(1);
}

const { getFingerprint, DEFAULT_FINGERPRINT_KEYS } = fingerprintModule;

const keyList = parseKeys(
  getArg("--keys", process.env.LICENSE_FINGERPRINT_KEYS || "")
);
let fingerprintResult;
try {
  fingerprintResult = getFingerprint(
    keyList.length ? keyList : DEFAULT_FINGERPRINT_KEYS
  );
} catch (err) {
  console.error(`Failed to build fingerprint: ${String(err)}`);
  process.exit(1);
}

const product = getArg("--product", process.env.LICENSE_PRODUCT || "quizzz");
const expiresAt = getArg("--expires-at", process.env.LICENSE_EXPIRES_AT || "");
const payload = {
  product,
  hwid: fingerprintResult.fingerprint,
  fingerprintParts: fingerprintResult.parts,
  ...(expiresAt ? { expiresAt } : {}),
};

const createUrl = joinUrl(apiBase, "/license/create");
let license;
try {
  license = await requestJson(createUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
} catch (err) {
  console.error(`License create failed: ${String(err)}`);
  process.exit(1);
}

const outPath = resolvePath(
  getArg("--out", process.env.LICENSE_OUT || "license/license.json")
);
ensureDir(outPath);
fs.writeFileSync(outPath, JSON.stringify(license, null, 2), "utf8");
console.log(`License written to ${outPath}`);
cleanupFingerprint = true;

if (cleanupFingerprint && fingerprintTempPath) {
  try {
    fs.unlinkSync(fingerprintTempPath);
  } catch {}
}

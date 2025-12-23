import crypto from "crypto";
import fs from "fs";
import path from "path";
import { DEFAULT_FINGERPRINT_KEYS, getFingerprint } from "./fingerprint.mjs";
const args = process.argv.slice(2);

function getArg(flag, fallback) {
  const index = args.indexOf(flag);
  if (index >= 0 && args[index + 1]) return args[index + 1];
  return fallback;
}

function hasFlag(flag) {
  return args.includes(flag);
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

function normalizeServerUrl(raw) {
  if (!raw) return "";
  let value = String(raw).trim();
  if (!value.includes("://")) {
    value = `http://${value}`;
  }
  const parsed = new URL(value);
  if (!parsed.pathname || parsed.pathname === "/") {
    parsed.pathname = "/activate";
  }
  return parsed.toString();
}

function buildPayload({
  product,
  fingerprint,
  fingerprintKeys,
  machineId,
  issuedAt,
  expiresAt,
}) {
  const expiresValue = expiresAt ? String(expiresAt) : "";
  return [
    `product=${product}`,
    `fingerprint=${fingerprint || ""}`,
    `fingerprintKeys=${(fingerprintKeys || []).join(",")}`,
    `machineId=${machineId || ""}`,
    `issuedAt=${issuedAt}`,
    `expiresAt=${expiresValue}`,
  ].join("\n");
}

async function requestOnlineLicense({
  serverUrl,
  token,
  payload,
}) {
  if (typeof fetch !== "function") {
    throw new Error("Global fetch is not available in this Node runtime.");
  }
  const response = await fetch(serverUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { "x-activation-token": token } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Activation failed: ${response.status} ${text}`);
  }
  return response.json();
}

const product = getArg("--product", process.env.LICENSE_PRODUCT || "quizzz");
const expiresAt = getArg("--expires-at", "");
const licenseOut = resolvePath(getArg("--license-out", "license/license.json"));
const requestOut = resolvePath(
  getArg("--request-out", "license/license-request.json")
);
const privateKeyPath = resolvePath(
  getArg(
    "--private-key",
    process.env.LICENSE_PRIVATE_KEY_PATH || "license/private.pem"
  )
);
const requestOnly = hasFlag("--request-only");
const serverUrl = normalizeServerUrl(
  getArg("--server", process.env.LICENSE_ACTIVATION_URL || "")
);
const token = getArg(
  "--token",
  process.env.LICENSE_ACTIVATION_TOKEN || ""
);
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

const issuedAt = new Date().toISOString();
const requestPayload = {
  product,
  fingerprint: fingerprintResult.fingerprint,
  fingerprintKeys: fingerprintResult.keys,
  machineId: fingerprintResult.parts.machineId || undefined,
  requestedAt: issuedAt,
  ...(expiresAt ? { expiresAt } : {}),
};

if (!requestOnly && serverUrl) {
  try {
    const license = await requestOnlineLicense({
      serverUrl,
      token,
      payload: requestPayload,
    });
    ensureDir(licenseOut);
    fs.writeFileSync(licenseOut, JSON.stringify(license, null, 2), "utf8");
    console.log(`License written to ${licenseOut}`);
    process.exit(0);
  } catch (err) {
    console.error(`[activate] ${String(err)}`);
  }
}

if (!requestOnly && fs.existsSync(privateKeyPath)) {
  const payload = buildPayload({
    product,
    fingerprint: requestPayload.fingerprint,
    fingerprintKeys: requestPayload.fingerprintKeys,
    machineId: requestPayload.machineId,
    issuedAt,
    expiresAt,
  });
  const privateKey = fs.readFileSync(privateKeyPath, "utf8");
  const signature = crypto
    .sign("sha256", Buffer.from(payload, "utf8"), privateKey)
    .toString("base64");
  const license = {
    product,
    fingerprint: requestPayload.fingerprint,
    fingerprintKeys: requestPayload.fingerprintKeys,
    machineId: requestPayload.machineId,
    issuedAt,
    ...(expiresAt ? { expiresAt } : {}),
    signature,
  };
  ensureDir(licenseOut);
  fs.writeFileSync(licenseOut, JSON.stringify(license, null, 2), "utf8");
  console.log(`License written to ${licenseOut}`);
  process.exit(0);
}

ensureDir(requestOut);
fs.writeFileSync(requestOut, JSON.stringify(requestPayload, null, 2), "utf8");
console.log(`License request written to ${requestOut}`);
if (!requestOnly) {
  console.log(`Private key not found at ${privateKeyPath}.`);
}
console.log("Send license-request.json to admin to receive license.json.");

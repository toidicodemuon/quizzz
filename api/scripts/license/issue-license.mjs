import crypto from "crypto";
import fs from "fs";
import path from "path";
import machineIdPackage from "node-machine-id";
import { DEFAULT_FINGERPRINT_KEYS } from "./fingerprint.mjs";

const { machineIdSync } = machineIdPackage;

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

function parseKeys(raw) {
  if (!raw) return [];
  return String(raw)
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean);
}

function buildLegacyPayload({ product, machineId, issuedAt, expiresAt }) {
  const expiresValue = expiresAt ? String(expiresAt) : "";
  return [
    `product=${product}`,
    `machineId=${machineId || ""}`,
    `issuedAt=${issuedAt}`,
    `expiresAt=${expiresValue}`,
  ].join("\n");
}

function buildPayloadV2({
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

const requestPath = getArg("--request", "");
let request = null;
if (requestPath) {
  const resolved = resolvePath(requestPath);
  if (!fs.existsSync(resolved)) {
    console.error(`Request file not found: ${resolved}`);
    process.exit(1);
  }
  try {
    request = JSON.parse(fs.readFileSync(resolved, "utf8"));
  } catch (err) {
    console.error(`Failed to read request: ${String(err)}`);
    process.exit(1);
  }
}

const fingerprint = getArg("--fingerprint", null) || request?.fingerprint || "";
const fingerprintKeys = parseKeys(
  getArg(
    "--keys",
    request?.fingerprintKeys
      ? request.fingerprintKeys.join(",")
      : process.env.LICENSE_FINGERPRINT_KEYS || ""
  )
);
const product = getArg("--product", request?.product || "quizzz");
const expiresAt = getArg("--expires-at", "");
const privateKeyPath = resolvePath(
  getArg("--private-key", process.env.LICENSE_PRIVATE_KEY_PATH || "license/private.pem")
);
const outPath = resolvePath(getArg("--out", "license/license.json"));

if (requestPath && !request?.machineId && !request?.fingerprint) {
  console.error("Request file missing fingerprint or machineId");
  process.exit(1);
}

if (!fs.existsSync(privateKeyPath)) {
  console.error(`Private key not found: ${privateKeyPath}`);
  process.exit(1);
}

const machineId =
  getArg("--machine-id", null) ||
  request?.machineId ||
  (fingerprint ? "" : machineIdSync());
const issuedAt = new Date().toISOString();

const useFingerprint = Boolean(fingerprint);
const keysToUse = useFingerprint
  ? Array.from(
      new Set(
        (fingerprintKeys.length ? fingerprintKeys : DEFAULT_FINGERPRINT_KEYS).map(
          (key) => String(key).trim()
        )
      )
    )
      .filter(Boolean)
      .sort()
  : [];
const payload = useFingerprint
  ? buildPayloadV2({
      product,
      fingerprint,
      fingerprintKeys: keysToUse,
      machineId,
      issuedAt,
      expiresAt,
    })
  : buildLegacyPayload({ product, machineId, issuedAt, expiresAt });
const privateKey = fs.readFileSync(privateKeyPath, "utf8");
const signature = crypto
  .sign("sha256", Buffer.from(payload, "utf8"), privateKey)
  .toString("base64");

const license = {
  product,
  ...(useFingerprint
    ? {
        fingerprint,
        fingerprintKeys: keysToUse,
      }
    : {}),
  ...(machineId ? { machineId } : {}),
  issuedAt,
  ...(expiresAt ? { expiresAt } : {}),
  signature,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(license, null, 2), "utf8");

console.log(`License written to ${outPath}`);

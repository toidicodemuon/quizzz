import crypto from "crypto";
import fs from "fs";
import path from "path";
import * as nodeMachineId from "node-machine-id";
import { DEFAULT_FINGERPRINT_KEYS, getFingerprint } from "./fingerprint";

export type LicenseResponse = {
  product: string;
  licenseId: string;
  hwid: string;
  trial?: boolean;
  expiresAt?: string;
  signature: string;
};

type LicensePayload = {
  product: string;
  licenseId: string;
  hwid: string;
  expiresAt?: string | null;
};

type LicenseFile = {
  product: string;
  signature: string;
  licenseId?: string;
  hwid?: string;
  trial?: boolean;
  expiresAt?: string | null;
  fingerprint?: string;
  fingerprintKeys?: string[];
  machineId?: string;
  issuedAt?: string;
};

type LegacyPayload = {
  product: string;
  fingerprint?: string;
  fingerprintKeys?: string[];
  machineId?: string;
  issuedAt: string;
  expiresAt?: string | null;
};

type LicenseLogEntry = {
  issuedAt: string;
  product: string;
  licenseId: string;
  hwid: string;
  trial?: boolean;
  fingerprintParts?: Record<string, string>;
  expiresAt?: string;
};

type IssueLicenseOptions = {
  product: string;
  hwid: string;
  expiresAt?: string;
  trial?: boolean;
  fingerprintParts?: Record<string, string>;
};

type LicenseStatus = {
  ok: boolean;
  reason?: string;
  details?: string;
};

const DEFAULT_PRODUCT = "quizzz";

// Build sensitive filenames from hex to avoid static strings in bundled output.
function fromHex(parts: string[]): string {
  return parts
    .map((part) => String.fromCharCode(parseInt(part, 16)))
    .join("");
}

const LC_DIR = fromHex(["6c", "63"]);
const LC_JSON = fromHex(["6c", "63", "2e", "6a", "73", "6f", "6e"]);
const LC_LOG = fromHex(["6c", "63", "73", "2e", "63", "73", "76"]);
const DOT_LC_DIR = `.${LC_DIR}`;

const DEFAULT_LICENSE_CANDIDATES = [
  path.join(LC_DIR, LC_JSON),
  path.join(DOT_LC_DIR, LC_JSON),
  LC_JSON,
];
const DEFAULT_PUBLIC_KEY_CANDIDATES = [
  path.join(LC_DIR, "public.pem"),
  path.join(DOT_LC_DIR, "public.pem"),
  "public.pem",
];

function resolvePath(rawPath: string): string {
  return path.isAbsolute(rawPath)
    ? rawPath
    : path.resolve(process.cwd(), rawPath);
}

function ensureDir(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function parseBoolean(input?: string): boolean | null {
  if (input === undefined) return null;
  const normalized = input.trim().toLowerCase();
  if (["1", "true", "yes", "y", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "n", "off"].includes(normalized)) return false;
  return null;
}

function normalizeKeys(raw?: string[] | string | null): string[] {
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : String(raw).split(",");
  return Array.from(
    new Set(list.map((key) => String(key).trim()).filter(Boolean))
  ).sort();
}

function shouldEnforceLicense(): boolean {
  const explicit = parseBoolean(process.env.LICENSE_ENFORCE);
  if (explicit !== null) return explicit;
  return (process.env.NODE_ENV || "").toLowerCase() === "production";
}

function findExistingPath(candidates: string[]): string | null {
  for (const candidate of candidates) {
    const resolved = resolvePath(candidate);
    if (fs.existsSync(resolved)) return resolved;
  }
  return null;
}

function resolveFromEnvOrCandidates(
  envValue: string | undefined,
  candidates: string[]
): string | null {
  if (envValue) return resolvePath(envValue);
  return findExistingPath(candidates);
}

function normalizePem(pem: string): string {
  return pem.replace(/\\n/g, "\n").trim();
}

function loadPrivateKey(): string {
  const inlineKey = process.env.LICENSE_PRIVATE_KEY;
  if (inlineKey) return normalizePem(inlineKey);

  const envPath =
    process.env.LICENSE_PRIVATE_KEY_PATH || path.join(LC_DIR, "private.pem");
  const privateKeyPath = resolvePath(envPath);
  if (!fs.existsSync(privateKeyPath)) {
    const err: any = new Error(`Private key not found at ${privateKeyPath}`);
    err.status = 500;
    throw err;
  }
  return fs.readFileSync(privateKeyPath, "utf8").trim();
}

function buildLegacyPayload(payload: LegacyPayload): string {
  const expiresAt = payload.expiresAt ? String(payload.expiresAt) : "";
  return [
    `product=${payload.product}`,
    `machineId=${payload.machineId || ""}`,
    `issuedAt=${payload.issuedAt}`,
    `expiresAt=${expiresAt}`,
  ].join("\n");
}

function buildPayloadV2(payload: LegacyPayload, keys: string[]): string {
  const expiresAt = payload.expiresAt ? String(payload.expiresAt) : "";
  const fingerprintKeys = keys.join(",");
  return [
    `product=${payload.product}`,
    `fingerprint=${payload.fingerprint || ""}`,
    `fingerprintKeys=${fingerprintKeys}`,
    `machineId=${payload.machineId || ""}`,
    `issuedAt=${payload.issuedAt}`,
    `expiresAt=${expiresAt}`,
  ].join("\n");
}

function buildHwidPayload(payload: LicensePayload): string {
  const expiresAt = payload.expiresAt ? String(payload.expiresAt) : "";
  return [
    `product=${payload.product}`,
    `licenseId=${payload.licenseId}`,
    `hwid=${payload.hwid}`,
    `expiresAt=${expiresAt}`,
  ].join("\n");
}

function loadPublicKey(): { key?: string; error?: string } {
  const inlineKey = process.env.LICENSE_PUBLIC_KEY;
  if (inlineKey) {
    return { key: normalizePem(inlineKey) };
  }

  const envPath = process.env.LICENSE_PUBLIC_KEY_PATH;
  const keyPath = resolveFromEnvOrCandidates(
    envPath,
    DEFAULT_PUBLIC_KEY_CANDIDATES
  );
  if (!keyPath) {
    return {
      error:
        "Public key not found. Set LICENSE_PUBLIC_KEY or provide public.pem",
    };
  }
  try {
    return { key: fs.readFileSync(keyPath, "utf8").trim() };
  } catch (err) {
    return { error: `Failed to read public key: ${String(err)}` };
  }
}

function loadLicenseFile(): {
  license?: LicenseFile;
  path?: string;
  error?: string;
} {
  const envPath = process.env.LICENSE_PATH || process.env.LICENSE_FILE;
  const licensePath = resolveFromEnvOrCandidates(
    envPath,
    DEFAULT_LICENSE_CANDIDATES
  );
  if (!licensePath) {
    return {
      error:
        `License file not found. Set LICENSE_PATH or provide ${DEFAULT_LICENSE_CANDIDATES[0]}`,
    };
  }
  try {
    const raw = fs.readFileSync(licensePath, "utf8").trim();
    const license = JSON.parse(raw) as LicenseFile;
    return { license, path: licensePath };
  } catch (err) {
    return { error: `Failed to read license: ${String(err)}` };
  }
}

function validateLicenseShape(license: LicenseFile): string | null {
  if (!license || typeof license !== "object")
    return "License is not an object";
  if (!license.signature) return "License signature missing";
  if (!license.product) return "License product missing";
  if (license.licenseId || license.hwid) {
    if (!license.licenseId) return "License licenseId missing";
    if (!license.hwid) return "License hwid missing";
    return null;
  }
  if (!license.fingerprint && !license.machineId) {
    return "License fingerprint or machineId missing";
  }
  if (!license.issuedAt) return "License issuedAt missing";
  return null;
}

function isHwidLicense(
  license: LicenseFile
): license is LicenseFile & { licenseId: string; hwid: string } {
  return Boolean(license.licenseId && license.hwid);
}

export function parseTrialDays(raw?: unknown): number | null {
  if (raw === undefined || raw === null || raw === "") return null;
  const value = Number(raw);
  if (!Number.isFinite(value)) return null;
  const days = Math.floor(value);
  if (days <= 0) return null;
  return Math.min(days, 3650);
}

export function issueLicense(options: IssueLicenseOptions): LicenseResponse {
  const { product, hwid, expiresAt, trial, fingerprintParts } = options;
  const issuedAt = new Date().toISOString();
  const licenseId =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : crypto.randomBytes(16).toString("hex");

  const payload: LicensePayload = {
    product,
    licenseId,
    hwid,
    ...(expiresAt ? { expiresAt } : {}),
  };

  const privateKey = loadPrivateKey();
  const signature = crypto
    .sign("sha256", Buffer.from(buildHwidPayload(payload), "utf8"), privateKey)
    .toString("base64");

  const license: LicenseResponse = {
    product,
    licenseId,
    hwid,
    ...(trial ? { trial: true } : {}),
    ...(expiresAt ? { expiresAt } : {}),
    signature,
  };

  try {
    appendLicenseLog({
      issuedAt,
      product,
      licenseId,
      hwid,
      trial,
      fingerprintParts,
      expiresAt: expiresAt || undefined,
    });
  } catch (err) {
    console.warn(`[license] failed to log CSV: ${String(err)}`);
  }

  return license;
}

function resolveFingerprintModulePath(): string {
  const candidates = [
    process.env.LICENSE_FINGERPRINT_MODULE_PATH,
    path.join("scripts", LC_DIR, "fingerprint.mjs"),
    path.join("dist", "scripts", LC_DIR, "fingerprint.mjs"),
  ].filter(Boolean) as string[];
  for (const candidate of candidates) {
    const resolved = resolvePath(candidate);
    if (fs.existsSync(resolved)) return resolved;
  }
  const err: any = new Error(
    "Fingerprint module not found. Set LICENSE_FINGERPRINT_MODULE_PATH."
  );
  err.status = 500;
  throw err;
}

export function loadFingerprintModuleSource(): string {
  const inline = process.env.LICENSE_FINGERPRINT_MODULE_INLINE;
  if (inline) return inline;
  const modulePath = resolveFingerprintModulePath();
  return fs.readFileSync(modulePath, "utf8");
}

function ensureCsvHeader(filePath: string, headerLine: string): void {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, `${headerLine}\n`, "utf8");
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  if (!lines.length || lines[0] === headerLine) return;

  const startIndex = lines[0].startsWith("issuedAt,") ? 1 : 0;
  const rest = lines.slice(startIndex).join("\n");
  const normalized = rest ? `${headerLine}\n${rest}` : `${headerLine}\n`;
  fs.writeFileSync(filePath, normalized.replace(/\n+$/g, "\n"), "utf8");
}

function getPart(
  parts: Record<string, string> | undefined,
  key: string
): string {
  return parts?.[key] ? String(parts[key]) : "";
}

function escapeCsvValue(value: string): string {
  if (!value) return "";
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function appendLicenseLog(entry: LicenseLogEntry): void {
  const logPath = resolvePath(
    process.env.LICENSE_LOG_PATH || path.join(LC_DIR, LC_LOG)
  );
  ensureDir(logPath);
  const header = [
    "issuedAt",
    "product",
    "licenseId",
    "hwid",
    "trial",
    "machineId",
    "baseboardSerial",
    "biosUuid",
    "cpuId",
    "diskSerials",
    "expiresAt",
  ].join(",");
  ensureCsvHeader(logPath, header);

  const machineId = getPart(entry.fingerprintParts, "machineId");
  const row = [
    entry.issuedAt,
    entry.product,
    entry.licenseId,
    entry.hwid,
    entry.trial ? "true" : "false",
    machineId,
    getPart(entry.fingerprintParts, "baseboardSerial"),
    getPart(entry.fingerprintParts, "biosUuid"),
    getPart(entry.fingerprintParts, "cpuId"),
    getPart(entry.fingerprintParts, "diskSerials"),
    entry.expiresAt || "",
  ]
    .map((value) => escapeCsvValue(String(value ?? "")))
    .join(",");
  fs.appendFileSync(logPath, `${row}\n`, "utf8");
}

export function checkLicense(): LicenseStatus {
  if (!shouldEnforceLicense()) return { ok: true };

  const { license, error: licenseError } = loadLicenseFile();
  if (!license || licenseError) {
    return { ok: false, reason: "license_file_missing", details: licenseError };
  }

  const shapeError = validateLicenseShape(license);
  if (shapeError) {
    return { ok: false, reason: "license_format_invalid", details: shapeError };
  }

  const { key: publicKey, error: keyError } = loadPublicKey();
  if (!publicKey || keyError) {
    return { ok: false, reason: "public_key_missing", details: keyError };
  }

  const expectedProduct = process.env.LICENSE_PRODUCT || DEFAULT_PRODUCT;
  if (license.product !== expectedProduct) {
    return {
      ok: false,
      reason: "license_product_mismatch",
      details: `Expected ${expectedProduct}, got ${license.product}`,
    };
  }

  const fingerprintKeysEnv = normalizeKeys(
    process.env.LICENSE_FINGERPRINT_KEYS || ""
  );
  const keysToUse = fingerprintKeysEnv.length
    ? fingerprintKeysEnv
    : DEFAULT_FINGERPRINT_KEYS;

  if (isHwidLicense(license)) {
    let localFingerprint;
    try {
      localFingerprint = getFingerprint(keysToUse);
    } catch (err) {
      return {
        ok: false,
        reason: "fingerprint_unavailable",
        details: String(err),
      };
    }
    if (license.hwid !== localFingerprint.fingerprint) {
      return {
        ok: false,
        reason: "hwid_mismatch",
      };
    }
  } else if (license.fingerprint) {
    const expectedKeys = normalizeKeys(license.fingerprintKeys);
    const legacyKeys = expectedKeys.length
      ? expectedKeys
      : fingerprintKeysEnv.length
      ? fingerprintKeysEnv
      : DEFAULT_FINGERPRINT_KEYS;
    let localFingerprint;
    try {
      localFingerprint = getFingerprint(legacyKeys);
    } catch (err) {
      return {
        ok: false,
        reason: "fingerprint_unavailable",
        details: String(err),
      };
    }
    if (license.fingerprint !== localFingerprint.fingerprint) {
      return {
        ok: false,
        reason: "fingerprint_mismatch",
      };
    }
  } else {
    let localMachineId: string;
    try {
      localMachineId = nodeMachineId.machineIdSync();
    } catch (err) {
      return {
        ok: false,
        reason: "machine_id_unavailable",
        details: String(err),
      };
    }
    if (license.machineId !== localMachineId) {
      return {
        ok: false,
        reason: "machine_id_mismatch",
        details: `Expected ${localMachineId}, got ${license.machineId}`,
      };
    }
  }

  if (license.expiresAt) {
    const expiresMs = Date.parse(license.expiresAt);
    if (Number.isNaN(expiresMs)) {
      return {
        ok: false,
        reason: "license_expiry_invalid",
        details: `Invalid expiresAt: ${license.expiresAt}`,
      };
    }
    if (Date.now() > expiresMs) {
      return { ok: false, reason: "license_expired" };
    }
  }

  const payload = isHwidLicense(license)
    ? buildHwidPayload({
        product: license.product,
        licenseId: license.licenseId,
        hwid: license.hwid,
        expiresAt: license.expiresAt ?? null,
      })
    : license.fingerprint
    ? buildPayloadV2(
        {
          product: license.product,
          fingerprint: license.fingerprint,
          fingerprintKeys: license.fingerprintKeys,
          machineId: license.machineId,
          issuedAt: license.issuedAt || new Date().toISOString(),
          expiresAt: license.expiresAt ?? null,
        },
        normalizeKeys(license.fingerprintKeys).length
          ? normalizeKeys(license.fingerprintKeys)
          : fingerprintKeysEnv.length
          ? fingerprintKeysEnv
          : DEFAULT_FINGERPRINT_KEYS
      )
    : buildLegacyPayload(license as LegacyPayload);
  try {
    const signature = Buffer.from(license.signature, "base64");
    const verified = crypto.verify(
      "sha256",
      Buffer.from(payload, "utf8"),
      publicKey,
      signature
    );
    if (!verified) {
      return { ok: false, reason: "license_signature_invalid" };
    }
  } catch (err) {
    return {
      ok: false,
      reason: "license_signature_invalid",
      details: String(err),
    };
  }

  return { ok: true };
}

export function enforceLicenseOrExit(): void {
  const status = checkLicense();
  if (status.ok) return;
  console.error(`[license] ${status.reason || "invalid"}`);
  if (status.details) console.error(`[license] ${status.details}`);
  process.exit(1);
}

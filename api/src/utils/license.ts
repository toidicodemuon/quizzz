import crypto from "crypto";
import fs from "fs";
import path from "path";
import machineIdPackage from "node-machine-id";
import { DEFAULT_FINGERPRINT_KEYS, getFingerprint } from "./fingerprint";

type LicensePayload = {
  product: string;
  fingerprint?: string;
  fingerprintKeys?: string[];
  machineId?: string;
  issuedAt: string;
  expiresAt?: string | null;
};

type LicenseFile = LicensePayload & { signature: string };

type LicenseStatus = {
  ok: boolean;
  reason?: string;
  details?: string;
};

const DEFAULT_PRODUCT = "quizzz";
const DEFAULT_LICENSE_CANDIDATES = [
  "license/license.json",
  ".license/license.json",
  "license.json",
];
const DEFAULT_PUBLIC_KEY_CANDIDATES = [
  "license/public.pem",
  ".license/public.pem",
  "public.pem",
];

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

function resolvePath(rawPath: string): string {
  return path.isAbsolute(rawPath)
    ? rawPath
    : path.resolve(process.cwd(), rawPath);
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

function buildLegacyPayload(payload: LicensePayload): string {
  const expiresAt = payload.expiresAt ? String(payload.expiresAt) : "";
  return [
    `product=${payload.product}`,
    `machineId=${payload.machineId || ""}`,
    `issuedAt=${payload.issuedAt}`,
    `expiresAt=${expiresAt}`,
  ].join("\n");
}

function buildPayloadV2(payload: LicensePayload, keys: string[]): string {
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
        "License file not found. Set LICENSE_PATH or provide license/license.json",
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
  if (!license.fingerprint && !license.machineId) {
    return "License fingerprint or machineId missing";
  }
  if (!license.issuedAt) return "License issuedAt missing";
  return null;
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

  const { machineIdSync } = machineIdPackage;
  const fingerprintKeysEnv = normalizeKeys(
    process.env.LICENSE_FINGERPRINT_KEYS || ""
  );

  if (license.fingerprint) {
    const expectedKeys = normalizeKeys(license.fingerprintKeys);
    const keysToUse = expectedKeys.length
      ? expectedKeys
      : fingerprintKeysEnv.length
      ? fingerprintKeysEnv
      : DEFAULT_FINGERPRINT_KEYS;
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
    const missingKeys = keysToUse.filter(
      (key) => !localFingerprint.keys.includes(key)
    );
    if (missingKeys.length) {
      return {
        ok: false,
        reason: "fingerprint_sources_missing",
        details: `Missing keys: ${missingKeys.join(",")}`,
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
      localMachineId = machineIdSync();
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

  const payload = license.fingerprint
    ? buildPayloadV2(
        license,
        normalizeKeys(license.fingerprintKeys).length
          ? normalizeKeys(license.fingerprintKeys)
          : fingerprintKeysEnv.length
          ? fingerprintKeysEnv
          : DEFAULT_FINGERPRINT_KEYS
      )
    : buildLegacyPayload(license);
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

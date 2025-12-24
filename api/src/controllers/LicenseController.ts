import crypto from "crypto";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import {
  Body,
  Controller,
  Get,
  Post,
  Response,
  Route,
  Security,
  Tags,
} from "tsoa";

type LicenseCreateRequest = {
  hwid?: string;
  fingerprint?: string;
  fingerprintParts?: Record<string, string>;
  product?: string;
};

type LicenseTrialRequest = {
  hwid?: string;
  fingerprint?: string;
  fingerprintParts?: Record<string, string>;
  product?: string;
};

type LicenseResponse = {
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
  expiresAt?: string;
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

function normalizePem(pem: string): string {
  return pem.replace(/\\n/g, "\n").trim();
}

function loadPrivateKey(): string {
  const inlineKey = process.env.LICENSE_PRIVATE_KEY;
  if (inlineKey) return normalizePem(inlineKey);

  const envPath = process.env.LICENSE_PRIVATE_KEY_PATH || "license/private.pem";
  const privateKeyPath = resolvePath(envPath);
  if (!fs.existsSync(privateKeyPath)) {
    const err: any = new Error(
      `Private key not found at ${privateKeyPath}`
    );
    err.status = 500;
    throw err;
  }
  return fs.readFileSync(privateKeyPath, "utf8").trim();
}

function buildPayload(payload: LicensePayload): string {
  const expiresValue = payload.expiresAt ? String(payload.expiresAt) : "";
  return [
    `product=${payload.product}`,
    `licenseId=${payload.licenseId}`,
    `hwid=${payload.hwid}`,
    `expiresAt=${expiresValue}`,
  ].join("\n");
}

function parseTrialDays(raw?: unknown): number | null {
  if (raw === undefined || raw === null || raw === "") return null;
  const value = Number(raw);
  if (!Number.isFinite(value)) return null;
  const days = Math.floor(value);
  if (days <= 0) return null;
  return Math.min(days, 3650);
}

function issueLicense(options: {
  product: string;
  hwid: string;
  expiresAt?: string;
  trial?: boolean;
  fingerprintParts?: Record<string, string>;
}): LicenseResponse {
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
    .sign("sha256", Buffer.from(buildPayload(payload), "utf8"), privateKey)
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
    "scripts/license/fingerprint.mjs",
    "dist/scripts/license/fingerprint.mjs",
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

function loadFingerprintModuleSource(): string {
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
    process.env.LICENSE_LOG_PATH || "license/licenses.csv"
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

@Route("license")
@Tags("License")
export class LicenseController extends Controller {
  @Get("fingerprint")
  @Response<null>(500, "Server error")
  public async getFingerprintModule(): Promise<NodeJS.ReadableStream> {
    const source = loadFingerprintModuleSource();
    this.setHeader("content-type", "application/javascript; charset=utf-8");
    this.setHeader("cache-control", "no-store");
    return Readable.from([source]);
  }

  @Post("trial")
  @Response<null>(400, "Bad Request")
  @Response<null>(500, "Server error")
  public async createTrialLicense(
    @Body() body: LicenseTrialRequest
  ): Promise<LicenseResponse> {
    const hwid = String(body?.hwid || body?.fingerprint || "").trim();
    if (!hwid) {
      const err: any = new Error("hwid is required");
      err.status = 400;
      throw err;
    }

    const product = String(
      body?.product || process.env.LICENSE_PRODUCT || "quizzz"
    );
    const trialDays =
      parseTrialDays(process.env.LICENSE_TRIAL_DAYS) ?? 7;
    const expiresMs = Date.now() + trialDays * 24 * 60 * 60 * 1000;
    const expiresAt = new Date(expiresMs).toISOString();

    return issueLicense({
      product,
      hwid,
      expiresAt,
      trial: true,
      fingerprintParts: body?.fingerprintParts || undefined,
    });
  }

  @Post("create")
  @Response<null>(400, "Bad Request")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(500, "Server error")
  @Security("bearerAuth", ["ADMIN"])
  public async createLicense(
    @Body() body: LicenseCreateRequest
  ): Promise<LicenseResponse> {
    const hwid = String(body?.hwid || body?.fingerprint || "").trim();
    if (!hwid) {
      const err: any = new Error("hwid is required");
      err.status = 400;
      throw err;
    }

    const product = String(
      body?.product || process.env.LICENSE_PRODUCT || "quizzz"
    );
    return issueLicense({
      product,
      hwid,
      fingerprintParts: body?.fingerprintParts || undefined,
    });
  }
}

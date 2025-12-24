import crypto from "crypto";
import fs from "fs";
import path from "path";
import {
  Body,
  Controller,
  Post,
  Response,
  Route,
  Security,
  Tags,
} from "tsoa";
import { DEFAULT_FINGERPRINT_KEYS } from "../utils/fingerprint";

type LicenseCreateRequest = {
  fingerprint: string;
  fingerprintKeys?: string[];
  machineId?: string;
  fingerprintParts?: Record<string, string>;
  product?: string;
  expiresAt?: string | null;
};

type LicenseResponse = {
  product: string;
  fingerprint: string;
  fingerprintKeys: string[];
  machineId?: string;
  issuedAt: string;
  expiresAt?: string;
  signature: string;
};

type LicensePayload = {
  product: string;
  fingerprint: string;
  fingerprintKeys: string[];
  machineId?: string;
  issuedAt: string;
  expiresAt?: string;
};

type LicenseLogEntry = {
  issuedAt: string;
  product: string;
  fingerprint: string;
  fingerprintKeys: string[];
  machineId?: string;
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

function normalizeKeys(raw?: string[] | string | null): string[] {
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : String(raw).split(",");
  return Array.from(
    new Set(list.map((key) => String(key).trim()).filter(Boolean))
  ).sort();
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
    `fingerprint=${payload.fingerprint || ""}`,
    `fingerprintKeys=${(payload.fingerprintKeys || []).join(",")}`,
    `machineId=${payload.machineId || ""}`,
    `issuedAt=${payload.issuedAt}`,
    `expiresAt=${expiresValue}`,
  ].join("\n");
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
    "fingerprint",
    "fingerprintKeys",
    "machineId",
    "baseboardSerial",
    "biosUuid",
    "cpuId",
    "diskSerials",
    "expiresAt",
  ].join(",");
  ensureCsvHeader(logPath, header);

  const machineId =
    entry.machineId || getPart(entry.fingerprintParts, "machineId");
  const row = [
    entry.issuedAt,
    entry.product,
    entry.fingerprint,
    entry.fingerprintKeys.join("|"),
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
  @Post("create")
  @Response<null>(400, "Bad Request")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(500, "Server error")
  @Security("bearerAuth", ["ADMIN"])
  public async createLicense(
    @Body() body: LicenseCreateRequest
  ): Promise<LicenseResponse> {
    const fingerprint = String(body?.fingerprint || "").trim();
    if (!fingerprint) {
      const err: any = new Error("fingerprint is required");
      err.status = 400;
      throw err;
    }

    const envKeys = normalizeKeys(process.env.LICENSE_FINGERPRINT_KEYS || "");
    const requestKeys = normalizeKeys(body?.fingerprintKeys || []);
    const fingerprintKeys = requestKeys.length
      ? requestKeys
      : envKeys.length
      ? envKeys
      : DEFAULT_FINGERPRINT_KEYS;

    const product = String(
      body?.product || process.env.LICENSE_PRODUCT || "quizzz"
    );
    const expiresAtRaw =
      body?.expiresAt || process.env.LICENSE_EXPIRES_AT || "";
    const expiresAt = expiresAtRaw ? String(expiresAtRaw) : "";
    const fingerprintParts = body?.fingerprintParts || undefined;
    const machineId = body?.machineId
      ? String(body.machineId)
      : getPart(fingerprintParts, "machineId");
    const issuedAt = new Date().toISOString();

    const payload: LicensePayload = {
      product,
      fingerprint,
      fingerprintKeys,
      ...(machineId ? { machineId } : {}),
      issuedAt,
      ...(expiresAt ? { expiresAt } : {}),
    };

    const privateKey = loadPrivateKey();
    const signature = crypto
      .sign("sha256", Buffer.from(buildPayload(payload), "utf8"), privateKey)
      .toString("base64");

    const license = {
      ...payload,
      signature,
    };

    try {
      appendLicenseLog({
        issuedAt,
        product,
        fingerprint,
        fingerprintKeys,
        machineId: machineId || undefined,
        fingerprintParts,
        expiresAt: expiresAt || undefined,
      });
    } catch (err) {
      console.warn(`[license] failed to log CSV: ${String(err)}`);
    }

    return license;
  }
}

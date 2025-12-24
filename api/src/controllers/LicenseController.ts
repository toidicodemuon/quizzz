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

function resolvePath(rawPath: string): string {
  return path.isAbsolute(rawPath)
    ? rawPath
    : path.resolve(process.cwd(), rawPath);
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
    const machineId = body?.machineId ? String(body.machineId) : "";
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

    return {
      ...payload,
      signature,
    };
  }
}

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
import {
  issueLicense,
  loadFingerprintModuleSource,
  parseTrialDays,
  type LicenseResponse,
} from "../utils/license";

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
  @Security("bearerAuth", ["LICENSE"])
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

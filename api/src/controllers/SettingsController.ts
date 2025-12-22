import { Body, Controller, Get, Put, Response, Route, Security, Tags } from "tsoa";
import {
  getPublicSettings,
  updateCaptchaEnabled,
  type PublicSettings,
} from "../services/settingsService";

export type UpdateSettingsRequest = {
  captchaEnabled?: boolean;
};

@Route("settings")
@Tags("Settings")
export class SettingsController extends Controller {
  @Get("public")
  public async getPublic(): Promise<PublicSettings> {
    return getPublicSettings();
  }

  @Get()
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["ADMIN"])
  public async getAdmin(): Promise<PublicSettings> {
    return getPublicSettings();
  }

  @Put()
  @Response<null>(400, "Bad Request")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["ADMIN"])
  public async update(
    @Body() body: UpdateSettingsRequest
  ): Promise<PublicSettings> {
    if (typeof body?.captchaEnabled === "undefined") {
      return getPublicSettings();
    }
    if (body.captchaEnabled && !process.env.RECAPTCHA_SECRET_KEY) {
      const err: any = new Error("RECAPTCHA_SECRET_KEY not configured");
      err.status = 400;
      throw err;
    }
    return updateCaptchaEnabled(Boolean(body.captchaEnabled));
  }
}

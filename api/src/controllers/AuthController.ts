import {
  Body,
  Post,
  Route,
  Tags,
  Response,
  Controller,
  SuccessResponse,
  Example,
  Request,
} from "tsoa";
import type { Request as ExRequest } from "express";
import {
  authenticateUser,
  AuthError,
  type LoginSuccessResponse,
  refreshTokens,
  logoutSession,
} from "../services/authService";

export class LoginRequest {
  @Example<string>("SV20240001")
  public identifier!: string; // userCode or email

  @Example<string>("123456")
  public password!: string;
}

export type LoginErrorResponse = {
  message: string;
};

@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {
  private setRefreshCookie(token: string | null): void {
    const maxAgeMs = Number(
      process.env.REFRESH_COOKIE_MAX_AGE_MS || 7 * 24 * 60 * 60 * 1000
    );
    const isProd = process.env.NODE_ENV === "production";
    const base = [
      `refreshToken=${encodeURIComponent(token || "")}`,
      "Path=/api/auth",
      "HttpOnly",
      "SameSite=Lax",
    ];
    if (isProd) base.push("Secure");
    if (token) {
      base.push(`Max-Age=${Math.floor(maxAgeMs / 1000)}`);
    } else {
      base.push("Max-Age=0");
    }
    this.setHeader("Set-Cookie", base.join("; "));
  }

  @Post("login")
  @SuccessResponse("200", "Login successful")
  @Response<LoginErrorResponse>(400, "Bad Request")
  @Response<LoginErrorResponse>(401, "Invalid credentials")
  @Response<LoginErrorResponse>(500, "Server error")
  public async login(
    @Request() req: ExRequest,
    @Body() body: LoginRequest
  ): Promise<LoginSuccessResponse | LoginErrorResponse> {
    try {
      const result = await authenticateUser(
        body?.identifier,
        body?.password,
        req
      );
      if (result.refreshToken) {
        this.setRefreshCookie(result.refreshToken);
      }
      const { refreshToken, ...safe } = result;
      return safe;
    } catch (error) {
      if (error instanceof AuthError) {
        this.setStatus(error.status);
        return { message: error.message };
      }

      this.setStatus(500);
      return { message: "Login failed: " + JSON.stringify(error) };
    }
  }

  @Post("refresh")
  @SuccessResponse("200", "Refreshed")
  @Response<LoginErrorResponse>(401, "Invalid refresh token")
  public async refresh(
    @Request() req: ExRequest,
    @Body() body?: { refreshToken?: string }
  ): Promise<LoginSuccessResponse | LoginErrorResponse> {
    try {
      const token =
        (req as any).cookies?.refreshToken || body?.refreshToken || "";
      const result = await refreshTokens(token, req);
      if (result.refreshToken) {
        this.setRefreshCookie(result.refreshToken);
      }
      const { refreshToken, ...safe } = result;
      return safe;
    } catch (error) {
      if (error instanceof AuthError) {
        this.setStatus(error.status);
        return { message: error.message };
      }
      this.setStatus(500);
      return { message: "Refresh failed" };
    }
  }

  @Post("logout")
  @SuccessResponse("200", "Logged out")
  public async logout(@Request() req: ExRequest): Promise<{ message: string }> {
    const token = (req as any).cookies?.refreshToken || "";
    await logoutSession(token, req);
    this.setRefreshCookie(null);
    return { message: "Logged out" };
  }
}

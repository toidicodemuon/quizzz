import { Body, Post, Route, Tags, Response, Controller, SuccessResponse, Example } from "tsoa";
import {
  authenticateUser,
  AuthError,
  type LoginSuccessResponse,
  refreshTokens,
} from "../services/authService";

export class LoginRequest {
  @Example<string>("SV20240001")
  public identifier?: string; // userCode or email

  @Example<string>("123456")
  public password!: string;

  @Example<string>("user@example.com")
  public username?: string;

  @Example<string>("recaptcha_token")
  public captchaToken?: string;
}

export type LoginErrorResponse = {
  message: string;
};

@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {
  @Post("login")
  @SuccessResponse("200", "Login successful")
  @Response<LoginErrorResponse>(400, "Bad Request")
  @Response<LoginErrorResponse>(401, "Invalid credentials")
  @Response<LoginErrorResponse>(423, "Account locked")
  @Response<LoginErrorResponse>(500, "Server error")
  public async login(
    @Body() body: LoginRequest
  ): Promise<LoginSuccessResponse | LoginErrorResponse> {
    try {
      const identifier = body?.identifier || body?.username || "";
      const result = await authenticateUser(identifier, body?.password, {
        captchaToken: body?.captchaToken,
      });
      console.log(result);
      return result;
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
  public async refresh(@Body() body: { refreshToken: string }): Promise<LoginSuccessResponse | LoginErrorResponse> {
    try {
      const result = await refreshTokens(body?.refreshToken)
      return result
    } catch (error) {
      if (error instanceof AuthError) {
        this.setStatus(error.status)
        return { message: error.message }
      }
      this.setStatus(500)
      return { message: "Refresh failed" }
    }
  }
}

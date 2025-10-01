import {
  Body,
  Post,
  Route,
  Tags,
  Response,
  Controller,
  SuccessResponse,
} from "tsoa";
import {
  authenticateUser,
  AuthError,
  type LoginSuccessResponse,
} from "../services/authService";

export type LoginRequest = {
  username: string;
  password: string;
};

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
  @Response<LoginErrorResponse>(500, "Server error")
  public async login(
    @Body() body: LoginRequest
  ): Promise<LoginSuccessResponse | LoginErrorResponse> {
    try {
      const result = await authenticateUser(body?.username, body?.password);
      return result;
    } catch (error) {
      if (error instanceof AuthError) {
        this.setStatus(error.status);
        return { message: error.message };
      }

      this.setStatus(500);
      return { message: "Login failed" };
    }
  }
}

import type { Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export type AuthUser = {
  id: number;
  username: string;
  role: string;
};

/**
 * TSOA authentication hook for Express.
 * Called for routes decorated with @Security.
 */
export async function expressAuthentication(
  request: Request,
  securityName: string,
  _scopes?: string[],
  _response?: Response
): Promise<AuthUser> {
  try {
    if (securityName !== "bearerAuth") {
      const err: any = new Error("Unsupported security scheme");
      err.status = 401;
      throw err;
    }

    const header = (request.headers["authorization"] || request.headers["Authorization"]) as string | undefined;
    if (!header || Array.isArray(header)) {
      const err: any = new Error("Missing Authorization header");
      err.status = 401;
      throw err;
    }

    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      const err: any = new Error("Invalid Authorization format");
      err.status = 401;
      throw err;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      const err: any = new Error("JWT secret not configured");
      err.status = 500;
      throw err;
    }

    const decoded = jwt.verify(token, secret) as JwtPayload | string;
    const payload = typeof decoded === "string" ? (JSON.parse(decoded) as JwtPayload) : decoded;

    const id = Number(payload.sub);
    const username = String((payload as any).username ?? "");
    const role = String((payload as any).role ?? "");

    if (!Number.isFinite(id)) {
      const err: any = new Error("Invalid token subject");
      err.status = 401;
      throw err;
    }

    const user: AuthUser = { id, username, role };
    return user;
  } catch (error: any) {
    // Ensure an HTTP status is set for TSOA's error handler
    if (typeof error?.status !== "number") {
      error = error ?? new Error("Unauthorized");
      (error as any).status = 401;
    }
    throw error;
  }
}

export default expressAuthentication;


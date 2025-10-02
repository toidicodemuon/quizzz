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
  scopes?: string[],
  _response?: Response
): Promise<AuthUser> {
  try {
    if (securityName !== "bearerAuth") {
      const err: any = new Error("Unsupported security scheme");
      err.status = 401;
      throw err;
    }

    const header = (request.headers["authorization"] ||
      request.headers["Authorization"]) as string | undefined;
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
    const payload =
      typeof decoded === "string"
        ? (JSON.parse(decoded) as JwtPayload)
        : decoded;

    const id = Number(payload.sub);
    const username = String((payload as any).username ?? "");
    const role = String((payload as any).role ?? "");

    if (!Number.isFinite(id)) {
      const err: any = new Error("Invalid token subject");
      err.status = 401;
      throw err;
    }

    const user: AuthUser = { id, username, role };

    // Role/scope check via TSOA @Security("bearerAuth", ["ROLE"])
    const path = (request as any).originalUrl ?? request.url;
    const method = request.method?.toUpperCase();
    if (Array.isArray(scopes) && scopes.length > 0) {
      const required = scopes.map((s) => String(s).toUpperCase());
      const roleUpper = role.toUpperCase();
      if (!required.includes(roleUpper)) {
        const err: any = new Error(
          method === "POST" && (path.startsWith("/api/quizzes") || path.startsWith("/api/quiz/add"))
            ? "Access denied. Only teachers can add quizzes."
            : "Forbidden"
        );
        err.status = 403;
        throw err;
      }
    }

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

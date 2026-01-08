import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { prisma } from "./utils/prisma";

interface RequestWithOriginalUrl extends Request {
  originalUrl: string;
}

interface AuthError extends Error {
  status: number;
}

export type AuthUser = {
  id: number;
  username:string;
  role: string;
};

const SESSION_TOUCH_MS = Number(process.env.SESSION_TOUCH_MS || 60_000);
const lastSeenCache = new Map<number, number>();

async function touchSession(sessionId: number): Promise<void> {
  const now = Date.now();
  const last = lastSeenCache.get(sessionId) || 0;
  if (now - last < SESSION_TOUCH_MS) return;
  lastSeenCache.set(sessionId, now);
  try {
    await prisma.userSession.updateMany({
      where: { id: sessionId, revokedAt: null, logoutAt: null },
      data: { lastSeenAt: new Date(now) },
    });
  } catch {
    // ignore session update errors
  }
}

/**
 * TSOA authentication hook for Express.
 * Called for routes decorated with @Security.
 */
export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<AuthUser> {
  try {
    if (securityName !== "bearerAuth") {
      const err: AuthError = new Error(
        "Unsupported security scheme"
      ) as AuthError;
      err.status = 401;
      throw err;
    }
    const err = new Error("Missing Authorization header") as AuthError;
    err.status = 401;
    const header = request.headers["authorization"] as string | undefined;
    if (!header || Array.isArray(header)) {
      const err: AuthError = new Error(
        "Missing Authorization header"
      ) as AuthError;
      err.status = 401;
      throw err;
    }

    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      const err: AuthError = new Error(
        "Invalid Authorization format"
      ) as AuthError;
      err.status = 401;
      throw err;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      const err: AuthError = new Error(
        "JWT secret not configured"
      ) as AuthError;
      err.status = 500;
      throw err;
    }

    type TokenPayload = JwtPayload & {
      username?: string;
      email?: string;
      role?: string;
      sub?: string | number;
    };

    const decoded = jwt.verify(token, secret) as JwtPayload | string;
    const payload: TokenPayload =
      typeof decoded === "string"
        ? (JSON.parse(decoded) as TokenPayload)
        : (decoded as TokenPayload);

    const id = Number(payload.sub);
    const username = String(payload.username ?? payload.email ?? "");
    const role = String(payload.role ?? "");
    const sessionId = Number((payload as any).sid);

    if (!Number.isFinite(id)) {
      const err = new Error("Invalid token subject") as AuthError;
      err.status = 401;
      throw err;
    }

    const user: AuthUser = { id, username, role };

    // Role/scope check via TSOA @Security("bearerAuth", ["ROLE"])
    const path = (request as RequestWithOriginalUrl).originalUrl ?? request.url;
    const method = request.method?.toUpperCase();
    if (Array.isArray(scopes) && scopes.length > 0) {
      const required = scopes.map((s) => String(s).toUpperCase());
      const roleUpper = role.toUpperCase();
      if (!required.includes(roleUpper)) {
        const err: AuthError = new Error(
          method === "POST" && path.startsWith("/api/exams")
            ? "Access denied. Only teachers can add exams."
            : "Forbidden"
        ) as AuthError;
        err.status = 403;
        throw err;
      }
    }

    if (Number.isFinite(sessionId)) {
      void touchSession(sessionId);
    }

    return user;
  } catch (caught: unknown) {
    // Ensure an HTTP status is set for TSOA's error handler
    const error = (caught ?? new Error("Unauthorized")) as AuthError;
    if (typeof error?.status !== "number") {
      error.status = 401;
    }
    throw error;
  }
}

export async function requireTeacher(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const user = await expressAuthentication(req, "bearerAuth", [
      "TEACHER",
      "ADMIN",
    ]);
    (req as any).user = user;
    next();
  } catch (err) {
    next(err);
  }
}

export default expressAuthentication;

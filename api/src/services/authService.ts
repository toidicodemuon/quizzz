import { prisma } from "../utils/prisma";
import type { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import type { Request } from "express";

export type LoginSuccessResponse = {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: number;
    email: string | null;
    fullName: string;
    role: string;
  };
};

export class AuthError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || "1h";
const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL || "7d";

type TokenPayload = {
  sub: number;
  username: string;
  role: string;
  sid?: number;
};

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getRequestContext(req?: Request): { ip?: string; userAgent?: string } {
  if (!req) return {};
  const forwarded = req.headers["x-forwarded-for"];
  const ip = Array.isArray(forwarded)
    ? forwarded[0]
    : typeof forwarded === "string"
    ? forwarded.split(",")[0]?.trim()
    : req.ip;
  const userAgent = req.headers["user-agent"];
  return { ip, userAgent: typeof userAgent === "string" ? userAgent : undefined };
}

async function logAuthEvent(
  action: string,
  userId?: number | null,
  req?: Request,
  meta?: Prisma.InputJsonValue
): Promise<void> {
  const { ip, userAgent } = getRequestContext(req);
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId ?? null,
        action,
        ip: ip ?? null,
        userAgent: userAgent ?? null,
        meta: meta ?? undefined,
      },
    });
  } catch {
    // avoid breaking auth flow on audit failures
  }
}

async function issueTokens(
  user: { id: number; userCode?: string | null; email?: string | null; role: string },
  req?: Request
): Promise<{ accessToken: string; refreshToken: string; sessionId: number }> {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AuthError(500, "JWT secret not configured");
  const basePayload: TokenPayload = {
    sub: user.id,
    username: user.userCode ?? user.email ?? String(user.id),
    role: user.role,
  };
  const refreshToken = jwt.sign(basePayload, secret, {
    expiresIn: REFRESH_TOKEN_TTL,
  });
  const refreshTokenHash = hashToken(refreshToken);
  const { ip, userAgent } = getRequestContext(req);
  const session = await prisma.userSession.create({
    data: {
      userId: user.id,
      refreshTokenHash,
      ip: ip ?? null,
      userAgent: userAgent ?? null,
      lastSeenAt: new Date(),
    },
  });
  const accessToken = jwt.sign(
    { ...basePayload, sid: session.id },
    secret,
    { expiresIn: ACCESS_TOKEN_TTL }
  );
  return { accessToken, refreshToken, sessionId: session.id };
}

async function rotateRefreshToken(
  sessionId: number,
  user: { id: number; userCode?: string | null; email?: string | null; role: string },
  req?: Request
): Promise<{ accessToken: string; refreshToken: string }> {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AuthError(500, "JWT secret not configured");
  const basePayload: TokenPayload = {
    sub: user.id,
    username: user.userCode ?? user.email ?? String(user.id),
    role: user.role,
  };
  const refreshToken = jwt.sign(basePayload, secret, {
    expiresIn: REFRESH_TOKEN_TTL,
  });
  const refreshTokenHash = hashToken(refreshToken);
  const { ip, userAgent } = getRequestContext(req);
  await prisma.userSession.update({
    where: { id: sessionId },
    data: {
      refreshTokenHash,
      lastSeenAt: new Date(),
      ip: ip ?? undefined,
      userAgent: userAgent ?? undefined,
    },
  });
  const accessToken = jwt.sign(
    { ...basePayload, sid: sessionId },
    secret,
    { expiresIn: ACCESS_TOKEN_TTL }
  );
  return { accessToken, refreshToken };
}

async function revokeUserSessions(userId: number, reason: string): Promise<void> {
  await prisma.userSession.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  await logAuthEvent("TOKEN_REVOKE_ALL", userId, undefined, { reason });
}

export async function refreshTokens(
  refreshToken: string,
  req?: Request
): Promise<LoginSuccessResponse> {
  if (!refreshToken) throw new AuthError(401, "Missing refresh token");
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AuthError(500, "JWT secret not configured");
  try {
    const payload: any = jwt.verify(refreshToken, secret);
    const userId = Number(payload?.sub);
    if (!Number.isFinite(userId)) throw new AuthError(401, "Invalid refresh token");
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AuthError(401, "Invalid refresh token");
    const refreshTokenHash = hashToken(refreshToken);
    const session = await prisma.userSession.findFirst({
      where: {
        userId,
        refreshTokenHash,
        revokedAt: null,
        logoutAt: null,
      },
    });
    if (!session) {
      await revokeUserSessions(userId, "Refresh token reuse detected");
      await logAuthEvent("REFRESH_REUSE", userId, req);
      throw new AuthError(401, "Invalid refresh token");
    }
    const { accessToken, refreshToken: newRefresh } = await rotateRefreshToken(
      session.id,
      user,
      req
    );
    await logAuthEvent("REFRESH_SUCCESS", userId, req, {
      sessionId: session.id,
    });
    return {
      accessToken,
      refreshToken: newRefresh,
      user: {
        id: user.id,
        email: user.email ?? null,
        fullName: user.fullName ?? "",
        role: user.role,
      },
    };
  } catch (e: any) {
    if (e?.name === "TokenExpiredError") {
      await logAuthEvent("REFRESH_EXPIRED", undefined, req);
      throw new AuthError(401, "Refresh token expired");
    }
    await logAuthEvent("REFRESH_FAILED", undefined, req);
    throw new AuthError(401, "Invalid refresh token");
  }
}

// shared prisma instance

/**
 * Thực hiện xác thực user và sinh JWT
 */
export async function authenticateUser(
  identifier: string,
  password: string,
  req?: Request
): Promise<LoginSuccessResponse> {
  if (!identifier || !password) {
    throw new AuthError(400, "identifier and password are required");
  }

  try {
    // identifier can be userCode or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ userCode: identifier }, { email: identifier }],
      },
    });
    if (!user) {
      await logAuthEvent("LOGIN_FAILURE", undefined, req, { identifier });
      throw new AuthError(401, "Invalid credentials");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      await logAuthEvent("LOGIN_FAILURE", user.id, req);
      throw new AuthError(401, "Invalid credentials");
    }
    const { accessToken, refreshToken, sessionId } = await issueTokens(
      user,
      req
    );
    await logAuthEvent("LOGIN_SUCCESS", user.id, req, { sessionId });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email ?? null,
        fullName: user.fullName ?? "",
        role: user.role,
      },
    };
  } catch (error: any) {
    const code = error?.code as string | undefined;
    const name = error?.name as string | undefined;
    // Map common Prisma initialization/connection errors to a clearer message
    const dbInitNames = new Set([
      "PrismaClientInitializationError",
      "PrismaClientRustPanicError",
    ]);
    const dbConnCodes = new Set([
      "P1000", // Authentication failed against database server
      "P1001", // Can't reach database server
      "P1002", // The database server was reached but timed out
      "P1003", // Database does not exist
      "P1009", // Database already exists on create
    ]);
    if (dbInitNames.has(String(name)) || (code && dbConnCodes.has(code))) {
      throw new AuthError(503, "Database unavailable");
    }
    throw error;
  }
}

export async function logoutSession(
  refreshToken: string,
  req?: Request
): Promise<void> {
  if (!refreshToken) return;
  const refreshTokenHash = hashToken(refreshToken);
  const session = await prisma.userSession.findFirst({
    where: { refreshTokenHash, revokedAt: null },
  });
  if (session) {
    await prisma.userSession.update({
      where: { id: session.id },
      data: { logoutAt: new Date(), revokedAt: new Date() },
    });
    await logAuthEvent("LOGOUT", session.userId, req, {
      sessionId: session.id,
    });
    return;
  }
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return;
    const payload: any = jwt.verify(refreshToken, secret);
    const userId = Number(payload?.sub);
    if (Number.isFinite(userId)) {
      await logAuthEvent("LOGOUT_MISSING_SESSION", userId, req);
    }
  } catch {
    // ignore invalid/expired tokens on logout
  }
}

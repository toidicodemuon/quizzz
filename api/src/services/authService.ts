import { prisma } from "../utils/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getCaptchaEnabled } from "./settingsService";

export type LoginSuccessResponse = {
  accessToken: string;
  refreshToken: string;
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

const MAX_LOGIN_ATTEMPTS = parsePositiveInt(
  process.env.MAX_LOGIN_ATTEMPTS,
  5
);
const ACCOUNT_LOCK_MINUTES = parsePositiveInt(
  process.env.ACCOUNT_LOCK_MINUTES,
  30
);

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function minutesUntil(lockedUntil: Date): number {
  const diffMs = lockedUntil.getTime() - Date.now();
  return Math.max(1, Math.ceil(diffMs / 60000));
}

async function requireCaptchaIfEnabled(
  captchaToken?: string,
  remoteIp?: string
): Promise<void> {
  const captchaEnabled = await getCaptchaEnabled();
  if (!captchaEnabled) return;
  if (!captchaToken) {
    throw new AuthError(400, "Captcha required");
  }
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    throw new AuthError(500, "Captcha secret not configured");
  }

  const params = new URLSearchParams();
  params.set("secret", secret);
  params.set("response", captchaToken);
  if (remoteIp) params.set("remoteip", remoteIp);

  let response: Response;
  try {
    response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
  } catch (error) {
    throw new AuthError(502, "Captcha verification failed");
  }

  const data = (await response.json()) as { success?: boolean };
  if (!data?.success) {
    throw new AuthError(401, "Invalid captcha");
  }
}
export async function refreshTokens(
  refreshToken: string
): Promise<LoginSuccessResponse> {
  if (!refreshToken) throw new AuthError(401, "Missing refresh token");
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AuthError(500, "JWT secret not configured");
  try {
    const payload: any = jwt.verify(refreshToken, secret);
    const user = await prisma.user.findUnique({
      where: { id: Number(payload?.sub) },
    });
    if (!user) throw new AuthError(401, "Invalid refresh token");
    const base = {
      sub: user.id,
      username: user.userCode ?? user.email ?? String(user.id),
      role: user.role,
    } as const;
    const accessToken = jwt.sign(base, secret, { expiresIn: "1h" });
    const newRefresh = jwt.sign(base, secret, { expiresIn: "7d" });
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
    if (e?.name === "TokenExpiredError")
      throw new AuthError(401, "Refresh token expired");
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
  options?: { captchaToken?: string; remoteIp?: string }
): Promise<LoginSuccessResponse> {
  if (!identifier || !password) {
    throw new AuthError(400, "identifier and password are required");
  }

  try {
    await requireCaptchaIfEnabled(options?.captchaToken, options?.remoteIp);
    // identifier can be userCode or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ userCode: identifier }, { email: identifier }],
      },
    });
    if (!user) {
      throw new AuthError(401, "Invalid credentials");
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new AuthError(
        423,
        `Account locked. Try again in ${minutesUntil(user.lockedUntil)} minutes.`
      );
    }

    if (user.lockedUntil && user.lockedUntil <= new Date()) {
      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginCount: 0, lockedUntil: null },
      });
      user.failedLoginCount = 0;
      user.lockedUntil = null;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      const nextFailed = (user.failedLoginCount || 0) + 1;
      const data: { failedLoginCount: number; lockedUntil?: Date | null } = {
        failedLoginCount: nextFailed,
      };
      if (nextFailed >= MAX_LOGIN_ATTEMPTS) {
        data.lockedUntil = new Date(
          Date.now() + ACCOUNT_LOCK_MINUTES * 60_000
        );
      }
      await prisma.user.update({
        where: { id: user.id },
        data,
      });

      if (nextFailed >= MAX_LOGIN_ATTEMPTS) {
        throw new AuthError(
          423,
          `Account locked. Try again in ${ACCOUNT_LOCK_MINUTES} minutes.`
        );
      }

      throw new AuthError(401, "Invalid credentials");
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AuthError(500, "JWT secret not configured");
    }

    if (user.failedLoginCount !== 0 || user.lockedUntil) {
      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginCount: 0, lockedUntil: null },
      });
    }

    const payload = {
      sub: user.id,
      username: user.userCode ?? user.email ?? String(user.id),
      role: user.role,
    } as const;

    const accessToken = jwt.sign(payload, secret, { expiresIn: "1h" });
    const refreshToken = jwt.sign(payload, secret, { expiresIn: "7d" });

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

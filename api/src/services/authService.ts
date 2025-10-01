import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export type LoginSuccessResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    username: string;
    fullName: string;
    email: string;
    role: string;
    avatarUrl: string | null;
  };
};

export class AuthError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const prisma = new PrismaClient();

/**
 * Thực hiện xác thực user và sinh JWT
 */
export async function authenticateUser(
  username: string,
  password: string
): Promise<LoginSuccessResponse> {
  if (!username || !password) {
    throw new AuthError(400, "username and password are required");
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new AuthError(401, "Invalid credentials");
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      throw new AuthError(401, "Invalid credentials");
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AuthError(500, "JWT secret not configured");
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    } as const;

    const accessToken = jwt.sign(payload, secret, { expiresIn: "1h" });
    const refreshToken = jwt.sign(payload, secret, { expiresIn: "7d" });

    void prisma.user
      .update({ where: { id: user.id }, data: { lastLogin: new Date() } })
      .catch(() => undefined);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName ?? "",
        email: user.email ?? "",
        role: user.role,
        avatarUrl: user.avatarUrl,
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

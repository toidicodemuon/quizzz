import { prisma } from "../utils/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export type LoginSuccessResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    fullName: string;
    role: string;
  };
};

export class AuthError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// shared prisma instance

/**
 * Thực hiện xác thực user và sinh JWT
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<LoginSuccessResponse> {
  if (!email || !password) {
    throw new AuthError(400, "email and password are required");
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AuthError(401, "Invalid credentials");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new AuthError(401, "Invalid credentials");
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AuthError(500, "JWT secret not configured");
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    } as const;

    const accessToken = jwt.sign(payload, secret, { expiresIn: "1h" });
    const refreshToken = jwt.sign(payload, secret, { expiresIn: "7d" });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
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

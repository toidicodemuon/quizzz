import type { Request, Response } from "express";
import { authenticateUser, AuthError } from "../services/authService";

/**
 * POST /auth/login
 * Body: { username: string; password: string }
 * - Kiểm tra user bằng Prisma
 * - Sinh accessToken (1h) và refreshToken (7d)
 */
export async function loginHandler(req: Request, res: Response) {
  try {
    const { username, password } = req.body ?? {};
    const result = await authenticateUser(username, password);
    return res.json(result);
  } catch (err) {
    if (err instanceof AuthError) {
      return res.status(err.status).json({ message: err.message });
    }
    return res.status(500).json({ message: "Login failed" });
  }
}

export default loginHandler;

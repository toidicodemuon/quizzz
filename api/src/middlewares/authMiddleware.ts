import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

// Lightweight shape of the user embedded in JWT
export type AuthUser = {
  id: number;
  username: string;
  role: string;
};

// Augment Express Request to include `user`
declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser;
  }
}

/**
 * authMiddleware
 * - Đọc header Authorization dạng `Bearer <token>`
 * - Xác thực JWT bằng biến môi trường JWT_SECRET
 * - Nếu hợp lệ: gán payload tối thiểu vào req.user và next()
 * - Nếu không: trả về 401 Unauthorized
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers["authorization"] || req.headers["Authorization"];
    if (!header || Array.isArray(header)) {
      return res.status(401).json({ message: "Missing Authorization header" });
    }

    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Invalid Authorization format" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      // Misconfiguration – surface as 500 rather than 401
      return res.status(500).json({ message: "JWT secret not configured" });
    }

    const decoded = jwt.verify(token, secret) as JwtPayload | string;
    const payload = typeof decoded === "string" ? (JSON.parse(decoded) as JwtPayload) : decoded;

    // Map to a compact user shape for downstream handlers
    const user: AuthUser = {
      id: Number(payload.sub),
      username: String((payload as any).username ?? ""),
      role: String((payload as any).role ?? ""),
    };

    if (!Number.isFinite(user.id)) {
      return res.status(401).json({ message: "Invalid token subject" });
    }

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export default authMiddleware;

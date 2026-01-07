import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger/swagger.json";
import { RegisterRoutes } from "./routes/routes";
import { refreshTokens } from "./services/authService";
import {
  resolvePublicDir,
} from "./utils/uploads";
// Load environment variables
const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });
//enforceLicenseOrExit();

const app = express();
const baseDir = typeof __dirname !== "undefined" ? __dirname : process.cwd();
const publicDir = resolvePublicDir(baseDir);
app.use(express.static(publicDir));
// CORS whitelist (supports dynamic env overrides)
const staticOrigins = ["https://miniweb.cloud", "http://miniweb.cloud"];
const envOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
const allowedOrigins = new Set([...staticOrigins, ...envOrigins]);

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow server-to-server or curl
      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Register TSOA routes (tạo ra /api/* theo cấu hình basePath)
RegisterRoutes(app);

// Lightweight refresh endpoint (bypass TSOA generation)
app.post("/api/auth/refresh", async (req, res) => {
  try {
    const result = await refreshTokens(req?.body?.refreshToken);
    res.json(result);
  } catch (e: any) {
    const status = typeof e?.status === "number" ? e.status : 401;
    res.status(status).json({ message: e?.message || "Invalid refresh token" });
  }
});

// Swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handling middleware (respect status set by handlers/middlewares)
app.use(
  (
    err: Error & {
      status?: number;
      code?: string;
      fields?: Record<string, unknown>;
    },
    _req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: express.NextFunction
  ) => {
    console.error(err);
    const status = typeof err?.status === "number" ? err.status : 500;
    const code = typeof err?.code === "string" ? err.code : undefined;
    const baseBody = err?.fields
      ? { message: err.message ?? "Validation error", fields: err.fields }
      : { message: err?.message ?? "Internal Server Error" };
    const body = code ? { ...baseBody, code } : baseBody;
    res.status(status).json(body);
  }
);

// Export for Vite in development mode
if (env === "development") {
  (
    global as typeof globalThis & { viteNodeApp?: express.Application }
  ).viteNodeApp = app;
} else {
  // Start the server
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running in ${env} mode on port ${port}`);
  });
}

export const viteNodeApp = app;

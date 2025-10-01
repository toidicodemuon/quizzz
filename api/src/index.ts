import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger/swagger.json";
import { RegisterRoutes } from "./routes/routes";
//import { authMiddleware } from "./middlewares/authMiddleware";
//import { loginHandler } from "./handlers/auth";

// Load environment variables
const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      "http://192.168.1.3:5173",
      "http://192.168.1.8:5173",
      "http://192.168.1.11:5173",
      "http://192.168.1.15:5173",
      "http://192.168.1.18:5173",
      "http://192.168.1.19:5173",
      "http://192.168.1.21:5173",
      "http://192.168.1.23:5173",
      "http://192.168.1.24:5173",
      "http://192.168.1.25:5173",
      "http://192.168.1.30:5173",
      "http://localhost:5173",
    ],
  })
);

// Public auth route (không qua TSOA để có path /auth/login)
// app.post("/auth/login", (req, res, next) => {
//   loginHandler(req, res).catch(next);
// });

// Bảo vệ các route /api/quiz bằng JWT middleware
//app.use("/api/quiz", authMiddleware);

// Register TSOA routes (tạo ra /api/* theo cấu hình basePath)
RegisterRoutes(app);

// Swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handling middleware (respect status set by handlers/middlewares)
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: express.NextFunction
  ) => {
    console.error(err);
    const status = typeof err?.status === "number" ? err.status : 500;
    const body = err?.fields
      ? { message: err.message ?? "Validation error", fields: err.fields }
      : { message: err?.message ?? "Internal Server Error" };
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

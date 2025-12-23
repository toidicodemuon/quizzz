import crypto from "crypto";
import fs from "fs";
import http from "http";
import path from "path";
import { DEFAULT_FINGERPRINT_KEYS } from "./fingerprint.mjs";

const args = process.argv.slice(2);

function getArg(flag, fallback) {
  const index = args.indexOf(flag);
  if (index >= 0 && args[index + 1]) return args[index + 1];
  return fallback;
}

function resolvePath(rawPath) {
  return path.isAbsolute(rawPath)
    ? rawPath
    : path.resolve(process.cwd(), rawPath);
}

function parseKeys(raw) {
  if (!raw) return [];
  return String(raw)
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean);
}

function buildPayload({
  product,
  fingerprint,
  fingerprintKeys,
  machineId,
  issuedAt,
  expiresAt,
}) {
  const expiresValue = expiresAt ? String(expiresAt) : "";
  return [
    `product=${product}`,
    `fingerprint=${fingerprint || ""}`,
    `fingerprintKeys=${(fingerprintKeys || []).join(",")}`,
    `machineId=${machineId || ""}`,
    `issuedAt=${issuedAt}`,
    `expiresAt=${expiresValue}`,
  ].join("\n");
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function sendJson(res, statusCode, payload) {
  const data = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "content-type": "application/json",
    "content-length": Buffer.byteLength(data),
  });
  res.end(data);
}

const host = getArg("--host", process.env.LICENSE_SERVER_HOST || "0.0.0.0");
const port = Number(getArg("--port", process.env.LICENSE_SERVER_PORT || "8787"));
const token =
  getArg("--token", process.env.LICENSE_ACTIVATION_TOKEN || "") || "";
const productDefault = getArg(
  "--product",
  process.env.LICENSE_PRODUCT || "quizzz"
);
const expiresDefault = getArg(
  "--expires-at",
  process.env.LICENSE_EXPIRES_AT || ""
);
const privateKeyPath = resolvePath(
  getArg("--private-key", process.env.LICENSE_PRIVATE_KEY_PATH || "license/private.pem")
);

if (!fs.existsSync(privateKeyPath)) {
  console.error(`Private key not found: ${privateKeyPath}`);
  process.exit(1);
}

const privateKey = fs.readFileSync(privateKeyPath, "utf8");

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  if (req.method === "GET" && url.pathname === "/health") {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method !== "POST" || url.pathname !== "/activate") {
    return sendJson(res, 404, { error: "not_found" });
  }

  if (token) {
    const headerToken = req.headers["x-activation-token"];
    const bearer = req.headers.authorization;
    const bearerToken = bearer?.startsWith("Bearer ")
      ? bearer.slice("Bearer ".length)
      : "";
    if (headerToken !== token && bearerToken !== token) {
      return sendJson(res, 401, { error: "unauthorized" });
    }
  }

  let body;
  try {
    body = await readBody(req);
  } catch (err) {
    return sendJson(res, 413, { error: "request_too_large" });
  }

  let payload;
  try {
    payload = JSON.parse(body || "{}");
  } catch {
    return sendJson(res, 400, { error: "invalid_json" });
  }

  const fingerprint = payload.fingerprint;
  if (!fingerprint) {
    return sendJson(res, 400, { error: "fingerprint_required" });
  }

  const rawKeyList = Array.isArray(payload.fingerprintKeys)
    ? payload.fingerprintKeys
    : parseKeys(payload.fingerprintKeys);
  const keyList = rawKeyList.length ? rawKeyList : DEFAULT_FINGERPRINT_KEYS;
  const fingerprintKeys = Array.from(
    new Set(keyList.map((key) => String(key).trim()).filter(Boolean))
  ).sort();

  const product = payload.product || productDefault;
  const machineId = payload.machineId || "";
  const issuedAt = new Date().toISOString();
  const expiresAt = payload.expiresAt || expiresDefault || "";

  const signPayload = buildPayload({
    product,
    fingerprint,
    fingerprintKeys,
    machineId,
    issuedAt,
    expiresAt,
  });

  const signature = crypto
    .sign("sha256", Buffer.from(signPayload, "utf8"), privateKey)
    .toString("base64");

  const license = {
    product,
    fingerprint,
    fingerprintKeys,
    ...(machineId ? { machineId } : {}),
    issuedAt,
    ...(expiresAt ? { expiresAt } : {}),
    signature,
  };

  return sendJson(res, 200, license);
});

server.listen(port, host, () => {
  console.log(`[license-server] listening on http://${host}:${port}`);
});

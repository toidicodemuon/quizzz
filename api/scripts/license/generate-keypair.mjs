import crypto from "crypto";
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
const outDirArgIndex = args.indexOf("--out-dir");
const outDir =
  outDirArgIndex >= 0 && args[outDirArgIndex + 1]
    ? args[outDirArgIndex + 1]
    : "license";
const force = args.includes("--force");

const resolvedDir = path.resolve(process.cwd(), outDir);
fs.mkdirSync(resolvedDir, { recursive: true });

const privatePath = path.join(resolvedDir, "private.pem");
const publicPath = path.join(resolvedDir, "public.pem");

if (!force && (fs.existsSync(privatePath) || fs.existsSync(publicPath))) {
  console.error(
    "Key files already exist. Use --force to overwrite existing keys."
  );
  process.exit(1);
}

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

fs.writeFileSync(privatePath, privateKey, "utf8");
fs.writeFileSync(publicPath, publicKey, "utf8");

console.log(`Private key: ${privatePath}`);
console.log(`Public key:  ${publicPath}`);

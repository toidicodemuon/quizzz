import crypto from "crypto";
import fs from "fs";
import path from "path";
import multer from "multer";
import { extractImageSources } from "./richText";

export const UPLOAD_SUBDIR = path.join("uploads", "questions");
export const UPLOAD_URL_PREFIX = "/uploads/questions";
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export const ALLOWED_IMAGE_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function resolvePublicDir(baseDir: string = __dirname): string {
  const candidates = [
    path.join(baseDir, "public"),
    path.join(baseDir, "..", "public"),
    path.join(baseDir, "..", "..", "public"),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  const fallback = candidates[candidates.length - 1];
  fs.mkdirSync(fallback, { recursive: true });
  return fallback;
}

export function ensureUploadDir(baseDir: string = __dirname): string {
  const publicDir = resolvePublicDir(baseDir);
  const uploadDir = path.join(publicDir, UPLOAD_SUBDIR);
  fs.mkdirSync(uploadDir, { recursive: true });
  return uploadDir;
}

export function makeImageFilename(ext: string): string {
  const stamp = Date.now();
  const rand = crypto.randomBytes(6).toString("hex");
  return `${stamp}-${rand}.${ext}`;
}

export function getPublicImageUrl(filename: string): string {
  return `${UPLOAD_URL_PREFIX}/${filename}`;
}

const uploadDir = ensureUploadDir();
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const ext = ALLOWED_IMAGE_MIME[file.mimetype];
      const name = ext ? makeImageFilename(ext) : makeImageFilename("img");
      cb(null, name);
    },
  }),
  limits: { fileSize: MAX_IMAGE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_IMAGE_MIME[file.mimetype]) {
      const err: any = new Error("Unsupported file type");
      err.status = 400;
      return cb(err);
    }
    return cb(null, true);
  },
});

export const handleImageUpload = upload.single("file");

export function resolveLocalUploadPath(
  src: string,
  publicDir: string
): string | null {
  if (!src || !src.startsWith("/uploads/")) return null;
  const clean = src.split("?")[0].split("#")[0];
  const full = path.resolve(publicDir, "." + clean);
  const uploadRoot = path.resolve(publicDir, UPLOAD_SUBDIR);
  if (!full.startsWith(uploadRoot + path.sep) && full !== uploadRoot) {
    return null;
  }
  return full;
}

export async function removeLocalImages(
  htmlBlocks: Array<string | null | undefined>,
  baseDir: string = __dirname
): Promise<void> {
  const publicDir = resolvePublicDir(baseDir);
  const paths = new Set<string>();
  for (const html of htmlBlocks) {
    for (const src of extractImageSources(html)) {
      const full = resolveLocalUploadPath(src, publicDir);
      if (full) paths.add(full);
    }
  }
  await Promise.all(
    Array.from(paths).map(async (filePath) => {
      try {
        await fs.promises.unlink(filePath);
      } catch {
        // ignore missing files
      }
    })
  );
}

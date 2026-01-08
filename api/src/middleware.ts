
import { Request, Response, NextFunction } from 'express';
import { handleImageUpload } from './utils/uploads';

export const multerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  handleImageUpload(req, res, (err: any): void => {
    if (err) {
      const status =
        typeof err?.status === "number"
          ? err.status
          : err?.code === "LIMIT_FILE_SIZE"
          ? 413
          : 400;
      res.status(status).json({ message: err.message || "Upload failed" });
      return;
    }
    return next();
  });
};


import {
  Controller,
  Post,
  Route,
  Tags,
  Security,
  UploadedFile,
  Response,
  Middleware,
  Consumes
} from "tsoa";
import { getPublicImageUrl } from "../utils/uploads";
import { multerMiddleware } from "../middleware";

@Route("uploads")
@Tags("Uploads")
export class UploadsController extends Controller {
  @Post("images")
  @Consumes("multipart/form-data")
  @Middleware(multerMiddleware)
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  @Response(400, "Bad Request")
  @Response(401, "Unauthorized")
  @Response(413, "File too large")
  public async uploadImage(
    @UploadedFile("file")
    file: Express.Multer.File
  ): Promise<{ url: string; size: number; mime: string }> {
    if (!file) {
      throw Object.assign(new Error("Missing file"), { status: 400 });
    }

    this.setStatus(200);
    return {
      url: getPublicImageUrl(file.filename),
      size: file.size,
      mime: file.mimetype,
    };
  }
}

import { prisma } from "../utils/prisma";
import { Body, Controller, Get, Put, Request, Response, Route, Security, Tags } from "tsoa";

type MeResponse = {
  id: number;
  fullName: string | null;
  email: string | null;
  role: string;
  userCode: string | null;
  subjectId: number | null;
  createdAt: Date;
  updatedAt: Date;
};

@Route("me")
@Tags("Me")
export class MeController extends Controller {
  private static readonly select = {
    id: true,
    fullName: true,
    email: true,
    role: true,
    userCode: true,
    subjectId: true,
    createdAt: true,
    updatedAt: true,
  } as const;

  @Get("/")
  @Security("bearerAuth")
  @Response<null>(401, "Unauthorized")
  public async get(@Request() req: any): Promise<MeResponse> {
    const userId = Number(req?.user?.id ?? req?.user?.sub ?? req?.user?.userId);
    if (!Number.isFinite(userId)) {
      const err: any = new Error("Unauthorized");
      err.status = 401;
      throw err;
    }
    const user = await prisma.user.findUnique({ where: { id: userId }, select: MeController.select });
    if (!user) {
      const err: any = new Error("Unauthorized");
      err.status = 401;
      throw err;
    }
    return user as MeResponse;
  }

  @Put("/")
  @Security("bearerAuth")
  @Response<null>(401, "Unauthorized")
  public async update(
    @Request() req: any,
    @Body() body: { fullName?: string | null; email?: string | null; password?: string }
  ): Promise<MeResponse> {
    const userId = Number(req?.user?.id ?? req?.user?.sub ?? req?.user?.userId);
    if (!Number.isFinite(userId)) {
      const err: any = new Error("Unauthorized");
      err.status = 401;
      throw err;
    }
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      const err: any = new Error("Unauthorized");
      err.status = 401;
      throw err;
    }
    const data: any = {};
    if (typeof body.fullName !== "undefined") data.fullName = body.fullName;
    if (typeof body.email !== "undefined") data.email = body.email;
    if (typeof body.password !== "undefined" && String(body.password).length > 0) {
      const bcrypt = await import("bcryptjs");
      data.password = await bcrypt.hash(body.password, 10);
    }
    try {
      const updated = await prisma.user.update({ where: { id: userId }, data, select: MeController.select });
      return updated as MeResponse;
    } catch (e: any) {
      if (e?.code === "P2002") {
        const err: any = new Error("Email hoặc mã số đã tồn tại");
        err.status = 400;
        throw err;
      }
      throw e;
    }
  }
}

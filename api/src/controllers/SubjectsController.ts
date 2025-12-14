import { Body, Controller, Delete, Get, Path, Post, Put, Route, Tags, Response, Security } from "tsoa";
import { prisma } from "../utils/prisma";

export type SubjectDto = { id: number; name: string; code: string | null };

@Route("subjects")
@Tags("Subject")
export class SubjectsController extends Controller {
  @Get("/")
  @Response<null>(401, "Unauthorized")
  @Security("bearerAuth")
  public async list(): Promise<{ items: SubjectDto[]; total: number }> {
    const [items, total] = await Promise.all([
      prisma.subject.findMany({
        select: { id: true, name: true, code: true },
        orderBy: { id: "asc" }, // default sort by ID
      }),
      prisma.subject.count(),
    ]);
    return { items, total };
  }

  @Post("/")
  @Response<null>(400, "Bad Request")
  @Response<null>(401, "Unauthorized")
  @Security("bearerAuth", ["ADMIN", "TEACHER"]) // allow teacher to manage
  public async create(
    @Body() body: { name: string; code?: string | null }
  ): Promise<SubjectDto> {
    const name = (body?.name || "").trim();
    if (!name) {
      this.setStatus(400);
      throw new Error("name is required");
    }
    const s = await prisma.subject.create({ data: { name, code: body?.code ?? null }, select: { id: true, name: true, code: true } });
    return s;
  }

  @Put("/{id}")
  @Response<null>(400, "Bad Request")
  @Response<null>(401, "Unauthorized")
  @Response<null>(404, "Not Found")
  @Security("bearerAuth", ["ADMIN", "TEACHER"]) // allow teacher to manage
  public async update(
    @Path() id: number,
    @Body() body: { name?: string; code?: string | null }
  ): Promise<SubjectDto | null> {
    const existing = await prisma.subject.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      this.setStatus(404);
      return null;
    }
    const data: any = {};
    if (typeof body?.name !== "undefined") {
      const name = String(body.name).trim();
      if (!name) {
        this.setStatus(400);
        throw new Error("name cannot be empty");
      }
      data.name = name;
    }
    if (typeof body?.code !== "undefined") data.code = body.code;
    return prisma.subject.update({ where: { id }, data, select: { id: true, name: true, code: true } });
  }

  @Delete("/{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(404, "Not Found")
  @Security("bearerAuth", ["ADMIN", "TEACHER"]) // allow teacher to manage
  public async remove(@Path() id: number): Promise<{ id: number; message: string } | null> {
    const existing = await prisma.subject.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      this.setStatus(404);
      return null;
    }
    const linked = await prisma.question.count({ where: { subjectId: id } });
    if (linked > 0) {
      this.setStatus(400);
      throw new Error("Cannot delete subject with linked questions");
    }
    await prisma.subject.delete({ where: { id } });
    return { id, message: "Subject deleted" };
  }
}

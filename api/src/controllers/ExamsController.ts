// Subject is now a table
import { prisma } from "../utils/prisma";
import { Controller, Get, Route, Tags, Response, Security, Post, Body, Request, Put, Delete, Path, Query, Example } from "tsoa";
import { Request as ExRequest } from "express";

export type ExamSummary = {
  id: number;
  title: string;
  description: string | null;
  authorId: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export class AddExamRequest {
  @Example<string>("Bài thi CNTT Cơ bản")
  public title!: string;

  @Example<string>("Kiểm tra các kỹ năng tin học cơ bản")
  public description!: string | null;
}

@Route("exams")
@Tags("Exams")
export class ExamsController extends Controller {
  @Get("/")
  @Response<null>(401, "Unauthorized")
  @Security("bearerAuth")
  public async list(
    @Query() page?: number,
    @Query() pageSize?: number,
    @Query() subjectId?: number,
    @Query() authorId?: number
  ): Promise<{ items: ExamSummary[]; total: number }> {
    const take = Math.max(1, Math.min(100, Number(pageSize) || 50));
    const skip = Math.max(0, ((Number(page) || 1) - 1) * take);
    const where: any = {};
    // subjectId is ignored (Exam has no subject link)
    if (typeof authorId === "number") where.authorId = authorId;
    const [items, total] = await Promise.all([
      prisma.exam.findMany({ where, select: { id: true, title: true, description: true, authorId: true, createdAt: true, updatedAt: true }, orderBy: { createdAt: "desc" }, skip, take }),
      prisma.exam.count({ where }),
    ]);
    return { items, total };
  }

  @Get("/{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(404, "Exam not found")
  @Security("bearerAuth")
  public async get(@Path() id: number): Promise<ExamSummary | null> {
    const exam = await prisma.exam.findUnique({ where: { id }, select: { id: true, title: true, description: true, authorId: true, createdAt: true, updatedAt: true } });
    if (!exam) {
      const err: any = new Error("Exam not found");
      err.status = 404;
      throw err;
    }
    return exam;
  }

  @Post("/")
  @Response<null>(400, "Bad Request")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["TEACHER"]) 
  public async create(@Request() req: ExRequest, @Body() body: AddExamRequest): Promise<ExamSummary> {
    const user = (req as any).user as { id: number; role: string };
    return prisma.exam.create({ data: { title: body.title, description: body.description, authorId: user.id }, select: { id: true, title: true, description: true, authorId: true, createdAt: true, updatedAt: true } });
  }

  @Put("/{id}")
  @Response<null>(400, "Bad Request")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Exam not found")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async update(
    @Request() req: ExRequest,
    @Path() id: number,
    @Body() body: { title?: string; description?: string | null }
  ): Promise<ExamSummary | null> {
    const user = (req as any).user as { id: number; role: string };
    const existing = await prisma.exam.findUnique({ where: { id }, select: { id: true, authorId: true } });
    if (!existing) {
      const err: any = new Error("Exam not found");
      err.status = 404;
      throw err;
    }
    if (user.role?.toUpperCase() === "TEACHER" && existing.authorId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }
    const data: any = {};
    if (typeof body.title !== "undefined") data.title = body.title;
    if (typeof body.description !== "undefined") data.description = body.description;
    return prisma.exam.update({
      where: { id },
      data,
      select: { id: true, title: true, description: true, authorId: true, createdAt: true, updatedAt: true },
    });
  }

  @Delete("/{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Exam not found")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async remove(@Request() req: ExRequest, @Path() id: number): Promise<{ message: string; id: number } | null> {
    const user = (req as any).user as { id: number; role: string };
    const existing = await prisma.exam.findUnique({ where: { id }, select: { id: true, authorId: true } });
    if (!existing) {
      const err: any = new Error("Exam not found");
      err.status = 404;
      throw err;
    }
    if (user.role?.toUpperCase() === "TEACHER" && existing.authorId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }
    await prisma.exam.delete({ where: { id } });
    return { message: "Exam deleted", id };
  }
}

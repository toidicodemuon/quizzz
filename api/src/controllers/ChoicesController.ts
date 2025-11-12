import { prisma } from "../utils/prisma";
import { Body, Controller, Delete, Get, Path, Post, Put, Query, Request, Response, Route, Security, Tags } from "tsoa";
import { Request as ExRequest } from "express";

// Choice management for questions

@Route("choices")
@Tags("Choice")
export class ChoiceController extends Controller {
  @Get("/")
  @Response<null>(401, "Unauthorized")
  @Security("bearerAuth")
  public async listAnswers(
    @Request() req: ExRequest,
    @Query() questionId?: number,
    @Query() page?: number,
    @Query() pageSize?: number
  ): Promise<{ items: Array<{ id: number; content: string; isCorrect?: boolean; order: number; questionId: number }>; total: number }> {
    const role = ((req as any).user?.role ?? "").toUpperCase();
    const take = Math.max(1, Math.min(100, Number(pageSize) || 50));
    const skip = Math.max(0, ((Number(page) || 1) - 1) * take);
    const where = typeof questionId === "number" ? { questionId } : undefined;
    const [rawItems, total] = await Promise.all([
      prisma.choice.findMany({
        where,
        select: { id: true, content: true, isCorrect: true, order: true, questionId: true },
        orderBy: { order: "asc" },
        skip,
        take,
      }),
      prisma.choice.count({ where }),
    ]);
    const items =
      role === "STUDENT"
        ? (rawItems.map(({ isCorrect, ...rest }) => rest) as any)
        : (rawItems as any);
    return { items, total } as any;
  }

  @Get("{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(404, "Choice not found")
  @Security("bearerAuth")
  public async getAnswerById(
    @Request() req: ExRequest,
    @Path() id: number
  ): Promise<{ id: number; content: string; isCorrect?: boolean; order: number; questionId: number } | null> {
    const role = ((req as any).user?.role ?? "").toUpperCase();
    const a = await prisma.choice.findUnique({
      where: { id },
      select: { id: true, content: true, isCorrect: true, order: true, questionId: true },
    });
    if (!a) {
      const err: any = new Error("Choice not found");
      err.status = 404;
      throw err;
    }
    if (role === "STUDENT") {
      const { isCorrect, ...rest } = a;
      return rest as any;
    }
    return a as any;
  }

  @Post("/")
  @Response<null>(400, "Bad Request")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async createAnswer(
    @Request() req: ExRequest,
    @Body() body: { questionId: number; content: string; isCorrect?: boolean; order?: number }
  ): Promise<{ id: number; content: string; isCorrect: boolean; order: number; questionId: number }> {
    const user = (req as any).user as { id: number; role: string };
    const question = await prisma.question.findUnique({ where: { id: body.questionId }, select: { id: true, authorId: true } });
    if (!question) {
      this.setStatus(400);
      throw new Error("Invalid questionId");
    }
    if (user.role?.toUpperCase() === "TEACHER" && question.authorId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    // Disallow creating a choice if the question is in a published exam that already has attempts
    const linkedPublished = await prisma.examQuestion.findFirst({ where: { questionId: body.questionId, exam: { status: 'PUBLISHED' as any, attempts: { some: {} } } }, select: { examId: true } });
    if (linkedPublished) {
      const err: any = new Error("Cannot modify choices for question used in a published exam");
      err.status = 409;
      throw err;
    }

    return prisma.choice.create({
      data: {
        questionId: body.questionId,
        content: body.content,
        order: typeof body.order === "number" ? body.order : 0,
        isCorrect: !!body.isCorrect,
      },
      select: { id: true, content: true, isCorrect: true, order: true, questionId: true },
    });
  }

  @Put("{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Choice not found")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async updateAnswer(
    @Request() req: ExRequest,
    @Path() id: number,
    @Body() body: { content?: string; isCorrect?: boolean; order?: number }
  ): Promise<{ id: number; content: string; isCorrect: boolean; order: number; questionId: number } | null> {
    const user = (req as any).user as { id: number; role: string };
    const existing = await prisma.choice.findUnique({
      where: { id },
      select: {
        id: true,
        question: { select: { authorId: true } },
        questionId: true,
      },
    });
    if (!existing) {
      const err: any = new Error("Choice not found");
      err.status = 404;
      throw err;
    }
    if (user.role?.toUpperCase() === "TEACHER" && existing.question.authorId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    // Disallow updating a choice if its question is in a published exam that already has attempts
    const linkedPublished = await prisma.examQuestion.findFirst({ where: { questionId: existing.questionId, exam: { status: 'PUBLISHED' as any, attempts: { some: {} } } }, select: { examId: true } });
    if (linkedPublished) {
      const err: any = new Error("Cannot modify choices for question used in a published exam");
      err.status = 409;
      throw err;
    }

    const data: any = {};
    if (typeof body.content !== "undefined") data.content = body.content;
    if (typeof body.order !== "undefined") data.order = body.order;
    if (typeof body.isCorrect !== "undefined") data.isCorrect = body.isCorrect;

    return prisma.choice.update({
      where: { id },
      data,
      select: { id: true, content: true, isCorrect: true, order: true, questionId: true },
    });
  }

  @Delete("{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Choice not found")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async deleteAnswer(
    @Request() req: ExRequest,
    @Path() id: number
  ): Promise<{ message: string; id: number } | null> {
    const user = (req as any).user as { id: number; role: string };
    const existing = await prisma.choice.findUnique({ where: { id }, select: { id: true, question: { select: { authorId: true, id: true } } } });
    if (!existing) {
      const err: any = new Error("Choice not found");
      err.status = 404;
      throw err;
    }
    if (user.role?.toUpperCase() === "TEACHER" && existing.question.authorId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    // Disallow deleting a choice if its question is in a published exam that already has attempts
    const linkedPublished = await prisma.examQuestion.findFirst({ where: { questionId: (existing as any).question.id, exam: { status: 'PUBLISHED' as any, attempts: { some: {} } } }, select: { examId: true } });
    if (linkedPublished) {
      const err: any = new Error("Cannot modify choices for question used in a published exam");
      err.status = 409;
      throw err;
    }

    await prisma.choice.delete({ where: { id } });
    return { message: "Choice deleted", id };
  }
}

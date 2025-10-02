import { prisma } from "../utils/prisma";
import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Query,
  Request,
  Response,
  Route,
  Security,
  Tags,
} from "tsoa";
import { Request as ExRequest } from "express";

// shared prisma instance

@Route("answers")
@Tags("Answer")
export class AnswerController extends Controller {
  @Get("/")
  @Response<null>(401, "Unauthorized")
  @Security("bearerAuth")
  public async listAnswers(
    @Request() req: ExRequest,
    @Query() questionId?: number,
    @Query() page?: number,
    @Query() pageSize?: number
  ): Promise<{ items: Array<{ id: number; answerText: string; isCorrect?: boolean; questionId: number }>; total: number }> {
    const role = ((req as any).user?.role ?? "").toUpperCase();
    const take = Math.max(1, Math.min(100, Number(pageSize) || 50));
    const skip = Math.max(0, ((Number(page) || 1) - 1) * take);
    const where = typeof questionId === "number" ? { questionId } : undefined;
    const [rawItems, total] = await Promise.all([
      prisma.answer.findMany({
        where,
        select: { id: true, answerText: true, isCorrect: true, questionId: true },
        orderBy: { id: "asc" },
        skip,
        take,
      }),
      prisma.answer.count({ where }),
    ]);
    const items =
      role === "STUDENT"
        ? (rawItems.map(({ isCorrect, ...rest }) => rest) as any)
        : (rawItems as any);
    return { items, total } as any;
  }

  @Get("{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(404, "Answer not found")
  @Security("bearerAuth")
  public async getAnswerById(
    @Request() req: ExRequest,
    @Path() id: number
  ): Promise<{ id: number; answerText: string; isCorrect?: boolean; questionId: number } | null> {
    const role = ((req as any).user?.role ?? "").toUpperCase();
    const a = await prisma.answer.findUnique({
      where: { id },
      select: { id: true, answerText: true, isCorrect: true, questionId: true },
    });
    if (!a) {
      const err: any = new Error("Answer not found");
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
    @Body() body: { questionId: number; answerText: string; isCorrect?: boolean }
  ): Promise<{ id: number; answerText: string; isCorrect: boolean; questionId: number }> {
    const user = (req as any).user as { id: number; role: string };
    const question = await prisma.question.findUnique({
      where: { id: body.questionId },
      select: { id: true, quiz: { select: { teacherId: true } } },
    });
    if (!question) {
      this.setStatus(400);
      throw new Error("Invalid questionId");
    }
    if (
      user.role?.toUpperCase() === "TEACHER" &&
      question.quiz.teacherId !== user.id
    ) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    return prisma.answer.create({
      data: {
        questionId: body.questionId,
        answerText: body.answerText,
        isCorrect: !!body.isCorrect,
      },
      select: { id: true, answerText: true, isCorrect: true, questionId: true },
    });
  }

  @Put("{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Answer not found")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async updateAnswer(
    @Request() req: ExRequest,
    @Path() id: number,
    @Body() body: { answerText?: string; isCorrect?: boolean }
  ): Promise<{ id: number; answerText: string; isCorrect: boolean; questionId: number } | null> {
    const user = (req as any).user as { id: number; role: string };
    const existing = await prisma.answer.findUnique({
      where: { id },
      select: {
        id: true,
        question: { select: { quiz: { select: { teacherId: true } } } },
        questionId: true,
      },
    });
    if (!existing) {
      const err: any = new Error("Answer not found");
      err.status = 404;
      throw err;
    }
    if (
      user.role?.toUpperCase() === "TEACHER" &&
      existing.question.quiz.teacherId !== user.id
    ) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    const data: any = {};
    if (typeof body.answerText !== "undefined") data.answerText = body.answerText;
    if (typeof body.isCorrect !== "undefined") data.isCorrect = body.isCorrect;

    return prisma.answer.update({
      where: { id },
      data,
      select: { id: true, answerText: true, isCorrect: true, questionId: true },
    });
  }

  @Delete("{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Answer not found")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async deleteAnswer(
    @Request() req: ExRequest,
    @Path() id: number
  ): Promise<{ message: string; id: number } | null> {
    const user = (req as any).user as { id: number; role: string };
    const existing = await prisma.answer.findUnique({
      where: { id },
      select: { id: true, question: { select: { quiz: { select: { teacherId: true } } } } },
    });
    if (!existing) {
      const err: any = new Error("Answer not found");
      err.status = 404;
      throw err;
    }
    if (
      user.role?.toUpperCase() === "TEACHER" &&
      existing.question.quiz.teacherId !== user.id
    ) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    await prisma.answer.delete({ where: { id } });
    return { message: "Answer deleted", id };
  }
}

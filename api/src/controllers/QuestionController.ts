import { prisma } from "../utils/prisma";
import { Body, Controller, Delete, Get, Path, Post, Put, Request, Response, Route, Security, Tags, Query } from "tsoa";
import { Request as ExRequest } from "express";

// shared prisma instance

@Route("questions")
@Tags("Question")
export class QuestionController extends Controller {
  @Get("/")
  @Response<null>(401, "Unauthorized")
  @Security("bearerAuth")
  public async listQuestions(
    @Query() quizId?: number,
    @Query() page?: number,
    @Query() pageSize?: number
  ): Promise<Array<{ id: number; questionText: string; explanation: string | null; quizId: number }>> {
    const take = Math.max(1, Math.min(100, Number(pageSize) || 50));
    const skip = Math.max(0, ((Number(page) || 1) - 1) * take);
    return prisma.question.findMany({
      where: typeof quizId === "number" ? { quizId } : undefined,
      select: {
        id: true,
        questionText: true,
        explanation: true,
        quizId: true,
      },
      orderBy: { id: "asc" },
      skip,
      take,
    });
  }

  @Get("{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(404, "Question not found")
  @Security("bearerAuth")
  public async getQuestionById(
    @Path() id: number
  ): Promise<
    | (typeof prisma.question extends any
        ? { id: number; questionText: string; explanation: string | null; quizId: number }
        : any)
    | null
  > {
    const q = await prisma.question.findUnique({
      where: { id },
      select: { id: true, questionText: true, explanation: true, quizId: true },
    });
    if (!q) {
      const err: any = new Error("Question not found");
      err.status = 404;
      throw err;
    }
    return q;
  }

  @Post("/")
  @Response<null>(400, "Bad Request")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async createQuestion(
    @Request() req: ExRequest,
    @Body()
    body: { quizId: number; questionText: string; explanation?: string | null }
  ): Promise<{ id: number; questionText: string; explanation: string | null; quizId: number }> {
    const user = (req as any).user as { id: number; role: string };
    const quiz = await prisma.quiz.findUnique({
      where: { id: body.quizId },
      select: { id: true, teacherId: true },
    });
    if (!quiz) {
      this.setStatus(400);
      throw new Error("Invalid quizId");
    }
    if (user.role?.toUpperCase() === "TEACHER" && quiz.teacherId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    return prisma.question.create({
      data: {
        quizId: body.quizId,
        questionText: body.questionText,
        explanation: typeof body.explanation === "undefined" ? null : body.explanation,
      },
      select: { id: true, questionText: true, explanation: true, quizId: true },
    });
  }

  @Put("{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Question not found")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async updateQuestion(
    @Request() req: ExRequest,
    @Path() id: number,
    @Body() body: { questionText?: string; explanation?: string | null }
  ): Promise<{ id: number; questionText: string; explanation: string | null; quizId: number } | null> {
    const user = (req as any).user as { id: number; role: string };
    const existing = await prisma.question.findUnique({
      where: { id },
      select: { id: true, quiz: { select: { teacherId: true } }, quizId: true },
    });
    if (!existing) {
      this.setStatus(404);
      return null;
    }
    if (
      user.role?.toUpperCase() === "TEACHER" &&
      existing.quiz.teacherId !== user.id
    ) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    const data: any = {};
    if (typeof body.questionText !== "undefined") data.questionText = body.questionText;
    if (typeof body.explanation !== "undefined") data.explanation = body.explanation;

    return prisma.question.update({
      where: { id },
      data,
      select: { id: true, questionText: true, explanation: true, quizId: true },
    });
  }

  @Delete("{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Question not found")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async deleteQuestion(
    @Request() req: ExRequest,
    @Path() id: number
  ): Promise<{ message: string; id: number } | null> {
    const user = (req as any).user as { id: number; role: string };
    const existing = await prisma.question.findUnique({
      where: { id },
      select: { id: true, quiz: { select: { teacherId: true } } },
    });
    if (!existing) {
      this.setStatus(404);
      return null;
    }
    if (
      user.role?.toUpperCase() === "TEACHER" &&
      existing.quiz.teacherId !== user.id
    ) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    await prisma.question.delete({ where: { id } });
    return { message: "Question deleted", id };
  }
}

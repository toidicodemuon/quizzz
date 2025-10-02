import { PrismaClient } from "@prisma/client";
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

const prisma = new PrismaClient();

@Route("answers")
@Tags("Answer")
export class AnswerController extends Controller {
  @Get("/")
  @Response<null>(401, "Unauthorized")
  @Security("bearerAuth")
  public async listAnswers(
    @Query() questionId?: number
  ): Promise<Array<{ id: number; answerText: string; isCorrect: boolean; questionId: number }>> {
    return prisma.answer.findMany({
      where: typeof questionId === "number" ? { questionId } : undefined,
      select: { id: true, answerText: true, isCorrect: true, questionId: true },
      orderBy: { id: "asc" },
    });
  }

  @Get("{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(404, "Answer not found")
  @Security("bearerAuth")
  public async getAnswerById(
    @Path() id: number
  ): Promise<{ id: number; answerText: string; isCorrect: boolean; questionId: number } | null> {
    const a = await prisma.answer.findUnique({
      where: { id },
      select: { id: true, answerText: true, isCorrect: true, questionId: true },
    });
    if (!a) {
      this.setStatus(404);
      return null;
    }
    return a;
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
      this.setStatus(403);
      return null as any;
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
      this.setStatus(404);
      return null;
    }
    if (
      user.role?.toUpperCase() === "TEACHER" &&
      existing.question.quiz.teacherId !== user.id
    ) {
      this.setStatus(403);
      return null;
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
      this.setStatus(404);
      return null;
    }
    if (
      user.role?.toUpperCase() === "TEACHER" &&
      existing.question.quiz.teacherId !== user.id
    ) {
      this.setStatus(403);
      return null;
    }

    await prisma.answer.delete({ where: { id } });
    return { message: "Answer deleted", id };
  }
}


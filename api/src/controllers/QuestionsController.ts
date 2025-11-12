import { prisma } from "../utils/prisma";
import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Request,
  Response,
  Route,
  Security,
  Tags,
  Query,
} from "tsoa";
import { QuestionType } from "@prisma/client";
import { Request as ExRequest } from "express";

@Route("questions")
@Tags("Question")
export class QuestionController extends Controller {
  @Get("/")
  @Response<null>(401, "Unauthorized")
  @Security("bearerAuth")
  public async listQuestions(
    @Query() examId?: number,
    @Query() page?: number,
    @Query() pageSize?: number,
    @Query() subjectId?: number,
    @Query() sort?: "asc" | "desc"
  ): Promise<{
    items: Array<{
      id: number;
      text: string;
      explanation: string | null;
      locked?: boolean;
    }>;
    total: number;
  }> {
    const take = Math.max(1, Math.min(100, Number(pageSize) || 50));
    const skip = Math.max(0, ((Number(page) || 1) - 1) * take);
    const order = sort === "asc" ? "asc" : "desc";
    if (typeof examId === "number") {
      const [items, total] = await Promise.all([
        prisma.question
          .findMany({
            where: {
              examLinks: { some: { examId } },
              ...(typeof subjectId === "number" ? { subjectId } : {}),
            },
            select: {
              id: true,
              text: true,
              explanation: true,
              examLinks: {
                where: {
                  exam: { status: "PUBLISHED" as any, attempts: { some: {} } },
                },
                select: { examId: true },
                take: 1,
              },
            },
            orderBy: { id: order as any },
            skip,
            take,
          })
          .then((rows) =>
            rows.map((r: any) => ({
              id: r.id,
              text: r.text,
              explanation: r.explanation,
              locked: (r.examLinks || []).length > 0,
            }))
          ),
        prisma.examQuestion.count({ where: { examId } }),
      ]);
      return { items, total };
    }
    const [items, total] = await Promise.all([
      prisma.question
        .findMany({
          select: {
            id: true,
            text: true,
            explanation: true,
            examLinks: {
              where: {
                exam: { status: "PUBLISHED" as any, attempts: { some: {} } },
              },
              select: { examId: true },
              take: 1,
            },
          },
          where: typeof subjectId === "number" ? { subjectId } : undefined,
          orderBy: { id: order as any },
          skip,
          take,
        })
        .then((rows) =>
          rows.map((r: any) => ({
            id: r.id,
            text: r.text,
            explanation: r.explanation,
            locked: (r.examLinks || []).length > 0,
          }))
        ),
      prisma.question.count({
        where: typeof subjectId === "number" ? { subjectId } : undefined,
      }),
    ]);
    return { items, total };
  }

  @Get("{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(404, "Question not found")
  @Security("bearerAuth")
  public async getQuestionById(@Path() id: number): Promise<{
    id: number;
    text: string;
    explanation: string | null;
    type?: QuestionType;
    locked?: boolean;
    choices: Array<{
      id: number;
      content: string;
      isCorrect: boolean;
      order: number;
    }>;
  } | null> {
    const q = await prisma.question.findUnique({
      where: { id },
      select: {
        id: true,
        text: true,
        explanation: true,
        choices: {
          select: { id: true, content: true, isCorrect: true, order: true },
          orderBy: { order: "asc" },
        },
        type: true,
        examLinks: {
          where: {
            exam: { status: "PUBLISHED" as any, attempts: { some: {} } },
          },
          select: { examId: true },
          take: 1,
        },
      },
    });
    if (!q) {
      const err: any = new Error("Question not found");
      err.status = 404;
      throw err;
    }
    const { examLinks, ...rest } = q as any;
    return { ...rest, locked: (examLinks || []).length > 0 } as any;
  }

  @Post("/")
  @Response<null>(400, "Bad Request")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async createQuestion(
    @Request() req: ExRequest,
    @Body()
    body: {
      examId?: number; // optional: allow creating standalone question
      text: string;
      explanation?: string | null;
      type?: QuestionType;
      subjectId: number;
      choices: Array<{ content: string; isCorrect: boolean; order?: number }>;
      points?: number; // used only when linking to exam
    }
  ): Promise<{ id: number; text: string; explanation: string | null }> {
    const user = (req as any).user as { id: number; role: string };
    let exam: { id: number; authorId: number | null } | null = null;
    if (typeof body.examId === "number") {
      exam = await prisma.exam.findUnique({
        where: { id: body.examId },
        select: { id: true, authorId: true },
      });
      if (!exam) {
        this.setStatus(400);
        throw new Error("Invalid examId");
      }
      if (user.role?.toUpperCase() === "TEACHER" && exam.authorId !== user.id) {
        const err: any = new Error("Forbidden");
        err.status = 403;
        throw err;
      }
    }
    if (!Array.isArray(body.choices) || body.choices.length === 0) {
      this.setStatus(400);
      throw new Error("choices must be a non-empty array");
    }

    const created = await prisma.question.create({
      data: {
        subjectId: body.subjectId,
        type: body.type ?? QuestionType.SC,
        text: body.text,
        explanation:
          typeof body.explanation === "undefined" ? null : body.explanation,
        authorId: user.id,
        choices: {
          create: body.choices.map((c, idx) => ({
            content: c.content,
            isCorrect: c.isCorrect,
            order: typeof c.order === "number" ? c.order : idx,
          })),
        },
      },
      select: { id: true, text: true, explanation: true },
    });

    if (exam) {
      await prisma.examQuestion.create({
        data: {
          examId: exam.id,
          questionId: created.id,
          points: typeof body.points === "number" ? body.points : 1.0,
          order: 0,
        },
      });
    }
    return created;
  }

  @Put("{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Question not found")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async updateQuestion(
    @Request() req: ExRequest,
    @Path() id: number,
    @Body()
    body: { text?: string; explanation?: string | null; type?: QuestionType }
  ): Promise<{ id: number; text: string; explanation: string | null } | null> {
    const user = (req as any).user as { id: number; role: string };
    const existing = await prisma.question.findUnique({
      where: { id },
      select: { id: true, authorId: true },
    });
    if (!existing) {
      this.setStatus(404);
      return null;
    }
    if (
      user.role?.toUpperCase() === "TEACHER" &&
      existing.authorId !== user.id
    ) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    // If linked to any PUBLISHED exam with attempts, do not allow changing type (but allow text/explanation)
    const linkedPublishedWithAttempts = await prisma.examQuestion.findFirst({
      where: {
        questionId: id,
        exam: { status: "PUBLISHED" as any, attempts: { some: {} } },
      },
      select: { examId: true },
    });
    if (linkedPublishedWithAttempts && typeof body.type !== "undefined") {
      const err: any = new Error(
        "Cannot change type: question is used in a published exam with attempts"
      );
      err.status = 409;
      throw err;
    }

    const data: any = {};
    if (typeof body.text !== "undefined") data.text = body.text;
    if (typeof body.explanation !== "undefined")
      data.explanation = body.explanation;
    if (typeof body.type !== "undefined") data.type = body.type;

    return prisma.question.update({
      where: { id },
      data,
      select: { id: true, text: true, explanation: true },
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
      select: { id: true, authorId: true },
    });
    if (!existing) {
      this.setStatus(404);
      return null;
    }
    if (
      user.role?.toUpperCase() === "TEACHER" &&
      existing.authorId !== user.id
    ) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }
    // Disallow deletion if linked to any PUBLISHED exam that already has attempts
    const linkedPublished = await prisma.examQuestion.findFirst({
      where: {
        questionId: id,
        exam: { status: "PUBLISHED" as any, attempts: { some: {} } },
      },
      select: { examId: true },
    });
    if (linkedPublished) {
      const err: any = new Error(
        "Cannot delete: question is used in a published exam with attempts"
      );
      err.status = 409;
      throw err;
    }
    await prisma.examQuestion.deleteMany({ where: { questionId: id } });
    await prisma.choice.deleteMany({ where: { questionId: id } });
    await prisma.question.delete({ where: { id } });
    return { message: "Question deleted", id };
  }
}

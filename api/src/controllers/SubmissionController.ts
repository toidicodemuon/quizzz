import { prisma } from "../utils/prisma";
import { Body, Controller, Delete, Get, Path, Post, Request, Response, Route, Security, Tags, Query } from "tsoa";
import { Request as ExRequest } from "express";

// shared prisma instance

type SubmissionSummary = {
  id: number;
  score: number;
  startTime: Date;
  endTime: Date | null;
  studentId: number;
  quizId: number;
};

@Route("submissions")
@Tags("Submission")
export class SubmissionController extends Controller {
  @Get("/")
  @Response<null>(401, "Unauthorized")
  @Security("bearerAuth")
  public async listSubmissions(
    @Request() req: ExRequest,
    @Query() quizId?: number,
    @Query() page?: number,
    @Query() pageSize?: number
  ): Promise<{ items: SubmissionSummary[]; total: number }> {
    const user = (req as any).user as { id: number; role: string };
    const role = user.role?.toUpperCase();
    const take = Math.max(1, Math.min(100, Number(pageSize) || 50));
    const skip = Math.max(0, ((Number(page) || 1) - 1) * take);

    if (role === "ADMIN") {
      const where = typeof quizId === "number" ? { quizId } : undefined;
      const [items, total] = await Promise.all([
        prisma.submission.findMany({
          where,
          select: {
            id: true,
            score: true,
            startTime: true,
            endTime: true,
            studentId: true,
            quizId: true,
          },
          orderBy: { id: "asc" },
          skip,
          take,
        }),
        prisma.submission.count({ where }),
      ]);
      return { items, total };
    }

    if (role === "TEACHER") {
      const where: any = {
        quiz: { teacherId: user.id },
        ...(typeof quizId === "number" ? { quizId } : {}),
      };
      const [items, total] = await Promise.all([
        prisma.submission.findMany({
          where,
          select: {
            id: true,
            score: true,
            startTime: true,
            endTime: true,
            studentId: true,
            quizId: true,
          },
          orderBy: { id: "asc" },
          skip,
          take,
        }),
        prisma.submission.count({ where }),
      ]);
      return { items, total };
    }

    // STUDENT: only own submissions
    const where: any = { studentId: user.id, ...(typeof quizId === "number" ? { quizId } : {}) };
    const [items, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        select: {
          id: true,
          score: true,
          startTime: true,
          endTime: true,
          studentId: true,
          quizId: true,
        },
        orderBy: { id: "asc" },
        skip,
        take,
      }),
      prisma.submission.count({ where }),
    ]);
    return { items, total };
  }

  @Get("{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(404, "Submission not found")
  @Security("bearerAuth")
  public async getSubmissionById(
    @Request() req: ExRequest,
    @Path() id: number
  ): Promise<SubmissionSummary | null> {
    const user = (req as any).user as { id: number; role: string };
    const role = user.role?.toUpperCase();

    const sub = await prisma.submission.findUnique({
      where: { id },
      select: {
        id: true,
        score: true,
        startTime: true,
        endTime: true,
        studentId: true,
        quizId: true,
        quiz: { select: { teacherId: true } },
      },
    });
    if (!sub) {
      const err: any = new Error("Submission not found");
      err.status = 404;
      throw err;
    }
    if (role === "STUDENT" && sub.studentId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }
    if (role === "TEACHER" && sub.quiz.teacherId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    const { quiz: _omit, ...summary } = sub as any;
    return summary as SubmissionSummary;
  }

  @Post("/")
  @Response<null>(400, "Bad Request")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["STUDENT"])
  public async createSubmission(
    @Request() req: ExRequest,
    @Body()
    body: {
      quizId: number;
      answers: Array<{ questionId: number; selectedAnswerId: number }>;
    }
  ): Promise<SubmissionSummary> {
    const user = (req as any).user as { id: number; role: string };

    const quiz = await prisma.quiz.findUnique({ where: { id: body.quizId }, select: { id: true, status: true } });
    if (!quiz) {
      this.setStatus(400);
      throw new Error("Invalid quizId");
    }
    if (quiz.status !== "PUBLISHED") {
      this.setStatus(400);
      throw new Error("Quiz is not open for submissions");
    }

    if (!Array.isArray(body.answers) || body.answers.length === 0) {
      this.setStatus(400);
      throw new Error("answers must be a non-empty array");
    }

    // Validate answers and compute score
    let correctCount = 0;
    const questionIds = body.answers.map((a) => a.questionId);

    const answersFromDb = await prisma.answer.findMany({
      where: {
        questionId: { in: questionIds },
        question: { quizId: body.quizId },
      },
      select: { id: true, isCorrect: true, questionId: true },
    });
    const byQuestion = new Map<number, { id: number; isCorrect: boolean }[]>();
    for (const a of answersFromDb) {
      const arr = byQuestion.get(a.questionId) ?? [];
      arr.push({ id: a.id, isCorrect: a.isCorrect });
      byQuestion.set(a.questionId, arr);
    }

    for (const sel of body.answers) {
      const options = byQuestion.get(sel.questionId) || [];
      const found = options.find((o) => o.id === sel.selectedAnswerId);
      if (!found) {
        this.setStatus(400);
        throw new Error(`Invalid selectedAnswerId for question ${sel.questionId}`);
      }
      if (found.isCorrect) correctCount++;
    }

    const score = (correctCount / body.answers.length) * 100;

    const created = await prisma.submission.create({
      data: {
        score,
        studentId: user.id,
        quizId: body.quizId,
        submissionAnswers: {
          create: body.answers.map((a) => ({
            questionId: a.questionId,
            selectedAnswerId: a.selectedAnswerId,
          })),
        },
      },
      select: {
        id: true,
        score: true,
        startTime: true,
        endTime: true,
        studentId: true,
        quizId: true,
      },
    });
    return created;
  }

  @Delete("{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Submission not found")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async deleteSubmission(
    @Request() req: ExRequest,
    @Path() id: number
  ): Promise<{ message: string; id: number } | null> {
    const user = (req as any).user as { id: number; role: string };
    const role = user.role?.toUpperCase();

    const existing = await prisma.submission.findUnique({
      where: { id },
      select: { id: true, quiz: { select: { teacherId: true } } },
    });
    if (!existing) {
      const err: any = new Error("Submission not found");
      err.status = 404;
      throw err;
    }
    if (role === "TEACHER" && existing.quiz.teacherId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    await prisma.submission.delete({ where: { id } });
    return { message: "Submission deleted", id };
  }
}

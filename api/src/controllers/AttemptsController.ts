import { prisma } from "../utils/prisma";
import { Body, Controller, Delete, Get, Path, Post, Request, Response, Route, Security, Tags, Query } from "tsoa";
import { AttemptStatus } from "@prisma/client";
import { Request as ExRequest } from "express";

type AttemptSummary = {
  id: number;
  score: number | null; // Decimal
  startedAt: Date;
  submittedAt: Date | null;
  timeTakenSec: number | null;
  studentId: number;
  examId: number;
  roomId: number;
  status: AttemptStatus;
};

@Route("attempts")
@Tags("Attempt")
export class AttemptController extends Controller {
  @Get("/")
  @Response<null>(401, "Unauthorized")
  @Security("bearerAuth")
  public async listSubmissions(
    @Request() req: ExRequest,
    @Query() examId?: number,
    @Query() page?: number,
    @Query() pageSize?: number
  ): Promise<{ items: AttemptSummary[]; total: number }> {
    const user = (req as any).user as { id: number; role: string };
    const role = user.role?.toUpperCase();
    const take = Math.max(1, Math.min(100, Number(pageSize) || 50));
    const skip = Math.max(0, ((Number(page) || 1) - 1) * take);

    if (role === "ADMIN") {
      const where = typeof examId === "number" ? { examId } : undefined;
      const [raw, total] = await Promise.all([
        prisma.attempt.findMany({
          where,
          select: {
            id: true,
            score: true,
            startedAt: true,
            submittedAt: true,
            timeTakenSec: true,
            studentId: true,
            examId: true,
            roomId: true,
            status: true,
          },
          orderBy: { id: "asc" },
          skip,
          take,
        }),
        prisma.attempt.count({ where }),
      ]);
      const items = raw.map((i) => ({
        ...i,
        score: i.score === null ? null : Number(i.score as any),
      })) as any;
      return { items, total };
    }

    if (role === "TEACHER") {
      const where: any = {
        exam: { authorId: user.id },
        ...(typeof examId === "number" ? { examId } : {}),
      };
      const [raw, total] = await Promise.all([
        prisma.attempt.findMany({
          where,
          select: {
            id: true,
            score: true,
            startedAt: true,
            submittedAt: true,
            timeTakenSec: true,
            studentId: true,
            examId: true,
            roomId: true,
            status: true,
          },
          orderBy: { id: "asc" },
          skip,
          take,
        }),
        prisma.attempt.count({ where }),
      ]);
      const items = raw.map((i) => ({
        ...i,
        score: i.score === null ? null : Number(i.score as any),
      })) as any;
      return { items, total };
    }

    // STUDENT: only own attempts
    const where: any = { studentId: user.id, ...(typeof examId === "number" ? { examId } : {}) };
    const [raw, total] = await Promise.all([
      prisma.attempt.findMany({
        where,
        select: {
          id: true,
          score: true,
          startedAt: true,
          submittedAt: true,
          timeTakenSec: true,
          studentId: true,
          examId: true,
          roomId: true,
          status: true,
        },
        orderBy: { id: "asc" },
        skip,
        take,
      }),
      prisma.attempt.count({ where }),
    ]);
    const items = raw.map((i) => ({
      ...i,
      score: i.score === null ? null : Number(i.score as any),
    })) as any;
    return { items, total };
  }

  @Get("{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(404, "Attempt not found")
  @Security("bearerAuth")
  public async getSubmissionById(
    @Request() req: ExRequest,
    @Path() id: number
  ): Promise<AttemptSummary | null> {
    const user = (req as any).user as { id: number; role: string };
    const role = user.role?.toUpperCase();

    const sub = await prisma.attempt.findUnique({
      where: { id },
      select: {
        id: true,
        score: true,
        startedAt: true,
        submittedAt: true,
        timeTakenSec: true,
        studentId: true,
        examId: true,
        roomId: true,
        status: true,
        exam: { select: { authorId: true } },
      },
    });
    if (!sub) {
      const err: any = new Error("Attempt not found");
      err.status = 404;
      throw err;
    }
    if (role === "STUDENT" && sub.studentId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }
    if (role === "TEACHER" && (sub as any).exam.authorId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    const { exam: _omit, ...summary } = sub as any;
    const mapped = { ...summary, score: summary.score === null ? null : Number(summary.score) };
    return mapped as AttemptSummary;
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
      roomId: number;
      answers: Array<{ questionId: number; selectedChoiceId: number }>;
    }
  ): Promise<AttemptSummary> {
    const user = (req as any).user as { id: number; role: string };

    const room = await prisma.room.findUnique({ where: { id: body.roomId }, select: { id: true, examId: true } });
    if (!room) {
      this.setStatus(400);
      throw new Error("Invalid roomId");
    }

    if (!Array.isArray(body.answers) || body.answers.length === 0) {
      this.setStatus(400);
      throw new Error("answers must be a non-empty array");
    }

    // Validate choices belong to the question and that question belongs to the exam
    const questionIds = body.answers.map((a) => a.questionId);
    const choicesFromDb = await prisma.choice.findMany({
      where: {
        questionId: { in: questionIds },
        question: { examLinks: { some: { examId: room.examId } } },
      },
      select: { id: true, isCorrect: true, questionId: true },
    });
    const byQuestion = new Map<number, { id: number; isCorrect: boolean }[]>();
    for (const c of choicesFromDb) {
      const arr = byQuestion.get(c.questionId) ?? [];
      arr.push({ id: c.id, isCorrect: c.isCorrect });
      byQuestion.set(c.questionId, arr);
    }

    let earnedTotal = 0;
    const perQuestion = new Map<number, number>();
    const points = await prisma.examQuestion.findMany({ where: { examId: room.examId, questionId: { in: questionIds } }, select: { questionId: true, points: true } });
    for (const p of points) perQuestion.set(p.questionId, Number(p.points));

    const attempt = await prisma.attempt.create({
      data: { roomId: room.id, examId: room.examId, studentId: user.id, status: AttemptStatus.IN_PROGRESS },
    });

    for (const sel of body.answers) {
      const options = byQuestion.get(sel.questionId) || [];
      const found = options.find((o) => o.id === sel.selectedChoiceId);
      if (!found) {
        this.setStatus(400);
        throw new Error(`Invalid selectedChoiceId for question ${sel.questionId}`);
      }
      const isCorrect = !!found.isCorrect;
      const earned = isCorrect ? (perQuestion.get(sel.questionId) ?? 1) : 0;
      const aa = await prisma.attemptAnswer.create({
        data: { attemptId: attempt.id, questionId: sel.questionId, isCorrect, earned },
      });
      await prisma.attemptAnswerChoice.create({ data: { attemptAnswerId: aa.id, choiceId: sel.selectedChoiceId } });
      earnedTotal += earned;
    }

    const totalPoints = await prisma.examQuestion.aggregate({ _sum: { points: true }, where: { examId: room.examId } });
    const total = Number(totalPoints._sum.points ?? 0) || body.answers.length;
    const percent = total > 0 ? (earnedTotal / total) * 100 : 0;

    const updated = await prisma.attempt.update({
      where: { id: attempt.id },
      data: { status: AttemptStatus.SUBMITTED, submittedAt: new Date(), timeTakenSec: Math.floor(300 + Math.random() * 600), score: Number(percent.toFixed(2)) },
      select: { id: true, score: true, startedAt: true, submittedAt: true, timeTakenSec: true, studentId: true, examId: true, roomId: true, status: true },
    });
    return updated as AttemptSummary;
  }

  @Delete("{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Attempt not found")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async deleteSubmission(
    @Request() req: ExRequest,
    @Path() id: number
  ): Promise<{ message: string; id: number } | null> {
    const user = (req as any).user as { id: number; role: string };
    const role = user.role?.toUpperCase();

    const existing = await prisma.attempt.findUnique({ where: { id }, select: { id: true, exam: { select: { authorId: true } } } });
    if (!existing) {
      const err: any = new Error("Attempt not found");
      err.status = 404;
      throw err;
    }
    if (role === "TEACHER" && (existing as any).exam.authorId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    await prisma.attempt.delete({ where: { id } });
    return { message: "Attempt deleted", id };
  }
}


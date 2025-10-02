import { PrismaClient } from "@prisma/client";
import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Request,
  Response,
  Route,
  Security,
  Tags,
} from "tsoa";
import { Request as ExRequest } from "express";

const prisma = new PrismaClient();

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
  public async listSubmissions(@Request() req: ExRequest): Promise<SubmissionSummary[]> {
    const user = (req as any).user as { id: number; role: string };
    const role = user.role?.toUpperCase();

    if (role === "ADMIN") {
      return prisma.submission.findMany({
        select: {
          id: true,
          score: true,
          startTime: true,
          endTime: true,
          studentId: true,
          quizId: true,
        },
        orderBy: { id: "asc" },
      });
    }

    if (role === "TEACHER") {
      return prisma.submission.findMany({
        where: { quiz: { teacherId: user.id } },
        select: {
          id: true,
          score: true,
          startTime: true,
          endTime: true,
          studentId: true,
          quizId: true,
        },
        orderBy: { id: "asc" },
      });
    }

    // STUDENT: only own submissions
    return prisma.submission.findMany({
      where: { studentId: user.id },
      select: {
        id: true,
        score: true,
        startTime: true,
        endTime: true,
        studentId: true,
        quizId: true,
      },
      orderBy: { id: "asc" },
    });
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
      this.setStatus(404);
      return null;
    }
    if (
      role === "STUDENT" && sub.studentId !== user.id
    ) {
      this.setStatus(403);
      return null as any;
    }
    if (
      role === "TEACHER" && sub.quiz.teacherId !== user.id
    ) {
      this.setStatus(403);
      return null as any;
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

    const quiz = await prisma.quiz.findUnique({ where: { id: body.quizId }, select: { id: true } });
    if (!quiz) {
      this.setStatus(400);
      throw new Error("Invalid quizId");
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
      this.setStatus(404);
      return null;
    }
    if (role === "TEACHER" && existing.quiz.teacherId !== user.id) {
      this.setStatus(403);
      return null;
    }

    await prisma.submission.delete({ where: { id } });
    return { message: "Submission deleted", id };
  }
}


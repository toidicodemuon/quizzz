import { prisma } from "../utils/prisma";
import { Controller, Get, Path, Query, Request, Response, Route, Security, Tags } from "tsoa";
import { Request as ExRequest } from "express";

type AttemptAnswerSummary = {
  id: number;
  attemptId: number;
  questionId: number;
  isCorrect: boolean | null;
  earned: number | null;
  selectedChoiceIds: number[];
};

@Route("attempt-answers")
@Tags("AttemptAnswer")
export class AttemptAnswerController extends Controller {
  @Get("/")
  @Response<null>(400, "Bad Request")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth")
  public async listBySubmission(
    @Request() req: ExRequest,
    @Query() attemptId?: number
  ): Promise<AttemptAnswerSummary[]> {
    if (typeof attemptId !== "number") {
      this.setStatus(400);
      throw new Error("attemptId is required");
    }

    const user = (req as any).user as { id: number; role: string };
    const role = user.role?.toUpperCase();

    const attempt = await prisma.attempt.findUnique({ where: { id: attemptId }, select: { id: true, studentId: true, exam: { select: { authorId: true } } } });
    if (!attempt) {
      this.setStatus(400);
      throw new Error("Invalid attemptId");
    }

    if (role === "STUDENT" && attempt.studentId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }
    if (role === "TEACHER" && (attempt as any).exam.authorId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    const answers = await prisma.attemptAnswer.findMany({
      where: { attemptId },
      select: { id: true, attemptId: true, questionId: true, isCorrect: true, earned: true, choices: { select: { choiceId: true } } },
      orderBy: { id: "asc" },
    });
    return answers.map((a) => ({ id: a.id, attemptId: a.attemptId, questionId: a.questionId, isCorrect: a.isCorrect, earned: a.earned === null ? null : Number(a.earned as any), selectedChoiceIds: a.choices.map((c) => c.choiceId) }));
  }

  @Get("{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Not found")
  @Security("bearerAuth")
  public async getById(
    @Request() req: ExRequest,
    @Path() id: number
  ): Promise<AttemptAnswerSummary | null> {
    const user = (req as any).user as { id: number; role: string };
    const role = user.role?.toUpperCase();

    const sa = await prisma.attemptAnswer.findUnique({ where: { id }, select: { id: true, attemptId: true, questionId: true, isCorrect: true, earned: true, attempt: { select: { studentId: true, exam: { select: { authorId: true } } } }, choices: { select: { choiceId: true } } } });

    if (!sa) {
      const err: any = new Error("Not found");
      err.status = 404;
      throw err;
    }

    if (role === "STUDENT" && sa.attempt.studentId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }
    if (role === "TEACHER" && (sa as any).attempt.exam.authorId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    const { attempt: _omit, ...rest } = sa as any;
    return { ...rest, selectedChoiceIds: sa.choices.map((c) => c.choiceId) } as AttemptAnswerSummary;
  }
}

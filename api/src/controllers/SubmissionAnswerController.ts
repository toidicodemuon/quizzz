import { prisma } from "../utils/prisma";
import {
  Controller,
  Get,
  Path,
  Query,
  Request,
  Response,
  Route,
  Security,
  Tags,
} from "tsoa";
import { Request as ExRequest } from "express";

// shared prisma instance

type SubmissionAnswerSummary = {
  id: number;
  submissionId: number;
  questionId: number;
  selectedAnswerId: number;
};

@Route("submission-answers")
@Tags("SubmissionAnswer")
export class SubmissionAnswerController extends Controller {
  @Get("/")
  @Response<null>(400, "Bad Request")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth")
  public async listBySubmission(
    @Request() req: ExRequest,
    @Query() submissionId?: number
  ): Promise<SubmissionAnswerSummary[]> {
    if (typeof submissionId !== "number") {
      this.setStatus(400);
      throw new Error("submissionId is required");
    }

    const user = (req as any).user as { id: number; role: string };
    const role = user.role?.toUpperCase();

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      select: { id: true, studentId: true, quiz: { select: { teacherId: true } } },
    });
    if (!submission) {
      this.setStatus(400);
      throw new Error("Invalid submissionId");
    }

    if (role === "STUDENT" && submission.studentId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }
    if (role === "TEACHER" && submission.quiz.teacherId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    return prisma.submissionAnswer.findMany({
      where: { submissionId },
      select: {
        id: true,
        submissionId: true,
        questionId: true,
        selectedAnswerId: true,
      },
      orderBy: { id: "asc" },
    });
  }

  @Get("{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Not found")
  @Security("bearerAuth")
  public async getById(
    @Request() req: ExRequest,
    @Path() id: number
  ): Promise<SubmissionAnswerSummary | null> {
    const user = (req as any).user as { id: number; role: string };
    const role = user.role?.toUpperCase();

    const sa = await prisma.submissionAnswer.findUnique({
      where: { id },
      select: {
        id: true,
        submissionId: true,
        questionId: true,
        selectedAnswerId: true,
        submission: { select: { studentId: true, quiz: { select: { teacherId: true } } } },
      },
    });

    if (!sa) {
      const err: any = new Error("Not found");
      err.status = 404;
      throw err;
    }

    if (role === "STUDENT" && sa.submission.studentId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }
    if (role === "TEACHER" && sa.submission.quiz.teacherId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    const { submission: _omit, ...summary } = sa as any;
    return summary as SubmissionAnswerSummary;
  }
}

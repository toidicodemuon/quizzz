import { prisma } from "../utils/prisma";
import {
  Controller,
  Get,
  Route,
  Tags,
  Response,
  Security,
  Post,
  Body,
  Request,
  Put,
  Delete,
  Path,
  Query,
  Example,
} from "tsoa";
import { Request as ExRequest } from "express";

export type ExamSummary = {
  id: number;
  title: string;
  description: string | null;
  code: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  subjectId: number | null;
  authorId: number | null;
  // extended config
  examType?:
    | "PRACTICE"
    | "MIDTERM"
    | "FINAL"
    | "MOCK"
    | "MOS_DRILL"
    | "PLACEMENT";
  totalPoints?: number | null;
  passMarkPercent?: number | null;
  scoringMode?: "STANDARD" | "PARTIAL_CREDIT" | "NEGATIVE_MARKING";
  feedbackMode?: "NONE" | "AFTER_SUBMIT" | "DETAILED";
  showScoreImmediately?: boolean;
  showCorrectAnswers?: boolean;
  showExplanation?: boolean;
  reviewWindowMin?: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export class AddExamRequest {
  @Example<string>("Bài thi CNTT Cơ bản")
  public title!: string;

  @Example<string>("Kiểm tra các kỹ năng tin học cơ bản")
  public description!: string | null;

  public code?: string | null;
  public status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  public subjectId?: number | null;
  // === Optional extended fields ===
  public examType?:
    | "PRACTICE"
    | "MIDTERM"
    | "FINAL"
    | "MOCK"
    | "MOS_DRILL"
    | "PLACEMENT";
  public totalPoints?: number | null;
  public passMarkPercent?: number | null;
  public scoringMode?: "STANDARD" | "PARTIAL_CREDIT" | "NEGATIVE_MARKING";
  public feedbackMode?: "NONE" | "AFTER_SUBMIT" | "DETAILED";
  public showScoreImmediately?: boolean;
  public showCorrectAnswers?: boolean;
  public showExplanation?: boolean;
  public reviewWindowMin?: number | null;
}

@Route("exams")
@Tags("Exams")
export class ExamsController extends Controller {
  @Get("/")
  @Response<null>(401, "Unauthorized")
  @Security("bearerAuth")
  public async list(
    @Query() page?: number,
    @Query() pageSize?: number,
    @Query() subjectId?: number,
    @Query() authorId?: number
  ): Promise<{ items: ExamSummary[]; total: number }> {
    const take = Math.max(1, Math.min(100, Number(pageSize) || 50));
    const skip = Math.max(0, ((Number(page) || 1) - 1) * take);
    const where: any = {};

    if (typeof authorId === "number") where.authorId = authorId;
    if (typeof subjectId === "number") where.subjectId = subjectId;
    const [items, total] = await Promise.all([
      prisma.exam.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          code: true,
          status: true,
          subjectId: true,
          authorId: true,
          examType: true,
          totalPoints: true,
          passMarkPercent: true,
          scoringMode: true,
          feedbackMode: true,
          showScoreImmediately: true,
          showCorrectAnswers: true,
          showExplanation: true,
          reviewWindowMin: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.exam.count({ where }),
    ]);
    const mapped: ExamSummary[] = items.map((e: any) => ({
      ...e,
      totalPoints: e.totalPoints === null ? null : Number(e.totalPoints as any),
    }));
    return { items: mapped, total };
  }

  @Get("/{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(404, "Exam not found")
  @Security("bearerAuth")
  public async get(@Path() id: number): Promise<ExamSummary | null> {
    const exam = await prisma.exam.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        code: true,
        status: true,
        subjectId: true,
        authorId: true,
        examType: true,
        totalPoints: true,
        passMarkPercent: true,
        scoringMode: true,
        feedbackMode: true,
        showScoreImmediately: true,
        showCorrectAnswers: true,
        showExplanation: true,
        reviewWindowMin: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!exam) {
      const err: any = new Error("Exam not found");
      err.status = 404;
      throw err;
    }
    const mapped: ExamSummary = {
      ...(exam as any),
      totalPoints:
        (exam as any).totalPoints === null
          ? null
          : Number((exam as any).totalPoints as any),
    };
    return mapped;
  }

  @Post("/")
  @Response<null>(400, "Bad Request")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["TEACHER"])
  public async create(
    @Request() req: ExRequest,
    @Body() body: AddExamRequest
  ): Promise<ExamSummary> {
    const user = (req as any).user as { id: number; role: string };
    if (!body?.title) {
      this.setStatus(400);
      throw new Error("title is required");
    }
    const data: any = {
      title: body.title,
      description:
        typeof body.description === "undefined" ? null : body.description,
      code: typeof body.code === "string" ? body.code : null,
      status: (body.status as any) ?? "DRAFT",
      subjectId: typeof body.subjectId === "number" ? body.subjectId : null,
      authorId: user.id,
    };
    // Extended fields (optional)
    if (typeof body.examType !== "undefined")
      data.examType = body.examType as any;
    if (typeof body.totalPoints !== "undefined")
      data.totalPoints =
        body.totalPoints === null || typeof body.totalPoints === "number"
          ? (body.totalPoints as any)
          : null;
    if (typeof body.passMarkPercent !== "undefined")
      data.passMarkPercent = body.passMarkPercent as any;
    if (typeof body.scoringMode !== "undefined")
      data.scoringMode = body.scoringMode as any;
    if (typeof body.feedbackMode !== "undefined")
      data.feedbackMode = body.feedbackMode as any;
    if (typeof body.showScoreImmediately !== "undefined")
      data.showScoreImmediately = !!body.showScoreImmediately;
    if (typeof body.showCorrectAnswers !== "undefined")
      data.showCorrectAnswers = !!body.showCorrectAnswers;
    if (typeof body.showExplanation !== "undefined")
      data.showExplanation = !!body.showExplanation;
    if (typeof body.reviewWindowMin !== "undefined")
      data.reviewWindowMin = body.reviewWindowMin as any;
    const created = await prisma.exam.create({
      data,
      select: {
        id: true,
        title: true,
        description: true,
        code: true,
        status: true,
        subjectId: true,
        authorId: true,
        examType: true,
        totalPoints: true,
        passMarkPercent: true,
        scoringMode: true,
        feedbackMode: true,
        showScoreImmediately: true,
        showCorrectAnswers: true,
        showExplanation: true,
        reviewWindowMin: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    const mapped: ExamSummary = {
      ...(created as any),
      totalPoints:
        (created as any).totalPoints === null
          ? null
          : Number((created as any).totalPoints as any),
    };
    return mapped;
  }

  @Put("/{id}")
  @Response<null>(400, "Bad Request")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Exam not found")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async update(
    @Request() req: ExRequest,
    @Path() id: number,
    @Body()
    body: {
      title?: string;
      description?: string | null;
      code?: string | null;
      status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
      subjectId?: number | null;
      examType?:
        | "PRACTICE"
        | "MIDTERM"
        | "FINAL"
        | "MOCK"
        | "MOS_DRILL"
        | "PLACEMENT";
      totalPoints?: number | null;
      passMarkPercent?: number | null;
      scoringMode?: "STANDARD" | "PARTIAL_CREDIT" | "NEGATIVE_MARKING";
      feedbackMode?: "NONE" | "AFTER_SUBMIT" | "DETAILED";
      showScoreImmediately?: boolean;
      showCorrectAnswers?: boolean;
      showExplanation?: boolean;
      reviewWindowMin?: number | null;
    }
  ): Promise<ExamSummary | null> {
    const user = (req as any).user as { id: number; role: string };
    const existing = await prisma.exam.findUnique({
      where: { id },
      select: { id: true, authorId: true },
    });
    if (!existing) {
      const err: any = new Error("Exam not found");
      err.status = 404;
      throw err;
    }
    if (
      user.role?.toUpperCase() === "TEACHER" &&
      existing.authorId !== user.id
    ) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }
    const data: any = {};
    if (typeof body.title !== "undefined") data.title = body.title;
    if (typeof body.description !== "undefined")
      data.description = body.description;
    if (typeof body.code !== "undefined") data.code = body.code ?? null;
    if (typeof body.status !== "undefined") data.status = body.status as any;
    if (typeof body.subjectId !== "undefined")
      data.subjectId = body.subjectId as any;
    if (typeof body.examType !== "undefined")
      data.examType = body.examType as any;
    if (typeof body.totalPoints !== "undefined")
      data.totalPoints = body.totalPoints as any;
    if (typeof body.passMarkPercent !== "undefined")
      data.passMarkPercent = body.passMarkPercent as any;
    if (typeof body.scoringMode !== "undefined")
      data.scoringMode = body.scoringMode as any;
    if (typeof body.feedbackMode !== "undefined")
      data.feedbackMode = body.feedbackMode as any;
    if (typeof body.showScoreImmediately !== "undefined")
      data.showScoreImmediately = !!body.showScoreImmediately;
    if (typeof body.showCorrectAnswers !== "undefined")
      data.showCorrectAnswers = !!body.showCorrectAnswers;
    if (typeof body.showExplanation !== "undefined")
      data.showExplanation = !!body.showExplanation;
    if (typeof body.reviewWindowMin !== "undefined")
      data.reviewWindowMin = body.reviewWindowMin as any;
    const updated = await prisma.exam.update({
      where: { id },
      data,
      select: {
        id: true,
        title: true,
        description: true,
        code: true,
        status: true,
        subjectId: true,
        authorId: true,
        examType: true,
        totalPoints: true,
        passMarkPercent: true,
        scoringMode: true,
        feedbackMode: true,
        showScoreImmediately: true,
        showCorrectAnswers: true,
        showExplanation: true,
        reviewWindowMin: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    const mapped: ExamSummary = {
      ...(updated as any),
      totalPoints:
        (updated as any).totalPoints === null
          ? null
          : Number((updated as any).totalPoints as any),
    };
    return mapped;
  }

  @Delete("/{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Exam not found")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async remove(
    @Request() req: ExRequest,
    @Path() id: number
  ): Promise<{ message: string; id: number } | null> {
    const user = (req as any).user as { id: number; role: string };
    const existing = await prisma.exam.findUnique({
      where: { id },
      select: { id: true, authorId: true },
    });
    if (!existing) {
      const err: any = new Error("Exam not found");
      err.status = 404;
      throw err;
    }
    if (
      user.role?.toUpperCase() === "TEACHER" &&
      existing.authorId !== user.id
    ) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }
    await prisma.exam.delete({ where: { id } });
    return { message: "Exam deleted", id };
  }

  // === Manage exam questions (link/unlink existing questions) ===
  @Post("/{id}/questions")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Exam not found")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async addQuestions(
    @Request() req: ExRequest,
    @Path() id: number,
    @Body()
    body: { questionIds: number[]; points?: number }
  ): Promise<{ added: number; examId: number }> {
    const user = (req as any).user as { id: number; role: string };
    const exam = await prisma.exam.findUnique({
      where: { id },
      select: { id: true, authorId: true },
    });
    if (!exam) {
      const err: any = new Error("Exam not found");
      err.status = 404;
      throw err;
    }
    if (user.role?.toUpperCase() === "TEACHER" && exam.authorId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }
    const ids = Array.isArray(body.questionIds)
      ? Array.from(
          new Set(
            body.questionIds
              .map((n) => Number(n))
              .filter((n) => Number.isFinite(n))
          )
        )
      : [];
    if (ids.length === 0) return { added: 0, examId: id };
    const existing = await prisma.examQuestion.findMany({
      where: { examId: id, questionId: { in: ids } },
      select: { questionId: true },
    });
    const existingIds = new Set(existing.map((e) => e.questionId));
    const toCreate = ids.filter((qid) => !existingIds.has(qid));
    if (toCreate.length === 0) return { added: 0, examId: id };
    const defaultPoints =
      typeof body.points === "number" && body.points > 0 ? body.points : 1.0;
    await prisma.examQuestion.createMany({
      data: toCreate.map((qid, idx) => ({
        examId: id,
        questionId: qid,
        points: defaultPoints as any,
        order: idx,
      })),
      skipDuplicates: true,
    });
    return { added: toCreate.length, examId: id };
  }

  @Delete("/{id}/questions/{questionId}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Exam not found")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async removeQuestion(
    @Request() req: ExRequest,
    @Path() id: number,
    @Path() questionId: number
  ): Promise<{ removed: number; examId: number; questionId: number }> {
    const user = (req as any).user as { id: number; role: string };
    const exam = await prisma.exam.findUnique({
      where: { id },
      select: { id: true, authorId: true },
    });
    if (!exam) {
      const err: any = new Error("Exam not found");
      err.status = 404;
      throw err;
    }
    if (user.role?.toUpperCase() === "TEACHER" && exam.authorId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }
    const res = await prisma.examQuestion.deleteMany({
      where: { examId: id, questionId },
    });
    return { removed: res.count, examId: id, questionId };
  }
}

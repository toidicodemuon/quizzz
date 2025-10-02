import { PrismaClient, QuizStatus } from "@prisma/client";
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
  Example,
  Put,
  Delete,
  Path,
} from "tsoa";
import { Request as ExRequest } from "express";

const prisma = new PrismaClient();

export type QuizSummary = {
  id: number;
  title: string;
  description: string | null;
  status: string;
  teacherId: number;
  createdAt: Date;
  updatedAt: Date;
};

export class AddQuizRequest {
  @Example<string>("Midterm Quiz")
  public title!: string;

  @Example<string>("Covers chapters 1–3")
  public description!: string | null;

  @Example<string>("DRAFT")
  public status!: QuizStatus;

  @Example<number>(30)
  public timeLimitMinutes!: number;
}

/**
 * Quiz endpoints (được bảo vệ bởi JWT ở layer Express)
 */
@Route("quiz")
@Tags("Quiz")
export class QuizController extends Controller {
  /**
   * Trả về danh sách quiz. Yêu cầu có JWT hợp lệ (middleware Express chặn theo path /api/quiz)
   */
  @Get("/")
  @Response<null>(401, "Unauthorized")
  @Security("bearerAuth")
  public async listQuizzes(): Promise<QuizSummary[]> {
    const quizzes = await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        teacherId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return quizzes;
  }
  /**
   * Thêm một đề thi mới. Chỉ giáo viên mới có quyền sử dụng.
   * Yêu cầu có JWT hợp lệ (middleware Express chặn theo path /api/quiz)
   */

  @Response<null>(400, "Bad Request")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["TEACHER"])
  @Post("/add")
  public async addQuiz(
    @Request() req: ExRequest,
    @Body() body: AddQuizRequest
  ): Promise<QuizSummary> {
    // JWT payload đã được TSOA inject vào req.user sau khi qua middleware Security
    const user = (req as any).user as { id: number; role: string };
    return prisma.quiz.create({
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        timeLimitMinutes: body.timeLimitMinutes,
        teacherId: user.id,
      },
    });
  }

  @Put("/{id}")
  @Response<null>(400, "Bad Request")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Quiz not found")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async updateQuiz(
    @Request() req: ExRequest,
    @Path() id: number,
    @Body()
    body: {
      title?: string;
      description?: string | null;
      status?: QuizStatus;
      timeLimitMinutes?: number;
    }
  ): Promise<QuizSummary | null> {
    const user = (req as any).user as { id: number; role: string };

    const existing = await prisma.quiz.findUnique({
      where: { id },
      select: { id: true, teacherId: true },
    });
    if (!existing) {
      this.setStatus(404);
      return null;
    }

    if (
      user.role?.toUpperCase() === "TEACHER" &&
      existing.teacherId !== user.id
    ) {
      this.setStatus(403);
      return null;
    }

    const data: any = {};
    if (typeof body.title !== "undefined") data.title = body.title;
    if (typeof body.description !== "undefined")
      data.description = body.description;
    if (typeof body.status !== "undefined") data.status = body.status;
    if (typeof body.timeLimitMinutes !== "undefined")
      data.timeLimitMinutes = body.timeLimitMinutes;

    return prisma.quiz.update({
      where: { id },
      data,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        teacherId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @Delete("/{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Quiz not found")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async deleteQuiz(
    @Request() req: ExRequest,
    @Path() id: number
  ): Promise<{ message: string; id: number } | null> {
    const user = (req as any).user as { id: number; role: string };

    const existing = await prisma.quiz.findUnique({
      where: { id },
      select: { id: true, teacherId: true },
    });
    if (!existing) {
      this.setStatus(404);
      return null;
    }

    if (
      user.role?.toUpperCase() === "TEACHER" &&
      existing.teacherId !== user.id
    ) {
      this.setStatus(403);
      return null;
    }

    await prisma.quiz.delete({ where: { id } });
    return { message: "Quiz deleted", id };
  }
}

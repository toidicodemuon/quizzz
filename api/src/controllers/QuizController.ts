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
}

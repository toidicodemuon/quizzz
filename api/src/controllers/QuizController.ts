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
} from "tsoa";

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
  @Security("bearerAuth")
  @Post("/add")
  public async addQuiz(
    @Body()
    body: {
      title: string;
      description: string | null;
      status: QuizStatus;
      teacherId: number;
      timeLimitMinutes: number;
    }
  ): Promise<QuizSummary> {
    // Ensure only teachers can access this endpoint
    const isTeacher = await prisma.user.findUnique({
      where: { id: body.teacherId },
      select: { role: true },
    });

    if (!isTeacher || isTeacher.role !== "TEACHER") {
      this.setStatus(403); // Forbidden
      throw new Error("Access denied. Only teachers can add quizzes.");
    }

    const newQuiz = await prisma.quiz.create({
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        teacherId: body.teacherId,
        timeLimitMinutes: body.timeLimitMinutes,
      },
    });
    return newQuiz;
  }
}

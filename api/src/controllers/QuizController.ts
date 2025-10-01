import { PrismaClient } from "@prisma/client";
import { Controller, Get, Route, Tags, Response, Security } from "tsoa";

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
}

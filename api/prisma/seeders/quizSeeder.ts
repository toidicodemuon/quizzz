import { PrismaClient, QuizStatus } from "@prisma/client";

/**
 * Create a sample quiz associated with a given teacher. This function
 * assumes that the teacher account already exists in the database.
 *
 * @param prisma Instance of PrismaClient for DB operations.
 * @param teacher The teacher user record returned from seedUsers.
 * @returns The created quiz record.
 */
export async function seedQuiz(prisma: PrismaClient, teacher: { id: number }): Promise<any> {
  const quiz = await prisma.quiz.create({
    data: {
      title: "Đề thi Lập trình JavaScript cơ bản",
      description:
        "Đề kiểm tra kiến thức JavaScript cơ bản: cú pháp, biến, hàm, mảng, vòng lặp, DOM, ES6...",
      timeLimitMinutes: 30,
      status: QuizStatus.PUBLISHED,
      teacherId: teacher.id,
    },
  });
  return quiz;
}
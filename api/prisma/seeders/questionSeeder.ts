import { PrismaClient, QuestionType } from "@prisma/client";

/**
 * Seed N câu hỏi cho từng môn học được truyền vào.
 * - type: SC (single choice)
 * - tạo 4 đáp án, 1 đáp án đúng ngẫu nhiên
 */
export async function seedQuestionsBySubjects(
  prisma: PrismaClient,
  subjects: Array<{ id: number; name: string }>,
  perSubject = 20
): Promise<void> {
  for (const s of subjects) {
    for (let i = 1; i <= perSubject; i++) {
      const q = await prisma.question.create({
        data: {
          subjectId: s.id,
          type: QuestionType.SC,
          text: `[${s.name}] Câu hỏi ${i}: chọn đáp án đúng`,
          explanation: `Giải thích cho câu hỏi ${i} (${s.name}).`,
        },
        select: { id: true },
      });

      const correctIndex = Math.floor(Math.random() * 4);
      const choices = Array.from({ length: 4 }).map((_, idx) => ({
        questionId: q.id,
        content: `Đáp án ${idx + 1}`,
        isCorrect: idx === correctIndex,
        order: idx,
      }));
      await prisma.choice.createMany({ data: choices });
    }
  }
}

import { PrismaClient, Subject } from "@prisma/client";

/**
 * Tạo một Exam mẫu gắn với teacher (author).
 */
export async function seedQuiz(
  prisma: PrismaClient,
  teacher: { id: number },
  opts?: { title?: string; subject?: Subject; description?: string }
): Promise<{
  id: number;
  title: string;
  subject: Subject;
  description: string | null;
  authorId: number | null;
}> {
  const exam = await prisma.exam.create({
    data: {
      title: opts?.title ?? "Đề thi Lập trình JavaScript cơ bản",
      subject: opts?.subject ?? Subject.IT,
      description:
        opts?.description ??
        "Đề kiểm tra kiến thức JavaScript cơ bản: cú pháp, biến, hàm, mảng, vòng lặp, DOM, ES6...",
      authorId: teacher.id,
    },
    select: {
      id: true,
      title: true,
      subject: true,
      description: true,
      authorId: true,
    },
  });
  return exam;
}

import { PrismaClient } from "@prisma/client";

/**
 * Xoá dữ liệu theo đúng thứ tự phụ thuộc khoá ngoại của schema mới.
 * Chú ý: cần xoá bảng mapping/trung gian trước để tránh lỗi RST/Restrict.
 */
export async function clearData(prisma: PrismaClient): Promise<void> {
  // Attempt -> AttemptAnswer -> AttemptAnswerChoice
  await prisma.attemptAnswerChoice.deleteMany();
  await prisma.attemptAnswer.deleteMany();
  await prisma.attempt.deleteMany();

  // Room phụ thuộc Exam
  await prisma.room.deleteMany();

  // ExamQuestion phụ thuộc Exam và Question (Restrict phía Question)
  await prisma.examQuestion.deleteMany();

  // Choice phụ thuộc Question (Cascade, nhưng xoá tường minh để chắc chắn)
  await prisma.choice.deleteMany();

  // Question có thể bị Restrict bởi ExamQuestion nếu còn dữ liệu
  await prisma.question.deleteMany();

  // Exam cuối cùng (Room/Attempt/ExamQuestion đã xoá)
  await prisma.exam.deleteMany();

  // User (author/creator được SetNull nên có thể xoá cuối cùng)
  await prisma.user.deleteMany();
}

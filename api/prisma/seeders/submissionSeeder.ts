import { AttemptStatus, PrismaClient } from "@prisma/client";

/**
 * Tạo một Attempt cho student trong một Room của Exam.
 * Chọn đáp án ngẫu nhiên (60% ưu tiên đúng) và tính điểm phần trăm.
 */
export async function seedSubmission(
  prisma: PrismaClient,
  student: { id: number },
  exam: { id: number },
  createdQuestions: Array<{
    id: number;
    choices: Array<{ id: number; isCorrect: boolean }>;
  }>
) {
  // Tạo một phòng thi cho exam
  const room = await prisma.room.create({
    data: {
      examId: exam.id,
      code: `ROOM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      shuffleQuestions: true,
      shuffleChoices: true,
      maxAttempts: 1,
    },
  });

  // Tạo attempt cho student
  const attempt = await prisma.attempt.create({
    data: {
      roomId: room.id,
      examId: exam.id,
      studentId: student.id,
      status: AttemptStatus.IN_PROGRESS,
    },
  });

  let earnedTotal = 0;
  const perQuestionPoint = 1; // khớp với ExamQuestion.points mặc định

  for (const q of createdQuestions) {
    const correct = q.choices.find((c) => c.isCorrect) ?? q.choices[0];
    const chooseCorrect = Math.random() < 0.6;
    const selected = chooseCorrect
      ? correct
      : q.choices[Math.floor(Math.random() * q.choices.length)];
    const isCorrect = Boolean(selected?.isCorrect);
    const earned = isCorrect ? perQuestionPoint : 0;

    const aa = await prisma.attemptAnswer.create({
      data: {
        attemptId: attempt.id,
        questionId: q.id,
        isCorrect,
        earned,
      },
    });

    await prisma.attemptAnswerChoice.create({
      data: { attemptAnswerId: aa.id, choiceId: selected.id },
    });

    earnedTotal += earned;
  }

  const totalPoints = createdQuestions.length * perQuestionPoint;
  const scorePercent = (earnedTotal / totalPoints) * 100;

  const updatedAttempt = await prisma.attempt.update({
    where: { id: attempt.id },
    data: {
      status: AttemptStatus.SUBMITTED,
      submittedAt: new Date(),
      timeTakenSec: Math.floor(300 + Math.random() * 600),
      score: Number(scorePercent.toFixed(2)),
    },
  });

  return { room, attempt: updatedAttempt };
}

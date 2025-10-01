import { PrismaClient } from "@prisma/client";

/**
 * Seed a submission for a student on a specific quiz. This function selects
 * an answer for each question randomly, with a 60% chance of choosing the
 * correct answer. It then calculates the overall score as a percentage and
 * updates the submission record.
 *
 * @param prisma Instance of PrismaClient for DB operations.
 * @param student The student user record returned from seedUsers.
 * @param quiz The quiz record returned from seedQuiz.
 * @param createdQuestions List of question records created by seedQuestionsWithAnswers.
 * @returns The created and updated submission record.
 */
export async function seedSubmission(
  prisma: PrismaClient,
  student: { id: number },
  quiz: { id: number },
  createdQuestions: any[]
): Promise<any> {
  let correctCount = 0;

  const submission = await prisma.submission.create({
    data: {
      score: 0,
      studentId: student.id,
      quizId: quiz.id,
      submissionAnswers: {
        create: createdQuestions.map((q: any) => {
          const correct = q.answers.find((a: any) => a.isCorrect);
          const random = Math.random() < 0.6;
          const selected =
            random && correct
              ? correct
              : q.answers[Math.floor(Math.random() * q.answers.length)];
          if (selected.isCorrect) correctCount++;
          return { questionId: q.id, selectedAnswerId: selected.id };
        }),
      },
    },
  });

  // Calculate percentage score and update submission.
  const score = (correctCount / createdQuestions.length) * 100;
  await prisma.submission.update({
    where: { id: submission.id },
    data: { score },
  });

  return submission;
}
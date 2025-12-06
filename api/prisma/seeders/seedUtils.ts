/* eslint-disable */
import { PrismaClient, QuestionType } from "@prisma/client";

export type ChoiceSeed = { content: string; isCorrect: boolean };
export type QuestionSeed = {
  text: string;
  explanation: string;
  choices: ChoiceSeed[]; // exactly 4
};

/**
 * Ensure a single-choice question with 4 choices exists.
 * Idempotent by (subjectId, text, authorId, type).
 * If choices already exist, it won't duplicate them.
 */
export async function ensureQuestionWithChoices(
  prisma: PrismaClient,
  subjectId: number,
  authorId: number,
  q: QuestionSeed
): Promise<void> {
  const existing = await prisma.question.findFirst({
    where: { subjectId, text: q.text, type: QuestionType.SC, authorId },
    select: { id: true },
  });

  const questionId =
    existing?.id ??
    (
      await prisma.question.create({
        data: {
          subjectId,
          type: QuestionType.SC,
          text: q.text,
          explanation: q.explanation,
          authorId,
        },
        select: { id: true },
      })
    ).id;

  const count = await prisma.choice.count({ where: { questionId } });

  if (count === 0) {
    const data = q.choices.map((c, idx) => ({
      questionId,
      content: c.content,
      isCorrect: c.isCorrect,
      order: idx,
    }));
    await prisma.choice.createMany({ data });
  }
}

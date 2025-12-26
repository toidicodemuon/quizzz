/* eslint-disable */
import { PrismaClient } from "@prisma/client";
import { ensureQuestionWithChoices, type QuestionSeed } from "../seedUtils";
import questions from "./data/TH10L.seed.json";

export async function seedTH10L(prisma: PrismaClient, subjectId: number, authorId: number): Promise<void> {
  for (const q of questions as QuestionSeed[]) {
    await ensureQuestionWithChoices(prisma, subjectId, authorId, q);
  }
}

/* eslint-disable */
import { PrismaClient } from "@prisma/client";
import { ensureQuestionWithChoices, type QuestionSeed } from "../seedUtils";
import questions from "./data/TH04L.seed.json";

export async function seedTH04L(prisma: PrismaClient, subjectId: number, authorId: number): Promise<void> {
  for (const q of questions as QuestionSeed[]) {
    await ensureQuestionWithChoices(prisma, subjectId, authorId, q);
  }
}

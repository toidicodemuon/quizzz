import { PrismaClient } from "@prisma/client";

/**
 * Remove all existing records from the database. This function is called
 * before seeding new data to ensure a clean state. If you have foreign
 * key constraints, the order here matters to avoid conflicts.
 *
 * @param prisma Instance of PrismaClient used for database operations.
 */
export async function clearData(prisma: PrismaClient): Promise<void> {
  await prisma.submissionAnswer.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.user.deleteMany();
}
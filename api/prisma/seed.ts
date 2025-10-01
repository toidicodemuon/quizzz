import { PrismaClient } from "@prisma/client";
import { clearData } from "./seeders/clearData";
import { seedUsers } from "./seeders/userSeeder";
import { seedQuiz } from "./seeders/quizSeeder";
import { seedQuestionsWithAnswers } from "./seeders/questionSeeder";
import { seedSubmission } from "./seeders/submissionSeeder";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");
  await clearData(prisma);
  console.log("🧹 Đã xóa dữ liệu cũ.");
  const { teacher, student } = await seedUsers(prisma);
  const quiz = await seedQuiz(prisma, teacher);
  const createdQuestions = await seedQuestionsWithAnswers(prisma, quiz);
  await seedSubmission(prisma, student, quiz, createdQuestions);
  console.log("✨ Seed hoàn tất!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });

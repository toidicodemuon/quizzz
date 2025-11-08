import { PrismaClient } from "@prisma/client";
import { clearData } from "./seeders/clearData";
import { seedUsers } from "./seeders/userSeeder";
import { seedQuiz } from "./seeders/quizSeeder";
import { seedAdvancedQuestionsWithAnswers, seedQuestionsWithAnswers } from "./seeders/questionSeeder";
import { seedSubmission } from "./seeders/submissionSeeder";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database (new schema)...");
  await clearData(prisma);
  console.log("🧹 Đã xoá dữ liệu cũ.");

  const { teacher, student } = await seedUsers(prisma);
  console.log("👥 Đã tạo người dùng mẫu.");

  const examBasic = await seedQuiz(prisma, teacher, {
    title: "Chứng chỉ Ứng dụng CNTT Cơ bản",
    description: "Đề thi chuẩn kỹ năng sử dụng CNTT cơ bản: hệ điều hành, Internet, Word, Excel, PowerPoint, an toàn thông tin.",
  });
  const examAdvanced = await seedQuiz(prisma, teacher, {
    title: "Chứng chỉ Ứng dụng CNTT Nâng cao",
    description: "Đề thi kỹ năng CNTT nâng cao: hàm Excel, PivotTable, Mail Merge, Slide Master, bảo mật, mạng máy tính.",
  });
  console.log("📝 Đã tạo 2 Exam: Cơ bản & Nâng cao.");

  const basicQuestions = await seedQuestionsWithAnswers(prisma, examBasic);
  console.log(`❓ Cơ bản: ${basicQuestions.length} câu hỏi.`);

  const advancedQuestions = await seedAdvancedQuestionsWithAnswers(prisma, examAdvanced);
  console.log(`❓ Nâng cao: ${advancedQuestions.length} câu hỏi.`);

  await seedSubmission(prisma, student, examBasic, basicQuestions);
  console.log("✅ Đã tạo Room + Attempt mẫu cho đề Cơ bản, tính điểm.");

  console.log("✨ Seed hoàn tất!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });

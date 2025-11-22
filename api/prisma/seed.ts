import { PrismaClient } from "@prisma/client";
import { clearData } from "./seeders/clearData";
import { seedUsers } from "./seeders/userSeeder";
import { seedSubjects } from "./seeders/subjectSeeder";
import { seedQuestionsBySubjects } from "./seeders/questionSeeder";
import { seedExamsWithQuestions } from "./seeders/examSeeder";
import { seedRoomsAndAttempts } from "./seeders/roomAttemptSeeder";

const prisma = new PrismaClient();

async function main() {
  await clearData(prisma);

  const subjects = await seedSubjects(prisma);
  console.log(`Seeded ${subjects.length} subjects`);

  const users = await seedUsers(prisma, subjects);
  console.log("Seeded users:", users);

  await seedQuestionsBySubjects(
    prisma,
    subjects.map((s) => ({ id: s.id, name: s.name })),
    users.teacher.id,
    20
  );
  console.log("Seeded questions for all subjects");

  // Create 54 exams across 18 subjects (or distribute across available subjects)
  const exams = await seedExamsWithQuestions(
    prisma,
    subjects.map((s) => ({ id: s.id, name: s.name })),
    users.teacher.id,
    54
  );
  console.log(`Seeded ${exams.length} exams with questions`);

  // Create one room per exam, and attempts for 12 seeded students
  await seedRoomsAndAttempts(
    prisma,
    exams,
    users.teacher.id,
    users.students.map((s) => ({ id: s.id })),
    5
  );
  console.log("Seeded rooms and attempts for seeded students");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

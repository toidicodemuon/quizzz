import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { clearData } from "./seeders/clearData";
import { seedUsers } from "./seeders/userSeeder";
import { SUBJECTS, seedSubjects } from "./seeders/subjectSeeder";
import { seedExamsWithQuestions } from "./seeders/examSeeder";
import { seedRoomsAndAttempts } from "./seeders/roomAttemptSeeder";

dotenv.config({ path: "./.env" });

const prisma = new PrismaClient();

async function main() {
  await clearData(prisma);

  const createdSubjects = [];
  for (const s of SUBJECTS) {
    let subject = await prisma.subject.findFirst({
      where: { code: s.code },
    });
    if (!subject) {
      subject = await prisma.subject.create({
        data: { name: s.name, code: s.code },
      });
    }
    createdSubjects.push(subject);
  }
  console.log(`Created ${createdSubjects.length} subjects`);

  const users = await seedUsers(prisma, createdSubjects);
  console.log("Seeded users:", users);

  console.log("Seeding questions for subjects...");
  await seedSubjects(prisma, users.teacher.id);
  console.log("Seeded questions for all subjects");

  // Create 54 exams across 18 subjects (or distribute across available subjects)
  const exams = await seedExamsWithQuestions(
    prisma,
    createdSubjects.map((s) => ({
      id: s.id,
      name: s.name,
      code: s.code,
    })),
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

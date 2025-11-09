import { PrismaClient } from "@prisma/client";
import { clearData } from "./seeders/clearData";
import { seedUsers } from "./seeders/userSeeder";
import { seedSubjects } from "./seeders/subjectSeeder";
import { seedQuestionsBySubjects } from "./seeders/questionSeeder";

const prisma = new PrismaClient();

async function main() {
  await clearData(prisma);

  const users = await seedUsers(prisma);
  console.log("Seeded users:", users);

  const subjects = await seedSubjects(prisma);
  console.log(`Seeded ${subjects.length} subjects`);

  await seedQuestionsBySubjects(
    prisma,
    subjects.map((s) => ({ id: s.id, name: s.name })),
    20
  );
  console.log("Seeded questions for all subjects");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

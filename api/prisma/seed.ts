import { PrismaClient } from "@prisma/client";
import userSeeder from "./seeders/userSeeder";
const prisma = new PrismaClient();

async function main() {
  await userSeeder(prisma);
  //await resultPW655Seeder(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

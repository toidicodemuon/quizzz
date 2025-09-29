import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
export default async function userSeeder(prisma: PrismaClient) {
  const usersData = Array.from({ length: 10 }).map(() => ({
    username: faker.person.lastName() + "_" + faker.person.firstName(),
    fullname: faker.person.fullName(),
    hashPwd: faker.internet.password(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
  }));

  await prisma.user.createMany({
    data: usersData,
  });

  console.log("Seed data created");
}

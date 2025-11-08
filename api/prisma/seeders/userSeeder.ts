import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

/**
 * Tạo tài khoản mẫu phù hợp schema mới (User.email, User.password, Role enum).
 * Mặc định lưu password dạng hash vào trường `password`.
 */
export async function seedUsers(prisma: PrismaClient) {
  const hash = (pwd: string) => bcrypt.hash(pwd, 10);
  const [teacherPassword, studentPassword, adminPassword] = await Promise.all([
    hash("123456"),
    hash("123456"),
    hash("123456"),
  ]);

  const teacher = await prisma.user.create({
    data: {
      email: "teacher1@example.com",
      password: teacherPassword,
      fullName: "Nguyễn Văn Giáo Viên",
      role: Role.TEACHER,
    },
  });

  const student = await prisma.user.create({
    data: {
      email: "student1@example.com",
      password: studentPassword,
      fullName: "Trần Văn Học Sinh",
      role: Role.STUDENT,
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: adminPassword,
      fullName: "System Administrator",
      role: Role.ADMIN,
    },
  });

  return { teacher, student, admin };
}

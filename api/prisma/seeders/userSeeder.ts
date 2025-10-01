// seeder/userSeeder.ts
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

/**
 * Seed initial user accounts dựa trên schema User mới.
 * Luôn tạo mới teacher/student (nếu chạy nhiều lần sẽ báo lỗi do unique constraint).
 */
export async function seedUsers(prisma: PrismaClient) {
  const teacherPassword = await bcrypt.hash("123456", 10);
  const studentPassword = await bcrypt.hash("123456", 10);

  const teacher = await prisma.user.create({
    data: {
      username: "teacher1",
      email: "teacher1@example.com",
      passwordHash: teacherPassword,
      fullName: "Nguyễn Văn Giáo Viên",
      avatarUrl: "https://example.com/avatar-teacher1.png",
      role: UserRole.TEACHER,
      isActive: true,
      lastLogin: new Date(),
    },
  });

  const student = await prisma.user.create({
    data: {
      username: "student1",
      email: "student1@example.com",
      passwordHash: studentPassword,
      fullName: "Trần Văn Học Sinh",
      avatarUrl: "https://example.com/avatar-student1.png",
      role: UserRole.STUDENT,
      isActive: true,
      lastLogin: new Date(),
    },
  });

  return { teacher, student };
}

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
      userCode: "GV001",
      role: Role.TEACHER,
    },
  });

  const prefixes = ["MSEX", "MSWO", "MOSPP", "PT", "THL10", "THCB"];
  // Create 12 students (only keep id for downstream usage)
  const students: Array<{ id: number }> = [];
  for (let i = 1; i <= 12; i++) {
    const pfx = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = String(i).padStart(3, "0");
    const s = await prisma.user.create({
      data: {
        email: `student${i}@example.com`,
        password: studentPassword,
        fullName: `Sinh viên ${i}`,
        userCode: `${pfx}${num}`,
        role: Role.STUDENT,
      },
      select: { id: true },
    });
    students.push({ id: s.id });
  }

  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: adminPassword,
      fullName: "System Administrator",
      userCode: "ADM001",
      role: Role.ADMIN,
    },
  });

  return { teacher, students, admin };
}

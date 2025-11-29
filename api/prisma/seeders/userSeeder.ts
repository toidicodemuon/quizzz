import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

/**
 * Tạo tài khoản mẫu phù hợp schema mới (User.email, User.password, Role enum).
 * Mặc định lưu password dạng hash vào trường `password`.
 * Sinh 150 học viên, mỗi học viên gắn với một môn (subjectId), mã SV có prefix theo mã môn.
 */
export async function seedUsers(
  prisma: PrismaClient,
  subjects: Array<{ id: number; name: string; code: string | null }>
) {
  const hash = (pwd: string) => bcrypt.hash(pwd, 10);
  const [teacherPassword, studentPassword, adminPassword] = await Promise.all([
    hash("Thu#$3"),
    hash("Thu#$3"),
    hash("Thu#$3"),
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

  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase();

  // Tạo 150 học viên, phân bổ đều theo danh sách môn
  const students: Array<{ id: number }> = [];
  const totalStudents = 150;
  for (let i = 1; i <= totalStudents; i++) {
    const subject = subjects[(i - 1) % subjects.length];
    const basePrefix = normalize(subject.code || subject.name || "SUBJ");
    const prefix = basePrefix.slice(0, 6) || "SUBJ";
    const num = String(i).padStart(3, "0");
    const s = await prisma.user.create({
      data: {
        email: `student${i}@example.com`,
        password: studentPassword,
        fullName: `Sinh viên ${subject.name} #${i}`,
        userCode: `${prefix}${num}`,
        subjectId: subject.id,
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
      userCode: "admw1",
      role: Role.ADMIN,
    },
  });

  return { teacher, students, admin };
}

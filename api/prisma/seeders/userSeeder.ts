import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

/**
 * Tạo tài khoản mẫu phù hợp schema mới (User.email, User.password, Role enum).
 * Mục đích lưu password dạng hash vào trường `password`.
 * Sinh 150 học viên, mỗi học viên gắn với một môn (subjectId), mã SV theo công thức "HV" + code môn + số thứ tự.
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

  // Tạo 150 học viên, phân bổ đều theo danh sách môn
  const students: Array<{ id: number }> = [];
  const totalStudents = 150;
  const subjectCounters = new Map<number, number>();
  for (let i = 1; i <= totalStudents; i++) {
    const subject = subjects[(i - 1) % subjects.length];
    const current = (subjectCounters.get(subject.id) || 0) + 1;
    subjectCounters.set(subject.id, current);

    const subjectCode = (subject.code || "SUBJ").toUpperCase();
    const num = String(current).padStart(3, "0");
    const s = await prisma.user.create({
      data: {
        email: `student${i}@example.com`,
        password: studentPassword,
        fullName: `Sinh viên ${subject.name} #${i}`,
        userCode: `HV${subjectCode}${num}`,
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

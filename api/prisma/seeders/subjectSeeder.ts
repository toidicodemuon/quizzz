import { PrismaClient } from "@prisma/client";

export type SubjectRow = { id: number; name: string; code: string | null };

// Danh sách môn học theo yêu cầu
const subjectNames: string[] = [
  "Tin học cơ bản",
  "Tin học nâng cao",
  "Tin học lớp 3",
  "Tin học lớp 4",
  "Tin học lớp 5",
  "Tin học lớp 6",
  "Tin học lớp 7",
  "Tin học lớp 8",
  "Tin học lớp 9",
  "Tin học lớp 10",
  "Tin học lớp 11",
  "Tin học lớp 12",
  "Lập trình Scratch",
  "Lập trình Python",
  "MOS Word",
  "MOS Excel",
  "MOS PowerPoint",
];

function makeCode(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .toUpperCase();
}

export async function seedSubjects(
  prisma: PrismaClient
): Promise<SubjectRow[]> {
  // Xóa Subject cũ (Question sẽ được xóa trong clearData)
  await prisma.subject.deleteMany();
  const created: SubjectRow[] = [];
  for (const name of subjectNames) {
    const s = await prisma.subject.create({
      data: { name, code: makeCode(name) },
      select: { id: true, name: true, code: true },
    });
    created.push(s);
  }
  return created;
}

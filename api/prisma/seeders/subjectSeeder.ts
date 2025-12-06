/* eslint-disable */
import { PrismaClient } from "@prisma/client";
import { seedTHCB } from "./subjects/THCB.seed";
import { seedTHNC } from "./subjects/THNC.seed";
import { seedTH03L } from "./subjects/TH03L.seed";
import { seedTH04L } from "./subjects/TH04L.seed";
import { seedTH05L } from "./subjects/TH05L.seed";
import { seedTH06L } from "./subjects/TH06L.seed";
import { seedTH07L } from "./subjects/TH07L.seed";
import { seedTH08 } from "./subjects/TH08.seed";
import { seedTH09L } from "./subjects/TH09L.seed";
import { seedTH10L } from "./subjects/TH10L.seed";
import { seedTH11L } from "./subjects/TH11L.seed";
import { seedTH12L } from "./subjects/TH12L.seed";
import { seedSCRA } from "./subjects/SCRA.seed";
import { seedPYTH } from "./subjects/PYTH.seed";
import { seedMOSW } from "./subjects/MOSW.seed";
import { seedMOSE } from "./subjects/MOSE.seed";
import { seedMOSP } from "./subjects/MOSP.seed";

export const SUBJECTS: ReadonlyArray<{ name: string; code: string }> = [
  {
    name: "Tin học cơ bản",
    code: "THCB",
  },
  {
    name: "Tin học nâng cao",
    code: "THNC",
  },
  {
    name: "Tin học lớp 3",
    code: "TH03L",
  },
  {
    name: "Tin học lớp 4",
    code: "TH04L",
  },
  {
    name: "Tin học lớp 5",
    code: "TH05L",
  },
  {
    name: "Tin học lớp 6",
    code: "TH06L",
  },
  {
    name: "Tin học lớp 7",
    code: "TH07L",
  },
  {
    name: "Tin học lớp 8",
    code: "TH08",
  },
  {
    name: "Tin học lớp 9",
    code: "TH09L",
  },
  {
    name: "Tin học lớp 10",
    code: "TH10L",
  },
  {
    name: "Tin học lớp 11",
    code: "TH11L",
  },
  {
    name: "Tin học lớp 12",
    code: "TH12L",
  },
  {
    name: "Lập trình Scratch",
    code: "SCRA",
  },
  {
    name: "Lập trình Python",
    code: "PYTH",
  },
  {
    name: "MOS Word",
    code: "MOSW",
  },
  {
    name: "MOS Excel",
    code: "MOSE",
  },
  {
    name: "MOS PowerPoint",
    code: "MOSP",
  },
];

const seederMap: Record<
  string,
  (prisma: PrismaClient, subjectId: number, authorId: number) => Promise<void>
> = {
  THCB: seedTHCB,
  THNC: seedTHNC,
  TH03L: seedTH03L,
  TH04L: seedTH04L,
  TH05L: seedTH05L,
  TH06L: seedTH06L,
  TH07L: seedTH07L,
  TH08: seedTH08,
  TH09L: seedTH09L,
  TH10L: seedTH10L,
  TH11L: seedTH11L,
  TH12L: seedTH12L,
  SCRA: seedSCRA,
  PYTH: seedPYTH,
  MOSW: seedMOSW,
  MOSE: seedMOSE,
  MOSP: seedMOSP,
};

/**
 * Tạo hoặc lấy subject theo code, sau đó seed câu hỏi cho từng môn.
 * - authorId: id của user mặc định làm tác giả câu hỏi
 */
export async function seedSubjects(
  prisma: PrismaClient,
  authorId: number
): Promise<void> {
  for (const s of SUBJECTS) {
    let subject = await prisma.subject.findFirst({
      where: { code: s.code },
      select: { id: true },
    });
    if (!subject) {
      subject = await prisma.subject.create({
        data: { name: s.name, code: s.code },
        select: { id: true },
      });
    }
    const seeder = seederMap[s.code];
    if (seeder) {
      console.log(`Seeding ${s.name} (${s.code})...`);
      await seeder(prisma, subject.id, authorId);
    } else {
      console.warn(`Không tìm thấy seeder cho ${s.code}`);
    }
  }
}

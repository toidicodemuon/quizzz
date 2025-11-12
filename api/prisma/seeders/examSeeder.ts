import { PrismaClient, ExamStatus } from "@prisma/client";

type SubjectInfo = { id: number; name?: string | null };

function randItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomCode(prefix: string, len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = prefix;
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export async function seedExamsWithQuestions(
  prisma: PrismaClient,
  subjects: SubjectInfo[],
  authorId: number,
  totalExams = 54
): Promise<{ id: number; subjectId: number }[]> {
  if (!subjects.length) return [];
  // Distribute exams across subjects
  const nSubjects = subjects.length;
  const perBase = Math.floor(totalExams / nSubjects);
  const remainder = totalExams % nSubjects;

  const created: { id: number; subjectId: number }[] = [];
  const statuses: ExamStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"] as any;

  for (let i = 0; i < nSubjects; i++) {
    const subj = subjects[i];
    const count = perBase + (i < remainder ? 1 : 0);
    for (let k = 0; k < count; k++) {
      const status = randItem(statuses);
      const code = randomCode("EX");
      const exam = await prisma.exam.create({
        data: {
          title: `${subj.name || "Môn"} - Đề số ${k + 1}`,
          description: `Đề thi cho môn ${subj.name || subj.id}`,
          code,
          status,
          subjectId: subj.id,
          authorId,
          // Defaults requested
          examType: "PRACTICE" as any,
          scoringMode: "STANDARD" as any,
          feedbackMode: "DETAILED" as any,
          showScoreImmediately: true,
          showCorrectAnswers: true,
          showExplanation: true,
          // random optional fields
          passMarkPercent: Math.random() < 0.5 ? 50 + Math.floor(Math.random() * 31) : null,
          reviewWindowMin: Math.random() < 0.5 ? 15 * (1 + Math.floor(Math.random() * 8)) : null,
        },
        select: { id: true },
      });

      // pick 5-20 random questions in this subject
      const totalQs = await prisma.question.count({ where: { subjectId: subj.id } });
      if (totalQs > 0) {
        const limit = Math.max(5, Math.min(20, totalQs));
        const take = Math.floor(Math.random() * (limit - 4)) + 5; // between 5..limit
        // fetch random subset: use offset sampling if many
        const qids = await prisma.question.findMany({
          where: { subjectId: subj.id },
          select: { id: true },
          orderBy: { id: "asc" },
          take: limit, // cap read
        }).then((rows) => rows.map((r) => r.id));
        // shuffle
        for (let j = qids.length - 1; j > 0; j--) {
          const m = Math.floor(Math.random() * (j + 1));
          [qids[j], qids[m]] = [qids[m], qids[j]];
        }
        const selected = qids.slice(0, Math.min(take, qids.length));
        if (selected.length) {
          await prisma.examQuestion.createMany({
            data: selected.map((qid, idx) => ({
              examId: exam.id,
              questionId: qid,
              points: 1.0 as any,
              order: idx,
            })),
          });
        }
      }

      created.push({ id: exam.id, subjectId: subj.id });
    }
  }
  return created;
}


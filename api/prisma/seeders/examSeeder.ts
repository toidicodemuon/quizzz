import { PrismaClient, ExamStatus } from "@prisma/client";

type SubjectInfo = { id: number; name?: string | null; code?: string | null };

function randItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildExamCode(subjectCode: string | null | undefined, idx: number) {
  const base = (subjectCode || "SUBJ").toUpperCase();
  return `DT${base}${String(idx).padStart(3, "0")}`;
}


function normalizeSubjectCode(code: string | null | undefined): string {
  return (code || "").toUpperCase();
}

/**
 * Chuẩn hoá số lượng câu hỏi trắc nghiệm lý thuyết cho từng môn.
 * Dùng để chọn số câu đưa vào mỗi đề thi.
 */
function getTheoryQuestionCountForSubject(
  code: string | null | undefined
): number {
  const c = normalizeSubjectCode(code);
  // Tiểu học: đề trắc nghiệm lý thuyết ~20 câu / 30 phút
  if (["TH03L", "TH04L", "TH05L"].includes(c)) return 20;
  // THCS/THPT + tin học cơ bản/nâng cao: ~30 câu / 45 phút
  if (
    [
      "TH06L",
      "TH07L",
      "TH08",
      "TH09L",
      "TH10L",
      "TH11L",
      "TH12L",
      "THCB",
      "THNC",
    ].includes(c)
  )
    return 30;
  // MOS: ~35 câu / 50 phút (gần với 33–37 task của MOS thật)
  if (["MOSW", "MOSE", "MOSP"].includes(c)) return 35;
  // Lập trình Scratch/Python: nhẹ hơn, khoảng 25 câu
  if (["SCRA", "PYTH"].includes(c)) return 25;

  // Mặc định nếu chưa cấu hình: 30 câu
  return 30;
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
      const passMarkPercent = 50 + Math.floor(Math.random() * 36); // 50 - 85
      const examCode = buildExamCode(subj.code, k + 1);
      const exam = await prisma.exam.create({
        data: {
          title: `${subj.name || "Môn"} - Đề số ${k + 1}`,
          description: `Đề thi cho môn ${subj.name || subj.id}`,
          code: examCode,
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
          // luôn có ngưỡng đậu/rớt để giao diện hiển thị
          passMarkPercent,
          reviewWindowMin:
            Math.random() < 0.5
              ? 15 * (1 + Math.floor(Math.random() * 8))
              : null,
        },
        select: { id: true },
      });

      // pick standardized number of random questions in this subject
      const totalQs = await prisma.question.count({
        where: { subjectId: subj.id },
      });
      if (totalQs > 0) {
        const desired = getTheoryQuestionCountForSubject(subj.code);
        const take = Math.min(desired, totalQs);
        if (take > 0) {
          // fetch all question ids for this subject, sau đó chọn ngẫu nhiên
          const qids = await prisma.question
            .findMany({
              where: { subjectId: subj.id },
              select: { id: true },
              orderBy: { id: "asc" },
            })
            .then((rows) => rows.map((r) => r.id));
          // shuffle
          for (let j = qids.length - 1; j > 0; j--) {
            const m = Math.floor(Math.random() * (j + 1));
            [qids[j], qids[m]] = [qids[m], qids[j]];
          }
          const selected = qids.slice(0, take);
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
      }

      created.push({ id: exam.id, subjectId: subj.id });
    }
  }
  return created;
}

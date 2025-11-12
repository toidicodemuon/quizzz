import { PrismaClient, AttemptStatus } from "@prisma/client";

function randomCode(prefix: string, len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = prefix;
  for (let i = 0; i < len; i++)
    s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export async function seedRoomsAndAttempts(
  prisma: PrismaClient,
  exams: { id: number; subjectId: number }[],
  teacherId: number,
  students: Array<{ id: number }>,
  attemptPerStudent = 5
) {
  // create one room per exam
  const rooms = await Promise.all(
    exams.map(async (ex) => {
      const code = randomCode("R");
      const room = await prisma.room.create({
        data: {
          examId: ex.id,
          code,
          openAt: null,
          closeAt: null,
          createdById: teacherId,
          durationSec: 60 * 30, // default 30 min
          shuffleChoices: true,
          shuffleQuestions: true,
          maxAttempts: 1,
        },
        select: { id: true, examId: true },
      });
      return room;
    })
  );

  // Map exam index to published status for selection
  const examsFull = await prisma.exam.findMany({
    where: { id: { in: exams.map((e) => e.id) } },
    select: { id: true, status: true },
  });
  const isPublished = new Map<number, boolean>();
  for (const e of examsFull) isPublished.set(e.id, e.status === "PUBLISHED");

  function shuffle<T>(arr: T[]): T[] {
    for (let j = arr.length - 1; j > 0; j--) {
      const m = Math.floor(Math.random() * (j + 1));
      [arr[j], arr[m]] = [arr[m], arr[j]];
    }
    return arr;
  }

  // For each student, create attempts on a subset of published exams
  for (const s of students) {
    const pubIdxs = exams
      .map((ex, idx) => ({ idx, ex }))
      .filter(({ ex }) => isPublished.get(ex.id))
      .map(({ idx }) => idx);
    const fallbackIdxs = exams.map((_, idx) => idx);
    const pool = pubIdxs.length > 0 ? pubIdxs : fallbackIdxs;
    const count = Math.max(2, Math.min(attemptPerStudent, pool.length));
    const chosen = shuffle([...pool]).slice(0, count);
    for (const i of chosen) {
      const ex = exams[i];
      const room = rooms[i];
      // Load exam questions with choices and points
      const eqs = await prisma.examQuestion.findMany({
        where: { examId: ex.id },
        select: {
          questionId: true,
          points: true,
          question: {
            select: {
              choices: {
                select: { id: true, isCorrect: true, order: true },
                orderBy: { order: "asc" },
              },
            },
          },
        },
      });
      if (!eqs.length) continue;
      const started = new Date(
        Date.now() - (5 + Math.floor(Math.random() * 60)) * 60000
      );
      const attempt = await prisma.attempt.create({
        data: {
          roomId: room.id,
          examId: ex.id,
          studentId: s.id,
          status: AttemptStatus.IN_PROGRESS,
          startedAt: started,
        },
      });
      let earnedTotal = 0;
      for (const q of eqs) {
        const choices = (q as any).question.choices as Array<{
          id: number;
          isCorrect: boolean;
        }>;
        if (!choices?.length) continue;
        // 60% chance pick a correct answer, else wrong
        const pickCorrect =
          Math.random() < 0.6 && choices.some((c) => c.isCorrect);
        let picked = choices[0];
        if (pickCorrect) {
          picked = choices.find((c) => c.isCorrect) || choices[0];
        } else {
          const wrongs = choices.filter((c) => !c.isCorrect);
          picked = wrongs.length
            ? wrongs[Math.floor(Math.random() * wrongs.length)]
            : choices[Math.floor(Math.random() * choices.length)];
        }
        const correct = !!picked.isCorrect;
        const earned = correct ? Number(q.points as any) : 0;
        const aa = await prisma.attemptAnswer.create({
          data: {
            attemptId: attempt.id,
            questionId: q.questionId,
            isCorrect: correct,
            earned: earned as any,
          },
        });
        await prisma.attemptAnswerChoice.create({
          data: { attemptAnswerId: aa.id, choiceId: picked.id },
        });
        earnedTotal += earned;
      }
      const duration = 300 + Math.floor(Math.random() * 1200);
      const submitted = new Date(started.getTime() + duration * 1000);
      const totalPoints =
        eqs.reduce((sum, r) => sum + Number(r.points as any), 0) || 1;
      const percent = (earnedTotal / totalPoints) * 100;
      await prisma.attempt.update({
        where: { id: attempt.id },
        data: {
          status: AttemptStatus.SUBMITTED,
          submittedAt: submitted,
          timeTakenSec: duration,
          score: Number(percent.toFixed(2)) as any,
        },
      });
    }
  }
}

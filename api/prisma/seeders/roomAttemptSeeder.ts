import { PrismaClient, AttemptStatus } from "@prisma/client";

function randomCode(prefix: string, len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = prefix;
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export async function seedRoomsAndAttempts(
  prisma: PrismaClient,
  exams: { id: number; subjectId: number }[],
  teacherId: number,
  studentId: number,
  attemptCount = 14
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

  // Prefer attempts on PUBLISHED exams to exercise locking logic
  const examsFull = await prisma.exam.findMany({
    where: { id: { in: exams.map((e) => e.id) } },
    select: { id: true, status: true },
  });
  const publishedIdxs: number[] = [];
  const otherIdxs: number[] = [];
  for (let i = 0; i < exams.length; i++) {
    const ex = exams[i];
    const st = examsFull.find((e) => e.id === ex.id)?.status || "DRAFT";
    if (st === "PUBLISHED") publishedIdxs.push(i);
    else otherIdxs.push(i);
  }
  // shuffle helper
  const shuffle = (arr: number[]) => {
    for (let j = arr.length - 1; j > 0; j--) {
      const m = Math.floor(Math.random() * (j + 1));
      [arr[j], arr[m]] = [arr[m], arr[j]];
    }
    return arr;
  };
  shuffle(publishedIdxs);
  shuffle(otherIdxs);
  const chosen: number[] = [];
  const needed = Math.min(Math.max(0, attemptCount), exams.length);
  for (const i of publishedIdxs) {
    if (chosen.length >= needed) break;
    chosen.push(i);
  }
  for (const i of otherIdxs) {
    if (chosen.length >= needed) break;
    chosen.push(i);
  }

  for (const i of chosen) {
    const ex = exams[i];
    const room = rooms[i];
    const started = new Date(Date.now() - (5 + Math.floor(Math.random() * 60)) * 60000);
    const duration = 300 + Math.floor(Math.random() * 1200); // 5-25 min
    const submitted = new Date(started.getTime() + duration * 1000);
    const score = Number((30 + Math.random() * 70).toFixed(2));
    await prisma.attempt.create({
      data: {
        roomId: room.id,
        examId: ex.id,
        studentId,
        status: AttemptStatus.SUBMITTED,
        startedAt: started,
        submittedAt: submitted,
        score: score as any,
        timeTakenSec: duration,
      },
    });
  }
}

import { prisma } from "../utils/prisma";
import { Body, Controller, Delete, Get, Path, Post, Request, Response, Route, Security, Tags, Query } from "tsoa";
import { AttemptStatus } from "@prisma/client";
import { Request as ExRequest } from "express";

type AttemptSummary = {
  id: number;
  score: number | null; // Decimal
  startedAt: Date;
  submittedAt: Date | null;
  timeTakenSec: number | null;
  studentId: number;
  examId: number;
  roomId: number;
  status: AttemptStatus;
  studentName?: string | null;
  studentEmail?: string | null;
  studentCode?: string | null;
  examCode?: string | null;
  examTitle?: string | null;
  correctCount?: number;
  totalQuestions?: number;
  passMarkPercent?: number | null;
  pass?: boolean | null;
  answerCount?: number | null;
};

const attemptAlreadySubmittedError = () => {
  const err: any = new Error("Attempt already submitted for this room");
  err.status = 400;
  err.code = "ATTEMPT_ALREADY_SUBMITTED";
  return err;
};

const roomClosedError = (message = "Room is closed") => {
  const err: any = new Error(message);
  err.status = 403;
  err.code = "ROOM_CLOSED";
  return err;
};

const attemptExpiredError = () => {
  const err: any = new Error("Attempt duration exceeded");
  err.status = 400;
  err.code = "ATTEMPT_EXPIRED";
  return err;
};

function ensureRoomActive(
  room: {
    openAt: Date | null;
    closeAt: Date | null;
    exam?: { status?: string | null };
  },
  now = new Date()
) {
  if (room.exam && room.exam.status !== "PUBLISHED") {
    throw roomClosedError("Exam is not published");
  }
  if (room.openAt && now < room.openAt) {
    throw roomClosedError("Room not open yet");
  }
  if (room.closeAt && now > room.closeAt) {
    throw roomClosedError("Room already closed");
  }
}

@Route("attempts")
@Tags("Attempt")
export class AttemptController extends Controller {
  @Get("/")
  @Response<null>(401, "Unauthorized")
  @Security("bearerAuth")
  public async listSubmissions(
    @Request() req: ExRequest,
    @Query() examId?: number,
    @Query() roomId?: number,
    @Query() page?: number,
    @Query() pageSize?: number
  ): Promise<{ items: AttemptSummary[]; total: number }> {
    const user = (req as any).user as { id: number; role: string };
    const role = user.role?.toUpperCase();
    const take = Math.max(1, Math.min(100, Number(pageSize) || 50));
    const skip = Math.max(0, ((Number(page) || 1) - 1) * take);

    if (role === "ADMIN") {
      const where: any = {};
      if (typeof examId === 'number') where.examId = examId;
      if (typeof roomId === 'number') where.roomId = roomId;
      const [raw, total] = await Promise.all([
        prisma.attempt.findMany({
          where,
          select: {
            id: true,
            score: true,
            startedAt: true,
            submittedAt: true,
            timeTakenSec: true,
            studentId: true,
            examId: true,
            roomId: true,
            status: true,
            student: { select: { fullName: true, email: true, userCode: true } },
            exam: { select: { code: true, title: true, passMarkPercent: true } },
          },
          orderBy: { id: "asc" },
          skip,
          take,
        }),
        prisma.attempt.count({ where }),
      ]);
      // compute counts
      const attemptIds = raw.map((r) => r.id);
      const examIds = Array.from(new Set(raw.map((r) => r.examId)));
      const [correctGroups, totalGroups, answerGroups] = await Promise.all([
        prisma.attemptAnswer.groupBy({ by: ["attemptId"], where: { attemptId: { in: attemptIds }, isCorrect: true }, _count: { _all: true } }),
        prisma.examQuestion.groupBy({ by: ["examId"], where: { examId: { in: examIds } }, _count: { _all: true } }),
        prisma.attemptAnswer.groupBy({ by: ["attemptId"], where: { attemptId: { in: attemptIds } }, _count: { _all: true } }),
      ]);
      const correctMap = new Map<number, number>();
      for (const g of correctGroups as any) correctMap.set(g.attemptId, Number(g._count._all || 0));
      const totalMap = new Map<number, number>();
      for (const g of totalGroups as any) totalMap.set(g.examId, Number(g._count._all || 0));
      const answerCountMap = new Map<number, number>();
      for (const g of answerGroups as any) answerCountMap.set(g.attemptId, Number(g._count._all || 0));

      const items = raw.map((i) => ({
        ...i,
        score: i.score === null ? null : Number(i.score as any),
        studentName: (i as any).student?.fullName ?? null,
        studentEmail: (i as any).student?.email ?? null,
        studentCode: (i as any).student?.userCode ?? null,
        exam: undefined,
        examCode: (i as any).exam?.code ?? null,
        examTitle: (i as any).exam?.title ?? null,
        passMarkPercent: (i as any).exam?.passMarkPercent ?? null,
        correctCount: correctMap.get(i.id) || 0,
        totalQuestions: totalMap.get(i.examId) || 0,
        pass: typeof (i as any).exam?.passMarkPercent === "number" && i.score !== null ? (Number(i.score) >= Number((i as any).exam.passMarkPercent)) : null,
        answerCount: answerCountMap.get(i.id) ?? 0,
      })) as any;
      return { items, total };
    }

    if (role === "TEACHER") {
      const where: any = { exam: { authorId: user.id } };
      if (typeof examId === 'number') where.examId = examId;
      if (typeof roomId === 'number') where.roomId = roomId;
      const [raw, total] = await Promise.all([
        prisma.attempt.findMany({
          where,
          select: {
            id: true,
            score: true,
            startedAt: true,
            submittedAt: true,
            timeTakenSec: true,
            studentId: true,
            examId: true,
            roomId: true,
            status: true,
            student: { select: { fullName: true, email: true, userCode: true } },
            exam: { select: { code: true, title: true, passMarkPercent: true } },
          },
          orderBy: { id: "asc" },
          skip,
          take,
        }),
        prisma.attempt.count({ where }),
      ]);
      const attemptIds = raw.map((r) => r.id);
      const examIds = Array.from(new Set(raw.map((r) => r.examId)));
      const [correctGroups, totalGroups, answerGroups] = await Promise.all([
        prisma.attemptAnswer.groupBy({ by: ["attemptId"], where: { attemptId: { in: attemptIds }, isCorrect: true }, _count: { _all: true } }),
        prisma.examQuestion.groupBy({ by: ["examId"], where: { examId: { in: examIds } }, _count: { _all: true } }),
        prisma.attemptAnswer.groupBy({ by: ["attemptId"], where: { attemptId: { in: attemptIds } }, _count: { _all: true } }),
      ]);
      const correctMap = new Map<number, number>();
      for (const g of correctGroups as any) correctMap.set(g.attemptId, Number(g._count._all || 0));
      const totalMap = new Map<number, number>();
      for (const g of totalGroups as any) totalMap.set(g.examId, Number(g._count._all || 0));
      const answerCountMap = new Map<number, number>();
      for (const g of answerGroups as any) answerCountMap.set(g.attemptId, Number(g._count._all || 0));

      const items = raw.map((i) => ({
        ...i,
        score: i.score === null ? null : Number(i.score as any),
        studentName: (i as any).student?.fullName ?? null,
        studentEmail: (i as any).student?.email ?? null,
        studentCode: (i as any).student?.userCode ?? null,
        exam: undefined,
        examCode: (i as any).exam?.code ?? null,
        examTitle: (i as any).exam?.title ?? null,
        passMarkPercent: (i as any).exam?.passMarkPercent ?? null,
        correctCount: correctMap.get(i.id) || 0,
        totalQuestions: totalMap.get(i.examId) || 0,
        pass: typeof (i as any).exam?.passMarkPercent === "number" && i.score !== null ? (Number(i.score) >= Number((i as any).exam.passMarkPercent)) : null,
        answerCount: answerCountMap.get(i.id) ?? 0,
      })) as any;
      return { items, total };
    }

    // STUDENT: only own attempts
    const where: any = { studentId: user.id };
    if (typeof examId === 'number') where.examId = examId;
    if (typeof roomId === 'number') where.roomId = roomId;
    const [raw, total] = await Promise.all([
      prisma.attempt.findMany({
        where,
        select: {
          id: true,
          score: true,
          startedAt: true,
          submittedAt: true,
          timeTakenSec: true,
          studentId: true,
          examId: true,
          roomId: true,
          status: true,
          student: { select: { fullName: true, email: true, userCode: true } },
          exam: { select: { code: true, title: true, passMarkPercent: true } },
        },
        orderBy: { id: "asc" },
        skip,
        take,
      }),
      prisma.attempt.count({ where }),
    ]);
    const attemptIds = raw.map((r) => r.id);
    const examIds = Array.from(new Set(raw.map((r) => r.examId)));
    const [correctGroups, totalGroups, answerGroups] = await Promise.all([
      prisma.attemptAnswer.groupBy({ by: ["attemptId"], where: { attemptId: { in: attemptIds }, isCorrect: true }, _count: { _all: true } }),
      prisma.examQuestion.groupBy({ by: ["examId"], where: { examId: { in: examIds } }, _count: { _all: true } }),
      prisma.attemptAnswer.groupBy({ by: ["attemptId"], where: { attemptId: { in: attemptIds } }, _count: { _all: true } }),
    ]);
    const correctMap = new Map<number, number>();
    for (const g of correctGroups as any) correctMap.set(g.attemptId, Number(g._count._all || 0));
    const totalMap = new Map<number, number>();
    for (const g of totalGroups as any) totalMap.set(g.examId, Number(g._count._all || 0));
    const answerCountMap = new Map<number, number>();
    for (const g of answerGroups as any) answerCountMap.set(g.attemptId, Number(g._count._all || 0));

    const items = raw.map((i) => ({
      ...i,
      score: i.score === null ? null : Number(i.score as any),
      studentName: (i as any).student?.fullName ?? null,
      studentEmail: (i as any).student?.email ?? null,
      studentCode: (i as any).student?.userCode ?? null,
      exam: undefined,
      examCode: (i as any).exam?.code ?? null,
      examTitle: (i as any).exam?.title ?? null,
      passMarkPercent: (i as any).exam?.passMarkPercent ?? null,
      correctCount: correctMap.get(i.id) || 0,
      totalQuestions: totalMap.get(i.examId) || 0,
      pass: typeof (i as any).exam?.passMarkPercent === "number" && i.score !== null ? (Number(i.score) >= Number((i as any).exam.passMarkPercent)) : null,
      answerCount: answerCountMap.get(i.id) ?? 0,
    })) as any;
    return { items, total };
  }

  @Get("{id}/detail")
  @Response<null>(401, "Unauthorized")
  @Response<null>(404, "Attempt not found")
  @Security("bearerAuth")
  public async getDetail(@Request() req: ExRequest, @Path() id: number): Promise<{
    id: number;
    score: number | null;
    startedAt: Date;
    submittedAt: Date | null;
    timeTakenSec: number | null;
    studentId: number;
    studentName?: string | null;
    studentEmail?: string | null;
    studentCode?: string | null;
    examId: number;
    examTitle?: string | null;
    passMarkPercent?: number | null;
    roomId: number;
    status: AttemptStatus;
    answers: Array<{
      questionId: number;
      questionText: string;
      isCorrect: boolean | null;
      earned: number | null;
      points: number | null;
      explanation?: string | null;
      choices: Array<{ id: number; content: string; isCorrect: boolean; selected: boolean }>;
    }>;
  } | null> {
    const user = (req as any).user as { id: number; role: string };
    const role = user.role?.toUpperCase();

    const sub = await prisma.attempt.findUnique({
      where: { id },
      select: {
        id: true,
        score: true,
        startedAt: true,
        submittedAt: true,
        timeTakenSec: true,
        studentId: true,
        examId: true,
        roomId: true,
        status: true,
        exam: { select: { authorId: true, title: true, passMarkPercent: true } },
        student: { select: { fullName: true, email: true, userCode: true } },
      },
    });
    if (!sub) {
      const err: any = new Error("Attempt not found");
      err.status = 404;
      throw err;
    }
    if (role === "STUDENT" && sub.studentId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }
    if (role === "TEACHER" && (sub as any).exam.authorId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    const answers = await prisma.attemptAnswer.findMany({
      where: { attemptId: id },
      select: {
        id: true,
        questionId: true,
        isCorrect: true,
        earned: true,
        question: { select: { text: true, explanation: true, choices: { select: { id: true, content: true, isCorrect: true, order: true }, orderBy: { order: 'asc' } } } },
        choices: { select: { choiceId: true } },
      },
      orderBy: { id: 'asc' },
    });
    // Load full exam structure to include unanswered questions
    const examQuestions = await prisma.examQuestion.findMany({
      where: { examId: sub.examId },
      select: {
        questionId: true,
        points: true,
        question: {
          select: {
            text: true,
            explanation: true,
            choices: {
              select: {
                id: true,
                content: true,
                isCorrect: true,
                order: true,
              },
              orderBy: { order: "asc" },
            },
          },
        },
      },
      orderBy: { order: "asc" },
    });
    const pts = examQuestions.map((eq) => ({ questionId: eq.questionId, points: eq.points }));
    const pointMap = new Map<number, number>();
    for (const p of pts) pointMap.set(p.questionId, Number(p.points));

    // Map answers by question
    const aaByQ = new Map<number, (typeof answers)[number]>();
    for (const a of answers) aaByQ.set(a.questionId, a);

    return {
      id: sub.id,
      score: sub.score === null ? null : Number(sub.score as any),
      startedAt: sub.startedAt,
      submittedAt: sub.submittedAt,
      timeTakenSec: sub.timeTakenSec,
      studentId: sub.studentId,
      studentName: (sub as any).student?.fullName ?? null,
      studentEmail: (sub as any).student?.email ?? null,
      studentCode: (sub as any).student?.userCode ?? null,
      examId: sub.examId,
      examTitle: (sub as any).exam?.title ?? null,
      passMarkPercent: (sub as any).exam?.passMarkPercent ?? null,
      roomId: sub.roomId,
      status: sub.status,
      answers: examQuestions.map((eq) => {
        const a = aaByQ.get(eq.questionId);
        const selectedIds = new Set((a?.choices || []).map((c) => c.choiceId));
        const allChoices = ((eq as any).question?.choices || []).map(
          (ch: any) => ({
            id: ch.id,
            content: ch.content,
            isCorrect: !!ch.isCorrect,
            selected: selectedIds.has(ch.id),
          })
        );
        const isCorrect = a?.isCorrect ?? false;
        const earned = a?.earned === null || typeof a?.earned === 'undefined' ? 0 : Number(a?.earned as any);
        return {
          questionId: eq.questionId,
          questionText: (eq as any).question?.text ?? "",
          isCorrect,
          earned,
          points: Number(eq.points as any) ?? null,
          explanation: (eq as any).question?.explanation ?? null,
          choices: allChoices,
        };
      }),
    };
  }

  @Get("{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(404, "Attempt not found")
  @Security("bearerAuth")
  public async getSubmissionById(
    @Request() req: ExRequest,
    @Path() id: number
  ): Promise<AttemptSummary | null> {
    const user = (req as any).user as { id: number; role: string };
    const role = user.role?.toUpperCase();

    const sub = await prisma.attempt.findUnique({
      where: { id },
      select: {
        id: true,
        score: true,
        startedAt: true,
        submittedAt: true,
        timeTakenSec: true,
        studentId: true,
        examId: true,
        roomId: true,
        status: true,
        exam: { select: { authorId: true } },
      },
    });
    if (!sub) {
      const err: any = new Error("Attempt not found");
      err.status = 404;
      throw err;
    }
    if (role === "STUDENT" && sub.studentId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }
    if (role === "TEACHER" && (sub as any).exam.authorId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    const { exam: _omit, ...summary } = sub as any;
    const mapped = { ...summary, score: summary.score === null ? null : Number(summary.score) };
    return mapped as AttemptSummary;
  }

  @Post("/begin")
  @Response<null>(400, "Bad Request")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["STUDENT"])
  public async beginAttempt(
    @Request() req: ExRequest,
    @Body()
    body: {
      roomId: number;
      activate?: boolean;
    }
  ): Promise<AttemptSummary> {
    const user = (req as any).user as { id: number; role: string };

    const room = await prisma.room.findUnique({
      where: { id: body.roomId },
      select: {
        id: true,
        examId: true,
        openAt: true,
        closeAt: true,
        durationSec: true,
        maxAttempts: true,
        exam: { select: { status: true } },
      },
    });
    if (!room) {
      this.setStatus(400);
      throw new Error("Invalid roomId");
    }

    const now = new Date();
    ensureRoomActive(room, now);

    // Reuse existing attempt if still in progress, otherwise create a new one
    let attempt = await prisma.attempt.findUnique({
      where: { roomId_studentId: { roomId: room.id, studentId: user.id } },
      select: {
        id: true,
        score: true,
        startedAt: true,
        submittedAt: true,
        timeTakenSec: true,
        studentId: true,
        examId: true,
        roomId: true,
        status: true,
      },
    });

    if (attempt && attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw attemptAlreadySubmittedError();
    }

    if (
      attempt?.startedAt &&
      room.durationSec &&
      now.getTime() - new Date(attempt.startedAt).getTime() >
        Number(room.durationSec) * 1000
    ) {
      throw attemptExpiredError();
    }

    if (!attempt) {
      attempt = await prisma.attempt.create({
        data: {
          roomId: room.id,
          examId: room.examId,
          studentId: user.id,
          status: AttemptStatus.IN_PROGRESS,
          startedAt: now,
        },
        select: {
          id: true,
          score: true,
          startedAt: true,
          submittedAt: true,
          timeTakenSec: true,
          studentId: true,
          examId: true,
          roomId: true,
          status: true,
        },
      });
    }

    if (body.activate === true && attempt.timeTakenSec === null) {
      attempt = await prisma.attempt.update({
        where: { id: attempt.id },
        data: {
          timeTakenSec: 0,
          startedAt: now,
        },
        select: {
          id: true,
          score: true,
          startedAt: true,
          submittedAt: true,
          timeTakenSec: true,
          studentId: true,
          examId: true,
          roomId: true,
          status: true,
        },
      });
    }

    const mapped: AttemptSummary = {
      ...(attempt as any),
      score: attempt.score === null ? null : Number(attempt.score as any),
    };
    return mapped;
  }

  @Post("/")
  @Response<null>(400, "Bad Request")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["STUDENT"]) 
  public async createSubmission(
    @Request() req: ExRequest,
    @Body()
    body: {
      roomId: number;
      answers: Array<{ questionId: number; selectedChoiceId: number }>;
    }
  ): Promise<AttemptSummary> {
    const user = (req as any).user as { id: number; role: string };
    if (!Array.isArray(body.answers) || body.answers.length === 0) {
      this.setStatus(400);
      throw new Error("answers must be a non-empty array");
    }

    const now = new Date();

    const updated = await prisma.$transaction(async (tx) => {
      const room = await tx.room.findUnique({
        where: { id: body.roomId },
        select: {
          id: true,
          examId: true,
          durationSec: true,
          openAt: true,
          closeAt: true,
          maxAttempts: true,
          exam: { select: { status: true } },
        },
      });

      if (!room) {
        const err: any = new Error("Invalid roomId");
        err.status = 400;
        throw err;
      }

      ensureRoomActive(room, now);

      // Validate choices belong to the question and that question belongs to the exam
      const questionIds = body.answers.map((a) => a.questionId);
      const choicesFromDb = await tx.choice.findMany({
        where: {
          questionId: { in: questionIds },
          question: { examLinks: { some: { examId: room.examId } } },
        },
        select: { id: true, isCorrect: true, questionId: true },
      });
      const byQuestion = new Map<number, { id: number; isCorrect: boolean }[]>();
      for (const c of choicesFromDb) {
        const arr = byQuestion.get(c.questionId) ?? [];
        arr.push({ id: c.id, isCorrect: c.isCorrect });
        byQuestion.set(c.questionId, arr);
      }

      const perQuestion = new Map<number, number>();
      const points = await tx.examQuestion.findMany({
        where: { examId: room.examId, questionId: { in: questionIds } },
        select: { questionId: true, points: true },
      });
      for (const p of points) perQuestion.set(p.questionId, Number(p.points));

      let attempt = await tx.attempt.findUnique({
        where: { roomId_studentId: { roomId: room.id, studentId: user.id } },
        select: { id: true, status: true, startedAt: true },
      });

      if (attempt && attempt.status !== AttemptStatus.IN_PROGRESS) {
        throw attemptAlreadySubmittedError();
      }

      if (!attempt) {
        attempt = await tx.attempt.create({
          data: {
            roomId: room.id,
            examId: room.examId,
            studentId: user.id,
            status: AttemptStatus.IN_PROGRESS,
            startedAt: now,
          },
          select: { id: true, status: true, startedAt: true },
        });
      }

      const startedAtMs = attempt.startedAt
        ? new Date(attempt.startedAt).getTime()
        : now.getTime();
      const diffSec = Math.max(0, Math.floor((now.getTime() - startedAtMs) / 1000));
      const durationCap = room.durationSec ? Number(room.durationSec) : null;
      if (durationCap && diffSec > durationCap) {
        throw attemptExpiredError();
      }

      // Clear any previous answers (if any) before saving new ones
      await tx.attemptAnswer.deleteMany({ where: { attemptId: attempt.id } });

      let earnedTotal = 0;
      for (const sel of body.answers) {
        const options = byQuestion.get(sel.questionId) || [];
        const found = options.find((o) => o.id === sel.selectedChoiceId);
        if (!found) {
          const err: any = new Error(`Invalid selectedChoiceId for question ${sel.questionId}`);
          err.status = 400;
          throw err;
        }
        const isCorrect = !!found.isCorrect;
        const earned = isCorrect ? (perQuestion.get(sel.questionId) ?? 1) : 0;
        const aa = await tx.attemptAnswer.create({
          data: { attemptId: attempt.id, questionId: sel.questionId, isCorrect, earned },
        });
        await tx.attemptAnswerChoice.create({ data: { attemptAnswerId: aa.id, choiceId: sel.selectedChoiceId } });
        earnedTotal += earned;
      }

      const totalPoints = await tx.examQuestion.aggregate({ _sum: { points: true }, where: { examId: room.examId } });
      const total = Number(totalPoints._sum.points ?? 0) || body.answers.length;
      const percent = total > 0 ? (earnedTotal / total) * 100 : 0;

      const timeTakenSec = durationCap ? Math.min(diffSec, durationCap) : diffSec;

      const updatedAttempt = await tx.attempt.update({
        where: { id: attempt.id },
        data: {
          status: AttemptStatus.SUBMITTED,
          submittedAt: now,
          timeTakenSec,
          score: Number(percent.toFixed(2)),
        },
        select: {
          id: true,
          score: true,
          startedAt: true,
          submittedAt: true,
          timeTakenSec: true,
          studentId: true,
          examId: true,
          roomId: true,
          status: true,
        },
      });

      return updatedAttempt;
    });

    return updated as AttemptSummary;
  }

  @Delete("{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Attempt not found")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async deleteSubmission(
    @Request() req: ExRequest,
    @Path() id: number
  ): Promise<{ message: string; id: number } | null> {
    const user = (req as any).user as { id: number; role: string };
    const role = user.role?.toUpperCase();

    const existing = await prisma.attempt.findUnique({ where: { id }, select: { id: true, exam: { select: { authorId: true } } } });
    if (!existing) {
      const err: any = new Error("Attempt not found");
      err.status = 404;
      throw err;
    }
    if (role === "TEACHER" && (existing as any).exam.authorId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    await prisma.attempt.delete({ where: { id } });
    return { message: "Attempt deleted", id };
  }
}


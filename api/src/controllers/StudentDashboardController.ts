import { prisma } from "../utils/prisma";
import { Controller, Get, Request, Response, Route, Security, Tags } from "tsoa";
import { AttemptStatus } from "@prisma/client";

type DashboardAttempt = {
  id: number;
  score: number | null;
  startedAt: Date;
  submittedAt: Date | null;
  timeTakenSec: number | null;
  examId: number;
  roomId: number;
  status: AttemptStatus;
  examCode?: string | null;
  examTitle?: string | null;
  correctCount?: number;
  totalQuestions?: number;
  passMarkPercent?: number | null;
  pass?: boolean | null;
};

type DashboardRoom = {
  id: number;
  examId: number;
  code: string;
  openAt: Date | null;
  closeAt: Date | null;
  durationSec: number | null;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  maxAttempts: number;
  createdAt: Date;
  examTitle?: string | null;
  examCode?: string | null;
};

type DashboardResponse = {
  attemptsTotal: number;
  lastAttempt: DashboardAttempt | null;
  openRooms: DashboardRoom[];
  nearestRoom: DashboardRoom | null;
};

@Route("student/dashboard")
@Tags("StudentDashboard")
export class StudentDashboardController extends Controller {
  @Get("/")
  @Security("bearerAuth", ["STUDENT"])
  @Response<null>(401, "Unauthorized")
  public async get(@Request() req: any): Promise<DashboardResponse> {
    const userId = Number(req?.user?.id ?? req?.user?.sub ?? req?.user?.userId);
    if (!Number.isFinite(userId)) {
      const err: any = new Error("Unauthorized");
      err.status = 401;
      throw err;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subjectId: true },
    });
    if (!user) {
      const err: any = new Error("Unauthorized");
      err.status = 401;
      throw err;
    }

    const now = new Date();
    const roomWhere: any = {
      AND: [
        { OR: [{ openAt: null }, { openAt: { lte: now } }] },
        { OR: [{ closeAt: null }, { closeAt: { gte: now } }] },
      ],
    };
    if (typeof user.subjectId === "number") {
      roomWhere.exam = { subjectId: user.subjectId };
    }

    const [attemptsTotal, lastAttemptRaw, openRoomsRaw] =
      await prisma.$transaction([
        prisma.attempt.count({ where: { studentId: userId } }),
        prisma.attempt.findFirst({
          where: { studentId: userId },
          orderBy: { id: "desc" },
          select: {
            id: true,
            score: true,
            startedAt: true,
            submittedAt: true,
            timeTakenSec: true,
            examId: true,
            roomId: true,
            status: true,
            exam: {
              select: { code: true, title: true, passMarkPercent: true },
            },
          },
        }),
        prisma.room.findMany({
          where: roomWhere,
          select: {
            id: true,
            examId: true,
            code: true,
            openAt: true,
            closeAt: true,
            durationSec: true,
            shuffleQuestions: true,
            shuffleChoices: true,
            maxAttempts: true,
            createdAt: true,
            exam: { select: { title: true, code: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 100,
        }),
      ]);

    let lastAttempt: DashboardAttempt | null = null;
    if (lastAttemptRaw) {
      const [correctCount, totalQuestions] = await prisma.$transaction([
        prisma.attemptAnswer.count({
          where: { attemptId: lastAttemptRaw.id, isCorrect: true },
        }),
        prisma.examQuestion.count({
          where: { examId: lastAttemptRaw.examId },
        }),
      ]);
      const score =
        lastAttemptRaw.score === null ? null : Number(lastAttemptRaw.score);
      const passMarkPercent =
        (lastAttemptRaw.exam?.passMarkPercent ?? null) as number | null;
      const pass =
        typeof passMarkPercent === "number" && score !== null
          ? Number(score) >= Number(passMarkPercent)
          : null;

      lastAttempt = {
        id: lastAttemptRaw.id,
        score,
        startedAt: lastAttemptRaw.startedAt,
        submittedAt: lastAttemptRaw.submittedAt,
        timeTakenSec: lastAttemptRaw.timeTakenSec,
        examId: lastAttemptRaw.examId,
        roomId: lastAttemptRaw.roomId,
        status: lastAttemptRaw.status,
        examCode: lastAttemptRaw.exam?.code ?? null,
        examTitle: lastAttemptRaw.exam?.title ?? null,
        correctCount,
        totalQuestions,
        passMarkPercent:
          typeof passMarkPercent === "number" ? passMarkPercent : null,
        pass,
      };
    }

    const openRooms: DashboardRoom[] = openRoomsRaw.map((room) => ({
      id: room.id,
      examId: room.examId,
      code: room.code,
      openAt: room.openAt,
      closeAt: room.closeAt,
      durationSec: room.durationSec,
      shuffleQuestions: room.shuffleQuestions,
      shuffleChoices: room.shuffleChoices,
      maxAttempts: room.maxAttempts,
      createdAt: room.createdAt,
      examTitle: room.exam?.title ?? null,
      examCode: room.exam?.code ?? null,
    }));

    const toMs = (d: Date | null) => {
      if (!d) return Number.POSITIVE_INFINITY;
      const ms = d.getTime();
      return Number.isNaN(ms) ? Number.POSITIVE_INFINITY : ms;
    };
    const nearestRoom = openRooms.length
      ? [...openRooms].sort((a, b) => toMs(a.closeAt) - toMs(b.closeAt))[0]
      : null;

    return {
      attemptsTotal,
      lastAttempt,
      openRooms,
      nearestRoom,
    };
  }
}

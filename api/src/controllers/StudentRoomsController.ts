import { prisma } from "../utils/prisma";
import { Controller, Get, Query, Request, Response, Route, Security, Tags } from "tsoa";

type StudentRoomSummary = {
  id: number;
  examId: number;
  code: string;
  isProtected: boolean;
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

@Route("student/rooms")
@Tags("StudentRooms")
export class StudentRoomsController extends Controller {
  @Get("/")
  @Security("bearerAuth", ["STUDENT"])
  @Response<null>(401, "Unauthorized")
  public async list(
    @Request() req: any,
    @Query() page?: number,
    @Query() pageSize?: number
  ): Promise<{ items: StudentRoomSummary[]; total: number }> {
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
    const take = Math.max(1, Math.min(100, Number(pageSize) || 50));
    const skip = Math.max(0, ((Number(page) || 1) - 1) * take);
    const where: any = {
      AND: [
        { OR: [{ openAt: null }, { openAt: { lte: now } }] },
        { OR: [{ closeAt: null }, { closeAt: { gte: now } }] },
      ],
    };
    if (typeof user.subjectId === "number") {
      where.exam = { subjectId: user.subjectId };
    }

    const [items, total] = await Promise.all([
      prisma.room.findMany({
        where,
        select: {
          id: true,
          examId: true,
          code: true,
          isProtected: true,
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
        skip,
        take,
      }),
      prisma.room.count({ where }),
    ]);

    return {
      items: items.map((room) => ({
        id: room.id,
        examId: room.examId,
        code: room.code,
        isProtected: room.isProtected,
        openAt: room.openAt,
        closeAt: room.closeAt,
        durationSec: room.durationSec,
        shuffleQuestions: room.shuffleQuestions,
        shuffleChoices: room.shuffleChoices,
        maxAttempts: room.maxAttempts,
        createdAt: room.createdAt,
        examTitle: room.exam?.title ?? null,
        examCode: room.exam?.code ?? null,
      })),
      total,
    };
  }
}

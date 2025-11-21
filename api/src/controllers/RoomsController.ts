import { prisma } from "../utils/prisma";
import { Body, Controller, Delete, Get, Path, Post, Query, Request, Response, Route, Security, Tags } from "tsoa";
import { Request as ExRequest } from "express";

export type RoomSummary = {
  id: number;
  examId: number;
  code: string;
  openAt: Date | null;
  closeAt: Date | null;
  durationSec: number | null;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  maxAttempts: number;
  createdById: number | null;
  createdAt: Date;
};

@Route("rooms")
@Tags("Room")
export class RoomsController extends Controller {
  @Get("/")
  @Response<null>(401, "Unauthorized")
  @Security("bearerAuth")
  public async list(
    @Query() examId?: number,
    @Query() page?: number,
    @Query() pageSize?: number
  ): Promise<{ items: RoomSummary[]; total: number }> {
    const take = Math.max(1, Math.min(100, Number(pageSize) || 50));
    const skip = Math.max(0, ((Number(page) || 1) - 1) * take);
    const where = typeof examId === "number" ? { examId } : {};
    const [items, total] = await Promise.all([
      prisma.room.findMany({
        where,
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
          createdById: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.room.count({ where }),
    ]);
    return { items, total };
  }

  @Get("{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(404, "Room not found")
  @Security("bearerAuth")
  public async getById(@Path() id: number): Promise<RoomSummary | null> {
    const room = await prisma.room.findUnique({
      where: { id },
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
        createdById: true,
        createdAt: true,
      },
    });
    if (!room) {
      const err: any = new Error("Room not found");
      err.status = 404;
      throw err;
    }
    return room;
  }

  @Post("/")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(400, "Bad Request")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async create(
    @Request() req: ExRequest,
    @Body()
    body: {
      examId: number;
      code?: string;
      openAt?: Date | null;
      closeAt?: Date | null;
      durationSec?: number | null;
      shuffleQuestions?: boolean;
      shuffleChoices?: boolean;
      maxAttempts?: number;
    }
  ): Promise<RoomSummary> {
    const user = (req as any).user as { id: number; role: string };
    const exam = await prisma.exam.findUnique({ where: { id: body.examId }, select: { id: true, authorId: true } });
    if (!exam) {
      this.setStatus(400);
      throw new Error("Invalid examId");
    }
    if (user.role?.toUpperCase() === "TEACHER" && exam.authorId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    const code = body.code && body.code.trim().length > 0 ? body.code.trim() : `R-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const created = await prisma.room.create({
      data: {
        examId: exam.id,
        code,
        openAt: body.openAt ?? null,
        closeAt: body.closeAt ?? null,
        durationSec: typeof body.durationSec === "number" ? body.durationSec : null,
        shuffleQuestions: typeof body.shuffleQuestions === "boolean" ? body.shuffleQuestions : true,
        shuffleChoices: typeof body.shuffleChoices === "boolean" ? body.shuffleChoices : true,
        maxAttempts: typeof body.maxAttempts === "number" ? body.maxAttempts : 1,
        createdById: user.id,
      },
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
        createdById: true,
        createdAt: true,
      },
    });
    return created;
  }

  @Post("{id}/close")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Room not found")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async closeRoom(
    @Request() req: ExRequest,
    @Path() id: number
  ): Promise<RoomSummary> {
    const user = (req as any).user as { id: number; role: string };
    const role = user.role?.toUpperCase();

    const existing = await prisma.room.findUnique({
      where: { id },
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
        createdById: true,
        createdAt: true,
        exam: { select: { authorId: true } },
      },
    });

    if (!existing) {
      const err: any = new Error("Room not found");
      err.status = 404;
      throw err;
    }

    if (role === "TEACHER" && (existing as any).exam?.authorId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    const updated = await prisma.room.update({
      where: { id },
      data: { closeAt: new Date() },
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
        createdById: true,
        createdAt: true,
      },
    });

    return updated as RoomSummary;
  }

  @Delete("{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Room not found")
  @Response<null>(400, "Cannot delete room with attempts")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async remove(
    @Request() req: ExRequest,
    @Path() id: number
  ): Promise<{ id: number; message: string }> {
    const user = (req as any).user as { id: number; role: string };
    const role = user.role?.toUpperCase();

    const existing = await prisma.room.findUnique({
      where: { id },
      select: {
        id: true,
        exam: { select: { authorId: true } },
      },
    });

    if (!existing) {
      const err: any = new Error("Room not found");
      err.status = 404;
      throw err;
    }

    if (role === "TEACHER" && (existing as any).exam?.authorId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    const attempts = await prisma.attempt.count({ where: { roomId: id } });
    if (attempts > 0) {
      this.setStatus(400);
      throw new Error("Room has attempts and cannot be deleted");
    }

    await prisma.room.delete({ where: { id } });
    return { id, message: "Room deleted" };
  }
}

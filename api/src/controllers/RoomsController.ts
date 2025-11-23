import { prisma } from "../utils/prisma";
import { Body, Controller, Delete, Get, Path, Post, Query, Request, Response, Route, Security, Tags } from "tsoa";
import { Request as ExRequest } from "express";

export type RoomSummary = {
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
    @Query() subjectId?: number,
    @Query() page?: number,
    @Query() pageSize?: number
  ): Promise<{ items: RoomSummary[]; total: number }> {
    const take = Math.max(1, Math.min(100, Number(pageSize) || 50));
    const skip = Math.max(0, ((Number(page) || 1) - 1) * take);
    const where: any = {};
    if (typeof examId === "number") where.examId = examId;
    if (typeof subjectId === "number") {
      where.exam = { subjectId };
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
          isProtected: true,
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
      isProtected?: boolean;
      password?: string;
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

    const isProtected = !!body.isProtected;
    const password =
      isProtected && typeof body.password === "string" ? body.password.trim() : "";
    if (isProtected && !password) {
      this.setStatus(400);
      throw new Error("Password is required when isProtected is true");
    }

    const code = body.code && body.code.trim().length > 0 ? body.code.trim() : `R-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const created = await prisma.room.create({
      data: {
        examId: exam.id,
        code,
        isProtected,
        password: isProtected ? password : null,
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
        isProtected: true,
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

  @Post("{id}/protection")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Room not found")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async updateProtection(
    @Request() req: ExRequest,
    @Path() id: number,
    @Body()
    body: {
      isProtected?: boolean;
      password?: string;
      close?: boolean;
    }
  ): Promise<RoomSummary> {
    const user = (req as any).user as { id: number; role: string };
    const role = user.role?.toUpperCase();

    const existing = await prisma.room.findUnique({
      where: { id },
      select: { id: true, exam: { select: { authorId: true } } },
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

    const data: any = {};
    if (typeof body.isProtected === "boolean") {
      data.isProtected = body.isProtected;
      if (body.isProtected) {
        const pass = typeof body.password === "string" ? body.password.trim() : "";
        if (!pass) {
          this.setStatus(400);
          throw new Error("Password is required when isProtected is true");
        }
        data.password = pass;
      } else {
        data.password = null;
      }
    }
    if (typeof body.close === "boolean") {
      data.closeAt = body.close ? new Date() : null;
    }

    const updated = await prisma.room.update({
      where: { id },
      data,
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
        createdById: true,
        createdAt: true,
      },
    });
    return updated;
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
      const err: any = new Error("Phòng thi có bài thi thí sinh, không thể xóa");
      err.code = "ROOM_HAS_ATTEMPTS";
      throw err;
    }

    await prisma.room.delete({ where: { id } });
    return { id, message: "Room deleted" };
  }
}

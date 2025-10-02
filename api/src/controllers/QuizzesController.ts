import { QuizStatus } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { Controller, Get, Route, Tags, Response, Security, Post, Body, Request, Put, Delete, Path, Query } from "tsoa";
import { Request as ExRequest } from "express";
import type { QuizSummary, AddQuizRequest } from "./QuizController";

/**
 * RESTful alias of QuizController under "/quizzes" (pluralized).
 * Keeps behavior and security identical to QuizController.
 */
@Route("quizzes")
@Tags("Quizzes")
export class QuizzesController extends Controller {
  @Get("/")
  @Response<null>(401, "Unauthorized")
  @Security("bearerAuth")
  public async list(
    @Query() page?: number,
    @Query() pageSize?: number,
    @Query() status?: QuizStatus,
    @Query() teacherId?: number
  ): Promise<QuizSummary[]> {
    const take = Math.max(1, Math.min(100, Number(pageSize) || 50));
    const skip = Math.max(0, ((Number(page) || 1) - 1) * take);
    const where: any = {};
    if (typeof status !== "undefined") where.status = status;
    if (typeof teacherId === "number") where.teacherId = teacherId;
    return prisma.quiz.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        teacherId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  }

  @Get("/{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(404, "Quiz not found")
  @Security("bearerAuth")
  public async get(@Path() id: number): Promise<QuizSummary | null> {
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        teacherId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!quiz) {
      const err: any = new Error("Quiz not found");
      err.status = 404;
      throw err;
    }
    return quiz;
  }

  @Post("/")
  @Response<null>(400, "Bad Request")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["TEACHER"])
  public async create(@Request() req: ExRequest, @Body() body: AddQuizRequest): Promise<QuizSummary> {
    const user = (req as any).user as { id: number; role: string };
    return prisma.quiz.create({
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        timeLimitMinutes: body.timeLimitMinutes,
        teacherId: user.id,
      },
    });
  }

  @Put("/{id}")
  @Response<null>(400, "Bad Request")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Quiz not found")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async update(
    @Request() req: ExRequest,
    @Path() id: number,
    @Body() body: { title?: string; description?: string | null; status?: QuizStatus; timeLimitMinutes?: number }
  ): Promise<QuizSummary | null> {
    const user = (req as any).user as { id: number; role: string };
    const existing = await prisma.quiz.findUnique({ where: { id }, select: { id: true, teacherId: true } });
    if (!existing) {
      const err: any = new Error("Quiz not found");
      err.status = 404;
      throw err;
    }
    if (user.role?.toUpperCase() === "TEACHER" && existing.teacherId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }
    const data: any = {};
    if (typeof body.title !== "undefined") data.title = body.title;
    if (typeof body.description !== "undefined") data.description = body.description;
    if (typeof body.status !== "undefined") data.status = body.status;
    if (typeof body.timeLimitMinutes !== "undefined") data.timeLimitMinutes = body.timeLimitMinutes;
    return prisma.quiz.update({
      where: { id },
      data,
      select: { id: true, title: true, description: true, status: true, teacherId: true, createdAt: true, updatedAt: true },
    });
  }

  @Delete("/{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Quiz not found")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async remove(@Request() req: ExRequest, @Path() id: number): Promise<{ message: string; id: number } | null> {
    const user = (req as any).user as { id: number; role: string };
    const existing = await prisma.quiz.findUnique({ where: { id }, select: { id: true, teacherId: true } });
    if (!existing) {
      const err: any = new Error("Quiz not found");
      err.status = 404;
      throw err;
    }
    if (user.role?.toUpperCase() === "TEACHER" && existing.teacherId !== user.id) {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }
    await prisma.quiz.delete({ where: { id } });
    return { message: "Quiz deleted", id };
  }
}


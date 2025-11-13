import { Role } from "@prisma/client";
import { prisma } from "../utils/prisma";
import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Query,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from "tsoa";

type StudentResponse = {
  id: number;
  email: string | null;
  fullName: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

@Route("teacher/students")
@Tags("TeacherStudents")
export class TeacherStudentsController extends Controller {
  private static readonly select = {
    id: true,
    email: true,
    fullName: true,
    userCode: true,
    role: true,
    createdAt: true,
    updatedAt: true,
  } as const;

  @Get("/")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async getStudents(
    @Query() page?: number,
    @Query() pageSize?: number,
    @Query() search?: string
  ): Promise<{ items: StudentResponse[]; total: number }> {
    const take = Math.max(1, Math.min(100, Number(pageSize) || 50));
    const skip = Math.max(0, ((Number(page) || 1) - 1) * take);
    const where: any = { role: Role.STUDENT };
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { email: { contains: q } },
        { fullName: { contains: q } },
        { userCode: { contains: q } },
      ];
    }
    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: TeacherStudentsController.select,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.user.count({ where }),
    ]);
    return { items, total };
  }

  @Post("/")
  @SuccessResponse("201", "Student created")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async createStudent(
    @Body()
    body: {
      fullName: string;
      userCode: string;
      email?: string | null;
      password: string;
    }
  ): Promise<{ message: string; user: StudentResponse }> {
    if (!body?.userCode || !String(body.userCode).trim()) {
      const err: any = new Error("userCode is required");
      err.status = 400;
      throw err;
    }
    const bcrypt = await import("bcryptjs");
    const passwordHash = await bcrypt.hash(body.password, 10);
    const data: any = {
      fullName: body.fullName ?? null,
      userCode: body.userCode,
      password: passwordHash,
      role: Role.STUDENT,
    };
    if (typeof body.email !== "undefined") data.email = body.email;
    const user = await prisma.user.create({
      data,
      select: TeacherStudentsController.select,
    });
    this.setStatus(201);
    return { message: "Student created", user };
  }

  @Put("{id}")
  @Response<null>(404, "Student not found")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async updateStudent(
    @Path() id: number,
    @Body()
    body: {
      fullName?: string | null;
      email?: string | null;
      password?: string;
      userCode?: string;
    }
  ): Promise<{ message: string; user: StudentResponse }> {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing || existing.role !== Role.STUDENT) {
      const err: any = new Error("Student not found");
      err.status = 404;
      throw err;
    }
    const data: any = {};
    if (typeof body.fullName !== "undefined") data.fullName = body.fullName;
    if (typeof body.email !== "undefined") data.email = body.email;
    if (typeof body.userCode !== "undefined") data.userCode = body.userCode;
    if (typeof body.password !== "undefined") {
      const bcrypt = await import("bcryptjs");
      data.password = await bcrypt.hash(body.password, 10);
    }
    const updated = await prisma.user.update({
      where: { id },
      data,
      select: TeacherStudentsController.select,
    });
    return { message: "Student updated", user: updated };
  }

  @Delete("{id}")
  @Response<null>(404, "Student not found")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["TEACHER", "ADMIN"])
  public async deleteStudent(
    @Path() id: number
  ): Promise<{ message: string; id: number }> {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing || existing.role !== Role.STUDENT) {
      const err: any = new Error("Student not found");
      err.status = 404;
      throw err;
    }
    // Do not allow deleting student if there are attempts
    const relatedAttempts = await prisma.attempt.count({
      where: { studentId: id },
    });
    if (relatedAttempts > 0) {
      const err: any = new Error(
        "Không thể xóa học viên vì đã có dữ liệu bài thi của học viên này. Vui lòng xóa các bài thi liên quan trước."
      );
      err.status = 409;
      throw err;
    }
    await prisma.user.delete({ where: { id } });
    return { message: "Student deleted", id };
  }
}

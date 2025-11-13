import { Role } from "@prisma/client";
import { prisma } from "../utils/prisma";
import {
  Get,
  Route,
  Tags,
  Path,
  Post,
  Body,
  Controller,
  Response,
  SuccessResponse,
  Security,
  Put,
  Delete,
  Query,
} from "tsoa";
import bcrypt from "bcryptjs";

export type UserResponse = {
  id: number;
  email: string | null;
  fullName: string | null;
  userCode?: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

@Route("users")
@Tags("User")
export class UserController extends Controller {
  private static readonly userSelect = {
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
  @Security("bearerAuth", ["ADMIN"])
  public async getUsers(
    @Query() page?: number,
    @Query() pageSize?: number,
    @Query() role?: Role,
    @Query() search?: string,
    @Query() excludeStudent?: boolean
  ): Promise<{ items: UserResponse[]; total: number }> {
    const take = Math.max(1, Math.min(100, Number(pageSize) || 50));
    const skip = Math.max(0, ((Number(page) || 1) - 1) * take);
    const where: any = {};
    if (excludeStudent) {
      where.role = { in: [Role.ADMIN, Role.TEACHER] } as any;
    }
    if (typeof role !== "undefined") where.role = role;
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [{ email: { contains: q } }, { fullName: { contains: q } }];
    }
    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: UserController.userSelect,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.user.count({ where }),
    ]);
    return { items, total };
  }

  @Get("{id}")
  @Response<null>(404, "User not found")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["ADMIN"])
  public async getUserById(@Path() id: number): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: UserController.userSelect,
    });

    if (!user) {
      const err: any = new Error("User not found");
      err.status = 404;
      throw err;
    }

    return user;
  }

  @Post("/")
  @SuccessResponse("201", "User created")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["ADMIN"])
  public async createUser(
    @Body()
    body: {
      fullName: string;
      password: string;
      email: string;
      role: Role; // must be ADMIN or TEACHER
    }
  ): Promise<{ message: string; user: UserResponse }> {
    if (!body?.role || (body.role !== Role.ADMIN && body.role !== Role.TEACHER)) {
      const err: any = new Error(
        "Only ADMIN or TEACHER can be created by admin"
      );
      err.status = 400;
      throw err;
    }
    const passwordHash = await bcrypt.hash(body.password, 10);
    const newUser = await prisma.user.create({
      data: {
        fullName: body.fullName,
        password: passwordHash,
        email: body.email,
        role: body.role,
      },
      select: UserController.userSelect,
    });
    this.setStatus(201);
    return { message: "User created", user: newUser };
  }

  @Put("{id}")
  @Response<null>(404, "User not found")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["ADMIN"])
  public async updateUser(
    @Path() id: number,
    @Body()
    body: {
      fullName?: string | null;
      email?: string | null;
      password?: string;
      role?: Role; // restrict to ADMIN/TEACHER when changed
    }
  ): Promise<{ message: string; user: UserResponse } | null> {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      const err: any = new Error("User not found");
      err.status = 404;
      throw err;
    }

    const data: any = {};
    if (typeof body.fullName !== "undefined") data.fullName = body.fullName;
    if (typeof body.email !== "undefined") data.email = body.email;
    if (typeof body.password !== "undefined")
      data.password = await bcrypt.hash(body.password, 10);
    if (typeof body.role !== "undefined") {
      if (body.role !== Role.ADMIN && body.role !== Role.TEACHER) {
        const err: any = new Error("Role must be ADMIN or TEACHER");
        err.status = 400;
        throw err;
      }
      data.role = body.role;
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: UserController.userSelect,
    });
    return { message: "User updated", user: updated };
  }

  @Delete("{id}")
  @Response<null>(404, "User not found")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["ADMIN"])
  public async deleteUser(
    @Path() id: number
  ): Promise<{ message: string; id: number } | null> {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      const err: any = new Error("User not found");
      err.status = 404;
      throw err;
    }

    // Prevent deleting student accounts with existing attempts
    if (existing.role === Role.STUDENT) {
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
    }

    await prisma.user.delete({ where: { id } });
    return { message: "User deleted", id };
  }
}

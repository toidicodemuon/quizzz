import { PrismaClient, UserRole } from "@prisma/client";
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
} from "tsoa";

export type UserResponse = {
  id: number;
  username: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const prisma = new PrismaClient();

@Route("users")
@Tags("User")
export class UserController extends Controller {
  /** Public response shape that hides passwordHash */
  private static readonly userSelect = {
    id: true,
    username: true,
    email: true,
    fullName: true,
    avatarUrl: true,
    role: true,
    isActive: true,
    lastLogin: true,
    createdAt: true,
    updatedAt: true,
  } as const;

  @Get("/")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["ADMIN"])
  public async getUsers(): Promise<UserResponse[]> {
    return await prisma.user.findMany({ select: UserController.userSelect });
  }

  @Get("{id}")
  @Response<null>(404, "User not found")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["ADMIN"])
  public async getUserById(
    @Path() id: number
  ): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: UserController.userSelect,
    });

    if (!user) {
      this.setStatus(404);
      return null;
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
      username: string;
      fullName: string;
      passwordHash: string;
      email: string;
    }
  ): Promise<{ message: string; user: UserResponse }> {
    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        fullName: body.fullName,
        passwordHash: body.passwordHash,
        email: body.email,
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
      username?: string;
      fullName?: string | null;
      email?: string | null;
      passwordHash?: string;
      avatarUrl?: string | null;
      role?: UserRole;
      isActive?: boolean;
    }
  ): Promise<{ message: string; user: UserResponse } | null> {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      this.setStatus(404);
      return null;
    }

    const data: any = {};
    if (typeof body.username !== "undefined") data.username = body.username;
    if (typeof body.fullName !== "undefined") data.fullName = body.fullName;
    if (typeof body.email !== "undefined") data.email = body.email;
    if (typeof body.passwordHash !== "undefined")
      data.passwordHash = body.passwordHash;
    if (typeof body.avatarUrl !== "undefined") data.avatarUrl = body.avatarUrl;
    if (typeof body.role !== "undefined") data.role = body.role;
    if (typeof body.isActive !== "undefined") data.isActive = body.isActive;

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
      this.setStatus(404);
      return null;
    }

    await prisma.user.delete({ where: { id } });
    return { message: "User deleted", id };
  }
}

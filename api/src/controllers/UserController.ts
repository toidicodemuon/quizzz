import { PrismaClient, User as PrismaUser, UserRole } from "@prisma/client";
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

const prisma = new PrismaClient();

@Route("users")
@Tags("User")
export class UserController extends Controller {
  @Get("/")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["ADMIN"])
  public async getUsers(): Promise<PrismaUser[]> {
    return await prisma.user.findMany();
  }

  @Get("{id}")
  @Response<null>(404, "User not found")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["ADMIN"])
  public async getUserById(@Path() id: number): Promise<PrismaUser | null> {
    const user = await prisma.user.findUnique({
      where: { id },
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
  ): Promise<{ message: string; user: PrismaUser }> {
    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        fullName: body.fullName,
        passwordHash: body.passwordHash,
        email: body.email,
      },
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
  ): Promise<{ message: string; user: PrismaUser } | null> {
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

    const updated = await prisma.user.update({ where: { id }, data });
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

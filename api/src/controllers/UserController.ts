import { PrismaClient, User as PrismaUser } from "@prisma/client";
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
}

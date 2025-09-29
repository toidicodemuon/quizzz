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
} from "tsoa";

const prisma = new PrismaClient();

@Route("users")
@Tags("User")
export class UserController extends Controller {
  @Get("/")
  public async getUsers(): Promise<PrismaUser[]> {
    return await prisma.user.findMany();
  }

  @Get("{id}")
  @Response<null>(404, "User not found")
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
  public async createUser(
    @Body()
    body: {
      username: string;
      fullname: string;
      hashPwd: string;
      email: string;
      phone: string;
    }
  ): Promise<{ message: string; user: PrismaUser }> {
    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        fullname: body.fullname,
        hashPwd: body.hashPwd,
        email: body.email,
        phone: body.phone,
      },
    });
    this.setStatus(201);
    return { message: "User created", user: newUser };
  }
}

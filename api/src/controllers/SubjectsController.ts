import { Controller, Get, Route, Tags, Response, Security } from "tsoa";
import { prisma } from "../utils/prisma";

export type SubjectDto = { id: number; name: string; code: string | null };

@Route("subjects")
@Tags("Subject")
export class SubjectsController extends Controller {
  @Get("/")
  @Response<null>(401, "Unauthorized")
  @Security("bearerAuth")
  public async list(): Promise<{ items: SubjectDto[]; total: number }> {
    const [items, total] = await Promise.all([
      prisma.subject.findMany({ select: { id: true, name: true, code: true }, orderBy: { name: "asc" } }),
      prisma.subject.count(),
    ]);
    return { items, total };
  }
}


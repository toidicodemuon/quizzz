import type { Prisma, Role } from "@prisma/client";
import { prisma } from "../utils/prisma";
import {
  Controller,
  Get,
  Query,
  Response,
  Route,
  Security,
  Tags,
} from "tsoa";

type AuditLogItem = {
  id: number;
  userId: number | null;
  action: string;
  ip: string | null;
  userAgent: string | null;
  meta: Prisma.JsonValue | null;
  createdAt: Date;
  user: {
    id: number;
    email: string | null;
    fullName: string | null;
    userCode: string | null;
    role: Role;
  } | null;
};

type SessionItem = {
  id: number;
  userId: number;
  ip: string | null;
  userAgent: string | null;
  createdAt: Date;
  lastSeenAt: Date;
  logoutAt: Date | null;
  revokedAt: Date | null;
  user: {
    id: number;
    email: string | null;
    fullName: string | null;
    userCode: string | null;
    role: Role;
  } | null;
};

type SessionStatusFilter = "active" | "revoked" | "logged_out";

function parseDateParam(value?: string, endOfDay?: boolean): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  if (endOfDay && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    date.setHours(23, 59, 59, 999);
  }
  return date;
}

@Route("admin")
@Tags("AdminLogs")
export class AdminLogsController extends Controller {
  @Get("audit-logs")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["ADMIN"])
  public async getAuditLogs(
    @Query() page?: number,
    @Query() pageSize?: number,
    @Query() action?: string,
    @Query() userId?: number,
    @Query() search?: string,
    @Query() from?: string,
    @Query() to?: string
  ): Promise<{ items: AuditLogItem[]; total: number }> {
    const take = Math.max(1, Math.min(100, Number(pageSize) || 50));
    const skip = Math.max(0, ((Number(page) || 1) - 1) * take);

    const where: Prisma.AuditLogWhereInput = {};
    if (action && action.trim()) where.action = action.trim();
    if (typeof userId === "number" && Number.isFinite(userId)) {
      where.userId = userId;
    }

    const fromDate = parseDateParam(from);
    const toDate = parseDateParam(to, true);
    if (fromDate || toDate) {
      where.createdAt = {
        ...(fromDate ? { gte: fromDate } : {}),
        ...(toDate ? { lte: toDate } : {}),
      };
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.user = {
        OR: [
          { email: { contains: q } },
          { fullName: { contains: q } },
          { userCode: { contains: q } },
        ],
      };
    }

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        select: {
          id: true,
          userId: true,
          action: true,
          ip: true,
          userAgent: true,
          meta: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              userCode: true,
              role: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { items, total };
  }

  @Get("sessions")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["ADMIN"])
  public async getSessions(
    @Query() page?: number,
    @Query() pageSize?: number,
    @Query() status?: SessionStatusFilter,
    @Query() userId?: number,
    @Query() search?: string
  ): Promise<{ items: SessionItem[]; total: number }> {
    const take = Math.max(1, Math.min(100, Number(pageSize) || 50));
    const skip = Math.max(0, ((Number(page) || 1) - 1) * take);

    const where: Prisma.UserSessionWhereInput = {};
    if (typeof userId === "number" && Number.isFinite(userId)) {
      where.userId = userId;
    }
    if (status === "active") {
      where.revokedAt = null;
      where.logoutAt = null;
    } else if (status === "revoked") {
      where.revokedAt = { not: null };
    } else if (status === "logged_out") {
      where.logoutAt = { not: null };
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.user = {
        OR: [
          { email: { contains: q } },
          { fullName: { contains: q } },
          { userCode: { contains: q } },
        ],
      };
    }

    const [items, total] = await Promise.all([
      prisma.userSession.findMany({
        where,
        orderBy: { lastSeenAt: "desc" },
        skip,
        take,
        select: {
          id: true,
          userId: true,
          ip: true,
          userAgent: true,
          createdAt: true,
          lastSeenAt: true,
          logoutAt: true,
          revokedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              userCode: true,
              role: true,
            },
          },
        },
      }),
      prisma.userSession.count({ where }),
    ]);

    return { items, total };
  }
}

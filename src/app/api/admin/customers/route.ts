import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  // TEMPORARY: Bypass auth for testing
  return { user: { role: "ADMIN" } };
}

// GET /api/admin/customers — list all users
export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: { role: "USER" },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: { select: { orders: true } },
        orders: {
          select: { totalAmount: true },
        },
      },
    }),
    prisma.user.count({ where: { role: "USER" } }),
  ]);

  const usersWithSpend = users.map((u) => ({
    ...u,
    totalSpent: u.orders.reduce((sum, o) => sum + o.totalAmount, 0),
    orderCount: u._count.orders,
  }));

  return Response.json({ users: usersWithSpend, total, page });
}

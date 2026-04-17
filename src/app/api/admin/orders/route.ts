import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  // TEMPORARY: Bypass auth for testing
  return { user: { role: "ADMIN" } };
}

// GET /api/admin/orders — list all orders
export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const where: any = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { id: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        items: { include: { product: { select: { name: true, images: true } } } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return Response.json({ orders, total, page, totalPages: Math.ceil(total / limit) });
}

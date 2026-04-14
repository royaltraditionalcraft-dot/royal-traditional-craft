import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") return null;
  return session;
}

// PUT /api/admin/orders/[id] — update order status / tracking
export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/admin/orders/[id]">
) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await ctx.params;
  const body = await req.json();
  const { status, trackingNumber } = body;

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status, trackingNumber },
    });
    return Response.json({ order });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}

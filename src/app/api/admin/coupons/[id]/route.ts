import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") return null;
  return session;
}

// PATCH /api/admin/coupons/[id] — update coupon fields (including toggle isActive)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await params;
    const body = await req.json();

    // Only pick fields that are provided
    const data: Record<string, any> = {};
    if (body.isActive !== undefined) data.isActive = body.isActive;
    if (body.code !== undefined) data.code = String(body.code).trim().toUpperCase();
    if (body.type !== undefined) data.type = body.type;
    if (body.value !== undefined) data.value = parseFloat(body.value);
    if (body.description !== undefined) data.description = body.description;
    if (body.minOrder !== undefined) data.minOrder = parseFloat(body.minOrder);
    if (body.maxDiscount !== undefined) data.maxDiscount = parseFloat(body.maxDiscount);
    if (body.expiresAt !== undefined) data.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
    if (body.usageLimit !== undefined) data.usageLimit = body.usageLimit ? parseInt(body.usageLimit) : null;

    const coupon = await prisma.coupon.update({ where: { id }, data });
    return Response.json({ coupon });
  } catch (err: any) {
    if (err.code === "P2025") return Response.json({ error: "Coupon not found." }, { status: 404 });
    if (err.code === "P2002") return Response.json({ error: "Coupon code already exists." }, { status: 409 });
    return Response.json({ error: err.message }, { status: 400 });
  }
}

// DELETE /api/admin/coupons/[id] — delete coupon
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await params;
    await prisma.coupon.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (err: any) {
    if (err.code === "P2025") return Response.json({ error: "Coupon not found." }, { status: 404 });
    return Response.json({ error: err.message }, { status: 400 });
  }
}

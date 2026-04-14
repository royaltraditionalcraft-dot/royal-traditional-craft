import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") return null;
  return session;
}

// GET /api/admin/coupons — list all coupons
export async function GET() {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ coupons });
}

// POST /api/admin/coupons — create a coupon
export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const {
      code,
      type,
      value,
      description,
      minOrder,
      maxDiscount,
      isActive,
      expiresAt,
      usageLimit,
    } = body;

    if (!code || !type || value === undefined || !description) {
      return Response.json({ error: "Missing required fields." }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: String(code).trim().toUpperCase(),
        type,
        value: parseFloat(value),
        description: String(description),
        minOrder: parseFloat(minOrder ?? 0),
        maxDiscount: parseFloat(maxDiscount ?? 0),
        isActive: isActive ?? true,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
      },
    });

    return Response.json({ coupon }, { status: 201 });
  } catch (err: any) {
    // Prisma unique constraint violation
    if (err.code === "P2002") {
      return Response.json({ error: "Coupon code already exists." }, { status: 409 });
    }
    return Response.json({ error: err.message }, { status: 400 });
  }
}

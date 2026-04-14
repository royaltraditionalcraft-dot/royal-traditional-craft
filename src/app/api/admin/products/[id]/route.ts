import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") return null;
  return session;
}

// PUT /api/admin/products/[id] — update product
export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/admin/products/[id]">
) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await ctx.params;
  const body = await req.json();

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug ?? slugify(body.name),
        description: body.description,
        price: parseFloat(body.price),
        comparePrice: body.comparePrice ? parseFloat(body.comparePrice) : null,
        stock: parseInt(body.stock),
        images: body.images ?? [],
        categoryId: body.categoryId,
        isFeatured: body.isFeatured ?? false,
        isActive: body.isActive ?? true,
        weight: body.weight ? parseFloat(body.weight) : null,
        dimensions: body.dimensions ?? null,
        tags: body.tags ?? [],
      },
    });
    return Response.json({ product });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}

// DELETE /api/admin/products/[id] — delete product
export async function DELETE(
  req: NextRequest,
  ctx: RouteContext<"/api/admin/products/[id]">
) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await ctx.params;

  try {
    await prisma.product.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}

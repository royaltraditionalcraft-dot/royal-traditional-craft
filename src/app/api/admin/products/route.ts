import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return null;
  }
  return session;
}

// GET /api/admin/products — list all products
export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const where: any = {};
  if (search) where.OR = [
    { name: { contains: search, mode: "insensitive" } },
  ];
  if (category) where.categoryId = category;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { reviews: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return Response.json({ products, total, page, totalPages: Math.ceil(total / limit) });
}

// POST /api/admin/products — create product
export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const { name, description, price, comparePrice, stock, images, categoryId,
            isFeatured, isActive, weight, dimensions, tags } = body;

    const product = await prisma.product.create({
      data: {
        name,
        slug: slugify(name),
        description,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        stock: parseInt(stock),
        images: images ?? [],
        categoryId,
        isFeatured: isFeatured ?? false,
        isActive: isActive ?? true,
        weight: weight ? parseFloat(weight) : null,
        dimensions: dimensions ?? null,
        tags: tags ?? [],
      },
    });

    return Response.json({ product }, { status: 201 });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}

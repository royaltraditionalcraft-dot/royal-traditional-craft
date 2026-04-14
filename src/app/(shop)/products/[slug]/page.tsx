import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./ProductDetailClient";
import type { ProductWithCategory } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

import { MOCK_PRODUCTS } from "@/lib/data";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find(p => p.slug === slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find(p => p.slug === slug);

  // If not in hardcoded mocks, it might be in localStorage. Pass a placeholder.
  const resolvedProduct: any = product || {
    id: "local-product",
    name: "Loading product...",
    slug,
    price: 0,
    description: "Please wait...",
    stock: 0,
    category: { name: "Loading", slug: "loading" },
    images: [],
    reviews: [],
    isActive: true,
    tags: [],
    isFeatured: false,
  };

  // Related products
  const related = MOCK_PRODUCTS.filter(p => 
    resolvedProduct.category && p.category.slug === resolvedProduct.category.slug && p.id !== resolvedProduct.id
  ).slice(0, 4);

  const avgRating = 4.8; // Hardcoded mock rating

  return (
    <ProductDetailClient
      product={resolvedProduct as ProductWithCategory & { reviews: [] }}
      related={related.map(r => ({ ...r, _count: { reviews: 10 } })) as any[]}
      avgRating={avgRating}
    />
  );
}

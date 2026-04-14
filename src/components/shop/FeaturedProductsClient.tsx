"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import type { ProductWithCategory } from "@/types";

const INITIAL_FEATURED = [
  { id: "p1", name: "Maharaja King Bed", slug: "maharaja-king-bed", price: 89999, stock: 5, category: { name: "Beds", slug: "beds" }, images: ["https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800"], _count: { reviews: 24 }, isFeatured: true, isActive: true },
  { id: "p2", name: "Royal Sheesham Dining Set", slug: "royal-dining-table", price: 65000, stock: 3, category: { name: "Tables", slug: "tables" }, images: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800"], _count: { reviews: 18 }, isFeatured: true, isActive: true },
  { id: "p3", name: "Velvet Chesterfield Sofa", slug: "chesterfield-sofa", price: 45000, stock: 8, category: { name: "Sofas", slug: "sofas" }, images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800"], _count: { reviews: 12 }, isFeatured: true, isActive: true },
  { id: "p4", name: "Teak Armchair", slug: "teak-armchair", price: 18500, stock: 12, category: { name: "Chairs", slug: "chairs" }, images: ["https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800"], _count: { reviews: 15 }, isFeatured: false, isActive: true }
];

export function FeaturedProductsClient() {
  const [featured, setFeatured] = useState<any[]>(INITIAL_FEATURED);

  useEffect(() => {
    const savedStr = localStorage.getItem("MOCK_PRODUCTS");
    if (savedStr) {
      const allProducts = JSON.parse(savedStr);
      // Try to find the featured ones. For now, we take products that are active and either marked as featured or just the first few
      const activeFeatured = allProducts.filter((p: any) => p.isActive);
      const featuredSubset = activeFeatured.filter((p: any) => p.isFeatured);
      
      const toShow = featuredSubset.length >= 4 ? featuredSubset : activeFeatured;
      setFeatured(toShow.slice(0, 4).map((p: any) => ({ ...p, _count: { reviews: p._count?.reviews || 10 } })));
    }
  }, []);

  if (featured.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-cream-200 overflow-hidden">
            <div className="aspect-square skeleton" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-16 skeleton" />
              <div className="h-4 w-full skeleton" />
              <div className="h-4 w-3/4 skeleton" />
              <div className="h-5 w-24 skeleton" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {featured.map((p, index) => (
        <ProductCard key={p.id} product={p as ProductWithCategory & { _count: { reviews: number } }} index={index} />
      ))}
    </div>
  );
}

import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ProductWithCategory } from "@/types";

interface FeaturedProductsProps {
  products: ProductWithCategory[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-14 sm:py-20 md:py-24 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row items-end justify-between mb-8 sm:mb-12 gap-4">
          <div className="max-w-xl">
            <span className="text-muted-foreground font-semibold text-[10px] sm:text-sm uppercase tracking-widest mb-2 sm:mb-3 block">
              Curated Selection
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Featured Products
            </h2>
          </div>
          <Link href="/products" className="shrink-0">
            <Button variant="ghost" className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors hover:bg-transparent p-0 group">
              Shop All
              <ArrowRight className="ml-1 sm:ml-2 size-3 sm:size-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

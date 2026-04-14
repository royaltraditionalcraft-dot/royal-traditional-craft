import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types";

interface CategoryCardProps {
  category: Category & { _count?: { products: number } };
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative block overflow-hidden rounded-2xl bg-cream-100 border border-cream-200 hover:border-gold-300 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-royal"
      aria-label={`Shop ${category.name}`}
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            width={400}
            height={400}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-burgundy-100 to-cream-200 flex items-center justify-center">
            <span className="text-6xl opacity-30">🏺</span>
          </div>
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-burgundy-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-0 group-hover:translate-y-0">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 group-hover:bg-burgundy-700 transition-colors duration-300">
          <h3 className="font-heading text-burgundy-700 group-hover:text-gold-300 font-semibold text-lg transition-colors leading-tight">
            {category.name}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <p className="text-gray-500 group-hover:text-cream-300 text-xs transition-colors">
              {category._count?.products ?? 0} products
            </p>
            <ArrowRight
              size={16}
              className="text-gold-500 group-hover:text-gold-300 group-hover:translate-x-1 transition-all"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

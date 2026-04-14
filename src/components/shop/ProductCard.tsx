"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart } from "lucide-react";
import { formatPrice, getDiscount } from "@/lib/utils";
import type { ProductWithCategory } from "@/types";
import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  product: ProductWithCategory;
  index: number;
  className?: string;
}

export function ProductCard({ product, index, className }: ProductCardProps) {
  const { isInWishlist, toggleItem: toggleWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const discount = getDiscount(product.price, product.comparePrice ?? 0);
  const primaryImage = product.images[0] ?? null;
  const avgRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 4.5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: primaryImage,
      slug: product.slug,
      quantity: 1,
      stock: product.stock,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: primaryImage,
      slug: product.slug,
    });
  };

  return (
    <div className={cn("group h-full", className)}>
      <div className="relative h-full flex flex-col bg-white rounded-2xl sm:rounded-[32px] border border-border p-2 sm:p-3 transition-all duration-300 hover:shadow-premium">
        
        {/* Image Container */}
        <div className="relative aspect-square sm:aspect-[4/5] bg-secondary rounded-xl sm:rounded-[24px] overflow-hidden mb-2 sm:mb-4 shrink-0">
          <Link href={`/products/${product.slug}`} className="absolute inset-0 z-0">
            {primaryImage ? (
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1200px) 25vw, 20vw"
                className="w-full h-full object-contain p-2 sm:p-4 transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                No Image
              </div>
            )}
          </Link>

          {/* Heart */}
          <button
            onClick={handleWishlist}
            aria-label="Add to wishlist"
            className={cn(
              "absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center shadow-sm transition-all hover:scale-110 z-10",
              isInWishlist(product.id) ? "text-red-500" : "text-foreground"
            )}
          >
            <Heart size={13} className={cn("sm:hidden", isInWishlist(product.id) && "fill-current")} />
            <Heart size={16} className={cn("hidden sm:block", isInWishlist(product.id) && "fill-current")} />
          </button>

          {/* Badges */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2 z-10 pointer-events-none">
            {product.isNew && (
              <span className="bg-white text-foreground text-[9px] sm:text-[10px] font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-sm">
                New
              </span>
            )}
            {discount > 0 && (
              <span className="bg-red-50 text-red-600 text-[9px] sm:text-[10px] font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-sm">
                -{discount}%
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="px-1 sm:px-2 pb-1 sm:pb-2 flex-grow flex flex-col justify-between">
          <Link href={`/products/${product.slug}`} className="block group/link">
            <h3 className="text-[11px] sm:text-sm font-semibold text-foreground tracking-tight mb-0.5 sm:mb-1 line-clamp-2 sm:line-clamp-1 group-hover/link:text-primary transition-colors leading-tight">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center justify-between mt-1 sm:mt-2">
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] sm:text-[11px] text-muted-foreground font-medium mb-0 sm:mb-0.5 truncate">
                {product.category?.name || "Uncategorized"}
              </span>
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-[11px] sm:text-sm font-bold text-foreground">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground line-through font-medium hidden sm:block">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              aria-label="Add to cart"
              className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full bg-secondary hover:bg-foreground hover:text-white transition-colors flex items-center justify-center text-foreground ml-1"
            >
              <ShoppingCart size={12} className="sm:hidden" />
              <ShoppingCart size={14} className="hidden sm:block" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

interface MiniProductCardProps {
  product: any;
  className?: string;
}

export function MiniProductCard({ product, className }: MiniProductCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      slug: product.slug,
      quantity: 1,
      stock: product.stock
    });
  };

  return (
    <div className={cn("p-2 bg-white rounded-[24px] border border-border flex items-center gap-3 hover:shadow-sm transition-all group", className)}>
      <Link href={`/products/${product.slug}`} className="relative w-16 h-16 bg-secondary rounded-[18px] overflow-hidden shrink-0">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="64px"
            className="object-contain p-2"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[8px] text-muted-foreground">No img</div>
        )}
      </Link>
      
      <div className="flex-1 min-w-0">
        <Link href={`/products/${product.slug}`}>
          <h4 className="text-[11px] font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors pr-4 leading-tight">
            {product.name}
          </h4>
        </Link>
        <div className="flex items-center justify-between mt-1">
          <p className="text-[11px] font-bold text-foreground">{formatPrice(product.price)}</p>
          <button 
            onClick={handleAddToCart}
            className="p-1.5 rounded-full bg-secondary hover:bg-foreground hover:text-white transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}

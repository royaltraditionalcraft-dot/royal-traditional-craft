"use client";

import { useState } from "react";
import { ShoppingBag, Check, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ProductWithCategory } from "@/types";

interface AddToCartButtonProps {
  product: ProductWithCategory;
  quantity?: number;
  variant?: "default" | "overlay" | "detail";
  className?: string;
}

export function AddToCartButton({
  product,
  quantity = 1,
  variant = "default",
  className,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem, openCart } = useCartStore();

  const isOutOfStock = product.stock === 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock || loading) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 400)); // micro-delay for UX

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
      slug: product.slug,
      stock: product.stock,
      quantity,
    });

    setLoading(false);
    setAdded(true);
    openCart(); // Instantly open the sliding cart UI for the user
    toast.success(`${product.name} added!`, {
      description: `${quantity} item${quantity > 1 ? "s" : ""} in cart.`,
    });

    setTimeout(() => setAdded(false), 2000);
  };

  if (variant === "overlay") {
    return (
      <button
        id={`add-to-cart-${product.id}`}
        onClick={handleAddToCart}
        disabled={isOutOfStock || loading}
        className={cn(
          "w-full py-3 bg-foreground text-background text-sm font-semibold flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors disabled:opacity-60",
          className
        )}
      >
        {isOutOfStock ? (
          "Out of Stock"
        ) : added ? (
          <>
            <Check size={15} /> Added!
          </>
        ) : (
          <>
            <ShoppingBag size={15} /> Add to Cart
          </>
        )}
      </button>
    );
  }

  if (variant === "detail") {
    return (
      <button
        id={`add-to-cart-detail-${product.id}`}
        onClick={handleAddToCart}
        disabled={isOutOfStock || loading}
        className={cn(
          "flex-1 py-4 flex items-center justify-center gap-2.5 font-semibold rounded-full transition-all text-base",
          isOutOfStock
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : added
            ? "bg-green-600 text-white"
            : "bg-foreground text-background hover:bg-foreground/90 shadow-royal hover:shadow-xl hover:scale-[1.02]",
          className
        )}
      >
        {loading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : added ? (
          <>
            <Check size={20} /> Added to Cart!
          </>
        ) : isOutOfStock ? (
          "Out of Stock"
        ) : (
          <>
            <ShoppingBag size={20} /> Add to Cart
          </>
        )}
      </button>
    );
  }

  // Default
  return (
    <button
      id={`add-to-cart-${product.id}`}
      onClick={handleAddToCart}
      disabled={isOutOfStock || loading}
      className={cn(
        "px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all",
        isOutOfStock
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : added
          ? "bg-green-600 text-white"
          : "bg-foreground text-background hover:bg-foreground/90",
        className
      )}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : added ? (
        <>
          <Check size={14} /> Added
        </>
      ) : (
        <>
          <ShoppingBag size={14} /> Add to Cart
        </>
      )}
    </button>
  );
}

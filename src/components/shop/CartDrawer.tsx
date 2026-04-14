"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { useEffect, useMemo } from "react";
import { getRecommendations, getPopularProducts } from "@/lib/recommendations";
import { MiniProductCard } from "./MiniProductCard";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice } =
    useCartStore();

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const shippingFee = totalPrice >= 999 ? 0 : 99;
  const finalTotal = totalPrice + shippingFee;

  const recommendations = useMemo(() => {
    if (items.length > 0) {
      return getRecommendations(items[0].id, 2);
    }
    return getPopularProducts(2);
  }, [items]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <aside
        id="cart-drawer"
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-[70] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping Cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-background">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-foreground text-xl font-bold tracking-tight">
              Cart
            </h2>
            {totalItems > 0 && (
              <span className="bg-secondary text-foreground border border-border text-xs font-bold px-2 py-0.5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto bg-background">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 px-6 text-center">
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
                <ShoppingBag size={40} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-foreground font-bold tracking-tight text-xl mb-1">
                  Your cart is empty
                </p>
                <p className="text-muted-foreground text-sm">
                  Discover our minimalist collection
                </p>
              </div>
              <Link
                href="/products"
                onClick={closeCart}
                className="px-8 py-3 bg-foreground text-white text-sm font-semibold rounded-full hover:bg-foreground/90 transition-colors flex items-center gap-2"
              >
                Explore Products
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <ul className="px-4 py-4 space-y-4">
              {items.map((item) => (
                <li key={item.id} className="p-4 bg-white rounded-3xl flex gap-4 border border-border shadow-sm">
                  {/* Image */}
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeCart}
                    className="flex-shrink-0"
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-secondary">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover p-2"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary" />
                      )}
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={closeCart}
                      className="font-semibold text-foreground text-sm line-clamp-2 hover:text-foreground/80 transition-colors leading-snug tracking-tight"
                    >
                      {item.name}
                    </Link>
                    <p className="text-foreground font-bold text-sm mt-1">
                      {formatPrice(item.price)}
                    </p>

                    {/* Qty Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center bg-secondary rounded-full overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors text-foreground"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors text-foreground disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recommendations */}
        <div className="px-5 py-4 border-t border-border bg-slate-50/50">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">People also bought</p>
          <div className="grid grid-cols-1 gap-3">
            {recommendations.map((p) => (
              <MiniProductCard key={p.id} product={p} className="bg-white/50 backdrop-blur-sm" />
            ))}
          </div>
        </div>

        {/* Footer */}
          <div className="border-t border-border px-5 py-6 bg-background space-y-4">
            {/* Totals */}
            <div className="flex justify-between font-bold text-foreground text-lg mb-4">
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-4 bg-foreground text-white font-semibold rounded-full text-center hover:bg-foreground/90 transition-all shadow-premium"
              >
                Checkout
              </Link>
            </div>
          </div>
      </aside>
    </>
  );
}

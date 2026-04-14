"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useCouponStore } from "@/store/couponStore";
import { formatPrice } from "@/lib/utils";
import { CouponInput } from "@/components/shop/CouponInput";
import { calculateDiscount } from "@/lib/coupons";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore();
  const { appliedCoupon, discountAmount, removeCoupon } = useCouponStore();

  const baseShipping = totalPrice >= 999 ? 0 : 99;
  const shippingAfterCoupon =
    appliedCoupon?.type === "free_shipping" ? 0 : baseShipping;
  const discount = appliedCoupon ? discountAmount : 0;
  const total = totalPrice + shippingAfterCoupon - discount;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-28 h-28 rounded-full bg-cream-100 flex items-center justify-center">
          <ShoppingBag size={52} className="text-cream-400" />
        </div>
        <h1 className="font-heading text-burgundy-800 text-3xl font-bold">
          Your cart is empty
        </h1>
        <p className="text-gray-500 text-center max-w-sm">
          Looks like you haven&apos;t added anything yet. Explore our handcrafted collection!
        </p>
        <Link
          href="/products"
          className="px-8 py-4 bg-burgundy-700 text-white font-semibold rounded-full hover:bg-burgundy-800 transition-colors shadow-royal flex items-center gap-2"
        >
          Shop Now
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tighter mb-1 sm:mb-2">Shopping Cart</h1>
        <p className="text-muted-foreground mb-8 sm:mb-12 text-sm">
          {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
        </p>

        <div className="lg:grid lg:grid-cols-3 lg:gap-16">
          {/* Items */}
          <div className="lg:col-span-2 space-y-10">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-row gap-4 sm:gap-8 pb-8 sm:pb-10 border-b border-border last:border-0 items-start"
              >
                {/* Image */}
                <Link href={`/products/${item.slug}`} className="flex-shrink-0">
                  <div className="w-20 h-24 sm:w-32 sm:h-40 rounded-xl sm:rounded-2xl overflow-hidden bg-muted relative group">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="text-muted-foreground/20" />
                      </div>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between py-0 sm:py-1 min-w-0">
                  <div>
                    <div className="flex justify-between items-start gap-2 sm:gap-4">
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-sm sm:text-xl font-heading font-bold hover:text-primary transition-colors line-clamp-2 leading-tight"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm sm:text-xl font-bold font-heading shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm mt-0.5 sm:mt-1">{formatPrice(item.price)} each</p>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center border border-border rounded-full p-1 bg-muted/50">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-colors disabled:opacity-30"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-red-600 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors text-muted-foreground"
            >
              <ArrowRight size={16} className="rotate-180" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="mt-10 sm:mt-16 lg:mt-0">
            <div className="bg-muted/30 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 lg:p-10 lg:sticky lg:top-32 space-y-6">
              <h2 className="text-2xl font-heading font-bold tracking-tight border-b border-border pb-6">
                Order Summary
              </h2>

              {/* Coupon Input */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Have a coupon?</p>
                <CouponInput shipping={baseShipping} />
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-2 border-t border-border">
                <div className="flex justify-between text-muted-foreground font-medium text-sm pt-4">
                  <span>Subtotal</span>
                  <span className="text-foreground">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground font-medium text-sm">
                  <span>Shipping</span>
                  <span>
                    {shippingAfterCoupon === 0 ? (
                      <span className="text-green-600 font-bold">Free</span>
                    ) : (
                      formatPrice(shippingAfterCoupon)
                    )}
                  </span>
                </div>
                {discount > 0 && appliedCoupon?.type !== "free_shipping" && (
                  <div className="flex justify-between font-medium text-sm text-green-600">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>−{formatPrice(discount)}</span>
                  </div>
                )}
                {appliedCoupon?.type === "free_shipping" && baseShipping > 0 && (
                  <div className="flex justify-between font-medium text-sm text-green-600">
                    <span>Shipping ({appliedCoupon.code})</span>
                    <span>Free</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-4 border-t border-border">
                  <span className="text-lg font-bold">Total</span>
                  <div className="text-right">
                    {(discount > 0 || appliedCoupon?.type === "free_shipping") && (
                      <p className="text-xs text-muted-foreground line-through">{formatPrice(totalPrice + baseShipping)}</p>
                    )}
                    <span className="text-3xl font-heading font-bold text-primary">{formatPrice(Math.max(0, total))}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full py-5 bg-primary text-white font-bold rounded-full text-center hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 text-lg"
              >
                Checkout Now
                <ArrowRight size={20} />
              </Link>

              <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                <span>Secure Checkout</span>
                <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                <span>Free Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


"use client";

import { useState } from "react";
import { Tag, X, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { validateCoupon, calculateDiscount } from "@/lib/coupons";
import { useCouponStore } from "@/store/couponStore";
import { useCartStore } from "@/store/cartStore";

interface CouponInputProps {
  /** Base shipping cost before applying the coupon */
  shipping: number;
}

export function CouponInput({ shipping }: CouponInputProps) {
  const { totalPrice } = useCartStore();
  const { appliedCoupon, discountAmount, applyCoupon, removeCoupon } = useCouponStore();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);

    // Simulate a brief async validation (supports future API integration)
    await new Promise((r) => setTimeout(r, 600));

    const { coupon, error } = validateCoupon(code, totalPrice);
    if (error) {
      toast.error(error);
      setLoading(false);
      return;
    }

    // TypeScript narrowing: coupon is non-null here (error path returned above)
    if (!coupon) { setLoading(false); return; }

    const discount = calculateDiscount(coupon, totalPrice, shipping);
    applyCoupon(coupon, discount);
    setCode("");
    toast.success(`🎉 Coupon "${coupon.code}" applied! You save ${discount > 0 ? `₹${discount.toLocaleString("en-IN")}` : "on shipping"}.`);
    setLoading(false);
  };

  const handleRemove = () => {
    removeCoupon();
    toast.info("Coupon removed.");
  };

  // ── Applied state ──────────────────────────────────────────────────────────
  if (appliedCoupon) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-green-800 uppercase tracking-wider">
              {appliedCoupon.code}
            </p>
            <p className="text-xs text-green-700 mt-0.5">{appliedCoupon.description}</p>
          </div>
        </div>
        <button
          onClick={handleRemove}
          aria-label="Remove coupon"
          className="text-green-600 hover:text-green-800 transition-colors shrink-0 mt-0.5"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  // ── Input state ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Tag
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            placeholder="Enter coupon code"
            className="w-full bg-white border border-border rounded-xl pl-8 pr-3 py-2.5 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-foreground transition-colors placeholder:font-normal placeholder:normal-case placeholder:tracking-normal"
          />
        </div>
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="h-[42px] px-4 text-xs font-black uppercase tracking-widest bg-foreground text-background rounded-xl hover:bg-foreground/90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
        </button>
      </div>
      <p className="text-[10px] text-muted-foreground px-1">
        Try: <span className="font-bold cursor-pointer hover:text-foreground transition-colors" onClick={() => setCode("ROYAL10")}>ROYAL10</span>
        {" · "}
        <span className="font-bold cursor-pointer hover:text-foreground transition-colors" onClick={() => setCode("WELCOME500")}>WELCOME500</span>
        {" · "}
        <span className="font-bold cursor-pointer hover:text-foreground transition-colors" onClick={() => setCode("FREESHIP")}>FREESHIP</span>
      </p>
    </div>
  );
}

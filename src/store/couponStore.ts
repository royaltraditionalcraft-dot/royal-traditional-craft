"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Coupon } from "@/lib/coupons";

interface CouponState {
  appliedCoupon: Coupon | null;
  discountAmount: number;
  applyCoupon: (coupon: Coupon, discount: number) => void;
  removeCoupon: () => void;
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set) => ({
      appliedCoupon: null,
      discountAmount: 0,

      applyCoupon: (coupon, discount) =>
        set({ appliedCoupon: coupon, discountAmount: discount }),

      removeCoupon: () =>
        set({ appliedCoupon: null, discountAmount: 0 }),
    }),
    {
      name: "rtc-coupon",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

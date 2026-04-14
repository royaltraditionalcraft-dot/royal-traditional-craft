// ─────────────────────────────────────────────────────────────────────────────
// Centralized Coupon Definitions
// Add new coupons here. No database required — purely client-side via Zustand.
// ─────────────────────────────────────────────────────────────────────────────

export type CouponType = "percentage" | "flat" | "free_shipping";

export interface Coupon {
  code: string;
  type: CouponType;
  /** For percentage: 0–100. For flat: amount in ₹. For free_shipping: ignored. */
  value: number;
  description: string;
  /** Minimum cart value required to apply this coupon */
  minOrder: number;
  /** Max discount cap for percentage coupons (0 = no cap) */
  maxDiscount: number;
}

export const COUPONS: Coupon[] = [
  {
    code: "ROYAL10",
    type: "percentage",
    value: 10,
    description: "10% off your entire order",
    minOrder: 0,
    maxDiscount: 5000,
  },
  {
    code: "WELCOME500",
    type: "flat",
    value: 500,
    description: "Flat ₹500 off your first order",
    minOrder: 2000,
    maxDiscount: 0,
  },
  {
    code: "SUMMER20",
    type: "percentage",
    value: 20,
    description: "20% off — Summer Sale",
    minOrder: 5000,
    maxDiscount: 8000,
  },
  {
    code: "FREESHIP",
    type: "free_shipping",
    value: 0,
    description: "Free shipping on this order",
    minOrder: 0,
    maxDiscount: 0,
  },
  {
    code: "GRAND15",
    type: "percentage",
    value: 15,
    description: "15% off on orders above ₹10,000",
    minOrder: 10000,
    maxDiscount: 10000,
  },
];

/**
 * Validates a coupon code against cart subtotal and returns the coupon or an error.
 */
export function validateCoupon(
  code: string,
  subtotal: number
): { coupon: Coupon; error: null } | { coupon: null; error: string } {
  const found = COUPONS.find((c) => c.code === code.trim().toUpperCase());
  if (!found) return { coupon: null, error: "Invalid coupon code." };
  if (subtotal < found.minOrder)
    return {
      coupon: null,
      error: `Minimum order of ₹${found.minOrder.toLocaleString("en-IN")} required for this coupon.`,
    };
  return { coupon: found, error: null };
}

/**
 * Calculates the discount amount for a given coupon and subtotal.
 */
export function calculateDiscount(coupon: Coupon, subtotal: number, shipping: number): number {
  if (coupon.type === "free_shipping") return shipping;
  if (coupon.type === "flat") return Math.min(coupon.value, subtotal);
  if (coupon.type === "percentage") {
    const raw = (subtotal * coupon.value) / 100;
    return coupon.maxDiscount > 0 ? Math.min(raw, coupon.maxDiscount) : raw;
  }
  return 0;
}

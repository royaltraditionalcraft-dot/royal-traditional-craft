"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "@/types";

/** Re-validates the applied coupon after a cart change and clears it if invalid. */
function revalidateCoupon(newSubtotal: number) {
  // Lazy import to avoid circular dependency — both stores are standalone
  const { appliedCoupon, removeCoupon } = (
    require("@/store/couponStore") as typeof import("@/store/couponStore")
  ).useCouponStore.getState();

  if (appliedCoupon && newSubtotal < appliedCoupon.minOrder) {
    removeCoupon();
  }
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Computed
  totalItems: number;
  totalPrice: number;

  // Actions
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      get totalItems() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      get totalPrice() {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === newItem.id);
          if (existing) {
            const updatedQty = Math.min(
              existing.quantity + (newItem.quantity ?? 1),
              newItem.stock
            );
            return {
              items: state.items.map((i) =>
                i.id === newItem.id ? { ...i, quantity: updatedQty } : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...newItem, quantity: newItem.quantity ?? 1 },
            ],
          };
        });
        // Recompute subtotal and auto-clear invalid coupon
        revalidateCoupon(get().totalPrice);
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
        revalidateCoupon(get().totalPrice);
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i
          ),
        }));
        revalidateCoupon(get().totalPrice);
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "rtc-cart",
      storage: createJSONStorage(() => localStorage),
      // Only persist items, not the drawer state
      partialize: (state) => ({ items: state.items }),
    }
  )
);

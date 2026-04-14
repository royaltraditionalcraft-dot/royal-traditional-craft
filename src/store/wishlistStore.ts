"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
}

interface WishlistState {
  items: WishlistItem[];

  // Computed
  isInWishlist: (id: string) => boolean;

  // Actions
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      isInWishlist: (id) => get().items.some((item) => item.id === id),

      addItem: (item) => {
        set((state) => {
          if (state.items.some((i) => i.id === item.id)) return state;
          return {
            items: [...state.items, item],
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      toggleItem: (item) => {
        const isIn = get().isInWishlist(item.id);
        if (isIn) {
          get().removeItem(item.id);
        } else {
          get().addItem(item);
        }
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "rtc-wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
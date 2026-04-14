"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface HeroBanner {
  title: string;
  subtitle: string;
  buttonText: string;
  imageUrl: string;
}

interface BannerState {
  heroBanner: HeroBanner;
  updateHeroBanner: (banner: Partial<HeroBanner>) => void;
  resetHeroBanner: () => void;
}

const DEFAULT_BANNER: HeroBanner = {
  title: "Winter Deal",
  subtitle: "15% off new collection / 5% off outlet",
  buttonText: "Shop Collection",
  imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800",
};

export const useBannerStore = create<BannerState>()(
  persist(
    (set) => ({
      heroBanner: DEFAULT_BANNER,
      updateHeroBanner: (banner) =>
        set((state) => ({
          heroBanner: { ...state.heroBanner, ...banner },
        })),
      resetHeroBanner: () => set({ heroBanner: DEFAULT_BANNER }),
    }),
    {
      name: "rtc-banner",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

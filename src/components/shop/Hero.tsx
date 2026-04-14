"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useBannerStore } from "@/store/bannerStore";

export function Hero() {
  const { heroBanner } = useBannerStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = mounted ? heroBanner : {
    title: "Winter Deal",
    subtitle: "15% off new collection / 5% off outlet",
    buttonText: "Shop Collection",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800",
  };

  return (
    <section className="pt-20 sm:pt-24 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-background">
      <div className="bg-secondary rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 min-h-[320px] sm:min-h-[380px] md:min-h-[440px]">

        {/* Left Content */}
        <div className="relative z-10 w-full md:w-1/2 flex flex-col items-start gap-3 sm:gap-4 text-left">
          <div className="bg-white rounded-full px-3 sm:px-4 py-1 flex items-center justify-center shadow-pill">
            <span className="text-[10px] sm:text-xs font-bold text-foreground tracking-widest uppercase">Special Offer</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mt-1 leading-[1.1]">
            {data.title}
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground font-medium mb-2 sm:mb-4 md:mb-6 max-w-sm sm:max-w-md">
            {data.subtitle}
          </p>

          <Link href="/products">
            <Button size="lg" className="rounded-full px-7 sm:px-10 h-11 sm:h-14 text-xs sm:text-sm font-bold uppercase tracking-widest text-primary-foreground bg-primary hover:bg-primary/90 shadow-premium transition-all active:scale-95">
              {data.buttonText}
            </Button>
          </Link>
        </div>

        {/* Right Product Image */}
        <div className="relative z-10 w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-[380px] md:h-[380px] lg:w-[450px] lg:h-[450px] transition-all duration-1000 hover:scale-105">
            <Image
              src={data.imageUrl}
              alt="Premium Furniture Deal"
              fill
              sizes="(max-width: 480px) 192px, (max-width: 768px) 256px, (max-width: 1024px) 380px, 450px"
              className="object-contain drop-shadow-2xl mix-blend-multiply transition-all duration-700"
              priority
              loading="eager"
              unoptimized={mounted}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

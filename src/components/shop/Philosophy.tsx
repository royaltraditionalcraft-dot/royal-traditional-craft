"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function Philosophy() {
  return (
    <section className="py-16 sm:py-24 md:py-32 bg-background overflow-hidden border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: image first, then text. Desktop: 2-col side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-20 items-center">

          {/* Image — shown first on mobile via order */}
          <div className="relative order-first lg:order-last">
            <div className="aspect-[4/3] sm:aspect-[4/4] lg:aspect-[4/5] relative rounded-none overflow-hidden group transition-all duration-1000">
              <Image
                src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=800"
                alt="Crafting Minimalist Essentials"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="relative order-last lg:order-first">
            <div className="relative z-10">
              <span className="text-muted-foreground font-semibold text-[10px] sm:text-sm uppercase tracking-widest mb-4 sm:mb-6 block">
                Our Philosophy
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-5 sm:mb-8 text-foreground">
                Simplify <br />
                Your Space
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-normal leading-relaxed mb-8 sm:mb-12 max-w-lg">
                We believe that true elegance lies in simplicity. Our approach strips away the unnecessary, leaving you with essentials that are beautiful, functional, and timeless.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
                <div className="border-l border-foreground pl-4 sm:pl-6 py-1">
                  <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wide mb-1 sm:mb-2 text-foreground">Form Meets Function</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground font-normal">Designed thoughtfully to enhance your everyday routines effortlessly.</p>
                </div>
                <div className="border-l border-border pl-4 sm:pl-6 py-1">
                  <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wide mb-1 sm:mb-2 text-foreground">Quality Materials</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground font-normal">Sustainably sourced and masterfully crafted to last for generations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

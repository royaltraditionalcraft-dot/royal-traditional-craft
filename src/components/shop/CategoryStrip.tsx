"use client";

import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  { name: "Top Offers", slug: "offers", img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=200", isSale: true },
  { name: "Beds & Mattresses", slug: "beds", img: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=200" },
  { name: "Sofas & Recliners", slug: "sofas", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=200" },
  { name: "Tables & Dining", slug: "tables", img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=200" },
  { name: "Chairs", slug: "chairs", img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=200" },
  { name: "Wardrobes", slug: "wardrobes", img: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=200" },
  { name: "Storage", slug: "storage", img: "https://images.unsplash.com/photo-1594620302200-9a762244a156?q=80&w=200" },
  { name: "Decor", slug: "decor", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=200" },
];

export function CategoryStrip() {
  return (
    <div className="bg-white border-b border-border w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-8 sm:py-12">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="flex flex-col items-center gap-5 group flex-shrink-0 cursor-pointer"
            >
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-3xl bg-off-white overflow-hidden flex items-center justify-center p-4 transition-all duration-500 group-hover:bg-brand-gold/10 group-hover:translate-y-[-4px] group-hover:shadow-premium">
                <Image
                  src={cat.img}
                  alt={cat.name}
                  width={100}
                  height={100}
                  className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                {cat.isSale && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
                )}
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-gray/40 group-hover:text-brand-gold transition-colors">
                  {cat.slug}
                </span>
                <span className="text-xs font-bold text-brand-black tracking-tight">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";

const categories = [
  { name: "Sofas", slug: "sofas", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800" },
  { name: "Beds", slug: "beds", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800" },
  { name: "Tables", slug: "tables", image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=800" },
  { name: "Chairs", slug: "chairs", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800" },
  { name: "Vanity", slug: "vanity", image: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=800" },
  { name: "Storage", slug: "wardrobes", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800" },
  { name: "TV Units", slug: "media", image: "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?q=80&w=800" },
  { name: "Mattress", slug: "mattress", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800" },
  { name: "Bookshelves", slug: "bookshelves", image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=800" },
  { name: "Seating", slug: "executive", image: "https://images.unsplash.com/photo-1505797149-43b007664976?q=80&w=800" },
  { name: "Prayer", slug: "prayer", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800" },
];

export function CategoryGrid() {
  return (
    <section className="py-5 sm:py-8 bg-background border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="flex items-center gap-5 sm:gap-8 overflow-x-auto pb-2 sm:pb-4 hide-scrollbar"
          style={{ scrollbarWidth: "none" }}
        >
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="flex flex-col items-center gap-2 min-w-[56px] sm:min-w-[68px] group cursor-pointer flex-shrink-0"
            >
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-secondary border border-border group-hover:border-foreground transition-colors">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="64px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors text-center whitespace-nowrap">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

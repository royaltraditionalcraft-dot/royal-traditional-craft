"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const collections = [
  { name: "Luxury Sofa Sets", slug: "sofas", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800" },
  { name: "Premium Bedframes", slug: "beds", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800" },
  { name: "Elegant Dining & Coffee Tables", slug: "tables", image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=800" },
  { name: "Designer Chairs", slug: "chairs", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800" },
  { name: "Vanity & Dressing Units", slug: "vanity", image: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=800" },
  { name: "Wardrobe & Storage Solutions", slug: "wardrobes", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800" },
  { name: "Media & TV Consoles", slug: "media", image: "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?q=80&w=800" },
  { name: "Orthopedic & Comfort Mattresses", slug: "mattress", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800" },
  { name: "Modern Bookshelves & Racks", slug: "bookshelves", image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=800" },
  { name: "Executive & Occasional Seating", slug: "executive", image: "https://images.unsplash.com/photo-1505797149-43b007664976?q=80&w=800" },
  { name: "Divine Prayer Units", slug: "prayer", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800" },
];

export function ShopByCollection() {
  return (
    <section className="py-16 sm:py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-10 sm:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground font-semibold text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-3 sm:mb-4 block"
          >
            Curated Series
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground"
          >
            Shop By Collection
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04, duration: 0.6 }}
            >
              <Link
                href={`/products?category=${collection.slug}`}
                className="group relative block aspect-square overflow-hidden rounded-2xl sm:rounded-[32px] bg-secondary border border-border transition-all duration-500 hover:shadow-premium"
              >
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute inset-0 p-3 sm:p-5 md:p-8 flex flex-col justify-end">
                  <h3 className="text-sm sm:text-base md:text-xl font-bold text-white leading-tight mb-1 sm:mb-2">
                    {collection.name}
                  </h3>

                  <div className="hidden sm:flex items-center gap-1 sm:gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-white/80 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    Explore
                    <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

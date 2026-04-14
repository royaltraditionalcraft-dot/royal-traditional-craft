"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const rooms = [
  {
    name: "Living Room",
    subtitle: "Modern Comfort",
    slug: "Living",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800",
  },
  {
    name: "Bedroom",
    subtitle: "Serene Sanctuary",
    slug: "Beds",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800",
  },
  {
    name: "Dining Room",
    subtitle: "Royal Gatherings",
    slug: "Tables",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800",
  },
  {
    name: "Home Office",
    subtitle: "Focused Focus",
    slug: "Chairs",
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?q=80&w=800",
  },
];

export function RoomCategories() {
  return (
    <section className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-muted-foreground font-semibold text-sm uppercase tracking-widest mb-4 block">
            Shop by Space
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Curated Rooms
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rooms.map((room, index) => (
            <motion.div
              key={room.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
            >
              <Link
                href={`/products?category=${room.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-none bg-secondary border border-border"
              >
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70 mb-2">
                      {room.subtitle}
                    </p>
                    <h3 className="text-2xl font-bold text-white mb-6">
                      {room.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    View Collection
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
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

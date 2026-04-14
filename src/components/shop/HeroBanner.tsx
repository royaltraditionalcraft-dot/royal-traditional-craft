"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    id: 1,
    title: "Big Diwali Sale",
    subtitle: "Up to 80% Off on Furniture",
    href: "/products?sale=true",
    bg: "from-blue-600 via-blue-500 to-blue-400",
    imgUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&h=400&fit=crop"
  },
  {
    id: 2,
    title: "Best of Electronics",
    subtitle: "New Launches Every Day",
    href: "/products",
    bg: "from-orange-500 via-yellow-500 to-orange-400",
    imgUrl: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1200&h=400&fit=crop"
  },
  {
    id: 3,
    title: "Home Decor Fest",
    subtitle: "Upgrade your living space",
    href: "/category/decor",
    bg: "from-indigo-600 via-purple-500 to-pink-500",
    imgUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1200&h=400&fit=crop"
  },
];

export function HeroBanner() {
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay.current]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 sm:mt-4 mb-4">
       <section className="relative overflow-hidden rounded-sm shadow-sm">
         <div ref={emblaRef} className="overflow-hidden">
           <div className="flex">
             {SLIDES.map((slide) => (
               <div
                 key={slide.id}
                 className="relative flex-[0_0_100%] min-w-0 h-[150px] sm:h-[220px] md:h-[280px] bg-gray-200"
               >
                  <Link href={slide.href} className="w-full h-full block relative group">
                     {/* If we had real banners we would just use an <Image> here. For now we use the gradient + text to simulate a sale banner. */}
                     <div 
                       className="absolute inset-0 bg-cover bg-center" 
                       style={{ backgroundImage: `url(${slide.imgUrl})` }}
                     />
                     {/* Overlay for text readability */}
                     <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg} opacity-80 mix-blend-multiply`} />
                     
                     <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-20 text-white">
                        <h2 className="text-2xl md:text-5xl font-extrabold mb-2 uppercase tracking-wide">{slide.title}</h2>
                        <h3 className="text-lg md:text-2xl font-medium">{slide.subtitle}</h3>
                     </div>
                  </Link>
               </div>
             ))}
           </div>
         </div>

         {/* Flipkart style rectangular nav arrows */}
         <button
           onClick={scrollPrev}
           className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 w-8 h-16 bg-white shadow-md items-center justify-center text-gray-800 hover:text-foreground rounded-r-sm z-10"
           aria-label="Previous slide"
         >
           <ChevronLeft size={24} />
         </button>
         <button
           onClick={scrollNext}
           className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 w-8 h-16 bg-white shadow-md items-center justify-center text-gray-800 hover:text-foreground rounded-l-sm z-10"
           aria-label="Next slide"
         >
           <ChevronRight size={24} />
         </button>

         {/* Dots */}
         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
           {SLIDES.map((_, i) => (
             <button
               key={i}
               onClick={() => scrollTo(i)}
               className={cn(
                 "h-1.5 rounded-full transition-all duration-300",
                 i === selectedIndex
                   ? "w-6 bg-white"
                   : "w-2 bg-white/50 hover:bg-white/80"
               )}
               aria-label={`Go to slide ${i + 1}`}
             />
           ))}
         </div>
       </section>
    </div>
  );
}

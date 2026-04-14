import type { Metadata } from "next";
import { Hero } from "@/components/shop/Hero";
import { CategoryGrid } from "@/components/shop/CategoryGrid";
import { FeaturedProducts } from "@/components/shop/FeaturedProducts";
import { Philosophy } from "@/components/shop/Philosophy";
import { TrustBadges } from "@/components/shop/TrustBadges";
import { ShopByCollection } from "@/components/shop/ShopByCollection";
import type { ProductWithCategory } from "@/types";

export const metadata: Metadata = {
  title: "SHOP | Essentials",
  description: "Modern essentials for everyday living. Shop our latest collection.",
};

import { NewsletterForm } from "@/components/shop/NewsletterForm";

export default async function HomePage() {
  // Mock data for featured products
  const featuredProducts: ProductWithCategory[] = [
    { 
      id: "prod_1", 
      name: "Lumina Smart Bed", 
      slug: "lumina-smart-bed", 
      price: 89999, 
      stock: 5, 
      images: ["https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800"], 
      category: { id: "cat_beds", name: "Beds", slug: "beds" }, 
      _count: { reviews: 24 }, 
      createdAt: new Date(), 
      updatedAt: new Date(), 
      isFeatured: true, 
      isActive: true, 
      weight: null, 
      dimensions: null, 
      tags: [], 
      categoryId: "cat_beds", 
      comparePrice: 120000, 
      description: "Advanced sleep ergonomics meets minimalist aesthetics.",
      isNew: true
    },
    { 
      id: "prod_2", 
      name: "Core Dining Nexus", 
      slug: "core-dining-nexus", 
      price: 65000, 
      stock: 3, 
      images: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800"], 
      category: { id: "cat_tables", name: "Tables", slug: "tables" }, 
      _count: { reviews: 18 }, 
      createdAt: new Date(), 
      updatedAt: new Date(), 
      isFeatured: true, 
      isActive: true, 
      weight: null, 
      dimensions: null, 
      tags: [], 
      categoryId: "cat_tables", 
      comparePrice: 75000, 
      description: "A centerpiece designed for modern connectivity and style.",
      isNew: false
    },
    { 
      id: "prod_3", 
      name: "Zenith Modular Sofa", 
      slug: "zenith-modular-sofa", 
      price: 45000, 
      stock: 8, 
      images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800"], 
      category: { id: "cat_sofas", name: "Sofas", slug: "sofas" }, 
      _count: { reviews: 12 }, 
      createdAt: new Date(), 
      updatedAt: new Date(), 
      isFeatured: true, 
      isActive: true, 
      weight: null, 
      dimensions: null, 
      tags: [], 
      categoryId: "cat_sofas", 
      comparePrice: 55000, 
      description: "Adaptable comfort for the redefined living space.",
      isNew: true
    },
    { 
      id: "prod_4", 
      name: "Aero Ergonomic Chair", 
      slug: "aero-ergonomic-chair", 
      price: 18500, 
      stock: 12, 
      images: ["https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800"], 
      category: { id: "cat_chairs", name: "Chairs", slug: "chairs" }, 
      _count: { reviews: 15 }, 
      createdAt: new Date(), 
      updatedAt: new Date(), 
      isFeatured: true, 
      isActive: true, 
      weight: null, 
      dimensions: null, 
      tags: [], 
      categoryId: "cat_chairs", 
      comparePrice: 22000, 
      description: "Precision engineered for ultimate focus and support.",
      isNew: false
    }
  ];
  return (
    <div className="flex flex-col">
      <Hero />
      <main>
        <CategoryGrid />
        <FeaturedProducts products={featuredProducts} />
        <TrustBadges />
        <ShopByCollection />
        <Philosophy />
        
        {/* Newsletter Section */}
        <section className="py-16 sm:py-24 md:py-32 bg-muted border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-md mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 sm:mb-4 block">Stay Updated</span>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-6 text-foreground">
                JOIN THE CLUB
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-10">
                Unlock exclusive early access and member-only releases.
              </p>
              <div className="bg-background p-1 rounded-md border border-border shadow-sm">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <BackToTop />
    </div>
  );
}

function BackToTop() {
  return (
    <a
      id="back-to-top"
      href="#"
      className="fixed bottom-10 right-10 z-50 w-12 h-12 bg-foreground text-background rounded-full shadow-md flex items-center justify-center hover:bg-foreground/90 transition-all duration-300"
      aria-label="Back to top"
    >
      <span className="text-xl font-bold">↑</span>
    </a>
  );
}

import { Globe, Camera, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-border py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2-col on mobile, 4-col on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-16">
          
          {/* Brand — full width on xs, then col-span-2 on sm so it has room */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4 sm:gap-6">
            <Link href="/" className="text-base sm:text-xl font-bold tracking-tight text-foreground">
              Royaltraditionalcraft
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-xs text-xs sm:text-sm">
              Quality essentials for modern living. Designed with purpose and crafted with care.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-foreground transition-all"><Camera className="size-4 sm:size-5" /></a>
              <a href="#" aria-label="Website" className="text-muted-foreground hover:text-foreground transition-all"><Globe className="size-4 sm:size-5" /></a>
              <a href="#" aria-label="Email" className="text-muted-foreground hover:text-foreground transition-all"><Mail className="size-4 sm:size-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-xs sm:text-sm tracking-wide mb-4 sm:mb-6 text-foreground">Shop</h4>
            <ul className="flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link href="/products?category=sofas" className="hover:text-foreground transition-colors">Sofa Sets</Link></li>
              <li><Link href="/products?category=beds" className="hover:text-foreground transition-colors">Bedframes</Link></li>
              <li><Link href="/products?category=chairs" className="hover:text-foreground transition-colors">Chairs</Link></li>
              <li><Link href="/products?category=tables" className="hover:text-foreground transition-colors">Dining Tables</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs sm:text-sm tracking-wide mb-4 sm:mb-6 text-foreground">Support</h4>
            <ul className="flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
              <li><Link href="/shipping" className="hover:text-foreground transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/care" className="hover:text-foreground transition-colors">Product Care</Link></li>
              <li><Link href="/warranty" className="hover:text-foreground transition-colors">Warranty</Link></li>
              <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="font-bold text-xs sm:text-sm tracking-wide mb-4 sm:mb-6 text-foreground">Newsletter</h4>
            <p className="text-muted-foreground mb-3 sm:mb-4 text-xs sm:text-sm">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <div className="flex flex-col gap-2 sm:gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-muted border border-border rounded-md px-3 sm:px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-foreground transition-all text-xs sm:text-sm"
              />
              <button className="bg-foreground text-background rounded-md px-4 py-2 font-medium text-xs sm:text-sm hover:bg-foreground/90 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <Separator className="bg-border mb-6 sm:mb-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground">
          <p>© 2026 Royaltraditionalcraft. All rights reserved.</p>
          <div className="flex gap-4 sm:gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

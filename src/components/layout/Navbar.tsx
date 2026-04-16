"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, Search, User, X, LogOut, Store } from "lucide-react";
import { signOut } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";
import type { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import { MOCK_CATEGORIES } from "@/lib/data";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavbarProps {
  session: Session | null;
}

export function Navbar({ session }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems, toggleCart } = useCartStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b",
        isScrolled
          ? "bg-white/90 backdrop-blur-xl py-3 border-border shadow-sm"
          : "bg-white/50 backdrop-blur-md py-5 border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-16">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <span className="text-sm font-bold tracking-[0.2em] text-foreground uppercase">
              Royaltraditionalcraft
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList className="gap-6">
                <NavigationMenuItem>
                  <Link href="/products" className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all">
                    All Series
                  </Link>
                </NavigationMenuItem>
                {MOCK_CATEGORIES.slice(0, 4).map((cat) => (
                  <NavigationMenuItem key={cat.id}>
                    <Link href={`/products?category=${cat.slug}`} className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all">
                      {cat.name.split(' ')[0]} {/* Show first word for brevity in navbar */}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center bg-off-white rounded-full px-5 py-2 animate-in fade-in slide-in-from-right-4 duration-500 shadow-pill border border-border">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find your wisdom..."
                  className="bg-transparent border-none outline-none text-xs w-32 sm:w-64 placeholder:text-muted-foreground/60 font-medium"
                />
                <button type="button" onClick={() => setIsSearchOpen(false)}>
                  <X className="size-4 text-muted-foreground hover:text-foreground transition-all" />
                </button>
              </form>
            ) : (
              <Button variant="ghost" size="icon" className="hover:bg-off-white rounded-full transition-all" onClick={() => setIsSearchOpen(true)}>
                <Search className="size-5" />
              </Button>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2">
            {session ? (
              <div className="flex items-center gap-1">
                <Link href="/profile">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-off-white rounded-full h-9 w-9" 
                    title="My Profile"
                  >
                    <User className="size-5 shadow-sm" />
                  </Button>
                </Link>
                {(session.user as any).role === "ADMIN" && (
                  <Link href="/admin">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="hover:bg-off-white rounded-full text-foreground h-9 w-9" 
                      title="Admin Panel"
                    >
                      <Store className="size-5" />
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-off-white rounded-full text-muted-foreground hover:text-red-500 h-9 w-9" 
                  onClick={() => signOut({ callbackUrl: "/" })} 
                  title="Logout"
                >
                  <LogOut className="size-4" />
                </Button>
              </div>
            ) : (
              <Button 
                render={<Link href="/login" />} 
                nativeButton={false} 
                variant="outline" 
                className="rounded-full px-6 py-2 h-9 text-[10px] font-bold uppercase tracking-widest border-border hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300"
              >
                Login
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-off-white rounded-full transition-all"
            onClick={toggleCart}
          >
            <ShoppingCart className="size-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Button>

          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden hover:bg-off-white rounded-full" />}>
              <Menu className="size-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[400px] border-l-0 p-8">
               {/* Mobile content simplified for premium feel */}
              <div className="flex flex-col gap-12 mt-16 font-sans">
                <div className="flex flex-col gap-6">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Shop</p>
                  <Link href="/products" className="text-3xl font-medium tracking-tight hover:text-foreground/80 transition-colors">All Series</Link>
                  {MOCK_CATEGORIES.slice(0, 6).map((cat) => (
                    <Link 
                      key={cat.id} 
                      href={`/products?category=${cat.slug}`} 
                      className="text-3xl font-medium tracking-tight hover:text-foreground/80 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-6">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Account</p>
                  {session ? (
                    <>
                      <Link href="/profile" className="text-2xl font-medium tracking-tight">My Profile</Link>
                      <Link href="/orders" className="text-2xl font-medium tracking-tight">Order History</Link>
                      {(session.user as any).role === "ADMIN" && (
                        <Link href="/admin" className="text-2xl font-medium tracking-tight text-foreground">Admin Panel</Link>
                      )}
                      <button onClick={() => signOut({ callbackUrl: "/" })} className="text-2xl font-medium tracking-tight text-red-500 text-left transition-colors hover:text-red-600">Sign Out</button>
                    </>
                  ) : (
                    <Link href="/login" className="text-2xl font-medium tracking-tight hover:text-foreground/80 transition-colors">Sign In</Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

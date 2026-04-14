"use client";

import Link from "next/link";
import { Suspense, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductFiltersPanel } from "@/components/shop/ProductFilters";
import { ProductMobileFilters } from "@/components/shop/ProductMobileFilters";
import { ProductSortSelect } from "@/components/shop/ProductSortSelect";

const PAGE_SIZE = 12;

import { MOCK_CATEGORIES, MOCK_PRODUCTS as INITIAL_MOCK_PRODUCTS } from "@/lib/data";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState<any[]>(INITIAL_MOCK_PRODUCTS);

  // Sync with LocalStorage on mount
  useEffect(() => {
    const savedStr = localStorage.getItem("MOCK_PRODUCTS");
    if (savedStr) {
      const parsed = JSON.parse(savedStr).map((p: any) => ({
         ...p, 
         // Generating stable-ish random reviews if missing for popularity sort
         _count: p._count || { reviews: (p.name.length * 13) % 40 }, 
         createdAt: p.createdAt ? new Date(p.createdAt) : new Date()
      }));
      setAllProducts(parsed);
    }
  }, []);

  // 1. Extract parameters directly from URL as per requirement
  const sortBy = searchParams.get("sortBy") || "latest";
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const inStock = searchParams.get("inStock");
  const pageParam = searchParams.get("page") || "1";

  // 2. Compute Filtered & Sorted list using useMemo for efficiency
  const filteredAndSortedProducts = useMemo(() => {
    let list = [...allProducts];

    // Filtering
    if (category) {
      const catSlug = category.toLowerCase();
      list = list.filter(p => 
        p.category?.slug?.toLowerCase() === catSlug || 
        p.categoryId?.toLowerCase() === `cat_${catSlug}`
      );
    }

    if (search) {
      const s = search.toLowerCase();
      list = list.filter(p => 
        p.name?.toLowerCase().includes(s) || 
        p.category?.name?.toLowerCase().includes(s)
      );
    }

    if (inStock === "true") {
      list = list.filter(p => p.stock > 0);
    }

    if (minPrice) {
      list = list.filter(p => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      list = list.filter(p => p.price <= parseFloat(maxPrice));
    }

    // ────────────────────────────────────────────────────────────────
    // 3. EXPLICIT SORTING LOGIC AS REQUESTED
    // ────────────────────────────────────────────────────────────────
    if (sortBy === "price_asc") {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "popularity") {
      list.sort((a, b) => (Number(b._count?.reviews) || 0) - (Number(a._count?.reviews) || 0));
    } else {
      // Default: Latest
      list.sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
        const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
    }

    return list;
  }, [allProducts, sortBy, category, search, minPrice, maxPrice, inStock]);

  const page = Math.max(1, parseInt(pageParam));
  const total = filteredAndSortedProducts.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paginatedProducts = filteredAndSortedProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Page Header */}
      <div className="bg-[#fafafa] border-b border-border py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 sm:mb-4">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="text-foreground">
              {category
                ? MOCK_CATEGORIES.find((c) => c.slug.toLowerCase() === category.toLowerCase())?.name ?? "Products"
                : "All Products"}
            </span>
          </nav>
          <h1 className="font-heading text-foreground text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            {search
              ? `Search: "${search}"`
              : category
              ? MOCK_CATEGORIES.find((c) => c.slug.toLowerCase() === category.toLowerCase())?.name ?? "Products"
              : "All Products"}
          </h1>
          <p className="text-muted-foreground mt-2 sm:mt-4 text-xs sm:text-sm font-medium">
            {total} furniture piece{total !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <ProductFiltersPanel
              categories={MOCK_CATEGORIES as any}
              currentParams={{ 
                category: category ?? undefined, 
                sortBy: sortBy ?? undefined, 
                minPrice: minPrice ?? undefined, 
                maxPrice: maxPrice ?? undefined, 
                inStock: inStock ?? undefined, 
                search: search ?? undefined 
              }}
            />
          </aside>

          {/* Grid Area */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <ProductMobileFilters 
                  categories={MOCK_CATEGORIES as any} 
                  currentParams={{ 
                    category: category ?? undefined, 
                    sortBy: sortBy ?? undefined, 
                    minPrice: minPrice ?? undefined, 
                    maxPrice: maxPrice ?? undefined, 
                    inStock: inStock ?? undefined, 
                    search: search ?? undefined 
                  }} 
                />
                <p className="text-gray-600 text-[11px] font-bold uppercase tracking-widest hidden sm:block">
                  Showing {total > 0 ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, total)} of {total}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {/* 4. Fix Dropdown Sync: Pass exact value from URL */}
                <ProductSortSelect value={sortBy} />
              </div>
            </div>

            {paginatedProducts.length > 0 ? (
              <div
                key={sortBy}
                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 animate-in fade-in duration-500"
              >
                {paginatedProducts.map((p, index) => (
                  <ProductCard key={p.id} product={p as any} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-3xl border border-border">
                <p className="text-6xl mb-4">🔍</p>
                <h2 className="font-heading text-foreground text-2xl font-bold mb-2">No furniture found</h2>
                <p className="text-muted-foreground font-medium">Try adjusting your filters or search terms.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-3">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/products?${new URLSearchParams({
                      ...(sortBy !== "latest" ? { sortBy } : {}),
                      ...(category ? { category } : {}),
                      ...(search ? { search } : {}),
                      page: String(p),
                    })}`}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      p === page
                        ? "bg-foreground text-background shadow-premium scale-110"
                        : "bg-white border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                    }`}
                  >
                    {p}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ProductsContent />
    </Suspense>
  );
}

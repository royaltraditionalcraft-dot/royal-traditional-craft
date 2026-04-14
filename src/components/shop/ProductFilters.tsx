"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFiltersPanelProps {
  categories: Category[];
  currentParams: Record<string, string | undefined>;
}

const PRICE_RANGES = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 – ₹1,500", min: 500, max: 1500 },
  { label: "₹1,500 – ₹5,000", min: 1500, max: 5000 },
  { label: "₹5,000 – ₹10,000", min: 5000, max: 10000 },
  { label: "Above ₹10,000", min: 10000, max: undefined },
];

export function ProductFiltersPanel({
  categories,
  currentParams,
}: ProductFiltersPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const applyFilter = useCallback(
    (key: string, value: string | undefined) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      if (value) {
        currentParams.set(key, value);
      } else {
        currentParams.delete(key);
      }
      currentParams.delete("page");
      router.replace(`${pathname}?${currentParams.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const clearFilters = () => {
    router.replace("/products");
  };

  const hasFilters =
    currentParams.category ||
    currentParams.minPrice ||
    currentParams.maxPrice ||
    currentParams.inStock;

  return (
    <div className="space-y-6 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <h2 className="font-heading text-foreground font-bold text-sm uppercase tracking-widest">
          Filters
        </h2>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="bg-white rounded-3xl p-6 border border-border shadow-pill">
        <h3 className="font-bold text-foreground text-[10px] uppercase tracking-[0.2em] mb-4">
          Category
        </h3>
        <ul className="space-y-1">
          <li>
            <Link
              href="/products"
              className={`block text-xs font-bold uppercase tracking-widest py-2.5 px-4 rounded-xl transition-all ${
                !currentParams.category
                  ? "bg-foreground text-background shadow-premium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              All Products
            </Link>
          </li>
          {categories.map((cat) => {
            const isActive = currentParams.category?.toLowerCase() === cat.slug.toLowerCase();
            return (
              <li key={cat.id}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className={`block text-xs font-bold uppercase tracking-widest py-2.5 px-4 rounded-xl transition-all ${
                    isActive
                      ? "bg-foreground text-background shadow-premium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {cat.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Price Range */}
      <div className="bg-white rounded-3xl p-6 border border-border shadow-pill">
        <h3 className="font-bold text-foreground text-[10px] uppercase tracking-[0.2em] mb-4">
          Price Range
        </h3>
        <ul className="space-y-1">
          {PRICE_RANGES.map((range) => {
            const isActive =
              currentParams.minPrice === String(range.min) &&
              currentParams.maxPrice === String(range.max ?? "");
            return (
              <li key={range.label}>
                <button
                  onClick={() => {
                    const currentParams = new URLSearchParams(searchParams.toString());
                    currentParams.set("minPrice", String(range.min));
                    if (range.max) {
                      currentParams.set("maxPrice", String(range.max));
                    } else {
                      currentParams.delete("maxPrice");
                    }
                    currentParams.delete("page");
                    router.replace(`${pathname}?${currentParams.toString()}`);
                  }}
                  className={`w-full text-left text-xs font-bold uppercase tracking-widest py-2.5 px-4 rounded-xl transition-all ${
                    isActive
                      ? "bg-foreground text-background shadow-premium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {range.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* In Stock */}
      <div className="bg-white rounded-3xl p-6 border border-border shadow-pill">
        <h3 className="font-bold text-foreground text-[10px] uppercase tracking-[0.2em] mb-4">
          Availability
        </h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={currentParams.inStock === "true"}
            onChange={(e) =>
              applyFilter("inStock", e.target.checked ? "true" : undefined)
            }
            className="w-4 h-4 accent-foreground"
          />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">In Stock Only</span>
        </label>
      </div>
    </div>
  );
}

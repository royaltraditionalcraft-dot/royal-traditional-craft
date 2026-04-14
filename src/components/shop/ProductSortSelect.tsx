"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface SortSelectProps {
  value: string;
}

/**
 * ProductSortSelect
 * Directly controls the URL search parameters to drive the sorting state.
 */
export function ProductSortSelect({ value }: SortSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    const currentParams = new URLSearchParams(searchParams.toString());
    
    // Update sortBy and reset page to 1
    currentParams.set("sortBy", newValue);
    currentParams.delete("page");

    // Robust navigation
    router.replace(`${pathname}?${currentParams.toString()}`);
  };

  return (
    <select
      value={value}
      onChange={handleSortChange}
      className="px-6 py-2.5 border border-border rounded-full text-[10px] font-bold uppercase tracking-widest bg-white focus:outline-none focus:ring-2 focus:ring-foreground/5 shadow-pill transition-all cursor-pointer"
    >
      <option value="latest">Latest</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
      <option value="popularity">Most Popular</option>
    </select>
  );
}

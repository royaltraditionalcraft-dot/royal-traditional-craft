"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductFiltersPanel } from "./ProductFilters";

export function ProductMobileFilters({
  categories,
  currentParams,
}: {
  categories: any[];
  currentParams: any;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 border border-border rounded-full bg-white text-[10px] font-bold uppercase tracking-widest text-foreground shadow-pill active:scale-95 transition-all"
      >
        <SlidersHorizontal size={14} />
        Filters
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/10 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Content */}
          <aside className="relative w-80 max-w-full h-full bg-white shadow-premium overflow-y-auto transform transition-transform duration-300 border-l border-border">
            <div className="sticky top-0 bg-white border-b border-border p-5 flex items-center justify-between z-10">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Product Filters</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8">
              <ProductFiltersPanel 
                categories={categories} 
                currentParams={currentParams} 
              />
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 lg:hidden bg-white border-t border-border">
               <button 
                onClick={() => setIsOpen(false)}
                className="w-full py-4 bg-foreground text-background font-bold text-xs uppercase tracking-widest rounded-full shadow-premium active:scale-95 transition-all"
              >
                Show Results
              </button>
            </div>
            <div className="h-24" /> {/* Spacer */}
          </aside>
        </div>
      )}
    </div>
  );
}

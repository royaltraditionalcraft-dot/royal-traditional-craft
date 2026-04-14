"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, cn } from "@/lib/utils";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { toast } from "sonner";

export default function AdminProductsPage() {
  // ── MOCK DATA ────────────────────────────────────────────────────────────
  const categories = [
    { id: "cat_beds", name: "Beds" },
    { id: "cat_sofas", name: "Sofas" },
    { id: "cat_tables", name: "Tables" },
    { id: "cat_chairs", name: "Chairs" },
  ];

  const MOCK_PRODUCTS = [
    { id: "p1", name: "Lumina Smart Bed", slug: "lumina-smart-bed", price: 89999, comparePrice: 110000, stock: 2, category: { name: "Beds" }, categoryId: "cat_beds", images: ["https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800"], isActive: true },
    { id: "p2", name: "Core Dining Nexus", slug: "core-dining-nexus", price: 65000, comparePrice: 75000, stock: 0, category: { name: "Tables" }, categoryId: "cat_tables", images: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800"], isActive: true },
    { id: "p3", name: "Zenith Modular Sofa", slug: "zenith-modular-sofa", price: 45000, comparePrice: 55000, stock: 8, category: { name: "Sofas" }, categoryId: "cat_sofas", images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800"], isActive: true },
    { id: "p4", name: "Aero Focus Chair", slug: "aero-focus-chair", price: 18500, comparePrice: 22000, stock: 15, category: { name: "Chairs" }, categoryId: "cat_chairs", images: ["https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800"], isActive: false },
    { id: "p5", name: "Prism Glass Console", slug: "prism-glass-console", price: 32000, comparePrice: 40000, stock: 4, category: { name: "Tables" }, categoryId: "cat_tables", images: ["https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800"], isActive: true },
  ];

  const [products, setProducts] = useState(MOCK_PRODUCTS);

  useEffect(() => {
    const savedStr = localStorage.getItem("MOCK_PRODUCTS");
    if (savedStr) {
      setProducts(JSON.parse(savedStr));
    } else {
      localStorage.setItem("MOCK_PRODUCTS", JSON.stringify(MOCK_PRODUCTS));
    }
  }, []);

  const handleDelete = (productId: string, productName: string) => {
    if (confirm(`Authorize disposal of "${productName}" from registry?`)) {
      setProducts(prev => {
        const next = prev.filter(p => p.id !== productId);
        localStorage.setItem("MOCK_PRODUCTS", JSON.stringify(next));
        return next;
      });
      toast.success(`"${productName}" removed from registry.`);
    }
  };

  const total = products.length;
  const limit = 20;
  const page = 1;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black tracking-tighter text-brand-black uppercase">Inventory</h1>
            <div className="flex items-center gap-3">
                <span className="w-8 h-1 bg-brand-gold rounded-full" />
                <p className="text-brand-gray font-bold text-[10px] uppercase tracking-[0.3em]">{total} Active Units</p>
            </div>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-brand-gold hover:-translate-y-1 transition-all duration-300 shadow-xl"
        >
          <Plus size={16} strokeWidth={3} />
          Append Unit
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[2rem] border border-border shadow-sm p-3">
        <form method="get" className="flex gap-2 flex-wrap w-full">
          <input
            name="search"
            placeholder="Search registry…"
            className="flex-1 min-w-40 px-6 py-3 bg-off-white border border-transparent rounded-[1.25rem] text-sm font-bold focus:outline-none focus:border-brand-gold transition-all"
          />
          <select
            name="category"
            className="px-6 py-3 bg-off-white border border-transparent rounded-[1.25rem] text-sm font-bold focus:outline-none focus:border-brand-gold transition-all appearance-none cursor-pointer"
          >
            <option value="">Core Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-8 py-3 bg-brand-black text-white text-[10px] font-black uppercase tracking-widest rounded-[1.25rem] hover:bg-brand-gold transition-all"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-brand-gray/40 text-[10px] font-black uppercase tracking-[0.2em] border-b border-border">
                <th className="px-6 py-6 text-left w-12">
                   {/* Checkbox */}
                </th>
                <th className="px-6 py-6 text-left min-w-[240px]">Unit Description</th>
                <th className="hidden md:table-cell px-6 py-6 text-left">Classification</th>
                <th className="px-6 py-6 text-left">Valuation</th>
                <th className="hidden sm:table-cell px-6 py-6 text-left">Availability</th>
                <th className="hidden lg:table-cell px-6 py-6 text-left">Lifecycle</th>
                <th className="px-6 py-6 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 text-brand-gray/30">
                      <Package size={60} strokeWidth={1} />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Units Found</p>
                      <Link href="/admin/products/new" className="text-brand-gold font-black text-xs uppercase tracking-widest hover:underline">
                        Initiate Registry →
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-off-white/50 transition-colors group">
                    <td className="px-6 py-6 text-center">
                        <div className="w-4 h-4 border-2 border-border rounded flex items-center justify-center group-hover:border-brand-gold transition-colors" />
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-off-white flex-shrink-0 border border-border group-hover:scale-105 transition-transform duration-500">
                          {p.images[0] ? (
                            <Image
                              src={p.images[0]}
                              alt={p.name}
                              width={56}
                              height={56}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={20} className="text-brand-gray/30" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-brand-black tracking-tight text-base">{p.name}</p>
                          <p className="text-brand-gray/40 text-[10px] font-bold uppercase tracking-widest truncate max-w-[140px]">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-gray">{p.category.name}</span>
                    </td>
                    <td className="px-6 py-6 font-black text-brand-black">
                      <p className="text-base">{formatPrice(p.price)}</p>
                      {p.comparePrice && (
                        <p className="text-brand-gray/30 text-[10px] line-through font-medium leading-none">{formatPrice(p.comparePrice)}</p>
                      )}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-6">
                      <div className="flex flex-col gap-1">
                          <span className={cn(
                            "text-sm font-black tracking-tight",
                            p.stock === 0 ? "text-red-500" : p.stock <= 5 ? "text-amber-500" : "text-brand-black"
                          )}>
                            {p.stock === 0 ? "DEPLETED" : `${p.stock} Units`}
                          </span>
                          <div className="w-16 h-1 bg-off-white rounded-full overflow-hidden">
                              <div 
                                className={cn("h-full transition-all duration-1000", p.stock === 0 ? 'bg-red-500 w-full' : p.stock <= 5 ? 'bg-amber-500 w-1/3' : 'bg-brand-gold w-3/4')} 
                              />
                          </div>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-6">
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                        p.isActive ? "bg-green-50 text-green-600 border-green-100" : "bg-off-white text-brand-gray/60 border-border"
                      )}>
                        {p.isActive ? "Operational" : "Deferred"}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Link
                           href={`/admin/products/${p.id}/edit`}
                           className="w-10 h-10 rounded-xl bg-off-white text-brand-black flex items-center justify-center hover:bg-brand-black hover:text-white transition-all shadow-sm border border-border"
                           title="Configure"
                         >
                           <Pencil size={18} />
                         </Link>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDelete(p.id, p.name);
                            }}
                            className="w-10 h-10 rounded-xl bg-off-white text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm border border-border"
                            title="Dispose"
                          >
                            <Trash2 size={18} />
                          </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > limit && (
          <div className="flex items-center justify-between px-10 py-6 border-t border-border bg-off-white/30">
            <p className="text-brand-gray/50 text-[10px] font-black uppercase tracking-[0.2em]">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex gap-4">
              {page > 1 && (
                <Link
                  href={`/admin/products?page=${page - 1}`}
                  className="px-6 py-2 bg-white border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-black hover:text-white transition-all"
                >
                  ← Previous
                </Link>
              )}
              {page * limit < total && (
                <Link
                  href={`/admin/products?page=${page + 1}`}
                  className="px-6 py-2 bg-white border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-black hover:text-white transition-all"
                >
                  Next →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

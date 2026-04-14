"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Tag, MoreVertical, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([
    { id: "cat_1", name: "Beds", slug: "beds", description: "Smart ergonomic sleep ecosystems.", productsCount: 12, isActive: true },
    { id: "cat_2", name: "Sofas", slug: "sofas", description: "Modular comfort for redefined living.", productsCount: 8, isActive: true },
    { id: "cat_3", name: "Tables", slug: "tables", description: "Connectivity hubs and modern workstations.", productsCount: 5, isActive: true },
    { id: "cat_4", name: "Chairs", slug: "chairs", description: "Precision-engineered focus and support.", productsCount: 15, isActive: true },
    { id: "cat_5", name: "Wardrobes", slug: "wardrobes", description: "Intelligent storage and spatial management.", productsCount: 6, isActive: true },
    { id: "cat_6", name: "Storage", slug: "storage", description: "Minimalist spatial optimization units.", productsCount: 10, isActive: true },
  ]);

  const handleEdit = (category: any) => {
    const newName = prompt("Modify classification title:", category.name);
    if (newName && newName.trim() !== "") {
      setCategories(prev => prev.map(c => c.id === category.id ? { ...c, name: newName } : c));
      toast.success(`Classification "${newName}" updated.`);
    }
  };

  const handleDelete = (category: any) => {
    if (confirm(`Authorize removal of classification "${category.name}"?`)) {
      setCategories(prev => prev.filter(c => c.id !== category.id));
      toast.success(`Classification "${category.name}" removed.`);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black tracking-tighter text-brand-black uppercase">Classifications</h1>
            <div className="flex items-center gap-3">
                <span className="w-8 h-1 bg-brand-gold rounded-full" />
                <p className="text-brand-gray font-bold text-[10px] uppercase tracking-[0.3em]">Registry Divisions</p>
            </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            const newName = prompt("Enter classification title:");
            if (newName && newName.trim() !== "") {
               setCategories([{ id: `cat_${Date.now()}`, name: newName, slug: newName.toLowerCase().replace(/\s+/g, '-'), description: "New system division", productsCount: 0, isActive: true }, ...categories]);
               toast.success(`Classification "${newName}" initialized.`);
            }
          }}
          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-brand-gold hover:-translate-y-1 transition-all duration-300 shadow-xl"
        >
          <Plus size={18} strokeWidth={3} />
          Append Division
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-[2rem] border border-border shadow-sm p-3">
        <div className="relative w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-gray/30" size={18} />
          <input
            type="text"
            placeholder="Search registry divisions..."
            className="w-full pl-14 pr-6 py-3 bg-off-white border border-transparent rounded-[1.25rem] text-sm font-bold focus:outline-none focus:border-brand-gold transition-all"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-brand-gray/40 text-[10px] font-black uppercase tracking-[0.2em] border-b border-border">
                <th className="px-6 py-6 text-left">Division Title</th>
                <th className="hidden md:table-cell px-6 py-6 text-left">Internal Context</th>
                <th className="px-6 py-6 text-left">Unit Count</th>
                <th className="hidden sm:table-cell px-6 py-6 text-left">Lifecycle</th>
                <th className="px-6 py-6 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-off-white/50 transition-colors group">
                  <td className="px-6 py-6 min-w-[200px]">
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-off-white text-brand-black items-center justify-center border border-border group-hover:scale-105 transition-transform duration-500">
                        <Tag size={20} className="group-hover:text-brand-gold transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-brand-black tracking-tight text-base group-hover:text-brand-gold transition-colors">{cat.name}</p>
                        <p className="text-brand-gray/40 text-[10px] font-bold uppercase tracking-widest truncate">/{cat.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 py-6">
                    <p className="text-brand-gray text-xs font-medium italic opacity-60 leading-relaxed">{cat.description}</p>
                  </td>
                  <td className="px-6 py-6 font-black text-brand-black">
                    <span className="sm:inline hidden">{cat.productsCount} Units</span>
                    <span className="inline sm:hidden">{cat.productsCount}</span>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-6">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                      cat.isActive ? "bg-green-50 text-green-600 border-green-100" : "bg-off-white text-brand-gray/60 border-border"
                    )}>
                      {cat.isActive ? "Operational" : "Deferred"}
                    </span>
                  </td>
                   <td className="px-6 py-6 text-right">
                     <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEdit(cat);
                          }}
                          className="w-10 h-10 rounded-xl bg-off-white text-brand-black flex items-center justify-center hover:bg-brand-black hover:text-white transition-all shadow-sm border border-border"
                          title="Configure"
                        >
                         <Edit size={18} />
                       </button>
                       <button
                         onClick={(e) => {
                           e.preventDefault();
                           e.stopPropagation();
                           handleDelete(cat);
                         }}
                         className="w-10 h-10 rounded-xl bg-off-white text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm border border-border"
                         title="Dispose"
                       >
                         <Trash2 size={18} />
                       </button>
                     </div>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


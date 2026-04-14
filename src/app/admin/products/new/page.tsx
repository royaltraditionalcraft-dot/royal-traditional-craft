"use client";

import { ProductForm } from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
  const categories = [
    { id: "cat_beds", name: "Beds" },
    { id: "cat_sofas", name: "Sofas" },
    { id: "cat_tables", name: "Tables" },
    { id: "cat_chairs", name: "Chairs" },
    { id: "cat_wardrobes", name: "Wardrobes" },
    { id: "cat_storage", name: "Storage" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 rounded-full hover:bg-white transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="font-heading text-gray-900 text-3xl font-bold">Add New Product</h1>
          <p className="text-gray-500 text-sm mt-1">Create a new item for your store.</p>
        </div>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}

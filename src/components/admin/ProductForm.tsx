"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ProductFormProps {
  initialData?: any;
  categories: { id: string; name: string }[];
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: formData.get("price"),
      comparePrice: formData.get("comparePrice") || null,
      stock: formData.get("stock"),
      categoryId: formData.get("categoryId"),
      isActive: formData.get("isActive") === "on",
      isFeatured: formData.get("isFeatured") === "on",
      weight: formData.get("weight") || null,
      dimensions: formData.get("dimensions") || null,
      images,
    };

    try {
      const savedStr = localStorage.getItem("MOCK_PRODUCTS");
      if (savedStr) {
         let allProducts = JSON.parse(savedStr);
         if (initialData) {
            allProducts = allProducts.map((p: any) => p.id === initialData.id ? { ...p, ...data, price: Number(data.price), comparePrice: Number(data.comparePrice), stock: Number(data.stock) } : p);
         } else {
            allProducts.push({ id: `p${Date.now()}`, slug: data.name?.toString().toLowerCase().replace(/\s+/g, '-') || "new-product", category: { name: categories.find(c => c.id === data.categoryId)?.name || "Unknown" }, ...data, price: Number(data.price), comparePrice: Number(data.comparePrice), stock: Number(data.stock) });
         }
         localStorage.setItem("MOCK_PRODUCTS", JSON.stringify(allProducts));
      }

      // MOCK: Simulate API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 800));

      toast.success(initialData ? "Product updated (mock)!" : "Product created (mock)!");
      router.push("/admin/products");
    } catch (err: any) {
      toast.error("Mock update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setUploading(true);
    try {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // Mock upload: directly use base64 string to bypass API errors
        setImages((prev) => [...prev, base64]);
        setUploading(false);
      };
    } catch {
      toast.error("Failed to process image");
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-heading text-lg font-bold text-gray-900 border-b pb-4">Basic Details</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input 
              name="name" 
              required 
              defaultValue={initialData?.name}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground" 
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              name="description" 
              required 
              rows={4}
              defaultValue={initialData?.description}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
            <input 
              name="price" 
              type="number" 
              step="0.01"
              required 
              defaultValue={initialData?.price}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Compare at Price (₹)</label>
            <input 
              name="comparePrice" 
              type="number" 
              step="0.01"
              defaultValue={initialData?.comparePrice}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground" 
            />
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-heading text-lg font-bold text-gray-900 border-b pb-4">Images</h2>
        
        <div className="flex gap-4 flex-wrap">
          {images.map((img, i) => (
            <div key={i} className="relative w-24 h-24 rounded-xl border border-gray-200 overflow-hidden group">
              <Image src={img} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          
          <label className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-foreground transition-colors">
            {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={24} />}
            <span className="text-xs mt-1">Upload</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {/* Inventory & Organization */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-heading text-lg font-bold text-gray-900 border-b pb-4">Inventory & Org</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
            <input 
              name="stock" 
              type="number" 
              required 
              defaultValue={initialData?.stock ?? 10}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              name="categoryId" 
              required 
              defaultValue={initialData?.categoryId}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <div className="col-span-2 flex gap-6 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isActive" defaultChecked={initialData?.isActive ?? true} className="w-4 h-4 accent-foreground" />
              <span className="text-sm font-medium text-gray-900">Active (Visible on store)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isFeatured" defaultChecked={initialData?.isFeatured ?? false} className="w-4 h-4 accent-foreground" />
              <span className="text-sm font-medium text-gray-900">Featured Product</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 sticky bottom-6 bg-white/80 backdrop-blur pb-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-full transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || uploading}
          className="px-8 py-2.5 bg-foreground text-background font-bold rounded-full hover:bg-foreground/90 transition-colors flex items-center gap-2 disabled:opacity-70 border border-transparent"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : null}
          {initialData ? "Update Product" : "Save Product"}
        </button>
      </div>
    </form>
  );
}

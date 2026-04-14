"use client";

import { useRouter, useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const dynamic = 'force-dynamic';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // ── MOCK DATA ────────────────────────────────────────────────────────────
  const MOCK_PRODUCTS = [
    {
      id: "p1",
      name: "Maharaja King Bed",
      slug: "maharaja-king-bed",
      description: "Our flagship king-size bed, handcrafted from premium Sheesham wood with intricate carvings. Includes a velvet-tufted headboard.",
      price: 89999,
      comparePrice: 110000,
      stock: 2,
      images: ["https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800"],
      categoryId: "cat_beds",
      isActive: true,
      isFeatured: true,
      weight: 150,
      dimensions: "78\" x 84\" x 48\"",
      tags: ["bed", "king", "wooden", "luxury"]
    },
    {
      id: "p2",
      name: "Royal Sheesham Dining Set",
      slug: "royal-dining-set",
      description: "A grand 6-seater dining table made of solid Sheesham. Perfect for royal family gatherings.",
      price: 65000,
      comparePrice: 75000,
      stock: 0,
      images: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800"],
      categoryId: "cat_tables",
      isActive: true,
      isFeatured: false,
      weight: 200,
      dimensions: "72\" x 42\" x 30\"",
      tags: ["dining", "table", "sheesham", "wooden"]
    },
    {
      id: "p3",
      name: "Velvet Chesterfield Sofa",
      slug: "chesterfield-sofa",
      description: "Classic Chesterfield design with deep buttoning and rich velvet upholstery.",
      price: 45000,
      comparePrice: 55000,
      stock: 8,
      images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800"],
      categoryId: "cat_sofas",
      isActive: true,
      isFeatured: true,
      weight: 80,
      dimensions: "84\" x 36\" x 32\"",
      tags: ["sofa", "chesterfield", "velvet", "luxury"]
    },
    {
      id: "p4",
      name: "Teak Armchair",
      slug: "teak-armchair",
      description: "Elegant teak wood armchair with traditional carvings and comfortable seating.",
      price: 18500,
      comparePrice: 22000,
      stock: 15,
      images: ["https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800"],
      categoryId: "cat_chairs",
      isActive: false,
      isFeatured: false,
      weight: 35,
      dimensions: "28\" x 32\" x 36\"",
      tags: ["chair", "armchair", "teak", "carved"]
    },
    {
      id: "p5",
      name: "Gilded Center Table",
      slug: "gilded-center-table",
      description: "Beautiful center table with gilded accents and solid wood construction.",
      price: 32000,
      comparePrice: 40000,
      stock: 4,
      images: ["https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800"],
      categoryId: "cat_tables",
      isActive: true,
      isFeatured: false,
      weight: 60,
      dimensions: "48\" x 24\" x 18\"",
      tags: ["table", "center", "gilded", "wooden"]
    },
  ];

  const MOCK_CATEGORIES = [
    { id: "cat_beds", name: "Beds" },
    { id: "cat_sofas", name: "Sofas" },
    { id: "cat_tables", name: "Tables" },
    { id: "cat_chairs", name: "Chairs" },
    { id: "cat_wardrobes", name: "Wardrobes" },
    { id: "cat_storage", name: "Storage" },
  ];

  useEffect(() => {
    console.log("EditProductPage useEffect", { params, paramsId: params?.id, pathname });
    // Simulate loading
    const timer = setTimeout(() => {
      let productId: string | null = Array.isArray(params?.id) ? params.id[0] : params?.id as string;
      console.log("Looking for product with ID:", productId, "Type:", typeof productId);

      // If params.id is not available, try to extract from pathname
      if (!productId && pathname) {
        const match = pathname.match(/\/admin\/products\/([^\/]+)\/edit/);
        productId = match ? match[1] : null;
        console.log("Extracted ID from pathname:", productId);
      }

      if (!productId) {
        console.error("No product ID found");
        toast.error("Invalid product ID");
        router.push("/admin/products");
        return;
      }

      const savedStr = localStorage.getItem("MOCK_PRODUCTS");
      const allProducts = savedStr ? JSON.parse(savedStr) : MOCK_PRODUCTS;

      const foundProduct = allProducts.find((p: any) => p.id === productId);
      console.log("Found product:", foundProduct);

      if (!foundProduct) {
        console.error("Product not found for ID:", productId);
        toast.error(`Product not found for ID: ${productId}`);
        router.push("/admin/products");
        return;
      }
      setProduct(foundProduct);
      setCategories(MOCK_CATEGORIES);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [params?.id, pathname, router]);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 rounded-full hover:bg-white transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="font-heading text-gray-900 text-3xl font-bold">Edit Product</h1>
            <p className="text-gray-500 text-sm mt-1">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 rounded-full hover:bg-white transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="font-heading text-gray-900 text-3xl font-bold">Product Not Found</h1>
            <p className="text-gray-500 text-sm mt-1">The product you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 rounded-full hover:bg-white transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="font-heading text-gray-900 text-3xl font-bold">Edit Product</h1>
          <p className="text-gray-500 text-sm mt-1">{product.name}</p>
        </div>
      </div>

      <ProductForm initialData={product} categories={categories} />
    </div>
  );
}

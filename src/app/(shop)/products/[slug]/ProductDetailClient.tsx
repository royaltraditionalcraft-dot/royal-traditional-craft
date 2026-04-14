"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Star, Minus, Plus, ShoppingBag, Zap, ChevronRight, Package, RotateCcw, Shield, ArrowRight, ArrowLeft } from "lucide-react";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { ProductCard } from "@/components/shop/ProductCard";
import { formatPrice, getDiscount } from "@/lib/utils";
import type { ProductWithCategory } from "@/types";
import { cn } from "@/lib/utils";
import { getRecommendations } from "@/lib/recommendations";
import { MiniProductCard } from "@/components/shop/MiniProductCard";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user: {
    name: string;
    email: string;
  };
}

interface ProductDetailClientProps {
  product: ProductWithCategory & { reviews: Review[] };
  related: ProductWithCategory[];
  avgRating: number;
}

export function ProductDetailClient({
  product: initialProduct,
  related,
  avgRating,
}: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "details" | "reviews">("description");

  const [product, setProduct] = useState(initialProduct);

  useEffect(() => {
    const savedStr = localStorage.getItem("MOCK_PRODUCTS");
    if (savedStr) {
      const allProducts = JSON.parse(savedStr);
      const updated = allProducts.find((p: any) => p.slug === initialProduct.slug || p.id === initialProduct.id);
      if (updated) {
        setProduct((prev) => ({ ...prev, ...updated, category: { name: updated.category?.name || "Unknown", slug: updated.category?.slug || "" } }));
      } else {
        // If deleted by admin mock
        window.location.href = "/products";
      }
    }
  }, [initialProduct.slug, initialProduct.id]);

  const discount = getDiscount(product.price, product.comparePrice ?? 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-[#fafafa] border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="text-foreground truncate max-w-[150px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* ── Image Gallery ── */}
          <div className="space-y-6">
            <div className="aspect-[4/5] bg-[#f9f9f9] rounded-[2.5rem] overflow-hidden group relative">
              {product.images[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag size={48} className="text-muted-foreground/20" />
                </div>
              )}
              {discount > 0 && (
                <div className="absolute top-8 left-8 bg-primary text-white text-[10px] font-bold px-4 py-1.5 rounded-full tracking-widest uppercase">
                  {discount}% Off
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "flex-shrink-0 w-20 h-24 rounded-2xl overflow-hidden border-2 transition-all",
                      i === selectedImage
                        ? "border-primary"
                        : "border-transparent hover:border-gray-200"
                    )}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${i + 1}`}
                      width={80}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="lg:pt-4">
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                   <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                    {product.category?.name || "Uncategorized"}
                  </span>
                  {product.isFeatured && (
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  )}
                  {product.isFeatured && (
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
                      Signature Collection
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tighter leading-[0.95] mb-6">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={12}
                        className={cn(
                          s <= Math.round(avgRating || 0) ? "fill-primary text-primary" : "text-gray-200 fill-gray-200"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {(avgRating || 0).toFixed(1)} / 5.0 — {product.reviews?.length || 0} Reviews
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-6">
                <span className="text-4xl font-heading font-bold tracking-tight">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-xl text-muted-foreground line-through font-light">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed font-light max-w-lg">
                {product.description.split("\n")[0]}
              </p>

              <div className="h-px bg-border group-hover:bg-primary transition-colors" />

              <div className="space-y-8">
                {product.stock > 0 && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Quantity</p>
                      <div className="flex items-center border border-border rounded-full p-1 w-32 justify-between bg-muted/30">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-sm">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Availability</p>
                       <p className={cn(
                         "text-sm font-bold",
                         product.stock < 5 ? "text-red-500" : "text-green-600"
                       )}>
                         {product.stock === 0 ? "Out of Stock" : product.stock < 5 ? `Only ${product.stock} left` : "In Stock"}
                       </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <AddToCartButton
                    product={product}
                    quantity={quantity}
                    variant="detail"
                  />
                  <Link
                    href="/checkout"
                    className="flex-1 h-16 flex items-center justify-center gap-3 font-bold rounded-full transition-all border border-foreground hover:bg-foreground hover:text-white uppercase tracking-widest text-xs"
                  >
                    <Zap size={16} />
                    Express Checkout
                  </Link>
                </div>
              </div>

              {/* Service Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
                {[
                  { icon: Shield, title: "Authentic", desc: "Certified Royal Crafts" },
                  { icon: RotateCcw, title: "7-Day Return", desc: "No questions asked" },
                  { icon: Package, title: "Shipping", desc: "Secured & Insured" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <Icon size={20} className="text-primary flex-shrink-0" />
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest leading-none mb-1">{title}</h4>
                      <p className="text-[10px] text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Detailed Info Tabs ── */}
        <div className="mt-32">
          <div className="flex gap-12 border-b border-border mb-12 overflow-x-auto pb-px custom-scrollbar">
            {(["description", "details", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-6 text-xs font-bold uppercase tracking-[0.3em] transition-all relative",
                  activeTab === tab
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>

          <div className="max-w-4xl">
            {activeTab === "description" && (
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed text-lg font-light">
                {product.description.split("\n").map((para, i) => (
                  <p key={i} className="mb-6">{para}</p>
                ))}
              </div>
            )}

            {activeTab === "details" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {[
                  { label: "Category", value: product.category?.name || "Uncategorized" },
                  { label: "SKU Reference", value: product.id.slice(-8).toUpperCase() },
                  { label: "Material", value: "Handpicked Premium Wood" },
                  product.weight ? { label: "Weight", value: `${product.weight}g` } : null,
                  product.dimensions ? { label: "Dimensions", value: product.dimensions } : null,
                  { label: "Shipping", value: "Eco-Friendly Packing" },
                ].filter(Boolean).map((item) => (
                  <div key={item!.label} className="flex justify-between py-4 border-b border-border">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item!.label}</span>
                    <span className="text-sm font-bold">{item!.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-12">
                <div className="flex items-center gap-10">
                  <h3 className="text-6xl font-heading font-bold text-primary">{(avgRating || 0).toFixed(1)}</h3>
                  <div>
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={16} className={cn(s <= Math.round(avgRating || 0) ? "fill-primary text-primary" : "text-gray-200 fill-gray-200")} />
                      ))}
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Based on {product.reviews?.length || 0} reviews</p>
                  </div>
                </div>

                {(!product.reviews || product.reviews.length === 0) ? (
                  <div className="py-20 text-center border border-dashed border-border rounded-3xl">
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">No reviews currently available</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {product.reviews.map((review: Review) => (
                      <div key={review.id} className="py-10 first:pt-0">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                              {review.user.name?.[0]?.toUpperCase() ?? "?"}
                            </div>
                            <div>
                              <p className="font-bold text-sm">{review.user.name}</p>
                              <div className="flex gap-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star key={s} size={10} className={cn(s <= review.rating ? "fill-primary text-primary" : "text-gray-200 fill-gray-200")} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed font-light pl-14">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <div className="mt-40">
            <div className="flex items-baseline justify-between mb-12">
              <h2 className="text-3xl font-heading font-bold tracking-tight">Complete the Look</h2>
              <Link href="/products" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                Discover More <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* ── Smart Recommendations ── */}
        <div className="mt-40 pt-20 border-t border-border">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold tracking-tight mb-4">Recommended for You</h2>
            <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px]">Based on your current selection</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {getRecommendations(product.id, 3).map((p) => (
              <MiniProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

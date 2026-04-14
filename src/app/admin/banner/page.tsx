"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, RotateCcw, Image as ImageIcon, Sparkles, Layout } from "lucide-react";
import { useBannerStore } from "@/store/bannerStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminBannerPage() {
  const { heroBanner, updateHeroBanner, resetHeroBanner } = useBannerStore();
  const [formData, setFormData] = useState(heroBanner);
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFormData(heroBanner);
  }, [heroBanner]);

  if (!mounted) return null;

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API delay for better UX
    setTimeout(() => {
      updateHeroBanner(formData);
      setIsSaving(false);
    }, 500);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset to default values?")) {
      resetHeroBanner();
      setFormData(heroBanner);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 bg-background text-foreground animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border pb-8">
        <div className="flex items-center gap-6">
          <Link
            href="/admin"
            className="w-12 h-12 flex items-center justify-center bg-muted text-foreground rounded-2xl hover:bg-foreground hover:text-background transition-all duration-300 shadow-sm border border-border"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-bold tracking-tight">Hero Section</h1>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest flex items-center gap-2">
              <Layout size={14} /> Home Page Banner Management
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className="rounded-xl px-6 h-12 border-border hover:bg-red-50 hover:text-red-600 transition-all font-bold uppercase tracking-widest text-[10px]"
          >
            <RotateCcw size={14} className="mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl px-8 h-12 bg-foreground text-background hover:bg-foreground/90 transition-all font-bold uppercase tracking-widest text-[10px] shadow-premium"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save size={14} />
                Save Changes
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Form Column */}
        <div className="space-y-8 bg-white p-10 rounded-[32px] border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles size={16} />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Configuration</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Main Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl bg-muted/30 border border-border text-foreground font-bold focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all"
                placeholder="e.g. Winter Collection"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Sub-heading</label>
              <textarea
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl bg-muted/30 border border-border text-foreground font-medium focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all min-h-[100px]"
                placeholder="e.g. Limited edition pieces..."
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Button text</label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-muted/30 border border-border text-foreground font-bold focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Action Link</label>
                <input
                  type="text"
                  disabled
                  value="/products"
                  className="w-full px-5 py-4 rounded-2xl bg-muted/50 border border-border text-muted-foreground font-medium italic cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Image URL (Direct Source)</label>
              <div className="relative group">
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full pl-12 pr-5 py-4 rounded-2xl bg-muted/30 border border-border text-foreground font-medium text-sm focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all"
                  placeholder="https://..."
                />
                <ImageIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" />
              </div>
              <p className="text-[10px] text-muted-foreground italic mt-2 ml-1">Tip: Use Unsplash or Cloudinary links for high performance.</p>
            </div>
          </div>
        </div>

        {/* Preview Column */}
        <div className="lg:sticky lg:top-8 space-y-8">
           <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ImageIcon size={16} />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Live Preview</h2>
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-100">Synchronized</span>
          </div>

          <div className="relative overflow-hidden group bg-[#fafafa] rounded-[40px] border border-border shadow-2xl transition-all duration-500 hover:shadow-3xl">
            {/* Mock Nav Overlay */}
            <div className="absolute top-0 w-full h-20 bg-gradient-to-b from-black/5 to-transparent z-20 pointer-events-none" />
            
            <div className="p-12 min-h-[500px] flex flex-col md:flex-row items-center gap-8 relative">
              <div className="relative z-10 w-full md:w-1/2 space-y-6">
                <div className="bg-white rounded-full px-4 py-1.5 inline-flex shadow-sm border border-border">
                  <span className="text-[9px] font-bold text-foreground tracking-[0.2em] uppercase">Special Offer</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tighter leading-none text-foreground">
                  {formData.title || "Banner Title"}
                </h3>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed max-w-xs">
                  {formData.subtitle || "A short description will appear here to highlight your collection."}
                </p>
                <div className="w-fit px-8 py-3.5 bg-foreground text-background text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-premium">
                  {formData.buttonText || "Shop Now"}
                </div>
              </div>

              <div className="w-full md:w-1/2 flex justify-center transform group-hover:scale-105 transition-transform duration-1000">
                <div className="relative w-64 h-64 md:w-80 md:h-80 drop-shadow-3xl">
                  {formData.imageUrl ? (
                    <Image
                      src={formData.imageUrl}
                      alt="Preview"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center rounded-full border border-dashed border-border">
                      <ImageIcon size={48} className="text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reflection Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
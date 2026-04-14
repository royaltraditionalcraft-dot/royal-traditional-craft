"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft, Plus, Trash2, Loader2, ToggleLeft, ToggleRight,
  Ticket, X, CheckCircle2, AlertCircle, Search,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
type CouponType = "percentage" | "flat" | "free_shipping";

interface DBCoupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  description: string;
  minOrder: number;
  maxDiscount: number;
  isActive: boolean;
  expiresAt: string | null;
  usageLimit: number | null;
  usedCount: number;
  createdAt: string;
}

interface FormState {
  code: string;
  type: CouponType;
  value: string;
  description: string;
  minOrder: string;
  maxDiscount: string;
  isActive: boolean;
  expiresAt: string;
  usageLimit: string;
}

const EMPTY_FORM: FormState = {
  code: "",
  type: "percentage",
  value: "",
  description: "",
  minOrder: "0",
  maxDiscount: "0",
  isActive: true,
  expiresAt: "",
  usageLimit: "",
};

// ── Badge helpers ─────────────────────────────────────────────────────────────
const TYPE_BADGE: Record<CouponType, { label: string; cls: string }> = {
  percentage:   { label: "% Off",       cls: "bg-blue-50 text-blue-700 border-blue-200" },
  flat:         { label: "₹ Flat Off",  cls: "bg-purple-50 text-purple-700 border-purple-200" },
  free_shipping:{ label: "Free Ship",   cls: "bg-green-50 text-green-700 border-green-200" },
};

function formatValue(c: DBCoupon) {
  if (c.type === "percentage")    return `${c.value}%`;
  if (c.type === "flat")         return `₹${c.value.toLocaleString("en-IN")}`;
  return "Free";
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<DBCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      setCoupons(data.coupons ?? []);
    } catch {
      toast.error("Failed to load coupons.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  // ── Create ─────────────────────────────────────────────────────────────────
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim() || !form.description.trim() || !form.value) {
      toast.error("Code, description and value are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          code: form.code.trim().toUpperCase(),
          value: parseFloat(form.value),
          minOrder: parseFloat(form.minOrder || "0"),
          maxDiscount: parseFloat(form.maxDiscount || "0"),
          usageLimit: form.usageLimit ? parseInt(form.usageLimit) : null,
          expiresAt: form.expiresAt || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create coupon.");
      toast.success(`Coupon "${data.coupon.code}" created!`);
      setForm(EMPTY_FORM);
      setShowCreate(false);
      fetchCoupons();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle active ──────────────────────────────────────────────────────────
  const handleToggle = async (coupon: DBCoupon) => {
    setTogglingId(coupon.id);
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });
      if (!res.ok) throw new Error("Failed to update coupon.");
      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? { ...c, isActive: !c.isActive } : c))
      );
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setTogglingId(null);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete coupon.");
      toast.success("Coupon deleted.");
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 bg-background text-foreground animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-5">
          <Link
            href="/admin"
            className="w-11 h-11 flex items-center justify-center bg-muted text-foreground rounded-xl hover:bg-foreground hover:text-background transition-all border border-border"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Discount Coupons</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {coupons.length} coupon{coupons.length !== 1 ? "s" : ""} total ·{" "}
              {coupons.filter((c) => c.isActive).length} active
            </p>
          </div>
        </div>
        <button
          onClick={() => { setShowCreate(true); setForm(EMPTY_FORM); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-sm font-bold rounded-xl hover:bg-foreground/90 active:scale-95 transition-all shadow-sm"
        >
          <Plus size={16} />
          New Coupon
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search coupons…"
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-xl bg-white focus:outline-none focus:border-foreground/30 transition-colors"
        />
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center">
                  <Ticket size={16} className="text-background" />
                </div>
                <h2 className="text-lg font-bold tracking-tight">Create Coupon</h2>
              </div>
              <button onClick={() => setShowCreate(false)} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                <X size={18} />
              </button>
            </div>

            {/* Modal form */}
            <form onSubmit={handleCreate} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-4">
                {/* Code */}
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Coupon Code *</label>
                  <input
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. ROYAL10"
                    required
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-foreground/40 bg-muted/20 transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description *</label>
                  <input
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="e.g. 10% off your entire order"
                    required
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-foreground/40 bg-muted/20 transition-colors"
                  />
                </div>

                {/* Type */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Type *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as CouponType })}
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-sm bg-muted/20 focus:outline-none focus:border-foreground/40 transition-colors"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat Amount</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>

                {/* Value */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Value {form.type === "percentage" ? "(%)" : form.type === "flat" ? "(₹)" : "(ignored)"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    placeholder={form.type === "free_shipping" ? "0" : form.type === "percentage" ? "10" : "500"}
                    disabled={form.type === "free_shipping"}
                    required={form.type !== "free_shipping"}
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-sm bg-muted/20 focus:outline-none focus:border-foreground/40 disabled:opacity-40 transition-colors"
                  />
                </div>

                {/* Min order */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Min Order (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.minOrder}
                    onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-sm bg-muted/20 focus:outline-none focus:border-foreground/40 transition-colors"
                  />
                </div>

                {/* Max discount */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Max Discount (₹, 0=none)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.maxDiscount}
                    onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                    disabled={form.type === "flat" || form.type === "free_shipping"}
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-sm bg-muted/20 focus:outline-none focus:border-foreground/40 disabled:opacity-40 transition-colors"
                  />
                </div>

                {/* Expires At */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Expires At (optional)</label>
                  <input
                    type="date"
                    value={form.expiresAt}
                    onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-sm bg-muted/20 focus:outline-none focus:border-foreground/40 transition-colors"
                  />
                </div>

                {/* Usage limit */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Usage Limit (optional)</label>
                  <input
                    type="number"
                    min="1"
                    value={form.usageLimit}
                    onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                    placeholder="Unlimited"
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-sm bg-muted/20 focus:outline-none focus:border-foreground/40 transition-colors"
                  />
                </div>

                {/* Active toggle */}
                <div className="col-span-2 flex items-center justify-between py-3 px-4 bg-muted/30 rounded-xl border border-border">
                  <span className="text-sm font-semibold">Active immediately</span>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, isActive: !form.isActive })}
                    className="transition-colors"
                  >
                    {form.isActive
                      ? <ToggleRight size={32} className="text-green-600" />
                      : <ToggleLeft size={32} className="text-muted-foreground" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-3 rounded-xl border border-border text-sm font-bold hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-foreground text-background rounded-xl text-sm font-bold hover:bg-foreground/90 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  {saving ? "Creating…" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={28} className="animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
            <Ticket size={28} className="text-muted-foreground" />
          </div>
          <p className="font-bold text-lg">
            {search ? "No coupons match your search" : "No coupons yet"}
          </p>
          <p className="text-sm text-muted-foreground">
            {search ? "Try a different search term." : "Click \"New Coupon\" to create your first discount code."}
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-2xl overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 border-b border-border">
                <tr className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-6 py-4 text-left">Code</th>
                  <th className="px-6 py-4 text-left">Type</th>
                  <th className="px-6 py-4 text-left">Value</th>
                  <th className="px-6 py-4 text-left">Min Order</th>
                  <th className="px-6 py-4 text-left">Usage</th>
                  <th className="px-6 py-4 text-left">Expires</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((coupon) => {
                  const badge = TYPE_BADGE[coupon.type];
                  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                  const atLimit = coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit;
                  return (
                    <tr
                      key={coupon.id}
                      className={cn(
                        "hover:bg-muted/30 transition-colors",
                        !coupon.isActive && "opacity-60"
                      )}
                    >
                      {/* Code + description */}
                      <td className="px-6 py-4">
                        <p className="font-black text-xs tracking-widest uppercase text-foreground">{coupon.code}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 max-w-[220px] truncate">{coupon.description}</p>
                      </td>

                      {/* Type badge */}
                      <td className="px-6 py-4">
                        <span className={cn("px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border rounded-full", badge.cls)}>
                          {badge.label}
                        </span>
                      </td>

                      {/* Value */}
                      <td className="px-6 py-4 font-bold">
                        {formatValue(coupon)}
                        {coupon.type === "percentage" && coupon.maxDiscount > 0 && (
                          <span className="block text-[10px] text-muted-foreground font-normal">max ₹{coupon.maxDiscount.toLocaleString("en-IN")}</span>
                        )}
                      </td>

                      {/* Min order */}
                      <td className="px-6 py-4 text-muted-foreground">
                        {coupon.minOrder > 0 ? `₹${coupon.minOrder.toLocaleString("en-IN")}` : "None"}
                      </td>

                      {/* Usage */}
                      <td className="px-6 py-4">
                        <span className={cn("text-sm font-semibold", atLimit && "text-red-600")}>
                          {coupon.usedCount}
                          {coupon.usageLimit !== null && ` / ${coupon.usageLimit}`}
                        </span>
                        {atLimit && (
                          <span className="block text-[10px] text-red-500 font-bold uppercase tracking-wide">Limit reached</span>
                        )}
                      </td>

                      {/* Expires */}
                      <td className="px-6 py-4">
                        {coupon.expiresAt ? (
                          <span className={cn("text-xs font-medium", isExpired && "text-red-600 font-bold")}>
                            {new Date(coupon.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            {isExpired && " · Expired"}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Never</span>
                        )}
                      </td>

                      {/* Active toggle */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          {togglingId === coupon.id ? (
                            <Loader2 size={20} className="animate-spin text-muted-foreground" />
                          ) : (
                            <button
                              onClick={() => handleToggle(coupon)}
                              title={coupon.isActive ? "Click to deactivate" : "Click to activate"}
                              className="transition-transform hover:scale-110 active:scale-95"
                            >
                              {coupon.isActive ? (
                                <CheckCircle2 size={22} className="text-green-600" />
                              ) : (
                                <AlertCircle size={22} className="text-muted-foreground" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Delete */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          {deletingId === coupon.id ? (
                            <Loader2 size={16} className="animate-spin text-muted-foreground" />
                          ) : (
                            <button
                              onClick={() => handleDelete(coupon.id, coupon.code)}
                              className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete coupon"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

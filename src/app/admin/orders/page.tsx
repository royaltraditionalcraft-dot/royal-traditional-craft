"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { formatPrice, formatDate, ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS, cn } from "@/lib/utils";
import Link from "next/link";
import { Search, ShoppingCart, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const page = 1;
  const limit = 20;

  // ── MOCK DATA ────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState([
    { id: "ord_1", createdAt: new Date("2024-10-01"), totalAmount: 89999, status: "PROCESSING", paymentStatus: "PAID", user: { name: "Aditya Verma", email: "aditya@wisdomcore.com" }, _count: { items: 2 } },
    { id: "ord_2", createdAt: new Date("2024-10-05"), totalAmount: 45000, status: "PENDING", paymentStatus: "PENDING", user: { name: "Meera Nair", email: "meera@wisdomcore.com" }, _count: { items: 1 } },
    { id: "ord_3", createdAt: new Date("2024-10-10"), totalAmount: 18500, status: "SHIPPED", paymentStatus: "PAID", user: { name: "Rahul Singh", email: "rahul@wisdomcore.com" }, _count: { items: 1 } },
    { id: "ord_4", createdAt: new Date("2024-10-15"), totalAmount: 65000, status: "DELIVERED", paymentStatus: "PAID", user: { name: "Ananya Iyer", email: "ananya@wisdomcore.com" }, _count: { items: 3 } },
    { id: "ord_5", createdAt: new Date("2024-10-20"), totalAmount: 22000, status: "CANCELLED", paymentStatus: "REFUNDED", user: { name: "Suresh Babu", email: "suresh@wisdomcore.com" }, _count: { items: 1 } },
  ]);

  const filteredOrders = orders.filter(o => {
      let matchesSearch = true;
      let matchesStatus = true;
      if (search) {
          matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || 
                          o.user.name.toLowerCase().includes(search.toLowerCase()) || 
                          o.user.email.toLowerCase().includes(search.toLowerCase());
      }
      if (status) {
          matchesStatus = o.status === status;
      }
      return matchesSearch && matchesStatus;
  });

  const total = filteredOrders.length;

  const handleEdit = (order: any) => {
    const newStatus = prompt("Update Lifecycle Stage (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED):", order.status);
    if (newStatus && ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].includes(newStatus.toUpperCase())) {
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus.toUpperCase() } : o));
      toast.success(`Log "${order.id}" state updated.`);
    } else if (newStatus) {
        toast.error("Invalid state provided");
    }
  };

  const handleDelete = (order: any) => {
    if (confirm(`Authorize permanent deletion of Log "${order.id}"?`)) {
      setOrders(prev => prev.filter(o => o.id !== order.id));
      toast.success(`Log "${order.id}" purged.`);
    }
  };

  const STATUS_THEME: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-600 border-amber-100",
    PROCESSING: "bg-blue-50 text-blue-600 border-blue-100",
    SHIPPED: "bg-brand-black text-white border-brand-black",
    DELIVERED: "bg-green-50 text-green-600 border-green-100",
    CANCELLED: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter text-brand-black uppercase">System Logs</h1>
        <div className="flex items-center gap-3">
            <span className="w-8 h-1 bg-brand-gold rounded-full" />
            <p className="text-brand-gray font-bold text-[10px] uppercase tracking-[0.3em]">{total} Transactions logged</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[2rem] border border-border shadow-sm p-3">
        <form className="flex flex-wrap gap-2 w-full" onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            window.location.search = `?search=${fd.get('search')}&status=${fd.get('status')}`;
        }}>
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-gray/30" size={16} />
            <input
              name="search"
              defaultValue={search}
              placeholder="Search by Hash, Subject, or Identifier…"
              className="w-full pl-14 pr-6 py-3 bg-off-white border border-transparent rounded-[1.25rem] text-sm font-bold focus:outline-none focus:border-brand-gold transition-all"
            />
          </div>
          <select
            name="status"
            defaultValue={status}
            className="px-6 py-3 bg-off-white border border-transparent rounded-[1.25rem] text-sm font-bold focus:outline-none focus:border-brand-gold transition-all appearance-none cursor-pointer"
          >
            <option value="">All Lifecycle Stages</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <button
            type="submit"
            className="px-8 py-3 bg-brand-black text-white text-[10px] font-black uppercase tracking-widest rounded-[1.25rem] hover:bg-brand-gold transition-all"
          >
            Filter Logs
          </button>
          {(search || status) && (
            <Link
              href="/admin/orders"
              className="px-6 py-3 border border-border text-brand-black text-[10px] font-black uppercase tracking-widest rounded-[1.25rem] hover:bg-off-white flex items-center"
            >
              Reset
            </Link>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-brand-gray/40 text-[10px] font-black uppercase tracking-[0.2em] border-b border-border">
                <th className="px-6 py-6 text-left">Internal Hash</th>
                <th className="hidden sm:table-cell px-6 py-6 text-left">Timestamp</th>
                <th className="px-6 py-6 text-left">Subject</th>
                <th className="px-6 py-6 text-left">Valuation</th>
                <th className="hidden md:table-cell px-6 py-6 text-left">Settlement</th>
                <th className="px-6 py-6 text-right">Lifecycle & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 text-brand-gray/30">
                      <ShoppingCart size={60} strokeWidth={1} />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Logs Detected</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-off-white/50 transition-colors group">
                    <td className="px-6 py-6">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-mono text-[10px] font-bold text-brand-black hover:text-brand-gold transition-colors"
                      >
                        {order.id.slice(-8).toUpperCase()}
                      </Link>
                      <p className="text-brand-gray/40 text-[10px] mt-1 font-bold">
                        {order._count.items} Units
                      </p>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-6 text-brand-gray font-bold text-xs uppercase tracking-tighter">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-6">
                      <p className="font-black text-brand-black tracking-tight">{order.user.name}</p>
                      <p className="hidden md:block text-[10px] font-bold text-brand-gray uppercase tracking-widest opacity-50">{order.user.email}</p>
                    </td>
                    <td className="px-6 py-6">
                      <p className="font-black text-brand-black text-base">{formatPrice(order.totalAmount)}</p>
                    </td>
                    <td className="hidden md:table-cell px-6 py-6">
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                        order.paymentStatus === 'PAID' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-off-white text-brand-gray/60 border-border'
                      )}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex justify-end gap-3 items-center">
                         <span className={cn(
                           "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                           STATUS_THEME[order.status]
                         )}>
                           {order.status}
                         </span>
                         <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                            onClick={() => handleEdit(order)}
                            className="w-10 h-10 rounded-xl bg-off-white text-brand-black flex items-center justify-center hover:bg-brand-black hover:text-white transition-all shadow-sm border border-border"
                            title="Update Lifecycle"
                            >
                            <Edit size={16} />
                            </button>
                            <button
                            onClick={() => handleDelete(order)}
                            className="w-10 h-10 rounded-xl bg-off-white text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm border border-border"
                            title="Purge Log"
                            >
                            <Trash2 size={16} />
                            </button>
                         </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
    return (
        <Suspense fallback={<div className="p-6">Loading orders...</div>}>
            <AdminOrdersContent />
        </Suspense>
    )
}

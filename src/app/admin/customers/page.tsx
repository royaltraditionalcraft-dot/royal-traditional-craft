"use client";

import { useState } from "react";
import { Search, User as UserIcon, Mail, Calendar, MapPin, MoreVertical, Edit, Trash2 } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([
    { id: "cust_1", name: "Aditya Verma", email: "aditya@example.com", joinedAt: "Oct 15, 2025", location: "Mumbai, MH", totalOrders: 4, spent: 185000, status: "ACTIVE" },
    { id: "cust_2", name: "Meera Nair", email: "meera@example.com", joinedAt: "Nov 02, 2025", location: "Bangalore, KA", totalOrders: 2, spent: 65000, status: "ACTIVE" },
    { id: "cust_3", name: "Rahul Singh", email: "rahul@example.com", joinedAt: "Dec 10, 2025", location: "Delhi, DL", totalOrders: 1, spent: 18500, status: "INACTIVE" },
    { id: "cust_4", name: "Ananya Iyer", email: "ananya@example.com", joinedAt: "Jan 05, 2026", location: "Chennai, TN", totalOrders: 3, spent: 125000, status: "ACTIVE" },
    { id: "cust_5", name: "Suresh Babu", email: "suresh@example.com", joinedAt: "Feb 12, 2026", location: "Hyderabad, TS", totalOrders: 1, spent: 22000, status: "ACTIVE" },
  ]);

  const handleEdit = (customer: any) => {
    const newName = prompt("Edit customer name:", customer.name);
    if (newName && newName.trim() !== "") {
      setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, name: newName } : c));
      toast.success(`Customer "${newName}" updated.`);
    }
  };

  const handleDelete = (customer: any) => {
    if (confirm(`Delete customer "${customer.name}"? This cannot be undone.`)) {
      setCustomers(prev => prev.filter(c => c.id !== customer.id));
      toast.success(`Deleted customer "${customer.name}".`);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-gray-900 text-3xl font-bold">Customers</h1>
        <p className="text-gray-500 text-sm mt-1">View and manage your customer base.</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy-500/10 focus:border-burgundy-500 transition-all"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[10px] sm:text-xs uppercase tracking-widest border-b border-gray-100">
                <th className="px-6 py-4 text-left font-semibold">Customer</th>
                <th className="hidden lg:table-cell px-6 py-4 text-left font-semibold">Location</th>
                <th className="hidden md:table-cell px-6 py-4 text-left font-semibold">Joined</th>
                <th className="px-6 py-4 text-left font-semibold">Activity</th>
                <th className="hidden sm:table-cell px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {customers.map((cust) => (
                <tr key={cust.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 min-w-[180px]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-burgundy-50 text-burgundy-700 flex items-center justify-center font-bold text-xs sm:text-sm shadow-inner transition-transform group-hover:scale-105">
                        {cust.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 group-hover:text-burgundy-700 transition-colors line-clamp-1">{cust.name}</p>
                        <p className="text-gray-400 text-[10px] sm:text-xs truncate max-w-[120px]">{cust.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                      <MapPin size={13} className="text-gold-600" />
                      {cust.location}
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 text-gray-500 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-gray-400" />
                      {cust.joinedAt}
                    </div>
                  </td>
                  <td className="px-6 py-4 min-w-[120px]">
                    <p className="font-bold text-gray-900 text-xs sm:text-sm">{cust.totalOrders} <span className="text-gray-400 font-normal">Orders</span></p>
                    <p className="text-burgundy-700 text-[10px] sm:text-xs font-semibold mt-0.5">{formatPrice(cust.spent)}</p>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      cust.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    )}>
                      {cust.status}
                    </span>
                  </td>
                   <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEdit(cust);
                          }}
                          className="p-3 bg-gray-100 text-gray-600 hover:bg-burgundy-100 hover:text-burgundy-700 rounded-lg transition-all cursor-pointer border border-gray-200"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(cust);
                          }}
                          className="p-3 bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-all cursor-pointer border border-gray-200"
                          title="Delete"
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

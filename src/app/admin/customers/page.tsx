import { Search, User as UserIcon, Mail, Calendar, MapPin, MoreVertical, Edit, Trash2 } from "lucide-react";
import { cn, formatPrice, formatDate } from "@/lib/utils";
import Image from "next/image";

interface Customer {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: string;
  totalSpent: number;
  orderCount: number;
}

async function getCustomers(): Promise<Customer[]> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/customers`, {
      cache: 'no-store', // Always fetch fresh data
    });
    if (!res.ok) throw new Error('Failed to fetch customers');
    const data = await res.json();
    return data.users || [];
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

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
                <th className="hidden md:table-cell px-6 py-4 text-left font-semibold">Joined</th>
                <th className="px-6 py-4 text-left font-semibold">Activity</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {customers.map((cust) => (
                <tr key={cust.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 min-w-[180px]">
                    <div className="flex items-center gap-3">
                      {cust.image ? (
                        <Image
                          src={cust.image}
                          alt={cust.name || 'User'}
                          width={40}
                          height={40}
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shadow-inner transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-burgundy-50 text-burgundy-700 flex items-center justify-center font-bold text-xs sm:text-sm shadow-inner transition-transform group-hover:scale-105">
                          {(cust.name || cust.email)[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 group-hover:text-burgundy-700 transition-colors line-clamp-1">{cust.name || 'Anonymous User'}</p>
                        <p className="text-gray-400 text-[10px] sm:text-xs truncate max-w-[120px]">{cust.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 text-gray-500 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-gray-400" />
                      {formatDate(cust.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 min-w-[120px]">
                    <p className="font-bold text-gray-900 text-xs sm:text-sm">{cust.orderCount} <span className="text-gray-400 font-normal">Orders</span></p>
                    <p className="text-burgundy-700 text-[10px] sm:text-xs font-semibold mt-0.5">{formatPrice(cust.totalSpent)}</p>
                  </td>
                   <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="p-3 bg-gray-100 text-gray-600 hover:bg-burgundy-100 hover:text-burgundy-700 rounded-lg transition-all cursor-pointer border border-gray-200"
                          title="View Details"
                        >
                          <Edit size={18} />
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

import type { Metadata } from "next";
import { formatPrice, formatNumber, cn } from "@/lib/utils";
import Link from "next/link";
import {
  TrendingUp, ShoppingCart, Package, Users,
  AlertTriangle, ArrowRight, ArrowUpRight,
} from "lucide-react";
import { AdminRevenueChart } from "./AdminRevenueChart";

export const metadata: Metadata = { title: "Admin | SHOP." };

async function getDashboardStats() {
  try {
    const [customersRes, productsRes, ordersRes] = await Promise.all([
      fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/customers?limit=1`, { cache: 'no-store' }),
      fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/products?limit=1`, { cache: 'no-store' }),
      fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/orders?limit=1`, { cache: 'no-store' }),
    ]);

    const customersData = customersRes.ok ? await customersRes.json() : { total: 0 };
    const productsData = productsRes.ok ? await productsRes.json() : { total: 0 };
    const ordersData = ordersRes.ok ? await ordersRes.json() : { total: 0 };

    return {
      totalCustomers: customersData.total || 0,
      totalProducts: productsData.total || 0,
      totalOrders: ordersData.total || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { totalCustomers: 0, totalProducts: 0, totalOrders: 0 };
  }
}

export default async function AdminDashboard() {
  const now = new Date();

  // Fetch real data
  const { totalCustomers, totalProducts, totalOrders } = await getDashboardStats();

  // ── MOCK DATA FOR NOW ────────────────────────────────────────────────────────────
  const revenue = 1254300;
  const revenuePrev = 980500;
  const ordersCurrent = totalOrders; // Use real orders count
  const ordersPrev = Math.max(0, ordersCurrent - 7); // Mock previous

  const revenueChange = Math.round(((revenue - revenuePrev) / revenuePrev) * 100);
  const ordersChange = Math.round(((ordersCurrent - ordersPrev) / ordersPrev) * 100);

  const recentOrders = [
    { id: "ord_1", createdAt: new Date(), totalAmount: 89999, status: "PROCESSING", user: { name: "Aditya Verma", email: "aditya@example.com" } },
    { id: "ord_2", createdAt: new Date(), totalAmount: 45000, status: "PENDING", user: { name: "Meera Nair", email: "meera@example.com" } },
    { id: "ord_3", createdAt: new Date(), totalAmount: 18500, status: "SHIPPED", user: { name: "Rahul Singh", email: "rahul@example.com" } },
    { id: "ord_4", createdAt: new Date(), totalAmount: 65000, status: "DELIVERED", user: { name: "Ananya Iyer", email: "ananya@example.com" } },
    { id: "ord_5", createdAt: new Date(), totalAmount: 22000, status: "PROCESSING", user: { name: "Suresh Babu", email: "suresh@example.com" } },
  ];

  const lowStock = [
    { id: "p1", name: "Lumina Smart Bed", stock: 2, images: ["https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800"] },
    { id: "p2", name: "Core Dining Nexus", stock: 0, images: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800"] },
    { id: "p10", name: "Aero Focus Chair", stock: 1, images: ["https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=800"] },
  ];

  const chartData = [
    { date: "Oct 01", revenue: 45000 },
    { date: "Oct 05", revenue: 52000 },
    { date: "Oct 10", revenue: 38000 },
    { date: "Oct 15", revenue: 65000 },
    { date: "Oct 20", revenue: 48000 },
    { date: "Oct 25", revenue: 72000 },
    { date: "Oct 30", revenue: 55000 },
  ];

  const topProducts = [
    { productId: "p1", name: "Lumina Smart Bed", _sum: { quantity: 12 } },
    { productId: "p4", name: "Aero Ergonomic Chair", _sum: { quantity: 8 } },
    { productId: "p3", name: "Zenith Modular Sofa", _sum: { quantity: 6 } },
  ];

  const STATS = [
    {
      label: "Total Revenue",
      value: formatPrice(revenue),
      change: revenueChange,
      icon: TrendingUp,
    },
    {
      label: "Total Orders",
      value: formatNumber(ordersCurrent),
      change: ordersChange,
      icon: ShoppingCart,
    },
    {
      label: "Products",
      value: formatNumber(totalProducts),
      change: null,
      icon: Package,
    },
    {
      label: "Customers",
      value: formatNumber(totalCustomers),
      change: null,
      icon: Users,
    },
  ];

  const STATUS_COLORS: Record<string, string> = {
    PENDING:    "bg-gray-100 text-gray-700 border-gray-200",
    PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
    SHIPPED:    "bg-foreground text-background border-foreground",
    DELIVERED:  "bg-green-50 text-green-700 border-green-200",
    CANCELLED:  "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 bg-background text-foreground">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-border pb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground text-sm">Key metrics and recent activity for your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map(({ label, value, change, icon: Icon }) => (
          <div key={label} className="border border-border p-6 shadow-sm hover:border-foreground/50 transition-colors bg-white">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
              <div className="p-2 bg-muted rounded-md text-foreground">
                <Icon size={18} />
              </div>
            </div>
            <div className="flex items-end justify-between">
                <p className="text-2xl font-bold tracking-tight">{value}</p>
                {change !== null && (
                <div className={cn("text-xs font-semibold px-2 py-1 flex items-center gap-1", change >= 0 ? "text-green-600" : "text-red-600")}>
                    <ArrowUpRight size={14} className={change < 0 ? "rotate-180" : ""} />
                    {change >= 0 ? "+" : ""}{change}%
                </div>
                )}
            </div>
          </div>
        ))}
      </div>

      {/* Primary Analytics */}
      <div className="border border-border p-8 shadow-sm bg-white">
        <h2 className="text-lg font-bold tracking-tight mb-8">Revenue Chart</h2>
        <AdminRevenueChart data={chartData} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 border border-border shadow-sm bg-white overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-bold tracking-tight">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-medium hover:underline text-muted-foreground hover:text-foreground flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr className="text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 text-left font-semibold">Order ID</th>
                  <th className="px-6 py-4 text-left font-semibold">Customer</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      #{order.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{order.user.name ?? "Store Customer"}</p>
                      <p className="text-xs text-muted-foreground">{order.user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("px-3 py-1 text-[10px] font-bold tracking-wider uppercase border", STATUS_COLORS[order.status])}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-right">
                      {formatPrice(order.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Alerts */}
        <div className="flex flex-col gap-8">
            <div className="border border-red-200 bg-red-50/50 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <AlertTriangle size={18} className="text-red-600" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-red-900">Low Inventory</h2>
                </div>
                <ul className="space-y-4">
                    {lowStock.map((p) => (
                    <li key={p.id} className="flex items-center gap-4 border-b border-red-100 last:border-0 pb-4 last:pb-0">
                        <div className="w-10 h-10 border border-border overflow-hidden bg-white flex-shrink-0">
                            {p.images[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate text-foreground">{p.name}</p>
                            <p className="text-xs text-red-600 font-medium">{p.stock} remaining</p>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>

            <div className="border border-border p-6 bg-white shadow-sm">
                 <h2 className="text-sm font-bold uppercase tracking-wider mb-6 text-foreground">Top Performing Products</h2>
                 <div className="space-y-5">
                    {topProducts.map((p, i) => (
                        <div key={p.productId} className="flex items-center gap-3">
                            <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}.</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                            </div>
                            <span className="text-sm font-bold text-foreground">{p._sum.quantity} <span className="text-muted-foreground font-normal text-xs">sold</span></span>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}

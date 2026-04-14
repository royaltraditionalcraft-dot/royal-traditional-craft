"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  Crown, LayoutDashboard, Package, ShoppingCart, Users,
  Tag, Image as ImageIcon, Settings, LogOut, Menu, X, ChevronRight,
  Store, Ticket
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard",  href: "/admin",            icon: LayoutDashboard },
  { label: "Products",   href: "/admin/products",   icon: Package },
  { label: "Orders",     href: "/admin/orders",     icon: ShoppingCart },
  { label: "Customers",  href: "/admin/customers",  icon: Users },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Coupons",    href: "/admin/coupons",    icon: Ticket },
  { label: "Banners",    href: "/admin/banner",     icon: ImageIcon },
  { label: "Settings",   href: "/admin/settings",   icon: Settings },
];

interface AdminSidebarProps {
  user: { name?: string | null; email?: string | null; image?: string | null; role?: string | null };
}

export function AdminSidebar({ 
  user,
  isOpen,
  onClose 
}: AdminSidebarProps & { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "flex flex-col bg-background text-foreground transition-all duration-500 flex-shrink-0 h-full z-50 border-r border-border shadow-sm",
          "fixed inset-y-0 left-0 lg:static",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed ? "w-20" : "w-72"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-8">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center transition-all">
                <Store size={20} className="text-background" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Admin</span>
                <span className="font-bold text-xs tracking-tight text-foreground">Royal Traditional Craft</span>
              </div>
            </Link>
          )}
          {collapsed && (
            <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center mx-auto">
              <Store size={20} className="text-background" />
            </div>
          )}
        </div>

        {/* Nav Section Label */}
        {!collapsed && (
          <div className="px-8 mb-4">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Management</p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 py-2 space-y-1.5 px-4 overflow-y-auto">
          {NAV.map(({ label, href, icon: Icon }) => {
            const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                title={collapsed ? label : undefined}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 group",
                  isActive
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center px-0"
                )}
              >
                <Icon size={20} className={cn("transition-colors", isActive ? "text-background" : "group-hover:text-foreground")} />
                {!collapsed && <span className="tracking-tight">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-6 border-t border-border bg-muted/30">
          {!collapsed && (
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-bold border-2 border-background shadow-sm">
                {user.name?.[0]?.toUpperCase() ?? "A"}
              </div>
              <div className="min-w-0">
                <p className="text-foreground text-[13px] font-bold truncate tracking-tight">{user.name}</p>
                <p className="text-muted-foreground text-[10px] font-medium truncate uppercase tracking-widest">{user.role ?? "Administrator"}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-all font-semibold text-sm",
              collapsed && "justify-center px-0"
            )}
          >
            <LogOut size={18} />
            {!collapsed && <span className="tracking-tight">Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

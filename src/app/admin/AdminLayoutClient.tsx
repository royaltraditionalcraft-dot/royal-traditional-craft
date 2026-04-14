"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Menu, Crown } from "lucide-react";
import Link from "next/link";

export function AdminLayoutClient({
  user,
  children,
}: {
  user: any;
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar 
        user={user} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-burgundy-900 text-cream-100 flex items-center justify-between px-4 h-16 shadow-md z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-gold-400 hover:text-gold-300 transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center">
              <Crown size={18} className="text-burgundy-900" />
            </div>
            <span className="font-heading font-bold text-sm tracking-tight">Admin</span>
          </Link>

          <div className="w-8" /> {/* Spacer */}
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative">
          {children}
        </main>
      </div>
    </div>
  );
}

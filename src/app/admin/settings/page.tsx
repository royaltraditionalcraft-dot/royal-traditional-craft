"use client";

import Link from "next/link";
import { ArrowLeft, Settings as SettingsIcon, Shield, Bell, Palette } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 bg-background text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border pb-6">
        <div className="flex items-center gap-6">
          <Link
            href="/admin"
            className="w-10 h-10 flex items-center justify-center bg-muted text-foreground rounded-lg hover:bg-foreground hover:text-background transition-colors shadow-sm"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground">Store configurations.</p>
          </div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-24 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-8 border border-border shadow-inner relative group overflow-hidden">
            <SettingsIcon size={40} className="text-muted-foreground relative z-10 animate-spin-slow" strokeWidth={1.5} />
        </div>
        
        <div className="max-w-xl space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Settings Unavailable
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Store configuration settings, payment gateways, and shipping details are currently locked during this demo mode.
          </p>
        </div>

        <div className="flex justify-center gap-8 mt-12 py-8 px-12 bg-muted/30 rounded-xl border border-border w-full max-w-md">
          <div className="text-center group">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm border border-border group-hover:scale-110 transition-transform">
              <Shield size={20} className="text-foreground transition-colors" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground">Security</p>
          </div>
          <div className="text-center group">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm border border-border group-hover:scale-110 transition-transform">
              <Bell size={20} className="text-foreground transition-colors" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground">Alerts</p>
          </div>
          <div className="text-center group">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm border border-border group-hover:scale-110 transition-transform">
              <Palette size={20} className="text-foreground transition-colors" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground">Visuals</p>
          </div>
        </div>

        <Link
          href="/admin"
          className="mt-10 inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background text-sm font-semibold rounded-lg hover:bg-foreground/90 transition-colors shadow-sm"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
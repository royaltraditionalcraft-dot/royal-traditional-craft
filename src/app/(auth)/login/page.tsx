"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Crown, Loader2, Mail, Lock, LogIn, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { LoginButton } from "./LoginButton";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl,
      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Logged in successfully");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
            Email Address
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-foreground/5 focus:border-foreground transition-all outline-none"
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center ml-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Password
            </label>
            <Link href="/forgot-password" title="Mock Link" className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-foreground/5 focus:border-foreground transition-all outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-foreground text-background rounded-2xl font-bold text-sm hover:bg-foreground/90 active:scale-[0.98] transition-all shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              Sign In
              <LogIn size={16} />
            </>
          )}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
          <span className="bg-white px-4 text-muted-foreground text-[10px]">Or continue with</span>
        </div>
      </div>

      <LoginButton callbackUrl={callbackUrl} />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="h-1.5 bg-foreground" />
          
          <div className="p-8 sm:p-10">
            <div className="flex flex-col items-center mb-10">
              <div className="w-14 h-14 bg-foreground rounded-2xl flex items-center justify-center mb-4">
                <Crown size={28} className="text-background" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Welcome Back
              </h1>
              <p className="text-muted-foreground text-sm mt-2">
                Sign in to your account to continue
              </p>
            </div>

            <Suspense fallback={<div className="flex justify-center py-10"><Loader2 size={24} className="animate-spin text-muted-foreground" /></div>}>
              <LoginForm />
            </Suspense>

            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-foreground font-bold hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        <p className="text-center mt-8">
          <Link href="/" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}

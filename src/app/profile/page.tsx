import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Package, MapPin, Settings, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/shop/CartDrawer";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar session={session} />
      
      <main className="flex-1 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mt-16 md:mt-24">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-off-white shadow-xl bg-muted flex items-center justify-center">
                {user.image ? (
                  <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <User className="size-16 text-muted-foreground/30" />
                )}
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                <h1 className="text-4xl font-heading font-bold tracking-tight text-foreground">
                  {user.name || "Royal Member"}
                </h1>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-black text-white w-fit mx-auto md:mx-0">
                  {user.role}
                </span>
              </div>
              <p className="text-muted-foreground font-medium mb-6">{user.email}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <Link href="/orders">
                  <Button className="rounded-full px-8 py-6 h-auto text-xs font-bold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all">
                    View Orders
                  </Button>
                </Link>
                <Button variant="outline" className="rounded-full px-8 py-6 h-auto text-xs font-bold uppercase tracking-widest border-border hover:bg-off-white">
                  Edit Account
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/orders" className="group p-8 rounded-[2.5rem] border border-border hover:border-foreground/20 hover:shadow-pill transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-off-white flex items-center justify-center text-foreground group-hover:scale-110 transition-transform">
                  <Package className="size-6" />
                </div>
                <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-xl font-bold mb-1">Orders</h3>
              <p className="text-sm text-muted-foreground">Track and manage your purchases</p>
            </Link>

            <div className="group p-8 rounded-[2.5rem] border border-border hover:border-foreground/20 hover:shadow-pill transition-all duration-300 cursor-not-allowed opacity-60">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-off-white flex items-center justify-center text-foreground">
                  <MapPin className="size-6" />
                </div>
                <ChevronRight className="size-5 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-1">Addresses</h3>
              <p className="text-sm text-muted-foreground">Manage your shipping destinations</p>
            </div>

            <div className="group p-8 rounded-[2.5rem] border border-border hover:border-foreground/20 hover:shadow-pill transition-all duration-300 cursor-not-allowed opacity-60">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-off-white flex items-center justify-center text-foreground">
                  <Settings className="size-6" />
                </div>
                <ChevronRight className="size-5 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-1">Security</h3>
              <p className="text-sm text-muted-foreground">Password and privacy controls</p>
            </div>

            <div className="group p-8 rounded-[2.5rem] border border-border hover:border-red-100 hover:bg-red-50/30 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                  <LogOut className="size-6" />
                </div>
                <ChevronRight className="size-5 text-red-300 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-xl font-bold mb-1">Sign Out</h3>
              <p className="text-sm text-muted-foreground">Securely end your current session</p>
            </div>
          </div>

          <div className="mt-20 pt-12 border-t border-border flex flex-col items-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">Member Since</p>
            <p className="font-heading font-medium text-lg italic">
              {new Date(user.createdAt as string).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}

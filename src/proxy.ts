import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// We use a separate instance for Edge/Proxy to avoid database dependencies (Prisma)
const { auth } = NextAuth(authConfig);

export default auth(function middleware(req: NextRequest & { auth: any }) {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session?.user;
  const role = session?.user?.role;
  const path = nextUrl.pathname;

  const isAdminRoute = path.startsWith("/admin");
  const isAuthRoute = ["/login", "/register"].includes(path);
  const isProtectedRoute = ["/checkout", "/orders", "/profile"].some(r => path.startsWith(r));

  // Admin Guard
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return NextResponse.next();
  }

  // Protected Route Guard
  if (isProtectedRoute) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(path);
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl)
      );
    }
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and API internals:
     *  - _next/static (static files)
     *  - _next/image (image optimization)
     *  - favicon.ico, public folder
     *  - api (API routes do their own auth checks)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};


import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

// This is the Edge-compatible part of the config
export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Note: Credentials provider is NOT fully supported in some Edge environments 
    // but works if you handle the logic correctly. 
    // For now we keep it here but we won't call DB here.
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        // This will be overridden in auth.ts with DB logic
        return null; 
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // Only put Edge-compatible callbacks here (like checking role from token)
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      
      if (isAdminRoute) {
        if (isLoggedIn && (auth?.user as any).role === "ADMIN") return true;
        return false; // Redirect to login
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
        token.createdAt = (user as any).createdAt;
      }
      
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.createdAt = token.createdAt as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

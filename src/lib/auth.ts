import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import type { DefaultSession } from "next-auth";

// Extend session types to include role
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      createdAt: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as any),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [
    ...authConfig.providers.filter(p => p.id !== "credentials"),
    // Re-inject Credentials with actual DB logic
    {
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
        };
      },
    },
  ],
  callbacks: {
    ...authConfig.callbacks,
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
    async signIn({ user }) {
      if (user.email === process.env.ADMIN_EMAIL) {
        try {
          await prisma.user.update({
            where: { email: user.email },
            data: { role: "ADMIN" },
          });
        } catch {
          // ignore error
        }
      }
      return true;
    },
  },
});

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

// Set up WebSocket constructor for Neon Serverless
neonConfig.webSocketConstructor = ws;

// Ensure DATABASE_URL is read, with a hard fallback to the Neon DB string in case Next.js/Turbopack fails to inject .env on time.
const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_B2gGOriHu6zM@ep-cold-mountain-a107go8v.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const adapter = new PrismaNeon({ connectionString });

const globalForPrisma = globalThis as unknown as {
  prisma_new: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma_new ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma_new = prisma;

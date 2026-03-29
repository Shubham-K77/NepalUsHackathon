import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

let pool;
let adapter;
let prisma;

export const connect = async () => {
  const connectionString = process.env.DIRECT_URL;

  if (!connectionString) {
    throw new Error("DIRECT_URL is missing in environment variables.");
  }

  if (pool && prisma) {
    return;
  }

  pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    allowExitOnIdle: false,
  });

  pool.on("error", (error) => {
    // Pool handles stale connections internally; just log for observability.
    console.error("PostgreSQL pool error:", error.message);
  });

  adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
  await prisma.$connect();
};

export const disconnect = async () => {
  if (prisma) await prisma.$disconnect();
  if (pool) await pool.end();
  prisma = undefined;
  adapter = undefined;
  pool = undefined;
};

// Proxy to ensure prisma is accessed after connect() initializes it
export default new Proxy(
  {},
  {
    get: (target, prop) => {
      if (!prisma) {
        throw new Error("Prisma is not initialized. Call connect() first.");
      }
      const value = prisma[prop];
      if (typeof value === "function") {
        return value.bind(prisma);
      }
      return value;
    },
  },
);

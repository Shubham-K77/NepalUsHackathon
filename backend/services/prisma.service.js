//Imports
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Client } = pg;

let client;
let adapter;
let prisma;

export const connect = async () => {
  const connectionString = process.env.DIRECT_URL;

  client = new Client({ connectionString });
  adapter = new PrismaPg(client);
  prisma = new PrismaClient({ adapter });

  await client.connect();
  await prisma.$connect();
};

export const disconnect = async () => {
  if (prisma) await prisma.$disconnect();
  if (client) await client.end();
};

//Export
export default prisma;

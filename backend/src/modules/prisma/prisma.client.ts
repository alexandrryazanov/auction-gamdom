import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | null = null;

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient();
  }

  return prisma;
}

export default getPrismaClient();

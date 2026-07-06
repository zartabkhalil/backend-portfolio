import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Handle graceful shutdown
async function shutdown() {
  await prisma.$disconnect();
  console.log("Prisma disconnected");
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

export default prisma;

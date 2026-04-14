const { PrismaClient } = require("./src/generated/prisma");

const prisma = new PrismaClient();

async function main() {
  try {
    const userCount = await prisma.user.count();
    console.log("SUCCESS: Connected to DB. User count:", userCount);
  } catch (err) {
    console.error("FAILURE: Could not connect to DB.");
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();

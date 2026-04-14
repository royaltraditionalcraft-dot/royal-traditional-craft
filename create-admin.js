const { PrismaClient } = require("./src/generated/prisma");

const prisma = new PrismaClient();

async function main() {
  try {
    const newUser = await prisma.user.create({
      data: {
        name: "Test Admin",
        email: "asas09414@gmail.com",
        password: "hashed_password_placeholder", // Since this is a test
        role: "ADMIN"
      }
    });
    console.log("SUCCESS: Created Admin user:", newUser);
  } catch (err) {
    console.error("FAILURE: Error creating user:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();

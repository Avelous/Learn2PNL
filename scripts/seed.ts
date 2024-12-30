const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
  try {
    await db.category.createMany({
      data: [
        { name: "Forex" },
        { name: "Crypto" },
      ],
    });
    console.log("success");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await db.$disconnect();
  }
}

main();

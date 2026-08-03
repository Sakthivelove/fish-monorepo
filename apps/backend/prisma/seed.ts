import "dotenv/config";
import bcrypt from "bcrypt";

import { AdminRole } from "@prisma/client";
import { prisma } from "../src/lib/prisma";

async function main() {
  // -----------------
  // Admin
  // -----------------

  const existingAdmin =
    await prisma.admin.findUnique({
      where: {
        username: "admin",
      },
    });

  if (!existingAdmin) {
    const passwordHash =
      await bcrypt.hash(
        "Admin@123",
        10
      );

    await prisma.admin.create({
      data: {
        username: "admin",
        email: "admin@example.com",
        passwordHash,
        role: AdminRole.SUPER_ADMIN,
        isActive: true,
      },
    });

    console.log(
      "✅ Super Admin created"
    );
  }

  // -----------------
  // Products
  // -----------------

  const vanjaram =
    await prisma.product.upsert({
      where: {
        id: "11111111-1111-1111-1111-111111111111",
      },

      update: {},

      create: {
        id: "11111111-1111-1111-1111-111111111111",

        nameTamil: "வஞ்சிரம்",

        nameEnglish:
          "Seer Fish",

        category: "மீன்",

        description:
          "Fresh Seer Fish",

        pricePerKg: 900,

        imageUrl:
          "https://dummyimage.com/600x400",

        isActive: true,
      },
    });

  const prawn =
    await prisma.product.upsert({
      where: {
        id: "22222222-2222-2222-2222-222222222222",
      },

      update: {},

      create: {
        id: "22222222-2222-2222-2222-222222222222",

        nameTamil: "இறால்",

        nameEnglish:
          "Prawn",

        category: "இறால்",

        description:
          "Fresh Prawn",

        pricePerKg: 600,

        imageUrl:
          "https://dummyimage.com/600x400",

        isActive: true,
      },
    });

  console.log(
    "✅ Products seeded"
  );

  // -----------------
  // Inventory
  // -----------------

  await prisma.inventory.upsert({
    where: {
      productId:
        vanjaram.id,
    },

    update: {},

    create: {
      productId:
        vanjaram.id,

      stockQuantityGrams:
        10000,
    },
  });

  await prisma.inventory.upsert({
    where: {
      productId:
        prawn.id,
    },

    update: {},

    create: {
      productId:
        prawn.id,

      stockQuantityGrams:
        5000,
    },
  });

  console.log(
    "✅ Inventory seeded"
  );
}

main()
  .catch((error) => {
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
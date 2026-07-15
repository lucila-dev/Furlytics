import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo123", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@furlytics.app" },
    update: {},
    create: {
      email: "demo@furlytics.app",
      passwordHash,
    },
  });

  const existingPet = await prisma.pet.findFirst({ where: { userId: user.id, name: "Buddy" } });
  if (!existingPet) {
    await prisma.pet.create({
      data: {
        userId: user.id,
        name: "Buddy",
        breed: "Mixed",
        age: 3,
        weight: 12.5,
        knownConditions: "None",
      },
    });
  }

  console.log("Seed complete: demo@furlytics.app / demo123, pet Buddy");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

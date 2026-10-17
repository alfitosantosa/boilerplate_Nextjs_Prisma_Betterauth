import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client";
import { DEFAULT_PLANS } from "../lib/pricing";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

for (const plan of DEFAULT_PLANS) {
  await prisma.plan.upsert({
    where: { slug: plan.slug },
    create: plan,
    update: plan,
  });
}

const count = await prisma.plan.count();
console.log(`Seed selesai: ${count} plan tersedia.`);

await prisma.$disconnect();

import { PrismaClient } from "@prisma/client";
import { AuthService } from "@/modules/auth/auth.service";
import { LotsService } from "@/modules/lots/lots.service";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  const authService = new AuthService();
  await authService.register({ email: "test1@test.com", password: "12345" });
  await authService.register({ email: "test2@test.com", password: "12345" });
  await authService.register({ email: "test3@test.com", password: "12345" });
  console.log("Users have been registered.");

  await prisma.lot.createMany({
    data: [
      {
        name: "1st lot",
        startPriceInCents: 100,
        minPriceStep: 100,
        maxPriceStep: 1000,
        timeInSec: 120,
      },
      {
        name: "2nd lot",
        startPriceInCents: 200,
        minPriceStep: 100,
        maxPriceStep: 1000,
        timeInSec: 240,
      },
      {
        name: "3nd lot",
        startPriceInCents: 300,
        minPriceStep: 100,
        maxPriceStep: 1000,
        timeInSec: 360,
      },
    ],
  });
  console.log("Lots have been created.");

  console.log("Done");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

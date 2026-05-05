import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run prisma/seed.ts");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  const asset = await prisma.asset.upsert({
    where: { code: "USD_ATOMIC" },
    update: {},
    create: {
      id: "asset_usd_atomic",
      code: "USD_ATOMIC",
      name: "US Dollar Atomic Units"
    }
  });

  const sourceAccount = await prisma.account.upsert({
    where: { id: "acct_source_demo" },
    update: {},
    create: {
      id: "acct_source_demo"
    }
  });

  const destinationAccount = await prisma.account.upsert({
    where: { id: "acct_destination_demo" },
    update: {},
    create: {
      id: "acct_destination_demo"
    }
  });

  await prisma.balance.upsert({
    where: {
      accountId_assetId: {
        accountId: sourceAccount.id,
        assetId: asset.id
      }
    },
    update: {
      amount: "100000"
    },
    create: {
      id: "bal_source_usd_atomic",
      accountId: sourceAccount.id,
      assetId: asset.id,
      amount: "100000"
    }
  });

  await prisma.balance.upsert({
    where: {
      accountId_assetId: {
        accountId: destinationAccount.id,
        assetId: asset.id
      }
    },
    update: {
      amount: "0"
    },
    create: {
      id: "bal_destination_usd_atomic",
      accountId: destinationAccount.id,
      assetId: asset.id,
      amount: "0"
    }
  });

  console.log("Seed completed.");
  console.log({
    assetId: asset.id,
    sourceAccountId: sourceAccount.id,
    destinationAccountId: destinationAccount.id
  });
}

main()
  .catch((error) => {
    console.error("Seed failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

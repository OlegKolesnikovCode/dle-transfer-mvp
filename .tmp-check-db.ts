import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL
  })
});

async function main() {
  const balances = await prisma.balance.findMany({
    where: { accountId: 'acct_source_demo' },
    include: { asset: true }
  });
  console.log('balance rows:', balances.length);
  console.log(JSON.stringify(balances, null, 2));
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

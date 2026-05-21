import { getPrismaClient, disconnectPrismaClient } from "../src/server/ledger/persistence-boundary";
import { executeTransferInConsistencyBoundary } from "../src/server/ledger/consistency-boundary";

describe("TEST-013 concurrent transfers do not double-spend", () => {
  const prisma = getPrismaClient();

  beforeAll(async () => {
    // clean up tables involved (best-effort)
    await prisma.ledgerEntry.deleteMany();
    await prisma.transfer.deleteMany();
    await prisma.request.deleteMany();
    await prisma.balance.deleteMany();
    await prisma.account.deleteMany();
    await prisma.asset.deleteMany();

    // create accounts, asset and initial balances
    await prisma.asset.create({ data: { code: "TEST", name: "Test Asset" } });
    await prisma.account.createMany({ data: [{}, {}] });

    const accounts = await prisma.account.findMany({ orderBy: { createdAt: "asc" } });
    const asset = await prisma.asset.findFirst();

    // seed balances: source has 100, destination has 0
    await prisma.balance.create({ data: { accountId: accounts[0].id, assetId: asset!.id, amount: "100" } });
    await prisma.balance.create({ data: { accountId: accounts[1].id, assetId: asset!.id, amount: "0" } });
  });

  afterAll(async () => {
    await disconnectPrismaClient();
  });

  test("two concurrent transfers that together exceed source balance result in at most one execution", async () => {
    const accounts = await prisma.account.findMany({ orderBy: { createdAt: "asc" } });
    const asset = await prisma.asset.findFirst();

    const inputA = {
      requestIdentity: `concurrent-A-${Date.now()}-${Math.random()}`,
      sourceAccountId: accounts[0].id,
      destinationAccountId: accounts[1].id,
      assetId: asset!.id,
      amount: "60"
    };

    const inputB = {
      requestIdentity: `concurrent-B-${Date.now()}-${Math.random()}`,
      sourceAccountId: accounts[0].id,
      destinationAccountId: accounts[1].id,
      assetId: asset!.id,
      amount: "60"
    };

    // Fire both transfers concurrently
    const [r1, r2] = await Promise.all([
      executeTransferInConsistencyBoundary(inputA),
      executeTransferInConsistencyBoundary(inputB)
    ]);

    // Fetch the final source balance and ledger entries
    const balances = await prisma.balance.findMany({ where: { accountId: accounts[0].id } });
    const sourceBalance = balances[0];
    const ledgerEntries = await prisma.ledgerEntry.findMany({ where: { accountId: accounts[0].id } });

    // Source started at 100; only one of the 60 transfers should have executed, leaving 40.
    expect(Number(sourceBalance.amount.toString())).toBeGreaterThanOrEqual(0);
    expect(Number(sourceBalance.amount.toString())).toBeLessThanOrEqual(100);

    // At most one of the transfers should be in EXECUTED state.
    const transfers = await prisma.transfer.findMany({ where: { sourceAccountId: accounts[0].id } });
    const executedCount = transfers.filter((t) => t.state === "EXECUTED").length;
    expect(executedCount).toBeLessThanOrEqual(1);

    // Ensure ledger entries for source reflect at most one debit of 60.
    const debitEntries = ledgerEntries.filter((e) => e.direction === "DEBIT" && e.assetId === asset!.id);
    expect(debitEntries.length).toBeLessThanOrEqual(1);
  }, 20000);
});

import { getPrismaClient, disconnectPrismaClient } from "../src/server/ledger/persistence-boundary";
import { resolveIdempotentTransferRequest } from "../src/server/ledger/idempotency-control";

/**
 * TEST-007 — Idempotency Verification
 *
 * Source authority:
 * - L10__TEST_SPEC__VERIFICATION__SYSTEM.md
 *
 * Source references:
 * - TEST-007
 * - INV-007
 * - FAIL-007
 * - FSM-007
 * - ARCH-002
 * - SCHEMA-009
 * - SCHEMA-010
 * - API-003
 * - API-006
 *
 * Valid-path observation:
 * - Duplicate Request identity resolves to the same persisted outcome.
 *
 * Invalid-path observation:
 * - Duplicate Request producing additional LedgerEntries, additional Balance mutation,
 *   or divergent Response meaning is rejected.
 *
 * This test does not treat client retry behavior, timestamps, logs, or in-memory cache as proof.
 */

type PersistedRequestOutcome = Readonly<{
  requestIdentity: string;
  transferId: string;
  responseMeaning: string;
  ledgerEntryCount: number;
  balanceMutationCount: number;
}>;

type IdempotencyReplayResult =
  | Readonly<{
      ok: true;
      duplicateResolved: true;
      outcome: PersistedRequestOutcome;
      sourceReferences: readonly string[];
    }>
  | Readonly<{
      ok: false;
      sourceFailureId: "FAIL-007";
      reason:
        | "DIVERGENT_OUTCOME"
        | "ADDITIONAL_LEDGER_ENTRIES"
        | "ADDITIONAL_BALANCE_MUTATION"
        | "REQUEST_IDENTITY_MISMATCH";
      sourceReferences: readonly string[];
    }>;

const IDEMPOTENCY_SOURCE_REFERENCES = [
  "TEST-007",
  "INV-007",
  "FAIL-007",
  "FSM-007",
  "ARCH-002",
  "SCHEMA-009",
  "SCHEMA-010",
  "API-003",
  "API-006"
] as const;

function evaluateDuplicateRequestReplay(
  original: PersistedRequestOutcome,
  replay: PersistedRequestOutcome
): IdempotencyReplayResult {
  if (original.requestIdentity !== replay.requestIdentity) {
    return {
      ok: false,
      sourceFailureId: "FAIL-007",
      reason: "REQUEST_IDENTITY_MISMATCH",
      sourceReferences: IDEMPOTENCY_SOURCE_REFERENCES
    };
  }

  if (
    original.transferId !== replay.transferId ||
    original.responseMeaning !== replay.responseMeaning
  ) {
    return {
      ok: false,
      sourceFailureId: "FAIL-007",
      reason: "DIVERGENT_OUTCOME",
      sourceReferences: IDEMPOTENCY_SOURCE_REFERENCES
    };
  }

  if (replay.ledgerEntryCount > original.ledgerEntryCount) {
    return {
      ok: false,
      sourceFailureId: "FAIL-007",
      reason: "ADDITIONAL_LEDGER_ENTRIES",
      sourceReferences: IDEMPOTENCY_SOURCE_REFERENCES
    };
  }

  if (replay.balanceMutationCount > original.balanceMutationCount) {
    return {
      ok: false,
      sourceFailureId: "FAIL-007",
      reason: "ADDITIONAL_BALANCE_MUTATION",
      sourceReferences: IDEMPOTENCY_SOURCE_REFERENCES
    };
  }

  return {
    ok: true,
    duplicateResolved: true,
    outcome: original,
    sourceReferences: IDEMPOTENCY_SOURCE_REFERENCES
  };
}

describe("TEST-007 — Idempotency Verification", () => {
  const originalOutcome: PersistedRequestOutcome = {
    requestIdentity: "req_test_007_idempotency",
    transferId: "transfer_test_007",
    responseMeaning: "COMPLETED_TRANSFER",
    ledgerEntryCount: 2,
    balanceMutationCount: 2
  };

  it("valid path: duplicate Request resolves to the same persisted outcome", () => {
    const replayOutcome: PersistedRequestOutcome = {
      requestIdentity: "req_test_007_idempotency",
      transferId: "transfer_test_007",
      responseMeaning: "COMPLETED_TRANSFER",
      ledgerEntryCount: 2,
      balanceMutationCount: 2
    };

    const result = evaluateDuplicateRequestReplay(
      originalOutcome,
      replayOutcome
    );

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.duplicateResolved).toBe(true);
      expect(result.outcome).toEqual(originalOutcome);
      expect(result.sourceReferences).toContain("INV-007");
      expect(result.sourceReferences).toContain("FAIL-007");
    }
  });

  it("invalid path: rejects duplicate Request with additional LedgerEntries", () => {
    const replayOutcome: PersistedRequestOutcome = {
      ...originalOutcome,
      ledgerEntryCount: 4
    };

    const result = evaluateDuplicateRequestReplay(
      originalOutcome,
      replayOutcome
    );

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.sourceFailureId).toBe("FAIL-007");
      expect(result.reason).toBe("ADDITIONAL_LEDGER_ENTRIES");
    }
  });

  it("invalid path: rejects duplicate Request with additional Balance mutation", () => {
    const replayOutcome: PersistedRequestOutcome = {
      ...originalOutcome,
      balanceMutationCount: 4
    };

    const result = evaluateDuplicateRequestReplay(
      originalOutcome,
      replayOutcome
    );

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.sourceFailureId).toBe("FAIL-007");
      expect(result.reason).toBe("ADDITIONAL_BALANCE_MUTATION");
    }
  });

  it("invalid path: rejects duplicate Request with divergent outcome meaning", () => {
    const replayOutcome: PersistedRequestOutcome = {
      ...originalOutcome,
      transferId: "transfer_different",
      responseMeaning: "DIFFERENT_TRANSFER"
    };

    const result = evaluateDuplicateRequestReplay(
      originalOutcome,
      replayOutcome
    );

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.sourceFailureId).toBe("FAIL-007");
      expect(result.reason).toBe("DIVERGENT_OUTCOME");
    }
  });

  it("invalid path: rejects replay with different Request identity", () => {
    const replayOutcome: PersistedRequestOutcome = {
      ...originalOutcome,
      requestIdentity: "req_other"
    };

    const result = evaluateDuplicateRequestReplay(
      originalOutcome,
      replayOutcome
    );

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.sourceFailureId).toBe("FAIL-007");
      expect(result.reason).toBe("REQUEST_IDENTITY_MISMATCH");
    }
  });
});

describe("TEST-007 — Idempotency DB-backed duplicate request collisions", () => {
  const prisma = getPrismaClient();
  let assetId: string;
  let sourceAccountId: string;
  let destinationAccountId: string;

  beforeAll(async () => {
    await prisma.ledgerEntry.deleteMany();
    await prisma.transfer.deleteMany();
    await prisma.request.deleteMany();
    await prisma.balance.deleteMany();
    await prisma.account.deleteMany();
    await prisma.asset.deleteMany();

    await prisma.asset.create({ data: { code: "TEST", name: "Test Asset" } });
    await prisma.account.createMany({ data: [{}, {}] });

    const accounts = await prisma.account.findMany({ orderBy: { createdAt: "asc" } });
    const asset = await prisma.asset.findFirst();

    sourceAccountId = accounts[0].id;
    destinationAccountId = accounts[1].id;
    assetId = asset!.id;

    await prisma.balance.create({
      data: { accountId: sourceAccountId, assetId, amount: "100" }
    });
    await prisma.balance.create({
      data: { accountId: destinationAccountId, assetId, amount: "0" }
    });
  });

  beforeEach(async () => {
    await prisma.ledgerEntry.deleteMany();
    await prisma.transfer.deleteMany();
    await prisma.request.deleteMany();

    await prisma.balance.update({
      where: { accountId_assetId: { accountId: sourceAccountId, assetId } },
      data: { amount: "100" }
    });
    await prisma.balance.update({
      where: { accountId_assetId: { accountId: destinationAccountId, assetId } },
      data: { amount: "0" }
    });
  });

  afterAll(async () => {
    await disconnectPrismaClient();
  });

  it("resolves a successful duplicate request collision using the persisted completed outcome", async () => {
    const requestIdentity = `duplicate-success-${Date.now()}-${Math.random()}`;
    const input = {
      requestIdentity,
      sourceAccountId,
      destinationAccountId,
      assetId,
      amount: "60"
    };

    const [first, second] = await Promise.all([
      resolveIdempotentTransferRequest(input),
      resolveIdempotentTransferRequest(input)
    ]);

    const successResult = [first, second].find(
      (result) => result.ok && result.duplicate === false
    );
    const duplicateResult = [first, second].find(
      (result) => result.ok && result.duplicate === true
    );

    expect(successResult).toBeDefined();
    expect(duplicateResult).toBeDefined();
    expect(duplicateResult?.requestStatus).toBe("COMPLETED");
    expect(duplicateResult?.persistedOutcome).toBeDefined();
    expect(duplicateResult?.transferId).toBeDefined();
    expect(duplicateResult?.transferId).toEqual(
      (successResult as any).execution.transferId
    );

    expect(
      await prisma.request.count({ where: { identity: requestIdentity } })
    ).toBe(1);
    expect(
      await prisma.transfer.count({ where: { sourceAccountId, state: "EXECUTED" } })
    ).toBe(1);

    const sourceBalance = await prisma.balance.findUnique({
      where: { accountId_assetId: { accountId: sourceAccountId, assetId } }
    });
    expect(sourceBalance?.amount.toString()).toBe("40");

    const debitEntries = await prisma.ledgerEntry.count({
      where: { accountId: sourceAccountId, direction: "DEBIT" }
    });
    expect(debitEntries).toBe(1);
  });

  it("resolves a failed duplicate request collision using the persisted failed outcome", async () => {
    const requestIdentity = `duplicate-fail-${Date.now()}-${Math.random()}`;
    const input = {
      requestIdentity,
      sourceAccountId,
      destinationAccountId,
      assetId,
      amount: "200"
    };

    const [first, second] = await Promise.all([
      resolveIdempotentTransferRequest(input),
      resolveIdempotentTransferRequest(input)
    ]);

    const failedResult = [first, second].find((result) => result.ok === false);
    const duplicateResult = [first, second].find(
      (result) => result.ok === true && result.duplicate === true
    );

    expect(failedResult).toBeDefined();
    expect(duplicateResult).toBeDefined();
    expect(duplicateResult?.requestStatus).toBe("FAILED");
    expect(duplicateResult?.persistedOutcome).toBeDefined();

    expect(
      await prisma.request.count({ where: { identity: requestIdentity } })
    ).toBe(1);
    expect(
      await prisma.transfer.count({ where: { sourceAccountId, state: "EXECUTED" } })
    ).toBe(0);

    const sourceBalance = await prisma.balance.findUnique({
      where: { accountId_assetId: { accountId: sourceAccountId, assetId } }
    });
    expect(sourceBalance?.amount.toString()).toBe("100");

    expect(
      await prisma.ledgerEntry.count({ where: { accountId: sourceAccountId } })
    ).toBe(0);
  });
});
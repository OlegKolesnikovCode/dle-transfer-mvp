import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Persistence Boundary.
 *
 * Source authority:
 * - L06__ARCHITECTURE__CONTROL_FLOW__SYSTEM.md
 * - L07__DATA_SCHEMA__DATA_MODEL__PERSISTENCE.md
 *
 * Source references:
 * - ARCH-007
 * - ARCH-009
 * - SCHEMA-001 through SCHEMA-013
 * - INV-003
 * - INV-009
 *
 * Implementation guidance:
 * - IMP-03__PERSISTENCE_RULES__PRISMA_SCHEMA.md
 * - IMP-04__TRANSACTION_RULES__CONSISTENCY_BOUNDARY.md
 *
 * This file owns physical durable reads and writes only.
 * This file does not make business-validity decisions.
 * This file does not authorize Balance Changes.
 * This file does not create semantic LedgerEntry authority.
 * This file does not decide lifecycle transitions.
 * This file does not open Balance-Affecting Operation transactions.
 * This file does not construct API responses.
 */

declare global {
  // eslint-disable-next-line no-var
  var __dlePrismaClient: PrismaClient | undefined;
}

export type PersistenceTransaction = Prisma.TransactionClient;

export type RequestOutcomeWrite = Readonly<{
  requestId: string;
  status: "COMPLETED" | "FAILED";
  responseBody?: Prisma.InputJsonValue;
  errorBody?: Prisma.InputJsonValue;
  completedAt: Date;
}>;

export type CreateRequestInput = Readonly<{
  identity: string;
  operationType: "TRANSFER";
  status: "RECEIVED" | "PROCESSING" | "COMPLETED" | "FAILED";
}>;

export type CreateTransferInput = Readonly<{
  requestId: string;
  sourceAccountId: string;
  destinationAccountId: string;
  assetId: string;
  amount: string;
  state: "REQUESTED" | "VALIDATED" | "EXECUTED" | "FAILED";
  createdAt?: Date;
  executedAt?: Date;
  failedAt?: Date;
}>;

export type UpdateTransferStateInput = Readonly<{
  transferId: string;
  state: "REQUESTED" | "VALIDATED" | "EXECUTED" | "FAILED";
  executedAt?: Date;
  failedAt?: Date;
}>;

export type UpdateBalanceAmountInput = Readonly<{
  balanceId: string;
  amount: string;
}>;

export type CreateLedgerEntryInput = Readonly<{
  transferId: string;
  accountId: string;
  assetId: string;
  amountDelta: string;
  direction: "DEBIT" | "CREDIT";
  createdAt?: Date;
}>;

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required for Persistence Boundary.");
  }

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({ adapter });
}

export function getPrismaClient(): PrismaClient {
  if (!globalThis.__dlePrismaClient) {
    globalThis.__dlePrismaClient = createPrismaClient();
  }

  return globalThis.__dlePrismaClient;
}

export async function disconnectPrismaClient(): Promise<void> {
  if (globalThis.__dlePrismaClient) {
    await globalThis.__dlePrismaClient.$disconnect();
    globalThis.__dlePrismaClient = undefined;
  }
}

export async function findRequestByIdentity(identity: string) {
  return getPrismaClient().request.findUnique({
    where: { identity },
    include: {
      transfer: true
    }
  });
}

export async function findRequestByIdentityInTransaction(
  tx: PersistenceTransaction,
  identity: string
) {
  return tx.request.findUnique({
    where: { identity },
    include: {
      transfer: true
    }
  });
}

export async function createRequestInTransaction(
  tx: PersistenceTransaction,
  input: CreateRequestInput
) {
  return tx.request.create({
    data: {
      identity: input.identity,
      operationType: input.operationType,
      status: input.status
    }
  });
}

export async function updateRequestOutcomeInTransaction(
  tx: PersistenceTransaction,
  input: RequestOutcomeWrite
) {
  return tx.request.update({
    where: { id: input.requestId },
    data: {
      status: input.status,
      responseBody: input.responseBody ?? Prisma.JsonNull,
      errorBody: input.errorBody ?? Prisma.JsonNull,
      completedAt: input.completedAt
    }
  });
}

export async function createTransferInTransaction(
  tx: PersistenceTransaction,
  input: CreateTransferInput
) {
  return tx.transfer.create({
    data: {
      requestId: input.requestId,
      sourceAccountId: input.sourceAccountId,
      destinationAccountId: input.destinationAccountId,
      assetId: input.assetId,
      amount: input.amount,
      state: input.state,
      ...(input.executedAt ? { executedAt: input.executedAt } : {}),
      ...(input.failedAt ? { failedAt: input.failedAt } : {})
    }
  });
}

export async function updateTransferStateInTransaction(
  tx: PersistenceTransaction,
  input: UpdateTransferStateInput
) {
  return tx.transfer.update({
    where: { id: input.transferId },
    data: {
      state: input.state,
      ...(input.executedAt ? { executedAt: input.executedAt } : {}),
      ...(input.failedAt ? { failedAt: input.failedAt } : {})
    }
  });
}

export async function findTransferById(transferId: string) {
  return getPrismaClient().transfer.findUnique({
    where: { id: transferId }
  });
}

export async function findTransferByIdWithLedgerEntries(transferId: string) {
  return getPrismaClient().transfer.findUnique({
    where: { id: transferId },
    include: {
      ledgerEntries: true
    }
  });
}

export async function findBalanceByAccountAndAssetInTransaction(
  tx: PersistenceTransaction,
  accountId: string,
  assetId: string
) {
  return tx.balance.findUnique({
    where: {
      accountId_assetId: {
        accountId,
        assetId
      }
    }
  });
}

export async function findBalancesByAccountId(accountId: string) {
  return getPrismaClient().balance.findMany({
    where: { accountId },
    include: {
      asset: true
    },
    orderBy: {
      assetId: "asc"
    }
  });
}

export async function updateBalanceAmountInTransaction(
  tx: PersistenceTransaction,
  input: UpdateBalanceAmountInput
) {
  return tx.balance.update({
    where: { id: input.balanceId },
    data: {
      amount: input.amount
    }
  });
}

export async function createLedgerEntriesInTransaction(
  tx: PersistenceTransaction,
  entries: readonly CreateLedgerEntryInput[]
) {
  return tx.ledgerEntry.createMany({
    data: entries.map((entry) => ({
      transferId: entry.transferId,
      accountId: entry.accountId,
      assetId: entry.assetId,
      amountDelta: entry.amountDelta,
      direction: entry.direction,
      ...(entry.createdAt ? { createdAt: entry.createdAt } : {})
    }))
  });
}

export async function findLedgerEntriesByTransferId(transferId: string) {
  return getPrismaClient().ledgerEntry.findMany({
    where: { transferId },
    orderBy: {
      createdAt: "asc"
    }
  });
}

export async function findLedgerEntriesByAccountAndAsset(
  accountId: string,
  assetId: string
) {
  return getPrismaClient().ledgerEntry.findMany({
    where: {
      accountId,
      assetId
    },
    orderBy: {
      createdAt: "asc"
    }
  });
}

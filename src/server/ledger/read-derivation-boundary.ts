import {
  findBalancesByAccountId,
  findLedgerEntriesByTransferId,
  findTransferById,
  findTransferByIdWithLedgerEntries
} from "./persistence-boundary";

/**
 * Read Derivation Boundary.
 *
 * Source authority:
 * - L06__ARCHITECTURE__CONTROL_FLOW__SYSTEM.md
 *
 * Source references:
 * - ARCH-008
 * - ARCH-009
 * - INV-001
 * - INV-003
 * - API-005
 *
 * This file derives read-only state from persistence.
 * This file does not mutate state.
 * This file does not authorize Balance Changes.
 * This file does not create LedgerEntries.
 * This file does not open transactions.
 * This file is outside the Balance-Affecting Operation execution path.
 */

export type ReadDerivationBoundary = "ARCH-008";

export type ReadDerivationNotFound = Readonly<{
  ok: false;
  boundary: ReadDerivationBoundary;
  reason: "TRANSFER_NOT_FOUND" | "ACCOUNT_BALANCES_NOT_FOUND";
  message: string;
  sourceReferences: readonly string[];
}>;

export type DerivedTransferRead = Readonly<{
  ok: true;
  boundary: ReadDerivationBoundary;
  transfer: Readonly<{
    id: string;
    requestId: string;
    sourceAccountId: string;
    destinationAccountId: string;
    assetId: string;
    amount: string;
    state: string;
    createdAt: string;
    updatedAt: string;
    executedAt: string | null;
    failedAt: string | null;
  }>;
  sourceReferences: readonly string[];
}>;

export type DerivedLedgerEntryRead = Readonly<{
  id: string;
  transferId: string;
  accountId: string;
  assetId: string;
  amountDelta: string;
  direction: string;
  createdAt: string;
}>;

export type DerivedTransferLedgerEntriesRead = Readonly<{
  ok: true;
  boundary: ReadDerivationBoundary;
  transferId: string;
  ledgerEntries: readonly DerivedLedgerEntryRead[];
  sourceReferences: readonly string[];
}>;

export type DerivedAccountBalanceRead = Readonly<{
  id: string;
  accountId: string;
  assetId: string;
  assetCode: string;
  amount: string;
  createdAt: string;
  updatedAt: string;
}>;

export type DerivedAccountBalancesRead = Readonly<{
  ok: true;
  boundary: ReadDerivationBoundary;
  accountId: string;
  balances: readonly DerivedAccountBalanceRead[];
  sourceReferences: readonly string[];
}>;

export type ReadTransferResult = DerivedTransferRead | ReadDerivationNotFound;

export type ReadTransferLedgerEntriesResult =
  | DerivedTransferLedgerEntriesRead
  | ReadDerivationNotFound;

export type ReadAccountBalancesResult =
  | DerivedAccountBalancesRead
  | ReadDerivationNotFound;

const READ_DERIVATION_SOURCE_REFERENCES = [
  "ARCH-008",
  "ARCH-009",
  "INV-001",
  "INV-003",
  "API-005",
  "API-011",
  "TEST-001",
  "TEST-003",
  "TEST-011"
] as const;

function dateToIso(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

function notFound(
  reason: ReadDerivationNotFound["reason"],
  message: string
): ReadDerivationNotFound {
  return {
    ok: false,
    boundary: "ARCH-008",
    reason,
    message,
    sourceReferences: READ_DERIVATION_SOURCE_REFERENCES
  };
}

export async function deriveTransferById(
  transferId: string
): Promise<ReadTransferResult> {
  const transfer = await findTransferById(transferId);

  if (!transfer) {
    return notFound(
      "TRANSFER_NOT_FOUND",
      "Transfer was not found for derived read."
    );
  }

  return {
    ok: true,
    boundary: "ARCH-008",
    transfer: {
      id: transfer.id,
      requestId: transfer.requestId,
      sourceAccountId: transfer.sourceAccountId,
      destinationAccountId: transfer.destinationAccountId,
      assetId: transfer.assetId,
      amount: transfer.amount.toString(),
      state: transfer.state,
      createdAt: transfer.createdAt.toISOString(),
      updatedAt: transfer.updatedAt.toISOString(),
      executedAt: dateToIso(transfer.executedAt),
      failedAt: dateToIso(transfer.failedAt)
    },
    sourceReferences: READ_DERIVATION_SOURCE_REFERENCES
  };
}

export async function deriveTransferLedgerEntries(
  transferId: string
): Promise<ReadTransferLedgerEntriesResult> {
  const transfer = await findTransferByIdWithLedgerEntries(transferId);

  if (!transfer) {
    return notFound(
      "TRANSFER_NOT_FOUND",
      "Transfer was not found for LedgerEntry derived read."
    );
  }

  const ledgerEntries = await findLedgerEntriesByTransferId(transferId);

  return {
    ok: true,
    boundary: "ARCH-008",
    transferId,
    ledgerEntries: ledgerEntries.map((entry) => ({
      id: entry.id,
      transferId: entry.transferId,
      accountId: entry.accountId,
      assetId: entry.assetId,
      amountDelta: entry.amountDelta.toString(),
      direction: entry.direction,
      createdAt: entry.createdAt.toISOString()
    })),
    sourceReferences: READ_DERIVATION_SOURCE_REFERENCES
  };
}

export async function deriveAccountBalances(
  accountId: string
): Promise<ReadAccountBalancesResult> {
  const balances = await findBalancesByAccountId(accountId);

  if (balances.length === 0) {
    return notFound(
      "ACCOUNT_BALANCES_NOT_FOUND",
      "No Balances were found for derived Account Balance read."
    );
  }

  return {
    ok: true,
    boundary: "ARCH-008",
    accountId,
    balances: balances.map((balance) => ({
      id: balance.id,
      accountId: balance.accountId,
      assetId: balance.assetId,
      assetCode: balance.asset.code,
      amount: balance.amount.toString(),
      createdAt: balance.createdAt.toISOString(),
      updatedAt: balance.updatedAt.toISOString()
    })),
    sourceReferences: READ_DERIVATION_SOURCE_REFERENCES
  };
}

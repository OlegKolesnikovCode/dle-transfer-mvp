import Decimal from "decimal.js";
import {
  findBalanceByAccountAndAssetInTransaction,
  type PersistenceTransaction,
  updateBalanceAmountInTransaction,
  decrementBalanceAmountInTransaction,
  incrementBalanceAmountInTransaction,
  ConditionalUpdateFailedError
} from "./persistence-boundary";

import type { ValidatedTransfer } from "../../domain/operations/transfer/transfer.types";

/**
 * Balance Control.
 *
 * Source authority:
 * - L03__INVARIANTS__CORRECTNESS_RULES__LEDGER.md
 * - L04__FAILURE_MODEL__FAILURE_CLASSES__LEDGER.md
 * - L06__ARCHITECTURE__CONTROL_FLOW__SYSTEM.md
 *
 * Source references:
 * - ARCH-005
 * - ARCH-009
 * - INV-001
 * - INV-005
 * - INV-006
 * - FAIL-005
 * - FAIL-006
 *
 * This file authorizes Balance Change eligibility.
 * This file receives transaction context only.
 * This file does not open transactions.
 * This file does not import Prisma directly.
 * This file does not create LedgerEntries.
 * This file does not decide lifecycle transitions.
 * This file does not construct API responses.
 */


export type BalanceControlAuthorized = Readonly<{
  ok: true;
  boundary: "ARCH-005";
  requestIdentity: string;
  sourceAccountId: string;
  destinationAccountId: string;
  assetId: string;
  amount: string;
  sourceBalanceId: string;
  destinationBalanceId: string;
  sourceBalanceBefore: string;
  destinationBalanceBefore: string;
  sourceBalanceAfter: string;
  destinationBalanceAfter: string;
  sourceReferences: readonly string[];
}>;

export type BalanceControlRejected = Readonly<{
  ok: false;
  boundary: "ARCH-005";
  sourceFailureId: "FAIL-005" | "FAIL-006";
  reason:
    | "TRANSFER_INPUT_INVALID"
    | "SOURCE_BALANCE_NOT_FOUND"
    | "DESTINATION_BALANCE_NOT_FOUND"
    | "INSUFFICIENT_SOURCE_BALANCE"
    | "ASSET_INCONSISTENCY";
  message: string;
  sourceReferences: readonly string[];
}>;

export type BalanceControlResult =
  | BalanceControlAuthorized
  | BalanceControlRejected;

const BALANCE_CONTROL_SOURCE_REFERENCES = [
  "ARCH-005",
  "ARCH-009",
  "INV-001",
  "INV-005",
  "INV-006",
  "FAIL-005",
  "FAIL-006"
] as const;

function decimalToAtomicString(value: Decimal): string {
  return value.toFixed(0);
}

function rejectBalanceControl(
  reason: BalanceControlRejected["reason"],
  message: string,
  sourceFailureId: "FAIL-005" | "FAIL-006"
): BalanceControlRejected {
  return {
    ok: false,
    boundary: "ARCH-005",
    sourceFailureId,
    reason,
    message,
    sourceReferences: BALANCE_CONTROL_SOURCE_REFERENCES
  };
}

export type BalanceControlInput = Readonly<{
  tx: PersistenceTransaction;
  transferInput: ValidatedTransfer;  // Changed from unknown
}>;

export async function authorizeBalanceChange(
  input: BalanceControlInput
): Promise<BalanceControlResult> {
  const transfer = input.transferInput; // Already validated by Request Boundary

  const sourceBalance = await findBalanceByAccountAndAssetInTransaction(
    input.tx,
    transfer.sourceAccountId,
    transfer.assetId
  );

  if (!sourceBalance) {
    return rejectBalanceControl(
      "SOURCE_BALANCE_NOT_FOUND",
      "Source Balance was not found for the Transfer Account and Asset.",
      "FAIL-005"
    );
  }

  const destinationBalance = await findBalanceByAccountAndAssetInTransaction(
    input.tx,
    transfer.destinationAccountId,
    transfer.assetId
  );

  if (!destinationBalance) {
    return rejectBalanceControl(
      "DESTINATION_BALANCE_NOT_FOUND",
      "Destination Balance was not found for the Transfer Account and Asset.",
      "FAIL-005"
    );
  }

  // DESIGN CHOICE (L07 SCHEMA-001):
  // The MVP does not auto-create destination balances.
  // Accounts and their Balances must be initialized separately before Transfers.
  // This preserves strict account ownership semantics within the Bounded System.
  // See L07__DATA_SCHEMA__DATA_MODEL__PERSISTENCE.md SCHEMA-001.

    if (
    sourceBalance.assetId !== transfer.assetId ||
    destinationBalance.assetId !== transfer.assetId
  ) {
    return rejectBalanceControl(
      "ASSET_INCONSISTENCY",
      "Transfer Asset does not match source and destination Balances.",
      "FAIL-006"
    );
  }

  const amount = new Decimal(transfer.amount);
  const sourceBefore = new Decimal(sourceBalance.amount.toString());
  const destinationBefore = new Decimal(destinationBalance.amount.toString());

  const sourceAfter = sourceBefore.minus(amount);
  const destinationAfter = destinationBefore.plus(amount);

  if (sourceAfter.isNegative()) {
    return rejectBalanceControl(
      "INSUFFICIENT_SOURCE_BALANCE",
      "Transfer would produce a negative source Balance.",
      "FAIL-005"
    );
  }

  return {
    ok: true,
    boundary: "ARCH-005",
    requestIdentity: transfer.requestIdentity,
    sourceAccountId: transfer.sourceAccountId,
    destinationAccountId: transfer.destinationAccountId,
    assetId: transfer.assetId,
    amount: transfer.amount,
    sourceBalanceId: sourceBalance.id,
    destinationBalanceId: destinationBalance.id,
    sourceBalanceBefore: decimalToAtomicString(sourceBefore),
    destinationBalanceBefore: decimalToAtomicString(destinationBefore),
    sourceBalanceAfter: decimalToAtomicString(sourceAfter),
    destinationBalanceAfter: decimalToAtomicString(destinationAfter),
    sourceReferences: BALANCE_CONTROL_SOURCE_REFERENCES
  };
}

export async function persistAuthorizedBalanceChange(
  tx: PersistenceTransaction,
  authorization: BalanceControlAuthorized
): Promise<void> {
  // Atomically decrement source balance only when sufficient funds remain.
  const decAffected = await decrementBalanceAmountInTransaction(
    tx,
    authorization.sourceBalanceId,
    authorization.amount
  );

  if (decAffected !== 1) {
    // Signal a conditional-update failure so the consistency boundary can map it.
    throw new ConditionalUpdateFailedError(
      "Source balance conditional decrement failed"
    );
  }

  const incAffected = await incrementBalanceAmountInTransaction(
    tx,
    authorization.destinationBalanceId,
    authorization.amount
  );

  if (incAffected !== 1) {
    // This is unexpected: attempt to undo the decrement will be handled by transaction rollback.
    throw new ConditionalUpdateFailedError(
      "Destination balance increment failed"
    );
  }
}



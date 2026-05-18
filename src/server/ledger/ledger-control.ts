import {
  createTransferLedgerEntryPlan,
  isCompleteTransferLedgerEntryPlan,
  type TransferLedgerEntryPlan
} from "../../domain/operations/transfer/transfer.ledger-entry-plan";
import {
  createLedgerEntriesInTransaction,
  type PersistenceTransaction
} from "./persistence-boundary";

/**
 * Ledger Control.
 *
 * Source authority:
 * - L03__INVARIANTS__CORRECTNESS_RULES__LEDGER.md
 * - L04__FAILURE_MODEL__FAILURE_CLASSES__LEDGER.md
 * - L06__ARCHITECTURE__CONTROL_FLOW__SYSTEM.md
 *
 * Source references:
 * - ARCH-006
 * - ARCH-009
 * - INV-001
 * - INV-002
 * - INV-010
 * - FAIL-001
 * - FAIL-002
 * - FAIL-010
 *
 * This file owns semantic LedgerEntry creation authority.
 * This file receives transaction context only.
 * This file does not open transactions.
 * This file does not import Prisma directly.
 * This file does not authorize Balance Changes.
 * This file does not decide lifecycle transitions.
 * This file does not construct API responses.
 */

export type LedgerControlTransferInput = Parameters<
  typeof createTransferLedgerEntryPlan
>[0] & Readonly<{ state: string }>;

export type LedgerControlInput = Readonly<{
  transferId: string;
  transfer: LedgerControlTransferInput;
  createdAt?: Date;
}>;

export type LedgerControlAuthorized = Readonly<{
  ok: true;
  boundary: "ARCH-006";
  transferId: string;
  requestIdentity: string;
  plan: TransferLedgerEntryPlan;
  createdAt?: Date;
  sourceReferences: readonly string[];
}>;

export type LedgerControlRejected = Readonly<{
  ok: false;
  boundary: "ARCH-006";
  sourceFailureId: "FAIL-001" | "FAIL-010";
  reason:
    | "TRANSFER_ID_MISSING"
    | "LEDGER_ENTRY_PLAN_INCOMPLETE";
  message: string;
  sourceReferences: readonly string[];
}>;

export type LedgerControlResult =
  | LedgerControlAuthorized
  | LedgerControlRejected;

const LEDGER_CONTROL_SOURCE_REFERENCES = [
  "ARCH-006",
  "ARCH-009",
  "INV-001",
  "INV-002",
  "INV-010",
  "FAIL-001",
  "FAIL-002",
  "FAIL-010"
] as const;

function rejectLedgerControl(
  reason: LedgerControlRejected["reason"],
  message: string,
  sourceFailureId: "FAIL-001" | "FAIL-010"
): LedgerControlRejected {
  return {
    ok: false,
    boundary: "ARCH-006",
    sourceFailureId,
    reason,
    message,
    sourceReferences: LEDGER_CONTROL_SOURCE_REFERENCES
  };
}

export function authorizeLedgerEntryCreation(
  input: LedgerControlInput
): LedgerControlResult {
  if (input.transferId.trim().length === 0) {
    return rejectLedgerControl(
      "TRANSFER_ID_MISSING",
      "LedgerEntry creation requires an associated Transfer identity.",
      "FAIL-010"
    );
  }

  const plan = createTransferLedgerEntryPlan(input.transfer);

  if (!isCompleteTransferLedgerEntryPlan(plan)) {
    return rejectLedgerControl(
      "LEDGER_ENTRY_PLAN_INCOMPLETE",
      "Transfer LedgerEntry plan is incomplete.",
      "FAIL-010"
    );
  }

  // Validate transfer state per FSM-005
  if (input.transfer.state !== "VALIDATED") {
    return rejectLedgerControl(
      "LEDGER_ENTRY_PLAN_INCOMPLETE",
      "Transfer must be in VALIDATED state before LedgerEntry creation.",
      "FAIL-010"
    );
  }

  return {
    ok: true,
    boundary: "ARCH-006",
    transferId: input.transferId,
    requestIdentity: input.transfer.requestIdentity,
    plan,
    createdAt: input.createdAt,
    sourceReferences: LEDGER_CONTROL_SOURCE_REFERENCES
  };
}

export async function persistAuthorizedLedgerEntries(
  tx: PersistenceTransaction,
  authorization: LedgerControlAuthorized
): Promise<void> {
  await createLedgerEntriesInTransaction(
    tx,
    authorization.plan.entries.map((entry) => ({
      transferId: authorization.transferId,
      accountId: entry.accountId,
      assetId: entry.assetId,
      amountDelta: entry.amountDelta,
      direction: entry.direction,
      ...(authorization.createdAt ? { createdAt: authorization.createdAt } : {})
    }))
  );
}

export function authorizeLedgerEntryCreation(
  input: LedgerControlInput
): LedgerControlResult {
  if (input.transferId.trim().length === 0) {
    return rejectLedgerControl(
      "TRANSFER_ID_MISSING",
      "LedgerEntry creation requires an associated Transfer identity.",
      "FAIL-010"
    );
  }

  const plan = createTransferLedgerEntryPlan(input.transfer);

  if (!isCompleteTransferLedgerEntryPlan(plan)) {
    return rejectLedgerControl(
      "LEDGER_ENTRY_PLAN_INCOMPLETE",
      "Transfer LedgerEntry plan is incomplete.",
      "FAIL-010"
    );
  }

  // Validate that transfer is in VALIDATED state (per FSM-005)
  // This ensures ledger entries are created only during VALIDATED -> EXECUTED transition
  if (input.transfer.state !== "VALIDATED") {
    return rejectLedgerControl(
      "LEDGER_ENTRY_PLAN_INCOMPLETE",
      "Transfer must be in VALIDATED state before LedgerEntry creation.",
      "FAIL-010"
    );
  }

  return {
    ok: true,
    boundary: "ARCH-006",
    transferId: input.transferId,
    requestIdentity: input.transfer.requestIdentity,
    plan,
    createdAt: input.createdAt,
    sourceReferences: LEDGER_CONTROL_SOURCE_REFERENCES
  };
}
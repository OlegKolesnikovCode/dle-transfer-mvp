import type {
  AccountId,
  AssetId,
  AtomicUnitDecimalString,
  ValidatedTransfer
} from "./transfer.types";
import type { EntityId } from "../../entities";
import type { TermId } from "../../terms";

/**
 * Pure Transfer LedgerEntry planning.
 *
 * Source authority:
 * - L01__DOMAIN__ENTITIES_RELATIONSHIPS__LEDGER.md
 * - L02__LANGUAGE__CANONICAL_TERMS__GLOBAL.md
 * - L03__INVARIANTS__CORRECTNESS_RULES__LEDGER.md
 * - L04__FAILURE_MODEL__FAILURE_CLASSES__LEDGER.md
 *
 * Implementation guidance:
 * - IMP-05__TRANSFER_OPERATION__MVP_ONLY.md
 *
 * This file plans LedgerEntry intent only.
 * This file does not persist LedgerEntries.
 * This file does not mutate Balance.
 * This file does not authorize Balance Changes.
 * This file does not open transactions.
 * This file does not define API behavior.
 */

export type LedgerEntryPlanDirection = "DEBIT" | "CREDIT";

export type LedgerEntryAmountDelta = string;

export type LedgerEntryPlanSourceReferences = Readonly<{
  entityIds: readonly Extract<
    EntityId,
    "ENT-001" | "ENT-003" | "ENT-004" | "ENT-005"
  >[];
  termIds: readonly Extract<
    TermId,
    "TERM-006" | "TERM-008" | "TERM-009" | "TERM-014" | "TERM-015"
  >[];
  invariantIds: readonly ("INV-001" | "INV-002" | "INV-006" | "INV-010")[];
  failureIds: readonly ("FAIL-001" | "FAIL-002" | "FAIL-006" | "FAIL-010")[];
}>;

export type PlannedLedgerEntry = Readonly<{
  accountId: AccountId;
  assetId: AssetId;
  direction: LedgerEntryPlanDirection;
  amountMagnitude: AtomicUnitDecimalString;
  amountDelta: LedgerEntryAmountDelta;
  sourceReferences: readonly string[];
}>;

export type TransferLedgerEntryPlan = Readonly<{
  operation: "Transfer";
  transferAssociationRequired: true;
  requestIdentity: string;
  sourceAccountId: AccountId;
  destinationAccountId: AccountId;
  assetId: AssetId;
  amount: AtomicUnitDecimalString;
  entries: readonly [PlannedLedgerEntry, PlannedLedgerEntry];
  sourceReferences: LedgerEntryPlanSourceReferences;
}>;

export const LEDGER_ENTRY_PLAN_SOURCE_REFERENCES = {
  entityIds: ["ENT-001", "ENT-003", "ENT-004", "ENT-005"],
  termIds: ["TERM-006", "TERM-008", "TERM-009", "TERM-014", "TERM-015"],
  invariantIds: ["INV-001", "INV-002", "INV-006", "INV-010"],
  failureIds: ["FAIL-001", "FAIL-002", "FAIL-006", "FAIL-010"]
} as const satisfies LedgerEntryPlanSourceReferences;

const SOURCE_LEDGER_ENTRY_REFERENCES = [
  "ENT-005",
  "TERM-009",
  "INV-001",
  "INV-002",
  "INV-006",
  "INV-010",
  "FAIL-001",
  "FAIL-006",
  "FAIL-010"
] as const;

const DESTINATION_LEDGER_ENTRY_REFERENCES = [
  "ENT-005",
  "TERM-009",
  "INV-001",
  "INV-002",
  "INV-006",
  "INV-010",
  "FAIL-001",
  "FAIL-006",
  "FAIL-010"
] as const;

function toDebitDelta(amount: AtomicUnitDecimalString): LedgerEntryAmountDelta {
  return `-${amount}`;
}

function toCreditDelta(amount: AtomicUnitDecimalString): LedgerEntryAmountDelta {
  return amount;
}

export function createTransferLedgerEntryPlan(
  transfer: ValidatedTransfer
): TransferLedgerEntryPlan {
  const sourceEntry: PlannedLedgerEntry = {
    accountId: transfer.sourceAccountId,
    assetId: transfer.assetId,
    direction: "DEBIT",
    amountMagnitude: transfer.amount,
    amountDelta: toDebitDelta(transfer.amount),
    sourceReferences: SOURCE_LEDGER_ENTRY_REFERENCES
  };

  const destinationEntry: PlannedLedgerEntry = {
    accountId: transfer.destinationAccountId,
    assetId: transfer.assetId,
    direction: "CREDIT",
    amountMagnitude: transfer.amount,
    amountDelta: toCreditDelta(transfer.amount),
    sourceReferences: DESTINATION_LEDGER_ENTRY_REFERENCES
  };

  return {
    operation: "Transfer",
    transferAssociationRequired: true,
    requestIdentity: transfer.requestIdentity,
    sourceAccountId: transfer.sourceAccountId,
    destinationAccountId: transfer.destinationAccountId,
    assetId: transfer.assetId,
    amount: transfer.amount,
    entries: [sourceEntry, destinationEntry],
    sourceReferences: LEDGER_ENTRY_PLAN_SOURCE_REFERENCES
  };
}

export function isCompleteTransferLedgerEntryPlan(
  plan: TransferLedgerEntryPlan
): boolean {
  const [sourceEntry, destinationEntry] = plan.entries;

  return (
    plan.operation === "Transfer" &&
    plan.transferAssociationRequired === true &&
    sourceEntry.direction === "DEBIT" &&
    destinationEntry.direction === "CREDIT" &&
    sourceEntry.accountId === plan.sourceAccountId &&
    destinationEntry.accountId === plan.destinationAccountId &&
    sourceEntry.assetId === plan.assetId &&
    destinationEntry.assetId === plan.assetId &&
    sourceEntry.amountMagnitude === plan.amount &&
    destinationEntry.amountMagnitude === plan.amount &&
    sourceEntry.amountDelta === `-${plan.amount}` &&
    destinationEntry.amountDelta === plan.amount
  );
}

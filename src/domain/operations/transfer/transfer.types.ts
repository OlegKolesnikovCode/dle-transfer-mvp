import type { EntityId } from "../../entities";
import type { TermId } from "../../terms";

/**
 * Transfer-only domain type surface.
 *
 * Source authority:
 * - L01__DOMAIN__ENTITIES_RELATIONSHIPS__LEDGER.md
 * - L02__LANGUAGE__CANONICAL_TERMS__GLOBAL.md
 * - L05__FSM_WORKFLOW__LIFECYCLE_RULES__TRANSFER.md
 *
 * Implementation guidance:
 * - IMP-05__TRANSFER_OPERATION__MVP_ONLY.md
 *
 * This file does not execute Transfers.
 * This file does not authorize Balance Changes.
 * This file does not create LedgerEntries.
 * This file does not open transactions.
 * This file does not persist state.
 * This file does not define API behavior.
 */

export type TransferSourceReferences = Readonly<{
  entityIds: readonly Extract<EntityId, "ENT-001" | "ENT-003" | "ENT-004" | "ENT-006">[];
  termIds: readonly Extract<TermId, "TERM-007" | "TERM-008" | "TERM-010" | "TERM-011" | "TERM-012">[];
}>;

export const TRANSFER_SOURCE_REFERENCES = {
  entityIds: ["ENT-001", "ENT-003", "ENT-004", "ENT-006"],
  termIds: ["TERM-007", "TERM-008", "TERM-010", "TERM-011", "TERM-012"]
} as const satisfies TransferSourceReferences;

export type AccountId = string;

export type AssetId = string;

export type RequestIdentity = string;

/**
 * Atomic-unit decimal string.
 *
 * Balance-affecting arithmetic must not use JavaScript number.
 * Runtime validation occurs in transfer.validation.ts.
 */
export type AtomicUnitDecimalString = string;

export type TransferState = "REQUESTED" | "VALIDATED" | "EXECUTED" | "FAILED";

export type TransferRequestInput = Readonly<{
  requestIdentity: RequestIdentity;
  sourceAccountId: AccountId;
  destinationAccountId: AccountId;
  assetId: AssetId;
  amount: AtomicUnitDecimalString;
}>;

export type TransferDraft = Readonly<{
  requestIdentity: RequestIdentity;
  sourceAccountId: AccountId;
  destinationAccountId: AccountId;
  assetId: AssetId;
  amount: AtomicUnitDecimalString;
  state: Extract<TransferState, "REQUESTED">;
}>;

export type ValidatedTransfer = Readonly<{
  requestIdentity: RequestIdentity;
  sourceAccountId: AccountId;
  destinationAccountId: AccountId;
  assetId: AssetId;
  amount: AtomicUnitDecimalString;
  state: Extract<TransferState, "VALIDATED">;
}>;

export type ExecutedTransferReference = Readonly<{
  transferId: string;
  requestIdentity: RequestIdentity;
  state: Extract<TransferState, "EXECUTED">;
}>;

export type FailedTransferReference = Readonly<{
  transferId: string;
  requestIdentity: RequestIdentity;
  state: Extract<TransferState, "FAILED">;
  failureSourceReferences: readonly string[];
}>;

export function createRequestedTransferDraft(
  input: TransferRequestInput
): TransferDraft {
  return {
    requestIdentity: input.requestIdentity,
    sourceAccountId: input.sourceAccountId,
    destinationAccountId: input.destinationAccountId,
    assetId: input.assetId,
    amount: input.amount,
    state: "REQUESTED"
  };
}

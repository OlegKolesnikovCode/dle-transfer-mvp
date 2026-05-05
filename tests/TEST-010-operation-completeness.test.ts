import {
  createTransferLedgerEntryPlan,
  isCompleteTransferLedgerEntryPlan,
  type TransferLedgerEntryPlan
} from "../src/domain/operations/transfer/transfer.ledger-entry-plan";
import type { TransferState, ValidatedTransfer } from "../src/domain/operations/transfer/transfer.types";

/**
 * TEST-010 — Operation Completeness Verification
 *
 * Source authority:
 * - L10__TEST_SPEC__VERIFICATION__SYSTEM.md
 *
 * Source references:
 * - TEST-010
 * - INV-010
 * - FAIL-010
 * - FSM-005
 * - FSM-008
 * - ARCH-006
 * - SCHEMA-005
 * - SCHEMA-011
 *
 * Valid-path observation:
 * - EXECUTED Transfer has complete LedgerEntry representation.
 *
 * Invalid-path observation:
 * - Completed operation without LedgerEntries, incomplete LedgerEntry set,
 *   or LedgerEntries without valid operation are rejected.
 *
 * This test does not treat route existence, logs, or persisted Transfer alone as proof.
 */

type OperationCompletenessInput = Readonly<{
  transferId?: string;
  transferState: TransferState;
  ledgerEntryPlan: TransferLedgerEntryPlan | null;
}>;

type OperationCompletenessResult =
  | Readonly<{
      ok: true;
      sourceReferences: readonly string[];
    }>
  | Readonly<{
      ok: false;
      sourceFailureId: "FAIL-010";
      reason:
        | "EXECUTED_TRANSFER_WITHOUT_LEDGER_ENTRIES"
        | "INCOMPLETE_LEDGER_ENTRY_REPRESENTATION"
        | "LEDGER_ENTRIES_WITHOUT_VALID_OPERATION"
        | "LEDGER_ENTRIES_FOR_NON_EXECUTED_TRANSFER";
      sourceReferences: readonly string[];
    }>;

const OPERATION_COMPLETENESS_SOURCE_REFERENCES = [
  "TEST-010",
  "INV-010",
  "FAIL-010",
  "FSM-005",
  "FSM-008",
  "ARCH-006",
  "SCHEMA-005",
  "SCHEMA-011"
] as const;

function evaluateOperationCompleteness(
  input: OperationCompletenessInput
): OperationCompletenessResult {
  if (input.ledgerEntryPlan && !input.transferId) {
    return {
      ok: false,
      sourceFailureId: "FAIL-010",
      reason: "LEDGER_ENTRIES_WITHOUT_VALID_OPERATION",
      sourceReferences: OPERATION_COMPLETENESS_SOURCE_REFERENCES
    };
  }

  if (input.ledgerEntryPlan && input.transferState !== "EXECUTED") {
    return {
      ok: false,
      sourceFailureId: "FAIL-010",
      reason: "LEDGER_ENTRIES_FOR_NON_EXECUTED_TRANSFER",
      sourceReferences: OPERATION_COMPLETENESS_SOURCE_REFERENCES
    };
  }

  if (input.transferState === "EXECUTED" && !input.ledgerEntryPlan) {
    return {
      ok: false,
      sourceFailureId: "FAIL-010",
      reason: "EXECUTED_TRANSFER_WITHOUT_LEDGER_ENTRIES",
      sourceReferences: OPERATION_COMPLETENESS_SOURCE_REFERENCES
    };
  }

  if (
    input.transferState === "EXECUTED" &&
    input.ledgerEntryPlan &&
    !isCompleteTransferLedgerEntryPlan(input.ledgerEntryPlan)
  ) {
    return {
      ok: false,
      sourceFailureId: "FAIL-010",
      reason: "INCOMPLETE_LEDGER_ENTRY_REPRESENTATION",
      sourceReferences: OPERATION_COMPLETENESS_SOURCE_REFERENCES
    };
  }

  return {
    ok: true,
    sourceReferences: OPERATION_COMPLETENESS_SOURCE_REFERENCES
  };
}

describe("TEST-010 — Operation Completeness Verification", () => {
  const validatedTransfer: ValidatedTransfer = {
    requestIdentity: "req_test_010_operation_completeness",
    sourceAccountId: "acct_source_demo",
    destinationAccountId: "acct_destination_demo",
    assetId: "asset_usd_atomic",
    amount: "100",
    state: "VALIDATED"
  };

  it("valid path: accepts EXECUTED Transfer with complete LedgerEntry representation", () => {
    const result = evaluateOperationCompleteness({
      transferId: "transfer_test_010",
      transferState: "EXECUTED",
      ledgerEntryPlan: createTransferLedgerEntryPlan(validatedTransfer)
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.sourceReferences).toContain("INV-010");
      expect(result.sourceReferences).toContain("FAIL-010");
    }
  });

  it("valid path: accepts FAILED Transfer without LedgerEntries", () => {
    const result = evaluateOperationCompleteness({
      transferId: "transfer_test_010_failed",
      transferState: "FAILED",
      ledgerEntryPlan: null
    });

    expect(result.ok).toBe(true);
  });

  it("invalid path: rejects EXECUTED Transfer without LedgerEntries", () => {
    const result = evaluateOperationCompleteness({
      transferId: "transfer_test_010_missing_entries",
      transferState: "EXECUTED",
      ledgerEntryPlan: null
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.sourceFailureId).toBe("FAIL-010");
      expect(result.reason).toBe("EXECUTED_TRANSFER_WITHOUT_LEDGER_ENTRIES");
    }
  });

  it("invalid path: rejects incomplete LedgerEntry representation", () => {
    const completePlan = createTransferLedgerEntryPlan(validatedTransfer);

    const incompletePlan = {
      ...completePlan,
      entries: [completePlan.entries[0], completePlan.entries[0]]
    } as unknown as TransferLedgerEntryPlan;

    const result = evaluateOperationCompleteness({
      transferId: "transfer_test_010_incomplete",
      transferState: "EXECUTED",
      ledgerEntryPlan: incompletePlan
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.sourceFailureId).toBe("FAIL-010");
      expect(result.reason).toBe("INCOMPLETE_LEDGER_ENTRY_REPRESENTATION");
    }
  });

  it("invalid path: rejects LedgerEntries without associated valid operation", () => {
    const result = evaluateOperationCompleteness({
      transferState: "EXECUTED",
      ledgerEntryPlan: createTransferLedgerEntryPlan(validatedTransfer)
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.sourceFailureId).toBe("FAIL-010");
      expect(result.reason).toBe("LEDGER_ENTRIES_WITHOUT_VALID_OPERATION");
    }
  });

  it("invalid path: rejects LedgerEntries for non-EXECUTED Transfer", () => {
    const result = evaluateOperationCompleteness({
      transferId: "transfer_test_010_failed_with_entries",
      transferState: "FAILED",
      ledgerEntryPlan: createTransferLedgerEntryPlan(validatedTransfer)
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.sourceFailureId).toBe("FAIL-010");
      expect(result.reason).toBe("LEDGER_ENTRIES_FOR_NON_EXECUTED_TRANSFER");
    }
  });
});
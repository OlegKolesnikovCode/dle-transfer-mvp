import {
  createTransferLedgerEntryPlan,
  isCompleteTransferLedgerEntryPlan,
  type TransferLedgerEntryPlan
} from "../src/domain/operations/transfer/transfer.ledger-entry-plan";
import type { ValidatedTransfer } from "../src/domain/operations/transfer/transfer.types";

/**
 * TEST-001 — Traceability Verification
 *
 * Source authority:
 * - L10__TEST_SPEC__VERIFICATION__SYSTEM.md
 *
 * Source references:
 * - TEST-001
 * - INV-001
 * - FAIL-001
 * - ARCH-005
 * - ARCH-006
 * - SCHEMA-004
 * - SCHEMA-005
 * - SCHEMA-006
 *
 * Valid-path observation:
 * - A validated Transfer produces a complete two-sided LedgerEntry plan.
 * - The source debit and destination credit both reference the same Asset and amount magnitude.
 *
 * Invalid-path observation:
 * - A malformed/incomplete LedgerEntry plan is not accepted as complete traceability proof.
 *
 * This test does not treat file existence, comments, logs, or compilation as proof.
 */

describe("TEST-001 — Traceability Verification", () => {
  const validatedTransfer: ValidatedTransfer = {
    requestIdentity: "req_test_001_traceability",
    sourceAccountId: "acct_source_demo",
    destinationAccountId: "acct_destination_demo",
    assetId: "asset_usd_atomic",
    amount: "100",
    state: "VALIDATED"
  };

  it("valid path: creates a complete LedgerEntry-backed explanation for a Transfer Balance Change", () => {
    const plan = createTransferLedgerEntryPlan(validatedTransfer);

    expect(plan.operation).toBe("Transfer");
    expect(plan.transferAssociationRequired).toBe(true);
    expect(plan.entries).toHaveLength(2);
    expect(isCompleteTransferLedgerEntryPlan(plan)).toBe(true);

    const [sourceEntry, destinationEntry] = plan.entries;

    expect(sourceEntry.accountId).toBe(validatedTransfer.sourceAccountId);
    expect(destinationEntry.accountId).toBe(
      validatedTransfer.destinationAccountId
    );

    expect(sourceEntry.assetId).toBe(validatedTransfer.assetId);
    expect(destinationEntry.assetId).toBe(validatedTransfer.assetId);

    expect(sourceEntry.direction).toBe("DEBIT");
    expect(destinationEntry.direction).toBe("CREDIT");

    expect(sourceEntry.amountMagnitude).toBe(validatedTransfer.amount);
    expect(destinationEntry.amountMagnitude).toBe(validatedTransfer.amount);

    expect(sourceEntry.amountDelta).toBe("-100");
    expect(destinationEntry.amountDelta).toBe("100");

    expect(sourceEntry.sourceReferences).toContain("INV-001");
    expect(sourceEntry.sourceReferences).toContain("FAIL-001");
    expect(destinationEntry.sourceReferences).toContain("INV-001");
    expect(destinationEntry.sourceReferences).toContain("FAIL-001");
  });

  it("invalid path: rejects an incomplete LedgerEntry plan as traceability proof", () => {
    const completePlan = createTransferLedgerEntryPlan(validatedTransfer);

    const incompletePlan = {
      ...completePlan,
      entries: [completePlan.entries[0], completePlan.entries[0]]
    } as unknown as TransferLedgerEntryPlan;

    expect(isCompleteTransferLedgerEntryPlan(incompletePlan)).toBe(false);
  });

  it("invalid path: rejects Asset mismatch in the LedgerEntry explanation", () => {
    const completePlan = createTransferLedgerEntryPlan(validatedTransfer);

    const assetMismatchPlan = {
      ...completePlan,
      entries: [
        completePlan.entries[0],
        {
          ...completePlan.entries[1],
          assetId: "asset_wrong"
        }
      ]
    } as unknown as TransferLedgerEntryPlan;

    expect(isCompleteTransferLedgerEntryPlan(assetMismatchPlan)).toBe(false);
  });
});
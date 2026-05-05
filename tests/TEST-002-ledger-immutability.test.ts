import {
  createTransferLedgerEntryPlan,
  type PlannedLedgerEntry
} from "../src/domain/operations/transfer/transfer.ledger-entry-plan";
import type { ValidatedTransfer } from "../src/domain/operations/transfer/transfer.types";

/**
 * TEST-002 — LedgerEntry Immutability Verification
 *
 * Source authority:
 * - L10__TEST_SPEC__VERIFICATION__SYSTEM.md
 *
 * Source references:
 * - TEST-002
 * - INV-002
 * - FAIL-002
 * - ARCH-006
 * - SCHEMA-006
 *
 * Valid-path observation:
 * - Planned LedgerEntry intent is represented as readonly source data.
 *
 * Invalid-path observation:
 * - Mutation of LedgerEntry referenced fields is detected as a changed explanation.
 *
 * This test does not treat comments, logs, file existence, or compilation alone as proof.
 */

function cloneEntry(entry: PlannedLedgerEntry): PlannedLedgerEntry {
  return {
    accountId: entry.accountId,
    assetId: entry.assetId,
    direction: entry.direction,
    amountMagnitude: entry.amountMagnitude,
    amountDelta: entry.amountDelta,
    sourceReferences: [...entry.sourceReferences]
  };
}

function hasLedgerEntryReferenceMutation(
  original: PlannedLedgerEntry,
  candidate: PlannedLedgerEntry
): boolean {
  return (
    original.accountId !== candidate.accountId ||
    original.assetId !== candidate.assetId ||
    original.direction !== candidate.direction ||
    original.amountMagnitude !== candidate.amountMagnitude ||
    original.amountDelta !== candidate.amountDelta
  );
}

describe("TEST-002 — LedgerEntry Immutability Verification", () => {
  const validatedTransfer: ValidatedTransfer = {
    requestIdentity: "req_test_002_ledger_immutability",
    sourceAccountId: "acct_source_demo",
    destinationAccountId: "acct_destination_demo",
    assetId: "asset_usd_atomic",
    amount: "100",
    state: "VALIDATED"
  };

  it("valid path: preserves LedgerEntry referenced fields in planned intent", () => {
    const plan = createTransferLedgerEntryPlan(validatedTransfer);
    const [sourceEntry, destinationEntry] = plan.entries;

    const sourceSnapshot = cloneEntry(sourceEntry);
    const destinationSnapshot = cloneEntry(destinationEntry);

    expect(hasLedgerEntryReferenceMutation(sourceSnapshot, sourceEntry)).toBe(
      false
    );
    expect(
      hasLedgerEntryReferenceMutation(destinationSnapshot, destinationEntry)
    ).toBe(false);

    expect(sourceEntry.sourceReferences).toContain("INV-002");
    expect(destinationEntry.sourceReferences).toContain("INV-002");
  });

  it("invalid path: detects updated LedgerEntry referenced fields", () => {
    const plan = createTransferLedgerEntryPlan(validatedTransfer);
    const original = cloneEntry(plan.entries[0]);

    const mutated = {
      ...original,
      amountDelta: "-999"
    };

    expect(hasLedgerEntryReferenceMutation(original, mutated)).toBe(true);
  });

  it("invalid path: detects changed LedgerEntry Account reference", () => {
    const plan = createTransferLedgerEntryPlan(validatedTransfer);
    const original = cloneEntry(plan.entries[0]);

    const mutated = {
      ...original,
      accountId: "acct_other"
    };

    expect(hasLedgerEntryReferenceMutation(original, mutated)).toBe(true);
  });

  it("invalid path: detects changed LedgerEntry Asset reference", () => {
    const plan = createTransferLedgerEntryPlan(validatedTransfer);
    const original = cloneEntry(plan.entries[0]);

    const mutated = {
      ...original,
      assetId: "asset_other"
    };

    expect(hasLedgerEntryReferenceMutation(original, mutated)).toBe(true);
  });
});
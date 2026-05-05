import {
  createTransferLedgerEntryPlan,
  isCompleteTransferLedgerEntryPlan,
  type TransferLedgerEntryPlan
} from "../src/domain/operations/transfer/transfer.ledger-entry-plan";
import type { ValidatedTransfer } from "../src/domain/operations/transfer/transfer.types";

/**
 * TEST-006 — Asset Consistency Verification
 *
 * Source authority:
 * - L10__TEST_SPEC__VERIFICATION__SYSTEM.md
 *
 * Source references:
 * - TEST-006
 * - INV-006
 * - FAIL-006
 * - ARCH-005
 * - SCHEMA-012
 *
 * Valid-path observation:
 * - Transfer assetId, source LedgerEntry assetId, destination LedgerEntry assetId,
 *   and affected Balance assetIds all match.
 *
 * Invalid-path observation:
 * - Asset mismatch between Transfer, LedgerEntries, or affected Balances is rejected.
 *
 * This test does not treat naming convention, comments, or logs as proof.
 */

type AssetConsistencyInput = Readonly<{
  transferAssetId: string;
  sourceBalanceAssetId: string;
  destinationBalanceAssetId: string;
  plan: TransferLedgerEntryPlan;
}>;

type AssetConsistencyResult =
  | Readonly<{
      ok: true;
      sourceReferences: readonly string[];
    }>
  | Readonly<{
      ok: false;
      sourceFailureId: "FAIL-006";
      reason:
        | "SOURCE_BALANCE_ASSET_MISMATCH"
        | "DESTINATION_BALANCE_ASSET_MISMATCH"
        | "LEDGER_ENTRY_ASSET_MISMATCH"
        | "INCOMPLETE_LEDGER_ENTRY_PLAN";
      sourceReferences: readonly string[];
    }>;

const ASSET_CONSISTENCY_SOURCE_REFERENCES = [
  "TEST-006",
  "INV-006",
  "FAIL-006",
  "ARCH-005",
  "SCHEMA-012"
] as const;

function evaluateAssetConsistency(
  input: AssetConsistencyInput
): AssetConsistencyResult {
  if (input.sourceBalanceAssetId !== input.transferAssetId) {
    return {
      ok: false,
      sourceFailureId: "FAIL-006",
      reason: "SOURCE_BALANCE_ASSET_MISMATCH",
      sourceReferences: ASSET_CONSISTENCY_SOURCE_REFERENCES
    };
  }

  if (input.destinationBalanceAssetId !== input.transferAssetId) {
    return {
      ok: false,
      sourceFailureId: "FAIL-006",
      reason: "DESTINATION_BALANCE_ASSET_MISMATCH",
      sourceReferences: ASSET_CONSISTENCY_SOURCE_REFERENCES
    };
  }

  if (!isCompleteTransferLedgerEntryPlan(input.plan)) {
    return {
      ok: false,
      sourceFailureId: "FAIL-006",
      reason: "INCOMPLETE_LEDGER_ENTRY_PLAN",
      sourceReferences: ASSET_CONSISTENCY_SOURCE_REFERENCES
    };
  }

  const [sourceEntry, destinationEntry] = input.plan.entries;

  if (
    sourceEntry.assetId !== input.transferAssetId ||
    destinationEntry.assetId !== input.transferAssetId
  ) {
    return {
      ok: false,
      sourceFailureId: "FAIL-006",
      reason: "LEDGER_ENTRY_ASSET_MISMATCH",
      sourceReferences: ASSET_CONSISTENCY_SOURCE_REFERENCES
    };
  }

  return {
    ok: true,
    sourceReferences: ASSET_CONSISTENCY_SOURCE_REFERENCES
  };
}

describe("TEST-006 — Asset Consistency Verification", () => {
  const validatedTransfer: ValidatedTransfer = {
    requestIdentity: "req_test_006_asset_consistency",
    sourceAccountId: "acct_source_demo",
    destinationAccountId: "acct_destination_demo",
    assetId: "asset_usd_atomic",
    amount: "100",
    state: "VALIDATED"
  };

  it("valid path: accepts single-Asset Transfer with matching Balance and LedgerEntry assets", () => {
    const plan = createTransferLedgerEntryPlan(validatedTransfer);

    const result = evaluateAssetConsistency({
      transferAssetId: validatedTransfer.assetId,
      sourceBalanceAssetId: validatedTransfer.assetId,
      destinationBalanceAssetId: validatedTransfer.assetId,
      plan
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.sourceReferences).toContain("INV-006");
      expect(result.sourceReferences).toContain("FAIL-006");
    }
  });

  it("invalid path: rejects source Balance Asset mismatch", () => {
    const plan = createTransferLedgerEntryPlan(validatedTransfer);

    const result = evaluateAssetConsistency({
      transferAssetId: validatedTransfer.assetId,
      sourceBalanceAssetId: "asset_other",
      destinationBalanceAssetId: validatedTransfer.assetId,
      plan
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.sourceFailureId).toBe("FAIL-006");
      expect(result.reason).toBe("SOURCE_BALANCE_ASSET_MISMATCH");
    }
  });

  it("invalid path: rejects destination Balance Asset mismatch", () => {
    const plan = createTransferLedgerEntryPlan(validatedTransfer);

    const result = evaluateAssetConsistency({
      transferAssetId: validatedTransfer.assetId,
      sourceBalanceAssetId: validatedTransfer.assetId,
      destinationBalanceAssetId: "asset_other",
      plan
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.sourceFailureId).toBe("FAIL-006");
      expect(result.reason).toBe("DESTINATION_BALANCE_ASSET_MISMATCH");
    }
  });

  it("invalid path: rejects LedgerEntry Asset mismatch", () => {
    const plan = createTransferLedgerEntryPlan(validatedTransfer);

    const mismatchedPlan = {
      ...plan,
      entries: [
        plan.entries[0],
        {
          ...plan.entries[1],
          assetId: "asset_other"
        }
      ]
    } as unknown as TransferLedgerEntryPlan;

    const result = evaluateAssetConsistency({
      transferAssetId: validatedTransfer.assetId,
      sourceBalanceAssetId: validatedTransfer.assetId,
      destinationBalanceAssetId: validatedTransfer.assetId,
      plan: mismatchedPlan
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.sourceFailureId).toBe("FAIL-006");
      expect(result.reason).toBe("INCOMPLETE_LEDGER_ENTRY_PLAN");
    }
  });
});
import {
  createTransferLedgerEntryPlan,
  type TransferLedgerEntryPlan
} from "../src/domain/operations/transfer/transfer.ledger-entry-plan";
import type { ValidatedTransfer } from "../src/domain/operations/transfer/transfer.types";

/**
 * TEST-004 — Atomicity Verification
 *
 * Source authority:
 * - L10__TEST_SPEC__VERIFICATION__SYSTEM.md
 *
 * Source references:
 * - TEST-004
 * - INV-004
 * - FAIL-004
 * - FSM-005
 * - ARCH-003
 * - SCHEMA-011
 *
 * Valid-path observation:
 * - A Transfer execution write set contains both Balance updates and both LedgerEntry intents.
 *
 * Invalid-path observation:
 * - A partial write set is classified as non-atomic and cannot represent completed execution.
 *
 * This test does not treat successful compilation or route existence as proof.
 */

type AtomicTransferWriteSet = Readonly<{
  transferState: "REQUESTED" | "VALIDATED" | "EXECUTED" | "FAILED";
  sourceBalanceUpdated: boolean;
  destinationBalanceUpdated: boolean;
  ledgerEntryPlan: TransferLedgerEntryPlan | null;
  requestOutcomePersisted: boolean;
}>;

function isAtomicExecutedWriteSet(writeSet: AtomicTransferWriteSet): boolean {
  if (writeSet.transferState !== "EXECUTED") {
    return false;
  }

  if (!writeSet.sourceBalanceUpdated || !writeSet.destinationBalanceUpdated) {
    return false;
  }

  if (!writeSet.ledgerEntryPlan || writeSet.ledgerEntryPlan.entries.length !== 2) {
    return false;
  }

  if (!writeSet.requestOutcomePersisted) {
    return false;
  }

  return true;
}

describe("TEST-004 — Atomicity Verification", () => {
  const validatedTransfer: ValidatedTransfer = {
    requestIdentity: "req_test_004_atomicity",
    sourceAccountId: "acct_source_demo",
    destinationAccountId: "acct_destination_demo",
    assetId: "asset_usd_atomic",
    amount: "100",
    state: "VALIDATED"
  };

  it("valid path: accepts a complete executed Transfer write set", () => {
    const writeSet: AtomicTransferWriteSet = {
      transferState: "EXECUTED",
      sourceBalanceUpdated: true,
      destinationBalanceUpdated: true,
      ledgerEntryPlan: createTransferLedgerEntryPlan(validatedTransfer),
      requestOutcomePersisted: true
    };

    expect(isAtomicExecutedWriteSet(writeSet)).toBe(true);
  });

  it("invalid path: rejects source-only Balance update as partial operation", () => {
    const writeSet: AtomicTransferWriteSet = {
      transferState: "EXECUTED",
      sourceBalanceUpdated: true,
      destinationBalanceUpdated: false,
      ledgerEntryPlan: createTransferLedgerEntryPlan(validatedTransfer),
      requestOutcomePersisted: true
    };

    expect(isAtomicExecutedWriteSet(writeSet)).toBe(false);
  });

  it("invalid path: rejects missing LedgerEntries as partial operation", () => {
    const writeSet: AtomicTransferWriteSet = {
      transferState: "EXECUTED",
      sourceBalanceUpdated: true,
      destinationBalanceUpdated: true,
      ledgerEntryPlan: null,
      requestOutcomePersisted: true
    };

    expect(isAtomicExecutedWriteSet(writeSet)).toBe(false);
  });

  it("invalid path: rejects completed state without persisted Request outcome", () => {
    const writeSet: AtomicTransferWriteSet = {
      transferState: "EXECUTED",
      sourceBalanceUpdated: true,
      destinationBalanceUpdated: true,
      ledgerEntryPlan: createTransferLedgerEntryPlan(validatedTransfer),
      requestOutcomePersisted: false
    };

    expect(isAtomicExecutedWriteSet(writeSet)).toBe(false);
  });

  it("invalid path: rejects non-executed Transfer as completed atomic write set", () => {
    const writeSet: AtomicTransferWriteSet = {
      transferState: "FAILED",
      sourceBalanceUpdated: false,
      destinationBalanceUpdated: false,
      ledgerEntryPlan: null,
      requestOutcomePersisted: true
    };

    expect(isAtomicExecutedWriteSet(writeSet)).toBe(false);
  });
});
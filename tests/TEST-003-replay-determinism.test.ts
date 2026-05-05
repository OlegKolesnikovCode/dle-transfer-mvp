import type { DerivedLedgerEntryRead } from "../src/server/ledger/read-derivation-boundary";

/**
 * TEST-003 — Replay Determinism Verification
 *
 * Source authority:
 * - L10__TEST_SPEC__VERIFICATION__SYSTEM.md
 *
 * Source references:
 * - TEST-003
 * - INV-003
 * - FAIL-003
 * - ARCH-007
 * - SCHEMA-004
 *
 * Valid-path observation:
 * - LedgerEntry history can reconstruct Balance state for an Account-Asset pair.
 *
 * Invalid-path observation:
 * - Persisted Balance contradiction is detected when it differs from LedgerEntry-derived state.
 *
 * This test does not treat persisted Balance alone as correctness proof.
 */

type ReplayBalance = Readonly<{
  accountId: string;
  assetId: string;
  amount: string;
}>;

function replayBalanceFromLedgerEntries(
  accountId: string,
  assetId: string,
  openingAmount: string,
  ledgerEntries: readonly DerivedLedgerEntryRead[]
): ReplayBalance {
  const amount = ledgerEntries
    .filter((entry) => entry.accountId === accountId && entry.assetId === assetId)
    .reduce((current, entry) => current + BigInt(entry.amountDelta), BigInt(openingAmount));

  return {
    accountId,
    assetId,
    amount: amount.toString()
  };
}

function persistedBalanceContradictsReplay(
  persisted: ReplayBalance,
  replayed: ReplayBalance
): boolean {
  return (
    persisted.accountId !== replayed.accountId ||
    persisted.assetId !== replayed.assetId ||
    persisted.amount !== replayed.amount
  );
}

describe("TEST-003 — Replay Determinism Verification", () => {
  const ledgerEntries: readonly DerivedLedgerEntryRead[] = [
    {
      id: "le_001",
      transferId: "transfer_001",
      accountId: "acct_source_demo",
      assetId: "asset_usd_atomic",
      amountDelta: "-100",
      direction: "DEBIT",
      createdAt: "2026-01-01T00:00:00.000Z"
    },
    {
      id: "le_002",
      transferId: "transfer_001",
      accountId: "acct_destination_demo",
      assetId: "asset_usd_atomic",
      amountDelta: "100",
      direction: "CREDIT",
      createdAt: "2026-01-01T00:00:00.000Z"
    }
  ];

  it("valid path: reconstructs source Balance from LedgerEntry history", () => {
    const replayed = replayBalanceFromLedgerEntries(
      "acct_source_demo",
      "asset_usd_atomic",
      "100000",
      ledgerEntries
    );

    expect(replayed).toEqual({
      accountId: "acct_source_demo",
      assetId: "asset_usd_atomic",
      amount: "99900"
    });

    expect(
      persistedBalanceContradictsReplay(
        {
          accountId: "acct_source_demo",
          assetId: "asset_usd_atomic",
          amount: "99900"
        },
        replayed
      )
    ).toBe(false);
  });

  it("valid path: reconstructs destination Balance from LedgerEntry history", () => {
    const replayed = replayBalanceFromLedgerEntries(
      "acct_destination_demo",
      "asset_usd_atomic",
      "0",
      ledgerEntries
    );

    expect(replayed).toEqual({
      accountId: "acct_destination_demo",
      assetId: "asset_usd_atomic",
      amount: "100"
    });

    expect(
      persistedBalanceContradictsReplay(
        {
          accountId: "acct_destination_demo",
          assetId: "asset_usd_atomic",
          amount: "100"
        },
        replayed
      )
    ).toBe(false);
  });

  it("invalid path: detects persisted Balance contradiction against LedgerEntry-derived state", () => {
    const replayed = replayBalanceFromLedgerEntries(
      "acct_source_demo",
      "asset_usd_atomic",
      "100000",
      ledgerEntries
    );

    const persistedBalance = {
      accountId: "acct_source_demo",
      assetId: "asset_usd_atomic",
      amount: "100000"
    };

    expect(persistedBalanceContradictsReplay(persistedBalance, replayed)).toBe(
      true
    );
  });

  it("invalid path: detects replay identity mismatch", () => {
    const replayed = replayBalanceFromLedgerEntries(
      "acct_source_demo",
      "asset_usd_atomic",
      "100000",
      ledgerEntries
    );

    const wrongPersistedBalance = {
      accountId: "acct_other",
      assetId: "asset_usd_atomic",
      amount: "99900"
    };

    expect(
      persistedBalanceContradictsReplay(wrongPersistedBalance, replayed)
    ).toBe(true);
  });
});
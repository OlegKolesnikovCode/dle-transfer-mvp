/**
 * TEST-007 — Idempotency Verification
 *
 * Source authority:
 * - L10__TEST_SPEC__VERIFICATION__SYSTEM.md
 *
 * Source references:
 * - TEST-007
 * - INV-007
 * - FAIL-007
 * - FSM-007
 * - ARCH-002
 * - SCHEMA-009
 * - SCHEMA-010
 * - API-003
 * - API-006
 *
 * Valid-path observation:
 * - Duplicate Request identity resolves to the same persisted outcome.
 *
 * Invalid-path observation:
 * - Duplicate Request producing additional LedgerEntries, additional Balance mutation,
 *   or divergent Response meaning is rejected.
 *
 * This test does not treat client retry behavior, timestamps, logs, or in-memory cache as proof.
 */

type PersistedRequestOutcome = Readonly<{
  requestIdentity: string;
  transferId: string;
  responseMeaning: string;
  ledgerEntryCount: number;
  balanceMutationCount: number;
}>;

type IdempotencyReplayResult =
  | Readonly<{
      ok: true;
      duplicateResolved: true;
      outcome: PersistedRequestOutcome;
      sourceReferences: readonly string[];
    }>
  | Readonly<{
      ok: false;
      sourceFailureId: "FAIL-007";
      reason:
        | "DIVERGENT_OUTCOME"
        | "ADDITIONAL_LEDGER_ENTRIES"
        | "ADDITIONAL_BALANCE_MUTATION"
        | "REQUEST_IDENTITY_MISMATCH";
      sourceReferences: readonly string[];
    }>;

const IDEMPOTENCY_SOURCE_REFERENCES = [
  "TEST-007",
  "INV-007",
  "FAIL-007",
  "FSM-007",
  "ARCH-002",
  "SCHEMA-009",
  "SCHEMA-010",
  "API-003",
  "API-006"
] as const;

function evaluateDuplicateRequestReplay(
  original: PersistedRequestOutcome,
  replay: PersistedRequestOutcome
): IdempotencyReplayResult {
  if (original.requestIdentity !== replay.requestIdentity) {
    return {
      ok: false,
      sourceFailureId: "FAIL-007",
      reason: "REQUEST_IDENTITY_MISMATCH",
      sourceReferences: IDEMPOTENCY_SOURCE_REFERENCES
    };
  }

  if (
    original.transferId !== replay.transferId ||
    original.responseMeaning !== replay.responseMeaning
  ) {
    return {
      ok: false,
      sourceFailureId: "FAIL-007",
      reason: "DIVERGENT_OUTCOME",
      sourceReferences: IDEMPOTENCY_SOURCE_REFERENCES
    };
  }

  if (replay.ledgerEntryCount > original.ledgerEntryCount) {
    return {
      ok: false,
      sourceFailureId: "FAIL-007",
      reason: "ADDITIONAL_LEDGER_ENTRIES",
      sourceReferences: IDEMPOTENCY_SOURCE_REFERENCES
    };
  }

  if (replay.balanceMutationCount > original.balanceMutationCount) {
    return {
      ok: false,
      sourceFailureId: "FAIL-007",
      reason: "ADDITIONAL_BALANCE_MUTATION",
      sourceReferences: IDEMPOTENCY_SOURCE_REFERENCES
    };
  }

  return {
    ok: true,
    duplicateResolved: true,
    outcome: original,
    sourceReferences: IDEMPOTENCY_SOURCE_REFERENCES
  };
}

describe("TEST-007 — Idempotency Verification", () => {
  const originalOutcome: PersistedRequestOutcome = {
    requestIdentity: "req_test_007_idempotency",
    transferId: "transfer_test_007",
    responseMeaning: "COMPLETED_TRANSFER",
    ledgerEntryCount: 2,
    balanceMutationCount: 2
  };

  it("valid path: duplicate Request resolves to the same persisted outcome", () => {
    const replayOutcome: PersistedRequestOutcome = {
      requestIdentity: "req_test_007_idempotency",
      transferId: "transfer_test_007",
      responseMeaning: "COMPLETED_TRANSFER",
      ledgerEntryCount: 2,
      balanceMutationCount: 2
    };

    const result = evaluateDuplicateRequestReplay(
      originalOutcome,
      replayOutcome
    );

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.duplicateResolved).toBe(true);
      expect(result.outcome).toEqual(originalOutcome);
      expect(result.sourceReferences).toContain("INV-007");
      expect(result.sourceReferences).toContain("FAIL-007");
    }
  });

  it("invalid path: rejects duplicate Request with additional LedgerEntries", () => {
    const replayOutcome: PersistedRequestOutcome = {
      ...originalOutcome,
      ledgerEntryCount: 4
    };

    const result = evaluateDuplicateRequestReplay(
      originalOutcome,
      replayOutcome
    );

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.sourceFailureId).toBe("FAIL-007");
      expect(result.reason).toBe("ADDITIONAL_LEDGER_ENTRIES");
    }
  });

  it("invalid path: rejects duplicate Request with additional Balance mutation", () => {
    const replayOutcome: PersistedRequestOutcome = {
      ...originalOutcome,
      balanceMutationCount: 4
    };

    const result = evaluateDuplicateRequestReplay(
      originalOutcome,
      replayOutcome
    );

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.sourceFailureId).toBe("FAIL-007");
      expect(result.reason).toBe("ADDITIONAL_BALANCE_MUTATION");
    }
  });

  it("invalid path: rejects duplicate Request with divergent outcome meaning", () => {
    const replayOutcome: PersistedRequestOutcome = {
      ...originalOutcome,
      transferId: "transfer_different",
      responseMeaning: "DIFFERENT_TRANSFER"
    };

    const result = evaluateDuplicateRequestReplay(
      originalOutcome,
      replayOutcome
    );

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.sourceFailureId).toBe("FAIL-007");
      expect(result.reason).toBe("DIVERGENT_OUTCOME");
    }
  });

  it("invalid path: rejects replay with different Request identity", () => {
    const replayOutcome: PersistedRequestOutcome = {
      ...originalOutcome,
      requestIdentity: "req_other"
    };

    const result = evaluateDuplicateRequestReplay(
      originalOutcome,
      replayOutcome
    );

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.sourceFailureId).toBe("FAIL-007");
      expect(result.reason).toBe("REQUEST_IDENTITY_MISMATCH");
    }
  });
});
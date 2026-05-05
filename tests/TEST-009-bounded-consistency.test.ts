/**
 * TEST-009 — Bounded Consistency Verification
 *
 * Source authority:
 * - L10__TEST_SPEC__VERIFICATION__SYSTEM.md
 *
 * Source references:
 * - TEST-009
 * - INV-009
 * - FAIL-009
 * - L00 SYSTEM BOUNDARY
 * - ARCH-003
 * - ARCH-009
 * - SCHEMA-013
 * - API-013
 *
 * Valid-path observation:
 * - Transfer correctness depends only on the local bounded execution context.
 *
 * Invalid-path observation:
 * - External settlement, distributed coordination, event-stream correctness,
 *   or eventual consistency dependency is rejected.
 *
 * This test does not treat database choice, timestamps, logs, or runtime success as proof.
 */

type BoundedConsistencyDependency = Readonly<{
  localConsistencyBoundary: boolean;
  localPersistence: boolean;
  externalSettlementRequired: boolean;
  distributedCoordinationRequired: boolean;
  eventualConsistencyRequired: boolean;
  blockchainConsensusRequired: boolean;
  eventStreamCorrectnessRequired: boolean;
}>;

type BoundedConsistencyResult =
  | Readonly<{
      ok: true;
      sourceReferences: readonly string[];
    }>
  | Readonly<{
      ok: false;
      sourceFailureId: "FAIL-009";
      reason:
        | "MISSING_LOCAL_CONSISTENCY_BOUNDARY"
        | "MISSING_LOCAL_PERSISTENCE"
        | "EXTERNAL_SETTLEMENT_DEPENDENCY"
        | "DISTRIBUTED_COORDINATION_DEPENDENCY"
        | "EVENTUAL_CONSISTENCY_DEPENDENCY"
        | "BLOCKCHAIN_CONSENSUS_DEPENDENCY"
        | "EVENT_STREAM_CORRECTNESS_DEPENDENCY";
      sourceReferences: readonly string[];
    }>;

const BOUNDED_CONSISTENCY_SOURCE_REFERENCES = [
  "TEST-009",
  "INV-009",
  "FAIL-009",
  "L00 SYSTEM BOUNDARY",
  "ARCH-003",
  "ARCH-009",
  "SCHEMA-013",
  "API-013"
] as const;

function evaluateBoundedConsistency(
  dependency: BoundedConsistencyDependency
): BoundedConsistencyResult {
  if (!dependency.localConsistencyBoundary) {
    return {
      ok: false,
      sourceFailureId: "FAIL-009",
      reason: "MISSING_LOCAL_CONSISTENCY_BOUNDARY",
      sourceReferences: BOUNDED_CONSISTENCY_SOURCE_REFERENCES
    };
  }

  if (!dependency.localPersistence) {
    return {
      ok: false,
      sourceFailureId: "FAIL-009",
      reason: "MISSING_LOCAL_PERSISTENCE",
      sourceReferences: BOUNDED_CONSISTENCY_SOURCE_REFERENCES
    };
  }

  if (dependency.externalSettlementRequired) {
    return {
      ok: false,
      sourceFailureId: "FAIL-009",
      reason: "EXTERNAL_SETTLEMENT_DEPENDENCY",
      sourceReferences: BOUNDED_CONSISTENCY_SOURCE_REFERENCES
    };
  }

  if (dependency.distributedCoordinationRequired) {
    return {
      ok: false,
      sourceFailureId: "FAIL-009",
      reason: "DISTRIBUTED_COORDINATION_DEPENDENCY",
      sourceReferences: BOUNDED_CONSISTENCY_SOURCE_REFERENCES
    };
  }

  if (dependency.eventualConsistencyRequired) {
    return {
      ok: false,
      sourceFailureId: "FAIL-009",
      reason: "EVENTUAL_CONSISTENCY_DEPENDENCY",
      sourceReferences: BOUNDED_CONSISTENCY_SOURCE_REFERENCES
    };
  }

  if (dependency.blockchainConsensusRequired) {
    return {
      ok: false,
      sourceFailureId: "FAIL-009",
      reason: "BLOCKCHAIN_CONSENSUS_DEPENDENCY",
      sourceReferences: BOUNDED_CONSISTENCY_SOURCE_REFERENCES
    };
  }

  if (dependency.eventStreamCorrectnessRequired) {
    return {
      ok: false,
      sourceFailureId: "FAIL-009",
      reason: "EVENT_STREAM_CORRECTNESS_DEPENDENCY",
      sourceReferences: BOUNDED_CONSISTENCY_SOURCE_REFERENCES
    };
  }

  return {
    ok: true,
    sourceReferences: BOUNDED_CONSISTENCY_SOURCE_REFERENCES
  };
}

describe("TEST-009 — Bounded Consistency Verification", () => {
  it("valid path: accepts local bounded consistency dependencies only", () => {
    const result = evaluateBoundedConsistency({
      localConsistencyBoundary: true,
      localPersistence: true,
      externalSettlementRequired: false,
      distributedCoordinationRequired: false,
      eventualConsistencyRequired: false,
      blockchainConsensusRequired: false,
      eventStreamCorrectnessRequired: false
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.sourceReferences).toContain("INV-009");
      expect(result.sourceReferences).toContain("FAIL-009");
      expect(result.sourceReferences).toContain("ARCH-003");
    }
  });

  it("invalid path: rejects external settlement correctness dependency", () => {
    const result = evaluateBoundedConsistency({
      localConsistencyBoundary: true,
      localPersistence: true,
      externalSettlementRequired: true,
      distributedCoordinationRequired: false,
      eventualConsistencyRequired: false,
      blockchainConsensusRequired: false,
      eventStreamCorrectnessRequired: false
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.sourceFailureId).toBe("FAIL-009");
      expect(result.reason).toBe("EXTERNAL_SETTLEMENT_DEPENDENCY");
    }
  });

  it("invalid path: rejects distributed coordination correctness dependency", () => {
    const result = evaluateBoundedConsistency({
      localConsistencyBoundary: true,
      localPersistence: true,
      externalSettlementRequired: false,
      distributedCoordinationRequired: true,
      eventualConsistencyRequired: false,
      blockchainConsensusRequired: false,
      eventStreamCorrectnessRequired: false
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.sourceFailureId).toBe("FAIL-009");
      expect(result.reason).toBe("DISTRIBUTED_COORDINATION_DEPENDENCY");
    }
  });

  it("invalid path: rejects eventual consistency for Balance correctness", () => {
    const result = evaluateBoundedConsistency({
      localConsistencyBoundary: true,
      localPersistence: true,
      externalSettlementRequired: false,
      distributedCoordinationRequired: false,
      eventualConsistencyRequired: true,
      blockchainConsensusRequired: false,
      eventStreamCorrectnessRequired: false
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.sourceFailureId).toBe("FAIL-009");
      expect(result.reason).toBe("EVENTUAL_CONSISTENCY_DEPENDENCY");
    }
  });

  it("invalid path: rejects blockchain consensus dependency", () => {
    const result = evaluateBoundedConsistency({
      localConsistencyBoundary: true,
      localPersistence: true,
      externalSettlementRequired: false,
      distributedCoordinationRequired: false,
      eventualConsistencyRequired: false,
      blockchainConsensusRequired: true,
      eventStreamCorrectnessRequired: false
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.sourceFailureId).toBe("FAIL-009");
      expect(result.reason).toBe("BLOCKCHAIN_CONSENSUS_DEPENDENCY");
    }
  });

  it("invalid path: rejects missing local Consistency Boundary", () => {
    const result = evaluateBoundedConsistency({
      localConsistencyBoundary: false,
      localPersistence: true,
      externalSettlementRequired: false,
      distributedCoordinationRequired: false,
      eventualConsistencyRequired: false,
      blockchainConsensusRequired: false,
      eventStreamCorrectnessRequired: false
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.sourceFailureId).toBe("FAIL-009");
      expect(result.reason).toBe("MISSING_LOCAL_CONSISTENCY_BOUNDARY");
    }
  });
});
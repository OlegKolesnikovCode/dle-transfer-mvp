import Decimal from "decimal.js";

/**
 * TEST-005 — Balance Constraint Verification
 *
 * Source authority:
 * - L10__TEST_SPEC__VERIFICATION__SYSTEM.md
 *
 * Source references:
 * - TEST-005
 * - INV-005
 * - FAIL-005
 * - ARCH-005
 * - SCHEMA-003
 *
 * Valid-path observation:
 * - A Transfer amount that preserves non-negative source Balance is accepted by Balance constraint logic.
 *
 * Invalid-path observation:
 * - A Transfer amount that would produce negative source Balance is rejected.
 *
 * This test does not treat persisted Balance alone as proof.
 */

type BalanceConstraintInput = Readonly<{
  sourceBalanceBefore: string;
  destinationBalanceBefore: string;
  amount: string;
}>;

type BalanceConstraintResult =
  | Readonly<{
      ok: true;
      sourceBalanceAfter: string;
      destinationBalanceAfter: string;
      sourceReferences: readonly string[];
    }>
  | Readonly<{
      ok: false;
      sourceFailureId: "FAIL-005";
      reason: "NEGATIVE_SOURCE_BALANCE" | "INVALID_AMOUNT";
      sourceReferences: readonly string[];
    }>;

const BALANCE_CONSTRAINT_SOURCE_REFERENCES = [
  "TEST-005",
  "INV-005",
  "FAIL-005",
  "ARCH-005",
  "SCHEMA-003"
] as const;

function isPositiveAtomicAmount(value: string): boolean {
  return /^[1-9][0-9]*$/.test(value);
}

function evaluateBalanceConstraint(
  input: BalanceConstraintInput
): BalanceConstraintResult {
  if (!isPositiveAtomicAmount(input.amount)) {
    return {
      ok: false,
      sourceFailureId: "FAIL-005",
      reason: "INVALID_AMOUNT",
      sourceReferences: BALANCE_CONSTRAINT_SOURCE_REFERENCES
    };
  }

  const amount = new Decimal(input.amount);
  const sourceBefore = new Decimal(input.sourceBalanceBefore);
  const destinationBefore = new Decimal(input.destinationBalanceBefore);

  const sourceAfter = sourceBefore.minus(amount);
  const destinationAfter = destinationBefore.plus(amount);

  if (sourceAfter.isNegative()) {
    return {
      ok: false,
      sourceFailureId: "FAIL-005",
      reason: "NEGATIVE_SOURCE_BALANCE",
      sourceReferences: BALANCE_CONSTRAINT_SOURCE_REFERENCES
    };
  }

  return {
    ok: true,
    sourceBalanceAfter: sourceAfter.toFixed(0),
    destinationBalanceAfter: destinationAfter.toFixed(0),
    sourceReferences: BALANCE_CONSTRAINT_SOURCE_REFERENCES
  };
}

describe("TEST-005 — Balance Constraint Verification", () => {
  it("valid path: accepts Transfer that preserves non-negative source Balance", () => {
    const result = evaluateBalanceConstraint({
      sourceBalanceBefore: "100000",
      destinationBalanceBefore: "0",
      amount: "100"
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.sourceBalanceAfter).toBe("99900");
      expect(result.destinationBalanceAfter).toBe("100");
      expect(result.sourceReferences).toContain("INV-005");
      expect(result.sourceReferences).toContain("FAIL-005");
    }
  });

  it("valid path: accepts Transfer that reduces source Balance exactly to zero", () => {
    const result = evaluateBalanceConstraint({
      sourceBalanceBefore: "100",
      destinationBalanceBefore: "0",
      amount: "100"
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.sourceBalanceAfter).toBe("0");
      expect(result.destinationBalanceAfter).toBe("100");
    }
  });

  it("invalid path: rejects Transfer that would create negative source Balance", () => {
    const result = evaluateBalanceConstraint({
      sourceBalanceBefore: "99",
      destinationBalanceBefore: "0",
      amount: "100"
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.sourceFailureId).toBe("FAIL-005");
      expect(result.reason).toBe("NEGATIVE_SOURCE_BALANCE");
      expect(result.sourceReferences).toContain("INV-005");
    }
  });

  it("invalid path: rejects zero amount as invalid Balance-affecting amount", () => {
    const result = evaluateBalanceConstraint({
      sourceBalanceBefore: "100",
      destinationBalanceBefore: "0",
      amount: "0"
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.sourceFailureId).toBe("FAIL-005");
      expect(result.reason).toBe("INVALID_AMOUNT");
    }
  });

  it("invalid path: rejects non-integer amount representation", () => {
    const result = evaluateBalanceConstraint({
      sourceBalanceBefore: "100",
      destinationBalanceBefore: "0",
      amount: "1.5"
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.sourceFailureId).toBe("FAIL-005");
      expect(result.reason).toBe("INVALID_AMOUNT");
    }
  });
});
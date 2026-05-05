import {
  evaluateTransferTransition,
  isTerminalTransferState,
  isTransferState,
  isValidTransferTransition,
  TRANSFER_STATES,
  VALID_TRANSFER_TRANSITIONS
} from "../src/domain/operations/transfer/transfer.lifecycle";
import type { TransferState } from "../src/domain/operations/transfer/transfer.types";

/**
 * TEST-008 — Lifecycle Governance Verification
 *
 * Source authority:
 * - L10__TEST_SPEC__VERIFICATION__SYSTEM.md
 *
 * Source references:
 * - TEST-008
 * - INV-008
 * - FAIL-008
 * - FSM-001 through FSM-010
 * - ARCH-004
 * - API-007
 * - AUTHZ-006
 * - AUTHZ-011
 *
 * Valid-path observation:
 * - Only L05-defined Transfer states and transitions are accepted.
 *
 * Invalid-path observation:
 * - Undefined states, invalid transitions, and terminal-state exits are rejected.
 *
 * This test does not treat lifecycle naming, comments, or route existence as proof.
 */

describe("TEST-008 — Lifecycle Governance Verification", () => {
  it("valid path: exposes exactly the L05 Transfer state set", () => {
    expect(TRANSFER_STATES).toEqual([
      "REQUESTED",
      "VALIDATED",
      "EXECUTED",
      "FAILED"
    ]);

    for (const state of TRANSFER_STATES) {
      expect(isTransferState(state)).toBe(true);
    }

    expect(isTransferState("PENDING")).toBe(false);
    expect(isTransferState("APPROVED")).toBe(false);
    expect(isTransferState("SETTLED")).toBe(false);
  });

  it("valid path: accepts only explicitly defined L05 transitions", () => {
    expect(VALID_TRANSFER_TRANSITIONS).toEqual([
      { from: "REQUESTED", to: "VALIDATED" },
      { from: "REQUESTED", to: "FAILED" },
      { from: "VALIDATED", to: "EXECUTED" },
      { from: "VALIDATED", to: "FAILED" }
    ]);

    expect(isValidTransferTransition("REQUESTED", "VALIDATED")).toBe(true);
    expect(isValidTransferTransition("REQUESTED", "FAILED")).toBe(true);
    expect(isValidTransferTransition("VALIDATED", "EXECUTED")).toBe(true);
    expect(isValidTransferTransition("VALIDATED", "FAILED")).toBe(true);
  });

  it("valid path: approves REQUESTED -> VALIDATED", () => {
    const decision = evaluateTransferTransition("REQUESTED", "VALIDATED");

    expect(decision.ok).toBe(true);

    if (decision.ok) {
      expect(decision.transition).toEqual({
        from: "REQUESTED",
        to: "VALIDATED"
      });
      expect(decision.sourceReferences).toContain("INV-008");
      expect(decision.sourceReferences).toContain("FSM-002");
    }
  });

  it("valid path: approves VALIDATED -> EXECUTED", () => {
    const decision = evaluateTransferTransition("VALIDATED", "EXECUTED");

    expect(decision.ok).toBe(true);

    if (decision.ok) {
      expect(decision.transition).toEqual({
        from: "VALIDATED",
        to: "EXECUTED"
      });
    }
  });

  it("invalid path: rejects undefined lifecycle state", () => {
    const decision = evaluateTransferTransition("PENDING", "EXECUTED");

    expect(decision.ok).toBe(false);

    if (!decision.ok) {
      expect(decision.sourceFailureId).toBe("FAIL-008");
      expect(decision.reason).toBe("UNDEFINED_STATE");
      expect(decision.sourceReferences).toContain("FAIL-008");
      expect(decision.sourceReferences).toContain("INV-008");
    }
  });

  it("invalid path: rejects transition not explicitly defined as valid", () => {
    const decision = evaluateTransferTransition("REQUESTED", "EXECUTED");

    expect(decision.ok).toBe(false);

    if (!decision.ok) {
      expect(decision.sourceFailureId).toBe("FAIL-008");
      expect(decision.reason).toBe("INVALID_TRANSITION");
    }
  });

  it("invalid path: rejects transition from terminal EXECUTED state", () => {
    const terminalState: TransferState = "EXECUTED";

    expect(isTerminalTransferState(terminalState)).toBe(true);

    const decision = evaluateTransferTransition("EXECUTED", "FAILED");

    expect(decision.ok).toBe(false);

    if (!decision.ok) {
      expect(decision.sourceFailureId).toBe("FAIL-008");
      expect(decision.reason).toBe("TERMINAL_STATE");
    }
  });

  it("invalid path: rejects transition from terminal FAILED state", () => {
    const terminalState: TransferState = "FAILED";

    expect(isTerminalTransferState(terminalState)).toBe(true);

    const decision = evaluateTransferTransition("FAILED", "VALIDATED");

    expect(decision.ok).toBe(false);

    if (!decision.ok) {
      expect(decision.sourceFailureId).toBe("FAIL-008");
      expect(decision.reason).toBe("TERMINAL_STATE");
    }
  });
});
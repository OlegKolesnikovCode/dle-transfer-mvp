import type { TransferState } from "./transfer.types";

/**
 * Pure Transfer lifecycle helpers.
 *
 * Source authority:
 * - L05__FSM_WORKFLOW__LIFECYCLE_RULES__TRANSFER.md
 *
 * Source references:
 * - FSM-001 through FSM-010
 * - INV-008
 *
 * Implementation guidance:
 * - IMP-05__TRANSFER_OPERATION__MVP_ONLY.md
 *
 * This file does not persist state.
 * This file does not mutate Balance.
 * This file does not create LedgerEntries.
 * This file does not open transactions.
 * This file does not define API behavior.
 * This file does not authorize Balance Changes.
 */

export type TransferLifecycleTransition = Readonly<{
  from: TransferState;
  to: TransferState;
}>;

export type TransferLifecycleDecision =
  | Readonly<{
      ok: true;
      transition: TransferLifecycleTransition;
      sourceReferences: readonly string[];
    }>
  | Readonly<{
      ok: false;
      attempted: TransferLifecycleTransition;
      reason: "UNDEFINED_STATE" | "INVALID_TRANSITION" | "TERMINAL_STATE";
      sourceFailureId: "FAIL-008";
      sourceReferences: readonly string[];
    }>;

export const TRANSFER_STATES = [
  "REQUESTED",
  "VALIDATED",
  "EXECUTED",
  "FAILED"
] as const satisfies readonly TransferState[];

export const TERMINAL_TRANSFER_STATES = [
  "EXECUTED",
  "FAILED"
] as const satisfies readonly TransferState[];

export const VALID_TRANSFER_TRANSITIONS = [
  { from: "REQUESTED", to: "VALIDATED" },
  { from: "REQUESTED", to: "FAILED" },
  { from: "VALIDATED", to: "EXECUTED" },
  { from: "VALIDATED", to: "FAILED" }
] as const satisfies readonly TransferLifecycleTransition[];

const LIFECYCLE_SOURCE_REFERENCES = [
  "FSM-001",
  "FSM-002",
  "FSM-003",
  "FSM-004",
  "FSM-005",
  "FSM-006",
  "FSM-007",
  "FSM-008",
  "FSM-009",
  "FSM-010",
  "INV-008"
] as const;

const LIFECYCLE_FAILURE_REFERENCES = [
  "FAIL-008",
  "INV-008",
  "FSM-001",
  "FSM-002",
  "FSM-003",
  "FSM-006"
] as const;

export function isTransferState(value: string): value is TransferState {
  return TRANSFER_STATES.includes(value as TransferState);
}

export function isTerminalTransferState(state: TransferState): boolean {
  return (TERMINAL_TRANSFER_STATES as readonly TransferState[]).includes(state);
}

export function isValidTransferTransition(
  from: TransferState,
  to: TransferState
): boolean {
  return VALID_TRANSFER_TRANSITIONS.some(
    (transition) => transition.from === from && transition.to === to
  );
}

export function evaluateTransferTransition(
  from: string,
  to: string
): TransferLifecycleDecision {
  const attempted = {
    from: from as TransferState,
    to: to as TransferState
  };

  if (!isTransferState(from) || !isTransferState(to)) {
    return {
      ok: false,
      attempted,
      reason: "UNDEFINED_STATE",
      sourceFailureId: "FAIL-008",
      sourceReferences: LIFECYCLE_FAILURE_REFERENCES
    };
  }

  if (isTerminalTransferState(from)) {
    return {
      ok: false,
      attempted,
      reason: "TERMINAL_STATE",
      sourceFailureId: "FAIL-008",
      sourceReferences: LIFECYCLE_FAILURE_REFERENCES
    };
  }

  if (!isValidTransferTransition(from, to)) {
    return {
      ok: false,
      attempted,
      reason: "INVALID_TRANSITION",
      sourceFailureId: "FAIL-008",
      sourceReferences: LIFECYCLE_FAILURE_REFERENCES
    };
  }

  return {
    ok: true,
    transition: { from, to },
    sourceReferences: LIFECYCLE_SOURCE_REFERENCES
  };
}

export function requireValidTransferTransition(
  from: string,
  to: string
): TransferLifecycleTransition {
  const decision = evaluateTransferTransition(from, to);

  if (!decision.ok) {
    throw new Error(
      `Invalid Transfer lifecycle transition: ${decision.attempted.from} -> ${decision.attempted.to}`
    );
  }

  return decision.transition;
}

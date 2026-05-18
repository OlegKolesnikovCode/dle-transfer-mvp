import {
  evaluateTransferTransition,
  type TransferLifecycleDecision
} from "../../domain/operations/transfer/transfer.lifecycle";

/**
 * Lifecycle Control.
 *
 * Source authority:
 * - L05__FSM_WORKFLOW__LIFECYCLE_RULES__TRANSFER.md
 * - L06__ARCHITECTURE__CONTROL_FLOW__SYSTEM.md
 *
 * Source references:
 * - ARCH-004
 * - ARCH-009
 * - FSM-001 through FSM-010
 * - INV-008
 * - FAIL-008
 *
 * This file evaluates lifecycle transition intent.
 * This file does not persist lifecycle state.
 * This file does not open transactions.
 * This file does not mutate Balance.
 * This file does not create LedgerEntries.
 * This file does not authorize Balance Changes.
 * This file does not construct API responses.
 */

export type LifecycleControlInput = Readonly<{
  transferId?: string;
  requestIdentity?: string;
  currentState: string;
  requestedState: string;
}>;

export type LifecycleControlApproved = Readonly<{
  ok: true;
  transferId?: string;
  requestIdentity?: string;
  decision: Extract<TransferLifecycleDecision, { ok: true }>;
  boundary: "ARCH-004";
  sourceReferences: readonly string[];
}>;

export type LifecycleControlRejected = Readonly<{
  ok: false;
  transferId?: string;
  requestIdentity?: string;
  decision: Extract<TransferLifecycleDecision, { ok: false }>;
  boundary: "ARCH-004";
  sourceFailureId: "FAIL-008";
  sourceReferences: readonly string[];
}>;

export type LifecycleControlResult =
  | LifecycleControlApproved
  | LifecycleControlRejected;

const LIFECYCLE_CONTROL_SOURCE_REFERENCES = [
  "ARCH-004",
  "ARCH-009",
  "INV-008",
  "FAIL-008",
  "FSM-001",
  "FSM-002",
  "FSM-003",
  "FSM-004",
  "FSM-005",
  "FSM-006",
  "FSM-007",
  "FSM-008",
  "FSM-009",
  "FSM-010"
] as const;

export function evaluateLifecycleControl(
  input: LifecycleControlInput
): LifecycleControlResult {
  const decision = evaluateTransferTransition(
    input.currentState,
    input.requestedState
  );

  if (!decision.ok) {
    return {
      ok: false,
      transferId: input.transferId,
      requestIdentity: input.requestIdentity,
      decision,
      boundary: "ARCH-004",
      sourceFailureId: "FAIL-008",
      sourceReferences: LIFECYCLE_CONTROL_SOURCE_REFERENCES
    };
  }

  return {
    ok: true,
    transferId: input.transferId,
    requestIdentity: input.requestIdentity,
    decision,
    boundary: "ARCH-004",
    sourceReferences: LIFECYCLE_CONTROL_SOURCE_REFERENCES
  };
}

export function requireLifecycleControlApproval(
  input: LifecycleControlInput
): LifecycleControlApproved {
  const result = evaluateLifecycleControl(input);

  if (!result.ok) {
    throw new Error(
      `Lifecycle Control rejected transition: ${input.currentState} -> ${input.requestedState}`
    );
  }

  return result;
}

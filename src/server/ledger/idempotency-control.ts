import {
  executeTransferInConsistencyBoundary,
  type ConsistencyBoundaryCompleted,
  type ConsistencyBoundaryResult,
  type ConsistencyTransferInput
} from "./consistency-boundary";
import { findRequestByIdentity } from "./persistence-boundary";

/**
 * Idempotency Control.
 *
 * Source authority:
 * - L03__INVARIANTS__CORRECTNESS_RULES__LEDGER.md
 * - L04__FAILURE_MODEL__FAILURE_CLASSES__LEDGER.md
 * - L05__FSM_WORKFLOW__LIFECYCLE_RULES__TRANSFER.md
 * - L06__ARCHITECTURE__CONTROL_FLOW__SYSTEM.md
 * - L07__DATA_SCHEMA__DATA_MODEL__PERSISTENCE.md
 *
 * Source references:
 * - ARCH-002
 * - ARCH-009
 * - INV-007
 * - FAIL-007
 * - FSM-007
 * - SCHEMA-009
 * - SCHEMA-010
 *
 * This file resolves Request identity before execution.
 * This file does not open transactions.
 * This file does not mutate Balance.
 * This file does not create LedgerEntries.
 * This file does not execute lifecycle transitions.
 * This file does not construct API responses.
 */

export type IdempotencyControlInput = ConsistencyTransferInput;

export type IdempotencyDuplicateResolved = Readonly<{
  ok: true;
  duplicate: true;
  boundary: "ARCH-002";
  requestId: string;
  requestIdentity: string;
  requestStatus: string;
  transferId?: string;
  persistedOutcome: unknown;
  sourceReferences: readonly string[];
}>;

export type IdempotencyNewExecution = Readonly<{
  ok: true;
  duplicate: false;
  boundary: "ARCH-002";
  requestIdentity: string;
  execution: ConsistencyBoundaryCompleted;
  sourceReferences: readonly string[];
}>;

export type IdempotencyExecutionFailed = Readonly<{
  ok: false;
  duplicate: false;
  boundary: "ARCH-002";
  requestIdentity: string;
  execution: Extract<ConsistencyBoundaryResult, { ok: false }>;
  sourceFailureId: Extract<
    ConsistencyBoundaryResult,
    { ok: false }
  >["sourceFailureId"];
  sourceReferences: readonly string[];
}>;

export type IdempotencyControlResult =
  | IdempotencyDuplicateResolved
  | IdempotencyNewExecution
  | IdempotencyExecutionFailed;

const IDEMPOTENCY_CONTROL_SOURCE_REFERENCES = [
  "ARCH-002",
  "ARCH-009",
  "INV-007",
  "FAIL-007",
  "FSM-007",
  "SCHEMA-009",
  "SCHEMA-010"
] as const;

export async function resolveIdempotentTransferRequest(
  input: IdempotencyControlInput
): Promise<IdempotencyControlResult> {
  const existingRequest = await findRequestByIdentity(input.requestIdentity);

  if (existingRequest) {
    return {
      ok: true,
      duplicate: true,
      boundary: "ARCH-002",
      requestId: existingRequest.id,
      requestIdentity: existingRequest.identity,
      requestStatus: existingRequest.status,
      transferId: existingRequest.transfer?.id,
      persistedOutcome: existingRequest.responseBody ?? existingRequest.errorBody,
      sourceReferences: IDEMPOTENCY_CONTROL_SOURCE_REFERENCES
    };
  }

  const execution = await executeTransferInConsistencyBoundary(input);

  if (!execution.ok) {
    return {
      ok: false,
      duplicate: false,
      boundary: "ARCH-002",
      requestIdentity: input.requestIdentity,
      execution,
      sourceFailureId: execution.sourceFailureId,
      sourceReferences: IDEMPOTENCY_CONTROL_SOURCE_REFERENCES
    };
  }

  if ("duplicate" in execution && execution.duplicate) {
    return {
      ok: true,
      duplicate: true,
      boundary: "ARCH-002",
      requestId: execution.requestId,
      requestIdentity: execution.requestIdentity,
      requestStatus: execution.requestStatus,
      transferId: execution.transferId,
      persistedOutcome: execution.persistedOutcome,
      sourceReferences: IDEMPOTENCY_CONTROL_SOURCE_REFERENCES
    };
  }

  return {
    ok: true,
    duplicate: false,
    boundary: "ARCH-002",
    requestIdentity: input.requestIdentity,
    execution: execution as ConsistencyBoundaryCompleted,
    sourceReferences: IDEMPOTENCY_CONTROL_SOURCE_REFERENCES
  };
}

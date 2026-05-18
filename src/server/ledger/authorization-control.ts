/**
 * MVP local authorization policy.
 *
 * Implementation assumption:
 * - A structurally valid local Transfer request is authorized inside this bounded MVP.
 * - This is the MVP assumption: all structurally valid requests are authorized.
 * - Real systems would add account ownership checks, role validation, etc.
 *
 * This is not source authority per L09.
 * Source authority for authorization constraints: L09__SECURITY_AUTHZ__ACCESS_RULES__SYSTEM.md
 *
 * AUTHZ-002 (Authorized Request Requirement): satisfied by structure validation.
 * AUTHZ-003 (Determinism): same input always produces same decision.
 * AUTHZ-004 (Non-Mutation): this function does not mutate state.
 * AUTHZ-009 (Bounded Scope): applies only within MVP boundary.
 * 
 * It does not bypass idempotency, lifecycle, Balance Control, Ledger Control,
 * Persistence Boundary, or Consistency Boundary.
 */


/**
 * Authorization Control.
 *
 * Source authority:
 * - L09__SECURITY_AUTHZ__ACCESS_RULES__SYSTEM.md
 *
 * Source references:
 * - AUTHZ-001
 * - AUTHZ-002
 * - AUTHZ-003
 * - AUTHZ-004
 * - AUTHZ-005
 * - AUTHZ-006
 * - AUTHZ-007
 * - AUTHZ-008
 * - AUTHZ-009
 * - AUTHZ-010
 * - AUTHZ-011
 * - AUTHZ-012
 *
 * This file determines whether a Request is permitted to invoke
 * the MVP Transfer Balance-Affecting Operation.
 *
 * This file does not mutate state.
 * This file does not open transactions.
 * This file does not select lifecycle state.
 * This file does not authorize Balance Changes.
 * This file does not create LedgerEntries.
 * This file does not define architecture.
 * This file does not persist data.
 * This file does not construct API responses.
 * This file imports no internal project files.
 */

export type AuthorizationOperationType = "TRANSFER";

export type AuthorizationControlInput = Readonly<{
  requestIdentity: string;
  operationType: AuthorizationOperationType;
  sourceAccountId: string;
  destinationAccountId: string;
  assetId: string;
}>;

export type AuthorizationControlApproved = Readonly<{
  ok: true;
  boundary: "AUTHORIZATION_CONTROL";
  requestIdentity: string;
  operationType: AuthorizationOperationType;
  sourceReferences: readonly string[];
}>;

export type AuthorizationControlRejected = Readonly<{
  ok: false;
  boundary: "AUTHORIZATION_CONTROL";
  requestIdentity?: string;
  operationType?: string;
  sourceFailureId?: never;
  reason:
    | "INVALID_AUTHORIZATION_INPUT"
    | "UNSUPPORTED_OPERATION_TYPE";
  message: string;
  sourceReferences: readonly string[];
}>;

export type AuthorizationControlResult =
  | AuthorizationControlApproved
  | AuthorizationControlRejected;

const AUTHORIZATION_SOURCE_REFERENCES = [
  "AUTHZ-001",
  "AUTHZ-002",
  "AUTHZ-003",
  "AUTHZ-004",
  "AUTHZ-005",
  "AUTHZ-006",
  "AUTHZ-007",
  "AUTHZ-008",
  "AUTHZ-009",
  "AUTHZ-010",
  "AUTHZ-011",
  "AUTHZ-012"
] as const;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function rejectAuthorization(
  reason: AuthorizationControlRejected["reason"],
  message: string,
  input?: Partial<AuthorizationControlInput>
): AuthorizationControlRejected {
  return {
    ok: false,
    boundary: "AUTHORIZATION_CONTROL",
    requestIdentity: input?.requestIdentity,
    operationType: input?.operationType,
    reason,
    message,
    sourceReferences: AUTHORIZATION_SOURCE_REFERENCES
  };
}

/**
 * MVP local authorization policy.
 *
 * Implementation assumption:
 * - A structurally valid local Transfer request is authorized inside this bounded MVP.
 *
 * This is not source authority.
 * It does not bypass idempotency, lifecycle, Balance Control, Ledger Control,
 * Persistence Boundary, or Consistency Boundary.
 */
export function evaluateAuthorizationControl(
  input: unknown
): AuthorizationControlResult {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return rejectAuthorization(
      "INVALID_AUTHORIZATION_INPUT",
      "Authorization input must be an object."
    );
  }

  const candidate = input as Partial<AuthorizationControlInput>;

  if (candidate.operationType !== "TRANSFER") {
    return rejectAuthorization(
      "UNSUPPORTED_OPERATION_TYPE",
      "Only the MVP Transfer operation may be authorized.",
      candidate
    );
  }

  if (
    !isNonEmptyString(candidate.requestIdentity) ||
    !isNonEmptyString(candidate.sourceAccountId) ||
    !isNonEmptyString(candidate.destinationAccountId) ||
    !isNonEmptyString(candidate.assetId)
  ) {
    return rejectAuthorization(
      "INVALID_AUTHORIZATION_INPUT",
      "Authorization input requires requestIdentity, sourceAccountId, destinationAccountId, and assetId.",
      candidate
    );
  }

  return {
    ok: true,
    boundary: "AUTHORIZATION_CONTROL",
    requestIdentity: candidate.requestIdentity,
    operationType: "TRANSFER",
    sourceReferences: AUTHORIZATION_SOURCE_REFERENCES
  };
}

export function requireAuthorizationControlApproval(
  input: unknown
): AuthorizationControlApproved {
  const result = evaluateAuthorizationControl(input);

  if (!result.ok) {
    throw new Error(`Authorization Control rejected request: ${result.reason}`);
  }

  return result;
}

/**
 * Implementation error model for DLE Transfer-only MVP.
 *
 * Source authority:
 * - L04__FAILURE_MODEL__FAILURE_CLASSES__LEDGER.md
 *
 * Implementation guidance:
 * - IMP-07__FAILURE_MAPPING__LEDGER_ERRORS.md
 *
 * This file does not define source failure classes.
 * This file does not define correctness rules.
 * This file does not define invariants.
 * This file does not define lifecycle rules.
 * This file does not define architecture.
 * This file does not define API contracts.
 * This file does not prove correctness.
 */

export type SourceFailureId =
  | "FAIL-001"
  | "FAIL-002"
  | "FAIL-003"
  | "FAIL-004"
  | "FAIL-005"
  | "FAIL-006"
  | "FAIL-007"
  | "FAIL-008"
  | "FAIL-009"
  | "FAIL-010";

export type LedgerErrorCode =
  | "UNTRACEABLE_BALANCE_CHANGE"
  | "MUTABLE_LEDGER_HISTORY"
  | "NON_RECONSTRUCTABLE_STATE"
  | "PARTIAL_OPERATION"
  | "INVALID_BALANCE_STATE"
  | "ASSET_INCONSISTENCY"
  | "DUPLICATE_EXECUTION_EFFECT"
  | "LIFECYCLE_GOVERNANCE_VIOLATION"
  | "BOUNDARY_VIOLATION"
  | "INCOMPLETE_OPERATION_REPRESENTATION"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED_REQUEST"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export type LedgerError = Readonly<{
  code: LedgerErrorCode;
  message: string;
  sourceFailureId?: SourceFailureId;
  sourceReferences: readonly string[];
  httpStatus: number;
  safeForResponse: boolean;
  details?: Readonly<Record<string, unknown>>;
}>;

export type LedgerErrorInput = Readonly<{
  code: LedgerErrorCode;
  message: string;
  sourceFailureId?: SourceFailureId;
  sourceReferences?: readonly string[];
  httpStatus?: number;
  safeForResponse?: boolean;
  details?: Readonly<Record<string, unknown>>;
}>;

export const SOURCE_FAILURE_IDS = [
  "FAIL-001",
  "FAIL-002",
  "FAIL-003",
  "FAIL-004",
  "FAIL-005",
  "FAIL-006",
  "FAIL-007",
  "FAIL-008",
  "FAIL-009",
  "FAIL-010"
] as const satisfies readonly SourceFailureId[];

export const FAILURE_TO_ERROR_CODE = {
  "FAIL-001": "UNTRACEABLE_BALANCE_CHANGE",
  "FAIL-002": "MUTABLE_LEDGER_HISTORY",
  "FAIL-003": "NON_RECONSTRUCTABLE_STATE",
  "FAIL-004": "PARTIAL_OPERATION",
  "FAIL-005": "INVALID_BALANCE_STATE",
  "FAIL-006": "ASSET_INCONSISTENCY",
  "FAIL-007": "DUPLICATE_EXECUTION_EFFECT",
  "FAIL-008": "LIFECYCLE_GOVERNANCE_VIOLATION",
  "FAIL-009": "BOUNDARY_VIOLATION",
  "FAIL-010": "INCOMPLETE_OPERATION_REPRESENTATION"
} as const satisfies Record<SourceFailureId, LedgerErrorCode>;

export const FAILURE_HTTP_STATUS = {
  "FAIL-001": 409,
  "FAIL-002": 409,
  "FAIL-003": 409,
  "FAIL-004": 500,
  "FAIL-005": 422,
  "FAIL-006": 422,
  "FAIL-007": 409,
  "FAIL-008": 409,
  "FAIL-009": 409,
  "FAIL-010": 409
} as const satisfies Record<SourceFailureId, number>;

export const FAILURE_SOURCE_REFERENCES = {
  "FAIL-001": ["FAIL-001", "INV-001"],
  "FAIL-002": ["FAIL-002", "INV-002"],
  "FAIL-003": ["FAIL-003", "INV-003"],
  "FAIL-004": ["FAIL-004", "INV-004", "INV-010"],
  "FAIL-005": ["FAIL-005", "INV-005"],
  "FAIL-006": ["FAIL-006", "INV-006"],
  "FAIL-007": ["FAIL-007", "INV-007"],
  "FAIL-008": ["FAIL-008", "INV-008"],
  "FAIL-009": ["FAIL-009", "INV-009"],
  "FAIL-010": ["FAIL-010", "INV-010"]
} as const satisfies Record<SourceFailureId, readonly string[]>;

export function createLedgerError(input: LedgerErrorInput): LedgerError {
  return {
    code: input.code,
    message: input.message,
    sourceFailureId: input.sourceFailureId,
    sourceReferences: input.sourceReferences ?? [],
    httpStatus: input.httpStatus ?? 500,
    safeForResponse: input.safeForResponse ?? false,
    details: input.details
  };
}

export function createSourceFailureError(
  sourceFailureId: SourceFailureId,
  message: string,
  details?: Readonly<Record<string, unknown>>
): LedgerError {
  return createLedgerError({
    code: FAILURE_TO_ERROR_CODE[sourceFailureId],
    message,
    sourceFailureId,
    sourceReferences: FAILURE_SOURCE_REFERENCES[sourceFailureId],
    httpStatus: FAILURE_HTTP_STATUS[sourceFailureId],
    safeForResponse: true,
    details
  });
}

export function createValidationError(
  message: string,
  sourceReferences: readonly string[],
  details?: Readonly<Record<string, unknown>>
): LedgerError {
  return createLedgerError({
    code: "VALIDATION_ERROR",
    message,
    sourceReferences,
    httpStatus: 422,
    safeForResponse: true,
    details
  });
}

export function createUnauthorizedError(
  message = "Request is not authorized to invoke this Balance-Affecting Operation."
): LedgerError {
  return createLedgerError({
    code: "UNAUTHORIZED_REQUEST",
    message,
    sourceReferences: ["AUTHZ-001", "AUTHZ-002", "AUTHZ-004"],
    httpStatus: 403,
    safeForResponse: true
  });
}

export function createNotFoundError(
  message: string,
  sourceReferences: readonly string[] = []
): LedgerError {
  return createLedgerError({
    code: "NOT_FOUND",
    message,
    sourceReferences,
    httpStatus: 404,
    safeForResponse: true
  });
}

export function createConflictError(
  message: string,
  sourceReferences: readonly string[],
  details?: Readonly<Record<string, unknown>>
): LedgerError {
  return createLedgerError({
    code: "CONFLICT",
    message,
    sourceReferences,
    httpStatus: 409,
    safeForResponse: true,
    details
  });
}

export function createInternalError(
  message = "Internal ledger error."
): LedgerError {
  return createLedgerError({
    code: "INTERNAL_ERROR",
    message,
    sourceReferences: [],
    httpStatus: 500,
    safeForResponse: false
  });
}

export function isLedgerError(value: unknown): value is LedgerError {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<LedgerError>;

  return (
    typeof candidate.code === "string" &&
    typeof candidate.message === "string" &&
    Array.isArray(candidate.sourceReferences) &&
    typeof candidate.httpStatus === "number" &&
    typeof candidate.safeForResponse === "boolean"
  );
}

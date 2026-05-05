import {
  createInternalError,
  isLedgerError,
  type LedgerError
} from "./errors";

/**
 * API-safe response envelope utility.
 *
 * Source references:
 * - API-004
 * - API-005
 * - API-006
 * - API-011
 * - API-012
 * - FAIL-001 through FAIL-010
 *
 * Implementation guidance:
 * - IMP-06__API_RULES__ROUTES_RESPONSES.md
 * - IMP-07__FAILURE_MAPPING__LEDGER_ERRORS.md
 *
 * This file does not define API routes.
 * This file does not execute operations.
 * This file does not mutate state.
 * This file does not authorize Balance Changes.
 * This file does not create LedgerEntries.
 * This file does not import server controls.
 * This file does not import Prisma.
 * This file does not prove correctness.
 */

export type ResponsePairing = Readonly<{
  requestId?: string;
  requestIdentity?: string;
  transferId?: string;
}>;

export type ApiSafeErrorBody = Readonly<{
  code: string;
  message: string;
  sourceFailureId?: string;
  sourceReferences: readonly string[];
}>;

export type ApiSuccessEnvelope<TResult> = Readonly<
  ResponsePairing & {
    status: "success";
    result: TResult;
    sourceReferences: readonly string[];
  }
>;

export type ApiErrorEnvelope = Readonly<
  ResponsePairing & {
    status: "error";
    error: ApiSafeErrorBody;
    sourceReferences: readonly string[];
  }
>;

export type ApiResponseEnvelope<TResult> =
  | ApiSuccessEnvelope<TResult>
  | ApiErrorEnvelope;

export type ApiResponsePayload<TResult> = Readonly<{
  httpStatus: number;
  body: ApiResponseEnvelope<TResult>;
}>;

export type SuccessResponseInput<TResult> = Readonly<{
  result: TResult;
  pairing?: ResponsePairing;
  httpStatus?: number;
  sourceReferences?: readonly string[];
}>;

export type ErrorResponseInput = Readonly<{
  error: LedgerError | unknown;
  pairing?: ResponsePairing;
}>;

function cleanPairing(pairing: ResponsePairing | undefined): ResponsePairing {
  if (!pairing) {
    return {};
  }

  return {
    ...(pairing.requestId ? { requestId: pairing.requestId } : {}),
    ...(pairing.requestIdentity
      ? { requestIdentity: pairing.requestIdentity }
      : {}),
    ...(pairing.transferId ? { transferId: pairing.transferId } : {})
  };
}

export function toSafeErrorBody(error: LedgerError): ApiSafeErrorBody {
  if (!error.safeForResponse) {
    return {
      code: "INTERNAL_ERROR",
      message: "Internal ledger error.",
      sourceReferences: []
    };
  }

  return {
    code: error.code,
    message: error.message,
    ...(error.sourceFailureId
      ? { sourceFailureId: error.sourceFailureId }
      : {}),
    sourceReferences: error.sourceReferences
  };
}

export function createSuccessResponse<TResult>(
  input: SuccessResponseInput<TResult>
): ApiResponsePayload<TResult> {
  const sourceReferences = input.sourceReferences ?? [
    "API-004",
    "API-005",
    "API-006",
    "API-011",
    "API-012"
  ];

  return {
    httpStatus: input.httpStatus ?? 200,
    body: {
      ...cleanPairing(input.pairing),
      status: "success",
      result: input.result,
      sourceReferences
    }
  };
}

export function createErrorResponse<TResult = never>(
  input: ErrorResponseInput
): ApiResponsePayload<TResult> {
  const ledgerError = isLedgerError(input.error)
    ? input.error
    : createInternalError();

  const safeError = toSafeErrorBody(ledgerError);

  return {
    httpStatus: ledgerError.safeForResponse ? ledgerError.httpStatus : 500,
    body: {
      ...cleanPairing(input.pairing),
      status: "error",
      error: safeError,
      sourceReferences: safeError.sourceReferences
    }
  };
}

export function createCreatedResponse<TResult>(
  input: Omit<SuccessResponseInput<TResult>, "httpStatus">
): ApiResponsePayload<TResult> {
  return createSuccessResponse({
    ...input,
    httpStatus: 201
  });
}

export function createAcceptedResponse<TResult>(
  input: Omit<SuccessResponseInput<TResult>, "httpStatus">
): ApiResponsePayload<TResult> {
  return createSuccessResponse({
    ...input,
    httpStatus: 202
  });
}

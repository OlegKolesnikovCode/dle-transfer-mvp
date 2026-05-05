import { evaluateAuthorizationControl } from "./authorization-control";
import { resolveIdempotentTransferRequest } from "./idempotency-control";
import { validateTransferRequestInput } from "../../domain/operations/transfer/transfer.validation";
import {
  createCreatedResponse,
  createErrorResponse,
  createSuccessResponse,
  type ApiResponsePayload
} from "../../lib/response";
import {
  createSourceFailureError,
  createUnauthorizedError,
  createValidationError
} from "../../lib/errors";

/**
 * Request Boundary.
 *
 * Source authority:
 * - L06__ARCHITECTURE__CONTROL_FLOW__SYSTEM.md
 * - L08__API_CONTRACTS__EXTERNAL_BOUNDARY__SYSTEM.md
 * - L09__SECURITY_AUTHZ__ACCESS_RULES__SYSTEM.md
 *
 * Source references:
 * - ARCH-001
 * - ARCH-002
 * - ARCH-009
 * - API-001
 * - API-002
 * - API-003
 * - API-004
 * - API-007
 * - API-008
 * - API-012
 * - AUTHZ-001 through AUTHZ-012
 * - INV-007
 * - FAIL-007
 *
 * This file receives external Transfer Requests.
 * This file validates Request shape.
 * This file evaluates authorization before idempotent execution.
 * This file routes authorized Requests into Idempotency Control.
 *
 * This file does not open transactions.
 * This file does not import Prisma.
 * This file does not mutate Balance.
 * This file does not create LedgerEntries.
 * This file does not decide lifecycle transitions.
 * This file does not bypass Idempotency Control.
 */

export type RequestBoundaryInput = Readonly<{
  body: unknown;
}>;

export type RequestBoundaryResult = ApiResponsePayload<unknown>;

const REQUEST_BOUNDARY_SOURCE_REFERENCES = [
  "ARCH-001",
  "ARCH-002",
  "ARCH-009",
  "API-001",
  "API-002",
  "API-003",
  "API-004",
  "API-007",
  "API-008",
  "API-012",
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
  "AUTHZ-012",
  "INV-007",
  "FAIL-007"
] as const;

function validationIssuesToDetails(
  issues: readonly Readonly<{
    code: string;
    message: string;
    sourceFailureId?: string;
    sourceReferences: readonly string[];
  }>[]
): Readonly<Record<string, unknown>> {
  return {
    issues: issues.map((issue) => ({
      code: issue.code,
      message: issue.message,
      sourceFailureId: issue.sourceFailureId,
      sourceReferences: issue.sourceReferences
    }))
  };
}

export async function handleTransferRequestBoundary(
  input: RequestBoundaryInput
): Promise<RequestBoundaryResult> {
  const validation = validateTransferRequestInput(input.body);

  if (!validation.ok) {
    return createErrorResponse({
      error: createValidationError(
        "Transfer Request failed validation.",
        ["API-001", "API-002", "API-007", "API-008", "API-012"],
        validationIssuesToDetails(validation.issues)
      )
    });
  }

  const transferInput = validation.value;

  const authorization = evaluateAuthorizationControl({
    requestIdentity: transferInput.requestIdentity,
    operationType: "TRANSFER",
    sourceAccountId: transferInput.sourceAccountId,
    destinationAccountId: transferInput.destinationAccountId,
    assetId: transferInput.assetId
  });

  if (!authorization.ok) {
    return createErrorResponse({
      error: createUnauthorizedError(authorization.message),
      pairing: {
        requestIdentity: transferInput.requestIdentity
      }
    });
  }

  const idempotency = await resolveIdempotentTransferRequest(transferInput);

  if (!idempotency.ok) {
    return createErrorResponse({
      error: createSourceFailureError(
        idempotency.sourceFailureId,
        "Transfer Request execution failed inside the routed control path.",
        {
          reason: idempotency.execution.reason,
          message: idempotency.execution.message
        }
      ),
      pairing: {
        requestIdentity: idempotency.requestIdentity,
        requestId: idempotency.execution.requestId,
        transferId: idempotency.execution.transferId
      }
    });
  }

  if (idempotency.duplicate) {
    return createSuccessResponse({
      pairing: {
        requestId: idempotency.requestId,
        requestIdentity: idempotency.requestIdentity,
        transferId: idempotency.transferId
      },
      result: {
        duplicate: true,
        requestStatus: idempotency.requestStatus,
        persistedOutcome: idempotency.persistedOutcome
      },
      sourceReferences: REQUEST_BOUNDARY_SOURCE_REFERENCES
    });
  }

  return createCreatedResponse({
    pairing: {
      requestId: idempotency.execution.requestId,
      requestIdentity: idempotency.requestIdentity,
      transferId: idempotency.execution.transferId
    },
    result: {
      duplicate: false,
      requestId: idempotency.execution.requestId,
      requestIdentity: idempotency.requestIdentity,
      transferId: idempotency.execution.transferId,
      transferState: idempotency.execution.transferState
    },
    sourceReferences: REQUEST_BOUNDARY_SOURCE_REFERENCES
  });
}

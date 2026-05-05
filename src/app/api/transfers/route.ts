import { NextResponse, type NextRequest } from "next/server";
import { handleTransferRequestBoundary } from "../../../server/ledger/request-boundary";
import { createErrorResponse } from "../../../lib/response";
import { createValidationError } from "../../../lib/errors";

/**
 * POST /api/transfers
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
 * - API-009
 * - API-010
 * - API-012
 * - AUTHZ-001 through AUTHZ-012
 * - TEST-007
 * - TEST-008
 * - TEST-011
 * - TEST-012
 *
 * This route receives Transfer Requests.
 * This route terminates at Request Boundary.
 * This route does not import Prisma.
 * This route does not open transactions.
 * This route does not mutate Balance directly.
 * This route does not create LedgerEntries directly.
 * This route does not expose lifecycle override.
 * This route does not expose internal control-boundary selection.
 */

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    const response = createErrorResponse({
      error: createValidationError(
        "Request body must be valid JSON.",
        ["API-001", "API-002", "API-012"]
      )
    });

    return NextResponse.json(response.body, {
      status: response.httpStatus
    });
  }

  const response = await handleTransferRequestBoundary({ body });

  return NextResponse.json(response.body, {
    status: response.httpStatus
  });
}

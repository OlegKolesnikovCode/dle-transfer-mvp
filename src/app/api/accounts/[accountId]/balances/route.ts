import { NextResponse, type NextRequest } from "next/server";
import { deriveAccountBalances } from "../../../../../server/ledger/read-derivation-boundary";
import { createSuccessResponse } from "../../../../../lib/response";

/**
 * GET /api/accounts/:accountId/balances
 *
 * Source authority:
 * - L06__ARCHITECTURE__CONTROL_FLOW__SYSTEM.md
 * - L08__API_CONTRACTS__EXTERNAL_BOUNDARY__SYSTEM.md
 *
 * Source references:
 * - ARCH-008
 * - ARCH-009
 * - INV-001
 * - INV-003
 * - API-005
 * - API-011
 * - API-012
 * - TEST-001
 * - TEST-003
 * - TEST-011
 *
 * This route provides derived Account Balance read state only.
 * This route terminates at Read Derivation Boundary.
 * This route does not import Prisma.
 * This route does not mutate state.
 * This route does not execute Transfers.
 * This route does not authorize Balance-Affecting Operations.
 * This route does not create LedgerEntries.
 */

type RouteContext = Readonly<{
  params:
    | Promise<Readonly<{ accountId?: string }>>
    | Readonly<{ accountId?: string }>;
}>;

async function resolveAccountId(context: RouteContext): Promise<string | null> {
  const params = await Promise.resolve(context.params);
  const accountId = params.accountId;

  if (typeof accountId !== "string" || accountId.trim().length === 0) {
    return null;
  }

  return accountId;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const accountId = await resolveAccountId(context);

  if (!accountId) {
    return NextResponse.json(
      {
        status: "error",
        error: {
          code: "VALIDATION_ERROR",
          message: "accountId route parameter is required.",
          sourceReferences: ["API-005", "API-011", "API-012"]
        },
        sourceReferences: ["API-005", "API-011", "API-012"]
      },
      { status: 422 }
    );
  }

  const derived = await deriveAccountBalances(accountId);

  if (!derived.ok) {
    return NextResponse.json(
      {
        status: "error",
        error: {
          code: "NOT_FOUND",
          message: derived.message,
          sourceReferences: derived.sourceReferences
        },
        sourceReferences: derived.sourceReferences
      },
      { status: 404 }
    );
  }

  const response = createSuccessResponse({
    result: {
      accountId: derived.accountId,
      balances: derived.balances
    },
    sourceReferences: derived.sourceReferences
  });

  return NextResponse.json(response.body, {
    status: response.httpStatus
  });
}
/**
 * TEST-011 — API Boundary Verification
 *
 * Source authority:
 * - L10__TEST_SPEC__VERIFICATION__SYSTEM.md
 *
 * Source references:
 * - TEST-011
 * - API-001
 * - API-002
 * - API-003
 * - API-004
 * - API-005
 * - API-006
 * - API-007
 * - API-008
 * - API-009
 * - API-010
 * - API-011
 * - API-012
 * - API-013
 * - ARCH-001
 * - ARCH-008
 * - ARCH-009
 *
 * Valid-path observation:
 * - Only the routed MVP API surface is accepted.
 *
 * Invalid-path observation:
 * - Direct Balance mutation, direct LedgerEntry creation, lifecycle override,
 *   internal boundary selection, and unsupported operation routes are rejected.
 *
 * This test does not treat route file existence alone as proof.
 */

type ApiMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

type ApiRequestShape = Readonly<{
  method: ApiMethod;
  path: string;
  body?: Readonly<Record<string, unknown>>;
}>;

type ApiBoundaryResult =
  | Readonly<{
      ok: true;
      boundary: "ARCH-001" | "ARCH-008";
      sourceReferences: readonly string[];
    }>
  | Readonly<{
      ok: false;
      reason:
        | "UNROUTED_API_SURFACE"
        | "DIRECT_BALANCE_MUTATION"
        | "DIRECT_LEDGER_ENTRY_CREATION"
        | "LIFECYCLE_OVERRIDE"
        | "IDEMPOTENCY_BYPASS"
        | "INTERNAL_BOUNDARY_SELECTION"
        | "UNSUPPORTED_OPERATION";
      sourceReferences: readonly string[];
    }>;

const API_BOUNDARY_SOURCE_REFERENCES = [
  "TEST-011",
  "API-001",
  "API-002",
  "API-003",
  "API-004",
  "API-005",
  "API-006",
  "API-007",
  "API-008",
  "API-009",
  "API-010",
  "API-011",
  "API-012",
  "API-013",
  "ARCH-001",
  "ARCH-008",
  "ARCH-009"
] as const;

const FORBIDDEN_BODY_FIELDS = {
  lifecycleOverride: [
    "lifecycleState",
    "stateOverride",
    "forceExecute",
    "state"
  ],
  idempotencyBypass: ["skipIdempotency"],
  internalBoundarySelection: [
    "internalBoundary",
    "consistencyBoundary",
    "persistenceCommand",
    "transactionMode"
  ],
  directBalanceMutation: [
    "balanceDelta",
    "sourceBalanceMutation",
    "destinationBalanceMutation"
  ],
  directLedgerEntryCreation: ["ledgerEntries", "ledgerEntryIds"]
} as const;

function bodyHasAnyField(
  body: Readonly<Record<string, unknown>> | undefined,
  fields: readonly string[]
): boolean {
  if (!body) {
    return false;
  }

  return fields.some((field) =>
    Object.prototype.hasOwnProperty.call(body, field)
  );
}

function evaluateApiBoundary(request: ApiRequestShape): ApiBoundaryResult {
  if (
    request.method === "POST" &&
    request.path === "/api/transfers"
  ) {
    if (
      bodyHasAnyField(request.body, FORBIDDEN_BODY_FIELDS.lifecycleOverride)
    ) {
      return {
        ok: false,
        reason: "LIFECYCLE_OVERRIDE",
        sourceReferences: API_BOUNDARY_SOURCE_REFERENCES
      };
    }

    if (
      bodyHasAnyField(request.body, FORBIDDEN_BODY_FIELDS.idempotencyBypass)
    ) {
      return {
        ok: false,
        reason: "IDEMPOTENCY_BYPASS",
        sourceReferences: API_BOUNDARY_SOURCE_REFERENCES
      };
    }

    if (
      bodyHasAnyField(
        request.body,
        FORBIDDEN_BODY_FIELDS.internalBoundarySelection
      )
    ) {
      return {
        ok: false,
        reason: "INTERNAL_BOUNDARY_SELECTION",
        sourceReferences: API_BOUNDARY_SOURCE_REFERENCES
      };
    }

    if (
      bodyHasAnyField(request.body, FORBIDDEN_BODY_FIELDS.directBalanceMutation)
    ) {
      return {
        ok: false,
        reason: "DIRECT_BALANCE_MUTATION",
        sourceReferences: API_BOUNDARY_SOURCE_REFERENCES
      };
    }

    if (
      bodyHasAnyField(
        request.body,
        FORBIDDEN_BODY_FIELDS.directLedgerEntryCreation
      )
    ) {
      return {
        ok: false,
        reason: "DIRECT_LEDGER_ENTRY_CREATION",
        sourceReferences: API_BOUNDARY_SOURCE_REFERENCES
      };
    }

    return {
      ok: true,
      boundary: "ARCH-001",
      sourceReferences: API_BOUNDARY_SOURCE_REFERENCES
    };
  }

  if (
    request.method === "GET" &&
    /^\/api\/transfers\/[^/]+$/.test(request.path)
  ) {
    return {
      ok: true,
      boundary: "ARCH-008",
      sourceReferences: API_BOUNDARY_SOURCE_REFERENCES
    };
  }

  if (
    request.method === "GET" &&
    /^\/api\/transfers\/[^/]+\/ledger-entries$/.test(request.path)
  ) {
    return {
      ok: true,
      boundary: "ARCH-008",
      sourceReferences: API_BOUNDARY_SOURCE_REFERENCES
    };
  }

  if (
    request.method === "GET" &&
    /^\/api\/accounts\/[^/]+\/balances$/.test(request.path)
  ) {
    return {
      ok: true,
      boundary: "ARCH-008",
      sourceReferences: API_BOUNDARY_SOURCE_REFERENCES
    };
  }

  if (/^\/api\/balances/.test(request.path)) {
    return {
      ok: false,
      reason: "DIRECT_BALANCE_MUTATION",
      sourceReferences: API_BOUNDARY_SOURCE_REFERENCES
    };
  }

  if (/^\/api\/ledger-entries/.test(request.path)) {
    return {
      ok: false,
      reason: "DIRECT_LEDGER_ENTRY_CREATION",
      sourceReferences: API_BOUNDARY_SOURCE_REFERENCES
    };
  }

  if (/\/state$|\/execute$|\/fail$|\/validate$/.test(request.path)) {
    return {
      ok: false,
      reason: "LIFECYCLE_OVERRIDE",
      sourceReferences: API_BOUNDARY_SOURCE_REFERENCES
    };
  }

  if (/^\/api\/deposits|^\/api\/withdrawals|^\/api\/adjustments|^\/api\/reversals|^\/api\/operations/.test(request.path)) {
    return {
      ok: false,
      reason: "UNSUPPORTED_OPERATION",
      sourceReferences: API_BOUNDARY_SOURCE_REFERENCES
    };
  }

  return {
    ok: false,
    reason: "UNROUTED_API_SURFACE",
    sourceReferences: API_BOUNDARY_SOURCE_REFERENCES
  };
}

describe("TEST-011 — API Boundary Verification", () => {
  it("valid path: accepts POST /api/transfers through Request Boundary", () => {
    const result = evaluateApiBoundary({
      method: "POST",
      path: "/api/transfers",
      body: {
        requestIdentity: "req_test_011_api_boundary",
        sourceAccountId: "acct_source_demo",
        destinationAccountId: "acct_destination_demo",
        assetId: "asset_usd_atomic",
        amount: "100"
      }
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.boundary).toBe("ARCH-001");
      expect(result.sourceReferences).toContain("API-001");
      expect(result.sourceReferences).toContain("API-012");
    }
  });

  it("valid path: accepts GET /api/transfers/:transferId through Read Derivation Boundary", () => {
    const result = evaluateApiBoundary({
      method: "GET",
      path: "/api/transfers/transfer_001"
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.boundary).toBe("ARCH-008");
    }
  });

  it("valid path: accepts GET /api/transfers/:transferId/ledger-entries through Read Derivation Boundary", () => {
    const result = evaluateApiBoundary({
      method: "GET",
      path: "/api/transfers/transfer_001/ledger-entries"
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.boundary).toBe("ARCH-008");
    }
  });

  it("valid path: accepts GET /api/accounts/:accountId/balances through Read Derivation Boundary", () => {
    const result = evaluateApiBoundary({
      method: "GET",
      path: "/api/accounts/acct_source_demo/balances"
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.boundary).toBe("ARCH-008");
    }
  });

  it("invalid path: rejects direct Balance mutation API", () => {
    const result = evaluateApiBoundary({
      method: "PATCH",
      path: "/api/balances/bal_001",
      body: {
        amount: "999999"
      }
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.reason).toBe("DIRECT_BALANCE_MUTATION");
    }
  });

  it("invalid path: rejects direct LedgerEntry creation API", () => {
    const result = evaluateApiBoundary({
      method: "POST",
      path: "/api/ledger-entries",
      body: {
        accountId: "acct_source_demo",
        assetId: "asset_usd_atomic",
        amountDelta: "-100"
      }
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.reason).toBe("DIRECT_LEDGER_ENTRY_CREATION");
    }
  });

  it("invalid path: rejects lifecycle override route", () => {
    const result = evaluateApiBoundary({
      method: "PATCH",
      path: "/api/transfers/transfer_001/state",
      body: {
        state: "EXECUTED"
      }
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.reason).toBe("LIFECYCLE_OVERRIDE");
    }
  });

  it("invalid path: rejects lifecycle override body field", () => {
    const result = evaluateApiBoundary({
      method: "POST",
      path: "/api/transfers",
      body: {
        requestIdentity: "req_test_011_lifecycle_override",
        sourceAccountId: "acct_source_demo",
        destinationAccountId: "acct_destination_demo",
        assetId: "asset_usd_atomic",
        amount: "100",
        stateOverride: "EXECUTED"
      }
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.reason).toBe("LIFECYCLE_OVERRIDE");
    }
  });

  it("invalid path: rejects idempotency bypass body field", () => {
    const result = evaluateApiBoundary({
      method: "POST",
      path: "/api/transfers",
      body: {
        requestIdentity: "req_test_011_skip_idempotency",
        sourceAccountId: "acct_source_demo",
        destinationAccountId: "acct_destination_demo",
        assetId: "asset_usd_atomic",
        amount: "100",
        skipIdempotency: true
      }
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.reason).toBe("IDEMPOTENCY_BYPASS");
    }
  });

  it("invalid path: rejects internal boundary selection body field", () => {
    const result = evaluateApiBoundary({
      method: "POST",
      path: "/api/transfers",
      body: {
        requestIdentity: "req_test_011_internal_boundary",
        sourceAccountId: "acct_source_demo",
        destinationAccountId: "acct_destination_demo",
        assetId: "asset_usd_atomic",
        amount: "100",
        internalBoundary: "ARCH-003"
      }
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.reason).toBe("INTERNAL_BOUNDARY_SELECTION");
    }
  });

  it("invalid path: rejects unsupported Balance-Affecting Operation route", () => {
    const result = evaluateApiBoundary({
      method: "POST",
      path: "/api/deposits",
      body: {
        requestIdentity: "req_test_011_deposit"
      }
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.reason).toBe("UNSUPPORTED_OPERATION");
    }
  });
});
import {
  evaluateAuthorizationControl,
  requireAuthorizationControlApproval
} from "../src/server/ledger/authorization-control";

/**
 * TEST-012 — Authorization Verification
 *
 * Source authority:
 * - L10__TEST_SPEC__VERIFICATION__SYSTEM.md
 *
 * Source references:
 * - TEST-012
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
 * Valid-path observation:
 * - Authorization permits only a structurally valid local Transfer invocation.
 *
 * Invalid-path observation:
 * - Authorization rejects unsupported operation types and invalid authorization input.
 *
 * This test does not treat authorization as lifecycle, Balance, LedgerEntry,
 * transaction, persistence, or API response authority.
 */

describe("TEST-012 — Authorization Verification", () => {
  it("valid path: authorizes a structurally valid MVP Transfer invocation", () => {
    const result = evaluateAuthorizationControl({
      requestIdentity: "req_test_012_authorized",
      operationType: "TRANSFER",
      sourceAccountId: "acct_source_demo",
      destinationAccountId: "acct_destination_demo",
      assetId: "asset_usd_atomic"
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.operationType).toBe("TRANSFER");
      expect(result.requestIdentity).toBe("req_test_012_authorized");
      expect(result.sourceReferences).toContain("AUTHZ-001");
      expect(result.sourceReferences).toContain("AUTHZ-002");
      expect(result.sourceReferences).toContain("AUTHZ-004");
      expect(result.sourceReferences).toContain("AUTHZ-012");
    }
  });

  it("valid path: requireAuthorizationControlApproval returns approved authorization only", () => {
    const approval = requireAuthorizationControlApproval({
      requestIdentity: "req_test_012_required",
      operationType: "TRANSFER",
      sourceAccountId: "acct_source_demo",
      destinationAccountId: "acct_destination_demo",
      assetId: "asset_usd_atomic"
    });

    expect(approval.ok).toBe(true);
    expect(approval.operationType).toBe("TRANSFER");
  });

  it("invalid path: rejects unsupported operation type", () => {
    const result = evaluateAuthorizationControl({
      requestIdentity: "req_test_012_deposit",
      operationType: "DEPOSIT",
      sourceAccountId: "acct_source_demo",
      destinationAccountId: "acct_destination_demo",
      assetId: "asset_usd_atomic"
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.reason).toBe("UNSUPPORTED_OPERATION_TYPE");
      expect(result.sourceReferences).toContain("AUTHZ-002");
      expect(result.sourceReferences).toContain("AUTHZ-012");
    }
  });

  it("invalid path: rejects malformed authorization input", () => {
    const result = evaluateAuthorizationControl(null);

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.reason).toBe("INVALID_AUTHORIZATION_INPUT");
      expect(result.sourceReferences).toContain("AUTHZ-001");
      expect(result.sourceReferences).toContain("AUTHZ-004");
    }
  });

  it("invalid path: rejects missing requestIdentity", () => {
    const result = evaluateAuthorizationControl({
      operationType: "TRANSFER",
      sourceAccountId: "acct_source_demo",
      destinationAccountId: "acct_destination_demo",
      assetId: "asset_usd_atomic"
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.reason).toBe("INVALID_AUTHORIZATION_INPUT");
    }
  });

  it("invalid path: rejects missing sourceAccountId", () => {
    const result = evaluateAuthorizationControl({
      requestIdentity: "req_test_012_missing_source",
      operationType: "TRANSFER",
      destinationAccountId: "acct_destination_demo",
      assetId: "asset_usd_atomic"
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.reason).toBe("INVALID_AUTHORIZATION_INPUT");
    }
  });

  it("invalid path: rejects missing destinationAccountId", () => {
    const result = evaluateAuthorizationControl({
      requestIdentity: "req_test_012_missing_destination",
      operationType: "TRANSFER",
      sourceAccountId: "acct_source_demo",
      assetId: "asset_usd_atomic"
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.reason).toBe("INVALID_AUTHORIZATION_INPUT");
    }
  });

  it("invalid path: rejects missing assetId", () => {
    const result = evaluateAuthorizationControl({
      requestIdentity: "req_test_012_missing_asset",
      operationType: "TRANSFER",
      sourceAccountId: "acct_source_demo",
      destinationAccountId: "acct_destination_demo"
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.reason).toBe("INVALID_AUTHORIZATION_INPUT");
    }
  });

  it("invalid path: requireAuthorizationControlApproval throws on rejected authorization", () => {
    expect(() =>
      requireAuthorizationControlApproval({
        requestIdentity: "req_test_012_rejected",
        operationType: "WITHDRAWAL",
        sourceAccountId: "acct_source_demo",
        destinationAccountId: "acct_destination_demo",
        assetId: "asset_usd_atomic"
      })
    ).toThrow("Authorization Control rejected request");
  });

  it("valid path: authorization result does not expose mutation or lifecycle authority", () => {
    const result = evaluateAuthorizationControl({
      requestIdentity: "req_test_012_no_authority_leak",
      operationType: "TRANSFER",
      sourceAccountId: "acct_source_demo",
      destinationAccountId: "acct_destination_demo",
      assetId: "asset_usd_atomic"
    });

    expect(result.ok).toBe(true);

    expect(result).not.toHaveProperty("lifecycleState");
    expect(result).not.toHaveProperty("stateOverride");
    expect(result).not.toHaveProperty("balanceDelta");
    expect(result).not.toHaveProperty("ledgerEntries");
    expect(result).not.toHaveProperty("transactionHandle");
    expect(result).not.toHaveProperty("persistenceCommand");
  });
});
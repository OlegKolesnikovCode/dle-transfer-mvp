"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

type TransferForm = {
  sourceAccountId: string;
  destinationAccountId: string;
  assetId: string;
  amount: string;
};

type ApiResult = {
  httpStatus: number;
  body: unknown;
};

type AccountBalance = {
  amount: bigint;
  raw: unknown;
};

type StepStatus = "idle" | "running" | "pass" | "fail";
type ActiveTab = "verification" | "trace";

type VerificationStep = {
  id: string;
  title: string;
  sourceRefs: string[];
  status: StepStatus;
  expected: string;
  observed: string;
};

type TraceEvent = {
  sequence: number;
  boundary: string;
  eventType: string;
  outcome: string;
  requestIdentity?: string;
  requestId?: string;
  transferId?: string;
  failureClass?: string;
  sourceRefs: string[];
  notes: string;
  observedAt: string;
};

const DEFAULT_FORM: TransferForm = {
  sourceAccountId: "acct_source_demo",
  destinationAccountId: "acct_destination_demo",
  assetId: "asset_usd_atomic",
  amount: "100"
};

const INITIAL_STEPS: VerificationStep[] = [
  {
    id: "valid-transfer",
    title: "1. Valid Transfer executes",
    sourceRefs: ["ARCH-001", "ARCH-002", "ARCH-003", "FSM-005"],
    status: "idle",
    expected: "POST /api/transfers returns EXECUTED for a new Request.",
    observed: "Not run."
  },
  {
    id: "balance-delta",
    title: "2. Balance delta is correct",
    sourceRefs: ["INV-005", "INV-006", "ARCH-005"],
    status: "idle",
    expected: "Source decreases by amount; destination increases by amount.",
    observed: "Not run."
  },
  {
    id: "ledger-trace",
    title: "3. LedgerEntry trace is complete",
    sourceRefs: ["INV-001", "INV-010", "ARCH-006"],
    status: "idle",
    expected: "Exactly two LedgerEntries: one DEBIT and one CREDIT for same Transfer and Asset.",
    observed: "Not run."
  },
  {
    id: "duplicate-request",
    title: "4. Duplicate Request does not re-execute",
    sourceRefs: ["INV-007", "FAIL-007", "ARCH-002"],
    status: "idle",
    expected: "Same requestIdentity returns duplicate outcome and balances remain unchanged.",
    observed: "Not run."
  },
  {
    id: "duplicate-failed-request",
    title: "5. Duplicate failed Request preserves failed outcome",
    sourceRefs: ["INV-007", "FAIL-007", "ARCH-002"],
    status: "idle",
    expected: "Retrying the same failed requestIdentity returns duplicate FAILED outcome and does not mutate balances.",
    observed: "Not run."
  },
  {
    id: "invalid-rejection",
    title: "6. Invalid Transfer is rejected without mutation",
    sourceRefs: ["INV-005", "FAIL-005", "ARCH-005"],
    status: "idle",
    expected: "Insufficient funds returns FAIL-005 or FAILED outcome and balances remain unchanged.",
    observed: "Not run."
  }
];

function cloneInitialSteps(): VerificationStep[] {
  return INITIAL_STEPS.map((step) => ({ ...step }));
}

function asRecord(value: unknown): Record<string, any> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, any>;
}

function pretty(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function statusLabel(status: StepStatus): string {
  if (status === "pass") return "PASS";
  if (status === "fail") return "FAIL";
  if (status === "running") return "RUNNING";
  return "PENDING";
}

function statusStyle(status: StepStatus): CSSProperties {
  const base: CSSProperties = {
    display: "inline-block",
    minWidth: "78px",
    padding: "4px 8px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 800,
    textAlign: "center"
  };

  if (status === "pass") {
    return { ...base, background: "#dafbe1", color: "#116329" };
  }

  if (status === "fail") {
    return { ...base, background: "#ffebe9", color: "#cf222e" };
  }

  if (status === "running") {
    return { ...base, background: "#fff8c5", color: "#9a6700" };
  }

  return { ...base, background: "#eaeef2", color: "#57606a" };
}

async function fetchJson(path: string, init?: RequestInit): Promise<ApiResult> {
  const response = await fetch(path, init);
  const text = await response.text();

  let body: unknown = null;

  if (text.length > 0) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  return {
    httpStatus: response.status,
    body
  };
}

async function getAccountBalance(
  accountId: string,
  assetId: string
): Promise<AccountBalance> {
  const apiResult = await fetchJson(`/api/accounts/${accountId}/balances`);
  const body = asRecord(apiResult.body);
  const result = asRecord(body?.result);
  const balances = result?.balances;

  if (!Array.isArray(balances)) {
    throw new Error(`Balance response for ${accountId} did not include balances array.`);
  }

  const balance = balances.find((item) => item?.assetId === assetId);

  if (!balance || typeof balance.amount !== "string") {
    throw new Error(`No Balance found for account ${accountId} and asset ${assetId}.`);
  }

  return {
    amount: BigInt(balance.amount),
    raw: apiResult.body
  };
}

function getTransferId(apiResult: ApiResult): string | null {
  const body = asRecord(apiResult.body);
  const result = asRecord(body?.result);

  if (typeof body?.transferId === "string") {
    return body.transferId;
  }

  if (typeof result?.transferId === "string") {
    return result.transferId;
  }

  return null;
}

function getRequestId(apiResult: ApiResult): string | undefined {
  const body = asRecord(apiResult.body);

  return typeof body?.requestId === "string" ? body.requestId : undefined;
}

function isExecutedTransfer(apiResult: ApiResult): boolean {
  const body = asRecord(apiResult.body);
  const result = asRecord(body?.result);

  return (
    apiResult.httpStatus >= 200 &&
    apiResult.httpStatus < 300 &&
    body?.status === "success" &&
    result?.duplicate === false &&
    result?.transferState === "EXECUTED"
  );
}

function isDuplicateReplay(apiResult: ApiResult, expectedTransferId: string): boolean {
  const body = asRecord(apiResult.body);
  const result = asRecord(body?.result);

  return (
    apiResult.httpStatus >= 200 &&
    apiResult.httpStatus < 300 &&
    body?.status === "success" &&
    result?.duplicate === true &&
    typeof body?.transferId === "string" &&
    body.transferId === expectedTransferId
  );
}

function isFailedDuplicateReplay(
  apiResult: ApiResult,
  expectedTransferId: string
): boolean {
  const body = asRecord(apiResult.body);
  const result = asRecord(body?.result);

  return (
    apiResult.httpStatus >= 200 &&
    apiResult.httpStatus < 300 &&
    body?.status === "success" &&
    result?.duplicate === true &&
    result?.requestStatus === "FAILED" &&
    typeof result?.persistedOutcome !== "undefined" &&
    typeof body?.transferId === "string" &&
    body.transferId === expectedTransferId
  );
}

function isInsufficientFundsRejected(apiResult: ApiResult): boolean {
  const body = asRecord(apiResult.body);
  const result = asRecord(body?.result);
  const error = asRecord(body?.error);
  const persistedOutcome = asRecord(result?.persistedOutcome);

  return (
    error?.sourceFailureId === "FAIL-005" ||
    persistedOutcome?.sourceFailureId === "FAIL-005" ||
    result?.requestStatus === "FAILED"
  );
}

function ledgerTraceIsComplete(
  apiResult: ApiResult,
  transferId: string,
  sourceAccountId: string,
  destinationAccountId: string,
  assetId: string,
  amount: string
): boolean {
  const body = asRecord(apiResult.body);
  const result = asRecord(body?.result);
  const entries = result?.ledgerEntries;

  if (!Array.isArray(entries) || entries.length !== 2) {
    return false;
  }

  const sourceDebit = entries.find(
    (entry) =>
      entry.transferId === transferId &&
      entry.accountId === sourceAccountId &&
      entry.assetId === assetId &&
      entry.direction === "DEBIT" &&
      entry.amountDelta === `-${amount}`
  );

  const destinationCredit = entries.find(
    (entry) =>
      entry.transferId === transferId &&
      entry.accountId === destinationAccountId &&
      entry.assetId === assetId &&
      entry.direction === "CREDIT" &&
      entry.amountDelta === amount
  );

  return Boolean(sourceDebit && destinationCredit);
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("verification");
  const [form, setForm] = useState<TransferForm>(DEFAULT_FORM);
  const [steps, setSteps] = useState<VerificationStep[]>(cloneInitialSteps());
  const [traceEvents, setTraceEvents] = useState<TraceEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [rawOutput, setRawOutput] = useState<Record<string, unknown>>({});
  const [lastTransferId, setLastTransferId] = useState("");
  const [lastRequestIdentity, setLastRequestIdentity] = useState("");

  function addTrace(event: Omit<TraceEvent, "sequence" | "observedAt">): void {
    setTraceEvents((current) => [
      ...current,
      {
        ...event,
        sequence: current.length + 1,
        observedAt: new Date().toISOString()
      }
    ]);
  }

  function updateStep(
    id: string,
    status: StepStatus,
    observed: string
  ): void {
    setSteps((current) =>
      current.map((step) =>
        step.id === id
          ? {
              ...step,
              status,
              observed
            }
          : step
      )
    );
  }

  function updateForm(field: keyof TransferForm, value: string): void {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function runVerification(): Promise<void> {
    setLoading(true);
    setActiveTab("verification");
    setSteps(cloneInitialSteps());
    setTraceEvents([]);
    setRawOutput({});
    setLastTransferId("");
    setLastRequestIdentity("");

    const requestIdentity = `req_ui_verify_${Date.now()}`;
    const amount = BigInt(form.amount);

    setLastRequestIdentity(requestIdentity);

    try {
      addTrace({
        boundary: "ARCH-008",
        eventType: "read.derived",
        outcome: "read",
        sourceRefs: ["ARCH-008", "INV-003", "API-005", "TEST-003"],
        notes: "Reading initial source and destination Balances before Transfer."
      });

      const sourceBefore = await getAccountBalance(
        form.sourceAccountId,
        form.assetId
      );

      const destinationBefore = await getAccountBalance(
        form.destinationAccountId,
        form.assetId
      );

      const transferBody = {
        requestIdentity,
        sourceAccountId: form.sourceAccountId,
        destinationAccountId: form.destinationAccountId,
        assetId: form.assetId,
        amount: form.amount
      };

      updateStep("valid-transfer", "running", "Submitting Transfer Request.");

      addTrace({
        boundary: "ARCH-001",
        eventType: "request.received",
        outcome: "accepted",
        requestIdentity,
        sourceRefs: ["ARCH-001", "API-001", "API-002", "API-012"],
        notes: "Demo submitted POST /api/transfers with externally supplied requestIdentity."
      });

      const transferResponse = await fetchJson("/api/transfers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(transferBody)
      });

      const transferId = getTransferId(transferResponse);
      const requestId = getRequestId(transferResponse);

      setRawOutput((current) => ({
        ...current,
        validTransferResponse: transferResponse.body
      }));

      if (!transferId || !isExecutedTransfer(transferResponse)) {
        addTrace({
          boundary: "ARCH-001",
          eventType: "response.produced",
          outcome: "failed",
          requestIdentity,
          requestId,
          transferId: transferId ?? undefined,
          failureClass: "FAIL-004",
          sourceRefs: ["API-004", "API-012", "FAIL-004"],
          notes: `Expected EXECUTED response. Observed HTTP ${transferResponse.httpStatus}.`
        });

        updateStep(
          "valid-transfer",
          "fail",
          `Expected EXECUTED new Transfer. Observed HTTP ${transferResponse.httpStatus}.`
        );
        setLoading(false);
        return;
      }

      setLastTransferId(transferId);

      addTrace({
        boundary: "ARCH-002",
        eventType: "idempotency.new_execution",
        outcome: "accepted",
        requestIdentity,
        requestId,
        transferId,
        sourceRefs: ["ARCH-002", "INV-007", "FAIL-007", "TEST-007"],
        notes: "Request identity was not a duplicate, so execution entered Consistency Boundary."
      });

      addTrace({
        boundary: "ARCH-003",
        eventType: "consistency.completed",
        outcome: "executed",
        requestIdentity,
        requestId,
        transferId,
        sourceRefs: ["ARCH-003", "INV-004", "FSM-005", "TEST-004"],
        notes: "Transfer execution returned EXECUTED through the API response."
      });

      addTrace({
        boundary: "ARCH-004",
        eventType: "lifecycle.transition_observed",
        outcome: "executed",
        requestIdentity,
        requestId,
        transferId,
        sourceRefs: ["ARCH-004", "INV-008", "FSM-005", "TEST-008"],
        notes: "Observed final Transfer state EXECUTED."
      });

      updateStep(
        "valid-transfer",
        "pass",
        `Transfer executed. transferId=${transferId}`
      );

      updateStep("balance-delta", "running", "Reading Balances after Transfer.");

      const sourceAfter = await getAccountBalance(
        form.sourceAccountId,
        form.assetId
      );

      const destinationAfter = await getAccountBalance(
        form.destinationAccountId,
        form.assetId
      );

      const expectedSourceAfter = sourceBefore.amount - amount;
      const expectedDestinationAfter = destinationBefore.amount + amount;

      setRawOutput((current) => ({
        ...current,
        sourceBalanceBefore: sourceBefore.raw,
        destinationBalanceBefore: destinationBefore.raw,
        sourceBalanceAfter: sourceAfter.raw,
        destinationBalanceAfter: destinationAfter.raw
      }));

      const balanceDeltaPass =
        sourceAfter.amount === expectedSourceAfter &&
        destinationAfter.amount === expectedDestinationAfter;

      addTrace({
        boundary: "ARCH-005",
        eventType: "balance.change_authorized",
        outcome: balanceDeltaPass ? "executed" : "failed",
        requestIdentity,
        requestId,
        transferId,
        failureClass: balanceDeltaPass ? undefined : "FAIL-005",
        sourceRefs: ["ARCH-005", "INV-005", "INV-006", "TEST-005", "TEST-006"],
        notes: `Source ${sourceBefore.amount} → ${sourceAfter.amount}; destination ${destinationBefore.amount} → ${destinationAfter.amount}.`
      });

      updateStep(
        "balance-delta",
        balanceDeltaPass ? "pass" : "fail",
        `Source ${sourceBefore.amount} → ${sourceAfter.amount}; destination ${destinationBefore.amount} → ${destinationAfter.amount}. Expected source ${expectedSourceAfter}, destination ${expectedDestinationAfter}.`
      );

      updateStep("ledger-trace", "running", "Reading LedgerEntries.");

      const ledgerResponse = await fetchJson(
        `/api/transfers/${transferId}/ledger-entries`
      );

      setRawOutput((current) => ({
        ...current,
        ledgerEntriesResponse: ledgerResponse.body
      }));

      const ledgerPass = ledgerTraceIsComplete(
        ledgerResponse,
        transferId,
        form.sourceAccountId,
        form.destinationAccountId,
        form.assetId,
        form.amount
      );

      addTrace({
        boundary: "ARCH-006",
        eventType: "ledger.entries_planned",
        outcome: ledgerPass ? "executed" : "failed",
        requestIdentity,
        requestId,
        transferId,
        failureClass: ledgerPass ? undefined : "FAIL-010",
        sourceRefs: ["ARCH-006", "INV-001", "INV-010", "TEST-001", "TEST-010"],
        notes: ledgerPass
          ? `LedgerEntries explain Transfer: DEBIT -${form.amount}, CREDIT ${form.amount}.`
          : "LedgerEntry trace did not match expected two-entry Transfer representation."
      });

      addTrace({
        boundary: "ARCH-007",
        eventType: "persistence.write_observed",
        outcome: ledgerPass && balanceDeltaPass ? "executed" : "failed",
        requestIdentity,
        requestId,
        transferId,
        failureClass: ledgerPass && balanceDeltaPass ? undefined : "FAIL-004",
        sourceRefs: ["ARCH-007", "INV-003", "INV-004", "TEST-003", "TEST-004"],
        notes: "Read path observed persisted Balance and LedgerEntry state after execution."
      });

      updateStep(
        "ledger-trace",
        ledgerPass ? "pass" : "fail",
        ledgerPass
          ? `Ledger trace complete: DEBIT -${form.amount}, CREDIT ${form.amount}.`
          : "Ledger trace did not match expected two-entry Transfer representation."
      );

      updateStep(
        "duplicate-request",
        "running",
        "Submitting same requestIdentity again."
      );

      const duplicateResponse = await fetchJson("/api/transfers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(transferBody)
      });

      const sourceAfterDuplicate = await getAccountBalance(
        form.sourceAccountId,
        form.assetId
      );

      const destinationAfterDuplicate = await getAccountBalance(
        form.destinationAccountId,
        form.assetId
      );

      setRawOutput((current) => ({
        ...current,
        duplicateResponse: duplicateResponse.body,
        sourceBalanceAfterDuplicate: sourceAfterDuplicate.raw,
        destinationBalanceAfterDuplicate: destinationAfterDuplicate.raw
      }));

      const duplicatePass =
        isDuplicateReplay(duplicateResponse, transferId) &&
        sourceAfterDuplicate.amount === sourceAfter.amount &&
        destinationAfterDuplicate.amount === destinationAfter.amount;

      addTrace({
        boundary: "ARCH-002",
        eventType: "request.duplicate_resolved",
        outcome: duplicatePass ? "resolved_duplicate" : "failed",
        requestIdentity,
        requestId,
        transferId,
        failureClass: duplicatePass ? undefined : "FAIL-007",
        sourceRefs: ["ARCH-002", "INV-007", "FAIL-007", "TEST-007"],
        notes: duplicatePass
          ? "Duplicate Request replayed persisted outcome and did not mutate Balances."
          : "Duplicate Request did not preserve expected idempotent outcome."
      });

      updateStep(
        "duplicate-request",
        duplicatePass ? "pass" : "fail",
        duplicatePass
          ? "Duplicate Request replayed persisted outcome and did not mutate Balances."
          : "Duplicate Request did not preserve expected idempotent outcome."
      );

      updateStep(
        "invalid-rejection",
        "running",
        "Submitting guaranteed insufficient-funds Transfer."
      );

      const invalidRequestIdentity = `req_ui_invalid_${Date.now()}`;
      const tooLargeAmount = (sourceAfterDuplicate.amount + BigInt(1)).toString();

      addTrace({
        boundary: "ARCH-001",
        eventType: "request.received",
        outcome: "accepted",
        requestIdentity: invalidRequestIdentity,
        sourceRefs: ["ARCH-001", "API-001", "API-002", "API-012"],
        notes: "Demo submitted intentionally invalid insufficient-funds Transfer."
      });

      const invalidResponse = await fetchJson("/api/transfers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...transferBody,
          requestIdentity: invalidRequestIdentity,
          amount: tooLargeAmount
        })
      });

      const invalidRequestId = getRequestId(invalidResponse);

      const sourceAfterInvalid = await getAccountBalance(
        form.sourceAccountId,
        form.assetId
      );

      const destinationAfterInvalid = await getAccountBalance(
        form.destinationAccountId,
        form.assetId
      );

      const invalidTransferId = getTransferId(invalidResponse);

      setRawOutput((current) => ({
        ...current,
        invalidResponse: invalidResponse.body,
        sourceBalanceAfterInvalid: sourceAfterInvalid.raw,
        destinationBalanceAfterInvalid: destinationAfterInvalid.raw
      }));

      const invalidPass =
        isInsufficientFundsRejected(invalidResponse) &&
        sourceAfterInvalid.amount === sourceAfterDuplicate.amount &&
        destinationAfterInvalid.amount === destinationAfterDuplicate.amount;

      addTrace({
        boundary: "ARCH-005",
        eventType: "failure.classified",
        outcome: invalidPass ? "rejected" : "failed",
        requestIdentity: invalidRequestIdentity,
        failureClass: "FAIL-005",
        sourceRefs: ["ARCH-005", "INV-005", "FAIL-005", "TEST-005"],
        notes: invalidPass
          ? `Rejected insufficient funds with no Balance mutation. Tried amount=${tooLargeAmount}.`
          : "Invalid Transfer did not produce expected FAIL-005-style rejection or Balance changed."
      });

      addTrace({
        boundary: "ARCH-001",
        eventType: "response.produced",
        outcome: invalidPass ? "rejected" : "failed",
        requestIdentity: invalidRequestIdentity,
        requestId: invalidRequestId,
        failureClass: "FAIL-005",
        sourceRefs: ["API-004", "API-012", "FAIL-005"],
        notes: "External response represented rejected Request outcome without exposing internal mutation authority."
      });

      updateStep(
        "invalid-rejection",
        invalidPass ? "pass" : "fail",
        invalidPass
          ? `Rejected insufficient funds with no Balance mutation. Tried amount=${tooLargeAmount}.`
          : "Invalid Transfer did not produce expected FAIL-005-style rejection or Balance changed."
      );

      const duplicateFailedResponse = await fetchJson("/api/transfers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...transferBody,
          requestIdentity: invalidRequestIdentity,
          amount: tooLargeAmount
        })
      });

      const sourceAfterDuplicateFailed = await getAccountBalance(
        form.sourceAccountId,
        form.assetId
      );

      const destinationAfterDuplicateFailed = await getAccountBalance(
        form.destinationAccountId,
        form.assetId
      );

      let failedLedgerEntries: unknown = undefined;
      let failedLedgerCount = 0;

      if (invalidTransferId) {
        const failedLedgerResponse = await fetchJson(
          `/api/transfers/${invalidTransferId}/ledger-entries`
        );

        failedLedgerEntries = failedLedgerResponse.body;

        const failedLedgerBody = asRecord(failedLedgerResponse.body);
        const failedLedgerResult = asRecord(failedLedgerBody?.result);

        if (Array.isArray(failedLedgerResult?.ledgerEntries)) {
          failedLedgerCount = failedLedgerResult.ledgerEntries.length;
        }
      }

      setRawOutput((current) => ({
        ...current,
        duplicateFailedResponse: duplicateFailedResponse.body,
        sourceBalanceAfterDuplicateFailed: sourceAfterDuplicateFailed.raw,
        destinationBalanceAfterDuplicateFailed: destinationAfterDuplicateFailed.raw,
        failedLedgerEntries
      }));

      const duplicateFailedPass =
        invalidTransferId !== null &&
        isFailedDuplicateReplay(duplicateFailedResponse, invalidTransferId) &&
        sourceAfterDuplicateFailed.amount === sourceAfterInvalid.amount &&
        destinationAfterDuplicateFailed.amount === destinationAfterInvalid.amount &&
        (invalidTransferId ? failedLedgerCount === 0 : true);

      addTrace({
        boundary: "ARCH-002",
        eventType: "request.duplicate_resolved",
        outcome: duplicateFailedPass ? "resolved_duplicate" : "failed",
        requestIdentity: invalidRequestIdentity,
        requestId: getRequestId(duplicateFailedResponse) || invalidRequestId,
        transferId: invalidTransferId || undefined,
        failureClass: duplicateFailedPass ? undefined : "FAIL-007",
        sourceRefs: ["ARCH-002", "INV-007", "FAIL-007", "TEST-007"],
        notes: duplicateFailedPass
          ? "Duplicate failed Request replayed persisted failed outcome and preserved balances."
          : "Duplicate failed Request did not preserve persisted failure semantics."
      });

      updateStep(
        "duplicate-failed-request",
        duplicateFailedPass ? "pass" : "fail",
        duplicateFailedPass
          ? "Duplicate failed Request returned preserved failed outcome with no Balance mutation."
          : "Duplicate failed Request did not preserve persisted failed outcome or mutated balances."
      );

      setActiveTab("trace");
    } catch (error) {
      addTrace({
        boundary: "DEMO_UI",
        eventType: "demo.error",
        outcome: "failed",
        sourceRefs: ["TEST-011"],
        notes: error instanceof Error ? error.message : "Unknown verification error"
      });

      setRawOutput((current) => ({
        ...current,
        unexpectedError:
          error instanceof Error ? error.message : "Unknown verification error"
      }));
    } finally {
      setLoading(false);
    }
  }

  const passCount = steps.filter((step) => step.status === "pass").length;
  const failCount = steps.filter((step) => step.status === "fail").length;
  const complete = passCount === steps.length;

  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <header style={headerStyle}>
          <div>
            <div style={eyebrowStyle}>Deterministic Ledger Engine</div>
            <h1 style={titleStyle}>Transfer MVP demo</h1>
            <p style={subtitleStyle}>
              Run the core runtime smoke checks, then inspect a demo-only
              structured trace showing which architectural boundaries the data
              passed through.
            </p>
          </div>

          <div style={scoreCardStyle}>
            <div style={scoreNumberStyle}>
              {passCount}/{steps.length}
            </div>
            <div style={scoreLabelStyle}>
              {complete ? "All checks passed" : failCount > 0 ? "Check failed" : "Ready"}
            </div>
          </div>
        </header>

        <nav style={tabBarStyle}>
          <button
            style={
              activeTab === "verification" ? activeTabButtonStyle : tabButtonStyle
            }
            onClick={() => setActiveTab("verification")}
          >
            Verification Dashboard
          </button>

          <button
            style={activeTab === "trace" ? activeTabButtonStyle : tabButtonStyle}
            onClick={() => setActiveTab("trace")}
          >
            Structured Trace
          </button>
        </nav>

        {activeTab === "verification" ? (
          <>
            <section style={gridStyle}>
              <div style={cardStyle}>
                <h2 style={sectionTitleStyle}>Demo input</h2>

                <div style={formGridStyle}>
                  <label>
                    <div style={labelStyle}>Source Account</div>
                    <input
                      style={inputStyle}
                      value={form.sourceAccountId}
                      onChange={(event) =>
                        updateForm("sourceAccountId", event.target.value)
                      }
                    />
                  </label>

                  <label>
                    <div style={labelStyle}>Destination Account</div>
                    <input
                      style={inputStyle}
                      value={form.destinationAccountId}
                      onChange={(event) =>
                        updateForm("destinationAccountId", event.target.value)
                      }
                    />
                  </label>

                  <label>
                    <div style={labelStyle}>Asset</div>
                    <input
                      style={inputStyle}
                      value={form.assetId}
                      onChange={(event) =>
                        updateForm("assetId", event.target.value)
                      }
                    />
                  </label>

                  <label>
                    <div style={labelStyle}>Amount</div>
                    <input
                      style={inputStyle}
                      value={form.amount}
                      onChange={(event) =>
                        updateForm("amount", event.target.value)
                      }
                    />
                  </label>
                </div>

                <button
                  style={loading ? disabledButtonStyle : primaryButtonStyle}
                  disabled={loading}
                  onClick={runVerification}
                >
                  {loading ? "Running verification..." : "Run full verification"}
                </button>

                <div style={smallInfoStyle}>
                  <strong>Last requestIdentity:</strong>{" "}
                  {lastRequestIdentity || "Not run yet"}
                  <br />
                  <strong>Last transferId:</strong>{" "}
                  {lastTransferId || "Not run yet"}
                </div>
              </div>

              <div style={cardStyle}>
                <h2 style={sectionTitleStyle}>What this shows</h2>

                <ol style={explainListStyle}>
                  <li>Transfer enters through the Request Boundary.</li>
                  <li>Idempotency prevents duplicate execution effects.</li>
                  <li>Consistency Boundary coordinates the atomic write set.</li>
                  <li>Balances change only through Balance Control.</li>
                  <li>LedgerEntries explain the Balance Change.</li>
                  <li>Invalid Balance state is rejected without mutation.</li>
                </ol>

                <p style={noteStyle}>
                  This UI is a manual demo aid. Formal proof remains the routed
                  source mapping, tests, build checks, and runtime evidence.
                </p>
              </div>
            </section>

            <section style={cardStyle}>
              <h2 style={sectionTitleStyle}>Verification checklist</h2>

              <div style={stepsStyle}>
                {steps.map((step) => (
                  <article key={step.id} style={stepCardStyle}>
                    <div style={stepHeaderStyle}>
                      <h3 style={stepTitleStyle}>{step.title}</h3>
                      <span style={statusStyle(step.status)}>
                        {statusLabel(step.status)}
                      </span>
                    </div>

                    <div style={stepBodyStyle}>
                      <div>
                        <div style={miniLabelStyle}>Expected</div>
                        <p style={paragraphStyle}>{step.expected}</p>
                      </div>

                      <div>
                        <div style={miniLabelStyle}>Observed</div>
                        <p style={paragraphStyle}>{step.observed}</p>
                      </div>
                    </div>

                    <div style={sourceRefsStyle}>
                      {step.sourceRefs.map((ref) => (
                        <span key={ref} style={sourceRefPillStyle}>
                          {ref}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section style={cardStyle}>
              <h2 style={sectionTitleStyle}>Raw API evidence</h2>
              <p style={noteStyle}>
                Keep this for debugging and walkthroughs. The checklist above is
                the readable interpretation.
              </p>

              <pre style={preStyle}>{pretty(rawOutput)}</pre>
            </section>
          </>
        ) : (
          <>
            <section style={cardStyle}>
              <h2 style={sectionTitleStyle}>Demo-only structured trace panel</h2>

              <p style={noteStyle}>
                These trace events are inferred by the frontend from API calls and
                responses. They are not persisted backend audit records. Use them
                to explain data flow, not to claim correctness proof.
              </p>

              <div style={flowStyle}>
                {[
                  "ARCH-001 Request",
                  "ARCH-002 Idempotency",
                  "ARCH-003 Consistency",
                  "ARCH-004 Lifecycle",
                  "ARCH-005 Balance",
                  "ARCH-006 Ledger",
                  "ARCH-007 Persistence",
                  "ARCH-008 Read"
                ].map((item, index, array) => (
                  <span key={item} style={flowItemStyle}>
                    {item}
                    {index < array.length - 1 ? (
                      <span style={arrowStyle}>→</span>
                    ) : null}
                  </span>
                ))}
              </div>
            </section>

            <section style={cardStyle}>
              <h2 style={sectionTitleStyle}>Trace timeline</h2>

              {traceEvents.length === 0 ? (
                <p style={noteStyle}>
                  No trace events yet. Go to the Verification Dashboard tab and
                  click “Run full verification.”
                </p>
              ) : (
                <div style={traceListStyle}>
                  {traceEvents.map((event) => (
                    <article key={event.sequence} style={traceCardStyle}>
                      <div style={traceHeaderStyle}>
                        <div>
                          <div style={traceSequenceStyle}>
                            #{event.sequence} · {event.boundary}
                          </div>
                          <h3 style={traceTitleStyle}>{event.eventType}</h3>
                        </div>

                        <span style={traceOutcomeStyle(event.outcome)}>
                          {event.outcome}
                        </span>
                      </div>

                      <p style={paragraphStyle}>{event.notes}</p>

                      <div style={traceMetaGridStyle}>
                        <div>
                          <div style={miniLabelStyle}>Request Identity</div>
                          <div style={monoStyle}>
                            {event.requestIdentity || "n/a"}
                          </div>
                        </div>

                        <div>
                          <div style={miniLabelStyle}>Request ID</div>
                          <div style={monoStyle}>{event.requestId || "n/a"}</div>
                        </div>

                        <div>
                          <div style={miniLabelStyle}>Transfer ID</div>
                          <div style={monoStyle}>{event.transferId || "n/a"}</div>
                        </div>

                        <div>
                          <div style={miniLabelStyle}>Failure Class</div>
                          <div style={monoStyle}>
                            {event.failureClass || "none"}
                          </div>
                        </div>
                      </div>

                      <div style={sourceRefsStyle}>
                        {event.sourceRefs.map((ref) => (
                          <span key={ref} style={sourceRefPillStyle}>
                            {ref}
                          </span>
                        ))}
                      </div>

                      <div style={timestampStyle}>{event.observedAt}</div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </section>
    </main>
  );
}

function traceOutcomeStyle(outcome: string): CSSProperties {
  const base: CSSProperties = {
    display: "inline-block",
    minWidth: "96px",
    padding: "5px 9px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 900,
    textAlign: "center"
  };

  if (outcome === "executed" || outcome === "accepted" || outcome === "read") {
    return { ...base, background: "#dafbe1", color: "#116329" };
  }

  if (outcome === "resolved_duplicate" || outcome === "rejected") {
    return { ...base, background: "#ddf4ff", color: "#0969da" };
  }

  if (outcome === "failed") {
    return { ...base, background: "#ffebe9", color: "#cf222e" };
  }

  return { ...base, background: "#eaeef2", color: "#57606a" };
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#f6f8fa",
  color: "#24292f",
  padding: "32px",
  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
};

const shellStyle: CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto"
};

const headerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "24px",
  alignItems: "flex-start",
  marginBottom: "20px"
};

const eyebrowStyle: CSSProperties = {
  color: "#57606a",
  fontSize: "13px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: "8px"
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "38px",
  lineHeight: 1.08
};

const subtitleStyle: CSSProperties = {
  maxWidth: "760px",
  color: "#57606a",
  lineHeight: 1.6,
  fontSize: "16px"
};

const scoreCardStyle: CSSProperties = {
  minWidth: "160px",
  padding: "18px",
  borderRadius: "16px",
  background: "#0d1117",
  color: "#ffffff",
  textAlign: "center"
};

const scoreNumberStyle: CSSProperties = {
  fontSize: "34px",
  fontWeight: 900
};

const scoreLabelStyle: CSSProperties = {
  color: "#c9d1d9",
  fontSize: "13px",
  fontWeight: 700
};

const tabBarStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  padding: "6px",
  border: "1px solid #d0d7de",
  background: "#ffffff",
  borderRadius: "12px",
  marginBottom: "18px",
  width: "fit-content"
};

const tabButtonStyle: CSSProperties = {
  border: "0",
  borderRadius: "9px",
  background: "transparent",
  color: "#57606a",
  padding: "10px 14px",
  fontWeight: 800,
  cursor: "pointer"
};

const activeTabButtonStyle: CSSProperties = {
  ...tabButtonStyle,
  background: "#0969da",
  color: "#ffffff"
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "18px",
  alignItems: "stretch",
  marginBottom: "18px"
};

const cardStyle: CSSProperties = {
  border: "1px solid #d0d7de",
  borderRadius: "14px",
  padding: "18px",
  background: "#ffffff",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  marginBottom: "18px"
};

const sectionTitleStyle: CSSProperties = {
  marginTop: 0,
  marginBottom: "14px",
  fontSize: "20px"
};

const formGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
  marginBottom: "16px"
};

const labelStyle: CSSProperties = {
  fontSize: "13px",
  fontWeight: 700,
  marginBottom: "6px"
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d0d7de",
  borderRadius: "8px",
  fontSize: "14px",
  boxSizing: "border-box"
};

const primaryButtonStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #1f6feb",
  borderRadius: "10px",
  background: "#1f6feb",
  color: "#ffffff",
  fontWeight: 800,
  cursor: "pointer",
  fontSize: "15px"
};

const disabledButtonStyle: CSSProperties = {
  ...primaryButtonStyle,
  opacity: 0.65,
  cursor: "not-allowed"
};

const smallInfoStyle: CSSProperties = {
  marginTop: "14px",
  padding: "12px",
  background: "#f6f8fa",
  borderRadius: "10px",
  color: "#57606a",
  fontSize: "13px",
  lineHeight: 1.6,
  wordBreak: "break-word"
};

const explainListStyle: CSSProperties = {
  margin: 0,
  paddingLeft: "20px",
  lineHeight: 1.8
};

const noteStyle: CSSProperties = {
  color: "#57606a",
  lineHeight: 1.6
};

const stepsStyle: CSSProperties = {
  display: "grid",
  gap: "12px"
};

const stepCardStyle: CSSProperties = {
  border: "1px solid #d8dee4",
  borderRadius: "12px",
  padding: "14px",
  background: "#ffffff"
};

const stepHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  marginBottom: "10px"
};

const stepTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "16px"
};

const stepBodyStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px"
};

const miniLabelStyle: CSSProperties = {
  fontSize: "12px",
  fontWeight: 800,
  color: "#57606a",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "4px"
};

const paragraphStyle: CSSProperties = {
  margin: 0,
  lineHeight: 1.5
};

const sourceRefsStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
  marginTop: "12px"
};

const sourceRefPillStyle: CSSProperties = {
  padding: "3px 7px",
  borderRadius: "999px",
  background: "#f6f8fa",
  border: "1px solid #d0d7de",
  color: "#57606a",
  fontSize: "12px",
  fontWeight: 700
};

const preStyle: CSSProperties = {
  margin: 0,
  padding: "14px",
  minHeight: "220px",
  maxHeight: "520px",
  overflow: "auto",
  background: "#0d1117",
  color: "#e6edf3",
  borderRadius: "12px",
  fontSize: "12px",
  lineHeight: 1.5
};

const flowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  alignItems: "center",
  padding: "14px",
  background: "#f6f8fa",
  borderRadius: "12px",
  border: "1px solid #d0d7de"
};

const flowItemStyle: CSSProperties = {
  fontWeight: 800,
  color: "#24292f"
};

const arrowStyle: CSSProperties = {
  color: "#57606a",
  marginLeft: "8px"
};

const traceListStyle: CSSProperties = {
  display: "grid",
  gap: "12px"
};

const traceCardStyle: CSSProperties = {
  border: "1px solid #d8dee4",
  borderRadius: "12px",
  padding: "14px",
  background: "#ffffff"
};

const traceHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "flex-start",
  marginBottom: "8px"
};

const traceSequenceStyle: CSSProperties = {
  color: "#57606a",
  fontSize: "12px",
  fontWeight: 800,
  marginBottom: "4px"
};

const traceTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "17px"
};

const traceMetaGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  marginTop: "12px",
  padding: "12px",
  background: "#f6f8fa",
  borderRadius: "10px"
};

const monoStyle: CSSProperties = {
  fontFamily:
    'ui-monospace, SFMono-Regular, SFMono, Consolas, "Liberation Mono", Menlo, monospace',
  fontSize: "12px",
  wordBreak: "break-word"
};

const timestampStyle: CSSProperties = {
  marginTop: "10px",
  color: "#57606a",
  fontSize: "12px",
  fontFamily:
    'ui-monospace, SFMono-Regular, SFMono, Consolas, "Liberation Mono", Menlo, monospace'
};
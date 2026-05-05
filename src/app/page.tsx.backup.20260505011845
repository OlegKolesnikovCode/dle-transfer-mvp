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

type VerificationStep = {
  id: string;
  title: string;
  sourceRefs: string[];
  status: StepStatus;
  expected: string;
  observed: string;
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
    id: "invalid-rejection",
    title: "5. Invalid Transfer is rejected without mutation",
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
  const [form, setForm] = useState<TransferForm>(DEFAULT_FORM);
  const [steps, setSteps] = useState<VerificationStep[]>(cloneInitialSteps());
  const [loading, setLoading] = useState(false);
  const [rawOutput, setRawOutput] = useState<Record<string, unknown>>({});
  const [lastTransferId, setLastTransferId] = useState("");
  const [lastRequestIdentity, setLastRequestIdentity] = useState("");

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
    setSteps(cloneInitialSteps());
    setRawOutput({});
    setLastTransferId("");
    setLastRequestIdentity("");

    const requestIdentity = `req_ui_verify_${Date.now()}`;
    const amount = BigInt(form.amount);

    setLastRequestIdentity(requestIdentity);

    try {
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

      const transferResponse = await fetchJson("/api/transfers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(transferBody)
      });

      const transferId = getTransferId(transferResponse);

      setRawOutput((current) => ({
        ...current,
        validTransferResponse: transferResponse.body
      }));

      if (!transferId || !isExecutedTransfer(transferResponse)) {
        updateStep(
          "valid-transfer",
          "fail",
          `Expected EXECUTED new Transfer. Observed HTTP ${transferResponse.httpStatus}.`
        );
        setLoading(false);
        return;
      }

      setLastTransferId(transferId);

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

      const sourceAfterInvalid = await getAccountBalance(
        form.sourceAccountId,
        form.assetId
      );

      const destinationAfterInvalid = await getAccountBalance(
        form.destinationAccountId,
        form.assetId
      );

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

      updateStep(
        "invalid-rejection",
        invalidPass ? "pass" : "fail",
        invalidPass
          ? `Rejected insufficient funds with no Balance mutation. Tried amount=${tooLargeAmount}.`
          : "Invalid Transfer did not produce expected FAIL-005-style rejection or Balance changed."
      );
    } catch (error) {
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
            <h1 style={titleStyle}>Transfer MVP verification dashboard</h1>
            <p style={subtitleStyle}>
              One click runs the core runtime smoke checks: valid Transfer,
              Balance delta, LedgerEntry trace, duplicate Request replay, and
              insufficient-funds rejection.
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
                  onChange={(event) => updateForm("assetId", event.target.value)}
                />
              </label>

              <label>
                <div style={labelStyle}>Amount</div>
                <input
                  style={inputStyle}
                  value={form.amount}
                  onChange={(event) => updateForm("amount", event.target.value)}
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
              <strong>Last transferId:</strong> {lastTransferId || "Not run yet"}
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>What this proves visually</h2>

            <ol style={explainListStyle}>
              <li>Transfer must execute through the routed API path.</li>
              <li>Balances must change by the exact atomic-unit amount.</li>
              <li>LedgerEntries must explain the Balance Change.</li>
              <li>Duplicate Request must not create another mutation.</li>
              <li>Invalid Balance state must be rejected without mutation.</li>
            </ol>

            <p style={noteStyle}>
              This dashboard is a demo aid. Formal proof remains the routed source
              mapping, tests, build checks, and runtime evidence.
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
            Keep this for debugging and interview walkthroughs. The checklist above
            is the readable interpretation.
          </p>

          <pre style={preStyle}>{pretty(rawOutput)}</pre>
        </section>
      </section>
    </main>
  );
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
  marginBottom: "24px"
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
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
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
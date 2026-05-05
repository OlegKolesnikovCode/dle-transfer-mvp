"use client";

import { useMemo, useState } from "react";

type JsonValue = unknown;

type TransferForm = {
  requestIdentity: string;
  sourceAccountId: string;
  destinationAccountId: string;
  assetId: string;
  amount: string;
};

const DEFAULT_FORM: TransferForm = {
  requestIdentity: "req_demo_" + Date.now().toString(),
  sourceAccountId: "acct_source_demo",
  destinationAccountId: "acct_destination_demo",
  assetId: "asset_usd_atomic",
  amount: "100"
};

const cardStyle: React.CSSProperties = {
  border: "1px solid #d0d7de",
  borderRadius: "12px",
  padding: "18px",
  background: "#ffffff",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d0d7de",
  borderRadius: "8px",
  fontSize: "14px"
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 14px",
  border: "1px solid #1f6feb",
  borderRadius: "8px",
  background: "#1f6feb",
  color: "#ffffff",
  fontWeight: 600,
  cursor: "pointer"
};

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: "#ffffff",
  color: "#1f6feb"
};

function pretty(value: JsonValue): string {
  return JSON.stringify(value, null, 2);
}

async function readJsonResponse(response: Response): Promise<JsonValue> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export default function Home() {
  const [form, setForm] = useState<TransferForm>(DEFAULT_FORM);
  const [lastTransferId, setLastTransferId] = useState("");
  const [selectedTransferId, setSelectedTransferId] = useState("");
  const [sourceBalances, setSourceBalances] = useState<JsonValue>(null);
  const [destinationBalances, setDestinationBalances] = useState<JsonValue>(null);
  const [transferRead, setTransferRead] = useState<JsonValue>(null);
  const [ledgerEntries, setLedgerEntries] = useState<JsonValue>(null);
  const [result, setResult] = useState<JsonValue>(null);
  const [loading, setLoading] = useState(false);

  const activeTransferId = useMemo(
    () => selectedTransferId || lastTransferId,
    [selectedTransferId, lastTransferId]
  );

  function updateField(field: keyof TransferForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function submitTransfer(bodyOverride?: Partial<TransferForm>) {
    setLoading(true);

    try {
      const body = {
        ...form,
        ...bodyOverride
      };

      const response = await fetch("/api/transfers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const json = await readJsonResponse(response);

      setResult({
        httpStatus: response.status,
        body: json
      });

      const maybeTransferId =
        typeof json === "object" &&
        json !== null &&
        "transferId" in json &&
        typeof json.transferId === "string"
          ? json.transferId
          : undefined;

      if (maybeTransferId) {
        setLastTransferId(maybeTransferId);
        setSelectedTransferId(maybeTransferId);
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadBalances() {
    setLoading(true);

    try {
      const [sourceResponse, destinationResponse] = await Promise.all([
        fetch(`/api/accounts/${form.sourceAccountId}/balances`),
        fetch(`/api/accounts/${form.destinationAccountId}/balances`)
      ]);

      setSourceBalances({
        httpStatus: sourceResponse.status,
        body: await readJsonResponse(sourceResponse)
      });

      setDestinationBalances({
        httpStatus: destinationResponse.status,
        body: await readJsonResponse(destinationResponse)
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadTransfer() {
    if (!activeTransferId) {
      setResult({
        error: "No transferId available. Submit a Transfer first or paste one."
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/transfers/${activeTransferId}`);

      setTransferRead({
        httpStatus: response.status,
        body: await readJsonResponse(response)
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadLedgerEntries() {
    if (!activeTransferId) {
      setResult({
        error: "No transferId available. Submit a Transfer first or paste one."
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/transfers/${activeTransferId}/ledger-entries`
      );

      setLedgerEntries({
        httpStatus: response.status,
        body: await readJsonResponse(response)
      });
    } finally {
      setLoading(false);
    }
  }

  async function runHappyPathDemo() {
    const requestIdentity = "req_ui_demo_" + Date.now().toString();

    setForm((current) => ({
      ...current,
      requestIdentity,
      amount: "100"
    }));

    await submitTransfer({
      requestIdentity,
      amount: "100"
    });

    await loadBalances();
  }

  async function runDuplicateDemo() {
    await submitTransfer({
      requestIdentity: form.requestIdentity
    });

    await loadBalances();
  }

  async function runInsufficientFundsDemo() {
    const requestIdentity = "req_ui_insufficient_" + Date.now().toString();

    setForm((current) => ({
      ...current,
      requestIdentity,
      amount: "1000000000"
    }));

    await submitTransfer({
      requestIdentity,
      amount: "1000000000"
    });

    await loadBalances();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f8fa",
        color: "#24292f",
        padding: "32px",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}
    >
      <section style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <header style={{ marginBottom: "24px" }}>
          <p
            style={{
              margin: "0 0 8px",
              color: "#57606a",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase"
            }}
          >
            Deterministic Ledger Engine
          </p>

          <h1 style={{ margin: 0, fontSize: "36px", lineHeight: 1.1 }}>
            Transfer-only MVP demo
          </h1>

          <p style={{ maxWidth: "760px", color: "#57606a", lineHeight: 1.6 }}>
            This page exercises the routed API surface: submit a Transfer,
            replay the same Request identity, read Balances, inspect a Transfer,
            and inspect LedgerEntries.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(320px, 420px) 1fr",
            gap: "18px",
            alignItems: "start"
          }}
        >
          <section style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Transfer Request</h2>

            <div style={{ display: "grid", gap: "12px" }}>
              <label>
                <div>requestIdentity</div>
                <input
                  style={inputStyle}
                  value={form.requestIdentity}
                  onChange={(event) =>
                    updateField("requestIdentity", event.target.value)
                  }
                />
              </label>

              <label>
                <div>sourceAccountId</div>
                <input
                  style={inputStyle}
                  value={form.sourceAccountId}
                  onChange={(event) =>
                    updateField("sourceAccountId", event.target.value)
                  }
                />
              </label>

              <label>
                <div>destinationAccountId</div>
                <input
                  style={inputStyle}
                  value={form.destinationAccountId}
                  onChange={(event) =>
                    updateField("destinationAccountId", event.target.value)
                  }
                />
              </label>

              <label>
                <div>assetId</div>
                <input
                  style={inputStyle}
                  value={form.assetId}
                  onChange={(event) => updateField("assetId", event.target.value)}
                />
              </label>

              <label>
                <div>amount</div>
                <input
                  style={inputStyle}
                  value={form.amount}
                  onChange={(event) => updateField("amount", event.target.value)}
                />
              </label>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "18px"
              }}
            >
              <button
                style={buttonStyle}
                disabled={loading}
                onClick={() => submitTransfer()}
              >
                Submit Transfer
              </button>

              <button
                style={secondaryButtonStyle}
                disabled={loading}
                onClick={runHappyPathDemo}
              >
                Happy Path
              </button>

              <button
                style={secondaryButtonStyle}
                disabled={loading}
                onClick={runDuplicateDemo}
              >
                Duplicate Request
              </button>

              <button
                style={secondaryButtonStyle}
                disabled={loading}
                onClick={runInsufficientFundsDemo}
              >
                Insufficient Funds
              </button>
            </div>
          </section>

          <section style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Read / Trace</h2>

            <div style={{ display: "grid", gap: "12px" }}>
              <label>
                <div>transferId</div>
                <input
                  style={inputStyle}
                  value={selectedTransferId}
                  placeholder={lastTransferId || "Submit a Transfer first"}
                  onChange={(event) => setSelectedTransferId(event.target.value)}
                />
              </label>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <button
                  style={buttonStyle}
                  disabled={loading}
                  onClick={loadBalances}
                >
                  Load Balances
                </button>

                <button
                  style={secondaryButtonStyle}
                  disabled={loading}
                  onClick={loadTransfer}
                >
                  Read Transfer
                </button>

                <button
                  style={secondaryButtonStyle}
                  disabled={loading}
                  onClick={loadLedgerEntries}
                >
                  Read LedgerEntries
                </button>
              </div>
            </div>

            <div
              style={{
                marginTop: "18px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px"
              }}
            >
              <div>
                <h3>Source Balance</h3>
                <pre style={preStyle}>{pretty(sourceBalances)}</pre>
              </div>

              <div>
                <h3>Destination Balance</h3>
                <pre style={preStyle}>{pretty(destinationBalances)}</pre>
              </div>
            </div>
          </section>
        </div>

        <section
          style={{
            ...cardStyle,
            marginTop: "18px"
          }}
        >
          <h2 style={{ marginTop: 0 }}>Operation Result</h2>
          <pre style={preStyle}>{pretty(result)}</pre>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "18px",
            marginTop: "18px"
          }}
        >
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Transfer Read</h2>
            <pre style={preStyle}>{pretty(transferRead)}</pre>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>LedgerEntry Trace</h2>
            <pre style={preStyle}>{pretty(ledgerEntries)}</pre>
          </div>
        </section>
      </section>
    </main>
  );
}

const preStyle: React.CSSProperties = {
  margin: 0,
  padding: "12px",
  minHeight: "120px",
  maxHeight: "360px",
  overflow: "auto",
  background: "#0d1117",
  color: "#e6edf3",
  borderRadius: "10px",
  fontSize: "12px",
  lineHeight: 1.5
};
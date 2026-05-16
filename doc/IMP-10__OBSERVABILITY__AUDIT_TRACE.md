# IMP-10__OBSERVABILITY__AUDIT_TRACE.md

## AUTHORITY_STATUS

NON_AUTHORITATIVE_IMPLEMENTATION_GUIDANCE

This file guides audit and trace visibility implementation for the DLE-2 Transfer-only MVP.

This file is NOT correctness authority.

Correctness authority remains exclusively with L00–L10.

This file MUST NOT:
- define correctness rules
- define invariants
- define failure classes
- define lifecycle rules
- define architecture rules
- define schema rules
- define API rules
- define authorization rules
- define verification requirements
- define source-owned IDs
- treat logs as proof of correctness
- treat timestamps as replay authority, ordering authority, idempotency authority, or proof of correctness
- override, reinterpret, weaken, or extend L00–L10
- use observability output as source authority

If this file conflicts with L00–L10, L00–L10 win.

If this file conflicts with I00 source lookup or traceability metadata, I00 wins.

If this file conflicts with IMP-INDEX routing, IMP-INDEX wins unless L00–L10 or I00 are violated.

---

## PURPOSE

Define the minimum audit and trace visibility guidance needed for the Transfer-only MVP.

Observability exists to make execution inspectable.

Observability does not prove correctness.

Correctness proof still requires:
- source rule reference
- implementation ownership
- invalid-path rejection
- TEST coverage
- observed passing behavior

---

## SOURCE REFERENCES

This file is guided by:

- L03 — Invariants
- L04 — Failure Model
- L06 — Architecture
- L08 — API Contracts
- L10 — Verification
- I00 — Source indexing and traceability metadata
- IMP-INDEX — Implementation/codegen routing

Primary source IDs referenced by this guidance:

- INV-001
- INV-002
- INV-003
- INV-004
- INV-005
- INV-006
- INV-007
- INV-008
- INV-009
- INV-010
- FAIL-001
- FAIL-002
- FAIL-003
- FAIL-004
- FAIL-005
- FAIL-006
- FAIL-007
- FAIL-008
- FAIL-009
- FAIL-010
- ARCH-001
- ARCH-002
- ARCH-003
- ARCH-004
- ARCH-005
- ARCH-006
- ARCH-007
- ARCH-008
- ARCH-009
- API-001
- API-002
- API-003
- API-004
- API-005
- API-006
- API-007
- API-008
- API-009
- API-010
- API-011
- API-012
- API-013
- TEST-001
- TEST-002
- TEST-003
- TEST-004
- TEST-005
- TEST-006
- TEST-007
- TEST-008
- TEST-009
- TEST-010
- TEST-011
- TEST-012

---

## OBSERVABILITY PRINCIPLE

Audit trace MUST answer:

1. Which Request entered the system?
2. Which Transfer did the Request resolve to?
3. Which architectural boundary handled the Request?
4. Which invariant or failure class is relevant to the observed outcome?
5. Which Response was produced for the Request?
6. Which LedgerEntries explain the executed Transfer?
7. Which TEST case verifies the behavior?

Audit trace MUST NOT answer by assertion alone:

- “The system is correct.”
- “The Balance is valid.”
- “The Request was idempotent.”
- “The Transfer was atomic.”
- “Replay determinism holds.”

Those claims require verification through TEST-* coverage.

---

## OBSERVABILITY SCOPE

### IN SCOPE

Audit and trace visibility for:

- Request submission
- Request identity
- duplicate Request resolution
- Transfer identity
- Transfer lifecycle observation
- Balance-affecting execution path observation
- LedgerEntry association
- failure classification
- Response pairing
- API boundary behavior
- verification traceability

### OUT OF SCOPE

This file does not define:

- correctness rules
- source-owned IDs
- runtime logging library
- log transport
- log storage backend
- dashboard tooling
- alerting system
- distributed tracing system
- external observability platform
- recovery procedures
- production incident policy

---

## AUDIT TRACE MODEL

Each audit trace record SHOULD be structured as observable metadata around source-owned behavior.

Audit trace records MAY include source-owned IDs as references.

Audit trace records MUST NOT create new source-owned IDs.

Audit trace records MUST NOT redefine source-owned IDs.

### Minimum audit trace fields

| Field | Purpose | Required |
|---|---|---|
| `traceId` | Correlates related audit observations | Yes |
| `requestIdentity` | Preserved external Request identity | Yes |
| `requestId` | Persisted Request identity, if available | When persisted |
| `transferId` | Transfer identity, if available | When created or resolved |
| `operationType` | Must be `Transfer` for MVP Balance-Affecting Operations | Yes |
| `boundary` | Architectural boundary where observation occurred | Yes |
| `eventType` | Implementation event category | Yes |
| `outcome` | `accepted`, `rejected`, `resolved_duplicate`, `executed`, `failed`, or `read` | Yes |
| `failureClass` | FAIL-* reference when behavior maps to failure | When failed/rejected |
| `sourceRefs` | Relevant INV-*, FAIL-*, ARCH-*, API-*, TEST-* references | Yes |
| `responseStatus` | External Response status/category | For API observations |
| `ledgerEntryIds` | LedgerEntry IDs associated with executed Transfer | When executed |
| `createdAt` | Observation timestamp only | Yes |

---

## TIMESTAMP RULE

Timestamps MAY be recorded for human inspection and debugging.

Timestamps MUST NOT be used as:
- replay authority
- ordering authority
- idempotency authority
- correctness proof
- LedgerEntry authority
- lifecycle authority
- Balance authority

If ordering matters for correctness, correctness MUST come from persisted relationships, lifecycle state, LedgerEntry history, Request identity, and TEST coverage — not timestamp order.

---

## EVENT TYPES

Implementation event types are guidance labels only.

They are not source-owned IDs.

| Event Type | Boundary | Source References |
|---|---|---|
| `request.received` | ARCH-001 | API-001, API-002, API-003, API-012 |
| `request.rejected` | ARCH-001 | API-007, API-008, API-009, API-010, API-012 |
| `request.duplicate_resolved` | ARCH-002 | INV-007, FAIL-007, API-003, API-006, API-008, TEST-007 |
| `consistency.started` | ARCH-003 | INV-004, INV-009, FAIL-004, FAIL-009, TEST-004, TEST-009 |
| `lifecycle.transition_observed` | ARCH-004 | INV-008, FAIL-008, TEST-008 |
| `balance.change_authorized` | ARCH-005 | INV-001, INV-005, INV-006, TEST-001, TEST-005, TEST-006 |
| `ledger.entries_planned` | ARCH-006 | INV-001, INV-002, INV-010, TEST-001, TEST-002, TEST-010 |
| `persistence.write_observed` | ARCH-007 | INV-003, INV-004, INV-009, TEST-003, TEST-004, TEST-009 |
| `response.produced` | ARCH-001 | API-004, API-005, API-006, API-011, API-012, TEST-011 |
| `read.derived` | ARCH-008 | INV-001, INV-003, API-005, TEST-001, TEST-003, TEST-011 |
| `failure.classified` | Applicable boundary | FAIL-001 through FAIL-010, TEST-001 through TEST-012 |

---

## REQUIRED TRACE POINTS

### 1. Request Boundary Trace

Record when a Request enters the system.

Required visibility:
- `traceId`
- `requestIdentity`
- `operationType`
- `boundary = ARCH-001`
- relevant API-* references
- accepted or rejected outcome

MUST NOT record:
- direct Balance mutation authority
- direct LedgerEntry creation authority
- lifecycle-state override authority
- internal boundary selection from external input

---

### 2. Idempotency Control Trace

Record duplicate Request resolution.

Required visibility:
- `traceId`
- `requestIdentity`
- prior persisted outcome, if duplicate
- resolved Transfer or failure outcome
- `boundary = ARCH-002`
- `sourceRefs` including INV-007, FAIL-007, API-003, API-006, API-008, TEST-007

MUST NOT treat duplicate detection logs as proof that idempotency holds.

Idempotency proof requires TEST-007.

---

### 3. Consistency Boundary Trace

Record entry into and completion of Consistency Boundary execution.

Required visibility:
- `traceId`
- `requestIdentity`
- `transferId`
- `boundary = ARCH-003`
- transaction-scoped observation marker
- completed or failed outcome
- source references for INV-004, INV-009, FAIL-004, FAIL-009, TEST-004, TEST-009

MUST NOT expose transaction internals through external API Response.

MUST NOT treat transaction logs as proof of atomicity.

Atomicity proof requires TEST-004.

---

### 4. Lifecycle Control Trace

Record lifecycle transition observations.

Required visibility:
- `traceId`
- `transferId`
- prior observed state
- next observed state
- `boundary = ARCH-004`
- source references for INV-008, FAIL-008, TEST-008

MUST NOT allow logs to select lifecycle state.

MUST NOT treat lifecycle logs as lifecycle authority.

Lifecycle proof requires TEST-008.

---

### 5. Balance Control Trace

Record Balance Change authorization observation.

Required visibility:
- `traceId`
- `transferId`
- source Account reference
- destination Account reference
- Asset reference
- amount representation
- `boundary = ARCH-005`
- source references for INV-001, INV-005, INV-006, FAIL-001, FAIL-005, FAIL-006, TEST-001, TEST-005, TEST-006

MUST NOT record audit output as Balance authority.

MUST NOT create Balance mutation from observability logic.

---

### 6. Ledger Control Trace

Record LedgerEntry creation intent or observed LedgerEntry association.

Required visibility:
- `traceId`
- `transferId`
- planned or persisted LedgerEntry IDs
- Account references
- Asset reference
- amount representation
- `boundary = ARCH-006`
- source references for INV-001, INV-002, INV-010, FAIL-001, FAIL-002, FAIL-010, TEST-001, TEST-002, TEST-010

MUST NOT create LedgerEntries from observability logic.

MUST NOT treat audit trail as a substitute for LedgerEntry history.

---

### 7. Persistence Boundary Trace

Record durable write observation.

Required visibility:
- `traceId`
- `requestId`
- `transferId`
- `ledgerEntryIds`
- `boundary = ARCH-007`
- source references for INV-003, INV-004, INV-009, TEST-003, TEST-004, TEST-009

MUST NOT embed business decision authority in persistence logs.

MUST NOT use persistence logs as replay authority.

Replay proof requires TEST-003.

---

### 8. Read Derivation Boundary Trace

Record derived read observations.

Required visibility:
- `traceId`
- read target
- `boundary = ARCH-008`
- source references for INV-001, INV-003, API-005, TEST-001, TEST-003, TEST-011

MUST NOT allow read traces to mutate state.

MUST NOT treat read output as independently authoritative over LedgerEntry-derived state.

---

### 9. API Response Trace

Record Response pairing to exactly one Request.

Required visibility:
- `traceId`
- `requestIdentity`
- `requestId`, if persisted
- `transferId`, if available
- response status/category
- source references for API-004, API-005, API-006, API-011, API-012, TEST-011

MUST NOT expose internal control boundaries in external Response.

MUST NOT create new system state through Response construction.

---

### 10. Failure Trace

Record failure classification when invalid behavior is rejected or detected.

Required visibility:
- `traceId`
- `requestIdentity`, if available
- `transferId`, if available
- `failureClass`
- failed boundary
- source references for relevant FAIL-* and TEST-* IDs
- rejected or failed outcome

Failure trace MUST map to one or more FAIL-* references.

Failure trace MUST NOT invent implementation-only failure classes as correctness authority.

Implementation-specific errors may exist only as mappings to source-owned FAIL-* references.

---

## AUDIT TRACE BY TEST CASE

| Test | Required Audit Visibility |
|---|---|
| TEST-001 | Balance Change trace links to LedgerEntry IDs |
| TEST-002 | LedgerEntry update/delete attempt is observable as rejected or impossible |
| TEST-003 | Read derivation or replay check can identify LedgerEntry-derived state |
| TEST-004 | partial operation attempt is observable as failed/rejected without complete state |
| TEST-005 | invalid Balance state rejection is observable |
| TEST-006 | Asset mismatch rejection is observable |
| TEST-007 | duplicate Request resolution is observable without duplicate LedgerEntries |
| TEST-008 | lifecycle transition rejection or valid transition observation is visible |
| TEST-009 | external correctness dependency is not required by trace output |
| TEST-010 | executed Transfer trace includes required LedgerEntry association |
| TEST-011 | API Response is traceable to exactly one Request |
| TEST-012 | authorization-related rejection, if present, is observable without mutation |

---

## OBSERVABILITY IMPLEMENTATION GUIDANCE

### Recommended internal helper shape

If implemented, audit helpers SHOULD remain simple and dependency-light.

Suggested location, only if routed by IMP-INDEX or IMP-01:

```txt
src/lib/audit.ts
```

If src/lib/audit.ts is not routed, treat it as ROUTING_GAP.

Do not create this file unless the file manifest or routing matrix explicitly permits it.

### Acceptable implementation shape

Audit helpers MAY expose:

```txt
recordAuditEvent(event)
```

Audit helpers MAY write to:

- console in development
- test-visible in-memory sink
- persisted audit table only if explicitly routed and schema-approved

Audit helpers MUST NOT:

- import server control-boundary files
- open transactions
- call Prisma directly unless explicitly routed
- mutate Balance
- create LedgerEntry
- change Transfer lifecycle state
- resolve Request identity
- produce API Response
- participate in correctness decisions

### MINIMUM AUDIT EVENT SHAPE

This is implementation guidance only.

```ts
type AuditEvent = {
  traceId: string;
  requestIdentity?: string;
  requestId?: string;
  transferId?: string;
  operationType: "Transfer";
  boundary:
    | "ARCH-001"
    | "ARCH-002"
    | "ARCH-003"
    | "ARCH-004"
    | "ARCH-005"
    | "ARCH-006"
    | "ARCH-007"
    | "ARCH-008";
  eventType: string;
  outcome:
    | "accepted"
    | "rejected"
    | "resolved_duplicate"
    | "executed"
    | "failed"
    | "read";
  failureClass?:
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
  sourceRefs: string[];
  ledgerEntryIds?: string[];
  createdAt: string;
};
```

This type shape MUST NOT be treated as source authority.

It is only a suggested implementation representation for trace visibility.

### OBSERVABILITY SAFETY RULES

Audit trace MUST be side-effect isolated.

Audit logic MUST NOT:

- decide whether a Request is valid
- decide whether a Transfer may execute
- authorize Balance Changes
- create LedgerEntries
- write Balance state
- write Transfer lifecycle state
- write Request outcome
- create alternate execution paths
- expose internal boundaries through API Responses
- become required for correctness

If audit logging fails, correctness behavior MUST NOT depend on the audit logging result.

For MVP, audit failure SHOULD NOT cause a valid Transfer to become invalid unless explicitly routed and source-supported elsewhere.

### WHAT NOT TO LOG

Do not log:

- secrets
- raw authorization credentials
- private tokens
- database connection strings
- full internal transaction objects
- raw stack traces in external Responses
- external identity provider payloads
- mutable object references
- derived correctness claims not backed by TEST-* coverage

### OBSERVABILITY IS NOT PROOF

Audit trace improves inspectability.

Audit trace does not replace:

- LedgerEntry history
- persisted Request outcome
- lifecycle enforcement
- architectural boundary enforcement
- invalid-path rejection
- TEST-* verification
- source traceability

A log entry saying an invariant was preserved is not proof.

A timestamp showing sequence is not proof.

A successful request log is not proof.

A passing test mapped to source references is required for proof.

### VALIDITY CONDITIONS

This file is VALID if:

- it remains non-authoritative implementation guidance
- it references source-owned IDs without redefining them
- it preserves L00–L10 as correctness authority
- it preserves I00 as source indexing authority
- it treats observability as visibility only
- it does not treat logs, timestamps, generated code, or successful execution as proof
- it does not introduce new operation scope
- it does not create new source-owned IDs
- it does not add architectural boundaries
- it does not permit API boundary bypass
- it does not permit Balance mutation through observability
- it does not permit LedgerEntry creation through observability
- it does not permit lifecycle mutation through observability
- it maps audit visibility to source-owned INV-, FAIL-, ARCH-, API-, and TEST-* references

This file is INVALID if:

- it defines correctness rules
- it defines verification requirements
- it treats observability as proof
- it uses timestamps as correctness authority
- it creates source-owned IDs
- it permits direct Balance mutation
- it permits direct LedgerEntry creation
- it permits lifecycle-state override
- it exposes internal control boundaries through external API contracts
- it conflicts with L00–L10, I00, or IMP-INDEX

### LOCK_STATUS

This file is ready for use only if:

- all referenced source IDs exist in I00
- all source-owned IDs use full prefixes
- audit trace remains implementation guidance only
- no audit event type is treated as a source-owned ID
- no observability guidance creates a new dependency route
- no observability guidance creates correctness authority
- no log, timestamp, or trace output is treated as proof

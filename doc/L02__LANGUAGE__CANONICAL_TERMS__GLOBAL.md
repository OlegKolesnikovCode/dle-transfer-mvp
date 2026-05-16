## AUTHORITY LEVEL
L02

## AUTHORITY CLASS
LANGUAGE

## AUTHORITY STATEMENT
- Defines canonical language authority for this layer
- Must conform to L00 ROOT and L1 DOMAIN
- Must not override or weaken higher-layer rules
- Must not introduce concerns owned by other layers

---

## DEPENDS ON
- L00__ROOT__SYSTEM_CONSTRAINTS__GLOBAL.md
- L01__DOMAIN__ENTITIES_RELATIONSHIPS__LEDGER.md

---

## PURPOSE
- Define canonical terms, meanings, and prohibited interpretations required to prevent semantic drift across downstream documents

---

## DEFINITIONS / SCOPE

This layer defines:
- canonical vocabulary
- allowed meanings
- prohibited meanings

This layer does not define:
- invariants
- failure classification
- lifecycle transitions
- architecture
- schema
- API behavior
- implementation mechanisms

---

## CORE RULES

- MUST define canonical terms required by L00 and L1
- MUST define allowed meanings for canonical terms
- MUST define prohibited meanings for canonical terms
- MUST NOT redefine L00 or L01 concepts
- MUST NOT introduce terms that conflict with defined meanings
- MUST NOT define invariants
- MUST NOT define failure classes
- MUST NOT define lifecycle states or transitions
- MUST NOT define architecture, schema, API, authorization, tests, or implementation logic

---

## CANONICAL TERM REGISTRY

| ID | Term |
|---|---|
| TERM-001 | Bounded System |
| TERM-002 | Consistency Boundary |
| TERM-003 | Account |
| TERM-004 | Asset |
| TERM-005 | Balance |
| TERM-006 | Balance Change |
| TERM-007 | Balance-Affecting Operation |
| TERM-008 | Transfer |
| TERM-009 | LedgerEntry |
| TERM-010 | Request |
| TERM-011 | Idempotency |
| TERM-012 | Atomicity |
| TERM-013 | Replay Determinism |
| TERM-014 | Traceability |
| TERM-015 | Asset Consistency |
| TERM-016 | Lifecycle-Governed |
| TERM-017 | Immutable |
| TERM-018 | Invalid State |

---

## CANONICAL TERMS

### TERM-001 — Bounded System
A system whose correctness scope is limited to a single defined Consistency Boundary.

PROHIBITED MEANING:
- correctness spanning multiple independent systems

---

### TERM-002 — Consistency Boundary
The atomic boundary for system correctness.

PROHIBITED MEANING:
- eventual or asynchronous correctness boundary

---

### TERM-003 — Account
A uniquely identifiable ownership scope for Balances.

PROHIBITED MEANING:
- external identity authority

---

### TERM-004 — Asset
A unit of denomination for value within the system.

PROHIBITED MEANING:
- external settlement authority

---

### TERM-005 — Balance
A quantitative representation of value associated with an Account and Asset.

PROHIBITED MEANING:
- independently authoritative value outside system-defined records

---

### TERM-006 — Balance Change
A change affecting the quantitative value of a Balance.

PROHIBITED MEANING:
- unrecorded Balance mutation

---

### TERM-007 — Balance-Affecting Operation
An operation that may alter Balance state.

PROHIBITED MEANING:
- read-only operation

---

### TERM-008 — Transfer
A lifecycle-governed representation of intended value movement between Accounts.

PROHIBITED MEANING:
- direct Balance mutation
- external settlement event

---

### TERM-009 — LedgerEntry
An immutable record representing a Balance Change.

PROHIBITED MEANING:
- mutable record
- optional metadata

---

### TERM-010 — Request
An invocation of a Balance-Affecting Operation.

PROHIBITED MEANING:
- non-idempotent command identity

---

### TERM-011 — Idempotency
The property that duplicate Requests resolve to the same outcome without duplicate state change.

PROHIBITED MEANING:
- best-effort deduplication

---

### TERM-012 — Atomicity
The property that an operation applies as a whole or does not apply.

PROHIBITED MEANING:
- partial success

---

### TERM-013 — Replay Determinism
The property that system state is defined by recorded history.

PROHIBITED MEANING:
- approximate reconstruction

---

### TERM-014 — Traceability
The property that Balance Changes are explainable by LedgerEntries.

PROHIBITED MEANING:
- logging-only visibility

---

### TERM-015 — Asset Consistency
The property that Balance transitions preserve Asset meaning.

PROHIBITED MEANING:
- implicit cross-asset equivalence

---

### TERM-016 — Lifecycle-Governed
Subject to explicit workflow authority.

PROHIBITED MEANING:
- informal process control

---

### TERM-017 — Immutable
Not modifiable after creation.

PROHIBITED MEANING:
- editable record with audit trail

---

### TERM-018 — Invalid State
A state outside defined correctness conditions.

PROHIBITED MEANING:
- warning condition

---

## CLASSIFICATION

SOURCE_FACT:
- L00 defines correctness scope, constraints, and system boundaries
- L01 defines entities, relationships, and lifecycle anchors
- L02 defines canonical language, term IDs, term meanings, and prohibited meanings

INFERENCE:
- Canonical terms normalize L00 and L01 concepts to prevent semantic drift across layers

SOURCE_GAP:
- Formal invariants (L03)
- Failure classification (L04)
- FSM definitions (L05)
- Architecture enforcement (L06)

SOURCE_CONFLICT:
- NONE
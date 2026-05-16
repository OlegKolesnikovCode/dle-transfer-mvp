## AUTHORITY LEVEL
L07

## AUTHORITY CLASS
DATA_SCHEMA

## AUTHORITY STATEMENT
- Defines scope of authority for this layer
- Must conform to all higher layers
- Must not override or weaken higher-layer rules
- Must not introduce concerns owned by other layers

---

## DEPENDS ON
- L00__ROOT__SYSTEM_CONSTRAINTS__GLOBAL.md
- L01__DOMAIN__ENTITIES_RELATIONSHIPS__LEDGER.md
- L02__LANGUAGE__CANONICAL_TERMS__GLOBAL.md
- L03__INVARIANTS__CORRECTNESS_RULES__LEDGER.md
- L04__FAILURE_MODEL__FAILURE_CLASSES__LEDGER.md
- L05__FSM_WORKFLOW__LIFECYCLE_RULES__TRANSFER.md
- L06__ARCHITECTURE__CONTROL_FLOW__SYSTEM.md

---

## PURPOSE
- Define persistence representation for domain entities and relationships required by Balance-Affecting Operations within the Bounded System
- Must not overlap with responsibilities of other layers
- No implementation detail

---

## DEFINITIONS / SCOPE
- Applies to persistence representation of domain entities and relationships
- Uses only L02 canonical terms
- Must not redefine canonical language
- Must not define invariants
- Must not define failure classes
- Must not define lifecycle states, lifecycle transitions, or execution behavior
- Must not define architecture, API behavior, authorization, tests, implementation logic, or recovery procedures

---

## CORE RULES

- MUST define persistence representations for Account, Asset, Balance, Transfer, LedgerEntry, and Request
- MUST ensure all persisted entities have unambiguous identity
- MUST ensure Balance is associated with exactly one Account and one Asset
- MUST ensure each Account-Asset Balance representation is unique
- MUST ensure Balance state is derivable from LedgerEntry history
- MUST ensure persisted Balance does not override LedgerEntry-derived state
- MUST ensure LedgerEntry references exactly one Account
- MUST ensure LedgerEntry references exactly one Asset
- MUST ensure LedgerEntry references an associated Transfer
- MUST ensure LedgerEntry is immutable after creation
- MUST ensure Transfer references one source Account and one destination Account
- MUST ensure Transfer references exactly one Asset
- MUST ensure Transfer lifecycle state uses only L05-defined states
- MUST ensure Request identity is unique
- MUST ensure duplicate Request resolves to the same persisted outcome
- MUST ensure duplicate Request does not create additional LedgerEntries
- MUST ensure persistence supports atomic representation of Balance-Affecting Operations
- MUST ensure persistence supports full reconstruction from LedgerEntry history
- MUST ensure Asset usage remains consistent across Balance, Transfer, and LedgerEntry
- MUST ensure persistence cannot represent partial operation state as complete

- MUST NOT allow LedgerEntry without Account
- MUST NOT allow LedgerEntry without Asset
- MUST NOT allow LedgerEntry without associated Transfer
- MUST NOT allow LedgerEntry mutation after creation
- MUST NOT allow LedgerEntry deletion if required for reconstruction
- MUST NOT allow Balance mutation that bypasses LedgerEntry history
- MUST NOT allow duplicate Request to create duplicate execution effects
- MUST NOT allow Transfer state outside L05-defined states
- MUST NOT allow Asset mismatch between LedgerEntry and affected Balance
- MUST NOT allow persistence state that depends on external systems for correctness

---

## SCHEMA ID REGISTRY

| ID | Persistence Constraint | Scope |
|---|---|---|
| SCHEMA-001 | Entity Persistence Set | Account, Asset, Balance, Transfer, LedgerEntry, Request |
| SCHEMA-002 | Persisted Entity Identity | unambiguous identity for persisted entities |
| SCHEMA-003 | Account-Asset Balance Uniqueness | one Balance per Account-Asset representation |
| SCHEMA-004 | LedgerEntry-Derived Balance State | Balance derivation and persisted Balance non-override |
| SCHEMA-005 | LedgerEntry Relationship Integrity | Account, Asset, and Transfer references |
| SCHEMA-006 | LedgerEntry Immutability Representation | no update/delete of required LedgerEntry history |
| SCHEMA-007 | Transfer Relationship Integrity | source Account, destination Account, and Asset references |
| SCHEMA-008 | Transfer Lifecycle State Representation | only L05-defined Transfer states |
| SCHEMA-009 | Request Identity Uniqueness | unique Request identity |
| SCHEMA-010 | Request Outcome Idempotency Representation | duplicate Request maps to same persisted outcome without additional LedgerEntries |
| SCHEMA-011 | Atomic Operation Representation | no partial operation state represented as complete |
| SCHEMA-012 | Asset Consistency Representation | consistent Asset usage across Balance, Transfer, and LedgerEntry |
| SCHEMA-013 | Bounded Persistence Representation | no persistence state requiring external correctness dependency |

---

## LAYER-SPECIFIC STRUCTURE

### ENTITY SET
- Account
- Asset
- Balance
- Transfer
- LedgerEntry
- Request

### RELATIONSHIPS
- Account owns one or more Balances
- Balance is associated with exactly one Account and one Asset
- Transfer references one source Account and one destination Account
- Transfer references exactly one Asset
- Request maps to one Transfer outcome
- LedgerEntry references exactly one Account, one Asset, and one associated Transfer
- Transfer may be associated with LedgerEntries according to L05 lifecycle authority
- Balance state is derivable from LedgerEntry history

---

## PERSISTENCE CONSTRAINT SET

### SCHEMA-001 — Entity Persistence Set
Persistence MUST represent:
- Account
- Asset
- Balance
- Transfer
- LedgerEntry
- Request

INVALID IF:
- any required persisted entity is missing
- persistence represents an unsupported Balance-Affecting Operation entity as valid without source authority

---

### SCHEMA-002 — Persisted Entity Identity
All persisted entities MUST have unambiguous identity.

INVALID IF:
- identity ambiguity prevents traceability
- identity ambiguity prevents Request, Transfer, Balance, or LedgerEntry association

---

### SCHEMA-003 — Account-Asset Balance Uniqueness
Balance MUST be associated with exactly one Account and one Asset.
Each Account-Asset Balance representation MUST be unique.

INVALID IF:
- Balance lacks Account
- Balance lacks Asset
- multiple Balance representations exist for the same Account-Asset pair

---

### SCHEMA-004 — LedgerEntry-Derived Balance State
Balance state MUST be derivable from LedgerEntry history.
Persisted Balance MUST NOT override LedgerEntry-derived state.

INVALID IF:
- Balance state cannot be reconstructed from LedgerEntry history
- persisted Balance contradicts LedgerEntry-derived state
- Balance is mutated in a way that bypasses LedgerEntry history

---

### SCHEMA-005 — LedgerEntry Relationship Integrity
LedgerEntry MUST reference exactly one Account, exactly one Asset, and an associated Transfer.

INVALID IF:
- LedgerEntry lacks Account
- LedgerEntry lacks Asset
- LedgerEntry lacks associated Transfer
- LedgerEntry cannot explain the associated Balance Change

---

### SCHEMA-006 — LedgerEntry Immutability Representation
LedgerEntry MUST be immutable after creation.
LedgerEntry MUST NOT be deleted if required for reconstruction.

INVALID IF:
- LedgerEntry is updated
- LedgerEntry is deleted when required for reconstruction
- referenced fields are changed

---

### SCHEMA-007 — Transfer Relationship Integrity
Transfer MUST reference one source Account, one destination Account, and exactly one Asset.

INVALID IF:
- Transfer lacks source Account
- Transfer lacks destination Account
- Transfer lacks Asset
- Transfer references inconsistent Assets

---

### SCHEMA-008 — Transfer Lifecycle State Representation
Transfer lifecycle state MUST use only L05-defined states.

INVALID IF:
- Transfer state is outside L05-defined states
- persistence represents an undefined Transfer state as valid

---

### SCHEMA-009 — Request Identity Uniqueness
Request identity MUST be unique.

INVALID IF:
- Request identity is ambiguous
- duplicate Request identity cannot be resolved deterministically

---

### SCHEMA-010 — Request Outcome Idempotency Representation
Duplicate Request MUST resolve to the same persisted outcome and MUST NOT create additional LedgerEntries.

INVALID IF:
- duplicate Request creates additional LedgerEntries
- duplicate Request maps to divergent persisted outcomes
- duplicate Request creates duplicate execution effects

---

### SCHEMA-011 — Atomic Operation Representation
Persistence MUST support atomic representation of Balance-Affecting Operations.
Persistence MUST NOT represent partial operation state as complete.

INVALID IF:
- partial LedgerEntries exist
- partial Balance state is observable as complete
- incomplete operation state is represented as complete

---

### SCHEMA-012 — Asset Consistency Representation
Asset usage MUST remain consistent across Balance, Transfer, and LedgerEntry.

INVALID IF:
- Asset mismatch exists between LedgerEntry and affected Balance
- Asset mismatch exists between Transfer and LedgerEntry
- inconsistent Asset usage exists within an operation

---

### SCHEMA-013 — Bounded Persistence Representation
Persistence state MUST NOT depend on external systems for correctness.

INVALID IF:
- persistence state requires external systems for correctness
- persistence state requires distributed coordination for correctness
- persistence state requires eventual consistency for Balance correctness

---

## VALIDITY CONDITIONS

VALID IF:
- Conforms to all DEPENDS ON documents
- Contains no undefined terms per L02
- Contains no cross-layer leakage
- CORE RULES are internally consistent
- CORE RULES fully cover the PURPOSE
- All SCHEMA-* IDs map to exactly one persistence constraint
- Persistence representation supports reconstruction, traceability, idempotency, atomicity, lifecycle-state representation, and bounded correctness

INVALID IF:
- Any rule contradicts higher authority
- Any persistence constraint permits invariant violation
- Any persistence constraint defines lifecycle transitions, API behavior, authorization, tests, or implementation logic
- Any SCHEMA-* ID maps to multiple meanings
- Any untraceable claim exists

---

## TRACEABILITY

- SCHEMA-001 → L01 ENTITY REGISTRY / L07 CORE RULES
- SCHEMA-002 → L00 IDENTITY REQUIREMENT / L01 ENTITY DEFINITIONS
- SCHEMA-003 → L01 RELATIONSHIPS / INV-005 / INV-006
- SCHEMA-004 → INV-001 / INV-003 / FAIL-003
- SCHEMA-005 → INV-001 / INV-010 / FAIL-001 / FAIL-010
- SCHEMA-006 → INV-002 / FAIL-002
- SCHEMA-007 → L01 RELATIONSHIPS / INV-006
- SCHEMA-008 → L05 FSM-001 / FSM-002 / FSM-003 / INV-008
- SCHEMA-009 → INV-007 / L00 IDENTITY REQUIREMENT
- SCHEMA-010 → INV-007 / FAIL-007
- SCHEMA-011 → INV-004 / FAIL-004
- SCHEMA-012 → INV-006 / FAIL-006
- SCHEMA-013 → INV-009 / FAIL-009

---

## CLASSIFICATION

SOURCE_FACT:
- L07 defines persistence representation for Account, Asset, Balance, Transfer, LedgerEntry, and Request
- L07 defines SCHEMA-* IDs as persistence constraints only
- Persistence representation must preserve traceability, reconstruction, idempotency, atomicity, asset consistency, lifecycle-state validity, and bounded correctness

INFERENCE:
- SCHEMA-* grouping organizes existing L07 CORE RULES into indexable source-owned constraints

SOURCE_GAP:
- Concrete database technology
- Physical schema syntax
- migration strategy
- runtime storage engine

SOURCE_CONFLICT:
- NONE

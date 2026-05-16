## AUTHORITY LEVEL
L05

## AUTHORITY CLASS
FSM_WORKFLOW

## AUTHORITY STATEMENT
- Defines scope of workflow authority for this layer
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

---

## PURPOSE
Define the minimal valid lifecycle model for lifecycle-governed Balance-Affecting Operations within the Bounded System.

---

## DEFINITIONS / SCOPE
- Applies to Transfer as the only Balance-Affecting Operation with defined workflow authority
- Uses only L02 canonical terms
- Must not redefine canonical language
- Must not define architecture, schema, API behavior, authorization, tests, implementation logic, or recovery procedures
- LedgerEntry has no lifecycle states

---

## CORE RULES

### Lifecycle Authority
- MUST define explicit lifecycle authority for Transfer
- MUST ensure Transfer is in exactly one valid lifecycle state
- MUST define all valid Transfer lifecycle states
- MUST define all valid Transfer lifecycle transitions
- MUST reject undefined lifecycle states
- MUST reject transitions not explicitly defined as valid
- MUST reject transitions from terminal states
- MUST ensure terminal states are final

---

### Execution Constraints
- MUST ensure execution occurs only during `VALIDATED → EXECUTED`
- MUST ensure execution occurs within a single Consistency Boundary
- MUST ensure execution is atomic
- MUST ensure execution occurs exactly once
- MUST ensure all lifecycle transitions preserve L03 invariants

---

### Balance Constraints
- MUST ensure Balance Changes occur only during execution
- MUST NOT permit Balance Changes in `REQUESTED`
- MUST NOT permit Balance Changes in `VALIDATED`
- MUST NOT permit Balance Changes in `FAILED`
- MUST NOT permit Balance Changes after `EXECUTED`

---

### LedgerEntry Constraints
- MUST ensure executed Transfer is fully represented by LedgerEntries
- MUST ensure LedgerEntries exist only for EXECUTED Transfer
- MUST ensure LedgerEntries are created atomically with execution
- MUST NOT permit LedgerEntries for FAILED Transfer
- MUST NOT permit LedgerEntries before execution
- MUST NOT permit LedgerEntries without valid lifecycle execution

---

### Idempotency (Lifecycle Scope Only)
- MUST ensure duplicate Requests do not produce additional lifecycle execution or state change
- MUST NOT permit duplicate execution effects

---

### FSM Completeness
- MUST ensure every Balance-Affecting Operation has explicit FSM authority before execution
- MUST ensure no Balance-Affecting Operation can execute without passing through defined FSM states and transitions
- MUST NOT permit execution without explicit FSM authority

---

## FSM-001 — TRANSFER STATE SET

A Transfer MUST be in exactly one state:

- REQUESTED
- VALIDATED
- EXECUTED
- FAILED

No other states are valid.

---

## FSM-010 — STATE DEFINITIONS

### REQUESTED
- Transfer is created
- No Balance Change has occurred
- Non-terminal

### VALIDATED
- Transfer has passed lifecycle validation and is eligible for execution
- No Balance Change occurs solely by entering this state
- Non-terminal

### EXECUTED
- Transfer has completed execution
- Execution result includes all required LedgerEntries and Balance Changes
- Terminal

### FAILED
- Transfer did not execute
- No Balance Change occurred
- Terminal

---

## FSM-002 — VALID TRANSITIONS

| From      | To        |
|----------|----------|
| REQUESTED | VALIDATED |
| REQUESTED | FAILED    |
| VALIDATED | EXECUTED  |
| VALIDATED | FAILED    |

All other transitions are invalid.

---

## FSM-005 — EXECUTION RULE

Execution is defined strictly as:

VALIDATED → EXECUTED

Execution MUST:
- occur within a single Consistency Boundary
- be atomic
- occur exactly once
- produce complete LedgerEntry representation
- preserve all L03 invariants

### INVALID IF:
- execution occurs outside `VALIDATED → EXECUTED`
- execution occurs outside a Consistency Boundary
- execution is partial
- execution repeats
- LedgerEntries are missing
- LedgerEntries exist without valid execution

---

## FSM-004 — BALANCE CHANGE RULE

Balance Changes MAY occur only during execution:

VALIDATED → EXECUTED

Balance Changes MUST NOT occur:
- in REQUESTED
- in VALIDATED
- in FAILED
- after EXECUTED

---

## FSM-006 — TERMINAL STATE RULES

### EXECUTED
- No further transitions allowed
- No additional LedgerEntries allowed
- No additional Balance Changes allowed
- Duplicate Requests MUST NOT re-execute

### FAILED
- No further transitions allowed
- No Balance Changes allowed
- No LedgerEntries allowed
- Duplicate Requests MUST NOT cause execution

---

## FSM-007 — IDEMPOTENCY RULE

Duplicate Request MUST:
- not produce additional lifecycle execution
- not produce additional state change

Duplicate Request MUST NOT:
- create additional execution paths
- create LedgerEntries
- change Balance state

---

## FSM-008 — LEDGERENTRY RULE

LedgerEntries MUST:
- exist only for EXECUTED Transfer
- be created atomically with execution
- fully represent executed operation results

LedgerEntries MUST NOT:
- exist before execution
- exist for FAILED Transfer
- exist without valid lifecycle execution

---

## FSM-009 — FSM COMPLETENESS RULE

- Every Balance-Affecting Operation MUST have explicit FSM authority before execution
- Every Balance-Affecting Operation MUST pass through defined FSM states and transitions before execution

If not:
- execution is invalid
- lifecycle authority is unsupported

---

## FSM-003 — FAILURE / INVALID CONDITIONS

### INVALID IF:
- Transfer is not in exactly one valid state
- Transfer uses undefined state
- Transition is not in VALID TRANSITIONS
- Transition exits EXECUTED or FAILED
- Execution occurs outside lifecycle rule
- Execution occurs outside Consistency Boundary
- Execution repeats
- Execution is partial
- Balance Change occurs outside execution
- Balance Change occurs after EXECUTED
- LedgerEntry exists before execution
- LedgerEntry exists for FAILED Transfer
- LedgerEntry exists without valid lifecycle execution
- Executed Transfer lacks required LedgerEntries
- Duplicate Request creates additional execution or state change
- Operation executes without FSM authority

---

## FAILURE MAPPING

- Invalid transition → FAIL-008
- Terminal state exit → FAIL-008
- Execution outside FSM authority → FAIL-008
- Execution outside Consistency Boundary → FAIL-009
- Balance Change outside execution → FAIL-008
- Partial execution → FAIL-004
- Duplicate execution → FAIL-007
- Missing LedgerEntries → FAIL-001 / FAIL-004 / FAIL-010
- LedgerEntries without execution → FAIL-010
- Invalid Balance state → FAIL-005
- Asset inconsistency → FAIL-006

---

## VALIDITY CONDITIONS

### VALID IF:
- Conforms to all DEPENDS ON documents
- No undefined terms (per L02)
- No cross-layer leakage
- CORE RULES fully cover PURPOSE
- All guarantees derivable
- All invalid conditions map correctly
- All lifecycle violations map to L04 failure classes

### INVALID IF:
- Contradicts higher authority
- Missing mappings
- Permits invariant violation
- Permits FSM bypass
- Contains untraceable claims
- Execution outside VALIDATED → EXECUTED
- LedgerEntries without execution
- Balance Changes outside execution

---

## TRACEABILITY

- FSM-001 → Transfer lifecycle state authority
- FSM-002 → Transfer lifecycle transition authority
- FSM-003 → lifecycle invalid-condition classification
- FSM-004 → Balance Change lifecycle restriction
- FSM-005 → execution lifecycle authority
- FSM-006 → terminal state finality
- FSM-007 → duplicate Request lifecycle restriction
- FSM-008 → LedgerEntry lifecycle restriction
- FSM-009 → FSM authority requirement for Balance-Affecting Operations
- FSM-010 → lifecycle state semantic definition

---

## CLASSIFICATION

### SOURCE_FACT
- Transfer is lifecycle-governed
- LedgerEntry has no lifecycle
- Valid states and transitions defined
- Execution strictly controlled
- Balance Changes restricted to execution
- Terminal states are final
- Duplicate Requests do not re-execute
- LedgerEntries require valid execution

### INFERENCE
- FSM enforces invariants through constrained execution
- Consistency Boundary ensures atomic correctness
- FSM prevents lifecycle bypass

### SOURCE_GAP
- FSM definitions for other operations
- Architecture enforcement (L06)
- Schema enforcement (L07)
- API enforcement (L08)
- Authorization enforcement (L09)
- Test enforcement (L10)

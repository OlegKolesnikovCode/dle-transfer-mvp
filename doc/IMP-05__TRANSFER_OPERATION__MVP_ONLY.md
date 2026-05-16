# IMP-05__TRANSFER_OPERATION__MVP_ONLY.md

## AUTHORITY_STATUS

NON_AUTHORITATIVE_IMPLEMENTATION_GUIDANCE

IMP-05 defines implementation guidance for the DLE-2 MVP Transfer operation.

Correctness authority is owned exclusively by L00–L10.

IMP-05 MUST NOT:

- define correctness rules
- define source-owned IDs
- define invariants
- define failure classes
- define lifecycle rules
- define architecture rules
- define schema rules as source authority
- define API contract rules
- define authorization rules
- define verification requirements
- override I00
- override L00–L10
- override IMP-INDEX routing
- create unsupported Balance-Affecting Operations
- create lifecycle states or transitions outside L05
- create Balance mutation authority
- create LedgerEntry persistence authority
- treat generated Transfer code as proof

---

## PURPOSE

Guide implementation of the Transfer-only MVP without expanding operation scope.

IMP-05 applies directly to:

```txt
src/domain/operations/transfer/transfer.types.ts
src/domain/operations/transfer/transfer.lifecycle.ts
src/domain/operations/transfer/transfer.validation.ts
src/domain/operations/transfer/transfer.ledger-entry-plan.ts
```

IMP-05 informs, but does not own:

- src/server/ledger/lifecycle-control.ts
- src/server/ledger/balance-control.ts
- src/server/ledger/ledger-control.ts
- src/server/ledger/consistency-boundary.ts
- src/server/ledger/persistence-boundary.ts
- src/app/api/transfers/route.ts

Transfer correctness requires:

- source rule reference
- routed implementation ownership
- valid lifecycle governance
- Balance Control authorization
- Ledger Control semantic LedgerEntry intent
- Persistence Boundary physical writes
- Consistency Boundary atomic transaction
- invalid-path rejection
- mapped TEST-* coverage
- observed passing behavior

## DEPENDS_ON
- I00__INDEXING_AUTHORITY__TRACEABILITY__GLOBAL.md
- L00__ROOT__SYSTEM_CONSTRAINTS__GLOBAL.md
- L01__DOMAIN__ENTITIES_RELATIONSHIPS__LEDGER.md
- L02__LANGUAGE__CANONICAL_TERMS__GLOBAL.md
- L03__INVARIANTS__CORRECTNESS_RULES__LEDGER.md
- L04__FAILURE_MODEL__FAILURE_CLASSES__LEDGER.md
- L05__FSM_WORKFLOW__LIFECYCLE_RULES__TRANSFER.md
- L06__ARCHITECTURE__CONTROL_FLOW__SYSTEM.md
- L07__DATA_SCHEMA__DATA_MODEL__PERSISTENCE.md
- L08__API_CONTRACTS__EXTERNAL_BOUNDARY__SYSTEM.md
- L09__SECURITY_AUTHZ__ACCESS_RULES__SYSTEM.md
- L10__TEST_SPEC__VERIFICATION__SYSTEM.md
- IMP-INDEX__IMPLEMENTATION_ROUTING__CODEGEN_ENTRY.md
- IMP-00__GLOBAL_CODEGEN_PROTOCOL.md
- IMP-01__FILE_MANIFEST__MVP_STRUCTURE.md
- IMP-02__DEPENDENCY_RULES__BOUNDARY_IMPORTS.md
- IMP-03__PERSISTENCE_RULES__PRISMA_SCHEMA.md
- IMP-04__TRANSACTION_RULES__CONSISTENCY_BOUNDARY.md
- IMP-07__FAILURE_MAPPING__LEDGER_ERRORS.md
- IMP-08__VERIFICATION_MATRIX__TEST_001_TO_012.md
- IMP-11__DONE_CRITERIA__CI_AND_PROOF.md

## AUTHORITY_RESOLUTION

| Conflict | Winner |
| --- | --- |
| IMP-05 conflicts with L00–L10 | L00–L10 |
| IMP-05 conflicts with I00 lookup / traceability metadata | I00 |
| IMP-05 conflicts with IMP-INDEX routing, ownership, dependencies, source IDs, IMP files, proof tests, or packet shape | IMP-INDEX unless L00–L10 or I00 are violated |
| IMP-05 conflicts with IMP-00 global codegen protocol | IMP-00 unless higher authority is violated |
| IMP-05 conflicts with IMP-02 dependency legality | IMP-02 unless higher authority is violated |
| IMP-05 conflicts with IMP-03 persistence guidance | IMP-03 owns persistence representation; IMP-05 owns Transfer-domain guidance |
| IMP-05 conflicts with IMP-04 transaction guidance | IMP-04 owns transaction coordination; IMP-05 owns Transfer-domain guidance |
| Generated lifecycle code conflicts with L05 | L05 |
| Generated Transfer domain code conflicts with L01/L02 | L01/L02 |
| Generated validation code conflicts with L03/L04 | L03/L04 |

If IMP-05 appears to authorize an operation, dependency, lifecycle transition, schema field, API route, helper, or execution path not routed by IMP-INDEX, classify as ROUTING_GAP.

## PRIMARY_SOURCE_MAPPING

IMP-05 primarily maps to:

- ENT-001
- ENT-002
- ENT-003
- ENT-004
- ENT-005
- ENT-006
- TERM-007
- TERM-008
- TERM-009
- TERM-010
- INV-001
- INV-004
- INV-005
- INV-006
- INV-007
- INV-008
- INV-010
- FAIL-001
- FAIL-004
- FAIL-005
- FAIL-006
- FAIL-007
- FAIL-008
- FAIL-010
- FSM-001 through FSM-010
- SCHEMA-007
- SCHEMA-008
- SCHEMA-010
- SCHEMA-011
- SCHEMA-012
- API-007
- API-008
- API-009
- API-010
- API-012
- AUTHZ-005
- AUTHZ-006
- AUTHZ-007
- AUTHZ-008
- AUTHZ-010
- AUTHZ-011
- AUTHZ-012
- TEST-001
- TEST-004
- TEST-005
- TEST-006
- TEST-007
- TEST-008
- TEST-010
- TEST-011
- TEST-012

## CLASSIFICATION_RULE

| Classification | Meaning | Required action |
| --- | --- | --- |
| READY_TO_GENERATE | Target Transfer file, dependencies, source references, authority fields, and proof tests are routed | Proceed |
| GENERATION_PACKET_INCOMPLETE | Required target, dependency, authority, source, operation, or proof field is missing or ambiguous | Stop; complete packet |
| ROUTING_GAP | File, helper, import, operation type, validation module, LedgerEntry planner, or execution path is not routed | Stop; report missing route |
| SOURCE_GAP | Required source-owned rule or ID is missing from L00–L10 / I00 | Stop; report missing source authority |
| SOURCE_CONFLICT | Source/routing/guidance conflict changes Transfer legality | Stop; do not choose by preference |
| INFERENCE | Derived guidance from source facts but not source-owned | Label non-authoritative |
| ASSUMPTION | Reversible implementation choice not specified by source/routing | Label and minimize |
| IMPLEMENTATION_GUIDANCE_ONLY | Useful implementation guidance, not source authority | May guide implementation |

Default classification for unrouted Transfer helpers, amount utilities, operation files, validation files, imports, or execution paths is ROUTING_GAP.

## MVP_OPERATION_SCOPE_RULE

The only MVP Balance-Affecting Operation is:

Transfer

Generated implementation MUST NOT create or imply support for:

- Deposit
- Withdrawal
- Adjustment
- Reversal
- Settlement
- Exchange
- Refund
- Chargeback
- JournalOperation
- ExternalTransfer
- InternalCorrection
- ManualBalancePatch

Forbidden operation expansion includes:

- persisted operation models beyond Transfer
- domain operation folders beyond Transfer
- API operation routes beyond Transfer
- lifecycle states or transitions outside L05
- Balance mutation paths outside routed controls
- LedgerEntry creation paths outside routed controls
- operation-type switches implying future operations
- TODO branches for unsupported operations
- generic operation plugin architecture unless routed

Any Balance-Affecting Operation other than Transfer requires updated source authority and IMP-INDEX routing.

## TRANSFER_DOMAIN_MODEL

Transfer represents intended value movement between Accounts.

| Required property | Source / guidance |
| --- | --- |
| one source Account | ENT-001, ENT-004, SCHEMA-007 |
| one destination Account | ENT-001, ENT-004, SCHEMA-007 |
| exactly one Asset | ENT-003, INV-006, SCHEMA-012 |
| balance-affecting amount | TERM-008, IMP-03 |
| lifecycle-governed state | FSM-001 through FSM-010, INV-008 |
| Request identity association | INV-007, SCHEMA-010 |
| LedgerEntry-backed execution result | INV-001, INV-010 |
| atomic application or non-application | INV-004, FAIL-004 |
| duplicate Request same-outcome behavior | INV-007, FAIL-007 |
| bounded-system correctness only | INV-009, FAIL-009 |

Transfer implementation MUST NOT represent:

- external settlement
- cross-system payment completion
- blockchain transaction
- distributed consensus event
- event-stream correctness
- direct Balance mutation command
- direct LedgerEntry creation command
- lifecycle override command
- exchange / conversion operation
- adjustment / correction operation

## TRANSFER_INPUT_RULE

Transfer request/input representation may include:

- requestIdentity
- sourceAccountId
- destinationAccountId
- assetId
- amount

Transfer input MUST NOT include:

- fromBalanceId
- toBalanceId
- ledgerEntryIds
- lifecycleState
- stateOverride
- forceExecute
- skipIdempotency
- skipAuthorization
- skipLifecycle
- skipBalanceCheck
- skipLedgerEntryCreation
- skipPersistence
- transactionId
- externalSettlementId

External callers MUST NOT select:

- lifecycle state
- internal control-boundary path
- Balance mutation details
- LedgerEntry creation details
- transaction behavior
- persistence behavior
- authorization outcome

If additional Transfer input fields are required and not routed, classify as ROUTING_GAP or GENERATION_PACKET_INCOMPLETE.

## TRANSFER_LIFECYCLE_RULE

Transfer lifecycle helpers must preserve the L05 state set:

- REQUESTED
- VALIDATED
- EXECUTED
- FAILED

Valid transitions only:

- REQUESTED → VALIDATED
- REQUESTED → FAILED
- VALIDATED → EXECUTED
- VALIDATED → FAILED

All other transitions are invalid.

Transfer lifecycle helpers MUST NOT add:

- PENDING
- APPROVED
- PROCESSING
- SETTLED
- REVERSED
- CANCELLED
- EXPIRED
- COMMITTED
- ROLLED_BACK

Lifecycle helpers are pure implementation logic.

Lifecycle authority remains source-owned by L05 and structurally routed through Lifecycle Control.

## TRANSFER_AMOUNT_RULE

Balance-affecting arithmetic MUST NOT use JavaScript number.

Transfer amount implementation should follow IMP-03 numeric representation guidance:

- Decimal atomic units
- integer-valued Decimal representation
- no floating-point arithmetic

Transfer implementation MUST NOT:

- use JavaScript number for amount
- use parseFloat
- use floating-point addition/subtraction
- infer Asset scale without routing
- round balance-affecting values without routing
- accept approximate numeric equality
- convert Decimal to number for comparison or arithmetic

Recommended MVP validation, as implementation guidance only:

- amount is present
- amount is numeric in the routed representation
- amount is finite in the routed representation
- amount is greater than zero for Transfer execution
- amount is integer-valued if using Decimal(38, 0)

The greater-than-zero rule is implementation guidance only.

It MUST NOT be presented as a new L03 invariant unless source authority is updated.

## TRANSFER_ASSET_SYMMETRY_RULE

MVP Transfer is single-Asset only.

Transfer implementation must preserve Asset consistency across:

- Transfer.assetId
- source Balance assetId
- destination Balance assetId
- LedgerEntry.assetId

Forbidden Transfer shapes:

- sourceAssetId + destinationAssetId
- fromAssetId + toAssetId
- exchangeRate
- conversionRate
- settlementAsset
- feeAsset
- multiAssetLedgerEntries

This guides implementation of INV-006 / SCHEMA-012.

It does not create a new source invariant.

## LEDGER_ENTRY_PLAN_RULE

A Transfer LedgerEntry plan must be pure, deterministic, non-persistent, and complete.

For MVP Transfer, the plan should include:

- source Account debit intent
- destination Account credit intent
- same Asset reference
- same amount magnitude
- operation association placeholder / Transfer reference path
- direction or signed delta for each side

The plan is incomplete if:

- source intent is missing
- destination intent is missing
- Asset differs between intents
- amount magnitude differs between intents
- direction or signed delta is ambiguous
- Transfer association path is missing
- any LedgerEntry would exist without valid Transfer execution
- any LedgerEntry would be created for FAILED Transfer
- any LedgerEntry would be created before execution

LedgerEntry planning does not persist LedgerEntries.

Ledger Control owns semantic approval.

Persistence Boundary owns physical durable writes.

## TRANSFER_EXECUTION_PATH_RULE

Transfer execution must follow routed architectural control flow:

Request Boundary
→ Authorization evaluation where routed
→ Idempotency Control
→ Consistency Boundary {
Lifecycle Control
→ Balance Control
→ Ledger Control
→ Persistence Boundary
}
→ persisted outcome
→ Response construction

Transfer domain files MUST NOT execute this path directly.

Transfer domain files provide pure helper logic only.

Execution orchestration belongs to:

src/server/ledger/consistency-boundary.ts

External write entry belongs to:

src/app/api/transfers/route.ts
→ src/server/ledger/request-boundary.ts

Forbidden alternate paths:

API route → Balance Control
API route → Ledger Control
API route → Persistence Boundary
API route → Prisma
Request Boundary → Persistence Boundary write
Idempotency Control → Balance mutation
Lifecycle Control → durable write
Transfer domain helper → Persistence Boundary

## CONTROL_USAGE_RULES

| Control | May use | Owns | Must not do |
| --- | --- | --- | --- |
| Lifecycle Control | transfer.lifecycle.ts | lifecycle execution placement | add states, add transitions, exit terminal states, mutate Balance, create LedgerEntries, open transactions |
| Balance Control | transfer.validation.ts | Balance Change authorization | create LedgerEntries, persist directly outside Persistence Boundary, open transactions, bypass Lifecycle or Idempotency Control |
| Ledger Control | transfer.ledger-entry-plan.ts | semantic LedgerEntry creation authority | persist directly outside Persistence Boundary, open transactions, mutate Balance, bypass Lifecycle or Balance Control |
| Persistence Boundary | approved intents only | physical durable writes | decide Transfer validity, authorize Balance Changes, decide lifecycle transitions |

## TRANSFER_IDEMPOTENCY_RULE

Duplicate Requests MUST NOT:

- create another Transfer execution
- create additional lifecycle execution
- create additional Balance Changes
- create additional LedgerEntries
- create divergent persisted outcomes
- create alternate execution paths
- bypass authorization
- bypass lifecycle validation
- bypass Balance Control
- bypass Ledger Control

Duplicate Requests MUST resolve to the same persisted Request outcome.

Transfer domain helpers MUST NOT implement idempotency using:

- timestamp comparison
- client-side retry assumption
- log inspection
- in-memory cache
- random request identity
- external idempotency service

Request identity is resolved through Idempotency Control and persisted Request representation.

## INVALID_PATH_RULE

Transfer implementation must reject or prevent:

- unsupported operation type
- undefined lifecycle state
- invalid lifecycle transition
- terminal state transition
- execution outside VALIDATED → EXECUTED
- Balance Change outside execution
- Balance Change after EXECUTED
- LedgerEntry before execution
- LedgerEntry for FAILED Transfer
- LedgerEntry without valid lifecycle execution
- EXECUTED Transfer without required LedgerEntries
- duplicate Request creates additional execution
- duplicate Request creates additional Balance Change
- duplicate Request creates additional LedgerEntries
- Asset mismatch in Transfer operation
- cross-Asset Transfer
- direct Balance mutation
- direct LedgerEntry creation
- external settlement as correctness dependency
- eventual consistency for Balance correctness
- distributed coordination for correctness

Invalid-path rejection must occur at the routed layer.

Do not solve invalid paths by adding unrouted helpers or alternate control flow.

## FAILURE_MAPPING_GUIDANCE

Transfer implementation must map invalid paths to source-owned failure classes through IMP-07 guidance.

| Invalid Transfer condition | Failure class |
| --- | --- |
| Balance Change without LedgerEntry | FAIL-001 |
| partial execution | FAIL-004 |
| invalid Balance state | FAIL-005 |
| Asset mismatch | FAIL-006 |
| duplicate execution effect | FAIL-007 |
| lifecycle violation | FAIL-008 |
| execution outside Consistency Boundary | FAIL-009 |
| incomplete LedgerEntry representation | FAIL-010 |

IMP-05 does not define failure classes.

Failure classes are source-owned by L04.

Implementation error types and API error mapping belong to IMP-07 and IMP-06.

## TARGET_FILE_RULES

| Target file | Allowed | Forbidden |
| --- | --- | --- |
| src/domain/operations/transfer/transfer.types.ts | TypeScript types, operation-local interfaces, Transfer state type aligned to L05, non-executing intent/result types | runtime execution, persistence calls, transactions, Balance mutation, LedgerEntry persistence, API responses, authorization logic, lifecycle expansion, unsupported operation types |
| src/domain/operations/transfer/transfer.lifecycle.ts | valid state set, transition validation, terminal-state helper, pure lifecycle decisions, invalid transition results | persistence writes, Balance mutation, LedgerEntry creation, transactions, API responses, authorization logic, state/transition expansion, timestamp-as-lifecycle-authority |
| src/domain/operations/transfer/transfer.validation.ts | pure input validation, same-Asset validation, amount representation validation, required field validation, structural eligibility result, routed failure references | database reads/writes, Balance mutation, LedgerEntry creation, lifecycle execution, authorization decisions, API responses, external checks, source-rule creation |
| src/domain/operations/transfer/transfer.ledger-entry-plan.ts | pure deterministic LedgerEntry intent planning, debit/credit intent, same-Asset plan validation, complete plan result, routed failure references | durable LedgerEntry persistence, Prisma imports, transaction context, Balance mutation, lifecycle execution, authorization decisions, API responses, external calls, timestamp-as-proof |

## TRANSFER_DEPENDENCY_RULE

| File | May import |
| --- | --- |
| transfer.types.ts | src/domain/entities.ts, src/domain/terms.ts |
| transfer.lifecycle.ts | src/domain/operations/transfer/transfer.types.ts |
| transfer.validation.ts | src/domain/operations/transfer/transfer.types.ts, src/domain/entities.ts, src/domain/terms.ts |
| transfer.ledger-entry-plan.ts | src/domain/operations/transfer/transfer.types.ts, src/domain/entities.ts, src/domain/terms.ts |

Forbidden imports for all Transfer domain files:

- src/app/*
- src/server/*
- src/lib/response.ts
- src/server/ledger/persistence-boundary.ts
- Prisma client
- tests/*

src/lib/errors.ts may be used only if explicitly routed by IMP-INDEX / IMP-02 / IMP-07 for the target file.

Do not create unless IMP-INDEX routes first:

- src/domain/operations/transfer/index.ts
- src/domain/operations/transfer/helpers.ts
- src/domain/operations/transfer/constants.ts
- src/domain/operations/transfer/amount.ts
- src/domain/operations/transfer/errors.ts
- src/domain/operations/transfer/repository.ts

If helper extraction appears necessary, classify as ROUTING_GAP.

## TRANSFER_TEST_MAPPING

| Transfer concern | Source references | Required tests |
| --- | --- | --- |
| LedgerEntry-backed Transfer traceability | INV-001, FAIL-001, FSM-008 | TEST-001 |
| Transfer atomicity | INV-004, FAIL-004, FSM-005 | TEST-004 |
| Balance constraint enforcement | INV-005, FAIL-005 | TEST-005 |
| Asset consistency / single-Asset Transfer | INV-006, FAIL-006, SCHEMA-012 | TEST-006 |
| duplicate Request behavior | INV-007, FAIL-007, FSM-007, SCHEMA-010 | TEST-007 |
| Transfer lifecycle governance | INV-008, FAIL-008, FSM-001 through FSM-010 | TEST-008 |
| executed Transfer completeness | INV-010, FAIL-010, FSM-008 | TEST-010 |
| API cannot bypass Transfer controls | API-007, API-008, API-009, API-010, API-012 | TEST-011 |
| Authorization cannot bypass Transfer controls | AUTHZ-005, AUTHZ-006, AUTHZ-007, AUTHZ-008, AUTHZ-010, AUTHZ-011, AUTHZ-012 | TEST-012 |

Verification authority remains with L10.

Concrete test implementation belongs to IMP-08.

Completion and CI gates belong to IMP-11.

## PRE_GENERATION_PACKET_REQUIREMENTS

Before generating each target file, resolve:

| Target file | Source references | Required IMP files | Allowed dependencies | Authority | Proof tests |
| --- | --- | --- | --- | --- | --- |
| src/domain/operations/transfer/transfer.types.ts | ENT-001, ENT-003, ENT-004, FSM-001, SCHEMA-007 | IMP-00, IMP-01, IMP-05 | src/domain/entities.ts, src/domain/terms.ts | Mutation: None; Transaction: None; Persistence: None; LedgerEntry: None; Balance: None; API: None | TEST-006, TEST-008 |
| src/domain/operations/transfer/transfer.lifecycle.ts | FSM-001 through FSM-010, INV-008 | IMP-00, IMP-05, IMP-07 | src/domain/operations/transfer/transfer.types.ts | Mutation: None; Transaction: None; Persistence: None; LedgerEntry: None; Balance: None; API: None | TEST-008 |
| src/domain/operations/transfer/transfer.validation.ts | ENT-001, ENT-003, ENT-004, TERM-008, INV-005, INV-006, FAIL-005, FAIL-006 | IMP-00, IMP-05, IMP-07 | src/domain/operations/transfer/transfer.types.ts, src/domain/entities.ts, src/domain/terms.ts | Mutation: Validate only; Transaction: None; Persistence: None; LedgerEntry: None; Balance: Validate only, not authorize persisted Balance Change; API: None | TEST-005, TEST-006 |
| src/domain/operations/transfer/transfer.ledger-entry-plan.ts | ENT-005, TERM-009, INV-001, INV-006, INV-010, FAIL-001, FAIL-006, FAIL-010 | IMP-00, IMP-02, IMP-05, IMP-07 | src/domain/operations/transfer/transfer.types.ts, src/domain/entities.ts, src/domain/terms.ts | Mutation: None; Transaction: None; Persistence: None; LedgerEntry: Plan only, not authorize persistence; Balance: None; API: None | TEST-001, TEST-006, TEST-010 |

For all target files:

- Boundary owner: Transfer Domain
- Forbidden dependencies: src/server/*, src/app/*, Prisma, tests/*, persistence-boundary, response utility unless explicitly routed
- Output mode: One target file only
- Classification: READY_TO_GENERATE

If a target file requires any field, helper, dependency, or rule not listed above, classify before generation.

## POST_GENERATION_VALIDATION

After generating Transfer-related files, validate against these IMP-05 labels:

| Protocol label | Meaning |
| --- | --- |
| UNSUPPORTED_OPERATION_SCOPE | Generated operation other than Transfer or implied future operation support |
| TRANSFER_STATE_EXPANSION | Added lifecycle state outside L05 |
| TRANSFER_TRANSITION_EXPANSION | Added lifecycle transition outside L05 |
| LIFECYCLE_BYPASS | Transfer can execute outside lifecycle authority |
| EXECUTION_PHASE_VIOLATION | Balance Change or LedgerEntry intent occurs outside VALIDATED → EXECUTED execution |
| TERMINAL_STATE_VIOLATION | Transfer can transition out of EXECUTED or FAILED |
| BALANCE_MUTATION_LEAK | Transfer domain file mutates Balance or gains Balance Control authority |
| LEDGER_PERSISTENCE_LEAK | Transfer domain file persists LedgerEntries or gains Persistence Boundary authority |
| LEDGER_PLAN_INCOMPLETE | LedgerEntry plan cannot fully represent executed Transfer result |
| ASSET_SYMMETRY_VIOLATION | Transfer, Balance, or LedgerEntry intent can use inconsistent Assets |
| NUMERIC_REPRESENTATION_VIOLATION | Transfer amount uses JavaScript number, Float, approximate arithmetic, or unrouted numeric representation |
| IDEMPOTENCY_BYPASS | Duplicate Request can produce additional execution, Balance Change, or LedgerEntries |
| DIRECT_PRISMA_BYPASS | Transfer domain file imports Prisma or performs persistence |
| API_BOUNDARY_LEAK | Transfer domain file constructs API Response or exposes internal control selection |
| AUTHORIZATION_BYPASS | Transfer implementation bypasses routed authorization constraints |
| TIMESTAMP_AUTHORITY_VIOLATION | Timestamp is used as execution, lifecycle, ordering, idempotency, replay, or proof authority |
| UNROUTED_HELPER_CREATION | Transfer helper, constant file, amount utility, index barrel, repository, or error file created without routing |
| PROOF_VIOLATION | Type safety, compile success, happy path, logs, timestamps, routing, or generated code treated as proof |

If validation fails, generated Transfer output is not acceptable as complete.

## PROOF_LIMITS

The following are not proof of Transfer correctness:

- Transfer file exists
- lifecycle helper compiles
- validation helper returns success
- LedgerEntry plan is constructed
- happy-path Transfer works once
- Prisma transaction commits
- logs show execution
- timestamps match
- no runtime error occurs
- generated code follows naming convention
- routing table lists the target

Proof requires:

- source rule reference
- routed implementation ownership
- invalid-path rejection
- lifecycle invalid-path coverage
- idempotency duplicate-path coverage
- asset consistency coverage
- LedgerEntry traceability coverage
- mapped TEST-* coverage
- observed passing behavior

## TRACEABILITY

| Section | Basis |
| --- | --- |
| AUTHORITY_STATUS | I00, IMP-INDEX, IMP-00 |
| PURPOSE | L01, L02, L05, IMP-INDEX |
| DEPENDS_ON | I00, L00–L10, IMP-INDEX, IMP-00, IMP-01, IMP-02, IMP-03, IMP-04, IMP-07, IMP-08, IMP-11 |
| AUTHORITY_RESOLUTION | I00, L00–L10, IMP-INDEX, IMP-00, IMP-02, IMP-03, IMP-04 |
| PRIMARY_SOURCE_MAPPING | I00, IMP-INDEX |
| CLASSIFICATION_RULE | IMP-00, IMP-INDEX |
| MVP_OPERATION_SCOPE_RULE | L00 SYSTEM BOUNDARY, ENT-004, TERM-007, TERM-008, FSM-009, SCHEMA-001 |
| TRANSFER_DOMAIN_MODEL | ENT-001, ENT-003, ENT-004, ENT-005, ENT-006, TERM-008, INV-001, INV-004, INV-006, INV-007, INV-008, INV-010 |
| TRANSFER_INPUT_RULE | API-001, API-002, API-007, API-008, API-009, API-010, API-012 |
| TRANSFER_LIFECYCLE_RULE | FSM-001 through FSM-010, INV-008 |
| TRANSFER_AMOUNT_RULE | IMP-03, INV-005 |
| TRANSFER_ASSET_SYMMETRY_RULE | INV-006, SCHEMA-012 |
| LEDGER_ENTRY_PLAN_RULE | ENT-005, TERM-009, INV-001, INV-006, INV-010 |
| TRANSFER_EXECUTION_PATH_RULE | ARCH-001 through ARCH-009 |
| CONTROL_USAGE_RULES | ARCH-004, ARCH-005, ARCH-006, ARCH-007 |
| TRANSFER_IDEMPOTENCY_RULE | INV-007, FSM-007, SCHEMA-010 |
| INVALID_PATH_RULE | L03, L04, L05, L06, L07 |
| FAILURE_MAPPING_GUIDANCE | L04, IMP-07 |
| TARGET_FILE_RULES | IMP-INDEX, IMP-02 |
| TRANSFER_DEPENDENCY_RULE | IMP-02, IMP-INDEX |
| TRANSFER_TEST_MAPPING | L10, IMP-08 |
| PRE_GENERATION_PACKET_REQUIREMENTS | IMP-00, IMP-INDEX |
| POST_GENERATION_VALIDATION | IMP-05, IMP-00 |
| PROOF_LIMITS | L10, IMP-00 |
| VALIDITY_CONDITIONS | I00, L05, IMP-INDEX |

## VALIDITY_CONDITIONS

This file is VALID if it:

- remains non-authoritative implementation guidance
- preserves L00–L10 as correctness authority
- preserves I00 as source lookup and traceability authority
- preserves IMP-INDEX as implementation routing authority
- does not define source-owned IDs
- does not define new correctness rules
- does not define new lifecycle rules
- does not define new failure classes
- does not define new Balance-Affecting Operations
- preserves Transfer as the only MVP Balance-Affecting Operation
- preserves L05 Transfer state set
- preserves L05 Transfer transitions
- preserves execution only during VALIDATED → EXECUTED
- prevents Balance Changes outside execution
- prevents LedgerEntries outside valid execution
- prevents duplicate Request re-execution
- prevents direct Balance mutation
- prevents direct LedgerEntry persistence from Transfer domain files
- prevents Transfer domain files from importing Prisma
- preserves single-Asset Transfer implementation guidance
- prevents JavaScript-number balance-affecting arithmetic
- routes proof back to TEST-* coverage

This file is INVALID if it:

- defines correctness authority
- defines source-owned IDs
- weakens or extends L00–L10
- overrides I00 lookup
- overrides IMP-INDEX routing
- permits unsupported Balance-Affecting Operations
- permits lifecycle states outside L05
- permits lifecycle transitions outside L05
- permits Balance Change outside VALIDATED → EXECUTED
- permits LedgerEntry creation outside valid execution
- permits duplicate Request re-execution
- permits Transfer domain files to persist durable state
- permits Transfer domain files to mutate Balance
- permits Transfer domain files to create durable LedgerEntries
- permits Transfer domain files to open transactions
- permits direct Prisma access from Transfer domain files
- permits API callers to select lifecycle state
- permits cross-Asset Transfer behavior without source/routing update
- treats generated Transfer code, compilation, logs, timestamps, or happy-path execution as proof

## CLASSIFICATION

### SOURCE_FACT:

- L00–L10 are correctness authority.
- I00 is source indexing and traceability authority.
- IMP-INDEX is implementation/codegen routing authority.
- Transfer is the only Balance-Affecting Operation with defined workflow authority in L05.
- Transfer lifecycle states are REQUESTED, VALIDATED, EXECUTED, and FAILED.
- Transfer execution is defined strictly as VALIDATED → EXECUTED.
- Balance Changes occur only during execution.
- LedgerEntries exist only for EXECUTED Transfer and must be created atomically with execution.
- Duplicate Requests must not produce additional lifecycle execution or state change.
- L03 invariants require traceability, atomicity, idempotency, lifecycle governance, Asset consistency, and operation completeness.

### INFERENCE:

- Transfer domain files should remain pure and non-persistent to preserve L06 boundary ownership.
- Transfer-specific validation and LedgerEntry planning should be deterministic and side-effect free.
- Single-Asset Transfer guidance is the simplest implementation of Asset consistency for the MVP.
- Separating Transfer domain helpers from server controls reduces boundary bypass risk.

### ASSUMPTION:

- MVP Transfer input includes source Account, destination Account, Asset, amount, and Request identity through routed API/request flow.
- Amount is represented using the numeric strategy routed by IMP-03.
- Transfer LedgerEntry plan uses debit/credit intent pairs with equal magnitude and the same Asset.
- Same-account Transfer behavior is not source-defined and must be treated as implementation guidance or packet ambiguity if it affects correctness.

These assumptions are implementation guidance only.

They MUST NOT define source correctness.

### IMPLEMENTATION_GUIDANCE_ONLY:

- concrete TypeScript type names
- concrete helper function names
- concrete validation result shape
- concrete LedgerEntry intent shape
- debit/credit direction labels
- amount positivity validation as implementation input policy
- same-account Transfer rejection if adopted
- target-file implementation patterns

### SOURCE_GAP:

No blocking SOURCE_GAP is identified within this IMP-05 document.

### SOURCE_CONFLICT:

No blocking SOURCE_CONFLICT is identified within this IMP-05 document.

## LOCK_STATUS

READY_FOR_USE only if:

- filename matches the IMP-INDEX registry entry for IMP-05
- IMP-INDEX routes all four Transfer domain target files
- I00 indexes all source-owned IDs used by Transfer targets
- L01 defines Transfer, Account, Asset, LedgerEntry, and Request entities
- L02 defines Transfer, Balance-Affecting Operation, LedgerEntry, Request, Idempotency, Atomicity, Traceability, Asset Consistency, and Lifecycle-Governed terms
- L03 defines INV-001 through INV-010
- L04 defines FAIL-001 through FAIL-010
- L05 defines FSM-001 through FSM-010
- L06 defines ARCH-001 through ARCH-009
- L07 defines SCHEMA-007, SCHEMA-008, SCHEMA-010, SCHEMA-011, and SCHEMA-012
- L10 defines TEST-001, TEST-004, TEST-005, TEST-006, TEST-007, TEST-008, TEST-010, TEST-011, and TEST-012
- IMP-00 defines global generation protocol
- IMP-02 defines dependency/import legality
- IMP-03 defines numeric/persistence representation guidance
- IMP-04 defines transaction/Consistency Boundary guidance
- IMP-07 defines failure/error mapping guidance
- IMP-08 defines TEST-* implementation matrix
- IMP-11 defines completion and CI proof gates
- generated Transfer files do not create unsupported operations, unrouted helpers, lifecycle expansion, direct persistence, Balance mutation, or proof-by-compilation behavior

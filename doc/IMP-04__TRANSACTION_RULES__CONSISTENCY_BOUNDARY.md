# IMP-04__TRANSACTION_RULES__CONSISTENCY_BOUNDARY.md

## AUTHORITY_STATUS

NON_AUTHORITATIVE_IMPLEMENTATION_GUIDANCE

This file defines transaction and Consistency Boundary implementation guidance for DLE-2.

This file is NOT correctness authority.

Correctness authority remains exclusively with L00–L10.

Source lookup and traceability metadata remain with I00.

Implementation/codegen routing remains with IMP-INDEX.

This file MUST NOT:
- define correctness rules
- define source-owned IDs
- define invariants
- define failure classes
- define lifecycle rules
- define architecture rules
- define schema rules as source authority
- define API rules
- define authorization rules
- define verification requirements
- override L00–L10
- override I00
- override IMP-INDEX routing
- create unsupported Balance-Affecting Operations
- create new architectural boundaries
- treat a database transaction alone as proof
- treat successful commit alone as proof
- treat logs, timestamps, compilation, runtime success, or absence of error as proof

If this file conflicts with L00–L10, L00–L10 win.

If this file conflicts with I00, I00 wins for lookup and traceability metadata.

If this file conflicts with IMP-INDEX, IMP-INDEX wins for routing, dependency allowance, transaction authority, target ownership, required source IDs, required IMP files, proof tests, and generation-packet shape.

If this file appears to authorize an unrouted transaction helper, write path, dependency, repository, Prisma wrapper, lock helper, or transaction type file, classify as ROUTING_GAP.

---

## PURPOSE

Guide implementation of the DLE-2 Consistency Boundary so the Transfer-only Balance-Affecting Operation is applied atomically, once, and only through the routed control path.

IMP-04 exists to guide:
- transaction ownership
- transaction-context passing
- atomic write grouping
- duplicate Request behavior
- rollback / failure behavior
- concurrency-safe Balance updates
- retry safety
- temporal metadata anchoring
- Persistence Boundary coordination

IMP-04 does not replace L06.

IMP-04 does not prove transaction correctness.

Transaction correctness requires:
- source rule reference
- routed implementation ownership
- one Consistency Boundary transaction for the operation write set
- invalid-path rejection
- Persistence Boundary physical writes only
- mapped TEST-* coverage
- observed passing behavior

---

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
- IMP-05__TRANSFER_OPERATION__MVP_ONLY.md
- IMP-07__FAILURE_MAPPING__LEDGER_ERRORS.md
- IMP-08__VERIFICATION_MATRIX__TEST_001_TO_012.md
- IMP-11__DONE_CRITERIA__CI_AND_PROOF.md

---

## SOURCE_AUTHORITY_ORDER

Correctness authority:

```txt
L00 → L01 → L02 → L03 → L04 → L05 → L06 → L07 → L08 → L09 → L10
```

Indexing authority:

```txt
I00__INDEXING_AUTHORITY__TRACEABILITY__GLOBAL.md
```

Implementation routing authority:

```txt
IMP-INDEX__IMPLEMENTATION_ROUTING__CODEGEN_ENTRY.md
```

Implementation guidance:

```txt
IMP-00 → IMP-11
```

Generated implementation:

```txt
src/server/ledger/consistency-boundary.ts
src/server/ledger/idempotency-control.ts
src/server/ledger/lifecycle-control.ts
src/server/ledger/balance-control.ts
src/server/ledger/ledger-control.ts
src/server/ledger/persistence-boundary.ts
```

Generated implementation remains subordinate to L00–L10, I00, IMP-INDEX, and routed IMP guidance.

## SCOPE

IMP-04 directly applies to:

- src/server/ledger/consistency-boundary.ts
- src/server/ledger/idempotency-control.ts
- src/server/ledger/balance-control.ts
- src/server/ledger/ledger-control.ts
- src/server/ledger/persistence-boundary.ts

IMP-04 informs, but does not own:

- src/server/ledger/lifecycle-control.ts
- src/server/ledger/request-boundary.ts
- src/server/ledger/authorization-control.ts
- src/domain/operations/transfer/*
- prisma/schema.prisma

Primary source references:

- ARCH-003
- ARCH-009
- INV-004
- INV-007
- INV-009
- INV-010
- FAIL-004
- FAIL-007
- FAIL-009
- FAIL-010
- FSM-005
- FSM-007
- FSM-008
- SCHEMA-009
- SCHEMA-010
- SCHEMA-011
- SCHEMA-013
- API-008
- API-012
- API-013
- AUTHZ-005
- AUTHZ-009
- AUTHZ-010
- TEST-004
- TEST-007
- TEST-009
- TEST-010

IMP-04 does not own:

- API route behavior
- authorization policy
- lifecycle state definitions
- Balance validation semantics
- LedgerEntry semantic meaning
- Prisma schema structure
- verification authority
- CI gates

## CLASSIFICATION_RULE

If transaction generation cannot proceed cleanly, classify before generating.

| Classification | Meaning | Required action |
| --- | --- | --- |
| READY_TO_GENERATE | Target transaction-related file and all transaction authority fields are routed | Proceed |
| GENERATION_PACKET_INCOMPLETE | Transaction authority, persistence authority, dependencies, source references, or proof tests are missing | Stop; complete packet |
| ROUTING_GAP | Target file, helper, transaction type, persistence method, dependency, import, or write path is not routed | Stop; report missing route |
| SOURCE_GAP | Required source-owned atomicity, lifecycle, idempotency, architecture, schema, API, authz, or verification rule is missing | Stop; report missing source authority |
| SOURCE_CONFLICT | Authorities conflict in a way that changes transaction legality | Stop; do not choose by preference |
| INFERENCE | Derived transaction guidance from source/routing facts | Label as non-authoritative |
| ASSUMPTION | Reversible implementation choice not specified by source/routing | Label and minimize |
| IMPLEMENTATION_GUIDANCE_ONLY | Useful transaction guidance outside L00–L10 authority | May guide; cannot prove |

ROUTING_GAP is the default for unrouted transaction helpers, transaction type files, repositories, Prisma wrappers, lock helpers, or write paths.

SOURCE_GAP is only for missing L00–L10 / I00 authority.

## CONSISTENCY_BOUNDARY_MODEL

For MVP, the only routed Balance-Affecting Operation is:

- Transfer

The Consistency Boundary is the atomic execution coordinator.

Required routed flow:

- Request Boundary
- → Authorization evaluation where routed
- → Idempotency Control
- → Consistency Boundary {
- Lifecycle Control
- → Balance Control
- → Ledger Control
- → Persistence Boundary
- }
- → persisted Request outcome
- → Response construction outside internal execution ownership

Consistency Boundary owns:

- transaction coordination
- atomic write-set sequencing
- routed call order for execution
- operation-level rollback boundary

Consistency Boundary does not own:

- external API contract
- authorization policy
- lifecycle state meaning
- Balance Change semantic authorization
- LedgerEntry semantic authorization
- direct physical database access outside Persistence Boundary
- read-only derivation

## TRANSACTION_AUTHORITY_RULE

Only this file may open or coordinate the Balance-Affecting Operation transaction context:

- src/server/ledger/consistency-boundary.ts

Transaction opening is forbidden in:

- src/app/*
- src/server/ledger/request-boundary.ts
- src/server/ledger/authorization-control.ts
- src/server/ledger/idempotency-control.ts
- src/server/ledger/lifecycle-control.ts
- src/server/ledger/balance-control.ts
- src/server/ledger/ledger-control.ts
- src/server/ledger/persistence-boundary.ts
- src/server/ledger/read-derivation-boundary.ts
- src/domain/*
- src/lib/*

Transaction receiving is allowed only where routed:

- src/server/ledger/balance-control.ts
- src/server/ledger/ledger-control.ts
- src/server/ledger/persistence-boundary.ts

Lifecycle Control should return transition intent / decision.

If lifecycle-state persistence requires transaction context, Consistency Boundary must route physical persistence through Persistence Boundary.

## TRANSACTION_CONTEXT_RULE

Transaction context is an implementation capability, not source authority.

Transaction context MUST NOT be exposed as:

- API input
- API response
- Request field
- authorization result
- domain object authority
- global singleton
- mutable external handle
- test fixture imported by production code

Allowed direction:

- consistency-boundary.ts
- → balance-control.ts
- → persistence-boundary.ts

consistency-boundary.ts
→ ledger-control.ts
→ persistence-boundary.ts

consistency-boundary.ts
→ persistence-boundary.ts

Forbidden direction:

- persistence-boundary.ts → consistency-boundary.ts
- balance-control.ts → consistency-boundary.ts
- ledger-control.ts → consistency-boundary.ts
- API route → transaction handle
- domain file → transaction handle
- authorization-control.ts → transaction handle

Do not store transaction context in module-level state.

Do not return transaction context from a function.

Do not attach transaction context to Request, Transfer, Balance, LedgerEntry, or Response DTOs.

## ATOMIC_WRITE_SET_RULE

For one executed Transfer, the atomic write set generally includes:

- Request reservation / Request outcome persistence
- Transfer creation or lifecycle-state persistence
- Balance updates
- LedgerEntry creation
- operation outcome persistence

All Balance-affecting writes for one execution MUST commit or roll back together.

Forbidden partial states:

- Balance updated but LedgerEntries missing
- LedgerEntries created but Balance not updated
- Transfer marked EXECUTED but LedgerEntries missing
- Request outcome marked successful but Transfer write set failed
- source Balance debited but destination Balance not credited
- only one side of Transfer LedgerEntry persisted
- duplicate Request creates second LedgerEntry set
- duplicate Request creates second Balance mutation

Any partial write-set failure must be treated as transaction failure.

Successful commit alone is not proof.

TEST-004 must verify atomic behavior.

## IDEMPOTENCY_TRANSACTION_RULE

Request identity resolution occurs before Balance-Affecting Operation execution.

Duplicate Request behavior must preserve:

- same persisted Request outcome
- no duplicate lifecycle execution
- no duplicate Balance Change
- no duplicate LedgerEntries
- no divergent Response meaning

Required flow:

1. Request Boundary receives external Request.
2. Authorization evaluation occurs where routed.
3. Idempotency Control resolves Request identity before execution.
4. If duplicate Request already has persisted outcome, return that outcome path without re-execution.
5. If Request is new or incomplete according to routed idempotency rules, Consistency Boundary coordinates transaction.
6. Consistency Boundary persists the operation outcome through Persistence Boundary.
7. Future duplicate Requests resolve to the same persisted outcome.

Idempotency Control MUST NOT:

- open transaction context
- mutate Balance
- create LedgerEntries
- execute lifecycle transitions
- perform durable Request reservation writes outside Consistency Boundary
- perform durable Request outcome writes outside Consistency Boundary

Forbidden idempotency implementations:

- best-effort deduplication
- timestamp comparison
- client-side retry assumption
- log inspection
- non-durable memory cache
- external-system dependency

TEST-007 must verify duplicate Request behavior.

## CONTROL_OWNERSHIP_MATRIX

| File | Boundary owner | Transaction authority | Must own | Must not own |
| --- | --- | --- | --- | --- |
| consistency-boundary.ts | ARCH-003 | Open / coordinate | atomic operation transaction, routed call order | Balance authorization, LedgerEntry semantic authority, API Response construction, direct Prisma access |
| idempotency-control.ts | ARCH-002 | None | Request identity resolution before execution | transaction opening, Balance mutation, LedgerEntry creation, lifecycle execution, durable writes outside Consistency Boundary |
| lifecycle-control.ts | ARCH-004 | None by default | lifecycle transition intent / decision | durable writes, transaction opening, Balance mutation, LedgerEntry creation |
| balance-control.ts | ARCH-005 | Receive only if routed | Balance Change authorization | transaction opening, direct Prisma access, LedgerEntry creation, API Response construction |
| ledger-control.ts | ARCH-006 | Receive only if routed | semantic LedgerEntry intent / authority | transaction opening, direct Prisma access, Balance authorization, API Response construction |
| persistence-boundary.ts | ARCH-007 | Receive | physical durable reads/writes | business-validity decisions, lifecycle decisions, Balance authorization, LedgerEntry semantic authorization, API Response construction |

## CONSISTENCY_BOUNDARY_CALL_ORDER

Recommended internal flow for a new Transfer execution attempt:

1. Receive routed execution request from Idempotency Control.
2. Open one transaction context.
3. Capture transaction metadata timestamp if needed.
4. Persist or confirm Request reservation through Persistence Boundary.
5. Create or load Transfer persistence state through Persistence Boundary.
6. Ask Lifecycle Control for valid transition intent.
7. Ask Balance Control to authorize Balance Change eligibility.
8. Ask Ledger Control to create / approve LedgerEntry intent.
9. Route approved physical writes through Persistence Boundary.
10. Persist Request outcome through Persistence Boundary.
11. Commit transaction.
12. Return persisted outcome to caller.

This order is implementation guidance only.

Micro-order may change only if:

- source authority is preserved
- IMP-INDEX routing is preserved
- all write-set effects remain atomic
- lifecycle execution remains VALIDATED → EXECUTED
- Balance Control remains the only Balance Change authorization owner
- Ledger Control remains the only semantic LedgerEntry creation owner
- Persistence Boundary performs physical durable writes only
- mapped TEST-* coverage remains valid

## LIFECYCLE_TRANSACTION_RULE

Transfer execution is lifecycle-governed.

Execution occurs only during:

- VALIDATED → EXECUTED

Consistency Boundary must not allow:

- Balance Changes in REQUESTED
- Balance Changes in VALIDATED outside execution
- Balance Changes in FAILED
- Balance Changes after EXECUTED
- LedgerEntries before execution
- LedgerEntries for FAILED Transfer
- LedgerEntries without valid lifecycle execution
- terminal state exit
- repeated execution

Lifecycle Control owns transition intent / decision.

Persistence Boundary physically persists lifecycle-state changes when routed by Consistency Boundary.

Lifecycle Control MUST NOT directly write durable state unless IMP-INDEX routing is changed.

## BALANCE_AND_LEDGER_TRANSACTION_RULE

Balance Control owns Balance Change authorization.

Ledger Control owns semantic LedgerEntry creation authority.

Persistence Boundary owns physical durable writes.

Balance Control MUST NOT:

- perform direct database writes outside Persistence Boundary
- create LedgerEntries
- open transaction context
- construct API responses
- bypass Ledger Control, Lifecycle Control, or Idempotency Control

Ledger Control MUST NOT:

- perform direct database writes outside Persistence Boundary
- mutate Balance directly
- open transaction context
- construct API responses
- bypass Balance Control, Lifecycle Control, or Idempotency Control

LedgerEntry intent for an executed Transfer must preserve:

- associated Transfer
- affected Account
- Asset
- amount delta
- operation completeness
- traceability to Balance Change

If source Balance and destination Balance rows are both updated, they must be updated within the same operation transaction.

Balance-affecting arithmetic MUST NOT use JavaScript number.

## PERSISTENCE_TRANSACTION_RULE

Persistence Boundary owns physical durable reads and writes.

Persistence Boundary may receive transaction context from Consistency Boundary.

Allowed Persistence Boundary responsibilities:

- read Request by identity
- reserve Request identity when routed
- persist Request outcome
- create Transfer row
- persist Transfer lifecycle state
- read affected Balance rows
- persist approved Balance updates
- persist approved LedgerEntries
- read operation records for duplicate outcome

Forbidden Persistence Boundary responsibilities:

- decide if Transfer is valid
- decide if Balance Change is allowed
- decide if LedgerEntry intent is semantically complete
- decide if authorization passed
- decide if lifecycle transition is valid
- construct external API Responses
- open operation transaction unless explicitly routed
- expose raw general-purpose write methods that bypass controls

## CONCURRENCY_AND_RETRY_RULE

Transaction implementation must be safe under concurrent duplicate and competing Requests.

Required concurrency properties:

- duplicate Request identity cannot execute twice
- Balance updates for the same Account/Asset pair cannot produce invalid Balance state
- LedgerEntries cannot be duplicated by retry race
- Transfer cannot execute more than once
- Request outcome cannot diverge under race
- partial write set cannot become visible as complete

Recommended implementation controls:

- unique Request.identity
- unique Transfer.requestId
- transactional operation write set
- consistent affected-Balance access order
- conditional Balance update where needed
- database constraint enforcement
- retry only around safe idempotent transaction boundaries

When one transaction touches multiple Balance rows, access them in deterministic order.

Recommended order:

- sort by assetId, then accountId

Retries must be idempotency-safe.

Allowed retry target:

- whole operation request path keyed by durable Request identity

Forbidden retry targets:

- retry only Balance update
- retry only LedgerEntry creation
- retry only Transfer state update
- retry only Request outcome write
- retry inside partial write set after unknown commit state
- retry based on timestamp comparison
- retry based on logs
- retry based on in-memory cache

If commit outcome is unknown, the next observation must be durable Request identity / persisted outcome lookup, not re-execution by assumption.

If a lock helper, raw SQL helper, repository, or retry helper is needed but not routed, classify as ROUTING_GAP.

## ROLLBACK_AND_FAILURE_RULE

If any required operation write fails, the transaction must roll back.

Rollback must prevent:

- partial LedgerEntries
- partial Balance state
- successful Request outcome without operation completion
- Transfer marked EXECUTED without required LedgerEntries
- duplicate execution effects
- inconsistent Asset state
- lifecycle transition without corresponding operation outcome

Failure handling must preserve source-owned failure classification via IMP-07 mapping.

Failure handling MUST NOT:

- repair state with an unsupported Balance-Affecting Operation
- create reversal / adjustment operations without source authority
- mutate LedgerEntries
- delete LedgerEntries required for reconstruction
- mark failure as success
- rely on logs as proof
- expose internal transaction details through API Response

## TEMPORAL_ANCHORING_RULE

A transaction may use one captured timestamp for records created or updated within the same atomic operation.

Recommended pattern:

```ts
const now = new Date()
```

Allowed use:

- metadata consistency
- easier audit reading
- avoiding misleading millisecond drift among records created atomically

Forbidden use:

- replay authority
- ordering authority
- idempotency authority
- lifecycle authority
- authorization authority
- proof of correctness
- substitute for Request identity
- substitute for LedgerEntry traceability
- substitute for transaction atomicity

Temporal anchoring is implementation metadata only.

It MUST NOT define correctness.

## BOUNDED_AND_NUMERIC_RULES

Transaction correctness must remain inside the Bounded System.

Forbidden correctness dependencies:

- external settlement confirmation
- distributed coordination
- message queue delivery
- eventual consistency
- blockchain / consensus
- webhook callback
- log aggregation
- analytics store
- cache
- cron repair
- manual reconciliation

Balance-affecting arithmetic inside transaction flow MUST NOT use JavaScript number.

Allowed numeric guidance follows IMP-03:

- Decimal atomic units
- Prisma Decimal-compatible values
- integer-valued Decimal representation where routed

Transaction code MUST NOT:

- coerce Decimal to JavaScript number
- use floating-point arithmetic for Balance updates
- compare balance-affecting values using floating-point approximations
- round Balance-affecting values unless routed
- infer Asset decimal scale unless routed

If numeric representation is missing for a transaction target, classify as ROUTING_GAP or GENERATION_PACKET_INCOMPLETE unless the issue belongs to L00–L10.

## TRANSACTION_RESPONSE_RULE

Consistency Boundary does not own external API Response construction.

Allowed return from Consistency Boundary:

- persisted operation outcome
- operation result data needed by Request Boundary / response utility
- implementation error mapped by routed error handling

Forbidden return from Consistency Boundary:

- raw transaction context
- Prisma client
- internal boundary selector
- internal control execution trace as API authority
- mutable LedgerEntry authority
- direct Balance mutation authority
- lifecycle override authority

External Response meaning must remain tied to exactly one Request and must not expose internal control boundaries.

## OPERATION_COMPLETENESS_RULE

Before committing an executed Transfer, implementation must ensure operation completeness.

For MVP Transfer, completion requires:

- valid Transfer lifecycle execution
- approved Balance Change
- complete LedgerEntry intent
- approved Balance updates
- LedgerEntries persisted atomically with execution
- Request outcome persisted consistently

Forbidden complete states:

- EXECUTED Transfer without LedgerEntries
- LedgerEntries without valid Transfer execution
- Request success without executed Transfer
- Balance Change without LedgerEntry
- LedgerEntry that cannot explain Balance Change
- duplicate Request with different outcome

If operation completeness cannot be established inside the routed transaction path, classify as GENERATION_PACKET_INCOMPLETE or ROUTING_GAP.

## TRANSACTION_DEPENDENCY_RULE

consistency-boundary.ts may import only routed dependencies.

Allowed internal imports:

- src/server/ledger/lifecycle-control.ts
- src/server/ledger/balance-control.ts
- src/server/ledger/ledger-control.ts
- src/server/ledger/persistence-boundary.ts
- src/lib/errors.ts

Only include src/lib/errors.ts if routed by IMP-INDEX / IMP-02 for the generated target.

Forbidden internal imports:

- src/app/*
- src/server/ledger/request-boundary.ts
- src/server/ledger/authorization-control.ts
- src/server/ledger/idempotency-control.ts
- src/server/ledger/read-derivation-boundary.ts
- src/domain/* unless explicitly routed
- src/lib/response.ts
- tests/*
- prisma/seed.ts

consistency-boundary.ts MUST NOT import Prisma directly unless IMP-INDEX is updated.

Prisma access is owned by persistence-boundary.ts.

Do not create transaction helper files unless routed by IMP-INDEX.

Forbidden helper examples:

- src/server/ledger/transaction.ts
- src/server/ledger/transaction-context.ts
- src/lib/transaction.ts
- src/lib/prisma.ts
- src/db/transaction.ts

If a helper is required, classify as ROUTING_GAP.

## TARGET_RULE_MATRIX

| Target file | Boundary owner | Transaction authority | Required source focus | Required proof tests |
| --- | --- | --- | --- | --- |
| src/server/ledger/consistency-boundary.ts | ARCH-003 | Open / coordinate | ARCH-003, ARCH-009, INV-004, INV-009, FAIL-004, FAIL-009, FSM-005, SCHEMA-011, SCHEMA-013, API-012, API-013, AUTHZ-009, AUTHZ-010 | TEST-004, TEST-007, TEST-009, TEST-010 |
| src/server/ledger/idempotency-control.ts | ARCH-002 | None | INV-007, FAIL-007, FSM-007, SCHEMA-009, SCHEMA-010, API-008, AUTHZ-005 | TEST-007 |
| src/server/ledger/balance-control.ts | ARCH-005 | Receive only if routed | INV-001, INV-005, INV-006, FAIL-001, FAIL-005, FAIL-006, SCHEMA-003, SCHEMA-012 | TEST-001, TEST-005, TEST-006 |
| src/server/ledger/ledger-control.ts | ARCH-006 | Receive only if routed | INV-001, INV-002, INV-010, FAIL-001, FAIL-002, FAIL-010, FSM-008, SCHEMA-005, SCHEMA-006 | TEST-001, TEST-002, TEST-010 |
| src/server/ledger/persistence-boundary.ts | ARCH-007 | Receive | SCHEMA-001 through SCHEMA-013, INV-003, INV-004, INV-007, INV-009 | TEST-003, TEST-004, TEST-007, TEST-009, TEST-010 |

## PRE_GENERATION_PACKET_REQUIREMENTS

Before generating transaction-related files, resolve:

- Target file:
- Boundary owner:
- Source references:
- Required IMP files:
- Allowed dependencies:
- Forbidden dependencies:
- Mutation authority:
- Transaction authority:
- Persistence authority:
- LedgerEntry authority:
- Balance authority:
- API exposure:
- Proof tests:
- Output mode:
- Classification:

For src/server/ledger/consistency-boundary.ts, the minimum packet is:

- Target file: src/server/ledger/consistency-boundary.ts
- Boundary owner: ARCH-003 Consistency Boundary
- Source references: ARCH-003, ARCH-009, INV-004, INV-009, FAIL-004, FAIL-009, FSM-005, SCHEMA-011, SCHEMA-013, API-012, API-013, AUTHZ-009, AUTHZ-010
- Required IMP files: IMP-00, IMP-02, IMP-04, IMP-07
- Allowed dependencies: lifecycle-control.ts, balance-control.ts, ledger-control.ts, persistence-boundary.ts
- Forbidden dependencies: API routes, request-boundary, authorization-control, idempotency-control, read-derivation-boundary, Prisma direct import, domain files unless routed, response utility unless routed, tests
- Mutation authority: Coordinate approved operation write set only
- Transaction authority: Open / coordinate
- Persistence authority: None directly; Persistence Boundary performs physical writes
- LedgerEntry authority: None directly; Ledger Control owns semantic authority
- Balance authority: None directly; Balance Control owns Balance Change authorization
- API exposure: Internal
- Proof tests: TEST-004, TEST-007, TEST-009, TEST-010
- Output mode: One target file only
- Classification: READY_TO_GENERATE

If transaction authority is ambiguous, classify as GENERATION_PACKET_INCOMPLETE.

If transaction context requires an unrouted helper or type file, classify as ROUTING_GAP.

## POST_GENERATION_VALIDATION

After generating transaction-related files, check:

| Label | Meaning |
| --- | --- |
| TRANSACTION_OWNER_VIOLATION | File other than consistency-boundary.ts opens or coordinates operation transaction |
| TRANSACTION_CONTEXT_LEAK | Transaction context exposed to API, domain, utility, response, test, or unauthorized files |
| PARTIAL_WRITE_SET_RISK | Operation can commit partial Balance, LedgerEntry, Transfer, or Request outcome state |
| IDEMPOTENCY_TRANSACTION_BYPASS | Duplicate Request can re-execute or bypass persisted outcome lookup |
| REQUEST_OUTCOME_DIVERGENCE | Duplicate Request can produce divergent persisted outcome or Response meaning |
| DIRECT_PRISMA_BYPASS | Non-persistence file imports Prisma directly |
| PERSISTENCE_BOUNDARY_BYPASS | Durable write occurs outside Persistence Boundary |
| BALANCE_CONTROL_BYPASS | Balance Change is authorized outside Balance Control |
| LEDGER_CONTROL_BYPASS | LedgerEntry semantic creation occurs outside Ledger Control |
| LIFECYCLE_BYPASS | Execution occurs outside routed lifecycle transition authority |
| API_BOUNDARY_LEAK | API route can select transaction path or internal control boundary |
| READ_MUTATION_LEAK | Read Derivation Boundary gains mutation or transaction execution authority |
| NUMERIC_TRANSACTION_VIOLATION | Transaction flow uses JavaScript number for balance-affecting arithmetic |
| TIMESTAMP_AUTHORITY_VIOLATION | Timestamp used as ordering, idempotency, lifecycle, replay, authorization, or proof authority |
| RETRY_DUPLICATION_RISK | Retry path can duplicate Balance Changes or LedgerEntries |
| EXTERNAL_CORRECTNESS_DEPENDENCY | Transaction correctness depends on external systems |
| PROOF_VIOLATION | Commit, logs, runtime success, compilation, or absence of error treated as proof |
| UNROUTED_TRANSACTION_HELPER | Transaction helper, type, wrapper, repository, or lock utility created without routing |

If any label applies, generated transaction output is not complete.

## TEST_MAPPING

| Transaction concern | Source references | Required tests |
| --- | --- | --- |
| Atomic operation write set | INV-004, FAIL-004, FSM-005, ARCH-003, SCHEMA-011 | TEST-004 |
| Duplicate Request does not re-execute | INV-007, FAIL-007, FSM-007, ARCH-002, SCHEMA-009, SCHEMA-010 | TEST-007 |
| Bounded transaction correctness | INV-009, FAIL-009, ARCH-003, SCHEMA-013, API-013, AUTHZ-009 | TEST-009 |
| Operation completeness | INV-010, FAIL-010, FSM-005, FSM-008, ARCH-006, SCHEMA-005, SCHEMA-011 | TEST-010 |
| API cannot bypass transaction flow | API-007, API-008, API-009, API-010, API-012 | TEST-011 |
| Authorization cannot introduce execution path | AUTHZ-005, AUTHZ-009, AUTHZ-010, AUTHZ-012 | TEST-012 |

IMP-04 may guide test-relevant transaction implementation.

Verification authority remains with L10.

Concrete test implementation belongs to IMP-08.

Completion and CI gates belong to IMP-11.

## PROOF_LIMITS

The following are not proof of transaction correctness:

- transaction function exists
- Prisma $transaction is used
- PostgreSQL is used
- commit succeeds
- no exception is thrown
- logs show success
- timestamps match
- happy-path Transfer succeeds once
- TypeScript compiles
- tests exist but are not mapped to source IDs
- routing table lists the file

Proof requires:

- source rule reference
- routed implementation ownership
- invalid-path rejection
- duplicate-path rejection / persisted duplicate outcome
- mapped TEST-* coverage
- observed passing behavior

## TRACEABILITY

| Section | Basis |
| --- | --- |
| AUTHORITY_STATUS | I00, IMP-INDEX |
| PURPOSE | L00, L03, L06, L07, IMP-INDEX |
| DEPENDS_ON | I00, L00–L10, IMP-INDEX, IMP-00, IMP-01, IMP-02, IMP-03, IMP-05, IMP-07, IMP-08, IMP-11 |
| SOURCE_AUTHORITY_ORDER | I00, IMP-INDEX |
| SCOPE | IMP-INDEX TARGET_FILE_ROUTING_MATRIX |
| CLASSIFICATION_RULE | IMP-00, IMP-INDEX |
| CONSISTENCY_BOUNDARY_MODEL | ARCH-003, ARCH-009 |
| TRANSACTION_AUTHORITY_RULE | ARCH-003, IMP-INDEX |
| TRANSACTION_CONTEXT_RULE | IMP-02, IMP-INDEX |
| ATOMIC_WRITE_SET_RULE | INV-004, SCHEMA-011, TEST-004 |
| IDEMPOTENCY_TRANSACTION_RULE | INV-007, FSM-007, SCHEMA-009, SCHEMA-010, TEST-007 |
| CONTROL_OWNERSHIP_MATRIX | L06, IMP-INDEX |
| CONSISTENCY_BOUNDARY_CALL_ORDER | ARCH-009, IMP-INDEX |
| LIFECYCLE_TRANSACTION_RULE | FSM-005, FSM-006, FSM-008, INV-008 |
| BALANCE_AND_LEDGER_TRANSACTION_RULE | ARCH-005, ARCH-006, INV-001, INV-002, INV-005, INV-006, INV-010 |
| PERSISTENCE_TRANSACTION_RULE | ARCH-007, SCHEMA-001 through SCHEMA-013 |
| CONCURRENCY_AND_RETRY_RULE | INV-004, INV-007, SCHEMA-009, SCHEMA-010, SCHEMA-011 |
| ROLLBACK_AND_FAILURE_RULE | FAIL-004, FAIL-007, FAIL-010 |
| TEMPORAL_ANCHORING_RULE | IMP-00 time / timestamp guidance |
| BOUNDED_AND_NUMERIC_RULES | INV-009, SCHEMA-013, IMP-03 |
| TRANSACTION_RESPONSE_RULE | API-004, API-005, API-006, API-012 |
| OPERATION_COMPLETENESS_RULE | INV-010, FSM-008, SCHEMA-005, SCHEMA-011 |
| TRANSACTION_DEPENDENCY_RULE | IMP-02, IMP-INDEX |
| TARGET_RULE_MATRIX | IMP-INDEX |
| TEST_MAPPING | L10 |
| PROOF_LIMITS | L10, IMP-00 |
| VALIDITY_CONDITIONS | I00, L06, L07, IMP-INDEX |

## VALIDITY_CONDITIONS

This file is VALID if it:

- remains non-authoritative implementation guidance
- preserves L00–L10 as correctness authority
- preserves I00 as source lookup and traceability authority
- preserves IMP-INDEX as implementation routing authority
- does not define source-owned IDs
- does not define new correctness rules
- does not define new architectural boundaries
- preserves Consistency Boundary as transaction coordinator
- prevents transaction opening outside consistency-boundary.ts
- prevents transaction context leakage
- keeps durable physical writes inside Persistence Boundary
- keeps Balance Change authorization inside Balance Control
- keeps LedgerEntry semantic creation inside Ledger Control
- keeps lifecycle transition authority inside Lifecycle Control
- preserves idempotency before execution
- preserves duplicate Request same-outcome behavior
- preserves atomic write-set behavior
- prevents partial operation state from being represented as complete
- prevents external-system correctness dependency
- prevents timestamp-as-proof reasoning
- prevents JavaScript-number balance-affecting arithmetic
- routes proof back to TEST-* coverage

This file is INVALID if it:

- defines correctness authority
- defines source-owned IDs
- weakens or extends L00–L10
- overrides I00 lookup
- overrides IMP-INDEX routing
- permits transaction opening outside Consistency Boundary
- permits durable writes outside Persistence Boundary
- permits Balance Change authorization outside Balance Control
- permits LedgerEntry semantic creation outside Ledger Control
- permits lifecycle execution bypass
- permits duplicate Request re-execution
- permits partial Balance, LedgerEntry, Transfer, or Request outcome persistence
- permits direct Prisma access outside routed files
- permits transaction correctness to depend on external systems
- permits retries that can duplicate Balance Changes or LedgerEntries
- treats transaction commit as proof
- treats logs, timestamps, compilation, runtime success, or absence of failure as proof

## CLASSIFICATION

### SOURCE_FACT:

- L00–L10 are correctness authority.
- I00 is source indexing and traceability authority.
- IMP-INDEX is implementation/codegen routing authority.
- L06 defines Consistency Boundary as the atomic execution boundary for Balance-Affecting Operations.
- L06 requires Lifecycle Control, Balance Control, Ledger Control, and Persistence Boundary inside Consistency Boundary.
- L06 requires Idempotency Control before Consistency Boundary execution.
- L07 requires atomic operation representation and Request outcome idempotency representation.
- L05 defines Transfer execution as VALIDATED → EXECUTED.
- L10 owns verification authority.

### INFERENCE:

- A single database transaction is the implementation mechanism most directly aligned with Consistency Boundary atomicity.
- Transaction context must flow downward only to prevent boundary bypass.
- Durable Request identity is the safest anchor for retry and duplicate behavior.
- Consistent Balance row access order reduces deadlock risk under concurrent Transfers.
- Temporal anchoring improves metadata coherence but does not prove correctness.

### ASSUMPTION:

- MVP implementation uses Prisma $transaction with PostgreSQL.
- Transaction write sets are coordinated in consistency-boundary.ts.
- Physical writes are performed through persistence-boundary.ts.
- Related records may share one captured metadata timestamp within a transaction.

These assumptions are implementation guidance only.

They MUST NOT define source correctness.

### IMPLEMENTATION_GUIDANCE_ONLY:

- concrete transaction function shape
- transaction call ordering
- lock/access ordering
- retry-loop structure
- transaction metadata timestamp capture
- Persistence Boundary method naming
- Prisma transaction mechanics

### SOURCE_GAP:

- No blocking SOURCE_GAP is identified within this IMP-04 document.

### SOURCE_CONFLICT:

- No blocking SOURCE_CONFLICT is identified within this IMP-04 document.

## LOCK_STATUS

READY_FOR_USE only if:

- filename matches the IMP-INDEX registry entry for IMP-04
- IMP-INDEX routes src/server/ledger/consistency-boundary.ts
- IMP-INDEX routes transaction authority for consistency-boundary.ts
- IMP-INDEX routes transaction receiving for allowed downstream controls
- I00 indexes all source-owned IDs used by transaction targets
- L06 defines ARCH-003 and ARCH-009
- L07 defines SCHEMA-009, SCHEMA-010, SCHEMA-011, and SCHEMA-013
- L05 defines FSM-005 and FSM-007
- L10 defines TEST-004, TEST-007, TEST-009, and TEST-010
- IMP-00 defines global generation protocol
- IMP-02 exists or is scheduled and defines dependency/import legality
- IMP-03 exists or is scheduled and defines Prisma/persistence implementation guidance
- IMP-05 exists or is scheduled and defines Transfer-only operation guidance
- IMP-07 exists or is scheduled and defines failure/error mapping
- generated implementation treats unrouted transaction helpers as ROUTING_GAP
- generated implementation does not treat transaction commit, logs, timestamps, compilation, runtime success, or absence of error as proof

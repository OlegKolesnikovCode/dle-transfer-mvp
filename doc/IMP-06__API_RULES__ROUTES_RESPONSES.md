# IMP-06__API_RULES__ROUTES_RESPONSES.md

## AUTHORITY_STATUS

NON_AUTHORITATIVE_IMPLEMENTATION_GUIDANCE

IMP-06 defines implementation guidance for DLE-2 API routes and API-safe Responses.

Correctness authority is owned exclusively by L00–L10.

L08 owns API contract meaning.

IMP-06 MUST NOT:

- define correctness rules
- define source-owned IDs
- define invariants
- define failure classes
- define lifecycle rules
- define architecture rules
- define schema rules
- define API contract rules as source authority
- define authorization rules
- define verification requirements
- override I00
- override L00–L10
- override IMP-INDEX routing
- create unsupported API routes
- create unsupported Balance-Affecting Operations
- expose internal control boundaries
- permit direct Balance mutation
- permit direct LedgerEntry creation
- permit lifecycle override
- treat API success as proof

---

## PURPOSE

Guide implementation of the MVP API surface while preserving L08 as source authority.

IMP-06 applies directly to:

```txt
src/app/api/transfers/route.ts
src/app/api/transfers/[transferId]/route.ts
src/app/api/transfers/[transferId]/ledger-entries/route.ts
src/app/api/accounts/[accountId]/balances/route.ts
src/lib/response.ts
```

IMP-06 informs, but does not own:

```txt
src/server/ledger/request-boundary.ts
src/server/ledger/read-derivation-boundary.ts
src/server/ledger/authorization-control.ts
src/lib/errors.ts
```

API correctness requires:

- source rule reference
- routed implementation ownership
- write route terminating at Request Boundary
- read routes terminating at Read Derivation Boundary
- invalid-path rejection
- duplicate Request response determinism
- no internal boundary exposure
- no direct mutation API
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
- IMP-05__TRANSFER_OPERATION__MVP_ONLY.md
- IMP-07__FAILURE_MAPPING__LEDGER_ERRORS.md
- IMP-08__VERIFICATION_MATRIX__TEST_001_TO_012.md
- IMP-11__DONE_CRITERIA__CI_AND_PROOF.md

## AUTHORITY_ORDER

Correctness authority:

L00 → L01 → L02 → L03 → L04 → L05 → L06 → L07 → L08 → L09 → L10

Lookup / traceability authority:

I00__INDEXING_AUTHORITY__TRACEABILITY__GLOBAL.md

Implementation routing authority:

IMP-INDEX__IMPLEMENTATION_ROUTING__CODEGEN_ENTRY.md

Implementation guidance:

IMP-00 → IMP-11

Generated API implementation remains subordinate to L00–L10, I00, IMP-INDEX, and routed IMP guidance.

## AUTHORITY_RESOLUTION

| Conflict | Winner |
| --- | --- |
| IMP-06 conflicts with L00–L10 | L00–L10 |
| IMP-06 conflicts with L08 API contract meaning | L08 |
| IMP-06 conflicts with I00 lookup / traceability metadata | I00 |
| IMP-06 conflicts with IMP-INDEX routing, ownership, dependencies, source IDs, IMP files, proof tests, API exposure, or packet shape | IMP-INDEX unless L00–L10 or I00 are violated |
| IMP-06 conflicts with IMP-00 global protocol | IMP-00 unless higher authority is violated |
| IMP-06 conflicts with IMP-02 dependency legality | IMP-02 unless higher authority is violated |
| IMP-06 conflicts with IMP-05 Transfer guidance | IMP-05 owns Transfer-domain guidance; IMP-06 owns API route/Response guidance |
| IMP-06 conflicts with IMP-07 error mapping | IMP-07 owns failure/error mapping; IMP-06 owns API-safe response placement |

If IMP-06 appears to authorize a route, dependency, Response field, mutation path, helper, or operation not routed by IMP-INDEX, classify as ROUTING_GAP.

## PRIMARY_SOURCE_MAPPING

IMP-06 primarily maps to:

- API-001 through API-013
- ARCH-001
- ARCH-008
- ARCH-009
- AUTHZ-001 through AUTHZ-012
- INV-001
- INV-002
- INV-003
- INV-005
- INV-006
- INV-007
- INV-008
- INV-010
- TEST-001
- TEST-002
- TEST-003
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
| READY_TO_GENERATE | Target API/response file and route/dependency fields are routed | Proceed |
| GENERATION_PACKET_INCOMPLETE | Route target, source references, dependencies, API exposure, Response shape, or proof tests are missing or ambiguous | Stop; complete packet |
| ROUTING_GAP | API route, helper, response utility, DTO, validation file, dependency, or route path is not routed | Stop; report missing route |
| SOURCE_GAP | Required source-owned API, architecture, authz, invariant, schema, or verification rule is missing | Stop; report missing source authority |
| SOURCE_CONFLICT | Source/routing/guidance conflict changes API legality | Stop; do not choose by preference |
| INFERENCE | Derived API guidance from source facts but not source-owned | Label non-authoritative |
| ASSUMPTION | Reversible implementation choice not specified by source/routing | Label and minimize |
| IMPLEMENTATION_GUIDANCE_ONLY | Useful implementation guidance, not source authority | May guide implementation |

Default classification for unrouted API routes, helpers, response utilities, DTO files, request parsers, validation modules, imports, or route paths is ROUTING_GAP.

## MVP_API_SURFACE_RULE

Allowed MVP API routes:

| Route | Method | Purpose | Boundary target |
| --- | --- | --- | --- |
| /api/transfers | POST | submit Request for Transfer | Request Boundary |
| /api/transfers/:transferId | GET | inspect Transfer | Read Derivation Boundary |
| /api/transfers/:transferId/ledger-entries | GET | inspect Transfer LedgerEntries | Read Derivation Boundary |
| /api/accounts/:accountId/balances | GET | inspect derived Balance view | Read Derivation Boundary |

Generated implementation MUST NOT create additional routes unless IMP-INDEX routes them first.

Forbidden routes include:

- PATCH /api/balances/:id
- PUT /api/balances/:id
- POST /api/balances
- DELETE /api/balances/:id

- POST /api/ledger-entries
- PATCH /api/ledger-entries/:id
- PUT /api/ledger-entries/:id
- DELETE /api/ledger-entries/:id

- PATCH /api/transfers/:id/state
- PUT /api/transfers/:id/state
- POST /api/transfers/:id/execute
- POST /api/transfers/:id/fail
- POST /api/transfers/:id/validate

- POST /api/deposits
- POST /api/withdrawals
- POST /api/adjustments
- POST /api/reversals
- POST /api/settlements
- POST /api/exchanges
- POST /api/operations
- POST /api/balance-affecting-operations
- POST /api/ledger-operations

Forbidden API behavior:

- direct Balance mutation
- direct LedgerEntry creation, update, delete, or repair
- external lifecycle-state selection
- internal control-boundary selection
- direct transaction selection
- direct Prisma access
- bypass of Request identity
- bypass of Idempotency Control
- bypass of Authorization evaluation where routed
- bypass of Lifecycle Control
- bypass of Balance Control
- bypass of Ledger Control
- bypass of Persistence Boundary

## REQUEST_CONTRACT_RULE

External interaction with a Balance-Affecting Operation occurs through Request.

For MVP Transfer write route, Request body may include:

- requestIdentity
- sourceAccountId
- destinationAccountId
- assetId
- amount

These field names are implementation guidance only.

Request body MUST NOT include:

- lifecycleState
- state
- statusOverride
- forceExecute
- skipIdempotency
- skipAuthorization
- skipLifecycle
- skipBalanceControl
- skipLedgerControl
- skipPersistence
- ledgerEntries
- balanceDelta
- sourceBalanceMutation
- destinationBalanceMutation
- transactionMode
- internalBoundary
- consistencyBoundary
- persistenceCommand

Request identity MUST be externally supplied and preserved.

Request identity MUST NOT be replaced by:

- timestamp
- random per-attempt value
- in-memory cache key
- log correlation ID
- HTTP request ID
- database auto-ID alone
- client retry assumption

Duplicate Request submission must be representable without ambiguity.

## RESPONSE_CONTRACT_RULE

Response is the external representation of the result of a Request.

Response MUST:

- reflect the result of exactly one Request where applicable
- preserve Request pairing
- not redefine system state
- not introduce new system state
- not grant mutation authority
- not expose internal control-boundary execution path
- not expose raw transaction context
- not expose Prisma objects as authority
- not create divergent meaning for identical persisted Request outcome

Response MAY include:

- requestId
- requestIdentity
- status
- result
- transferId
- error

Read responses MAY include:

- transfer
- balances
- ledgerEntries

Response MUST NOT include:

- canMutateBalance
- canCreateLedgerEntry
- canOverrideLifecycle
- internalBoundary
- transactionHandle
- persistenceCommand
- nextInternalState
- forceExecuteToken

Response construction is not proof of correctness.

## DUPLICATE_REQUEST_RESPONSE_RULE

Duplicate Request behavior must preserve idempotent Response meaning.

Allowed duplicate behavior:

same Request identity → same persisted Request outcome → same Response meaning

Duplicate Request MUST NOT:

- re-execute Transfer
- create a new Transfer
- create additional LedgerEntries
- create additional Balance Changes
- create a new lifecycle execution path
- produce divergent Response semantics

HTTP status may vary only if routed and if Response meaning does not diverge.

Retry timing is not idempotency authority.

## TARGET_ROUTE_MATRIX

| Target file | Method | Boundary owner | Allowed dependencies | Forbidden dependencies | Proof tests |
| --- | --- | --- | --- | --- | --- |
| src/app/api/transfers/route.ts | POST | Write API Request Boundary | src/server/ledger/request-boundary.ts, src/lib/response.ts, src/lib/errors.ts | Prisma, Consistency Boundary, Lifecycle Control, Balance Control, Ledger Control, Persistence Boundary, Read Derivation Boundary, Transfer LedgerEntry planner, tests | TEST-007, TEST-008, TEST-011, TEST-012 |
| src/app/api/transfers/[transferId]/route.ts | GET | Read API Boundary | src/server/ledger/read-derivation-boundary.ts, src/lib/response.ts | Prisma, Request Boundary, Authorization Control, Idempotency Control, Consistency Boundary, Lifecycle Control, Balance Control, Ledger Control, Persistence Boundary, tests | TEST-011 |
| src/app/api/transfers/[transferId]/ledger-entries/route.ts | GET | Read API Boundary | src/server/ledger/read-derivation-boundary.ts, src/lib/response.ts | Prisma, Request Boundary, Authorization Control, Idempotency Control, Consistency Boundary, Lifecycle Control, Balance Control, Ledger Control, Persistence Boundary, tests | TEST-001, TEST-002, TEST-010, TEST-011 |
| src/app/api/accounts/[accountId]/balances/route.ts | GET | Read API Boundary | src/server/ledger/read-derivation-boundary.ts, src/lib/response.ts | Prisma, Request Boundary, Authorization Control, Idempotency Control, Consistency Boundary, Lifecycle Control, Balance Control, Ledger Control, Persistence Boundary, tests | TEST-003, TEST-005, TEST-006, TEST-011 |
| src/lib/response.ts | Utility | API response utility | src/lib/errors.ts | src/app/*, src/server/*, src/domain/operations/transfer/*, Prisma, tests | TEST-007, TEST-011 |

## TARGET_FILE_RULES

### Write route

src/app/api/transfers/route.ts may:

- expose POST handler
- parse external Transfer Request input
- forward to Request Boundary
- preserve externally supplied Request identity
- call response/error utilities if routed
- return API-safe Response

It MUST NOT:

- call Prisma directly
- open transactions
- mutate Balance
- create LedgerEntries
- select lifecycle state
- validate lifecycle transitions directly
- authorize Balance Changes directly
- call Consistency Boundary directly
- call Balance Control directly
- call Ledger Control directly
- call Persistence Boundary directly
- dispatch unsupported operations

### Read routes

Read route files may:

- expose GET handlers
- parse route parameters
- call Read Derivation Boundary
- call response utility
- return read-only Transfer, LedgerEntry, or Balance views

They MUST NOT:

- mutate state
- execute Transfer
- authorize Balance-Affecting Operations
- open write transactions
- call Prisma directly
- call write controls directly
- repair data
- recalculate and persist Balance
- generate missing LedgerEntries
- alter Transfer lifecycle state

### Response utility

src/lib/response.ts may:

- construct API-safe success envelopes
- construct API-safe error envelopes
- preserve Request-to-Response pairing fields
- map implementation errors into safe output through IMP-07 guidance
- prevent internal control details from leaking

It MUST NOT:

- execute operations
- mutate state
- call server controls
- call Prisma
- authorize Requests
- decide lifecycle transitions
- authorize Balance Changes
- create LedgerEntries
- define source-owned failure classes
- treat Response shape as proof

Recommended response envelope guidance:

```json
{
  "requestId": "...",
  "requestIdentity": "...",
  "status": "success | error",
  "result": {},
  "error": null
}
```

This shape is implementation guidance only.

It MUST NOT redefine L08 Response source meaning.

## API_ERROR_RESPONSE_RULE

API error responses should be stable, safe, and source-traceable through IMP-07 mappings.

Error responses MAY include:

- requestId
- requestIdentity
- status
- error.code
- error.message
- error.sourceFailureId
- error.sourceReferences

Error responses MUST NOT expose:

- stack traces
- raw Prisma errors
- database connection details
- transaction internals
- internal boundary path
- authorization internals
- raw policy data
- raw SQL
- secret configuration

API error mapping MUST NOT:

- create new failure classes
- redefine L04 failure classes
- treat implementation errors as source authority
- mark invalid behavior as success
- hide boundary bypass as generic success
- expose internal controls as external API contract

Detailed failure/error mapping belongs to IMP-07.

## API_DEPENDENCY_RULE

Allowed dependency paths:

```txt
POST /api/transfers
→ src/server/ledger/request-boundary.ts
→ src/lib/response.ts
→ src/lib/errors.ts
GET routes
→ src/server/ledger/read-derivation-boundary.ts
→ src/lib/response.ts
```

API routes MUST NOT use dependency injection to receive forbidden capabilities:

- Prisma client
- transaction handle
- Balance mutator
- LedgerEntry creator
- lifecycle executor
- Persistence Boundary writer
- internal operation executor

Do not create unless IMP-INDEX routes first:

- src/app/api/_helpers/*
- src/app/api/lib/*
- src/app/api/transfers/helpers.ts
- src/lib/api.ts
- src/lib/http.ts
- src/lib/route.ts

If an API helper is needed but not routed, classify as ROUTING_GAP.

## API_AUTHORIZATION_RULE

Write route must route through Request Boundary, which routes authorization evaluation according to IMP-INDEX.

API routes MUST NOT:

- implement authorization policy directly unless routed
- skip authorization for Balance-Affecting Operation invocation
- treat authentication as authorization unless routed
- let authorization mutate Balance
- let authorization create LedgerEntries
- let authorization select lifecycle state
- let authorization introduce new execution path
- let authorization bypass Idempotency Control
- let authorization bypass Lifecycle Control
- let authorization bypass Balance Control
- let authorization bypass Ledger Control
- let authorization bypass Persistence Boundary

Unauthorized Request must not result in a Balance-Affecting Operation.

## API_IDEMPOTENCY_RULE

Write route must accept and forward Request identity to Request Boundary.

API route MUST NOT:

- replace Request identity with generated timestamp
- replace Request identity with HTTP request ID
- generate a new idempotency key per retry
- treat duplicate submission as a new operation
- bypass Idempotency Control
- implement idempotency with local memory
- implement idempotency with logs
- implement idempotency with client retry assumption

Duplicate Request API response must reflect the same persisted Request outcome meaning.

## API_VALIDATION_RULE

API-level validation may check external input shape:

- request body exists
- required route parameter exists
- Request identity exists
- field type / parseability checks
- unsupported method rejection where routed
- unsupported operation shape rejection

API-level validation MUST NOT own:

- lifecycle transition decision
- Balance Change authorization
- LedgerEntry semantic creation
- authorization policy decision unless routed
- persistence behavior
- transaction behavior
- source correctness proof

Transfer-specific validation belongs to routed Transfer validation helpers and Balance Control where applicable.

## API_METHOD_RULE

Generated API route files must expose only routed HTTP methods.

Allowed methods:

- POST for src/app/api/transfers/route.ts
- GET for read route files

Forbidden unless routed:

- PUT
- PATCH
- DELETE
- POST on read routes
- GET on write route if not routed
- OPTIONS custom logic unless framework/default behavior
- HEAD custom logic unless framework/default behavior

Do not add method handlers for convenience.

## INTERNAL_BOUNDARY_NON_EXPOSURE_RULE

Request and Response MUST NOT expose:

- Request Boundary internals
- Idempotency Control internals
- Consistency Boundary internals
- Lifecycle Control internals
- Balance Control internals
- Ledger Control internals
- Persistence Boundary internals
- transaction context
- Prisma model internals as authority
- internal file paths
- internal function names
- internal execution trace as authority

Read responses may expose system-defined entity data only.

Write responses may expose Request-paired operation outcome only.

Do not expose internal execution ordering as an API contract.

## PRE_GENERATION_PACKET_REQUIREMENTS

Before generating any IMP-06 target, resolve:

```txt
Target file:
Boundary owner:
Source references:
Required IMP files:
Allowed dependencies:
Forbidden dependencies:
Mutation authority:
Transaction authority:
Persistence authority:
LedgerEntry authority:
Balance authority:
API exposure:
Proof tests:
Output mode: One target file only
Classification:
```

Use this target-specific packet matrix:

| Target file | Source references | Required IMP files | API exposure |
| --- | --- | --- | --- |
| src/app/api/transfers/route.ts | ARCH-001, ARCH-009, API-001 through API-013, AUTHZ-001 through AUTHZ-012 | IMP-00, IMP-02, IMP-06, IMP-07 | Write Route |
| src/app/api/transfers/[transferId]/route.ts | ARCH-008, API-004, API-005, API-011, API-012, API-013 | IMP-00, IMP-02, IMP-06 | Read Route |
| src/app/api/transfers/[transferId]/ledger-entries/route.ts | ARCH-008, API-005, API-010, API-011, API-012, API-013, INV-001, INV-002, INV-010 | IMP-00, IMP-02, IMP-06 | Read Route |
| src/app/api/accounts/[accountId]/balances/route.ts | ARCH-008, API-005, API-009, API-011, API-012, API-013, INV-003, INV-005, INV-006, SCHEMA-003, SCHEMA-004 | IMP-00, IMP-02, IMP-06 | Read Route |
| src/lib/response.ts | API-004, API-005, API-006, API-011, API-012, FAIL-001 through FAIL-010 | IMP-00, IMP-06, IMP-07 | Utility |

For all targets:

- Mutation authority: None
- Transaction authority: None
- Persistence authority: None
- LedgerEntry authority: None
- Balance authority: None
- Classification: READY_TO_GENERATE only if routed

If a target requires any route, helper, dependency, method, or Response field not listed above, classify before generation.

## POST_GENERATION_VALIDATION

After generating API-related files, validate against these IMP-06 labels:

| Protocol label | Meaning |
| --- | --- |
| UNROUTED_API_ROUTE | Created an API route not listed in IMP-INDEX |
| UNSUPPORTED_HTTP_METHOD | Added an HTTP method not routed for the target route |
| DIRECT_BALANCE_MUTATION_API | API permits direct Balance mutation or Balance Change |
| DIRECT_LEDGERENTRY_CREATION_API | API permits direct LedgerEntry creation, update, delete, or repair |
| LIFECYCLE_OVERRIDE_API | API permits caller to select or override Transfer lifecycle state |
| INTERNAL_BOUNDARY_EXPOSURE | Request or Response exposes internal control boundaries or execution path |
| REQUEST_IDENTITY_GAP | Write route fails to preserve externally supplied Request identity |
| IDEMPOTENCY_BYPASS | API duplicate Request path can bypass Idempotency Control |
| RESPONSE_PAIRING_VIOLATION | Response is not tied to exactly one Request where required |
| RESPONSE_STATE_REDEFINITION | Response introduces or redefines system state |
| DIVERGENT_DUPLICATE_RESPONSE | Identical persisted Request outcome can produce divergent Response meaning |
| WRITE_ROUTE_BOUNDARY_BYPASS | Write route bypasses Request Boundary |
| READ_ROUTE_MUTATION_LEAK | Read route can mutate, authorize, or execute Balance-Affecting Operation |
| DIRECT_PRISMA_BYPASS | API route imports Prisma or generated client directly |
| PERSISTENCE_BOUNDARY_BYPASS | API route calls Persistence Boundary or performs durable writes directly |
| BALANCE_CONTROL_BYPASS | API route calls Balance Control directly |
| LEDGER_CONTROL_BYPASS | API route calls Ledger Control directly |
| AUTHORIZATION_BYPASS | API route bypasses routed authorization evaluation |
| ERROR_LEAKAGE | API error response leaks stack traces, database internals, transaction internals, or secret data |
| UNSUPPORTED_OPERATION_API | API exposes unsupported Balance-Affecting Operation |
| UNROUTED_RESPONSE_HELPER | Response helper or API utility created without routing |
| PROOF_VIOLATION | HTTP success, route existence, logs, runtime success, compilation, or happy-path behavior treated as proof |

If validation fails, generated API output is not acceptable as complete.

## TEST_MAPPING

| API concern | Source references | Required tests |
| --- | --- | --- |
| API boundary and route restrictions | API-001 through API-013 | TEST-011 |
| duplicate Request response determinism | API-002, API-003, API-006, INV-007 | TEST-007, TEST-011 |
| lifecycle bypass prevention | API-007, INV-008 | TEST-008, TEST-011 |
| idempotency bypass prevention | API-008, INV-007 | TEST-007, TEST-011 |
| direct Balance mutation prevention | API-009, INV-001 | TEST-001, TEST-011 |
| direct LedgerEntry creation prevention | API-010, INV-002, INV-010 | TEST-002, TEST-010, TEST-011 |
| system-defined entity exposure | API-011 | TEST-011 |
| Request Boundary termination | API-012, ARCH-001, ARCH-009 | TEST-011 |
| Bounded System API restriction | API-013, INV-009 | TEST-009, TEST-011 |
| authorization cannot be bypassed through API | AUTHZ-001 through AUTHZ-012 | TEST-012 |

Verification authority remains with L10.

Concrete test implementation belongs to IMP-08.

Completion and CI gates belong to IMP-11.

## PROOF_LIMITS

The following are not proof of API correctness:

- route file exists
- route compiles
- route returns JSON
- HTTP 200 is returned
- Postman/curl request succeeds
- happy-path Transfer succeeds once
- duplicate Request appears to work once
- logs show Request identity
- response shape looks consistent
- route is listed in IMP-INDEX
- no runtime error occurred

Proof requires:

- source rule reference
- routed implementation ownership
- forbidden route/method absence or rejection
- direct mutation path rejection
- lifecycle override rejection
- internal-boundary non-exposure
- duplicate Request same-outcome behavior
- mapped TEST-* coverage
- observed passing behavior

## TRACEABILITY

| Section | Basis |
| --- | --- |
| AUTHORITY_STATUS | I00, IMP-INDEX, IMP-00 |
| PURPOSE | L08, IMP-INDEX |
| DEPENDS_ON | I00, L00–L10, IMP-INDEX, IMP-00 through IMP-05, IMP-07, IMP-08, IMP-11 |
| AUTHORITY_RESOLUTION | I00, L00–L10, IMP-INDEX, IMP-00, IMP-02, IMP-05, IMP-07 |
| PRIMARY_SOURCE_MAPPING | I00, IMP-INDEX |
| CLASSIFICATION_RULE | IMP-00, IMP-INDEX |
| MVP_API_SURFACE_RULE | L08, IMP-INDEX |
| REQUEST_CONTRACT_RULE | API-001, API-002, API-003 |
| RESPONSE_CONTRACT_RULE | API-004, API-005, API-006 |
| DUPLICATE_REQUEST_RESPONSE_RULE | API-003, API-006, INV-007 |
| TARGET_ROUTE_MATRIX | IMP-INDEX, IMP-02, L06, L08 |
| TARGET_FILE_RULES | L06, L08, IMP-02 |
| API_ERROR_RESPONSE_RULE | IMP-07, L04, L08 |
| API_DEPENDENCY_RULE | IMP-02, IMP-INDEX |
| API_AUTHORIZATION_RULE | L09, AUTHZ-001 through AUTHZ-012 |
| API_IDEMPOTENCY_RULE | INV-007, API-002, API-003, API-006, API-008 |
| API_VALIDATION_RULE | L08, IMP-05 |
| API_METHOD_RULE | IMP-INDEX |
| INTERNAL_BOUNDARY_NON_EXPOSURE_RULE | API-012 |
| TEST_MAPPING | L10, IMP-08 |
| PROOF_LIMITS | L10, IMP-00 |
| VALIDITY_CONDITIONS | I00, L08, IMP-INDEX |

## VALIDITY_CONDITIONS

This file is VALID if it:

- remains non-authoritative implementation guidance
- preserves L00–L10 as correctness authority
- preserves L08 as API contract authority
- preserves I00 as source lookup and traceability authority
- preserves IMP-INDEX as implementation routing authority
- does not define source-owned IDs
- does not define new correctness rules
- does not create unsupported API routes
- preserves POST /api/transfers as the only MVP write operation route
- preserves read routes as read-only routes
- preserves write route termination at Request Boundary
- preserves read route termination at Read Derivation Boundary
- prevents direct Balance mutation APIs
- prevents direct LedgerEntry creation APIs
- prevents lifecycle override APIs
- prevents internal control-boundary exposure
- preserves externally supplied Request identity
- preserves duplicate Request same-outcome behavior
- prevents direct Prisma access from API routes
- prevents API routes from opening transactions
- prevents API routes from bypassing authorization, idempotency, lifecycle, Balance Control, Ledger Control, or Persistence Boundary
- routes API proof back to TEST-* coverage

This file is INVALID if it:

- defines correctness authority
- defines source-owned IDs
- weakens or extends L00–L10
- overrides I00 lookup
- overrides IMP-INDEX routing
- permits unsupported API routes
- permits unsupported Balance-Affecting Operations
- permits direct Balance mutation
- permits direct LedgerEntry creation
- permits external lifecycle override
- permits API caller to select internal control-boundary path
- permits write route to bypass Request Boundary
- permits read route to mutate or execute
- permits API route to import Prisma directly
- permits API route to open transactions
- permits API route to call Persistence Boundary directly
- exposes raw internal errors, transaction details, or database internals
- treats HTTP success, route existence, logs, runtime success, compilation, or happy-path behavior as proof

## CLASSIFICATION

### SOURCE_FACT:

- L00–L10 are correctness authority.
- I00 is source indexing and traceability authority.
- IMP-INDEX is implementation/codegen routing authority.
- L08 defines Request and Response API contract boundaries.
- L08 prohibits direct Balance mutation, direct LedgerEntry creation, lifecycle bypass, idempotency bypass, and internal control-boundary exposure.
- L06 defines Request Boundary and Read Derivation Boundary as separate architectural components.
- L09 defines authorization constraints and prevents authorization from mutating state or bypassing required controls.
- L10 owns verification authority, including TEST-011 API Boundary Verification.

### INFERENCE:

- API routes should remain thin adapters to preserve L06 boundary ownership.
- Response utilities should normalize output without gaining execution authority.
- Read routes should terminate at Read Derivation Boundary to prevent mutation leakage.
- Write route should terminate at Request Boundary to preserve idempotency and authorization flow.
- Explicitly forbidding route expansion reduces AI-generated API drift.

### ASSUMPTION:

- MVP write Request body includes requestIdentity, sourceAccountId, destinationAccountId, assetId, and amount.
- API implementation uses Next.js route handlers.
- Response utility returns JSON-compatible envelopes.
- HTTP status codes are implementation guidance and do not define Response source meaning.

These assumptions are implementation guidance only.

They MUST NOT define source correctness.

### IMPLEMENTATION_GUIDANCE_ONLY:

- route-handler shape
- response envelope field names
- HTTP status mapping
- request-body field names
- route parameter names
- response utility helper names
- error response formatting

### SOURCE_GAP:

No blocking SOURCE_GAP is identified within this IMP-06 document.

### SOURCE_CONFLICT:

No blocking SOURCE_CONFLICT is identified within this IMP-06 document.

## LOCK_STATUS

READY_FOR_USE only if:

- filename matches the IMP-INDEX registry entry for IMP-06
- IMP-INDEX routes all four API route targets
- IMP-INDEX routes src/lib/response.ts
- I00 indexes all source-owned IDs used by API targets
- L08 defines API-001 through API-013
- L06 defines ARCH-001, ARCH-008, and ARCH-009
- L09 defines AUTHZ-001 through AUTHZ-012
- L10 defines TEST-011
- IMP-00 defines global generation protocol
- IMP-02 defines dependency/import legality
- IMP-05 defines Transfer-only operation guidance
- IMP-07 defines failure/error mapping guidance
- IMP-08 defines TEST-* implementation matrix
- generated API implementation treats unrouted routes/helpers as ROUTING_GAP
- generated API implementation does not treat HTTP success, route existence, logs, runtime success, compilation, or happy-path behavior as proof

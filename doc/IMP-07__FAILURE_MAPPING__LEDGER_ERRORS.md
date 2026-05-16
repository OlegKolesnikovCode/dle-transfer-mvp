# IMP-07__FAILURE_MAPPING__LEDGER_ERRORS.md

## AUTHORITY_STATUS

NON_AUTHORITATIVE_IMPLEMENTATION_GUIDANCE

IMP-07 defines implementation guidance for mapping source-owned DLE-2 failure classes into implementation errors and API-safe error responses.

Correctness authority is owned exclusively by L00–L10.

Failure-class authority is owned exclusively by L04.

IMP-07 MUST NOT:

- define correctness rules
- define source-owned IDs
- define new `FAIL-*` classes
- redefine existing `FAIL-*` meanings
- define invariants
- define lifecycle rules
- define architecture rules
- define schema rules
- define API contract rules as source authority
- define authorization rules
- define verification requirements
- override I00
- override L00–L10
- override IMP-INDEX routing
- create unsupported Balance-Affecting Operations
- turn implementation error codes into source authority
- treat error handling as proof
- hide invalid behavior as success

---

## PURPOSE

Guide implementation of a stable error system that maps source-owned failure classes to implementation-level `LedgerError` objects and API-safe error responses.

IMP-07 applies directly to:
```txt
src/lib/errors.ts
src/lib/response.ts
```

IMP-07 informs error handling inside routed implementation files, including:

```txt
src/server/ledger/request-boundary.ts
src/server/ledger/authorization-control.ts
src/server/ledger/idempotency-control.ts
src/server/ledger/consistency-boundary.ts
src/server/ledger/lifecycle-control.ts
src/server/ledger/balance-control.ts
src/server/ledger/ledger-control.ts
src/server/ledger/persistence-boundary.ts
src/domain/operations/transfer/transfer.lifecycle.ts
src/domain/operations/transfer/transfer.validation.ts
src/domain/operations/transfer/transfer.ledger-entry-plan.ts
src/app/api/transfers/route.ts
```

Failure handling correctness requires:

- source rule reference
- routed implementation ownership
- invalid-path rejection
- correct source failure reference
- API-safe response behavior
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
- IMP-06__API_RULES__ROUTES_RESPONSES.md
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

Generated error implementation remains subordinate to L00–L10, I00, IMP-INDEX, and routed IMP guidance.

## AUTHORITY_RESOLUTION

| Conflict | Winner |
| --- | --- |
| IMP-07 conflicts with L00–L10 | L00–L10 |
| IMP-07 conflicts with L04 failure-class meaning | L04 |
| IMP-07 conflicts with L08 API Response meaning | L08 |
| IMP-07 conflicts with I00 lookup / traceability metadata | I00 |
| IMP-07 conflicts with IMP-INDEX routing, ownership, dependencies, source IDs, IMP files, proof tests, or packet shape | IMP-INDEX unless L00–L10 or I00 are violated |
| IMP-07 conflicts with IMP-00 global protocol | IMP-00 unless higher authority is violated |
| IMP-07 conflicts with IMP-02 dependency legality | IMP-02 unless higher authority is violated |
| IMP-07 conflicts with IMP-06 API response guidance | IMP-07 owns failure/error mapping; IMP-06 owns API route/Response placement |

If IMP-07 appears to authorize a new failure class, source-owned ID, API contract, route, helper file, operation, or source meaning, classify as SOURCE_CONFLICT or ROUTING_GAP.

## PRIMARY_SOURCE_MAPPING

IMP-07 primarily maps to:

- FAIL-001 through FAIL-010
- INV-001 through INV-010
- FSM-003
- API-004
- API-005
- API-006
- API-012
- TEST-001 through TEST-012

IMP-07 does not own:

- source failure meaning
- lifecycle transition rules
- Balance Change authorization
- LedgerEntry semantic creation
- transaction coordination
- persistence schema
- API route ownership
- authorization policy
- verification authority
- CI gates

## CLASSIFICATION_RULE

| Classification | Meaning | Required action |
| --- | --- | --- |
| READY_TO_GENERATE | Target error/response file and failure mapping fields are routed | Proceed |
| GENERATION_PACKET_INCOMPLETE | Error target, source references, dependency fields, error mapping, response mapping, or proof tests are missing or ambiguous | Stop; complete packet |
| ROUTING_GAP | Error helper, response helper, dependency, import, utility file, or test-support mapping is not routed | Stop; report missing route |
| SOURCE_GAP | Required source-owned failure class, invariant, lifecycle mapping, API rule, authz rule, or TEST-* mapping is missing | Stop; report missing source authority |
| SOURCE_CONFLICT | Source/routing/guidance conflict changes failure/error legality | Stop; do not choose by preference |
| INFERENCE | Derived error guidance from source facts but not source-owned | Label non-authoritative |
| ASSUMPTION | Reversible implementation choice not specified by source/routing | Label and minimize |
| IMPLEMENTATION_GUIDANCE_ONLY | Useful implementation guidance, not source authority | May guide implementation |

Default classification for missing error helpers, error utilities, response helpers, imports, or mappings is ROUTING_GAP.

## FAILURE_AUTHORITY_RULE

L04 owns FAIL-001 through FAIL-010.

IMP-07 may map those failure classes to implementation errors.

IMP-07 MUST NOT:
- create new FAIL-* IDs
- rename FAIL-* meanings
- merge failure classes as source meaning
- split failure classes into new source classes
- treat implementation error codes as source IDs
- treat HTTP status codes as failure classes
- treat exception names as failure classes
- treat logs as failure classes
- treat validation messages as failure classes

Implementation error codes are non-authoritative.

They may preserve source traceability, but they do not define source correctness.

## LEDGER_ERROR_MODEL

Recommended implementation object:

```ts
type SourceFailureId =
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

type LedgerErrorCode =
  | "UNTRACEABLE_BALANCE_CHANGE"
  | "MUTABLE_LEDGER_HISTORY"
  | "NON_RECONSTRUCTABLE_STATE"
  | "PARTIAL_OPERATION"
  | "INVALID_BALANCE_STATE"
  | "ASSET_INCONSISTENCY"
  | "DUPLICATE_EXECUTION_EFFECT"
  | "LIFECYCLE_GOVERNANCE_VIOLATION"
  | "BOUNDARY_VIOLATION"
  | "INCOMPLETE_OPERATION_REPRESENTATION"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED_REQUEST"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

type LedgerError = {
  code: LedgerErrorCode;
  message: string;
  sourceFailureId?: SourceFailureId;
  sourceReferences: string[];
  httpStatus: number;
  safeForResponse: boolean;
  details?: Record<string, unknown>;
};
```

Required properties:

- stable implementation code
- optional sourceFailureId only when mapped to L04
- full source references
- API-safe message
- HTTP status guidance
- no secret or internal state leakage

Forbidden properties:

- transactionHandle
- prismaErrorRaw
- databaseUrl
- stackTraceInResponse
- internalBoundaryPath
- rawAuthorizationPolicy
- secret
- privateKey
- sql

This shape is implementation guidance only.

It does not define source authority.

## ERROR_CODE_RULE

Implementation error codes must be stable and non-source-authoritative.

Allowed implementation-code pattern:

```txt
UPPER_SNAKE_CASE
```

Valid:

```ts
code: "ASSET_INCONSISTENCY"
sourceFailureId: "FAIL-006"
sourceReferences: ["FAIL-006", "INV-006"]
```

Invalid:

```ts
code: "FAIL-006"
sourceFailureId: "FAIL-6"
sourceReferences: ["FAIL-006, 007"]
```

Implementation error code names MUST NOT be used as source-owned IDs.

Source failure references must remain full FAIL-* IDs.

## FAILURE_TO_ERROR_MAPPING

| Source failure ID | Source failure class | Implementation code | Status | Use when | Do not use for | Tests |
| --- | --- | --- | --- | --- | --- | --- |
| FAIL-001 | Untraceable Balance Change | UNTRACEABLE_BALANCE_CHANGE | 409 | Balance Change lacks LedgerEntry support; LedgerEntries cannot explain Balance Change; traceability reconstruction fails | generic validation failure; authorization denial; read not found; absence of logs | TEST-001, TEST-010 |
| FAIL-002 | Mutable Ledger History | MUTABLE_LEDGER_HISTORY | 409 | LedgerEntry update/delete attempt; referenced LedgerEntry fields changed; direct LedgerEntry mutation API attempt | valid LedgerEntry creation during execution; read-only LedgerEntry access; missing LedgerEntries for executed Transfer | TEST-002, TEST-011 |
| FAIL-003 | Non-Reconstructable State | NON_RECONSTRUCTABLE_STATE | 409 | LedgerEntry replay cannot reconstruct state; replay differs; persisted Balance contradicts LedgerEntry-derived state | simple Balance not found; database unavailable; invalid request body | TEST-003 |
| FAIL-004 | Partial Operation | PARTIAL_OPERATION | 500 | partial LedgerEntries or Balance state; operation write set cannot commit atomically; partial state represented as complete | validation rejection before execution; authorization denial; failed Transfer with no Balance Change; duplicate Request returning existing outcome | TEST-004, TEST-010 |
| FAIL-005 | Invalid Balance State | INVALID_BALANCE_STATE | 422 | invalid Balance state; negative Balance where disallowed; required Balance association missing; operation would produce invalid Balance | lifecycle violation; Asset mismatch; LedgerEntry mutation; authorization denial | TEST-005 |
| FAIL-006 | Asset Inconsistency | ASSET_INCONSISTENCY | 422 | Asset mismatch in Balance Change; Transfer/Balance/LedgerEntry Asset mismatch; cross-Asset Transfer attempt | missing Asset ID syntax only; external settlement issue; insufficient Balance without Asset mismatch | TEST-006 |
| FAIL-007 | Duplicate Execution Effect | DUPLICATE_EXECUTION_EFFECT | 409 | duplicate Request creates additional LedgerEntries, Balance Changes, lifecycle execution, or divergent outcome | valid duplicate Request returning same persisted outcome; missing Request identity; generic non-duplicate conflict | TEST-007 |
| FAIL-008 | Lifecycle Governance Violation | LIFECYCLE_GOVERNANCE_VIOLATION | 409 | undefined state; invalid transition; terminal state exit; execution outside lifecycle rule; Balance Change outside execution; lifecycle override attempt | Asset mismatch; invalid Balance state; authorization denial by itself; malformed request body | TEST-008, TEST-011, TEST-012 |
| FAIL-009 | Boundary Violation | BOUNDARY_VIOLATION | 500 | correctness depends on external system, distributed coordination, eventual consistency, execution outside Consistency Boundary, or external correctness dependency | ordinary network failure; client timeout; local DB transient failure unless it causes boundary-correctness violation | TEST-009, TEST-011, TEST-012 |
| FAIL-010 | Incomplete Operation Representation | INCOMPLETE_OPERATION_REPRESENTATION | 409 | operation completes without LedgerEntries; LedgerEntries exist without valid operation; executed Transfer lacks required LedgerEntries; LedgerEntry plan incomplete | validation rejection before execution; authorization denial; read not found; generic database error | TEST-001, TEST-010 |

HTTP status codes are implementation guidance only.

They MUST NOT redefine source failure meaning.

## NON_FAILURE_ERROR_MAPPING

Some implementation errors are not L04 failure classes.

They may be represented without sourceFailureId.

| Condition | Code | Status | Source references | Required behavior |
| --- | --- | --- | --- | --- |
| malformed request body | VALIDATION_ERROR | 400 | API-001, API-002 | reject request; do not create FAIL-* |
| missing request identity | VALIDATION_ERROR | 400 | API-002 | reject request; preserve idempotency requirement |
| unauthorized Request | UNAUTHORIZED_REQUEST | 403 | AUTHZ-001, AUTHZ-002 | reject without Balance/Ledger/Transfer effects |
| requested read model not found | NOT_FOUND | 404 | API-005, API-011 | read-only response; no repair/mutation |
| duplicate Request payload conflict | CONFLICT | 409 | INV-007, API-003, API-006 | do not re-execute; do not hide duplicate-effect failure |
| unexpected implementation exception | INTERNAL_ERROR | 500 | L00, L10 | safe external response; no arbitrary FAIL-* mapping |

If a condition violates an L04 failure class, map to the appropriate FAIL-*.

If a condition is only API input validation or authorization denial and no source failure class applies, omit sourceFailureId and preserve source references.

## LIFECYCLE_FAILURE_MAPPING_RULE

Transfer lifecycle invalid conditions must map to L04 failure classes through L05.

| Lifecycle invalid condition | Source failure mapping |
| --- | --- |
| invalid transition | FAIL-008 |
| terminal state exit | FAIL-008 |
| execution outside FSM authority | FAIL-008 |
| execution outside Consistency Boundary | FAIL-009 |
| Balance Change outside execution | FAIL-008 |
| partial execution | FAIL-004 |
| duplicate execution | FAIL-007 |
| missing LedgerEntries | FAIL-001, FAIL-004, FAIL-010 |
| LedgerEntries without execution | FAIL-010 |
| invalid Balance state | FAIL-005 |
| Asset inconsistency | FAIL-006 |

If multiple failure classes apply:

- primary sourceFailureId = most direct violated source-owned failure class
- sourceReferences = all relevant full source IDs

Do not collapse multiple source failures into a new implementation-owned source category.

Invalid:

```txt
FAIL-001-004-010
FAIL-COMPOSITE
LEDGER_FAILURE
```

## API_SAFE_ERROR_RESPONSE_RULE

API error responses must be safe external representations.

API error responses MAY include:

- requestId
- requestIdentity
- status
- error.code
- error.message
- error.sourceFailureId
- error.sourceReferences

API error responses MUST NOT include:

- stack trace
- raw Prisma error
- SQL
- database URL
- transaction context
- internal boundary path
- secret
- authorization policy internals
- raw Request internals beyond safe fields
- raw persistence command

Response must not:

- redefine system state
- grant mutation authority
- expose internal control-boundary execution path
- expose raw implementation internals
- hide invalid behavior as success

If a LedgerError is not safeForResponse, map it to a safe INTERNAL_ERROR response.

Logs are not proof.

## ERROR_CONSTRUCTION_RULE

Recommended helper names in src/lib/errors.ts:

- makeLedgerError
- isLedgerError
- toSafeErrorBody
- FAILURE_TO_ERROR_MAP

Recommended constructor input:

```ts
{
  code: LedgerErrorCode;
  message: string;
  sourceFailureId?: SourceFailureId;
  sourceReferences: string[];
  httpStatus?: number;
  safeForResponse?: boolean;
  details?: Record<string, unknown>;
}
```

Required validation:

- sourceFailureId, if present, must be one of FAIL-001 through FAIL-010
- sourceReferences must use full source-owned IDs
- code must not use abbreviated source ID
- safeForResponse must default to false for unexpected internal errors
- raw error details must not be serialized externally by default

Forbidden constructor behavior:

- accept arbitrary FAIL-* strings
- auto-create new source IDs
- infer source failure from HTTP status only
- infer source failure from message text only
- mark raw internal errors safe by default

## ERROR_HANDLING_RULE

Implementation may throw or return LedgerError.

Allowed patterns:

```ts
throw new LedgerError(...)
return { ok: false, error: LedgerError }
```

Use one pattern consistently per target file unless routed otherwise.

Forbidden patterns:

- throw string
- throw raw Prisma error to API response
- return null for source failure
- swallow error and continue
- convert invalid behavior into success
- log error and treat operation as complete

If an invalid condition is detected, generated code must reject or fail the operation path.

It must not continue with partial execution.

## ERROR_BOUNDARY_OWNERSHIP_RULE

Error handling must preserve architectural ownership.

| Boundary / file | Error responsibility | Must not do |
| --- | --- | --- |
| Request Boundary | Convert external Request failures into routed outcome/error path | Mutate Balance, create LedgerEntries, expose internals |
| Authorization Control | Return deterministic authorization failure result | Mutate state, create execution path |
| Idempotency Control | Return duplicate persisted outcome or idempotency conflict | Re-execute, mutate Balance, create LedgerEntries |
| Consistency Boundary | Roll back transaction on operation failure | Mark partial operation complete |
| Lifecycle Control | Reject invalid lifecycle transition intent | Persist directly unless routed |
| Balance Control | Reject invalid Balance Change eligibility | Persist directly outside Persistence Boundary |
| Ledger Control | Reject incomplete/invalid LedgerEntry intent | Persist directly outside Persistence Boundary |
| Persistence Boundary | Map physical persistence errors safely | Make business-validity decisions |
| Read Derivation Boundary | Return read error/read not found safely | Mutate or repair |
| Response Utility | Produce API-safe response envelope | Execute operation, authorize, mutate, persist |

## TARGET_FILE_RULES

| Target file | May define / do | Must not do | Allowed dependencies | Proof tests |
| --- | --- | --- | --- | --- |
| src/lib/errors.ts | SourceFailureId, LedgerErrorCode, LedgerError class/object factory, failure map, safe serialization helper, type guards | import server/API/domain/Prisma/tests; execute operations; mutate state; define new FAIL-*; define source correctness; expose raw internals as API-safe by default | none | TEST-001 through TEST-012 |
| src/lib/response.ts | serialize LedgerError; preserve Request/Response pairing; prevent internal leakage; map HTTP status; produce success/error envelopes | define new failure classes; execute operations; mutate state; import server controls/Prisma; create LedgerEntries; authorize Balance Changes; expose internals; treat Response as proof | src/lib/errors.ts | TEST-007, TEST-011 |

## PRE_GENERATION_PACKET_REQUIREMENTS

Before generating src/lib/errors.ts, resolve:

```txt
Target file: src/lib/errors.ts
Boundary owner: Utility
Source references: FAIL-001 through FAIL-010, API-004, API-006
Required IMP files: IMP-00, IMP-07
Allowed dependencies: none
Forbidden dependencies: src/app/*, src/server/*, src/domain/*, Prisma, tests/*
Mutation authority: None
Transaction authority: None
Persistence authority: None
LedgerEntry authority: None
Balance authority: None
API exposure: Utility
Proof tests: TEST-001 through TEST-012
Output mode: One target file only
Classification: READY_TO_GENERATE
```

Before generating src/lib/response.ts, resolve:

```txt
Target file: src/lib/response.ts
Boundary owner: API response utility
Source references: API-004, API-005, API-006, API-011, API-012, FAIL-001 through FAIL-010
Required IMP files: IMP-00, IMP-06, IMP-07
Allowed dependencies: src/lib/errors.ts
Forbidden dependencies: src/app/*, src/server/*, src/domain/*, Prisma, tests/*
Mutation authority: None
Transaction authority: None
Persistence authority: None
LedgerEntry authority: None
Balance authority: None
API exposure: Utility
Proof tests: TEST-007, TEST-011
Output mode: One target file only
Classification: READY_TO_GENERATE
```

Before generating error handling inside any routed implementation file, resolve:

```txt
Target file:
Boundary owner:
Source references:
Required IMP files:
Allowed dependencies:
Forbidden dependencies:
Failure mapping:
Response exposure:
Mutation authority:
Transaction authority:
Persistence authority:
LedgerEntry authority:
Balance authority:
API exposure:
Proof tests:
Output mode:
Classification:
```

If failure mapping is ambiguous, classify as GENERATION_PACKET_INCOMPLETE.

If a new error helper file is needed but not routed, classify as ROUTING_GAP.

## POST_GENERATION_VALIDATION

After generating error-related files, validate against these IMP-07 labels:

| Protocol label | Meaning |
| --- | --- |
| NEW_FAILURE_CLASS | Generated new FAIL-* class or source-owned failure meaning |
| FAILURE_MEANING_REDEFINITION | Changed meaning of an L04 failure class |
| FAILURE_ID_ABBREVIATION | Used abbreviated or invalid source failure ID |
| ERROR_CODE_AS_SOURCE_ID | Treated implementation error code as source-owned ID |
| SOURCE_REFERENCE_GAP | Error lacks required source references |
| FAILURE_MAPPING_GAP | Source-classifiable invalid condition lacks mapped FAIL-* |
| FALSE_FAILURE_MAPPING | Error maps to FAIL-* without source basis |
| INVALID_PATH_SUCCESS | Invalid behavior is converted into success |
| ERROR_SWALLOWING | Error is logged/ignored while execution continues unsafely |
| RAW_ERROR_LEAK | API response exposes stack trace, Prisma error, SQL, secret, transaction, or internal boundary data |
| RESPONSE_STATE_REDEFINITION | Error response redefines system state |
| API_BOUNDARY_LEAK | Error response exposes internal control boundaries |
| IDEMPOTENCY_ERROR_BYPASS | Duplicate Request error path can re-execute or diverge from persisted outcome |
| TRANSACTION_ERROR_BYPASS | Error path can commit partial operation state |
| LEDGER_MUTABILITY_ERROR_GAP | LedgerEntry mutation is not rejected or not mapped |
| UNROUTED_ERROR_HELPER | Error helper/utility file created without IMP-INDEX routing |
| PROOF_VIOLATION | Error handling, logs, status codes, compilation, runtime success, or absence of failure treated as proof |

If validation fails, generated error-handling output is not acceptable as complete.

## ERROR_TEST_MAPPING

| Error concern | Source references | Required tests |
| --- | --- | --- |
| Untraceable Balance Change mapping | FAIL-001, INV-001 | TEST-001 |
| LedgerEntry immutability mapping | FAIL-002, INV-002 | TEST-002 |
| Replay / reconstruction error mapping | FAIL-003, INV-003 | TEST-003 |
| Partial operation rollback/error mapping | FAIL-004, INV-004 | TEST-004 |
| Invalid Balance state mapping | FAIL-005, INV-005 | TEST-005 |
| Asset inconsistency mapping | FAIL-006, INV-006 | TEST-006 |
| Duplicate execution effect mapping | FAIL-007, INV-007 | TEST-007 |
| Lifecycle governance mapping | FAIL-008, INV-008, FSM-003 | TEST-008 |
| Boundary violation mapping | FAIL-009, INV-009 | TEST-009 |
| Incomplete operation representation mapping | FAIL-010, INV-010 | TEST-010 |
| API-safe error response | API-004, API-005, API-006, API-012 | TEST-011 |
| Authorization error non-mutation | AUTHZ-001, AUTHZ-002, AUTHZ-004, AUTHZ-012 | TEST-012 |

Verification authority remains with L10.

Concrete test implementation belongs to IMP-08.

Completion and CI gates belong to IMP-11.

## PROOF_LIMITS

The following are not proof of correctness:

- error class exists
- error code exists
- error response has JSON shape
- HTTP status looks reasonable
- exception was thrown
- log was written
- TypeScript compiles
- invalid path returned non-200 once
- API response includes sourceFailureId
- test mocks throw expected errors
- no runtime error occurred

Proof requires:

- source rule reference
- routed implementation ownership
- invalid-path rejection
- correct failure/error mapping
- API-safe response behavior
- mapped TEST-* coverage
- observed passing behavior

## TRACEABILITY

| Section | Basis |
| --- | --- |
| AUTHORITY_STATUS | I00, L04, IMP-INDEX, IMP-00 |
| PURPOSE | L04, L08, IMP-INDEX |
| DEPENDS_ON | I00, L00–L10, IMP-INDEX, IMP-00 through IMP-06, IMP-08, IMP-11 |
| AUTHORITY_RESOLUTION | I00, L04, L08, IMP-INDEX, IMP-00, IMP-02, IMP-06 |
| PRIMARY_SOURCE_MAPPING | I00, IMP-INDEX |
| CLASSIFICATION_RULE | IMP-00, IMP-INDEX |
| FAILURE_AUTHORITY_RULE | L04 |
| LEDGER_ERROR_MODEL | IMPLEMENTATION_GUIDANCE_ONLY |
| ERROR_CODE_RULE | I00, L04 |
| FAILURE_TO_ERROR_MAPPING | L04, L03 |
| NON_FAILURE_ERROR_MAPPING | L08, L09 |
| LIFECYCLE_FAILURE_MAPPING_RULE | L05 FAILURE MAPPING |
| API_SAFE_ERROR_RESPONSE_RULE | L08, IMP-06 |
| ERROR_CONSTRUCTION_RULE | IMPLEMENTATION_GUIDANCE_ONLY |
| ERROR_HANDLING_RULE | IMPLEMENTATION_GUIDANCE_ONLY |
| ERROR_BOUNDARY_OWNERSHIP_RULE | L06, IMP-02 |
| TARGET_FILE_RULES | IMP-INDEX, IMP-02 |
| POST_GENERATION_VALIDATION | IMP-00, L10 |
| ERROR_TEST_MAPPING | L10, IMP-08 |
| PROOF_LIMITS | L10, IMP-00 |
| VALIDITY_CONDITIONS | I00, L04, L08, IMP-INDEX |

## VALIDITY_CONDITIONS

This file is VALID if it:

- remains non-authoritative implementation guidance
- preserves L00–L10 as correctness authority
- preserves L04 as failure-class authority
- preserves L08 as API Response authority
- preserves I00 as source lookup and traceability authority
- preserves IMP-INDEX as implementation routing authority
- does not define source-owned IDs
- does not create new FAIL-* classes
- does not redefine existing FAIL-* meanings
- maps implementation error codes to source failure references without turning them into source authority
- preserves full source-owned IDs
- prevents invalid behavior from being treated as success
- prevents raw internal error leakage through API responses
- preserves Request/Response API boundary constraints
- preserves duplicate Request same-outcome behavior
- preserves transaction rollback / no partial operation behavior
- preserves API-safe error response behavior
- routes proof back to TEST-* coverage

This file is INVALID if it:

- defines correctness authority
- defines source-owned IDs
- creates new failure classes
- weakens or extends L04
- overrides I00 lookup
- overrides IMP-INDEX routing
- treats implementation error codes as source IDs
- treats HTTP status codes as source failure classes
- maps errors to FAIL-* without source basis
- hides source-classifiable invalid behavior as generic success
- exposes stack traces, SQL, secrets, transaction context, or internal boundary details externally
- permits partial operation state to be represented as successful
- permits duplicate Request error path to re-execute
- treats error handling, logs, runtime success, compilation, or absence of failure as proof

## CLASSIFICATION

### SOURCE_FACT:

- L00–L10 are correctness authority.
- L04 defines FAIL-001 through FAIL-010.
- L04 failure classes correspond to violations of L03 invariants.
- L05 maps Transfer lifecycle invalid conditions to L04 failure classes.
- L08 defines API Response as external representation of the result of a Request.
- L08 requires Response not to redefine system state or expose internal control boundaries.
- I00 is source indexing and traceability authority.
- IMP-INDEX is implementation/codegen routing authority.

### INFERENCE:

- A stable implementation error object helps preserve source failure traceability without redefining source failures.
- API-safe error serialization is needed to avoid exposing internal control boundaries.
- Some implementation errors, such as malformed input or authorization denial, are not automatically L04 failure classes.
- Multi-failure invalid paths should preserve all relevant source references while selecting one primary failure ID.
- Collapsing repeated FAIL_* sections into one mapping matrix improves AI-followability without weakening constraints.

### ASSUMPTION:

- MVP implementation uses a LedgerError class or equivalent object shape.
- Implementation error codes use UPPER_SNAKE_CASE.
- API errors are serialized through src/lib/response.ts.
- HTTP status codes are useful implementation guidance but not source authority.

These assumptions are implementation guidance only.

They MUST NOT define source correctness.

### IMPLEMENTATION_GUIDANCE_ONLY:

- concrete LedgerError type shape
- concrete implementation error code names
- concrete HTTP status mapping
- concrete API error envelope shape
- concrete helper function names
- internal vs external error serialization behavior

### SOURCE_GAP:

No blocking SOURCE_GAP is identified within this IMP-07 document.

### SOURCE_CONFLICT:

No blocking SOURCE_CONFLICT is identified within this IMP-07 document.

## LOCK_STATUS

READY_FOR_USE only if:

- filename matches the IMP-INDEX registry entry for IMP-07
- IMP-INDEX routes src/lib/errors.ts
- IMP-INDEX routes src/lib/response.ts
- I00 indexes all source-owned IDs used by error targets
- L04 defines FAIL-001 through FAIL-010
- L05 maps lifecycle invalid conditions to L04 failure classes
- L08 defines Response and API boundary constraints
- L10 defines TEST-001 through TEST-012
- IMP-00 defines global generation protocol
- IMP-02 defines dependency/import legality
- IMP-06 defines API route/Response guidance
- IMP-08 defines concrete TEST-* implementation matrix
- generated error implementation treats unrouted helpers as ROUTING_GAP
- generated error implementation does not treat error handling, HTTP status codes, logs, runtime success, compilation, or absence of failure as proof


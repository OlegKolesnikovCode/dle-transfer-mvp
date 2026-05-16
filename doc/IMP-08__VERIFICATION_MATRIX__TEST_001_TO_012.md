# IMP-08__VERIFICATION_MATRIX__TEST_001_TO_012.md

## AUTHORITY_STATUS

NON_AUTHORITATIVE_IMPLEMENTATION_GUIDANCE

This file defines concrete verification implementation guidance for DLE-2 TEST-001 through TEST-012.

This file is NOT verification authority.

Verification authority remains with L10.

Correctness authority remains exclusively with L00–L10.

Source lookup and traceability metadata remain with I00.

Implementation/codegen routing remains with IMP-INDEX.

This file MUST NOT:
- define correctness rules
- define source-owned IDs
- define new TEST-* IDs
- define invariants
- define failure classes
- define lifecycle rules
- define architecture rules
- define schema rules
- define API rules
- define authorization rules
- override L00–L10
- override I00
- override IMP-INDEX routing
- treat test implementation as source authority
- treat test existence as proof
- treat passing tests without source traceability as proof
- create unsupported Balance-Affecting Operations
- treat mocks, logs, timestamps, snapshots, route existence, schema existence, compilation, or happy-path behavior as proof

If this file conflicts with L00–L10, L00–L10 win.

If this file conflicts with L10 TEST-* authority, L10 wins.

If this file conflicts with I00, I00 wins for lookup and traceability metadata.

If this file conflicts with IMP-INDEX, IMP-INDEX wins for routing, dependency allowance, target ownership, required source IDs, required IMP files, proof tests, and generation-packet shape.

If this file appears to authorize an unrouted test file, helper, fixture, mock, route, dependency, or TEST-* ID, classify as ROUTING_GAP.

---

## PURPOSE

Guide implementation of the concrete DLE-2 verification suite for TEST-001 through TEST-012.

IMP-08 exists to translate L10 verification requirements into implementation guidance for:
- test file generation
- test-to-source mapping
- valid-path coverage
- invalid-path coverage
- observable behavior requirements
- proof evidence expectations
- test-support boundaries
- test-generation packet requirements

IMP-08 does not replace L10.

IMP-08 does not prove correctness by itself.

Verification proof requires:
- exact source rule reference
- routed implementation ownership
- valid-path observation
- invalid-path rejection
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
- IMP-04__TRANSACTION_RULES__CONSISTENCY_BOUNDARY.md
- IMP-05__TRANSFER_OPERATION__MVP_ONLY.md
- IMP-06__API_RULES__ROUTES_RESPONSES.md
- IMP-07__FAILURE_MAPPING__LEDGER_ERRORS.md
- IMP-11__DONE_CRITERIA__CI_AND_PROOF.md

---

## SOURCE_AUTHORITY_ORDER

Correctness authority:

```txt
L00 → L01 → L02 → L03 → L04 → L05 → L06 → L07 → L08 → L09 → L10
```

Indexing authority:

I00__INDEXING_AUTHORITY__TRACEABILITY__GLOBAL.md

Implementation routing authority:

IMP-INDEX__IMPLEMENTATION_ROUTING__CODEGEN_ENTRY.md

Implementation guidance:

IMP-00 → IMP-11

Generated verification implementation:

- tests/*
- jest.config.ts
- test-support files routed by IMP-08 / IMP-11 only

Generated tests remain subordinate to L00–L10, I00, IMP-INDEX, and routed IMP guidance.

## SCOPE

IMP-08 directly applies to:

- tests/TEST-001-traceability.test.ts
- tests/TEST-002-ledger-immutability.test.ts
- tests/TEST-003-replay-determinism.test.ts
- tests/TEST-004-atomicity.test.ts
- tests/TEST-005-balance-constraint.test.ts
- tests/TEST-006-asset-consistency.test.ts
- tests/TEST-007-idempotency.test.ts
- tests/TEST-008-lifecycle.test.ts
- tests/TEST-009-bounded-consistency.test.ts
- tests/TEST-010-operation-completeness.test.ts
- tests/TEST-011-api-boundary.test.ts
- tests/TEST-012-authorization.test.ts

IMP-08 informs, but does not own:

- jest.config.ts
- package.json test scripts
- test setup files routed by IMP-11
- test database setup routed by IMP-11
- CI proof gates routed by IMP-11

IMP-08 does not own:

- source verification authority
- completion gates
- CI enforcement policy
- production implementation logic
- production dependencies
- source rule meanings
- failure class meanings
- lifecycle rule meanings
- API contract meanings
- authorization meanings

## CLASSIFICATION_RULE

If verification generation cannot proceed cleanly, classify before generating.

| Classification | Meaning | Required action |
| --- | --- | --- |
| READY_TO_GENERATE | Test target, source references, dependencies, observations, and expected proof behavior are routed | Proceed |
| GENERATION_PACKET_INCOMPLETE | Required test packet field, observable behavior, fixture state, dependency, or expected result is missing | Stop; complete packet |
| ROUTING_GAP | Test file, helper, fixture, mock, builder, setup file, import, or dependency is not routed | Stop; report missing route |
| SOURCE_GAP | Required source-owned rule, TEST-* mapping, or source ID is missing from L00–L10 / I00 | Stop; report missing source authority |
| SOURCE_CONFLICT | Authorities conflict in a way that changes verification legality | Stop; do not choose by preference |
| INFERENCE | Derived verification implementation guidance from source/routing facts | Label as non-authoritative |
| ASSUMPTION | Reversible implementation choice not specified by source/routing | Label and minimize |
| IMPLEMENTATION_GUIDANCE_ONLY | Useful test implementation guidance outside L00–L10 authority | May guide; cannot prove |

ROUTING_GAP is the default for unrouted test helpers, fixtures, mocks, builders, setup files, or imports.

SOURCE_GAP is only for missing L00–L10 / I00 authority.

## VERIFICATION_AUTHORITY_RULE

L10 owns TEST-001 through TEST-012.

IMP-08 may guide how those tests are implemented.

IMP-08 MUST NOT:

- create TEST-013 or higher
- rename TEST-* source meanings
- redefine what any TEST-* verifies
- add new source-owned verification requirements
- treat implementation-specific test mechanics as source authority
- treat test framework behavior as correctness authority

Every TEST-* file must include:

- exact TEST-* ID
- exact source-owned IDs under verification
- expected valid-path observation
- expected invalid-path observation
- proof evidence based on observable behavior

## TEST_IMPLEMENTATION_MODEL

Recommended MVP test model:

- Jest
- TypeScript
- PostgreSQL test database
- Prisma test client through routed test setup only
- API route tests where routed
- integration tests for operation behavior
- domain tests for pure lifecycle / validation helpers

These are implementation choices only.

Tests may verify behavior through:

- public API routes
- routed server boundary entrypoints
- database state after operation
- read-derivation paths
- forbidden route absence/rejection
- invalid-path rejection
- duplicate Request behavior
- persistence reconstruction
- source-reference-only static checks where routed

Tests MUST NOT verify behavior solely through:

- logs
- timestamps
- comments
- type names
- function names
- route file presence
- schema file presence
- successful compilation
- absence of exception
- snapshot output without source traceability
- mock call count where persistence/API/control behavior is required

## TEST_FILE_ROUTING_RULE

Primary routed test files:

| TEST ID | Test file |
| --- | --- |
| TEST-001 | tests/TEST-001-traceability.test.ts |
| TEST-002 | tests/TEST-002-ledger-immutability.test.ts |
| TEST-003 | tests/TEST-003-replay-determinism.test.ts |
| TEST-004 | tests/TEST-004-atomicity.test.ts |
| TEST-005 | tests/TEST-005-balance-constraint.test.ts |
| TEST-006 | tests/TEST-006-asset-consistency.test.ts |
| TEST-007 | tests/TEST-007-idempotency.test.ts |
| TEST-008 | tests/TEST-008-lifecycle.test.ts |
| TEST-009 | tests/TEST-009-bounded-consistency.test.ts |
| TEST-010 | tests/TEST-010-operation-completeness.test.ts |
| TEST-011 | tests/TEST-011-api-boundary.test.ts |
| TEST-012 | tests/TEST-012-authorization.test.ts |

Do not create alternate test filenames unless IMP-INDEX is updated.

Forbidden unless routed:

- tests/ledger.test.ts
- tests/transfer.test.ts
- tests/api.test.ts
- tests/integration.test.ts
- tests/e2e.test.ts
- tests/helpers.ts
- tests/fixtures.ts
- tests/test-utils.ts
- tests/setup.ts
- tests/db.ts
- tests/factories.ts
- tests/builders.ts

## TEST_SUPPORT_BOUNDARY_RULE

Test-support files may exist only when routed by IMP-08 or IMP-11.

Test-support files MUST:

- remain under test support
- never be imported by production code
- never define correctness rules
- never create source-owned IDs
- never create new operation scope
- never bypass production controls to create false proof
- never become part of src/server, src/domain, src/lib, or src/app

Production code MUST NOT import:

- tests/*
- test-support/*
- fixtures/*
- mocks/*
- builders/*

If a fixture, helper, mock, builder, or setup file is required but not routed, classify as ROUTING_GAP.

## TEST_DATA_RULE

Test data must support observable behavior without creating false proof.

Allowed:

- seeded Accounts
- seeded Assets
- seeded Balances
- unique Request identities per new operation test
- duplicate Request identities for idempotency tests
- controlled invalid input for invalid-path tests
- directly inserted corrupt state only when explicitly isolated for invalid-path verification

Forbidden:

- production seed data treated as proof
- arbitrary LedgerEntries without valid Transfer execution, except isolated corrupt-state setup
- executed Transfers created outside routed execution path, except isolated read-only setup
- unsupported Balance-Affecting Operation data
- external settlement state
- event-stream correctness state
- timestamp-dependent correctness state
- manual Balance correction as proof

Tests must not depend on execution order or hidden state from other TEST-* files.

## TEST_ID_REFERENCE_RULE

All source-owned rule references must use full IDs.

Valid:

```txt
TEST-001
INV-001
FAIL-001
SCHEMA-004
API-011
AUTHZ-012
FSM-001 through FSM-010
```

Invalid:

```txt
TEST-1
INV-1
API-012, 013
FSM-001...010
TEST-001-012
```

Range notation such as TEST-001 through TEST-012 means every full ID in the inclusive range.

## VALID_AND_INVALID_PATH_RULE

Every TEST-* file must include valid-path and invalid-path coverage where required by L10.

Minimum pattern:

- valid path: source-required behavior succeeds
- invalid path: source-forbidden behavior fails or cannot occur
- no false proof: success is not inferred from absence of error
- traceability: assertions reference mapped source IDs

A TEST-* file is incomplete if it is happy-path-only where invalid-path coverage is required.

Invalid behavior MUST NOT be normalized into success.

## VERIFICATION_FILE_ROUTING_MATRIX

| Test file | Required source IDs | Required IMP files | Primary mode |
| --- | --- | --- | --- |
| tests/TEST-001-traceability.test.ts | INV-001, FAIL-001, ARCH-005, ARCH-006, SCHEMA-004, SCHEMA-005, SCHEMA-006, API-009, API-010, AUTHZ-007, AUTHZ-008, TEST-001 | IMP-00, IMP-08, IMP-11 | Integration / persistence observation |
| tests/TEST-002-ledger-immutability.test.ts | INV-002, FAIL-002, FSM-008, ARCH-006, SCHEMA-005, SCHEMA-006, API-010, AUTHZ-008, TEST-002 | IMP-00, IMP-08, IMP-11 | Integration / forbidden mutation |
| tests/TEST-003-replay-determinism.test.ts | INV-003, FAIL-003, ARCH-007, ARCH-008, SCHEMA-004, SCHEMA-006, SCHEMA-010, API-005, API-006, AUTHZ-004, TEST-003 | IMP-00, IMP-08, IMP-11 | Reconstruction / read derivation |
| tests/TEST-004-atomicity.test.ts | INV-004, FAIL-004, FSM-005, ARCH-003, SCHEMA-011, API-012, AUTHZ-010, TEST-004 | IMP-00, IMP-08, IMP-11 | Transaction / rollback behavior |
| tests/TEST-005-balance-constraint.test.ts | INV-005, FAIL-005, ARCH-005, SCHEMA-003, TEST-005 | IMP-00, IMP-08, IMP-11 | Balance validation |
| tests/TEST-006-asset-consistency.test.ts | INV-006, FAIL-006, ARCH-005, SCHEMA-003, SCHEMA-005, SCHEMA-007, SCHEMA-012, API-011, TEST-006 | IMP-00, IMP-08, IMP-11 | Same-Asset enforcement |
| tests/TEST-007-idempotency.test.ts | INV-007, FAIL-007, FSM-007, ARCH-002, SCHEMA-009, SCHEMA-010, API-002, API-003, API-006, API-008, AUTHZ-003, AUTHZ-005, TEST-007 | IMP-00, IMP-08, IMP-11 | Duplicate Request behavior |
| tests/TEST-008-lifecycle.test.ts | INV-008, FAIL-008, FSM-001 through FSM-010, ARCH-004, SCHEMA-008, API-007, AUTHZ-006, AUTHZ-011, TEST-008 | IMP-00, IMP-08, IMP-11 | Lifecycle behavior |
| tests/TEST-009-bounded-consistency.test.ts | INV-009, FAIL-009, ARCH-003, SCHEMA-013, API-013, AUTHZ-009, TEST-009 | IMP-00, IMP-08, IMP-11 | Boundary / external dependency restriction |
| tests/TEST-010-operation-completeness.test.ts | INV-010, FAIL-010, FSM-005, FSM-008, ARCH-006, SCHEMA-005, SCHEMA-011, API-001, AUTHZ-010, TEST-010 | IMP-00, IMP-08, IMP-11 | LedgerEntry completeness |
| tests/TEST-011-api-boundary.test.ts | API-001 through API-013, TEST-011 | IMP-00, IMP-08, IMP-11 | API route restrictions |
| tests/TEST-012-authorization.test.ts | AUTHZ-001 through AUTHZ-012, TEST-012 | IMP-00, IMP-08, IMP-11 | Authorization behavior |

## TEST_IMPLEMENTATION_MATRIX

| TEST ID | Must observe valid path | Must observe invalid path / forbidden behavior | Must not treat as proof |
| --- | --- | --- | --- |
| TEST-001 | Valid Transfer produces LedgerEntries that explain Balance Changes and reference Account, Asset, Transfer | Direct Balance mutation / direct LedgerEntry creation absent, rejected, or detected as invalid | Transfer API success alone; LedgerEntry count without mapping |
| TEST-002 | Executed Transfer produces LedgerEntries that remain immutable through routed paths | LedgerEntry update/delete/create routes or methods absent or rejected | createdAt, missing updatedAt, schema shape alone |
| TEST-003 | LedgerEntry history reconstructs Balance state; derived read matches reconstruction | corrupted Balance contradiction detected; duplicate Request does not alter reconstruction | GET 200, Balance row exists, timestamp order |
| TEST-004 | Request, Transfer, Balance, LedgerEntries commit as one consistent write set | failure leaves no partial LedgerEntries, Balance mutation, completed Transfer, or successful Request outcome | $transaction exists, try/catch exists, rollback log |
| TEST-005 | valid Transfer preserves Account-Asset Balance constraints | duplicate Balance, invalid Balance, disallowed negative Balance, or Balance mutation outside Balance Control rejected | Balance row exists, @@unique alone |
| TEST-006 | source Balance, destination Balance, Transfer, and LedgerEntries use same Asset | cross-Asset Transfer and Asset mismatch rejected or impossible through routed execution | Transfer has assetId only |
| TEST-007 | duplicate Request identity resolves to same persisted outcome without additional state change | divergent duplicate payload rejected or resolves deterministically; duplicate cannot bypass idempotency | same HTTP status or response shape only |
| TEST-008 | valid lifecycle transitions and execution through VALIDATED → EXECUTED | undefined state, invalid transition, terminal exit, lifecycle override, authorization lifecycle selection rejected | enum exists; happy path reaches EXECUTED |
| TEST-009 | valid Transfer completes inside Bounded System without external correctness dependency | external settlement/distributed/eventual/cache/log correctness dependency absent or rejected | no external call in one run; Docker exists |
| TEST-010 | executed Transfer has complete LedgerEntry representation of source/destination effects | executed Transfer without LedgerEntries, LedgerEntries without valid execution, or success without LedgerEntries impossible/rejected | EXECUTED state alone; nonzero LedgerEntry count alone |
| TEST-011 | allowed API routes preserve Request/Response contract and route through correct boundaries | direct Balance mutation, direct LedgerEntry creation, lifecycle override, internal boundary selector rejected/absent | routes compile; HTTP 200 once; JSON response |
| TEST-012 | authorized Request follows allowed path without bypass | unauthorized Request cannot execute, mutate Balance, create LedgerEntries, select lifecycle, bypass idempotency, or create alternate path | HTTP 403 only; mock policy called |

## LOWER_LAYER_COVERAGE_MATRIX

### L07 Schema Coverage

| Source ID | Covered by |
| --- | --- |
| SCHEMA-001 | TEST-001, TEST-003, TEST-010 |
| SCHEMA-002 | TEST-001, TEST-007 |
| SCHEMA-003 | TEST-005, TEST-006 |
| SCHEMA-004 | TEST-001, TEST-003 |
| SCHEMA-005 | TEST-001, TEST-010 |
| SCHEMA-006 | TEST-002, TEST-003 |
| SCHEMA-007 | TEST-006, TEST-010 |
| SCHEMA-008 | TEST-008 |
| SCHEMA-009 | TEST-007 |
| SCHEMA-010 | TEST-007 |
| SCHEMA-011 | TEST-004, TEST-010 |
| SCHEMA-012 | TEST-006 |
| SCHEMA-013 | TEST-009 |

### L08 API Coverage

| Source ID | Covered by |
| --- | --- |
| API-001 | TEST-011 |
| API-002 | TEST-007, TEST-011 |
| API-003 | TEST-007, TEST-011 |
| API-004 | TEST-011 |
| API-005 | TEST-003, TEST-011 |
| API-006 | TEST-007, TEST-011 |
| API-007 | TEST-008, TEST-011 |
| API-008 | TEST-007, TEST-011 |
| API-009 | TEST-001, TEST-011 |
| API-010 | TEST-002, TEST-011 |
| API-011 | TEST-006, TEST-011 |
| API-012 | TEST-011 |
| API-013 | TEST-009, TEST-011 |

### L09 Authorization Coverage

| Source ID | Covered by |
| --- | --- |
| AUTHZ-001 | TEST-012 |
| AUTHZ-002 | TEST-012 |
| AUTHZ-003 | TEST-007, TEST-012 |
| AUTHZ-004 | TEST-003, TEST-012 |
| AUTHZ-005 | TEST-007, TEST-012 |
| AUTHZ-006 | TEST-008, TEST-012 |
| AUTHZ-007 | TEST-001, TEST-012 |
| AUTHZ-008 | TEST-002, TEST-010, TEST-012 |
| AUTHZ-009 | TEST-009, TEST-012 |
| AUTHZ-010 | TEST-004, TEST-012 |
| AUTHZ-011 | TEST-008, TEST-012 |
| AUTHZ-012 | TEST-012 |

## CROSS_TEST_COVERAGE_MATRIX

| Source concern | Primary tests |
| --- | --- |
| Traceability | TEST-001, TEST-010 |
| LedgerEntry immutability | TEST-002 |
| Replay determinism | TEST-003 |
| Atomicity | TEST-004 |
| Balance constraints | TEST-005 |
| Asset consistency | TEST-006 |
| Idempotency | TEST-007 |
| Lifecycle governance | TEST-008 |
| Bounded consistency | TEST-009 |
| Operation completeness | TEST-010 |
| API boundary | TEST-011 |
| Authorization | TEST-012 |

## TEST_GENERATION_PACKET_REQUIREMENTS

Before generating any TEST-* file, resolve:

- Target test file:
- TEST ID:
- Verification owner:
- Source references:
- Required IMP files:
- Allowed dependencies:
- Forbidden dependencies:
- Test data setup:
- Valid-path observations:
- Invalid-path observations:
- Mutation authority:
- Transaction authority:
- Persistence authority:
- LedgerEntry authority:
- Balance authority:
- API exposure:
- Proof evidence:
- Output mode:
- Classification:

For test files, authority fields mean test observation authority only.

Tests may invoke or observe routed behavior.

Tests MUST NOT gain production authority.

If any required field is missing, classify as GENERATION_PACKET_INCOMPLETE.

If any target, helper, fixture, mock, setup file, or dependency is unrouted, classify as ROUTING_GAP.

## ALLOWED_TEST_DEPENDENCIES

Tests may import production files only to verify source-mapped behavior through routed paths.

Allowed when routed:

- API route handlers
- Request Boundary entrypoints
- Read Derivation Boundary entrypoints
- domain pure helpers
- response/error utilities
- Prisma test client through routed test setup
- test-only data setup utilities routed by IMP-08 / IMP-11

Forbidden unless explicitly routed:

- unrouted helpers
- production-internal private functions
- direct Prisma client in arbitrary tests
- test utilities imported by production code
- external correctness systems
- network services as correctness dependencies
- timestamp/log proof helpers

## TEST_ISOLATION_RULE

Each TEST-* file must be independently understandable and source-traceable.

Tests MUST NOT depend on:

- execution order across TEST-* files
- state left behind by another TEST-* file
- shared mutable global state
- timestamp uniqueness as correctness proof
- external service reset

Allowed isolation strategies:

- transaction rollback per test
- database reset per test
- unique Request identity per test
- unique Account / Asset fixtures per test
- test schema reset through routed setup

## TEST_ASSERTION_QUALITY_RULE

Assertions must verify source-relevant behavior.

Good assertions:

- LedgerEntries explain Balance Change
- duplicate LedgerEntry count equals original count
- reconstructed Balance equals read Balance
- forbidden API response is rejected or absent
- EXECUTED state appears only with complete LedgerEntries and Balance changes
- unauthorized Request leaves Balance and LedgerEntries unchanged

Weak assertions when used alone:

- response.status is 200
- result is defined
- log contains success
- createdAt exists
- function was called
- file exists
- snapshot matches

Weak assertions may support debugging.

They do not prove source behavior alone.

## TEST_FAILURE_MAPPING_RULE

Invalid-path tests must verify failure classification or implementation error mapping where routed by IMP-07.

Tests MUST NOT:

- create new FAIL-* classes
- redefine existing FAIL-* meanings
- treat implementation error names as source authority
- accept invalid behavior as success
- hide invariant violations behind generic success responses

Where an invalid path maps to a source failure class, the test should verify the implementation preserves that FAIL-* reference or observable meaning.

## STATIC_VERIFICATION_RULE

Static checks may verify:

- forbidden imports are absent
- forbidden route files are absent
- source-reference-only files do not redefine source meanings
- TEST-* files reference required source IDs
- Prisma schema contains required constraints
- config does not introduce external correctness dependency

Static checks are useful but insufficient for behavior that requires runtime observation.

Do not treat static checks alone as proof of:

- atomicity
- idempotency
- replay determinism
- lifecycle governance
- authorization behavior
- API behavior
- persistence reconstruction

unless L10 / IMP-INDEX explicitly routes static verification for that property.

## POST_GENERATION_VALIDATION

After generating any TEST-* file, check:

| Label | Meaning |
| --- | --- |
| TEST_ID_MISMATCH | Test file does not match routed TEST-* ID |
| SOURCE_REFERENCE_GAP | Test lacks required source-owned IDs |
| TRACEABILITY_GAP | Test does not map assertions to source rules |
| INVALID_PATH_GAP | Test lacks required invalid-path verification |
| HAPPY_PATH_ONLY | Test verifies only success behavior where invalid-path coverage is required |
| OBSERVATION_GAP | Assertion does not observe decision-relevant behavior |
| MOCK_PROOF_VIOLATION | Mock behavior is treated as proof where real behavior is required |
| LOG_PROOF_VIOLATION | Logs are treated as proof |
| TIMESTAMP_PROOF_VIOLATION | Timestamps are treated as proof |
| COMPILE_PROOF_VIOLATION | Compilation is treated as proof |
| ROUTING_PROOF_VIOLATION | Routing table existence is treated as proof |
| UNROUTED_TEST_HELPER | Test helper, fixture, mock, builder, setup file, or utility is created without routing |
| PRODUCTION_TEST_LEAK | Production code imports test-only files |
| TEST_PRODUCTION_AUTHORITY_LEAK | Test code becomes production authority |
| UNSUPPORTED_OPERATION_TEST | Test creates or validates unsupported Balance-Affecting Operation |
| DIRECT_MUTATION_FALSE_PROOF | Test bypasses production path and treats direct DB mutation as proof |
| API_BOUNDARY_TEST_GAP | API test misses forbidden mutation/lifecycle/internal-boundary paths |
| AUTHORIZATION_TEST_GAP | Authorization test misses no-mutation/no-bypass behavior |
| IDEMPOTENCY_TEST_GAP | Idempotency test misses no-duplicate-state-change behavior |
| ATOMICITY_TEST_GAP | Atomicity test misses rollback/no-partial-state behavior |
| REPLAY_TEST_GAP | Replay test misses reconstruction from LedgerEntries |
| COMPLETENESS_TEST_GAP | Operation completeness test misses required LedgerEntries |

If any label applies, generated test output is not complete.

## PROOF_LIMITS

The following are not proof:

- test file exists
- test name matches TEST-* ID
- test compiles
- test passes without source traceability
- mock passed
- snapshot passed
- logs show expected message
- timestamp order appears correct
- API returned HTTP 200 once
- no runtime error occurred
- database rows exist without source mapping
- route exists
- schema exists
- routing table lists test coverage

Proof requires:

- exact source rule reference
- routed implementation ownership
- valid-path observation
- invalid-path rejection
- TEST-* mapping
- observed passing behavior

## TRACEABILITY

| Section | Basis |
| --- | --- |
| AUTHORITY_STATUS | I00, L10, IMP-INDEX, IMP-00 |
| PURPOSE | L10, IMP-INDEX |
| DEPENDS_ON | I00, L00–L10, IMP-INDEX, IMP-00 through IMP-07, IMP-11 |
| SOURCE_AUTHORITY_ORDER | I00, IMP-INDEX |
| SCOPE | IMP-INDEX VERIFICATION_FILE_ROUTING_MATRIX |
| CLASSIFICATION_RULE | IMP-00, IMP-INDEX |
| VERIFICATION_AUTHORITY_RULE | L10 |
| TEST_IMPLEMENTATION_MODEL | L10 SOURCE_GAP for tooling, IMP guidance |
| TEST_FILE_ROUTING_RULE | IMP-INDEX VERIFICATION_FILE_ROUTING_MATRIX |
| TEST_SUPPORT_BOUNDARY_RULE | IMP-INDEX, IMP-00, IMP-11 |
| TEST_DATA_RULE | L07, L10, IMP-03 |
| TEST_ID_REFERENCE_RULE | I00, IMP-INDEX |
| VALID_AND_INVALID_PATH_RULE | L10 VERIFICATION COVERAGE RULE |
| VERIFICATION_FILE_ROUTING_MATRIX | IMP-INDEX, L10 |
| TEST_IMPLEMENTATION_MATRIX | TEST-001 through TEST-012 |
| LOWER_LAYER_COVERAGE_MATRIX | L10 LOWER-LAYER ID COVERAGE MATRIX |
| CROSS_TEST_COVERAGE_MATRIX | L10 |
| TEST_GENERATION_PACKET_REQUIREMENTS | IMP-INDEX, IMP-00 |
| ALLOWED_TEST_DEPENDENCIES | IMP-02, IMP-INDEX |
| TEST_ISOLATION_RULE | IMPLEMENTATION_GUIDANCE_ONLY |
| TEST_ASSERTION_QUALITY_RULE | L10 behavior-level verification |
| TEST_FAILURE_MAPPING_RULE | L04, IMP-07 |
| STATIC_VERIFICATION_RULE | IMP-INDEX, L10 |
| POST_GENERATION_VALIDATION | IMP-00, L10 |
| PROOF_LIMITS | L10, IMP-00 |
| VALIDITY_CONDITIONS | I00, L10, IMP-INDEX |

## VALIDITY_CONDITIONS

This file is VALID if it:

- remains non-authoritative implementation guidance
- preserves L00–L10 as correctness authority
- preserves L10 as verification authority
- preserves I00 as lookup and traceability authority
- preserves IMP-INDEX as implementation/test routing authority
- does not define source-owned IDs
- does not define new TEST-* IDs
- does not redefine TEST-001 through TEST-012
- does not define new correctness rules
- does not define new failure classes
- requires full source-owned IDs
- maps every TEST-* file to source IDs
- requires valid-path and invalid-path coverage
- requires observable behavior
- prevents test-support leakage into production
- prevents unrouted test helper creation
- prevents mocks, logs, timestamps, snapshots, route existence, schema existence, compilation, runtime success, and happy-path behavior from being treated as proof
- routes done criteria and CI enforcement to IMP-11

This file is INVALID if it:

- defines verification authority
- defines source-owned IDs
- creates TEST-013 or any new TEST-* ID
- weakens or extends L10
- overrides I00 lookup
- overrides IMP-INDEX routing
- permits tests without source traceability
- permits happy-path-only coverage where invalid-path coverage is required
- permits test files not routed by IMP-INDEX
- permits production code to import test-support files
- permits test utilities to become production execution code
- treats passing tests without source mapping as proof
- treats logs, timestamps, compilation, snapshots, mocks, route existence, schema existence, or happy-path execution as proof
- treats invalid behavior as success
- creates unsupported Balance-Affecting Operations for test convenience

## CLASSIFICATION

### SOURCE_FACT:

- L00–L10 are correctness authority.
- L10 defines verification authority for TEST-001 through TEST-012.
- I00 is source indexing and traceability authority.
- IMP-INDEX is implementation/codegen routing authority.
- IMP files are non-authoritative implementation guidance.
- Tests are proof instruments, not source authority.
- Verification is complete only when required higher-layer rules map to TEST-* coverage.
- Tests must remain behavior-level and source-traceable.

### INFERENCE:

- Concrete Jest/integration tests operationalize L10 behavior-level verification.
- Each TEST-* file should include valid-path and invalid-path observations to avoid false proof.
- Test-support routing prevents test utilities from leaking into production architecture.
- Static checks are useful only where the verified property is static, routed, or dependency-based.

### ASSUMPTION:

- MVP test implementation uses Jest and TypeScript.
- Integration tests may use a PostgreSQL test database.
- API boundary tests may use Next.js route handlers or HTTP-level test utilities if routed.
- Test database setup and CI execution details are completed by IMP-11.

These assumptions are implementation guidance only.

They MUST NOT define source correctness or verification authority.

### IMPLEMENTATION_GUIDANCE_ONLY:

- concrete test filenames
- concrete test grouping
- fixture shape
- setup/teardown pattern
- assertion style
- runtime test tooling
- test database workflow
- API test harness mechanics

### SOURCE_GAP:

- No blocking SOURCE_GAP is identified within this IMP-08 document.

### SOURCE_CONFLICT:

- No blocking SOURCE_CONFLICT is identified within this IMP-08 document.

## LOCK_STATUS

READY_FOR_USE only if:

- filename matches the IMP-INDEX registry entry for IMP-08
- IMP-INDEX defines VERIFICATION_FILE_ROUTING_MATRIX
- I00 indexes all source-owned IDs used by TEST-* targets
- L10 defines TEST-001 through TEST-012
- L03 defines INV-001 through INV-010
- L04 defines FAIL-001 through FAIL-010
- L05 defines FSM-001 through FSM-010
- L06 defines ARCH-001 through ARCH-009
- L07 defines SCHEMA-001 through SCHEMA-013
- L08 defines API-001 through API-013
- L09 defines AUTHZ-001 through AUTHZ-012
- IMP-00 defines global generation protocol
- IMP-02 exists or is scheduled and defines dependency/import legality
- IMP-03 exists or is scheduled and defines persistence implementation guidance
- IMP-04 exists or is scheduled and defines transaction / Consistency Boundary guidance
- IMP-05 exists or is scheduled and defines Transfer-only operation guidance
- IMP-06 exists or is scheduled and defines API implementation guidance
- IMP-07 exists or is scheduled and defines failure/error mapping
- IMP-11 exists or is scheduled and defines done criteria and CI proof gates
- generated tests treat unrouted helpers as ROUTING_GAP
- generated tests do not treat logs, timestamps, mocks, snapshots, route existence, schema existence, compilation, runtime success, or happy-path behavior as proof

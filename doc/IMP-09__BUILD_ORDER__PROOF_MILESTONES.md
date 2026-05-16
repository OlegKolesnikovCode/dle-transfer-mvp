# IMP-09__BUILD_ORDER__PROOF_MILESTONES.md

## AUTHORITY_STATUS

NON_AUTHORITATIVE_IMPLEMENTATION_GUIDANCE

This file defines build order and proof milestone guidance for the DLE-2 Transfer-only MVP.

This file is not correctness authority.

Correctness authority remains exclusively with L00–L10.

Verification authority remains with L10.

Source lookup and traceability metadata remain with I00.

Implementation/codegen routing remains with IMP-INDEX.

This file MUST NOT:
- define correctness rules
- define source-owned IDs
- define invariants
- define failure classes
- define lifecycle rules
- define architecture rules
- define schema rules
- define API rules
- define authorization rules
- define verification requirements
- override L00–L10
- override I00
- override IMP-INDEX routing
- create target files not routed by IMP-INDEX
- create unsupported Balance-Affecting Operations
- treat build order, routing, file existence, compilation, logs, timestamps, runtime success, or generated code as proof

If this file conflicts with L00–L10, L00–L10 win.

If this file conflicts with I00, I00 wins for lookup and traceability metadata.

If this file conflicts with IMP-INDEX, IMP-INDEX wins for routing, dependency allowance, target ownership, required source IDs, required IMP files, proof tests, and generation-packet shape.

---

## PURPOSE

Guide implementation order by guarantees proven, not by feature convenience.

IMP-09 exists to prevent:
- API-first drift
- UI/demo-first drift
- unrouted helper creation
- boundary bypass
- direct Balance mutation paths
- direct LedgerEntry creation paths
- unsupported operation expansion
- transaction code without idempotency context
- read APIs before mutation guarantees exist
- happy-path-only completion
- tests disconnected from source-owned rules
- false proof from compilation, logs, timestamps, or generated code

The build order must produce the smallest routed implementation that proves the MVP correctness guarantees.

The MVP Balance-Affecting Operation remains Transfer only.

---

## DEPENDS_ON

- I00__INDEXING_AUTHORITY__TRACEABILITY__GLOBAL.md
- L00__ROOT__SYSTEM_CONSTRAINTS__GLOBAL.md
- L03__INVARIANTS__CORRECTNESS_RULES__LEDGER.md
- L04__FAILURE_MODEL__FAILURE_CLASSES__LEDGER.md
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
- IMP-08__VERIFICATION_MATRIX__TEST_001_TO_012.md
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

Generated implementation:

- config files
- prisma/*
- src/*
- tests/*

Generated implementation remains subordinate to L00–L10, I00, IMP-INDEX, and routed IMP guidance.

## SCOPE

IMP-09 applies only to implementation sequencing and milestone gating for routed targets.

In scope:

- build sequencing
- file generation order
- proof milestone order
- prerequisite checks
- anti-ordering rules
- stop conditions
- proof-readiness checks

Out of scope:

- target file manifest
- dependency legality
- concrete Prisma schema content
- transaction implementation details
- Transfer operation rules
- API route behavior
- failure/error mapping
- concrete TEST-* implementation
- observability format
- CI/done criteria

Those are owned by IMP-01 through IMP-08, IMP-10, and IMP-11.

## CLASSIFICATION_RULE

If sequencing cannot proceed cleanly, classify before generating.

| Classification | Meaning | Required action |
| --- | --- | --- |
| READY_TO_GENERATE | Target is routed, prerequisites exist, and milestone gate permits generation | Proceed |
| GENERATION_PACKET_INCOMPLETE | Required target path, source refs, dependencies, proof tests, or prerequisite status are missing | Stop; complete packet |
| ROUTING_GAP | Target, helper, test, setup file, dependency, or artifact is not routed by IMP-INDEX / IMP-08 / IMP-11 | Stop; report missing route |
| SOURCE_GAP | Required source-owned rule or ID is missing from L00–L10 / I00 | Stop; report missing source authority |
| SOURCE_CONFLICT | Authorities conflict in a way that changes build legality | Stop; do not choose by preference |
| INFERENCE | Derived guidance from source/routing facts | Label as non-authoritative |
| ASSUMPTION | Reversible sequencing choice not specified by source/routing | Label and minimize |
| IMPLEMENTATION_GUIDANCE_ONLY | Useful build guidance outside L00–L10 authority | May guide; cannot prove |

ROUTING_GAP is the default for unrouted files, helpers, fixtures, or milestone artifacts.

SOURCE_GAP is only for missing L00–L10 / I00 authority.

## BUILD_ORDER_PRINCIPLE

Build by guarantees proven.

Correct sequence:

```txt
authority/routing lock
→ project setup
→ persistence representation
→ source-reference/domain scaffold
→ Transfer domain helpers
→ failure/error mapping
→ utilities
→ Persistence Boundary
→ internal controls
→ Consistency Boundary
→ idempotency + authorization
→ Request Boundary
→ Read Derivation Boundary
→ API routes
→ verification
→ proof closure
```

Wrong sequence:

- UI first
- API first
- happy path first
- tests last with no source mapping
- Prisma wrapper first
- generic repository first
- generic operation framework first
- read endpoints before mutation guarantees exist
- direct database access before Persistence Boundary exists

## PROOF_MILESTONE_RULE

A milestone is not complete because files exist.

A milestone is complete only when:

- target files are routed by IMP-INDEX
- source references use full source-owned IDs
- dependencies obey IMP-02
- prerequisite files exist
- no unsupported operation scope is introduced
- no architectural boundary is bypassed
- no direct Balance mutation path exists
- no direct LedgerEntry creation path exists
- no lifecycle override path exists
- no JavaScript number is used for balance-affecting arithmetic
- no timestamp is used as replay, ordering, idempotency, lifecycle, authorization, or proof authority
- proof tests are identified
- invalid paths are accounted for
- observable behavior is verified when runnable
- gaps are classified before proceeding

Build order is guidance.

Build order is not proof.

## GLOBAL_BUILD_SEQUENCE

| Order | Milestone | Main output | Gate |
| --- | --- | --- | --- |
| 0 | Authority/routing lock | I00, L00–L10, IMP-INDEX, IMP guidance available or scheduled | No blocking SOURCE_GAP, SOURCE_CONFLICT, or ROUTING_GAP |
| 1 | Project setup | config files | Bounded local runtime; no correctness behavior |
| 2 | Persistence representation | prisma/schema.prisma, prisma/seed.ts | Required entities and constraints representable |
| 3 | Source-reference scaffold | src/domain/entities.ts, terms.ts, invariant-reference.ts | No source meaning redefinition |
| 4 | Transfer type surface | transfer.types.ts | Transfer-only scope preserved |
| 5 | Failure/error mapping | src/lib/errors.ts | FAIL-* references preserved, not redefined |
| 6 | Transfer pure rules | lifecycle, validation, ledger-entry-plan helpers | No persistence, transaction, API, or server authority |
| 7 | Utility support | hash.ts, response.ts | Narrow utilities; no execution authority |
| 8 | Persistence Boundary | persistence-boundary.ts | Prisma access centralized; no business decisions |
| 9 | Internal controls | lifecycle, balance, ledger controls | Boundary ownership separated |
| 10 | Consistency Boundary | consistency-boundary.ts | Atomic write set coordination |
| 11 | Idempotency + authorization | idempotency-control.ts, authorization-control.ts | Duplicate and unauthorized Requests cannot execute incorrectly |
| 12 | Request Boundary | request-boundary.ts | Write entry routes into authorized/idempotent path |
| 13 | Read Derivation Boundary | read-derivation-boundary.ts | Read-only derived state |
| 14 | API routes | src/app/api/* | External surface cannot bypass controls |
| 15 | Verification | TEST-001 through TEST-012 | Valid and invalid paths verified |
| 16 | Proof closure | CI/proof summary/done gates | IMP-11 gates satisfied |

## FILE_GENERATION_ORDER

Generate implementation targets in this order unless IMP-INDEX is updated.

| Order | Target file |
| --- | --- |
| 1 | package.json |
| 2 | tsconfig.json |
| 3 | next.config.ts |
| 4 | .env.example |
| 5 | docker-compose.yml |
| 6 | jest.config.ts |
| 7 | prisma/schema.prisma |
| 8 | prisma/seed.ts |
| 9 | src/domain/entities.ts |
| 10 | src/domain/terms.ts |
| 11 | src/domain/invariant-reference.ts |
| 12 | src/domain/operations/transfer/transfer.types.ts |
| 13 | src/lib/errors.ts |
| 14 | src/domain/operations/transfer/transfer.lifecycle.ts |
| 15 | src/domain/operations/transfer/transfer.validation.ts |
| 16 | src/domain/operations/transfer/transfer.ledger-entry-plan.ts |
| 17 | src/lib/hash.ts |
| 18 | src/lib/response.ts |
| 19 | src/server/ledger/persistence-boundary.ts |
| 20 | src/server/ledger/lifecycle-control.ts |
| 21 | src/server/ledger/balance-control.ts |
| 22 | src/server/ledger/ledger-control.ts |
| 23 | src/server/ledger/consistency-boundary.ts |
| 24 | src/server/ledger/idempotency-control.ts |
| 25 | src/server/ledger/authorization-control.ts |
| 26 | src/server/ledger/request-boundary.ts |
| 27 | src/server/ledger/read-derivation-boundary.ts |
| 28 | src/app/api/transfers/route.ts |
| 29 | src/app/api/transfers/[transferId]/route.ts |
| 30 | src/app/api/transfers/[transferId]/ledger-entries/route.ts |
| 31 | src/app/api/accounts/[accountId]/balances/route.ts |
| 32 | tests/TEST-001-traceability.test.ts |
| 33 | tests/TEST-002-ledger-immutability.test.ts |
| 34 | tests/TEST-003-replay-determinism.test.ts |
| 35 | tests/TEST-004-atomicity.test.ts |
| 36 | tests/TEST-005-balance-constraint.test.ts |
| 37 | tests/TEST-006-asset-consistency.test.ts |
| 38 | tests/TEST-007-idempotency.test.ts |
| 39 | tests/TEST-008-lifecycle.test.ts |
| 40 | tests/TEST-009-bounded-consistency.test.ts |
| 41 | tests/TEST-010-operation-completeness.test.ts |
| 42 | tests/TEST-011-api-boundary.test.ts |
| 43 | tests/TEST-012-authorization.test.ts |

This order may change only if:

- IMP-INDEX routing remains valid
- dependencies remain legal
- no later file requires an unrouted earlier file
- no proof milestone is weakened
- the change is treated as implementation guidance, not source authority

## PROOF_MILESTONE_MATRIX

| Milestone | Required source focus | Required proof gate |
| --- | --- | --- |
| 0 | L00, I00, IMP-INDEX | authority/routing available; no blocking gap |
| 1 | L00, INV-009, API-012, API-013, TEST-009, TEST-011 | bounded local setup; no external correctness dependency |
| 2 | ENT-001 through ENT-006, FSM-001, SCHEMA-001 through SCHEMA-013 | persistence represents required entities and constraints |
| 3 | ENT-001 through ENT-006, TERM-001 through TERM-018, INV-001 through INV-010 | source-reference files do not redefine source meaning |
| 4 | ENT-004, TERM-007, TERM-008, FSM-001, SCHEMA-007 | Transfer-only operation surface |
| 5 | FAIL-001 through FAIL-010, API-004, API-006 | errors preserve source failure references |
| 6 | FSM-001 through FSM-010, INV-001, INV-005, INV-006, INV-008, INV-010 | pure Transfer helpers do not cross boundaries |
| 7 | INV-007, SCHEMA-009, SCHEMA-010, API-002 through API-006, API-011, API-012 | utilities remain narrow and non-executing |
| 8 | ARCH-007, ARCH-009, SCHEMA-001 through SCHEMA-013 | Prisma access centralized through Persistence Boundary |
| 9 | ARCH-004, ARCH-005, ARCH-006, ARCH-009 | lifecycle, Balance, and Ledger authority separated |
| 10 | INV-004, INV-009, ARCH-003, SCHEMA-011, SCHEMA-013 | operation write set is atomic |
| 11 | INV-007, FAIL-007, AUTHZ-001 through AUTHZ-012 | duplicate and unauthorized Requests cannot cause effects |
| 12 | ARCH-001, API-001 through API-013 | write entry cannot bypass required path |
| 13 | ARCH-008, INV-001, INV-003, API-005 | reads are derived and non-mutating |
| 14 | API-001 through API-013, AUTHZ-001 through AUTHZ-012 | API exposes only routed MVP surface |
| 15 | TEST-001 through TEST-012 | valid and invalid paths pass with observed behavior |
| 16 | L10, TEST-001 through TEST-012, IMP-11 | done criteria satisfied by passing proof gates |

## TEST_GENERATION_ORDER

Tests may be generated once the implementation targets needed for observation exist.

Recommended order:

| Order | Test file | Earliest practical prerequisite |
| --- | --- | --- |
| 1 | TEST-008-lifecycle.test.ts | lifecycle helper + Lifecycle Control |
| 2 | TEST-006-asset-consistency.test.ts | validation + Balance Control + schema |
| 3 | TEST-005-balance-constraint.test.ts | Balance Control + Persistence Boundary |
| 4 | TEST-001-traceability.test.ts | Ledger Control + execution path |
| 5 | TEST-010-operation-completeness.test.ts | Ledger Control + Consistency Boundary |
| 6 | TEST-004-atomicity.test.ts | Consistency Boundary |
| 7 | TEST-007-idempotency.test.ts | Idempotency Control + Request outcome persistence |
| 8 | TEST-003-replay-determinism.test.ts | LedgerEntry history + Read Derivation Boundary |
| 9 | TEST-002-ledger-immutability.test.ts | LedgerEntry persistence + forbidden mutation paths |
| 10 | TEST-009-bounded-consistency.test.ts | bounded setup + no external correctness dependency |
| 11 | TEST-011-api-boundary.test.ts | API routes |
| 12 | TEST-012-authorization.test.ts | Authorization Control + write route |

This order is implementation guidance only.

L10 owns TEST-* meanings.

## COMMIT_ORDER_GUIDANCE

Recommended proof-aligned commit order:

- 01-project-setup
- 02-prisma-schema-and-seed
- 03-domain-source-reference-scaffold
- 04-transfer-domain-types
- 05-failure-error-mapping
- 06-transfer-lifecycle-validation-ledger-plan
- 07-hash-and-response-utilities
- 08-persistence-boundary
- 09-lifecycle-balance-ledger-controls
- 10-consistency-boundary-transaction
- 11-idempotency-and-authorization-controls
- 12-request-boundary
- 13-read-derivation-boundary
- 14-api-routes
- 15-test-001-to-test-004-core-invariants
- 16-test-005-to-test-008-balance-asset-idempotency-lifecycle
- 17-test-009-to-test-012-boundary-api-authz
- 18-proof-closure-and-ci-gates

A commit is not proof unless its mapped verification gate is satisfied.

## REQUIRED_GENERATION_PACKET

Before generating any target file, resolve:

- Target file:
- Build milestone:
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
- Prerequisite files:
- Prerequisite milestone status:
- Output mode:
- Classification:
- Notes:

If any required field is missing, classify as GENERATION_PACKET_INCOMPLETE.

If a target or dependency is unrouted, classify as ROUTING_GAP.

## BUILD_STOP_RULES

Stop before generation if:

- target file is not routed by IMP-INDEX
- helper file is needed but not routed
- source ID is referenced but missing from I00
- IMP guidance conflicts with L00–L10
- code requires unsupported Balance-Affecting Operation
- code requires direct Balance mutation API
- code requires direct LedgerEntry creation API
- code requires lifecycle override API
- code requires external correctness dependency
- code requires JavaScript number for balance-affecting arithmetic
- code requires timestamp as replay/order/idempotency/lifecycle/proof authority
- code requires Persistence Boundary to make business-validity decisions
- code requires Read Derivation Boundary to mutate
- code requires production code to import test support
- milestone proof cannot map to TEST-* coverage

Classify before proceeding.

## INVALID_BUILD_ORDERS

| Invalid order | Why invalid |
| --- | --- |
| API route → direct Prisma → direct Balance update | Bypasses Request Boundary, Idempotency Control, Consistency Boundary, Balance Control, and Persistence Boundary |
| src/lib/prisma.ts or generic DB client before routing | Creates unrouted persistence path; Prisma access is routed through Persistence Boundary for MVP |
| Build happy path → add tests later | L10 requires source-mapped valid-path and invalid-path verification |
| Generic operation framework first | Expands beyond Transfer-only MVP scope |
| GET Balance route before mutation guarantees | Risks read model becoming authority over LedgerEntry-derived state |
| UI/demo before proof path | Creates feature-first drift and false progress |

## FALSIFIER_RULES

Each milestone must name its highest-value falsifier.

| Milestone | Highest-value falsifier |
| --- | --- |
| Project setup | Correctness depends on external/distributed system |
| Persistence representation | Required entity/constraint missing or unsupported operation model appears |
| Domain scaffold | Source-reference file redefines source meaning |
| Transfer domain | Unsupported operation or lifecycle state appears |
| Failure mapping | New FAIL-* class or source meaning is invented |
| Transfer pure rules | Helper imports Prisma, opens transaction, mutates state, or builds API Response |
| Utility support | Utility gains execution, persistence, authorization, or boundary authority |
| Persistence Boundary | Prisma access appears outside routed Persistence Boundary |
| Internal controls | One control owns another boundary’s authority |
| Consistency Boundary | Partial Balance/Ledger/Request state can commit |
| Idempotency | Duplicate Request creates additional LedgerEntries or Balance Change |
| Authorization | Unauthorized Request mutates state or creates execution path |
| Request Boundary | Write entry bypasses authorization, idempotency, or consistency path |
| Read Derivation | Read path mutates, repairs, authorizes, or executes |
| API routes | API exposes direct mutation, LedgerEntry creation, lifecycle override, or direct Prisma |
| Verification | Tests pass without source-mapped invalid-path observation |
| Proof closure | Completion relies on compilation, logs, timestamps, route existence, or happy path |

If a falsifier is observed, the milestone is incomplete.

## POST_GENERATION_VALIDATION

After generating any file, check:

| Label | Meaning |
| --- | --- |
| BUILD_ORDER_VIOLATION | Generated before prerequisite file/milestone |
| PROOF_MILESTONE_GAP | Missing source refs, invalid-path coverage, or proof tests |
| FEATURE_FIRST_DRIFT | UI/API/demo built before correctness prerequisites |
| ROUTING_SKIP | Target/helper not routed by IMP-INDEX |
| TEST_DEFERRAL_RISK | Verification deferred in a way that weakens proof |
| HAPPY_PATH_ONLY_PROGRESS | Progress claimed from success path only |
| COMPILE_AS_PROOF | Compilation/build success treated as proof |
| RUNTIME_AS_PROOF | Runtime success or absence of error treated as proof |
| ROUTING_AS_PROOF | Routing table treated as proof |
| LOG_AS_PROOF | Logs/audit output treated as proof |
| TIMESTAMP_AS_PROOF | Timestamp treated as correctness/order/replay/idempotency proof |
| UNSUPPORTED_OPERATION_DRIFT | Unsupported Balance-Affecting Operation introduced |
| BOUNDARY_BYPASS_DRIFT | Authority moved across boundaries |
| DIRECT_MUTATION_DRIFT | Direct Balance mutation or LedgerEntry creation path introduced |
| UNMAPPED_TEST_DRIFT | Test lacks source-owned ID mapping |
| DONE_BEFORE_PROOF | Completion claimed before TEST-* proof and IMP-11 gates |

If any label applies, generated output is not complete.

## PROOF_LIMITS

The following are not proof:

- file exists
- folder exists
- route exists
- schema exists
- seed runs
- API returns 200 once
- Transfer happy path works once
- logs look correct
- timestamps align
- TypeScript compiles
- generated code follows build order
- routing table lists proof tests
- tests exist without source mapping
- tests pass without invalid-path coverage

Proof requires:

- source rule reference
- routed implementation ownership
- dependency legality
- invalid-path rejection
- mapped TEST-* coverage
- observed passing behavior

## TRACEABILITY

| Section | Basis |
| --- | --- |
| AUTHORITY_STATUS | I00, IMP-INDEX, IMP-00 |
| PURPOSE | L00, L03, L04, L10 |
| DEPENDS_ON | I00, L00, L03, L04, L10, IMP-INDEX, IMP-00 through IMP-08, IMP-11 |
| SOURCE_AUTHORITY_ORDER | I00, IMP-INDEX |
| SCOPE | IMP-INDEX TARGET_FILE_ROUTING_MATRIX |
| CLASSIFICATION_RULE | IMP-00, IMP-INDEX |
| BUILD_ORDER_PRINCIPLE | L00, L03, L10, IMP-INDEX |
| PROOF_MILESTONE_RULE | L10, IMP-00 |
| GLOBAL_BUILD_SEQUENCE | IMP-INDEX TARGET_FILE_ROUTING_MATRIX |
| FILE_GENERATION_ORDER | IMP-INDEX TARGET_FILE_ROUTING_MATRIX, IMP-02 |
| PROOF_MILESTONE_MATRIX | L00, L03, L04, L10 |
| TEST_GENERATION_ORDER | L10, IMP-08 |
| COMMIT_ORDER_GUIDANCE | IMPLEMENTATION_GUIDANCE_ONLY |
| BUILD_STOP_RULES | IMP-00, IMP-INDEX |
| INVALID_BUILD_ORDERS | IMP-00, IMP-02, IMP-INDEX |
| FALSIFIER_RULES | L10, IMP guidance |
| POST_GENERATION_VALIDATION | IMP-00, IMP-INDEX, IMP-11 |
| PROOF_LIMITS | L10, IMP-00 |
| VALIDITY_CONDITIONS | I00, L00, L03, L04, L10, IMP-INDEX |

## VALIDITY_CONDITIONS

This file is VALID if it:

- remains non-authoritative implementation guidance
- preserves L00–L10 as correctness authority
- preserves L10 as verification authority
- preserves I00 as lookup and traceability authority
- preserves IMP-INDEX as implementation routing authority
- does not define source-owned IDs
- does not define new correctness rules
- does not define new verification requirements
- does not add target files outside IMP-INDEX routing
- does not add unsupported Balance-Affecting Operations
- orders implementation by proof milestones
- preserves one-target generation
- requires prerequisite files before dependent files
- prevents API-first and UI/demo-first drift
- prevents direct mutation paths
- prevents boundary bypass
- prevents tests from being disconnected from source rules
- treats build order as guidance, not proof
- routes final completion to IMP-11

This file is INVALID if it:

- defines correctness authority
- defines source-owned IDs
- weakens or extends L00–L10
- overrides I00 lookup
- overrides IMP-INDEX routing
- permits unrouted file generation
- permits unsupported operation scope
- permits direct Balance mutation
- permits direct LedgerEntry creation
- permits lifecycle override
- permits API route generation before boundary prerequisites
- permits completion before TEST-* proof
- treats file existence, routing, compilation, runtime success, logs, timestamps, happy-path execution, or generated code as proof

## CLASSIFICATION

SOURCE_FACT:

- L00–L10 are correctness authority.
- I00 is source indexing and traceability authority.
- IMP-INDEX is implementation/codegen routing authority.
- IMP files are non-authoritative implementation guidance.
- L10 owns verification authority.
- Generated implementation is not proof of correctness.

INFERENCE:

- Build order should follow dependency/proof structure, not feature order.
- Persistence representation should precede code that depends on persistence.
- Pure Transfer helpers should precede server controls.
- Persistence Boundary should precede controls requiring durable access.
- Consistency Boundary should follow the controls it coordinates.
- API routes should follow Request Boundary and Read Derivation Boundary.
- Tests should be source-mapped and tied to proof milestones.

ASSUMPTION:

- Implementation is generated one routed target file at a time.
- Commits may be grouped by proof milestone.
- TEST-* files are generated after enough implementation exists for observable behavior.
- CI/done criteria are completed through IMP-11.

IMPLEMENTATION_GUIDANCE_ONLY:

- concrete commit names
- concrete file generation order
- milestone grouping
- earliest practical test order
- proof-gate checklist wording
- milestone falsifier wording

SOURCE_GAP:

No blocking SOURCE_GAP identified in this IMP-09 document.

SOURCE_CONFLICT:

No blocking SOURCE_CONFLICT identified in this IMP-09 document.

## LOCK_STATUS

READY_FOR_USE only if:

- filename matches the IMP-INDEX registry entry for IMP-09
- IMP-INDEX defines TARGET_FILE_ROUTING_MATRIX
- IMP-INDEX defines VERIFICATION_FILE_ROUTING_MATRIX
- IMP-INDEX defines IMPLEMENTATION_DOCUMENT_REGISTRY
- I00 indexes all source-owned IDs used by build targets
- L00 defines bounded correctness constraints
- L03 defines INV-001 through INV-010
- L04 defines FAIL-001 through FAIL-010
- L10 defines TEST-001 through TEST-012
- IMP-00 defines global generation protocol
- IMP-01 through IMP-08 and IMP-11 exist or are scheduled
- out-of-order or unrouted needs are classified before generation
- generated implementation does not treat build order, routing, file existence, logs, timestamps, compilation, runtime success, happy-path execution, or generated code as proof

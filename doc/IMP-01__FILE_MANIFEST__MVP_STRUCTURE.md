# IMP-01__FILE_MANIFEST__MVP_STRUCTURE.md

## AUTHORITY_STATUS

NON_AUTHORITATIVE_IMPLEMENTATION_GUIDANCE

IMP-01 defines the DLE-2 MVP folder and file manifest.

Correctness authority is owned exclusively by L00–L10.

Source ID lookup and traceability metadata are owned by I00.

Implementation routing authority is owned by IMP-INDEX.

IMP-01 MUST NOT:

- define correctness rules
- define source-owned IDs
- define invariants
- define failure classes
- define lifecycle rules
- define schema rules as source authority
- define API contract rules as source authority
- define authorization rules
- define verification requirements
- override I00
- override L00–L10
- override IMP-INDEX routing
- create files not routed by IMP-INDEX
- create unsupported Balance-Affecting Operations
- create generic architecture not mapped to L06 boundaries
- treat file existence as proof
- treat folder structure as proof
- treat generated code as proof

---

## PURPOSE

Define the smallest MVP file structure that can prove the DLE-2 Transfer-only ledger guarantees.

IMP-01 answers:

- which folders exist
- which files exist
- which files are production targets
- which files are setup/config targets
- which files are Prisma targets
- which files are source-reference-only
- which files are Transfer-domain files
- which files are server boundary files
- which files are API route files
- which files are utility files
- which test files are expected for verification

IMP-01 does not own:

- dependency legality: IMP-02
- Prisma/schema details: IMP-03
- transaction behavior: IMP-04
- Transfer operation internals: IMP-05
- API route/Response behavior: IMP-06
- error mapping: IMP-07
- concrete TEST-* implementation: IMP-08
- build order: IMP-09
- observability: IMP-10
- done criteria / CI gates: IMP-11

---

## DEPENDS_ON

- I00__INDEXING_AUTHORITY__TRACEABILITY__GLOBAL.md
- L00__ROOT__SYSTEM_CONSTRAINTS__GLOBAL.md
- L01__DOMAIN__ENTITIES_RELATIONSHIPS__LEDGER.md
- L06__ARCHITECTURE__CONTROL_FLOW__SYSTEM.md
- L07__DATA_SCHEMA__DATA_MODEL__PERSISTENCE.md
- L08__API_CONTRACTS__EXTERNAL_BOUNDARY__SYSTEM.md
- L10__TEST_SPEC__VERIFICATION__SYSTEM.md
- IMP-INDEX__IMPLEMENTATION_ROUTING__CODEGEN_ENTRY.md
- IMP-00__GLOBAL_CODEGEN_PROTOCOL.md
- IMP-02__DEPENDENCY_RULES__BOUNDARY_IMPORTS.md
- IMP-03__PERSISTENCE_RULES__PRISMA_SCHEMA.md
- IMP-04__TRANSACTION_RULES__CONSISTENCY_BOUNDARY.md
- IMP-05__TRANSFER_OPERATION__MVP_ONLY.md
- IMP-06__API_RULES__ROUTES_RESPONSES.md
- IMP-07__FAILURE_MAPPING__LEDGER_ERRORS.md
- IMP-08__VERIFICATION_MATRIX__TEST_001_TO_012.md
- IMP-09__BUILD_ORDER__PROOF_MILESTONES.md
- IMP-11__DONE_CRITERIA__CI_AND_PROOF.md

---

## AUTHORITY_ORDER

Correctness authority:

```txt
L00 → L01 → L02 → L03 → L04 → L05 → L06 → L07 → L08 → L09 → L10
```

Lookup / traceability authority:

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

Generated implementation remains subordinate to L00–L10, I00, IMP-INDEX, and routed IMP guidance.

## AUTHORITY_RESOLUTION

| Conflict | Winner |
|---|---|
| IMP-01 conflicts with L00–L10 | L00–L10 |
| IMP-01 conflicts with I00 lookup / traceability metadata | I00 |
| IMP-01 conflicts with IMP-INDEX target routing, ownership, source IDs, required IMP files, proof tests, or packet shape | IMP-INDEX unless L00–L10 or I00 are violated |
| IMP-01 conflicts with IMP-00 global generation protocol | IMP-00 unless higher authority is violated |
| IMP-01 conflicts with IMP-02 dependency rules | IMP-02 owns dependency legality |
| IMP-01 conflicts with IMP-03 through IMP-11 target-specific guidance | target-specific IMP owns file-internal guidance |
| Generated file structure conflicts with L06 control boundaries | L06 |
| Generated file structure conflicts with L07 persistence entity requirements | L07 |
| Generated file structure conflicts with L08 API boundary restrictions | L08 |
| Generated file structure conflicts with L10 verification requirements | L10 |

If IMP-01 appears to authorize any file not routed by IMP-INDEX, classify as ROUTING_GAP.

## PRIMARY_SOURCE_MAPPING

IMP-01 primarily maps to:

- L01
- ARCH-001 through ARCH-009
- SCHEMA-001 through SCHEMA-013
- API-001 through API-013
- TEST-001 through TEST-012
- I00
- IMP-INDEX

IMP-01 does not define those IDs.

It only maps MVP files to the routed structure required to implement and verify them.

## CLASSIFICATION_RULE

| Classification | Meaning | Required action |
|---|---|---|
| READY_TO_GENERATE | File/folder target is routed by IMP-INDEX and belongs to this manifest | Proceed |
| GENERATION_PACKET_INCOMPLETE | Target path, owner, source references, dependencies, or proof tests are missing | Stop; complete packet |
| ROUTING_GAP | File, folder, helper, route, setup artifact, Prisma artifact, or test-support artifact is not routed | Stop; report missing route |
| SOURCE_GAP | Required source-owned ID or source mapping is missing from L00–L10 / I00 | Stop; report missing source authority |
| SOURCE_CONFLICT | Source/routing/guidance conflict changes file legality | Stop; do not choose by preference |
| INFERENCE | Derived structure from routed source facts but not source-owned | Label non-authoritative |
| ASSUMPTION | Reversible implementation structure choice not specified by source/routing | Label and minimize |
| IMPLEMENTATION_GUIDANCE_ONLY | Useful file-structure guidance, not source authority | May guide implementation |

Default classification for an unrouted file is ROUTING_GAP.

## MVP_STRUCTURE_RULE

The MVP structure is the smallest routed structure that proves the core ledger guarantees.

Allowed Balance-Affecting Operation:

```txt
Transfer
```

Required high-level structure:

```txt
config / setup
→ prisma persistence representation
→ domain source-reference files
→ Transfer-only domain helpers
→ server ledger boundaries
→ API routes
→ utilities
→ verification tests
```

Forbidden structure expansion:

```txt
src/controllers/*
src/services/*
src/repositories/*
src/utils/*
src/db/*
src/lib/prisma.ts
src/domain/operations/deposit/*
src/domain/operations/withdrawal/*
src/domain/operations/adjustment/*
src/domain/operations/reversal/*
src/app/api/deposits/*
src/app/api/withdrawals/*
src/app/api/adjustments/*
src/app/api/reversals/*
src/app/api/ledger-entries/*
src/app/api/balances/*
```

unless IMP-INDEX routes them first.

## MVP_FOLDER_TREE

```txt
.
├── package.json
├── tsconfig.json
├── next.config.ts
├── .env.example
├── docker-compose.yml
├── jest.config.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── transfers/
│   │       │   ├── route.ts
│   │       │   └── [transferId]/
│   │       │       ├── route.ts
│   │       │       └── ledger-entries/
│   │       │           └── route.ts
│   │       └── accounts/
│   │           └── [accountId]/
│   │               └── balances/
│   │                   └── route.ts
│   ├── domain/
│   │   ├── entities.ts
│   │   ├── terms.ts
│   │   ├── invariant-reference.ts
│   │   └── operations/
│   │       └── transfer/
│   │           ├── transfer.types.ts
│   │           ├── transfer.lifecycle.ts
│   │           ├── transfer.validation.ts
│   │           └── transfer.ledger-entry-plan.ts
│   ├── server/
│   │   └── ledger/
│   │       ├── request-boundary.ts
│   │       ├── authorization-control.ts
│   │       ├── idempotency-control.ts
│   │       ├── consistency-boundary.ts
│   │       ├── lifecycle-control.ts
│   │       ├── balance-control.ts
│   │       ├── ledger-control.ts
│   │       ├── persistence-boundary.ts
│   │       └── read-derivation-boundary.ts
│   └── lib/
│       ├── hash.ts
│       ├── errors.ts
│       └── response.ts
└── tests/
    ├── TEST-001-traceability.test.ts
    ├── TEST-002-ledger-immutability.test.ts
    ├── TEST-003-replay-determinism.test.ts
    ├── TEST-004-atomicity.test.ts
    ├── TEST-005-balance-constraint.test.ts
    ├── TEST-006-asset-consistency.test.ts
    ├── TEST-007-idempotency.test.ts
    ├── TEST-008-lifecycle.test.ts
    ├── TEST-009-bounded-consistency.test.ts
    ├── TEST-010-operation-completeness.test.ts
    ├── TEST-011-api-boundary.test.ts
    └── TEST-012-authorization.test.ts
```

This tree is closed.

Any additional production, config, Prisma, domain, server, API, utility, or test-support file requires IMP-INDEX routing first.

## FILE_GROUP_MANIFEST

| Group | Files | Owner / purpose | Detailed guidance |
|---|---|---|---|
| Project setup | package.json, tsconfig.json, next.config.ts, .env.example, docker-compose.yml, jest.config.ts | local bounded runtime, TypeScript, Next.js, PostgreSQL, Jest | IMP-09, IMP-11 |
| Prisma | prisma/schema.prisma, prisma/seed.ts | persisted entity representation and bounded seed data | IMP-03 |
| Domain references | src/domain/entities.ts, src/domain/terms.ts, src/domain/invariant-reference.ts | source-reference-only domain labels/types | IMP-01, IMP-08 |
| Transfer domain | transfer.types.ts, transfer.lifecycle.ts, transfer.validation.ts, transfer.ledger-entry-plan.ts | Transfer-only pure domain helpers | IMP-05 |
| Server boundaries | request-boundary.ts, authorization-control.ts, idempotency-control.ts, consistency-boundary.ts, lifecycle-control.ts, balance-control.ts, ledger-control.ts, persistence-boundary.ts, read-derivation-boundary.ts | routed execution/read control boundaries | IMP-02, IMP-04, IMP-05, IMP-07 |
| API routes | four src/app/api/**/route.ts files | allowed external write/read surface | IMP-06 |
| Utilities | hash.ts, errors.ts, response.ts | idempotency hashing, failure mapping, API-safe responses | IMP-04, IMP-06, IMP-07 |
| Tests | TEST-001 through TEST-012 | source-mapped verification | IMP-08, IMP-11 |

## SETUP_FILE_MANIFEST

| File | Responsibility | Must not do |
|---|---|---|
| package.json | declare scripts/dependencies for local build/test/runtime | define correctness, add unsupported tools as correctness dependency |
| tsconfig.json | configure TypeScript compilation | loosen boundaries through path aliases that hide unrouted imports |
| next.config.ts | configure Next.js runtime only | define API behavior or correctness |
| .env.example | document required local env variables without secrets | include real secrets or external correctness dependency |
| docker-compose.yml | provide local PostgreSQL for bounded persistence | introduce distributed correctness services |
| jest.config.ts | configure TEST-* execution | redefine TEST-* meanings |

## PRISMA_FILE_MANIFEST

| File | Responsibility | Must not do |
|---|---|---|
| prisma/schema.prisma | represent Account, Asset, Balance, Transfer, LedgerEntry, Request and routed constraints | create unsupported operation models or treat schema existence as proof |
| prisma/seed.ts | seed bounded Account, Asset, and Balance data for local/test use | create LedgerEntries or Transfers as proof of correctness |

Persistence details belong to IMP-03.

## DOMAIN_FILE_MANIFEST

| File | Responsibility | Must not do |
|---|---|---|
| src/domain/entities.ts | source-reference-only entity labels/types for Account, Asset, Balance, Transfer, LedgerEntry, Request | add runtime correctness authority |
| src/domain/terms.ts | source-reference-only canonical term labels/types | redefine L02 term meanings |
| src/domain/invariant-reference.ts | source-reference-only invariant references | create or enforce invariants |
| transfer.types.ts | Transfer-only TypeScript types and operation-local interfaces | execute operation, mutate state, import server/API/Prisma |
| transfer.lifecycle.ts | pure lifecycle helpers aligned to L05 | persist lifecycle state or add states/transitions |
| transfer.validation.ts | pure Transfer input/shape validation helpers | read/write database or authorize Balance Change |
| transfer.ledger-entry-plan.ts | pure deterministic non-persistent LedgerEntry intent planning | persist LedgerEntries or mutate Balance |

Source-reference-only files remain non-authoritative.

Transfer internals belong to IMP-05.

## SERVER_BOUNDARY_FILE_MANIFEST

| File | Boundary owner | Responsibility | Must not do |
|---|---|---|---|
| request-boundary.ts | Request Boundary | receive routed internal Request and forward into auth/idempotency flow | mutate Balance, create LedgerEntries, open transaction |
| authorization-control.ts | Request Boundary Adjunct | evaluate AUTHZ-* constraints deterministically | mutate state, select lifecycle state, create execution path |
| idempotency-control.ts | Idempotency Control | resolve Request identity before execution | mutate Balance, create LedgerEntries, open transaction |
| consistency-boundary.ts | Consistency Boundary | coordinate atomic operation execution/transaction | expose API contract or read-only derivation |
| lifecycle-control.ts | Lifecycle Control | evaluate Transfer lifecycle transition intent | persist directly unless routed through Consistency/Persistence path |
| balance-control.ts | Balance Control | authorize Balance Change eligibility | create LedgerEntries or perform direct persistence outside Persistence Boundary |
| ledger-control.ts | Ledger Control | authorize/construct semantic LedgerEntry intent | mutate Balance or persist directly outside Persistence Boundary |
| persistence-boundary.ts | Persistence Boundary | perform physical durable reads/writes | make business-validity decisions |
| read-derivation-boundary.ts | Read Derivation Boundary | provide derived read state only | mutate, repair, authorize, or execute operations |

Server boundary behavior details belong to IMP-02, IMP-04, IMP-05, and IMP-07.

## API_FILE_MANIFEST

Allowed API files:

| File | Method | Responsibility | Must not do |
|---|---|---|---|
| src/app/api/transfers/route.ts | POST | external Transfer Request entry routed to Request Boundary | call Prisma, Consistency Boundary, Balance Control, Ledger Control, or Persistence Boundary directly |
| src/app/api/transfers/[transferId]/route.ts | GET | read-only Transfer inspection routed to Read Derivation Boundary | mutate, execute, authorize, or repair |
| src/app/api/transfers/[transferId]/ledger-entries/route.ts | GET | read-only LedgerEntry inspection routed to Read Derivation Boundary | create/update/delete/repair LedgerEntries |
| src/app/api/accounts/[accountId]/balances/route.ts | GET | read-only derived Balance view routed to Read Derivation Boundary | mutate or recalculate-and-persist Balance |

Forbidden API files:

```txt
src/app/api/balances/*
src/app/api/ledger-entries/*
src/app/api/transfers/[transferId]/state/*
src/app/api/deposits/*
src/app/api/withdrawals/*
src/app/api/adjustments/*
src/app/api/reversals/*
src/app/api/operations/*
```

API details belong to IMP-06.

## UTILITY_FILE_MANIFEST

| File | Responsibility | Must not do |
|---|---|---|
| src/lib/hash.ts | deterministic support for Request identity / idempotency representation | import internal project files or become idempotency authority |
| src/lib/errors.ts | implementation error types and FAIL-* mapping | create new FAIL-* classes or import server/API/domain/Prisma |
| src/lib/response.ts | API-safe success/error response envelopes | execute operations, mutate state, import server controls or Prisma |

Utility details belong to IMP-04, IMP-06, and IMP-07.

## TEST_FILE_MANIFEST

| Test file | Primary concern |
|---|---|
| tests/TEST-001-traceability.test.ts | Balance Change traceability to LedgerEntries |
| tests/TEST-002-ledger-immutability.test.ts | LedgerEntry immutability |
| tests/TEST-003-replay-determinism.test.ts | reconstruction from LedgerEntry history |
| tests/TEST-004-atomicity.test.ts | all-or-nothing operation application |
| tests/TEST-005-balance-constraint.test.ts | Balance constraints |
| tests/TEST-006-asset-consistency.test.ts | Asset consistency |
| tests/TEST-007-idempotency.test.ts | duplicate Request behavior |
| tests/TEST-008-lifecycle.test.ts | Transfer lifecycle governance |
| tests/TEST-009-bounded-consistency.test.ts | bounded-system correctness |
| tests/TEST-010-operation-completeness.test.ts | executed operation LedgerEntry completeness |
| tests/TEST-011-api-boundary.test.ts | API boundary restrictions |
| tests/TEST-012-authorization.test.ts | authorization constraints |

Concrete test implementation belongs to IMP-08.

Completion and CI gates belong to IMP-11.

Test-support files may exist only if routed by IMP-08 or IMP-11.

## CLOSED_FILE_SET_RULE

The MVP production/config file set is closed.

A generated file is allowed only if it appears in one of these categories:

- setup/config files listed in IMP-01
- prisma files listed in IMP-01
- src/domain files listed in IMP-01
- src/domain/operations/transfer files listed in IMP-01
- src/server/ledger files listed in IMP-01
- src/app/api route files listed in IMP-01
- src/lib files listed in IMP-01
- tests/TEST-001 through TEST-012 listed in IMP-08

Unrouted examples:

```txt
src/lib/prisma.ts
src/lib/db.ts
src/server/db.ts
src/server/repositories/*
src/domain/operations/index.ts
src/domain/operations/* except transfer/*
src/app/api/_helpers/*
src/app/api/lib/*
src/utils/*
src/services/*
src/controllers/*
tests/helpers.ts
tests/fixtures.ts
tests/builders.ts
```

If any unrouted file appears necessary, classify as ROUTING_GAP.

Do not create it by convenience.

## ARCHITECTURE_ALIGNMENT_RULE

The file structure must make L06 control flow visible:

```txt
Request Boundary
→ Idempotency Control
→ Consistency Boundary {
    Lifecycle Control
    → Balance Control
    → Ledger Control
    → Persistence Boundary
}
→ Read Derivation Boundary
```

Folder names must not hide correctness boundaries behind generic patterns.

Avoid replacing boundary files with:

```txt
controllers
services
repositories
managers
handlers
processors
use-cases
```

unless IMP-INDEX routes them first.

## MINIMALITY_RULE

A file is allowed only if it does at least one of these:

- represents required bounded setup
- represents required persistence structure
- exposes source-reference-only domain labels/types
- implements Transfer-only pure helper logic
- implements one L06-routed boundary
- implements one allowed L08 API route
- implements one required utility
- implements one L10-routed TEST-* file

A file is not allowed if its only purpose is:

- convenience
- generic abstraction
- future extensibility
- barrel export
- helper extraction
- aesthetic folder organization
- avoiding import verbosity
- imitating MVC structure
- supporting unsupported operations

## SOURCE_REFERENCE_ONLY_FILE_RULE

These files are source-reference-only:

```txt
src/domain/entities.ts
src/domain/terms.ts
src/domain/invariant-reference.ts
```

They may expose:

- source ID constants
- labels
- TypeScript types
- compile-time references

They must not:

- redefine source meanings
- add runtime correctness authority
- create new invariants
- create new terms
- treat implementation constants as source authority
- import server/API/Prisma/test code

## MVP_OPERATION_SCOPE_RULE

The only Balance-Affecting Operation folder allowed in MVP is:

```txt
src/domain/operations/transfer/
```

Forbidden unless source authority and IMP-INDEX routing are updated:

```txt
src/domain/operations/deposit/
src/domain/operations/withdrawal/
src/domain/operations/adjustment/
src/domain/operations/reversal/
src/domain/operations/exchange/
src/domain/operations/settlement/
src/domain/operations/refund/
src/domain/operations/journal/
```

Generic operation registries are also forbidden unless routed:

```txt
src/domain/operations/index.ts
src/domain/operations/registry.ts
src/domain/operations/operation.types.ts
src/server/ledger/operation-dispatcher.ts
```

## API_SURFACE_RULE

The only write API route is:

```txt
POST /api/transfers
```

Allowed read API routes:

```txt
GET /api/transfers/:transferId
GET /api/transfers/:transferId/ledger-entries
GET /api/accounts/:accountId/balances
```

No other API routes are part of the MVP.

Direct Balance mutation, direct LedgerEntry creation, lifecycle override, and generic operation routes are forbidden.

## PERSISTENCE_ACCESS_RULE

The only production file that may own Prisma physical persistence access is:

```txt
src/server/ledger/persistence-boundary.ts
```

Do not create:

```txt
src/lib/prisma.ts
src/lib/db.ts
src/db/client.ts
src/server/db.ts
src/server/ledger/repository.ts
src/server/repositories/*
```

unless IMP-INDEX routes them first.

Prisma schema and seed files live under:

```txt
prisma/
```

Prisma details belong to IMP-03.

Dependency legality belongs to IMP-02.

## PRE_GENERATION_PACKET_REQUIREMENTS

Before generating any file listed in this manifest, resolve:

```txt
Target file:
File group:
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

Classification must be READY_TO_GENERATE before generation.

If any field cannot be resolved, classify as GENERATION_PACKET_INCOMPLETE.

If the file is not listed in this manifest / IMP-INDEX, classify as ROUTING_GAP.

## POST_GENERATION_VALIDATION

After generating or modifying a file, validate against these IMP-01 labels:

| Protocol label | Meaning |
|---|---|
| UNROUTED_FILE | File is not listed in the routed MVP manifest |
| UNROUTED_FOLDER | Folder exists only to support unrouted files |
| MANIFEST_DRIFT | File path differs from routed manifest |
| GENERIC_ARCHITECTURE_DRIFT | MVC/service/repository/controller structure hides L06 boundaries |
| UNSUPPORTED_OPERATION_FILE | File implies Balance-Affecting Operation other than Transfer |
| UNROUTED_API_ROUTE | API route is not listed as allowed MVP API surface |
| DIRECT_MUTATION_ROUTE | API route enables direct Balance or LedgerEntry mutation |
| LIFECYCLE_OVERRIDE_ROUTE | API route enables external lifecycle state selection |
| SOURCE_REFERENCE_BEHAVIOR_LEAK | source-reference-only file gains runtime correctness behavior |
| PRISMA_ACCESS_DRIFT | Prisma access appears outside routed persistence file |
| TEST_SUPPORT_LEAK | test helper/fixture imported by production code |
| PROOF_VIOLATION | file existence, folder structure, compilation, logs, or happy path treated as proof |

If validation fails, generated structure is not acceptable as complete.

## PROOF_LIMITS

The following are not proof:

- folder exists
- file exists
- manifest exists
- routing row exists
- TypeScript compiles
- Next.js builds
- Prisma schema validates
- seed runs
- API route returns once
- happy-path Transfer works once
- logs look correct
- timestamps align

Proof requires:

- source rule reference
- routed implementation ownership
- dependency legality
- invalid-path rejection
- mapped TEST-* coverage
- observed passing behavior

## TRACEABILITY

| Section | Basis |
|---|---|
| AUTHORITY_STATUS | I00, IMP-INDEX, IMP-00 |
| PURPOSE | IMP-INDEX, L01, L06, L07, L08, L10 |
| DEPENDS_ON | I00, L00, L01, L06, L07, L08, L10, IMP-INDEX, IMP-00 through IMP-11 |
| AUTHORITY_ORDER | I00, IMP-INDEX |
| AUTHORITY_RESOLUTION | I00, L00–L10, IMP-INDEX |
| PRIMARY_SOURCE_MAPPING | I00, IMP-INDEX |
| CLASSIFICATION_RULE | IMP-00, IMP-INDEX |
| MVP_STRUCTURE_RULE | L00, L06, L07, L08, L10, IMP-INDEX |
| MVP_FOLDER_TREE | IMP-INDEX TARGET_FILE_ROUTING_MATRIX |
| FILE_GROUP_MANIFEST | IMP-INDEX TARGET_FILE_ROUTING_MATRIX |
| SETUP_FILE_MANIFEST | IMP-INDEX, IMP-09, IMP-11 |
| PRISMA_FILE_MANIFEST | L07, IMP-03 |
| DOMAIN_FILE_MANIFEST | L01, L02, L03, IMP-05 |
| SERVER_BOUNDARY_FILE_MANIFEST | L06, IMP-02, IMP-04 |
| API_FILE_MANIFEST | L08, IMP-06 |
| UTILITY_FILE_MANIFEST | IMP-04, IMP-06, IMP-07 |
| TEST_FILE_MANIFEST | L10, IMP-08 |
| CLOSED_FILE_SET_RULE | IMP-INDEX |
| ARCHITECTURE_ALIGNMENT_RULE | L06 ARCH-009 |
| MINIMALITY_RULE | IMP-INDEX, IMP-09 |
| SOURCE_REFERENCE_ONLY_FILE_RULE | I00, IMP-INDEX |
| MVP_OPERATION_SCOPE_RULE | L00, L05, IMP-05 |
| API_SURFACE_RULE | L08, IMP-06 |
| PERSISTENCE_ACCESS_RULE | L07, IMP-03, IMP-02 |
| PRE_GENERATION_PACKET_REQUIREMENTS | IMP-00, IMP-INDEX |
| POST_GENERATION_VALIDATION | IMP-00, IMP-INDEX |
| PROOF_LIMITS | L10, IMP-00 |

## VALIDITY_CONDITIONS

This file is VALID if it:

- remains non-authoritative implementation guidance
- preserves L00–L10 as correctness authority
- preserves I00 as source lookup and traceability authority
- preserves IMP-INDEX as implementation routing authority
- does not define source-owned IDs
- does not define new correctness rules
- does not define new verification requirements
- defines only the routed MVP file/folder manifest
- keeps the file set closed
- maps files to responsibilities without redefining source rules
- preserves L06 architectural boundary visibility
- preserves Transfer-only MVP operation scope
- preserves allowed L08 API surface
- preserves Persistence Boundary as physical durable access owner
- sends concrete dependencies to IMP-02
- sends schema details to IMP-03
- sends Transfer details to IMP-05
- sends API details to IMP-06
- sends tests to IMP-08
- sends completion to IMP-11
- prevents file/folder existence from being treated as proof

This file is INVALID if it:

- defines correctness authority
- defines source-owned IDs
- weakens or extends L00–L10
- overrides I00 lookup
- overrides IMP-INDEX routing
- permits unrouted files
- permits generic MVC/service/repository/controller structure that hides source boundaries
- permits Balance-Affecting Operations other than Transfer
- permits direct Balance mutation API
- permits direct LedgerEntry creation API
- permits lifecycle override API
- permits direct Prisma access outside routed Persistence Boundary
- permits source-reference-only files to enforce runtime correctness
- permits production code to import test-support files
- treats manifest existence, folder structure, generated code, compilation, logs, timestamps, runtime success, or happy path as proof

## CLASSIFICATION

### SOURCE_FACT:

- L00–L10 are correctness authority.
- I00 is source indexing and traceability authority.
- IMP-INDEX is implementation/codegen routing authority.
- IMP files are non-authoritative implementation guidance.
- IMP-01’s role is MVP folders/files and file responsibilities.
- L06 defines architectural control boundaries and required control flow.
- L07 defines persisted entity/schema authority.
- L08 defines API contract boundaries.
- L10 defines verification authority.

### INFERENCE:

- The manifest should be closed to prevent AI-generated convenience files from creating boundary drift.
- Folder names should mirror correctness boundaries rather than generic framework patterns.
- Transfer-only domain structure is sufficient for the MVP and avoids unsupported operation scope.
- Prisma access should remain visibly routed through Persistence Boundary to reduce persistence bypass risk.
- TEST-* files belong in the manifest as expected verification targets, while concrete test content belongs to IMP-08.

### ASSUMPTION:

- The MVP uses Next.js, TypeScript, Prisma, PostgreSQL, Docker Compose, and Jest.
- src/app/api/**/route.ts follows Next.js route-handler conventions.
- No separate Prisma client helper is routed for MVP.
- No test helper, fixture, builder, or setup file is routed yet.

These assumptions are implementation guidance only.

They MUST NOT define source correctness.

### IMPLEMENTATION_GUIDANCE_ONLY:

- concrete folder tree
- concrete file grouping
- file responsibility summaries
- manifest closure labels
- unsupported convenience-file examples
- folder naming convention guidance

### SOURCE_GAP:

No blocking SOURCE_GAP is identified within this IMP-01 document.

### SOURCE_CONFLICT:

No blocking SOURCE_CONFLICT is identified within this IMP-01 document.

## LOCK_STATUS

READY_FOR_USE only if:

- filename matches IMP-INDEX registry entry for IMP-01
- IMP-INDEX defines TARGET_FILE_ROUTING_MATRIX
- IMP-INDEX defines VERIFICATION_FILE_ROUTING_MATRIX
- I00 indexes all source-owned IDs used by manifest targets
- L01 defines the required entity set
- L06 defines ARCH-001 through ARCH-009
- L07 defines SCHEMA-001 through SCHEMA-013
- L08 defines API-001 through API-013
- L10 defines TEST-001 through TEST-012
- IMP-00 defines global generation protocol
- IMP-02 defines dependency/import legality
- IMP-03 defines persistence guidance
- IMP-05 defines Transfer-only operation guidance
- IMP-06 defines API guidance
- IMP-08 defines TEST-* implementation matrix
- IMP-11 defines completion and CI proof gates
- generated implementation treats any unlisted file as ROUTING_GAP
- generated implementation does not treat file structure, routing, compilation, logs, runtime success, or happy-path behavior as proof

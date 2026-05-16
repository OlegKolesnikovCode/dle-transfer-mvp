# IMP-02__DEPENDENCY_RULES__BOUNDARY_IMPORTS.md

## AUTHORITY_STATUS

NON_AUTHORITATIVE_IMPLEMENTATION_GUIDANCE

IMP-02 defines dependency and import-boundary guidance for DLE-2.

Correctness authority is owned exclusively by L00–L10.

Implementation routing authority is owned by IMP-INDEX.

IMP-02 MUST NOT:

- define correctness rules
- define source-owned IDs
- define invariants
- define failure classes
- define lifecycle rules
- define architecture rules
- define schema rules
- define API contract rules
- define authorization rules
- define verification requirements
- override I00
- override L00–L10
- override IMP-INDEX routing
- create target files
- create helper files
- create architectural boundaries
- treat dependency routing as proof

---

## PURPOSE

Prevent implementation drift caused by improper imports, hidden helpers, circular dependencies, dependency injection bypass, test leakage, or framework-convenience coupling.

IMP-02 exists to preserve the routed L06 control flow through import direction:

```txt
Request Boundary
→ Authorization evaluation where routed
→ Idempotency Control
→ Consistency Boundary {
    Lifecycle Control
    → Balance Control
    → Ledger Control
    → Persistence Boundary
}
→ Read Derivation Boundary
```

IMP-02 protects:

- Request Boundary entry discipline
- Idempotency-before-execution discipline
- Consistency Boundary transaction ownership
- Balance Control authority over Balance Change authorization
- Ledger Control authority over semantic LedgerEntry creation
- Persistence Boundary authority over physical durable writes
- Read Derivation Boundary separation from mutation
- API non-exposure of internals
- production/test separation

IMP-02 does not replace IMP-INDEX.

IMP-INDEX remains the routing authority for target files, ownership, source references, required IMP files, proof tests, and dependency allowance.

---

## DEPENDS_ON

- I00__INDEXING_AUTHORITY__TRACEABILITY__GLOBAL.md
- L00__ROOT__SYSTEM_CONSTRAINTS__GLOBAL.md
- L06__ARCHITECTURE__CONTROL_FLOW__SYSTEM.md
- L08__API_CONTRACTS__EXTERNAL_BOUNDARY__SYSTEM.md
- L09__SECURITY_AUTHZ__ACCESS_RULES__SYSTEM.md
- L10__TEST_SPEC__VERIFICATION__SYSTEM.md
- IMP-INDEX__IMPLEMENTATION_ROUTING__CODEGEN_ENTRY.md
- IMP-00__GLOBAL_CODEGEN_PROTOCOL.md
- IMP-01__FILE_MANIFEST__MVP_STRUCTURE.md
- IMP-03__PERSISTENCE_RULES__PRISMA_SCHEMA.md
- IMP-04__TRANSACTION_RULES__CONSISTENCY_BOUNDARY.md
- IMP-05__TRANSFER_OPERATION__MVP_ONLY.md
- IMP-06__API_RULES__ROUTES_RESPONSES.md
- IMP-07__FAILURE_MAPPING__LEDGER_ERRORS.md
- IMP-08__VERIFICATION_MATRIX__TEST_001_TO_012.md
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

---

## AUTHORITY_RESOLUTION

| Conflict | Winner |
|---|---|
| IMP-02 conflicts with L00–L10 | L00–L10 |
| IMP-02 conflicts with I00 lookup / traceability metadata | I00 |
| IMP-02 conflicts with IMP-INDEX target routing, ownership, required source IDs, required IMP files, proof tests, packet shape, or dependency allowance | IMP-INDEX unless L00–L10 or I00 are violated |
| IMP-02 conflicts with IMP-00 global generation protocol | IMP-00 unless higher authority is violated |
| IMP-02 conflicts with target-specific IMP guidance | Target-specific IMP owns file-internal implementation guidance unless dependency legality is violated |
| Generated code conflicts with IMP-02 dependency rules | IMP-02 unless IMP-INDEX is more restrictive |
| Generated code conflicts with any source document | Source document wins |

If IMP-02 appears to authorize a dependency not listed in IMP-INDEX, classify as `ROUTING_GAP`.

---

## PRIMARY_SOURCE_MAPPING

IMP-02 primarily maps to:

```txt
ARCH-001 through ARCH-009
API-001 through API-013
AUTHZ-001 through AUTHZ-012
TEST-001 through TEST-012
IMP-INDEX
```

IMP-02 does not define those IDs.

It only constrains dependency direction needed to preserve them.

---

## SCOPE

IMP-02 governs internal project dependencies among:

```txt
src/app/*
src/server/*
src/domain/*
src/lib/*
prisma/*
tests/*
config files
```

IMP-02 applies to:

- static imports
- type-only imports
- dynamic imports
- runtime calls
- re-exports
- barrel exports
- helper extraction
- dependency injection paths
- transaction-context passing
- generated-client access
- test-support imports

IMP-02 does not govern:

- external package selection by itself
- database schema design
- API response shape
- business-rule correctness
- lifecycle transition meaning
- verification semantics
- source ID meanings

---

## CLASSIFICATION_RULE

| Classification | Meaning | Required action |
|---|---|---|
| READY_TO_GENERATE | Target file and all internal dependencies are routed and allowed | Proceed |
| GENERATION_PACKET_INCOMPLETE | Dependency fields are missing or ambiguous | Stop; complete packet |
| ROUTING_GAP | Target file, import, helper, fixture, wrapper, generated-client path, or dependency is not routed | Stop; report missing route |
| SOURCE_GAP | Required source-owned rule or ID needed for dependency legality is missing | Stop; report missing source authority |
| SOURCE_CONFLICT | Source/routing/guidance conflict changes dependency legality | Stop; do not choose by preference |
| INFERENCE | Derived dependency guidance from source/routing facts but not source-owned | Label non-authoritative |
| ASSUMPTION | Reversible implementation choice not specified by source/routing | Label and minimize |
| IMPLEMENTATION_GUIDANCE_ONLY | Useful implementation guidance, not source authority | May guide implementation |

Default classification for an unrouted internal import is `ROUTING_GAP`.

---

## ROUTED_FILE_RULE

Every production, config, domain, server, API, library, Prisma, setup, test, fixture, mock, builder, or helper file must be routed before generation.

A file is allowed only if listed in one of:

```txt
IMP-INDEX TARGET_FILE_ROUTING_MATRIX
IMP-INDEX VERIFICATION_FILE_ROUTING_MATRIX
explicitly routed test-support section in IMP-08 / IMP-11
```

If not listed, classify as `ROUTING_GAP`.

This applies to:

```txt
source files
test files
fixtures
mocks
builders
helpers
generated-client wrappers
setup files
config files
migrations
route files
library utilities
barrel exports
```

Convenience is not a valid reason to create a file.

---

## ABSOLUTE_DEPENDENCY_PROHIBITIONS

Generated implementation MUST NOT:

- import unrouted internal project files
- create helper files not routed by IMP-INDEX
- create utility files not routed by IMP-INDEX
- create Prisma client wrappers not routed by IMP-INDEX
- create barrel exports not routed by IMP-INDEX
- import tests, fixtures, mocks, builders, or setup files into production code
- import Prisma directly outside allowed persistence files
- let API routes import Prisma directly
- let API routes call internal controls other than their routed entry boundary
- let read routes import mutation or execution controls
- let write routes import Consistency Boundary directly
- let Authorization Control mutate, execute, select lifecycle state, or open transactions
- let Idempotency Control open transactions or mutate state
- let Lifecycle Control persist directly
- let Balance Control write directly outside Persistence Boundary
- let Ledger Control write directly outside Persistence Boundary
- let Persistence Boundary make business-validity decisions
- let Read Derivation Boundary mutate, authorize, or execute
- introduce circular control dependencies
- use dependency injection to hide forbidden imports
- use framework convention to bypass routing
- use generated code, logs, timestamps, runtime success, compilation, or routing as proof

---

## ALLOWED_DEPENDENCY_MATRIX

If a dependency is not listed here, it is forbidden unless IMP-INDEX explicitly routes it.

| From | May import / call |
|---|---|
| `src/app/api/transfers/route.ts` | `src/server/ledger/request-boundary.ts`, `src/lib/response.ts`, `src/lib/errors.ts` |
| `src/app/api/transfers/[transferId]/route.ts` | `src/server/ledger/read-derivation-boundary.ts`, `src/lib/response.ts` |
| `src/app/api/transfers/[transferId]/ledger-entries/route.ts` | `src/server/ledger/read-derivation-boundary.ts`, `src/lib/response.ts` |
| `src/app/api/accounts/[accountId]/balances/route.ts` | `src/server/ledger/read-derivation-boundary.ts`, `src/lib/response.ts` |
| `src/server/ledger/request-boundary.ts` | `src/server/ledger/authorization-control.ts`, `src/server/ledger/idempotency-control.ts`, `src/domain/operations/transfer/transfer.validation.ts`, `src/lib/response.ts`, `src/lib/errors.ts` |
| `src/server/ledger/authorization-control.ts` | No internal imports unless explicitly routed |
| `src/server/ledger/idempotency-control.ts` | `src/server/ledger/consistency-boundary.ts`; may call `src/server/ledger/persistence-boundary.ts` for read-only Request identity/outcome lookup only |
| `src/server/ledger/consistency-boundary.ts` | `src/server/ledger/lifecycle-control.ts`, `src/server/ledger/balance-control.ts`, `src/server/ledger/ledger-control.ts`, `src/server/ledger/persistence-boundary.ts` |
| `src/server/ledger/lifecycle-control.ts` | `src/domain/operations/transfer/transfer.lifecycle.ts` |
| `src/server/ledger/balance-control.ts` | `src/domain/operations/transfer/transfer.validation.ts`, `src/server/ledger/persistence-boundary.ts` within transaction context |
| `src/server/ledger/ledger-control.ts` | `src/domain/operations/transfer/transfer.ledger-entry-plan.ts`, `src/server/ledger/persistence-boundary.ts` within transaction context |
| `src/server/ledger/persistence-boundary.ts` | Prisma client / generated Prisma types only |
| `src/server/ledger/read-derivation-boundary.ts` | `src/server/ledger/persistence-boundary.ts` read methods only |
| `src/domain/entities.ts` | No internal imports |
| `src/domain/terms.ts` | No internal imports |
| `src/domain/invariant-reference.ts` | No internal imports |
| `src/domain/operations/transfer/transfer.types.ts` | `src/domain/entities.ts`, `src/domain/terms.ts` |
| `src/domain/operations/transfer/transfer.lifecycle.ts` | `src/domain/operations/transfer/transfer.types.ts` |
| `src/domain/operations/transfer/transfer.validation.ts` | `src/domain/operations/transfer/transfer.types.ts`, `src/domain/entities.ts`, `src/domain/terms.ts` |
| `src/domain/operations/transfer/transfer.ledger-entry-plan.ts` | `src/domain/operations/transfer/transfer.types.ts`, `src/domain/entities.ts`, `src/domain/terms.ts` |
| `src/lib/hash.ts` | No internal imports |
| `src/lib/errors.ts` | No internal imports |
| `src/lib/response.ts` | `src/lib/errors.ts` |
| `prisma/seed.ts` | Prisma client / generated Prisma types only unless IMP-INDEX explicitly routes more |
| `package.json` | No internal imports |
| `tsconfig.json` | No internal imports |
| `next.config.ts` | Framework/runtime config imports only; no `src/server`, `src/domain`, or `src/lib` imports |
| `jest.config.ts` | Test framework config imports only; no production execution imports unless routed |
| `docker-compose.yml` | No internal imports |
| `.env.example` | No internal imports |

---

## FORBIDDEN_DEPENDENCY_MATRIX

These dependencies are forbidden unless IMP-INDEX is explicitly updated and source authority remains satisfied.

| File / layer | Must not import / call |
|---|---|
| Write API routes | Prisma, Consistency Boundary, Lifecycle Control, Balance Control, Ledger Control, Persistence Boundary |
| Read API routes | Request Boundary, Authorization Control, Idempotency Control, Consistency Boundary, Lifecycle Control, Balance Control, Ledger Control, Prisma |
| `request-boundary.ts` | Prisma, Balance mutation, LedgerEntry persistence, transaction opening |
| `authorization-control.ts` | mutation, LedgerEntry creation, lifecycle state mutation, transaction opening, persistence writes, Balance Change authorization |
| `idempotency-control.ts` | Balance mutation, LedgerEntry creation, lifecycle mutation, transaction opening, durable Request reservation/outcome writes outside Consistency Boundary |
| `consistency-boundary.ts` | API route exposure, read-derivation ownership, external Response ownership |
| `lifecycle-control.ts` | Persistence Boundary directly unless routed, Prisma, transaction opening, durable lifecycle persistence |
| `balance-control.ts` | direct database writes outside Persistence Boundary, API exposure, LedgerEntry creation authority |
| `ledger-control.ts` | direct database writes outside Persistence Boundary, API exposure, Balance Change authorization |
| `persistence-boundary.ts` | business-validity decisions, API response construction, lifecycle transition decisions, Balance Change authorization, semantic LedgerEntry authorization |
| `read-derivation-boundary.ts` | mutation, authorization, Balance-Affecting Operation execution, write transaction context |
| `src/domain/*` | Prisma, API routes, server controls, persistence calls, transaction calls, external systems |
| `src/lib/hash.ts` | internal project imports |
| `src/lib/errors.ts` | internal project imports |
| `src/lib/response.ts` | server controls, domain execution controls, Prisma |
| `prisma/seed.ts` | `src/server/*`, API routes, mutation/execution controls unless explicitly routed |
| Production code under `src/*` | `tests/*`, fixtures, mocks, builders, setup files |
| Test-support files | production import by `src/server`, `src/domain`, `src/lib`, or API routes |

---

## API_DEPENDENCY_RULE

API routes are external boundary adapters.

Write API routes must terminate at:

```txt
src/server/ledger/request-boundary.ts
```

Read API routes must terminate at:

```txt
src/server/ledger/read-derivation-boundary.ts
```

Write API routes MUST NOT import or call:

```txt
Consistency Boundary
Lifecycle Control
Balance Control
Ledger Control
Persistence Boundary
Prisma
Transfer lifecycle helpers for execution
LedgerEntry planning helpers
transaction helpers
```

Read API routes MUST NOT import or call:

```txt
Request Boundary
Authorization Control
Idempotency Control
Consistency Boundary
Lifecycle Control
Balance Control
Ledger Control
Prisma
mutation helpers
execution helpers
```

API routes may use response utilities only when routed.

API routes MUST NOT expose internal control-boundary selection through Request or Response shape.

Detailed API guidance belongs to IMP-06.

---

## SERVER_CONTROL_DEPENDENCY_RULE

Server controls must preserve routed execution flow.

| Control | Allowed role | Must not do |
|---|---|---|
| Request Boundary | receive external operation path and route to Authorization / Idempotency | mutate Balance, create LedgerEntries, open transaction |
| Authorization Control | deterministic authorization result | mutate, execute, select lifecycle state, open transaction, create alternate execution path |
| Idempotency Control | resolve Request identity before execution | open transaction, mutate Balance, create LedgerEntries, execute lifecycle, perform durable Request writes outside Consistency Boundary |
| Consistency Boundary | open/coördinate Balance-Affecting Operation transaction | expose API, own read derivation, construct external Response |
| Lifecycle Control | return lifecycle transition intent / decision | persist directly unless routed |
| Balance Control | authorize Balance Change eligibility | persist directly outside Persistence Boundary, create LedgerEntries |
| Ledger Control | authorize / create semantic LedgerEntry intent | persist directly outside Persistence Boundary, mutate Balance |
| Persistence Boundary | perform physical durable reads/writes | make business-validity decisions |
| Read Derivation Boundary | read-only derivation | mutate, authorize, execute, repair |

Authorization placement is implementation routing only.

Authorization Control MUST NOT become a new source-owned architecture boundary.

---

## DOMAIN_DEPENDENCY_RULE

Domain files must remain pure domain representation or deterministic domain logic.

Domain files MUST NOT import:

```txt
Prisma
API route files
server control files
persistence-boundary files
response utilities
test files
external systems
```

Source-reference-only files:

```txt
src/domain/entities.ts
src/domain/terms.ts
src/domain/invariant-reference.ts
```

These may expose:

- source ID constants
- source labels
- TypeScript types
- compile-time references

They MUST NOT:

- redefine source meanings
- add runtime correctness authority
- create new invariants
- create new terms
- implement business execution
- import internal project files unless routed

Transfer domain file dependencies are governed by `ALLOWED_DEPENDENCY_MATRIX`.

---

## PERSISTENCE_DEPENDENCY_RULE

Allowed direct Prisma / generated-client access:

```txt
src/server/ledger/persistence-boundary.ts
prisma/seed.ts
```

Forbidden direct Prisma / generated-client access:

```txt
src/app/*
src/server/ledger/request-boundary.ts
src/server/ledger/authorization-control.ts
src/server/ledger/idempotency-control.ts
src/server/ledger/consistency-boundary.ts
src/server/ledger/lifecycle-control.ts
src/server/ledger/balance-control.ts
src/server/ledger/ledger-control.ts
src/server/ledger/read-derivation-boundary.ts
src/domain/*
src/lib/*
```

Generated Prisma types may be used only where explicitly routed.

If a non-persistence file requires a Prisma transaction type and no routed type exists, classify as `ROUTING_GAP`.

Do not create unless IMP-INDEX routes first:

```txt
src/lib/prisma.ts
src/db/*
src/server/db/*
src/persistence/*
src/server/repositories/*
```

Persistence details belong to IMP-03.

---

## TRANSACTION_CONTEXT_RULE

Transaction context may be opened only by:

```txt
src/server/ledger/consistency-boundary.ts
```

Transaction context may be received only by routed files.

Allowed:

- `consistency-boundary.ts` may open / coordinate transaction context
- `balance-control.ts` may receive transaction context only to route approved work through `persistence-boundary.ts`
- `ledger-control.ts` may receive transaction context only to route approved work through `persistence-boundary.ts`
- `persistence-boundary.ts` may receive transaction context for physical durable writes

Forbidden:

- API routes receive/open transaction context
- Domain files receive/open transaction context
- Authorization Control receives/opens transaction context
- Idempotency Control opens transaction context
- Read routes use transaction context to execute Balance-Affecting Operations

If transaction typing requires an unrouted helper, classify as `ROUTING_GAP`.

Transaction details belong to IMP-04.

---

## READ_DERIVATION_RULE

Read Derivation Boundary exists outside Balance-Affecting Operation execution.

`read-derivation-boundary.ts` may call only:

```txt
src/server/ledger/persistence-boundary.ts
```

and only for read methods.

Read Derivation Boundary MUST NOT:

- import Request Boundary
- import Authorization Control
- import Idempotency Control
- import Consistency Boundary
- import Lifecycle Control
- import Balance Control
- import Ledger Control
- import Transfer execution helpers
- import API write routes
- import Prisma directly
- mutate Balance
- create LedgerEntries
- authorize Balance-Affecting Operations
- execute Transfer lifecycle transitions
- open write transaction context

---

## UTILITY_DEPENDENCY_RULE

Utility files must remain narrow and non-authoritative.

| File | Allowed | Forbidden |
|---|---|---|
| `src/lib/hash.ts` | standard runtime / crypto package imports needed for deterministic hashing | internal project imports, Prisma, server controls, API routes, domain execution logic, persistence writes |
| `src/lib/errors.ts` | no internal project imports | server controls, Prisma, API routes, persistence, lifecycle execution, Balance mutation, LedgerEntry creation |
| `src/lib/response.ts` | `src/lib/errors.ts` | Prisma, server controls, domain execution helpers, persistence writes, lifecycle execution, Balance mutation, LedgerEntry creation |

Utility files MUST NOT define source-owned failure classes.

Utility files may map source-owned `FAIL-*` references only when routed by IMP-07.

---

## TEST_DEPENDENCY_RULE

Verification authority remains with L10.

Concrete test implementation belongs to IMP-08.

Completion and CI gates belong to IMP-11.

Test files may import production files only to verify source-mapped behavior.

Production code MUST NOT import:

```txt
test files
fixtures
mocks
builders
test setup files
test utilities
```

Test-support files must remain outside production execution.

If a fixture, builder, mock, helper, or setup file is needed but not routed by IMP-08 or IMP-11, classify as `ROUTING_GAP`.

---

## CONFIG_DEPENDENCY_RULE

Config files must not become execution files.

Config files:

```txt
package.json
tsconfig.json
next.config.ts
jest.config.ts
docker-compose.yml
.env.example
```

Config files MUST NOT import:

```txt
server controls
domain execution logic
API routes
persistence-boundary
test fixtures unless explicitly routed
Prisma execution logic unless explicitly routed
```

Config files may reference package names, commands, environment-variable names, and framework settings only as implementation configuration.

Config files are not proof.

Compilation success is not proof.

---

## DEPENDENCY_BYPASS_RULES

The following count as dependencies and must obey the same legality rules as normal imports:

- type-only imports
- dynamic imports
- path aliases
- re-exports
- barrel exports
- dependency injection
- injected callbacks
- injected repositories
- injected services
- transaction context passing
- returned capabilities

### Type-only imports

Type-only imports are forbidden if the corresponding runtime dependency direction would be forbidden, unless explicitly routed as type-only.

### Dynamic imports

Dynamic imports MUST NOT bypass this matrix.

### Path aliases

Dependency legality is determined by resolved file path, not import spelling.

Example:

```txt
@/server/ledger/persistence-boundary
```

is still forbidden from API routes.

### Re-exports / barrel exports

Re-exports count as dependencies.

Do not create unless routed:

```txt
index.ts
barrel.ts
exports.ts
```

### Dependency injection

A file must not receive forbidden behavior as an injected callback, object, class, service, repository, adapter, or function.

Forbidden examples:

- API route receives persistence writer
- Authorization Control receives lifecycle executor
- Idempotency Control receives Balance mutator
- Persistence Boundary receives business-validity decision callback
- Read Derivation Boundary receives mutation executor

### Return-value authority smuggling

Return values MUST NOT smuggle authority across boundaries.

Allowed return values:

- decision intent
- validation result
- approved plan
- read model
- implementation error
- response DTO where routed

Forbidden return values:

- raw transaction authority to unauthorized callers
- Prisma client handles to non-persistence files
- mutation functions
- internal boundary selectors
- lifecycle override authority
- Balance mutation authority
- LedgerEntry persistence authority
- direct database write capability

---

## CIRCULAR_DEPENDENCY_RULE

Circular dependencies are forbidden across:

```txt
API routes
server controls
domain files
utility files
persistence files
test-support files
```

Forbidden cycles include:

```txt
request-boundary.ts → idempotency-control.ts → request-boundary.ts
consistency-boundary.ts → balance-control.ts → consistency-boundary.ts
ledger-control.ts → persistence-boundary.ts → ledger-control.ts
response.ts → errors.ts → response.ts
```

If a circular dependency appears necessary, classify as `ROUTING_GAP` or `GENERATION_PACKET_INCOMPLETE`.

Do not resolve circularity by creating an unrouted helper.

---

## HELPER_EXTRACTION_RULE

Do not extract helper files unless IMP-INDEX routes the helper file.

Forbidden unrouted helpers include:

```txt
src/lib/prisma.ts
src/lib/db.ts
src/lib/ledger.ts
src/server/ledger/helpers.ts
src/server/ledger/types.ts
src/domain/shared.ts
src/domain/constants.ts
src/test-utils/*
tests/helpers/*
```

If repeated logic appears during generation:

1. Keep logic inside the routed target file if boundary-safe.
2. Use an already routed utility only if allowed.
3. Stop as `ROUTING_GAP` if a new shared file is required.

Convenience is not sufficient reason to create a new dependency.

---

## IMPORT_VALIDATION_CHECKLIST

Before generating or modifying a target file, validate:

```txt
Is the target file listed in IMP-INDEX?
Is every internal import listed in the generation packet?
Is every internal import allowed by IMP-INDEX / IMP-02?
Does the import preserve L06 required control flow?
Does the import avoid exposing internal controls under L08?
Does the import avoid authorization bypass under L09?
Does the import avoid direct Prisma access outside Persistence Boundary / Prisma files?
Does the import avoid production dependency on tests?
Does the import avoid creating a new helper, barrel, wrapper, or fixture?
Does the import avoid circular dependency?
Are type-only imports still legal after resolving actual file path?
Are path aliases resolved to allowed target paths?
```

If any answer is unknown, classify as `GENERATION_PACKET_INCOMPLETE`.

If any dependency is not routed, classify as `ROUTING_GAP`.

If any dependency contradicts source authority, classify as `SOURCE_CONFLICT`.

---

## PRE_GENERATION_PACKET_REQUIREMENTS

For dependency validation, each generation packet MUST include:

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
Output mode:
Classification:
Notes:
```

Allowed dependencies MUST list exact internal project paths.

Forbidden dependencies MUST list exact files or forbidden categories.

Do not use vague dependency labels such as:

```txt
domain files
server helpers
database utilities
shared types
common code
```

unless IMP-INDEX explicitly defines that label.

---

## POST_GENERATION_DEPENDENCY_VALIDATION

After generating a target file, validate against these IMP-02 labels:

| Protocol label | Meaning |
|---|---|
| UNROUTED_IMPORT | Internal import not allowed by IMP-INDEX / IMP-02 |
| UNROUTED_FILE_CREATION | Helper, fixture, wrapper, barrel, route, config, or test file not routed |
| FORBIDDEN_BOUNDARY_IMPORT | Import crosses architectural boundary in forbidden direction |
| API_BOUNDARY_LEAK | API route imports or exposes internal execution controls |
| PERSISTENCE_BYPASS | Non-persistence file imports Prisma or performs durable writes directly |
| TRANSACTION_BYPASS | File opens, receives, or passes transaction context outside routed authority |
| AUTHORIZATION_BYPASS | Dependency lets authorization mutate, execute, select lifecycle state, or bypass constraints |
| READ_MUTATION_LEAK | Read Derivation Boundary imports mutation or execution authority |
| TEST_PRODUCTION_LEAK | Production file imports tests, fixtures, mocks, builders, or setup |
| BARREL_BYPASS | Re-export hides a forbidden dependency |
| TYPE_IMPORT_BYPASS | Type-only import violates dependency direction |
| DYNAMIC_IMPORT_BYPASS | Dynamic import hides a forbidden dependency |
| CIRCULAR_DEPENDENCY | Dependency cycle appears between routed files |
| HELPER_EXTRACTION_BYPASS | New helper extracted without routing |
| GENERATED_CLIENT_BYPASS | Generated Prisma client imported outside allowed files |
| PROOF_DEPENDENCY_ERROR | File treats logs, timestamps, compilation, runtime success, or routing as proof |

If validation fails, generated output is not acceptable as complete.

---

## PROOF_LIMITS

The following are not proof:

```txt
import compiles
dependency graph builds
file exists
routing row exists
TypeScript compiles
framework resolves path alias
dynamic import works
test imports module
API route returns once
logs show expected order
```

Proof requires:

- source rule reference
- routed implementation ownership
- dependency legality
- invalid-path rejection
- mapped TEST-* coverage
- observed passing behavior

---

## TRACEABILITY

| Section | Basis |
|---|---|
| AUTHORITY_STATUS | I00, IMP-INDEX |
| PURPOSE | IMP-INDEX, L06 |
| DEPENDS_ON | I00, L06, L08, L09, L10, IMP-INDEX, IMP-00, IMP-01 |
| AUTHORITY_ORDER | I00, IMP-INDEX |
| AUTHORITY_RESOLUTION | I00, IMP-INDEX, IMP-00 |
| PRIMARY_SOURCE_MAPPING | I00, IMP-INDEX |
| SCOPE | IMP-INDEX |
| CLASSIFICATION_RULE | IMP-00, IMP-INDEX |
| ROUTED_FILE_RULE | IMP-INDEX |
| ABSOLUTE_DEPENDENCY_PROHIBITIONS | IMP-INDEX, L06, L08, L09 |
| ALLOWED_DEPENDENCY_MATRIX | IMP-INDEX |
| FORBIDDEN_DEPENDENCY_MATRIX | IMP-INDEX, L06, L08, L09 |
| API_DEPENDENCY_RULE | L08, IMP-INDEX, IMP-06 |
| SERVER_CONTROL_DEPENDENCY_RULE | L06, L09, IMP-INDEX |
| DOMAIN_DEPENDENCY_RULE | L01, L02, IMP-INDEX |
| PERSISTENCE_DEPENDENCY_RULE | L06, L07, IMP-INDEX, IMP-03 |
| TRANSACTION_CONTEXT_RULE | L06, IMP-04, IMP-INDEX |
| READ_DERIVATION_RULE | L06, L08, IMP-INDEX |
| UTILITY_DEPENDENCY_RULE | IMP-INDEX, IMP-07 |
| TEST_DEPENDENCY_RULE | L10, IMP-08, IMP-11 |
| CONFIG_DEPENDENCY_RULE | IMP-INDEX |
| DEPENDENCY_BYPASS_RULES | IMP-INDEX, IMP-00 |
| CIRCULAR_DEPENDENCY_RULE | IMP-02 |
| HELPER_EXTRACTION_RULE | IMP-INDEX |
| PRE_GENERATION_PACKET_REQUIREMENTS | IMP-00, IMP-INDEX |
| POST_GENERATION_DEPENDENCY_VALIDATION | IMP-00, IMP-INDEX |
| PROOF_LIMITS | L10, IMP-00 |

---

## VALIDITY_CONDITIONS

This file is VALID if it:

- remains non-authoritative implementation guidance
- preserves L00–L10 as correctness authority
- preserves I00 as source lookup and traceability authority
- preserves IMP-INDEX as implementation routing authority
- does not define source-owned IDs
- does not define new architectural boundaries
- does not define new correctness rules
- does not permit unrouted internal imports
- does not permit unrouted file creation
- preserves Request Boundary write entry
- preserves Read Derivation Boundary read entry
- preserves Idempotency Control before execution
- preserves Consistency Boundary transaction coordination
- preserves Balance Control authority over Balance Change authorization
- preserves Ledger Control authority over semantic LedgerEntry creation
- preserves Persistence Boundary authority over physical durable writes
- prevents API routes from importing internal execution controls directly
- prevents direct Prisma access outside routed persistence files
- prevents production code from importing tests or fixtures
- prevents dependency injection from bypassing routing
- routes dependency proof back to TEST-* coverage

This file is INVALID if it:

- defines correctness authority
- defines source-owned IDs
- overrides L00–L10
- overrides I00
- overrides IMP-INDEX routing
- permits hidden dependencies
- permits direct mutation paths
- permits direct LedgerEntry creation paths
- permits lifecycle override paths
- permits API exposure of internal control boundaries
- permits Persistence Boundary to make business-validity decisions
- permits Read Derivation Boundary to mutate or authorize
- permits production imports from tests
- permits unrouted helper creation
- treats dependency routing as proof
- treats successful compilation as proof

---

## CLASSIFICATION

**SOURCE_FACT:**

- L00–L10 are correctness authority.
- I00 is source indexing and traceability authority.
- IMP-INDEX is implementation/codegen routing authority.
- L06 defines architectural control boundaries and required control flow.
- L08 restricts API exposure of internal control boundaries.
- L09 restricts authorization from mutating, executing, selecting lifecycle state, or bypassing constraints.
- L10 owns verification authority.
- IMP files are non-authoritative implementation guidance.

**INFERENCE:**

- Dependency direction is necessary to preserve L06 control flow in implementation.
- Import restrictions reduce architectural bypass risk.
- Treating type-only imports and dynamic imports as dependencies prevents hidden coupling.
- Preventing unrouted helpers reduces AI-generated boundary drift.
- Collapsing dependency bypass variants into one section improves AI-followability without weakening the rule.

**ASSUMPTION:**

- MVP uses the file set routed by IMP-INDEX and summarized by IMP-01.
- Prisma direct access is routed only through `src/server/ledger/persistence-boundary.ts` and `prisma/seed.ts`.
- No separate Prisma client helper, repository folder, fixture helper, or barrel export is routed for MVP.

These assumptions are implementation guidance only.

They MUST NOT define source correctness.

**IMPLEMENTATION_GUIDANCE_ONLY:**

- import/call matrix
- forbidden dependency examples
- helper extraction handling
- path alias handling
- dynamic import handling
- dependency injection handling
- return-value boundary handling
- post-generation dependency labels

**SOURCE_GAP:**

- No blocking SOURCE_GAP is identified within this IMP-02 document.

**SOURCE_CONFLICT:**

- No blocking SOURCE_CONFLICT is identified within this IMP-02 document.

---

## LOCK_STATUS

READY_FOR_USE only if:

- filename matches the IMP-INDEX registry entry for IMP-02
- IMP-INDEX defines `TARGET_FILE_ROUTING_MATRIX`
- IMP-INDEX defines `VERIFICATION_FILE_ROUTING_MATRIX`
- IMP-INDEX defines `IMPLEMENTATION_DOCUMENT_REGISTRY`
- I00 indexes all source-owned IDs used by routed targets
- L06 defines ARCH-001 through ARCH-009
- L08 defines API boundary restrictions
- L09 defines AUTHZ boundary restrictions
- L10 defines TEST-001 through TEST-012
- IMP-00 defines global generation protocol
- IMP-01 defines the MVP file manifest
- IMP-03 defines persistence guidance
- IMP-04 defines transaction guidance
- IMP-05 defines Transfer guidance
- IMP-06 defines API guidance
- IMP-07 defines error guidance
- IMP-08 defines TEST-* matrix
- IMP-11 defines done/CI gates
- every allowed dependency listed here is compatible with IMP-INDEX
- every forbidden dependency listed here is compatible with L06, L08, L09, and IMP-INDEX
- generated implementation treats unrouted imports as ROUTING_GAP
- generated implementation remains subordinate to L00–L10, I00, and IMP-INDEX

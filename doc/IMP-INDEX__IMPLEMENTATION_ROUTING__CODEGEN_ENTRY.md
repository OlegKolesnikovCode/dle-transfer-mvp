# IMP-INDEX__IMPLEMENTATION_ROUTING__CODEGEN_ENTRY.md

## AUTHORITY_STATUS

NON_AUTHORITATIVE_IMPLEMENTATION_ROUTING_INDEX

This file:
- indexes implementation-generation routes
- maps target files to source authority files
- maps target files to IMP guidance files
- maps target files to owning architectural boundaries
- maps target files to proof tests
- constrains AI code-generation behavior

This file does NOT:
- define correctness rules
- define invariants
- define failure classes
- define lifecycle rules
- define schema rules
- define API rules
- define authorization rules
- define verification requirements
- override I00
- override L00–L10

**Authority resolution:**
| Conflict | Winner |
|---|---|
| IMP-INDEX conflicts with L00–L10 | L00–L10 win for correctness |
| IMP-INDEX conflicts with I00 | I00 wins for indexing / lookup / traceability metadata |
| IMP-INDEX conflicts with IMP-00–IMP-11 on target-file routing, file ownership, required source IDs, dependency allowance, or generation-packet shape | IMP-INDEX wins unless L00–L10 or I00 are violated |
| IMP-INDEX conflicts with target-specific IMP file on file-internal implementation guidance | Target-specific IMP file wins unless IMP-INDEX routing, I00, or L00–L10 are violated |
| Generated code conflicts with any source document | Source document wins |

---

## SOURCE_AUTHORITY_ORDER

Correctness authority:

```txt
L00 → L01 → L02 → L03 → L04 → L05 → L06 → L07 → L08 → L09 → L10
```

Indexing authority:
`I00__INDEXING_AUTHORITY__TRACEABILITY__GLOBAL.md`

Implementation routing:
`IMP-INDEX__IMPLEMENTATION_ROUTING__CODEGEN_ENTRY.md`

Implementation guidance:
`IMP-00 → IMP-11`

IMP IDs are canonical shorthand for implementation guidance files.
Full filenames are defined in `IMPLEMENTATION_DOCUMENT_REGISTRY`.

Generated implementation:
`src/*, prisma/*, tests/*, config files`

---

## SOURCE_REFERENCE_RULE

**All source-owned rule references MUST use full IDs.** Do not abbreviate repeated prefixes. Use `API-012, API-013`, not `API-012, 013`.

Source document references MAY use layer names or full filenames, such as `L00`, `L06`, `L10`, or `I00__INDEXING_AUTHORITY__TRACEABILITY__GLOBAL.md`.

L00 may be referenced as `L00`, `L00 CORE RULES`, `L00 INVALID CONDITIONS`, `L00 SYSTEM BOUNDARY`, or `L00 IDENTITY REQUIREMENT` because L00 does not define a source-owned symbol prefix in I00.

When referencing a source-owned rule, use the full source ID:
`ENT-*`, `TERM-*`, `INV-*`, `FAIL-*`, `FSM-*`, `ARCH-*`, `SCHEMA-*`, `API-*`, `AUTHZ-*`, `TEST-*`.

Range notation such as `FSM-001 through FSM-010`, `SCHEMA-001 through SCHEMA-013`, or `TEST-001 through TEST-012` means every full ID in the inclusive range. Do not use ellipsis range notation such as `TEST-001...TEST-012`.

Implementation guidance references belong to IMP-* files and are non-authoritative.
Do not treat implementation guidance labels, notes, or file names as source-owned IDs.

Do not restate source rules unless needed to disambiguate implementation.
Do not convert source references into new IMP-owned correctness rules.

---

## GLOBAL_GENERATION_PROTOCOL

For any code-generation request, load only the minimum required packet:
1. Target file route from this IMP-INDEX.
2. Relevant L-source files resolved from the target file’s source references through I00.
3. I00 for source ID lookup.
4. IMP-00 for global code-generation protocol, resolved through `IMPLEMENTATION_DOCUMENT_REGISTRY`.
5. IMP-01 for file manifest, resolved through `IMPLEMENTATION_DOCUMENT_REGISTRY`.
6. IMP-02 for dependency rules, resolved through `IMPLEMENTATION_DOCUMENT_REGISTRY`.
7. Target-specific IMP files, resolved through `IMPLEMENTATION_DOCUMENT_REGISTRY`.
8. Current dependency files imported by the target file.

**Generation constraints:**
- Generate one target file unless explicitly instructed otherwise.
- Do not modify L00–L10 or I00.
- Do not treat IMP files as correctness authority.
- Resolve IMP IDs to full filenames through `IMPLEMENTATION_DOCUMENT_REGISTRY` before opening or generating from them.
- Do not add unsupported Balance-Affecting Operations.
- Do not collapse architectural boundaries.
- **Generated files MUST NOT import unrouted internal project files.** Framework, runtime, package, and generated-client imports are allowed only when required by the routed target file. Treat unrouted internal project imports as `ROUTING_GAP`.
- Do not use JavaScript `number` for balance-affecting arithmetic.
- Do not generate direct Balance mutation APIs.
- Do not generate direct LedgerEntry creation APIs.
- Do not generate lifecycle override APIs.
- **Do not use timestamps as replay authority, ordering authority, idempotency authority, or proof of correctness.**

---

## ROUTING_IS_NOT_PROOF

A routing row does not prove correctness coverage.
A generated file is valid only if:
- it implements source-owned requirements referenced by IDs.
- it respects the owning architectural boundary.
- it follows allowed dependency direction.
- it is covered by mapped TEST files with observed passing behavior.

**Do not treat as proof:**
- routing tables
- IMP guidance
- generated code
- logs
- timestamps
- database choice
- absence of runtime error
- successful compilation without tests

Proof requires: source rule reference, implementation ownership, invalid-path rejection, TEST coverage, and observed passing behavior.

---

## IMPLEMENTATION_DOCUMENT_REGISTRY

| IMP ID | Filename | Role | Must reference |
|---|---|---|---|
| IMP-00 | IMP-00__GLOBAL_CODEGEN_PROTOCOL.md | Global AI/code-generation protocol | L00, I00 |
| IMP-01 | IMP-01__FILE_MANIFEST__MVP_STRUCTURE.md | MVP folders/files and file responsibilities | L01, L06, L07, L08, L10, I00 |
| IMP-02 | IMP-02__DEPENDENCY_RULES__BOUNDARY_IMPORTS.md | Import/call-direction restrictions | L06, L08, L09, L10, I00 |
| IMP-03 | IMP-03__PERSISTENCE_RULES__PRISMA_SCHEMA.md | Prisma schema and persistence rules | L01, L03, L05, L07, L10, I00 |
| IMP-04 | IMP-04__TRANSACTION_RULES__CONSISTENCY_BOUNDARY.md | Transaction and Consistency Boundary guidance | L03, L04, L05, L06, L07, L10, I00 |
| IMP-05 | IMP-05__TRANSFER_OPERATION__MVP_ONLY.md | Transfer-only operation guidance | L01, L02, L03, L04, L05, L10, I00 |
| IMP-06 | IMP-06__API_RULES__ROUTES_RESPONSES.md | API routes and Response shape | L06, L08, L09, L10, I00 |
| IMP-07 | IMP-07__FAILURE_MAPPING__LEDGER_ERRORS.md | LedgerError and FAIL-* mapping | L04, L05, L08, L10, I00 |
| IMP-08 | IMP-08__VERIFICATION_MATRIX__TEST_001_TO_012.md | Verification matrix (TEST-001 to TEST-012) | L03, L04, L05, L06, L07, L08, L09, L10, I00 |
| IMP-09 | IMP-09__BUILD_ORDER__PROOF_MILESTONES.md | Build order by guarantees proven | L00, L03, L04, L10, I00 |
| IMP-10 | IMP-10__OBSERVABILITY__AUDIT_TRACE.md | Audit/logging guidance | L03, L04, L06, L08, L10, I00 |
| IMP-11 | IMP-11__DONE_CRITERIA__CI_AND_PROOF.md | Completion gates and CI proof requirements | L10, I00 |

IMP IDs are canonical shorthand inside routing matrices.
Full filenames are defined only in this registry.
When generating or opening an implementation guidance file, resolve the IMP ID through this registry before use.

**NOTE:** IMP-* files are non-authoritative and MUST NOT be treated as source authority.

---

## MVP_OPERATION_SCOPE

**Allowed Balance-Affecting Operation:**
| Operation | Source references |
|---|---|
| Transfer | ENT-004, TERM-008, TERM-007, FSM-001, FSM-002, FSM-005, FSM-008, INV-001, INV-004, INV-007, INV-008, INV-010 |

**Forbidden generation:**
| Forbidden generation | Source references |
|---|---|
| New Balance-Affecting Operation | L00 SYSTEM BOUNDARY, TERM-007, FSM-009, SCHEMA-001 |
| Direct Balance mutation operation | INV-001, INV-003, INV-004, ARCH-005, API-009, AUTHZ-007 |
| Direct LedgerEntry creation API | INV-002, INV-010, ARCH-006, API-010, AUTHZ-008 |
| External settlement / distributed correctness | TERM-001, TERM-002, INV-009, FAIL-009, API-013, AUTHZ-009 |

---

## ARCHITECTURAL_BOUNDARY_OWNERSHIP

| Boundary | Source ID | Owns | Must not own |
|---|---|---|---|
| Request Boundary | ARCH-001 | External Request entry; implementation-routed call to AUTHZ-* evaluation | Balance Change, LedgerEntry creation, lifecycle execution |
| Idempotency Control | ARCH-002 | Request identity resolution before execution | Balance mutation, LedgerEntry creation |
| Consistency Boundary | ARCH-003 | Atomic execution boundary; opens transaction context | External API contract, read-only derivation |
| Lifecycle Control | ARCH-004 | Transfer lifecycle transition authority/intent | Durable state storage, API route exposure |
| Balance Control | ARCH-005 | Balance Change **eligibility/internal authority** | Durable state storage, API route exposure |
| Ledger Control | ARCH-006 | LedgerEntry creation **authority** | Durable state storage, API route exposure |
| Persistence Boundary | ARCH-007 | Durable system state storage (Database writes) | Business decision authority |
| Read Derivation Boundary | ARCH-008 | Derived read state | Mutation, authorization, execution |
| Required Control Flow | ARCH-009 | Request → Idempotency → Consistency → Controls → Persistence → Read Derivation | Bypass paths |

---

## IMPLEMENTATION_ADJUNCT_RULE

Implementation labels such as Request Boundary Adjunct are routing labels only. They are not source-owned ARCH-* boundaries and MUST NOT be treated as new architectural components.

Authorization-control is an implementation placement for AUTHZ-* evaluation only. It MUST NOT define architectural control flow, open transactions, mutate state, create LedgerEntries, authorize Balance Changes, or select lifecycle state.

Authorization-control MUST NOT create an alternate execution path. For authorized Requests, the required Balance-Affecting Operation flow remains Request Boundary → Idempotency Control → Consistency Boundary. For unauthorized Requests, no Balance-Affecting Operation execution begins.

---

## TARGET_FILE_ROUTING_MATRIX

| Target file | Boundary owner | Required source references | Required IMP files | Proof tests | Verification Mode |
|---|---|---|---|---|---|
| package.json | Project setup | L00, INV-009, TEST-009 | IMP-00, IMP-01, IMP-09 | TEST-009 | Static/Build gate |
| tsconfig.json | Project setup | L00, ARCH-009 | IMP-00, IMP-01, IMP-02 | TEST-009, TEST-011 | Static/Build gate |
| next.config.ts | Project setup | API-012, API-013, INV-009 | IMP-00, IMP-01, IMP-06 | TEST-009, TEST-011 | Static/Build gate |
| .env.example | Project setup | SCHEMA-013, API-013, INV-009 | IMP-00, IMP-01, IMP-03, IMP-11 | TEST-009 | Static/Build gate |
| docker-compose.yml | Project setup | SCHEMA-013, INV-009 | IMP-00, IMP-01, IMP-03, IMP-09 | TEST-009 | Static/Build gate |
| jest.config.ts | Verification setup | L10, TEST-001 through TEST-012 | IMP-00, IMP-08, IMP-11 | TEST-001 through TEST-012 | Static/Build gate |
| prisma/schema.prisma | Persistence Boundary | ENT-001, ENT-002, ENT-003, ENT-004, ENT-005, ENT-006, FSM-001, SCHEMA-001 through SCHEMA-013 | IMP-00, IMP-01, IMP-03 | TEST-001 through TEST-010 | Static/Build gate |
| prisma/seed.ts | Persistence Boundary | ENT-001, ENT-002, ENT-003, ENT-006, SCHEMA-001, SCHEMA-002, SCHEMA-003, SCHEMA-013 | IMP-00, IMP-03, IMP-08 | TEST-003, TEST-005, TEST-006, TEST-009 | Indirect coverage |
| src/domain/entities.ts | Domain | ENT-001, ENT-002, ENT-003, ENT-004, ENT-005, ENT-006, TERM-003 through TERM-010 | IMP-00, IMP-01 | TEST-001, TEST-003, TEST-010 | Source routing only |
| src/domain/terms.ts | Domain | TERM-001 through TERM-018 | IMP-00, IMP-01 | TEST-011 | Source routing only |
| src/domain/invariant-reference.ts | Domain | INV-001 through INV-010 | IMP-00, IMP-08 | TEST-001 through TEST-010 | Source routing only |
| src/domain/operations/transfer/transfer.types.ts | Transfer Domain | ENT-001, ENT-003, ENT-004, FSM-001, SCHEMA-007 | IMP-00, IMP-01, IMP-05 | TEST-006, TEST-008 | Source routing only |
| src/domain/operations/transfer/transfer.lifecycle.ts | Transfer Domain | FSM-001 through FSM-010, INV-008 | IMP-00, IMP-05, IMP-07 | TEST-008 | Direct behavioral |
| src/domain/operations/transfer/transfer.validation.ts | Transfer Domain | ENT-001, ENT-003, ENT-004, TERM-008, INV-005, INV-006, FAIL-005, FAIL-006 | IMP-00, IMP-05, IMP-07 | TEST-005, TEST-006 | Direct behavioral |
| src/domain/operations/transfer/transfer.ledger-entry-plan.ts | Transfer Domain | ENT-005, TERM-009, INV-001, INV-006, INV-010, FAIL-001, FAIL-006, FAIL-010 | IMP-00, IMP-02, IMP-05, IMP-07 | TEST-001, TEST-006, TEST-010 | Direct behavioral |
| src/server/ledger/request-boundary.ts | Request Boundary | ARCH-001, ARCH-009, TERM-010, API-001, API-002, API-003, API-004, API-007, API-008, API-009, API-010, API-012 | IMP-00, IMP-02, IMP-06, IMP-07 | TEST-007, TEST-008, TEST-011, TEST-012 | Direct behavioral |
| src/server/ledger/authorization-control.ts | Request Boundary Adjunct | AUTHZ-001 through AUTHZ-012, ARCH-009 | IMP-00, IMP-02, IMP-06, IMP-07 | TEST-007, TEST-008, TEST-012 | Direct behavioral |
| src/server/ledger/idempotency-control.ts | Idempotency Control | ARCH-002, ARCH-009, INV-007, FAIL-007, FSM-007, SCHEMA-009, SCHEMA-010, API-002, API-003, API-006, API-008, AUTHZ-003, AUTHZ-005 | IMP-00, IMP-02, IMP-04, IMP-07 | TEST-007 | Direct behavioral |
| src/server/ledger/consistency-boundary.ts | Consistency Boundary | ARCH-003, ARCH-009, INV-004, INV-009, FAIL-004, FAIL-009, FSM-005, SCHEMA-011, SCHEMA-013, API-012, API-013, AUTHZ-009, AUTHZ-010 | IMP-00, IMP-02, IMP-04, IMP-07 | TEST-004, TEST-007, TEST-009, TEST-010 | Direct behavioral |
| src/server/ledger/lifecycle-control.ts | Lifecycle Control | ARCH-004, ARCH-009, INV-008, FAIL-008, FSM-001 through FSM-010, API-007, AUTHZ-006, AUTHZ-011 | IMP-00, IMP-02, IMP-05, IMP-07 | TEST-008 | Direct behavioral |
| src/server/ledger/balance-control.ts | Balance Control | ARCH-005, ARCH-009, INV-001, INV-005, INV-006, FAIL-001, FAIL-005, FAIL-006, SCHEMA-003, SCHEMA-012, API-009, API-011, AUTHZ-007 | IMP-00, IMP-02, IMP-04, IMP-05 | TEST-001, TEST-005, TEST-006 | Direct behavioral |
| src/server/ledger/ledger-control.ts | Ledger Control | ARCH-006, ARCH-009, INV-001, INV-002, INV-010, FAIL-001, FAIL-002, FAIL-010, FSM-008, SCHEMA-005, SCHEMA-006, API-010, AUTHZ-008 | IMP-00, IMP-02, IMP-05, IMP-07 | TEST-001, TEST-002, TEST-010 | Direct behavioral |
| src/server/ledger/persistence-boundary.ts | Persistence Boundary | ARCH-007, ARCH-009, INV-003, INV-009, SCHEMA-001 through SCHEMA-013 | IMP-00, IMP-02, IMP-03, IMP-04 | TEST-003, TEST-004, TEST-007, TEST-009, TEST-010 | Direct behavioral |
| src/server/ledger/read-derivation-boundary.ts | Read Derivation Boundary | ARCH-008, ARCH-009, INV-001, INV-003, API-005 | IMP-00, IMP-02, IMP-03, IMP-08 | TEST-001, TEST-003, TEST-011 | Direct behavioral |
| src/app/api/transfers/route.ts | Write API Request Boundary | ARCH-001, ARCH-009, API-001 through API-013, AUTHZ-001 through AUTHZ-012 | IMP-00, IMP-02, IMP-06, IMP-07 | TEST-007, TEST-008, TEST-011, TEST-012 | Direct behavioral |
| src/app/api/transfers/[transferId]/route.ts | Read API Boundary | ARCH-008, API-004, API-005, API-011, API-012, API-013 | IMP-00, IMP-02, IMP-06 | TEST-011 | Direct behavioral |
| src/app/api/transfers/[transferId]/ledger-entries/route.ts | Read API Boundary | ARCH-008, API-005, API-010, API-011, API-012, API-013, INV-001, INV-002, INV-010 | IMP-00, IMP-02, IMP-06 | TEST-001, TEST-002, TEST-010, TEST-011 | Direct behavioral |
| src/app/api/accounts/[accountId]/balances/route.ts | Read API Boundary | ARCH-008, API-005, API-009, API-011, API-012, API-013, INV-003, INV-005, INV-006, SCHEMA-003, SCHEMA-004 | IMP-00, IMP-02, IMP-06 | TEST-003, TEST-005, TEST-006, TEST-011 | Direct behavioral |
| src/lib/hash.ts | Utility | INV-007, SCHEMA-009, SCHEMA-010, API-002, API-003, API-006 | IMP-00, IMP-04, IMP-07 | TEST-007 | Static/Build gate |
| src/lib/errors.ts | Utility | FAIL-001 through FAIL-010, API-004, API-006 | IMP-00, IMP-07 | TEST-001 through TEST-012 | Static/Build gate |
| src/lib/response.ts | API response utility | API-004, API-005, API-006, API-011, API-012, FAIL-001 through FAIL-010 | IMP-00, IMP-06, IMP-07 | TEST-007, TEST-011 | Static/Build gate |

*If a production, config, domain, server, API, library, Prisma, or setup target file is not listed in TARGET_FILE_ROUTING_MATRIX, treat as ROUTING_GAP. Test files are routed separately in VERIFICATION_FILE_ROUTING_MATRIX.*

Test-support files may be generated only if routed by IMP-08 or IMP-11.
IMP IDs MUST be resolved through `IMPLEMENTATION_DOCUMENT_REGISTRY` before opening the corresponding guidance file.
Test-support files MUST NOT be imported by production code.
If a test fixture, builder, mock, or helper is needed, it must remain under test support and must not become part of `src/server`, `src/domain`, or `src/lib` production execution.

---

## SOURCE_REFERENCE_ONLY_FILE_RESTRICTION

The following files are source-reference-only unless their routed IMP file explicitly allows behavior:

- `src/domain/terms.ts`
- `src/domain/invariant-reference.ts`
- `src/domain/entities.ts`

These files MAY expose source ID constants, labels, TypeScript types, or compile-time references.

These files MUST NOT:
- redefine source meanings
- add runtime correctness authority
- create new invariants
- create new terms
- treat implementation constants as source authority

---

## LEDGER_ENTRY_PLAN_RESTRICTION

Target file: `src/domain/operations/transfer/transfer.ledger-entry-plan.ts`

**Allowed:** Pure calculation, deterministic construction of non-persistent LedgerEntry intent, no side effects.

**Forbidden:** Prisma, persistence calls, transaction calls, mutation, external APIs, timestamp-as-authority.

**Authority Clarification:**
- **Ledger Control (`ledger-control.ts`)** owns semantic LedgerEntry creation authority: it decides whether LedgerEntries may be created and constructs/approves the LedgerEntry creation intent.
- **Persistence Boundary (`persistence-boundary.ts`)** owns physical durable write execution only: it persists the LedgerEntry creation intent inside the transaction context.
- Persistence Boundary MUST NOT decide whether a LedgerEntry is valid, required, authorized, or complete.

---

## ALLOWED_DEPENDENCY_DIRECTION

| From | May call (Internal Project Routes) |
|---|---|
| **Write API route (POST)** | `src/server/ledger/request-boundary.ts`, `src/lib/response.ts`, `src/lib/errors.ts` |
| **Read API routes (GET)** | `src/server/ledger/read-derivation-boundary.ts`, `src/lib/response.ts` |
| `request-boundary.ts` | `authorization-control.ts`, `idempotency-control.ts`, `src/domain/operations/transfer/transfer.validation.ts`, `src/lib/response.ts`, `src/lib/errors.ts` |
| `authorization-control.ts` | No internal project imports unless the helper file is explicitly routed in TARGET_FILE_ROUTING_MATRIX. For MVP, authorization logic remains inside `authorization-control.ts`. |
| `idempotency-control.ts` | `consistency-boundary.ts`; may call `persistence-boundary.ts` for read-only Request identity/outcome lookup only. Durable Request reservation and outcome writes MUST be coordinated by `consistency-boundary.ts` and written through `persistence-boundary.ts` inside transaction context. |
| `consistency-boundary.ts` | `lifecycle-control.ts`, `balance-control.ts`, `ledger-control.ts`, `persistence-boundary.ts` |
| `lifecycle-control.ts` | `src/domain/operations/transfer/transfer.lifecycle.ts` only (Returns transition intent/decision) |
| `balance-control.ts` | `src/domain/operations/transfer/transfer.validation.ts`, `persistence-boundary.ts` (within transaction context) |
| `ledger-control.ts` | `src/domain/operations/transfer/transfer.ledger-entry-plan.ts`, `persistence-boundary.ts` (within transaction context) |
| `persistence-boundary.ts` | Prisma client / generated Prisma types only. For MVP, Prisma access is owned inside `persistence-boundary.ts`. Do not create or import `src/lib/prisma.ts` unless that file is explicitly routed in TARGET_FILE_ROUTING_MATRIX. |
| `read-derivation-boundary.ts` | `persistence-boundary.ts` read methods only |
| `src/domain/entities.ts` | No internal project imports |
| `src/domain/terms.ts` | No internal project imports |
| `src/domain/invariant-reference.ts` | No internal project imports |
| `src/domain/operations/transfer/transfer.types.ts` | `src/domain/entities.ts`, `src/domain/terms.ts` |
| `src/domain/operations/transfer/transfer.lifecycle.ts` | `src/domain/operations/transfer/transfer.types.ts` |
| `src/domain/operations/transfer/transfer.validation.ts` | `src/domain/operations/transfer/transfer.types.ts`, `src/domain/entities.ts`, `src/domain/terms.ts` |
| `src/domain/operations/transfer/transfer.ledger-entry-plan.ts` | `src/domain/operations/transfer/transfer.types.ts`, `src/domain/entities.ts`, `src/domain/terms.ts` |
| `src/lib/hash.ts` | No internal project imports |
| `src/lib/errors.ts` | No internal project imports |
| `src/lib/response.ts` | `src/lib/errors.ts` |

Authorization placement is implementation routing, not source-defined architecture. Regardless of placement, authorization MUST remain deterministic, non-mutating, and unable to bypass Idempotency Control, Lifecycle Control, Balance Control, Ledger Control, or Persistence Boundary.

---

## FORBIDDEN_DEPENDENCY_DIRECTION

| File / layer | Must never call |
|---|---|
| **Write API routes** | Prisma directly, `consistency-boundary.ts`, `balance-control.ts`, `ledger-control.ts`, `persistence-boundary.ts` |
| **Read API routes** | `request-boundary.ts`, `consistency-boundary.ts`, `balance-control.ts`, `ledger-control.ts`, Prisma directly |
| `authorization-control.ts` | Mutation, LedgerEntry creation, lifecycle state mutation, transaction opening |
| `idempotency-control.ts` | Balance mutation, LedgerEntry creation, lifecycle state mutation, transaction opening, durable Request reservation writes outside Consistency Boundary, durable Request outcome writes outside Consistency Boundary |
| `lifecycle-control.ts` | `persistence-boundary.ts` directly, Prisma directly, transaction opening |
| `balance-control.ts` | Direct database writes outside `persistence-boundary.ts` |
| `ledger-control.ts` | Direct database writes outside `persistence-boundary.ts` |
| `persistence-boundary.ts` | Business decision logic, API response construction |

Lifecycle Control returns transition intent/decision only.
`lifecycle-control.ts` MUST NOT persist Transfer lifecycle state directly.
`consistency-boundary.ts` coordinates the transaction and routes any Transfer lifecycle-state persistence through `persistence-boundary.ts`.

---

## REQUIRED_GENERATION_PACKET

Every code-generation request MUST include:
- **Target file path**
- **List of exact source references implemented or preserved**: source-owned IDs must use full IDs; document-level references may use `L00`–`L10` or full filenames
- **Boundary owner** (`ARCH-*`, or `Project setup`, `Domain`, `Transfer Domain`, `Utility`, or `Verification setup` for non-boundary files)
- **Relevant IMP IDs** resolved through `IMPLEMENTATION_DOCUMENT_REGISTRY`
- **Allowed dependencies** (full paths in the generation packet; short filenames may be used in routing tables only when unambiguous)
- **Forbidden dependencies** (Layer/Category)
- **Mutation authority** (Authorize vs. Write)
- **Transaction authority** (Open vs. Receive)
- **Persistence authority**
- **LedgerEntry authority**
- **Balance authority**
- **API exposure** (Write Route vs. Read Route vs. Internal)
- **Proof tests** (TEST-* IDs)
- **Task**: generate only the target file
- **Output**: complete file content only

---

## VERIFICATION_FILE_ROUTING_MATRIX

| Test file | Required source IDs | Required IMP files |
|---|---|---|
| TEST-001-traceability.test.ts | INV-001, FAIL-001, ARCH-005, ARCH-006, SCHEMA-004, SCHEMA-005, SCHEMA-006, API-009, API-010, AUTHZ-007, AUTHZ-008, TEST-001 | IMP-00, IMP-08, IMP-11 |
| TEST-002-ledger-immutability.test.ts | INV-002, FAIL-002, FSM-008, ARCH-006, SCHEMA-005, SCHEMA-006, API-010, AUTHZ-008, TEST-002 | IMP-00, IMP-08, IMP-11 |
| TEST-003-replay-determinism.test.ts | INV-003, FAIL-003, ARCH-007, ARCH-008, SCHEMA-004, SCHEMA-006, SCHEMA-010, API-005, API-006, AUTHZ-004, TEST-003 | IMP-00, IMP-08, IMP-11 |
| TEST-004-atomicity.test.ts | INV-004, FAIL-004, FSM-005, ARCH-003, SCHEMA-011, API-012, AUTHZ-010, TEST-004 | IMP-00, IMP-08, IMP-11 |
| TEST-005-balance-constraint.test.ts | INV-005, FAIL-005, ARCH-005, SCHEMA-003, TEST-005 | IMP-00, IMP-08, IMP-11 |
| TEST-006-asset-consistency.test.ts | INV-006, FAIL-006, ARCH-005, SCHEMA-003, SCHEMA-005, SCHEMA-007, SCHEMA-012, API-011, TEST-006 | IMP-00, IMP-08, IMP-11 |
| TEST-007-idempotency.test.ts | INV-007, FAIL-007, FSM-007, ARCH-002, SCHEMA-009, SCHEMA-010, API-002, API-003, API-006, API-008, AUTHZ-003, AUTHZ-005, TEST-007 | IMP-00, IMP-08, IMP-11 |
| TEST-008-lifecycle.test.ts | INV-008, FAIL-008, FSM-001 through FSM-010, ARCH-004, SCHEMA-008, API-007, AUTHZ-006, AUTHZ-011, TEST-008 | IMP-00, IMP-08, IMP-11 |
| TEST-009-bounded-consistency.test.ts | INV-009, FAIL-009, ARCH-003, SCHEMA-013, API-013, AUTHZ-009, TEST-009 | IMP-00, IMP-08, IMP-11 |
| TEST-010-operation-completeness.test.ts | INV-010, FAIL-010, FSM-005, FSM-008, ARCH-006, SCHEMA-005, SCHEMA-011, API-001, AUTHZ-010, TEST-010 | IMP-00, IMP-08, IMP-11 |
| TEST-011-api-boundary.test.ts | API-001 through API-013, TEST-011 | IMP-00, IMP-08, IMP-11 |
| TEST-012-authorization.test.ts | AUTHZ-001 through AUTHZ-012, TEST-012 | IMP-00, IMP-08, IMP-11 |

---

## FINAL_GENERATION_GATE

**Before generation, list the exact source references this file implements or preserves. Source-owned rule references MUST use full IDs. Document-level references MAY use `L00`–`L10` or full filenames.**

**Transaction authority:**
- `consistency-boundary.ts` may open/coordinate the transaction context.
- Lifecycle, Balance, and Ledger controls + `persistence-boundary.ts` may receive transaction context.
- API routes, domain files, and read routes MUST NOT open transactions.

**Mutation/Persistence:**
- `balance-control.ts` owns Balance Change authorization.
- `ledger-control.ts` owns semantic LedgerEntry creation authority.
- `persistence-boundary.ts` performs physical durable writes only and MUST NOT make business-validity decisions.
- `idempotency-control.ts` MUST NOT perform durable Request writes outside the Consistency Boundary. Request reservation and persisted outcome writes MUST be coordinated by `consistency-boundary.ts` and written through `persistence-boundary.ts` inside transaction context.

**API:**
- Write routes (POST) go to `request-boundary.ts`.
- Read routes (GET) go to `read-derivation-boundary.ts`.

---

## FINAL_VALIDITY_CONDITIONS

This IMP-INDEX is valid if:
- it remains non-authoritative.
- it references source-owned rule IDs using full IDs instead of redefining source rules.
- it maps every target file to an owner, source references, IMP guidance, and proof tests.
- it preserves one-file-at-a-time generation.
- it does not introduce new operation scope.
- it does not authorize boundary bypass.
- it does not treat routing as proof.

Invalid if:
- it redefines L00–L10 meanings.
- it routes generation without source IDs or proof tests.
- it permits direct mutation APIs via any path.
- it treats generated code, logs, or compilation success as source authority.

## LOCK_STATUS

This IMP-INDEX is ready for use only if:
- all Markdown tables render correctly.
- all target files to be generated are listed in TARGET_FILE_ROUTING_MATRIX.
- all IMP IDs used in routing matrices resolve to filenames in IMPLEMENTATION_DOCUMENT_REGISTRY.
- all source IDs used in routing matrices exist in I00 and resolve to their owning L-source files.
- all TEST files are routed either by TARGET_FILE_ROUTING_MATRIX or VERIFICATION_FILE_ROUTING_MATRIX, with no ambiguous ROUTING_GAP classification.
- all internal project imports are either routed target files or explicitly allowed framework/runtime/package/generated-client imports.
- any newly required file is treated as ROUTING_GAP until explicitly routed.
- implementation-adjunct labels are not treated as new ARCH-* boundaries.
- source-reference-only files do not redefine source meanings or create implementation-owned correctness rules.
- Prisma access remains routed through `persistence-boundary.ts` unless a separate Prisma client file is explicitly routed.
- authorization placement is treated as implementation routing only, not source-defined architecture.

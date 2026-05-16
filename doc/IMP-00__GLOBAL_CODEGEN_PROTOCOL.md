# IMP-00__GLOBAL_CODEGEN_PROTOCOL.md

## AUTHORITY_STATUS

NON_AUTHORITATIVE_IMPLEMENTATION_GUIDANCE

This file defines the global AI/code-generation protocol for DLE-2.

This file constrains generator behavior.

This file does not define business correctness.

Correctness authority is owned exclusively by L00–L10.

This file MUST NOT:

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

---

## PURPOSE

Prevent AI-generated implementation drift by enforcing:

- routed source authority
- mandatory generation packet metadata
- one-target-file generation
- architectural boundary preservation
- explicit gap/conflict classification
- prohibition of unsupported operation scope
- prohibition of imprecise balance-affecting arithmetic
- prohibition of timestamps as proof
- separation of generated code from proof of correctness

IMP-00 exists to control code-generation behavior.

IMP-00 does not explain the system and does not replace target-specific IMP files.

---

## DEPENDS_ON

- I00__INDEXING_AUTHORITY__TRACEABILITY__GLOBAL.md
- L00__ROOT__SYSTEM_CONSTRAINTS__GLOBAL.md
- IMP-INDEX__IMPLEMENTATION_ROUTING__CODEGEN_ENTRY.md

---

## SOURCE_AUTHORITY_ORDER

Correctness authority flows strictly:

```txt
L00 → L01 → L02 → L03 → L04 → L05 → L06 → L07 → L08 → L09 → L10
```

Lookup / traceability authority:

```txt
I00__INDEXING_AUTHORITY__TRACEABILITY__GLOBAL.md
```

Routing / ownership authority:

```txt
IMP-INDEX__IMPLEMENTATION_ROUTING__CODEGEN_ENTRY.md
```

Implementation guidance:

```txt
IMP-00 through IMP-11
```

Subordinate generated output:

```txt
src/*
tests/*
prisma/*
config files
```

---

## AUTHORITY_RESOLUTION

| Conflict | Winner |
|---|---|
| Generated code conflicts with L00–L10 | L00–L10 |
| Generated code conflicts with I00 lookup or traceability metadata | I00 |
| Generated code conflicts with IMP-INDEX routing, target ownership, required packet shape, or dependency allowance | IMP-INDEX, unless L00–L10 or I00 are violated |
| IMP-00 conflicts with L00–L10 | L00–L10 |
| IMP-00 conflicts with I00 lookup or traceability metadata | I00 |
| IMP-00 conflicts with IMP-INDEX routing | IMP-INDEX, unless L00–L10 or I00 are violated |
| IMP-00 conflicts with target-specific IMP guidance | Target-specific IMP file for file-internal implementation guidance, unless IMP-INDEX routing, I00 lookup/traceability, or L00–L10 correctness authority are violated |
| IMP guidance conflicts with L00–L10 | L00–L10 |
| Generated implementation conflicts with any source document | Source document wins |

Generated code is subordinate to all source authority, indexing authority, routing authority, and implementation guidance.

Generated code is never proof of correctness by itself.

---

## SOURCE_REFERENCE_RULE

All source-owned rule references MUST use full IDs.

Valid source-owned ID prefixes:

```txt
ENT-*
TERM-*
INV-*
FAIL-*
FSM-*
ARCH-*
SCHEMA-*
API-*
AUTHZ-*
TEST-*
```

Valid:

```txt
ENT-004
API-012, API-013
FSM-001 through FSM-010
TEST-001 through TEST-012
```

Invalid:

```txt
API-012, 013
FSM-001...010
TEST-001-012
```

L00 exception:

L00 may be referenced by document-level labels because L00 defines no source-owned ID prefix in I00.

Valid L00 references:

```txt
L00
L00 CORE RULES
L00 INVALID CONDITIONS
L00 SYSTEM BOUNDARY
L00 IDENTITY REQUIREMENT
```

IMP files and generated code MUST NOT create source-owned IDs.

---

## CLASSIFICATION_RULE

If generation cannot proceed cleanly, the generator MUST stop and classify the condition.

| Classification | Meaning | Required action |
|---|---|---|
| `READY_TO_GENERATE` | Generation packet is complete and no blocking gaps remain | Proceed to one-target generation |
| `GENERATION_PACKET_INCOMPLETE` | Required pre-generation packet field is missing | Stop; complete packet before generation |
| `SOURCE_GAP` | Required source rule, source ID, source mapping, or L10 verification authority is missing from L00–L10 / I00 | Stop and report gap |
| `ROUTING_GAP` | Target file, dependency, import, or route is not listed or allowed by IMP-INDEX | Stop and report gap |
| `SOURCE_CONFLICT` | Source documents or routing rules contradict | Stop; do not resolve by preference |
| `SOURCE_CONFLICT` | L00–L10, I00, IMP-INDEX, or required IMP guidance contain contradictory instructions within their owned authority scope | Stop; do not resolve by preference |
| `INFERENCE` | Derived from source facts but not directly stated | Label and keep non-authoritative |
| `ASSUMPTION` | Implementation choice made where source/routing does not specify | Label, minimize, and ensure it does not define correctness |
| `IMPLEMENTATION_GUIDANCE_ONLY` | Useful implementation guidance not owned by L00–L10 | May guide implementation but cannot prove correctness |

Protocol classifications are IMP-00 labels only.

They are not L04 `FAIL-*` classes.

`INFERENCE` and `ASSUMPTION` do not permit generation unless they are explicitly non-correctness-bearing, documented in the packet, and do not affect:

- routing
- source authority
- persistence schema
- balance-affecting arithmetic
- lifecycle validity
- API exposure
- authorization
- verification
- proof claims

If classification is `SOURCE_GAP`, `SOURCE_CONFLICT`, `ROUTING_GAP`, or `GENERATION_PACKET_INCOMPLETE`, generation MUST stop.

Only `READY_TO_GENERATE` permits implementation generation.

---

## GLOBAL_GENERATION_PACKET

Before generating or modifying any target file, the request MUST resolve these fields:

| Field | Required content / enum |
|---|---|
| Target file path | Exact path listed in IMP-INDEX for implementation targets, or exact filename resolved through `IMPLEMENTATION_DOCUMENT_REGISTRY` for IMP guidance files explicitly being authored |
| Boundary owner | Must match the exact `Boundary owner` value routed for the target file in IMP-INDEX, including source-owned `ARCH-*` boundaries, setup/domain/utility labels, API boundary labels, verification labels, or explicitly classified implementation-guidance labels |
| Source references | Full source IDs from L00–L10 / I00 |
| Required IMP files | Resolved through `IMPLEMENTATION_DOCUMENT_REGISTRY` |
| Allowed dependencies | Internal project paths allowed by IMP-INDEX / IMP-02 |
| Forbidden dependencies | Layers, files, or categories this file must not call |
| Mutation authority | `None` / `Authorize` / `Write` / `Read-only` |
| Transaction authority | `None` / `Open` / `Receive` |
| Persistence authority | `None` / `Read` / `Write` / `Physical write only` |
| LedgerEntry authority | `None` / `Plan` / `Authorize creation` / `Persist approved intent` |
| Balance authority | `None` / `Validate` / `Authorize Balance Change` / `Persist approved change` |
| API exposure | `None` / `Write Route` / `Read Route` / `Internal` / `Utility` / `Config` / `Test` |
| Proof tests | Mapping to specific `TEST-*` IDs |
| Output mode | One target file only unless explicitly instructed otherwise |
| Classification | Must be `READY_TO_GENERATE` before implementation generation |

If any required field cannot be resolved, classify before generating.

Allowed blocking classifications:

```txt
GENERATION_PACKET_INCOMPLETE
SOURCE_GAP
ROUTING_GAP
SOURCE_CONFLICT
```

Allowed note classifications:

```txt
INFERENCE
ASSUMPTION
IMPLEMENTATION_GUIDANCE_ONLY
```

Only `READY_TO_GENERATE` permits generation.

---

## MINIMUM_LOAD_RULE

For code generation, load only the smallest sufficient packet:

1. Target route from `IMP-INDEX__IMPLEMENTATION_ROUTING__CODEGEN_ENTRY.md`
2. Relevant L-source files resolved from target source references through I00
3. I00 for source ID lookup and traceability metadata
4. IMP-00 for this global protocol
5. IMP-01 for file manifest
6. IMP-02 for dependency/import rules
7. Target-specific IMP files
8. Existing dependency files imported by the target file

Do not load unrelated guidance as authority.

Do not use memory, intuition, prior code style, framework convention, or convenience to override source routing.

---

## PRE_GENERATION_GATE

The generator MUST output this status block before generating code.

If classification is not `READY_TO_GENERATE`, the generator MUST stop.

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
Classification: [READY_TO_GENERATE | GENERATION_PACKET_INCOMPLETE | SOURCE_GAP | ROUTING_GAP | SOURCE_CONFLICT]
Notes: [optional INFERENCE / ASSUMPTION / IMPLEMENTATION_GUIDANCE_ONLY, non-correctness-bearing only]
```

`INFERENCE`, `ASSUMPTION`, and `IMPLEMENTATION_GUIDANCE_ONLY` are allowed as labeled packet notes only when non-correctness-bearing.

They are not generation-ready classifications.

Only `READY_TO_GENERATE` permits generation.

---

## ONE_TARGET_RULE

Generate exactly one target file per request unless the user explicitly instructs otherwise.

Generated output MUST be complete for that target file.

Do not silently generate:

- helper files
- utility files
- fixtures
- Prisma client wrappers
- barrel exports
- config files
- route files
- migrations
- tests

Any newly required file not routed by IMP-INDEX or the relevant verification routing matrix is `ROUTING_GAP`.

---

## HARD_PROHIBITIONS

Generated implementation MUST NOT:

- modify L00–L10
- modify I00
- treat IMP files as correctness authority
- create source-owned IDs
- create new invariants
- create new failure classes
- create new lifecycle states or transitions
- create new architectural boundaries
- create new schema rules as correctness authority
- create new API contract rules
- create new authorization rules
- create new verification requirements
- add unsupported Balance-Affecting Operations
- generate direct Balance mutation APIs
- generate direct LedgerEntry creation APIs
- generate lifecycle override APIs
- collapse architectural boundaries
- bypass required control flow
- use JavaScript `number` for balance-affecting arithmetic
- use timestamps as replay authority
- use timestamps as ordering authority
- use timestamps as idempotency authority
- use timestamps as lifecycle authority
- use timestamps as proof of correctness
- depend on external systems for correctness
- use eventual consistency for Balance state correctness
- use distributed coordination for correctness
- treat successful compilation as proof
- treat runtime success as proof
- treat absence of failure as proof
- treat logs as proof
- treat routing tables as proof
- treat generated code as proof

---

## ARCHITECTURAL_CONTROL_FLOW_GUARD

Generated code MUST preserve this nested ownership:

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

Boundary ownership MUST NOT move for convenience.

Global boundary constraints:

| Boundary | Must preserve | Must not do |
|---|---|---|
| Request Boundary | External Request entry | Balance Change, LedgerEntry creation, lifecycle execution |
| Idempotency Control | Request identity resolution before execution | Balance mutation, LedgerEntry creation, lifecycle mutation, transaction opening |
| Consistency Boundary | Atomic execution coordination | External API contract ownership, read-only derivation |
| Lifecycle Control | Lifecycle transition decision / intent | Direct durable persistence writes |
| Balance Control | Balance Change authorization | Durable writes outside Persistence Boundary |
| Ledger Control | Semantic LedgerEntry creation authority | Durable writes outside Persistence Boundary |
| Persistence Boundary | Physical durable writes | Business-validity decisions |
| Read Derivation Boundary | Derived read state | Mutation, authorization, execution |

---

## MUTATION_AND_TRANSACTION_GUARD

Only the routed file may exercise its routed authority.

| Authority | Global rule |
|---|---|
| Transaction opening | Only routed Consistency Boundary implementation may open or coordinate Balance-Affecting Operation transaction context |
| Transaction receiving | Lifecycle, Balance, Ledger, and Persistence controls may receive transaction context only when routed |
| Balance Change authorization | Only Balance Control may authorize Balance Change |
| LedgerEntry semantic creation | Only Ledger Control may authorize or create LedgerEntry intent |
| Durable writes | Only Persistence Boundary may execute durable writes |
| API write entry | Write API routes must route into Request Boundary |
| API read entry | Read API routes must route into Read Derivation Boundary |
| Read derivation | Must remain outside mutation and execution authority |

---

## MVP_OPERATION_SCOPE_RULE

The only routed Balance-Affecting Operation for MVP is:

```txt
Transfer
```

Transfer implementation must remain source-routed.

Relevant source references include:

```txt
ENT-004
TERM-007
TERM-008
FSM-001
FSM-002
FSM-005
FSM-008
INV-001
INV-004
INV-007
INV-008
INV-010
```

Forbidden generation includes:

| Forbidden generation | Source references |
|---|---|
| New Balance-Affecting Operation | L00 SYSTEM BOUNDARY, TERM-007, FSM-009, SCHEMA-001 |
| Direct Balance mutation operation | INV-001, INV-003, INV-004, ARCH-005, API-009, AUTHZ-007 |
| Direct LedgerEntry creation API | INV-002, INV-010, ARCH-006, API-010, AUTHZ-008 |
| External settlement or distributed correctness | TERM-001, TERM-002, INV-009, FAIL-009, API-013, AUTHZ-009 |

Any attempt to generate a Balance-Affecting Operation other than `Transfer` is invalid unless both source authority and IMP-INDEX routing are updated first.

Classify missing routing as `ROUTING_GAP`.

Classify missing source authority as `SOURCE_GAP`.

---

## ARITHMETIC_RULE

Balance-affecting arithmetic MUST NOT use JavaScript `number`.

Allowed implementation choices must be routed by target-specific IMP guidance.

If the specific numeric representation for balance-affecting arithmetic is not routed, classify as `SOURCE_GAP`.

A temporary `ASSUMPTION` may be used only for non-balance-affecting representation details.

An `ASSUMPTION` MUST NOT define:

- correctness
- persistence schema
- arithmetic semantics
- replay semantics
- idempotency semantics
- Balance state meaning

Do not make numeric representation a new correctness authority.

---

## TIME_RULE

Timestamps MAY be used as metadata only if routed by the target file and compatible with source authority.

Timestamps MUST NOT be used as:

- replay authority
- ordering authority
- idempotency authority
- lifecycle authority
- authorization authority
- proof of correctness
- substitute for LedgerEntry traceability
- substitute for Request identity
- substitute for atomic transaction guarantees

If a target-specific IMP file requires temporal anchoring for records created within one transaction, use it only as implementation consistency metadata, not correctness authority.

---

## IDEMPOTENCY_AND_RETRY_RULE

Generated implementation MUST preserve duplicate Request behavior.

Duplicate Requests MUST NOT:

- create duplicate LedgerEntries
- produce additional Balance Changes
- re-execute lifecycle execution
- produce divergent outcome meaning
- bypass lifecycle constraints
- bypass authorization constraints
- create alternate execution paths

Duplicate Requests MUST resolve to the same persisted outcome.

Idempotency MUST NOT be implemented as:

- best-effort deduplication
- timestamp comparison
- client-side retry assumption
- log inspection
- non-durable memory cache
- external-system dependency

---

## API_BOUNDARY_GUARD

Generated API code MUST NOT expose internal control boundaries.

External callers MUST NOT be able to:

- directly mutate Balance
- directly create or modify LedgerEntry
- directly select Transfer lifecycle state
- choose internal control-boundary execution path
- bypass Request identity
- bypass Idempotency Control
- bypass Authorization evaluation where routed
- bypass Lifecycle Control
- bypass Balance Control
- bypass Ledger Control
- bypass Persistence Boundary

Write API routes must terminate at Request Boundary.

Read API routes must terminate at Read Derivation Boundary.

Detailed API implementation guidance belongs to IMP-06.

---

## TEST_GENERATION_GUARD

Verification authority remains with L10.

Tests are proof instruments, not source authority.

Test files may be generated only when routed by:

- IMP-INDEX `VERIFICATION_FILE_ROUTING_MATRIX`
- IMP-08
- IMP-11

Test-support files:

- must remain under test support
- must not be imported by production code
- must not become part of `src/server`, `src/domain`, or `src/lib` production execution
- must not define new correctness rules

Tests verify source authority.

Tests do not define source authority.

---

## PROOF_RULE

A generated file is not correct merely because it exists.

Do not treat the following as proof:

- routing tables
- IMP guidance
- generated code
- logs
- timestamps
- database choice
- successful compilation
- runtime success
- absence of runtime errors
- happy-path execution

Proof requires:

- source rule reference
- routed implementation ownership
- invalid-path rejection
- mapped `TEST-*` coverage
- observed passing behavior

Detailed verification implementation belongs to IMP-08.

Completion and CI gates belong to IMP-11.

---

## IMPLEMENTATION_GUIDANCE_SCOPE

IMP files guide implementation only.

| File | Owns |
|---|---|
| IMP-00 | Global generation protocol |
| IMP-01 | MVP file manifest and file responsibilities |
| IMP-02 | Dependency and import boundaries |
| IMP-03 | Persistence and Prisma implementation guidance |
| IMP-04 | Transaction and Consistency Boundary guidance |
| IMP-05 | Transfer-only operation guidance |
| IMP-06 | API route and response implementation guidance |
| IMP-07 | Failure-to-error implementation mapping |
| IMP-08 | TEST-001 through TEST-012 implementation matrix |
| IMP-09 | Build order by proof milestones |
| IMP-10 | Audit and trace visibility guidance |
| IMP-11 | Done criteria, CI, and proof gates |

IMP files MUST NOT define correctness.

If an IMP file appears to define correctness, classify as `SOURCE_CONFLICT` against L00–L10 or `SOURCE_GAP` if no source rule exists.

---

## OUTPUT_CONTRACT

For implementation code generation, output:

```txt
complete target-file content only
```

Do not include:

- explanations inside the generated target file
- multiple files
- inferred files
- migration instructions unless the target file itself is a migration artifact
- package installation instructions
- unrelated refactors

For implementation-guidance document generation by explicit user request, output complete copy-paste-ready Markdown.

---

## POST_GENERATION_VALIDATION

After generation, validate output against these protocol labels:

| Protocol label | Meaning |
|---|---|
| ARCHITECTURAL_BYPASS | Logic moved across boundaries for convenience |
| TRANSACTION_AUTHORITY_VIOLATION | Opened, received, or bypassed transaction context outside routed authority |
| ARITHMETIC_VIOLATION | Used standard JavaScript numbers for balance-affecting arithmetic |
| UNROUTED_IMPORT | Imported an internal file not allowed by IMP-INDEX |
| ID_ABBREVIATION | Failed to use full source IDs |
| PROOF_VIOLATION | Treated logs, compilation, runtime success, or absence of failure as proof |
| OPERATION_SCOPE_VIOLATION | Generated unsupported Balance-Affecting Operation |
| API_BOUNDARY_VIOLATION | Generated direct mutation, LedgerEntry creation, or lifecycle override API |
| VERIFICATION_GAP | Generated file lacks mapped proof tests |

These are IMP-00 protocol labels only.

They are not L04 `FAIL-*` classes.

If validation fails, generated output is not acceptable as complete.

---

## VALIDITY_CONDITIONS

This file is VALID if it:

- remains non-authoritative implementation guidance
- preserves L00–L10 as the sole correctness authority
- preserves I00 as indexing and lookup authority
- preserves IMP-INDEX as implementation/codegen routing authority
- requires full source-owned IDs
- requires routed generation packets
- blocks unrouted files and hidden dependencies
- blocks unsupported operations
- blocks architectural bypass
- blocks direct Balance mutation APIs
- blocks direct LedgerEntry creation APIs
- blocks lifecycle override APIs
- blocks timestamp-as-proof reasoning
- treats generated code as implementation, not proof
- routes proof to source-mapped verification

This file is INVALID if it:

- defines business correctness
- defines source-owned IDs
- weakens or extends L00–L10
- overrides I00 lookup
- overrides IMP-INDEX routing
- permits unrouted internal imports
- permits direct mutation paths
- permits partial operations
- treats successful compilation as correctness proof
- treats runtime success as correctness proof
- treats absence of failure as correctness proof

---

## TRACEABILITY

| Section | Basis |
|---|---|
| AUTHORITY_STATUS | I00, IMP-INDEX |
| PURPOSE | I00, IMP-INDEX |
| DEPENDS_ON | I00, L00, IMP-INDEX |
| SOURCE_AUTHORITY_ORDER | I00, IMP-INDEX |
| AUTHORITY_RESOLUTION | I00, IMP-INDEX |
| SOURCE_REFERENCE_RULE | I00 |
| CLASSIFICATION_RULE | I00, IMP-INDEX |
| GLOBAL_GENERATION_PACKET | IMP-INDEX |
| MINIMUM_LOAD_RULE | IMP-INDEX |
| PRE_GENERATION_GATE | IMP-INDEX |
| ONE_TARGET_RULE | IMP-INDEX |
| HARD_PROHIBITIONS | L00–L10, I00, IMP-INDEX |
| ARCHITECTURAL_CONTROL_FLOW_GUARD | L06, IMP-INDEX |
| MUTATION_AND_TRANSACTION_GUARD | L06, L07, IMP-INDEX |
| MVP_OPERATION_SCOPE_RULE | L00, L01, L02, L03, L05, IMP-INDEX |
| ARITHMETIC_RULE | L00, L03, L07 |
| TIME_RULE | L00, L03, L10 |
| IDEMPOTENCY_AND_RETRY_RULE | L03, L05, L07, L08, L09 |
| API_BOUNDARY_GUARD | L08, IMP-INDEX |
| TEST_GENERATION_GUARD | L10, IMP-08, IMP-11 |
| PROOF_RULE | L10, IMP-INDEX |
| IMPLEMENTATION_GUIDANCE_SCOPE | I00, IMP-INDEX |
| OUTPUT_CONTRACT | IMP-INDEX |
| POST_GENERATION_VALIDATION | IMP-INDEX, L10 |
| VALIDITY_CONDITIONS | I00, L00, IMP-INDEX |

---

## CLASSIFICATION

SOURCE_FACT:

- L00–L10 are correctness authority.
- I00 is source indexing and traceability authority.
- IMP-INDEX is implementation/codegen routing authority.
- IMP files are non-authoritative implementation guidance.
- Generated implementation is not proof of correctness.

INFERENCE:

- A global code-generation protocol is needed to prevent implementation guidance from being treated as source authority.
- One-target generation reduces boundary drift, hidden dependency creation, and unrouted implementation expansion.
- Pre-generation and post-generation gates reduce AI codegen failure modes.

IMPLEMENTATION_GUIDANCE_ONLY:

- concrete file manifest belongs to IMP-01
- dependency matrix belongs to IMP-02
- persistence implementation belongs to IMP-03
- transaction implementation belongs to IMP-04
- Transfer implementation belongs to IMP-05
- API implementation belongs to IMP-06
- failure/error mapping belongs to IMP-07
- verification implementation matrix belongs to IMP-08
- build order belongs to IMP-09
- observability belongs to IMP-10
- done criteria belongs to IMP-11

SOURCE_GAP:

- NONE

SOURCE_CONFLICT:

- NONE

---

## LOCK_STATUS

READY_FOR_USE only if:

- filename matches the IMP-INDEX registry entry for IMP-00
- IMP-INDEX exists and defines `IMPLEMENTATION_DOCUMENT_REGISTRY`
- I00 exists and indexes all source-owned IDs used by routed targets
- L00–L10 exist
- IMP-01 through IMP-11 either exist or are explicitly scheduled for creation
- target generation begins from IMP-INDEX routing
- generated implementation remains subordinate to L00–L10, I00, and IMP-INDEX
- this file remains non-authoritative implementation guidance

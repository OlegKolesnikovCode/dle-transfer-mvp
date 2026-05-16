# IMP-11__DONE_CRITERIA__CI_AND_PROOF.md


## AUTHORITY_STATUS


NON_AUTHORITATIVE_IMPLEMENTATION_GUIDANCE

This file defines completion, CI, and proof-gate implementation guidance for the DLE-2 Transfer-only MVP.

This file is NOT correctness authority.

Correctness authority remains exclusively with L00–L10.

Verification authority remains with L10.

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
- define verification requirements
- override L00–L10
- override I00
- override IMP-INDEX routing
- create target files not routed by IMP-INDEX
- create unsupported Balance-Affecting Operations
- treat CI success alone as proof
- treat generated code as proof
- treat compilation as proof
- treat logs as proof
- treat timestamps as proof
- treat runtime success as proof
- treat happy-path execution as proof

If this file conflicts with L00–L10, L00–L10 win.

If this file conflicts with I00, I00 wins for lookup and traceability metadata.

If this file conflicts with IMP-INDEX, IMP-INDEX wins for routing, dependency allowance, target ownership, required source IDs, required IMP files, proof tests, and generation-packet shape.

If this file appears to authorize DONE without TEST-* proof, classify as SOURCE_CONFLICT against L10.

If this file appears to authorize an unrouted file, helper, test, CI artifact, or proof artifact, classify as ROUTING_GAP.

---

## PURPOSE


Define when the DLE-2 Transfer-only MVP may be called complete.

IMP-11 exists to prevent premature DONE claims.

The MVP is DONE only when routed implementation has source-mapped, behavior-observed proof that required correctness guarantees are enforced.

Completion requires:
- all routed production/config/persistence/API/test targets exist
- no unrouted production files exist
- no unrouted test-support files exist
- no unresolved SOURCE_GAP
- no unresolved SOURCE_CONFLICT
- no unresolved ROUTING_GAP
- no unresolved PROOF_GAP
- no unsupported Balance-Affecting Operation
- no direct Balance mutation path
- no direct LedgerEntry creation path
- no lifecycle override path
- no boundary bypass
- TEST-001 through TEST-012 exist
- TEST-001 through TEST-012 pass
- required invalid-path coverage passes
- CI fails closed
- proof evidence maps source IDs to implementation files, TEST-* coverage, and observed results

IMP-11 does not replace L10.

IMP-11 defines implementation completion gates only.

---

## DEPENDS_ON


- I00__INDEXING_AUTHORITY__TRACEABILITY__GLOBAL.md
- L00__ROOT__SYSTEM_CONSTRAINTS__GLOBAL.md
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
- IMP-08__VERIFICATION_MATRIX__TEST_001_TO_012.md
- IMP-09__BUILD_ORDER__PROOF_MILESTONES.md
- IMP-10__OBSERVABILITY__AUDIT_TRACE.md

---

## SOURCE_AUTHORITY_ORDER


Correctness authority:

```txt
L00 → L01 → L02 → L03 → L04 → L05 → L06 → L07 → L08 → L09 → L10

Indexing authority:

I00__INDEXING_AUTHORITY__TRACEABILITY__GLOBAL.md

Implementation routing authority:

IMP-INDEX__IMPLEMENTATION_ROUTING__CODEGEN_ENTRY.md

Implementation guidance:

IMP-00 → IMP-11

Generated implementation:

config files
prisma/*
src/*
tests/*

Generated implementation remains subordinate to L00–L10, I00, IMP-INDEX, and routed IMP guidance.
```

## SCOPE


IMP-11 applies to completion status for routed implementation targets.

In scope:

- completion status
- done gates
- CI gates
- proof gates
- proof evidence requirements
- release-readiness classification
- non-done classification

Out of scope:

- file manifest
- dependency/import legality
- Prisma schema content
- transaction mechanics
- Transfer behavior
- API behavior
- failure/error mapping
- concrete TEST-* implementation details
- observability format

Those remain owned by IMP-01 through IMP-10 and source authority.

## CLASSIFICATION_RULE


If completion status cannot be determined cleanly, classify before claiming DONE.

| Classification | Meaning | Required action |
| --- | --- | --- |
| READY_FOR_DONE_REVIEW | All required files, tests, mappings, and CI evidence are available for review | Evaluate gates |
| DONE | All mandatory gates pass with source-mapped observed proof | Completion may be claimed |
| NOT_DONE | One or more mandatory gates fail, are missing, or are unknown | Do not claim completion |
| GENERATION_PACKET_INCOMPLETE | Required completion evidence, test result, source mapping, CI output, or route status is missing | Complete evidence |
| ROUTING_GAP | Required file, helper, test, CI artifact, proof artifact, or dependency is not routed | Stop; report missing route |
| SOURCE_GAP | Required source-owned rule, ID, TEST-* mapping, or verification authority is missing from L00–L10 / I00 | Stop; report missing source authority |
| SOURCE_CONFLICT | Authorities conflict in a way that changes completion legality | Stop; do not choose by preference |
| PROOF_GAP | Code exists but source-mapped proof is missing, incomplete, happy-path-only, skipped, or unobserved | NOT_DONE |
| IMPLEMENTATION_GUIDANCE_ONLY | Completion guidance outside L00–L10 authority | May guide review; cannot define correctness |


Default completion status:

NOT_DONE

Default unknown gate status:

MISSING

Do not infer PASS from absence of failure.

## DONE_MEANING_RULE


DONE means:

The Transfer-only MVP implementation has source-mapped, routed, observed proof that all required correctness guarantees are enforced.

DONE does not mean:

- files exist
- code compiles
- API returns 200 once
- happy-path Transfer works
- database migration succeeds
- seed runs
- logs look correct
- manual demo works
- routes exist
- tests exist but are unmapped
- some tests pass

DONE requires every mandatory gate in this file to pass.

## MANDATORY_DONE_GATES


The MVP may be called DONE only if every gate passes.

| Gate | Name | Required result |
| --- | --- | --- |
| 0 | Authority / routing gate | L00–L10, I00, IMP-INDEX, and IMP guidance exist and are non-conflicting |
| 1 | Manifest gate | every routed target exists; no unrouted implementation/test artifact exists |
| 2 | Dependency gate | all imports obey IMP-02 / IMP-INDEX |
| 3 | Operation-scope gate | Transfer is the only Balance-Affecting Operation |
| 4 | Persistence gate | required L07 / SCHEMA-* representation exists and is tested |
| 5 | Boundary gate | L06 control boundaries and required flow are preserved |
| 6 | API gate | L08 API restrictions are preserved |
| 7 | Authorization gate | L09 authorization constraints are preserved |
| 8 | Verification file gate | TEST-001 through TEST-012 files exist and map to source IDs |
| 9 | Behavior proof gate | TEST-001 through TEST-012 pass with valid-path and invalid-path observations |
| 10 | CI gate | CI runs required checks and fails closed |
| 11 | Proof artifact gate | proof summary maps source IDs to files, tests, and observed results, if routed |
| 12 | Release gate | no NOT_DONE, SOURCE_GAP, SOURCE_CONFLICT, ROUTING_GAP, GENERATION_PACKET_INCOMPLETE, or PROOF_GAP remains |

## GATE_FAILURE_RULES

### Gate 0 — Authority / routing gate fails if:

- any required L00–L10 source is missing
- I00 is missing
- IMP-INDEX is missing
- IMP guidance is treated as correctness authority
- any source-owned ID is missing, duplicated, or unresolved
- IMP-INDEX routes files with unresolved source IDs

### Gate 1 — Manifest gate fails if:

- any routed target file is missing
- any production file is unrouted
- any test file is unrouted
- any helper file is unrouted
- any generic repository, Prisma wrapper, operation framework, or unsupported route is unrouted

### Gate 2 — Dependency gate fails if:

- any internal import is unrouted
- any import violates IMP-02 / IMP-INDEX
- API routes import Prisma directly
- API routes bypass Request Boundary or Read Derivation Boundary
- production code imports test support
- direct Prisma access exists outside routed persistence files
- circular, dynamic, barrel, or type-only imports bypass dependency rules

### Gate 3 — Operation-scope gate fails if:

- any Balance-Affecting Operation other than Transfer exists
- unsupported operation folders, routes, models, schemas, tests, registries, or generic operation frameworks exist
- API accepts operation type other than Transfer

Forbidden operation examples:

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

### Gate 4 — Persistence gate fails if:

- Account, Asset, Balance, Transfer, LedgerEntry, or Request is missing
- Request identity uniqueness is missing
- Account-Asset Balance uniqueness is missing
- Transfer lifecycle state is not restricted to L05 states
- LedgerEntry relationship integrity is optional where source requires it
- Transfer relationship integrity is optional where source requires it
- persisted Balance overrides LedgerEntry-derived state without detection
- duplicate Request can create duplicate execution effect
- JavaScript number is used for balance-affecting arithmetic
- schema existence is treated as proof without TEST-* behavior

### Gate 5 — Boundary gate fails if:

- Balance Change is authorized outside Balance Control
- LedgerEntry semantic creation authority exists outside Ledger Control
- Persistence Boundary makes business-validity decisions
- transaction opens outside Consistency Boundary
- API route bypasses Request Boundary
- read route mutates state
- lifecycle state is externally selected
- internal control boundaries are exposed through API

### Gate 6 — API gate fails if:

- API exposes direct Balance mutation
- API exposes direct LedgerEntry creation or mutation
- API exposes lifecycle override
- API route imports Prisma directly
- API route opens transaction
- API route calls Persistence Boundary directly
- Response exposes transaction/internal control authority
- unsupported operation route exists

Allowed API surface:

- POST /api/transfers
- GET /api/transfers/:transferId
- GET /api/transfers/:transferId/ledger-entries
- GET /api/accounts/:accountId/balances

### Gate 7 — Authorization gate fails if:

- unauthorized Request executes Transfer
- unauthorized Request mutates Balance
- unauthorized Request creates LedgerEntries
- authorization mutates state
- authorization opens transaction
- authorization selects Transfer lifecycle state
- authorization bypasses Idempotency Control, Lifecycle Control, Balance Control, Ledger Control, or Persistence Boundary
- authorization introduces an alternate execution path

### Gate 8 — Verification file gate fails if:

- any TEST-* file is missing
- any TEST-* file lacks source-owned IDs
- any TEST-* file defines new correctness rules
- any TEST-* file defines new TEST-* IDs
- any TEST-* file is happy-path-only where invalid-path coverage is required
- any TEST-* file relies on logs, timestamps, or mocks as sole proof

### Gate 9 — Behavior proof gate fails if:

- any TEST-* fails
- any TEST-* is skipped without classified non-applicability
- invalid behavior is treated as success
- happy-path behavior is treated as complete proof
- mocked behavior replaces required persisted/API/control observation
- proof cannot be traced to source-owned IDs

### Gate 10 — CI gate fails if:

- install fails
- typecheck fails
- build fails
- Prisma validation fails
- any TEST-* file is missing
- any TEST-* fails
- any required source ID mapping is missing
- any forbidden file, route, import, or operation exists
- any test is skipped unexpectedly
- any source/routing/proof gap remains

### Gate 11 — Proof artifact gate fails if:

- proof artifact is created without routing
- proof artifact claims correctness from logs, timestamps, compilation, route existence, runtime success, or happy path
- proof artifact lacks source ID mapping
- proof artifact lacks test result mapping

If no proof artifact file is routed, proof evidence must still be available through CI output, test output, source-to-test mappings, IMP-INDEX routing, and IMP-08 matrix.

### Gate 12 — Release gate fails if:

- any mandatory gate fails
- any mandatory gate is unknown
- any mandatory gate is skipped
- any SOURCE_GAP remains
- any SOURCE_CONFLICT remains
- any ROUTING_GAP remains
- any GENERATION_PACKET_INCOMPLETE remains
- any PROOF_GAP remains

## REQUIRED_TEST_PASS_SET


The following must pass before DONE:

- TEST-001
- TEST-002
- TEST-003
- TEST-004
- TEST-005
- TEST-006
- TEST-007
- TEST-008
- TEST-009
- TEST-010
- TEST-011
- TEST-012

No subset is sufficient.

Passing TEST-001 through TEST-010 is not enough if API or authorization is unverified.

Passing TEST-011 is not enough if invariants are unverified.

Passing TEST-012 is not enough if idempotency, lifecycle, atomicity, traceability, persistence, or API behavior is unverified.

## TEST_RESULT_REQUIREMENT


Every TEST-* result must record:

- TEST ID:
- Test file path:
- Source references covered:
- Valid-path assertion summary:
- Invalid-path assertion summary:
- Observed result:
- Failure reason if failed:
- Skip reason if skipped:

A TEST-* result is incomplete if:

- source references are missing
- invalid-path coverage is missing where required
- observed behavior is replaced by logs, timestamps, mocks, or assertions of intent
- the test passes without exercising the relevant routed implementation path

## REQUIRED_PROOF_COVERAGE


Before DONE, proof must cover:

| Proof area | Required TEST-* coverage |
| --- | --- |
| Traceability | TEST-001 |
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


Required source coverage groups:

- INV-001 through INV-010
- FAIL-001 through FAIL-010
- FSM-001 through FSM-010
- ARCH-001 through ARCH-009
- SCHEMA-001 through SCHEMA-013
- API-001 through API-013
- AUTHZ-001 through AUTHZ-012
- TEST-001 through TEST-012

## CI_RULE


CI must fail closed.

Recommended CI sequence:

1. install dependencies
2. validate required source/routing files are present
3. validate Prisma schema
4. run typecheck
5. run build
6. run static routing/dependency checks if routed
7. run TEST-001 through TEST-012
8. emit test/proof summary
9. fail if any required gate is missing, skipped, or failed

Recommended package scripts if routed:

```bash
npm run typecheck
npm run build
npm test
npm run test:ci
npm run prisma:validate
```


Script names are implementation guidance only.

CI must not treat as proof:

- install success alone
- typecheck success alone
- build success alone
- Prisma validation alone
- migration success alone
- seed success alone
- route existence
- logs
- timestamps
- smoke test only
- happy-path API request only

## STATIC_CHECK_GUIDANCE


Static checks are useful but not sufficient.

Use static checks where routed to detect:

- unrouted files
- unrouted imports
- forbidden API routes
- forbidden Prisma imports
- production imports from tests
- source ID abbreviations
- missing TEST-* files
- unsupported operation names
- JavaScript number in balance-affecting arithmetic
- timestamp-as-proof logic or comments
- direct Balance mutation route patterns
- direct LedgerEntry creation route patterns
- lifecycle override route patterns

If static-check files or scripts are needed but not routed, classify as ROUTING_GAP.

Static checks support CI.

Static checks do not replace TEST-* behavior.

## PROOF_ARTIFACT_RULE


Do not create a proof artifact unless routed or explicitly requested.

If a proof summary is routed, it must map:

Source ID → Implemented/routed file(s) → TEST-* coverage → observed result

Minimum proof summary structure:

```md
# DLE-2 MVP Proof Summary

## Status

DONE / NOT_DONE

## Gate Results

| Gate | Result | Evidence |
|---|---|---|
| Authority / routing | PASS/FAIL | ... |
| Manifest | PASS/FAIL | ... |
| Dependency | PASS/FAIL | ... |
| Operation scope | PASS/FAIL | ... |
| Persistence | PASS/FAIL | ... |
| Boundary | PASS/FAIL | ... |
| API | PASS/FAIL | ... |
| Authorization | PASS/FAIL | ... |
| Verification files | PASS/FAIL | ... |
| Behavior proof | PASS/FAIL | ... |
| CI | PASS/FAIL | ... |

## TEST Results

| TEST ID | File | Source coverage | Result |
|---|---|---|---|
| TEST-001 | tests/TEST-001-traceability.test.ts | INV-001, FAIL-001 | PASS/FAIL |
| TEST-002 | tests/TEST-002-ledger-immutability.test.ts | INV-002, FAIL-002 | PASS/FAIL |
| TEST-003 | tests/TEST-003-replay-determinism.test.ts | INV-003, FAIL-003 | PASS/FAIL |
| TEST-004 | tests/TEST-004-atomicity.test.ts | INV-004, FAIL-004 | PASS/FAIL |
| TEST-005 | tests/TEST-005-balance-constraint.test.ts | INV-005, FAIL-005 | PASS/FAIL |
| TEST-006 | tests/TEST-006-asset-consistency.test.ts | INV-006, FAIL-006 | PASS/FAIL |
| TEST-007 | tests/TEST-007-idempotency.test.ts | INV-007, FAIL-007 | PASS/FAIL |
| TEST-008 | tests/TEST-008-lifecycle.test.ts | INV-008, FAIL-008 | PASS/FAIL |
| TEST-009 | tests/TEST-009-bounded-consistency.test.ts | INV-009, FAIL-009 | PASS/FAIL |
| TEST-010 | tests/TEST-010-operation-completeness.test.ts | INV-010, FAIL-010 | PASS/FAIL |
| TEST-011 | tests/TEST-011-api-boundary.test.ts | API-001 through API-013 | PASS/FAIL |
| TEST-012 | tests/TEST-012-authorization.test.ts | AUTHZ-001 through AUTHZ-012 | PASS/FAIL |

## Remaining Gaps

- SOURCE_GAP: NONE / list
- SOURCE_CONFLICT: NONE / list
- ROUTING_GAP: NONE / list
- PROOF_GAP: NONE / list

## Completion Verdict

DONE / NOT_DONE
```

## PRE_DONE_REVIEW_PACKET


Before declaring DONE, resolve:

- Project status:
- Source set status:
- IMP set status:
- Routed target file status:
- Unrouted file scan status:
- Dependency gate status:
- Operation-scope gate status:
- Persistence gate status:
- Boundary gate status:
- API gate status:
- Authorization gate status:
- Verification file gate status:
- TEST-001 result:
- TEST-002 result:
- TEST-003 result:
- TEST-004 result:
- TEST-005 result:
- TEST-006 result:
- TEST-007 result:
- TEST-008 result:
- TEST-009 result:
- TEST-010 result:
- TEST-011 result:
- TEST-012 result:
- CI status:
- Proof artifact status:
- Remaining SOURCE_GAP:
- Remaining SOURCE_CONFLICT:
- Remaining ROUTING_GAP:
- Remaining GENERATION_PACKET_INCOMPLETE:
- Remaining PROOF_GAP:
- Final classification:

Final classification must be:

DONE

or one or more NOT_DONE_* labels.

## RELEASE_READINESS_LABELS


Use the most specific applicable label.

| Label | Meaning |
| --- | --- |
| DONE | all mandatory gates pass |
| NOT_DONE_SOURCE_GAP | source authority missing or unresolved |
| NOT_DONE_SOURCE_CONFLICT | source/routing contradiction unresolved |
| NOT_DONE_ROUTING_GAP | target/dependency/helper/test/proof artifact unrouted |
| NOT_DONE_IMPLEMENTATION_GAP | routed implementation file missing or incomplete |
| NOT_DONE_DEPENDENCY_GAP | imports/dependencies violate routing |
| NOT_DONE_PROOF_GAP | TEST-* proof missing, incomplete, skipped, or failing |
| NOT_DONE_CI_GAP | CI missing, partial, or not fail-closed |
| NOT_DONE_OPERATION_SCOPE_VIOLATION | unsupported Balance-Affecting Operation introduced |
| NOT_DONE_BOUNDARY_BYPASS | architectural boundary bypass exists |
| NOT_DONE_API_BYPASS | API exposes forbidden mutation, lifecycle override, or internal boundary |
| NOT_DONE_AUTHZ_BYPASS | authorization can mutate, execute, or bypass controls |
| NOT_DONE_FALSE_PROOF | logs, timestamps, compilation, runtime success, or happy path treated as proof |


Multiple labels may apply.

## PROOF_LIMITS


The following are not proof of completion:

- all files exist
- generated code looks correct
- TypeScript compiles
- Next.js build succeeds
- Prisma schema validates
- migration succeeds
- seed succeeds
- API returns HTTP 200 once
- Transfer happy path works once
- duplicate Request appears to work once
- logs show success
- timestamps align
- route exists
- README claims correctness
- CI runs but skips required tests
- tests exist but lack source mapping
- tests pass but lack invalid-path coverage
- mocks pass without real behavior observation
- absence of error
- absence of failing tests because tests are missing

Proof requires:

- source rule reference
- routed implementation ownership
- dependency legality
- invalid-path rejection
- TEST-* coverage
- observed passing behavior

## FINAL_DONE_CHECKLIST


Before declaring DONE:

- [ ] L00–L10 exist.
- [ ] I00 exists.
- [ ] IMP-INDEX exists.
- [ ] IMP-00 through IMP-11 exist.
- [ ] No SOURCE_GAP remains.
- [ ] No SOURCE_CONFLICT remains.
- [ ] No ROUTING_GAP remains.
- [ ] No GENERATION_PACKET_INCOMPLETE remains.
- [ ] No PROOF_GAP remains.

- [ ] Every routed production/config/persistence/API target exists.
- [ ] Every routed TEST target exists.
- [ ] No unrouted production file exists.
- [ ] No unrouted test-support file exists.
- [ ] No unsupported operation exists.

- [ ] All imports obey IMP-02 / IMP-INDEX.
- [ ] API routes do not import Prisma directly.
- [ ] Direct Prisma access is confined to routed persistence files.
- [ ] Production code does not import tests.
- [ ] No circular dependency exists.

- [ ] Only Transfer is implemented as a Balance-Affecting Operation.
- [ ] No direct Balance mutation API exists.
- [ ] No direct LedgerEntry creation/mutation API exists.
- [ ] No lifecycle override API exists.
- [ ] No external correctness dependency exists.

- [ ] Balance-affecting arithmetic does not use JavaScript number.
- [ ] Timestamps are not used as replay/order/idempotency/lifecycle/authorization/proof authority.
- [ ] Logs/audit/metrics are not treated as proof.

- [ ] TEST-001 passes.
- [ ] TEST-002 passes.
- [ ] TEST-003 passes.
- [ ] TEST-004 passes.
- [ ] TEST-005 passes.
- [ ] TEST-006 passes.
- [ ] TEST-007 passes.
- [ ] TEST-008 passes.
- [ ] TEST-009 passes.
- [ ] TEST-010 passes.
- [ ] TEST-011 passes.
- [ ] TEST-012 passes.

- [ ] TEST-* files include source references.
- [ ] TEST-* files include invalid-path coverage.
- [ ] TEST-* files observe behavior, not just existence.
- [ ] CI runs required checks.
- [ ] CI fails closed.
- [ ] Proof evidence maps Source ID → implementation → TEST-* → observed result.

If any required box is unchecked, status is NOT_DONE.

## TRACEABILITY

| Section | Basis |
| --- | --- |
| AUTHORITY_STATUS | I00, L10, IMP-INDEX |
| PURPOSE | L10, IMP-INDEX, IMP-00 |
| DEPENDS_ON | I00, L00, L03, L04, L05, L06, L07, L08, L09, L10, IMP-INDEX, IMP-00 through IMP-10 |
| SOURCE_AUTHORITY_ORDER | I00, IMP-INDEX |
| SCOPE | IMP-INDEX TARGET_FILE_ROUTING_MATRIX and VERIFICATION_FILE_ROUTING_MATRIX |
| CLASSIFICATION_RULE | IMP-00, L10 |
| DONE_MEANING_RULE | L10, IMP-00 |
| MANDATORY_DONE_GATES | L10, IMP-09 |
| GATE_FAILURE_RULES | L06, L07, L08, L09, L10, IMP-INDEX, IMP-02 |
| REQUIRED_TEST_PASS_SET | L10 |
| TEST_RESULT_REQUIREMENT | L10, IMP-08 |
| REQUIRED_PROOF_COVERAGE | L03, L04, L05, L06, L07, L08, L09, L10 |
| CI_RULE | L10, IMPLEMENTATION_GUIDANCE_ONLY |
| STATIC_CHECK_GUIDANCE | IMP-00, IMP-02, IMP-08 |
| PROOF_ARTIFACT_RULE | L10, IMP-08 |
| PRE_DONE_REVIEW_PACKET | L10, IMP-INDEX |
| RELEASE_READINESS_LABELS | IMPLEMENTATION_GUIDANCE_ONLY |
| PROOF_LIMITS | L10, IMP-00, IMP-10 |
| FINAL_DONE_CHECKLIST | L10, IMP-INDEX |
| VALIDITY_CONDITIONS | I00, L10, IMP-INDEX |

## VALIDITY_CONDITIONS


This file is VALID if it:

- remains non-authoritative implementation guidance
- preserves L00–L10 as correctness authority
- preserves L10 as verification authority
- preserves I00 as source lookup and traceability authority
- preserves IMP-INDEX as implementation routing authority
- does not define source-owned IDs
- does not define new TEST-* IDs
- does not define new correctness rules
- does not define new verification requirements
- does not create target files outside IMP-INDEX routing
- requires TEST-001 through TEST-012 to pass before DONE
- requires source-mapped observed behavior before DONE
- requires invalid-path coverage before DONE
- requires CI to fail closed
- rejects logs, timestamps, compilation, runtime success, route existence, generated code, and happy-path behavior as proof
- rejects completion with SOURCE_GAP, SOURCE_CONFLICT, ROUTING_GAP, GENERATION_PACKET_INCOMPLETE, or PROOF_GAP
- preserves Transfer-only MVP operation scope
- prevents direct mutation, lifecycle override, API bypass, authorization bypass, and boundary bypass from being considered DONE

This file is INVALID if it:

- defines correctness authority
- defines source-owned IDs
- weakens or extends L00–L10
- overrides I00 lookup
- overrides IMP-INDEX routing
- permits DONE before TEST-001 through TEST-012 pass
- permits DONE with missing invalid-path coverage
- permits DONE with skipped required tests
- permits DONE with unresolved SOURCE_GAP
- permits DONE with unresolved SOURCE_CONFLICT
- permits DONE with unresolved ROUTING_GAP
- permits DONE with unresolved GENERATION_PACKET_INCOMPLETE
- permits DONE with unresolved PROOF_GAP
- permits DONE with unsupported Balance-Affecting Operation
- permits DONE with direct Balance mutation API
- permits DONE with direct LedgerEntry creation API
- permits DONE with lifecycle override API
- permits DONE based on compilation, logs, timestamps, runtime success, route existence, generated code, or happy path

## CLASSIFICATION


### SOURCE_FACT:

- L00–L10 are correctness authority.
- L10 owns verification authority.
- I00 is source indexing and traceability authority.
- IMP-INDEX is implementation/codegen routing authority.
- IMP files are non-authoritative implementation guidance.
- TEST-001 through TEST-012 must verify higher-layer source rules.
- Verification must be behavior-level and source-traceable.
- Absence of verification is not proof of correctness.
- Generated implementation, routing, logs, timestamps, runtime success, and compilation are not proof.

### INFERENCE:

- Completion must be gated by source-mapped test evidence, not feature completion.
- CI must fail closed because partial or skipped proof creates false confidence.
- Done criteria must include routing, dependency, operation-scope, boundary, API, authorization, persistence, and test gates.
- The safest completion default is NOT_DONE until every gate passes.
- Proof artifacts are useful only if they map source IDs to implementation files, TEST-* coverage, and observed results.

### ASSUMPTION:

- MVP CI uses TypeScript, Next.js, Prisma, PostgreSQL, and Jest.
- CI can run schema validation, typecheck, build, and TEST-001 through TEST-012.
- A proof summary may be generated only if routed or explicitly requested.
- Static checks may be implemented later if routed.

These assumptions are implementation guidance only.

They MUST NOT define source correctness or verification authority.

### IMPLEMENTATION_GUIDANCE_ONLY:

- concrete CI command names
- proof summary template
- release-readiness labels
- final checklist wording
- CI status labels
- done review packet fields
- static check categories

### SOURCE_GAP:

No blocking SOURCE_GAP is identified within this IMP-11 document.

### SOURCE_CONFLICT:

No blocking SOURCE_CONFLICT is identified within this IMP-11 document.

## LOCK_STATUS


READY_FOR_USE only if:

- filename matches the IMP-INDEX registry entry for IMP-11
- IMP-INDEX defines IMPLEMENTATION_DOCUMENT_REGISTRY
- IMP-INDEX defines TARGET_FILE_ROUTING_MATRIX
- IMP-INDEX defines VERIFICATION_FILE_ROUTING_MATRIX
- I00 indexes all source-owned IDs used by proof gates
- L10 defines TEST-001 through TEST-012
- L03 defines INV-001 through INV-010
- L04 defines FAIL-001 through FAIL-010
- L05 defines FSM-001 through FSM-010
- L06 defines ARCH-001 through ARCH-009
- L07 defines SCHEMA-001 through SCHEMA-013
- L08 defines API-001 through API-013
- L09 defines AUTHZ-001 through AUTHZ-012
- IMP-00 defines global generation/proof protocol
- IMP-01 through IMP-10 exist or are scheduled
- generated implementation treats missing proof as NOT_DONE
- generated implementation does not treat files, routing, logs, timestamps, compilation, runtime success, happy-path behavior, or generated code as proof

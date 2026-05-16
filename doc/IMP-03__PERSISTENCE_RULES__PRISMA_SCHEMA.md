# IMP-03__PERSISTENCE_RULES__PRISMA_SCHEMA.md

## AUTHORITY_STATUS

NON_AUTHORITATIVE_IMPLEMENTATION_GUIDANCE

This file defines Prisma and persistence implementation guidance for DLE-2.

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
- treat Prisma schema as proof
- treat database constraints alone as proof
- treat migration, seed, compilation, runtime success, logs, or timestamps as proof

If this file conflicts with L00–L10, L00–L10 win.

If this file conflicts with I00, I00 wins for lookup and traceability metadata.

If this file conflicts with IMP-INDEX, IMP-INDEX wins for routing, dependency allowance, target ownership, required source IDs, required IMP files, proof tests, and generation-packet shape.

If this file appears to authorize an unrouted model, helper, migration, Prisma wrapper, generated-client wrapper, repository, operation, dependency, or persistence file, classify as ROUTING_GAP.

---

## PURPOSE

Guide the concrete Prisma/PostgreSQL persistence implementation of the DLE-2 Transfer-only MVP while preserving L07 as the source authority for persistence meaning.

IMP-03 guides:
- required persisted entity models
- relation fields
- uniqueness constraints
- indexes
- enums
- numeric representation
- idempotency persistence
- LedgerEntry immutability representation
- Balance derivation / cached Balance handling
- seed data limits
- Persistence Boundary access rules
- persistence-to-TEST coverage mapping

IMP-03 does not replace L07.

IMP-03 does not prove persistence correctness.

Persistence correctness requires:
- source rule references
- routed implementation ownership
- schema constraints where possible
- Persistence Boundary enforcement
- invalid-path rejection
- TEST-* coverage
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
- L10__TEST_SPEC__VERIFICATION__SYSTEM.md
- IMP-INDEX__IMPLEMENTATION_ROUTING__CODEGEN_ENTRY.md
- IMP-00__GLOBAL_CODEGEN_PROTOCOL.md
- IMP-01__FILE_MANIFEST__MVP_STRUCTURE.md
- IMP-02__DEPENDENCY_RULES__BOUNDARY_IMPORTS.md

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
prisma/schema.prisma
prisma/seed.ts
src/server/ledger/persistence-boundary.ts
```

Generated implementation remains subordinate to L00–L10, I00, IMP-INDEX, and routed IMP guidance.

---

## SCOPE

IMP-03 applies to:

```txt
prisma/schema.prisma
prisma/seed.ts
src/server/ledger/persistence-boundary.ts
docker-compose.yml
.env.example
```

IMP-03 informs TEST coverage for:

```txt
TEST-001
TEST-002
TEST-003
TEST-004
TEST-005
TEST-006
TEST-007
TEST-008
TEST-009
TEST-010
```

IMP-03 does not own:
- API route behavior
- authorization policy
- lifecycle transition meaning
- Balance Change authorization
- semantic LedgerEntry creation authority
- transaction coordination
- verification authority
- observability / audit rules
- CI completion gates

---

## CLASSIFICATION_RULE

If persistence generation cannot proceed cleanly, classify before generating.

| Classification | Meaning | Required action |
|---|---|---|
| READY_TO_GENERATE | Target persistence file and schema decisions are routed | Proceed |
| GENERATION_PACKET_INCOMPLETE | Required schema/persistence packet fields are missing or ambiguous | Stop; complete packet |
| ROUTING_GAP | Target file, helper, migration, Prisma wrapper, import, dependency, or schema-adjacent file is not routed | Stop; report missing route |
| SOURCE_GAP | Required source-owned persistence rule or ID is missing from L00–L10 / I00 | Stop; report missing source authority |
| SOURCE_CONFLICT | Authorities conflict in a way that changes persistence legality | Stop; do not choose by preference |
| INFERENCE | Derived implementation guidance from source/routing facts | Label as non-authoritative |
| ASSUMPTION | Reversible implementation choice not specified by source/routing | Label and minimize |
| IMPLEMENTATION_GUIDANCE_ONLY | Useful persistence guidance outside L00–L10 authority | May guide; cannot prove |

ROUTING_GAP is the default for missing Prisma targets, helper files, migrations, Prisma wrappers, repositories, or generated-client imports.

SOURCE_GAP is only for missing L00–L10 / I00 authority.

---

## PERSISTENCE_IMPLEMENTATION_MODEL

The MVP persistence implementation uses:

```txt
PostgreSQL
Prisma ORM
prisma/schema.prisma
prisma/seed.ts
src/server/ledger/persistence-boundary.ts
```

These are implementation choices only.

The required persisted entity set is:

```txt
Account
Asset
Balance
Transfer
LedgerEntry
Request
```

The source persistence constraint set is:

```txt
SCHEMA-001 through SCHEMA-013
```

Where Prisma/PostgreSQL cannot fully enforce a source rule alone, enforcement must be routed through:
- Persistence Boundary
- Consistency Boundary
- Lifecycle Control
- Balance Control
- Ledger Control
- mapped TEST-* coverage

Prisma schema constraints are necessary but not sufficient proof.

---

## REQUIRED_PERSISTED_ENTITY_MATRIX

| Source entity | Required Prisma model | Required source references | Key constraints |
|---|---|---|---|
| Account | `Account` | ENT-001, SCHEMA-001, SCHEMA-002 | stable ID; local ownership scope |
| Asset | `Asset` | ENT-003, SCHEMA-001, SCHEMA-002 | stable ID; unique code; local denomination |
| Balance | `Balance` | ENT-002, SCHEMA-001, SCHEMA-003, SCHEMA-004 | exactly one Account; exactly one Asset; unique Account-Asset pair |
| Transfer | `Transfer` | ENT-004, SCHEMA-001, SCHEMA-007, SCHEMA-008 | one Request; source Account; destination Account; one Asset; L05 state |
| LedgerEntry | `LedgerEntry` | ENT-005, SCHEMA-001, SCHEMA-005, SCHEMA-006 | required Transfer, Account, Asset; immutable through routed app paths |
| Request | `Request` | ENT-006, SCHEMA-001, SCHEMA-009, SCHEMA-010 | unique external identity; persisted outcome for idempotency |

Generated schema MUST NOT add persisted models for unsupported Balance-Affecting Operations.

Forbidden persisted operation models include:

```txt
Deposit
Withdrawal
Adjustment
Settlement
Reversal
Exchange
JournalOperation
ExternalTransfer
```

unless source authority and IMP-INDEX routing are updated first.

---

## TARGET_RULE_MATRIX

| Target file | Boundary owner | Required source references | Required IMP files | Proof tests |
|---|---|---|---|---|
| `prisma/schema.prisma` | Persistence Boundary | ENT-001, ENT-002, ENT-003, ENT-004, ENT-005, ENT-006, FSM-001, SCHEMA-001 through SCHEMA-013 | IMP-00, IMP-01, IMP-03 | TEST-001 through TEST-010 |
| `prisma/seed.ts` | Persistence Boundary | ENT-001, ENT-002, ENT-003, ENT-006, SCHEMA-001, SCHEMA-002, SCHEMA-003, SCHEMA-013 | IMP-00, IMP-03, IMP-08 | TEST-003, TEST-005, TEST-006, TEST-009 |
| `src/server/ledger/persistence-boundary.ts` | ARCH-007 | ARCH-007, ARCH-009, INV-003, INV-009, SCHEMA-001 through SCHEMA-013 | IMP-00, IMP-02, IMP-03, IMP-04 | TEST-003, TEST-004, TEST-007, TEST-009, TEST-010 |

`persistence-boundary.ts` owns physical durable reads and writes only.

It MUST NOT own:
- business-validity decisions
- Balance Change authorization
- semantic LedgerEntry authorization
- lifecycle transition decisions
- API response construction
- authorization policy
- operation execution orchestration

---

## MODEL_IMPLEMENTATION_MATRIX

| Model | Required fields / relations | Required constraints | Must not represent |
|---|---|---|---|
| Account | `id`, timestamps, Balances, LedgerEntries, source Transfers, destination Transfers | primary identity | external identity authority |
| Asset | `id`, `code`, `name`, timestamps, Balances, Transfers, LedgerEntries | `code @unique` | external settlement authority |
| Balance | `id`, `accountId`, `assetId`, `amount`, timestamps, Account, Asset | `@@unique([accountId, assetId])`; non-null Account/Asset | source of truth overriding LedgerEntry-derived state |
| Transfer | `id`, `requestId`, source/destination Account IDs, `assetId`, `amount`, `state`, timestamps, Request, Account, Asset, LedgerEntries | `requestId @unique`; state restricted to L05 values | external settlement, unsupported operation type, API-controlled lifecycle |
| LedgerEntry | `id`, `transferId`, `accountId`, `assetId`, `amountDelta`, `direction`, `createdAt`, Transfer, Account, Asset | non-null Transfer/Account/Asset; no routed update/delete methods | optional log metadata, mutable correction record, direct API-created record |
| Request | `id`, `identity`, `operationType`, `status`, persisted response/error metadata, timestamps, optional Transfer | `identity @unique`; MVP operation type limited to Transfer | timestamp/in-memory/cache idempotency authority, multiple MVP operation types |

---

## NUMERIC_REPRESENTATION_RULE

Balance-affecting arithmetic MUST NOT use JavaScript `number`.

Prisma implementation MUST NOT use:

```txt
Float
Double
Int for general balance-affecting value semantics
JavaScript number
```

Recommended representation:

```txt
Decimal @db.Decimal(38, 0)
```

Recommended semantic label:

```txt
atomic units
```

Implementation guidance:
- Store amounts as integer-valued Decimal atomic units.
- Use Prisma Decimal / Decimal.js-compatible values in application code.
- Reject non-integer atomic-unit input if using `Decimal(38, 0)`.
- Do not infer Asset decimal places unless explicitly routed.
- Do not round Balance-affecting values unless explicitly routed.

This numeric representation is implementation guidance only.

It does not define source correctness.

If a target file needs different precision, scale, or value semantics and no routed guidance exists, classify as ROUTING_GAP or GENERATION_PACKET_INCOMPLETE.

---

## TEMPORAL_METADATA_RULE

Timestamps may be stored only as metadata.

Allowed timestamp fields:

```txt
createdAt
updatedAt
executedAt
failedAt
completedAt
```

Timestamps MUST NOT be used as:
- replay authority
- ordering authority
- idempotency authority
- lifecycle authority
- authorization authority
- proof of correctness
- substitute for Request identity
- substitute for LedgerEntry traceability
- substitute for atomic transaction guarantees

Use one captured timestamp within one transaction when target-specific guidance requires metadata coherence.

Do not use timestamps to distinguish duplicate Requests.

---

## ENUM_RULES

### TransferState

Required enum values:

```prisma
enum TransferState {
  REQUESTED
  VALIDATED
  EXECUTED
  FAILED
}
```

No other Transfer lifecycle states are valid for MVP.

Forbidden values:

```txt
PENDING
APPROVED
SETTLED
REVERSED
CANCELLED
EXPIRED
PROCESSING
COMMITTED
ROLLED_BACK
```

unless L05 and IMP-INDEX are updated first.

### LedgerEntryDirection

Recommended implementation enum:

```prisma
enum LedgerEntryDirection {
  DEBIT
  CREDIT
}
```

This enum is implementation guidance only.

### RequestOperationType

Recommended implementation enum:

```prisma
enum RequestOperationType {
  TRANSFER
}
```

No other operation type is allowed in MVP.

### RequestStatus

Recommended implementation enum:

```prisma
enum RequestStatus {
  RECEIVED
  PROCESSING
  COMPLETED
  FAILED
}
```

RequestStatus MUST NOT redefine Transfer lifecycle state.

RequestStatus MUST NOT be used as lifecycle authority.

---

## PRISMA_SCHEMA_BLUEPRINT

The generated `prisma/schema.prisma` should follow this blueprint unless IMP-INDEX or stronger source/routing constraints require a change.

This is implementation guidance only.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum TransferState {
  REQUESTED
  VALIDATED
  EXECUTED
  FAILED
}

enum LedgerEntryDirection {
  DEBIT
  CREDIT
}

enum RequestOperationType {
  TRANSFER
}

enum RequestStatus {
  RECEIVED
  PROCESSING
  COMPLETED
  FAILED
}

model Account {
  id                   String        @id @default(cuid())
  createdAt            DateTime      @default(now())
  updatedAt            DateTime      @updatedAt

  balances             Balance[]
  ledgerEntries         LedgerEntry[]
  sourceTransfers       Transfer[]    @relation("TransferSourceAccount")
  destinationTransfers  Transfer[]    @relation("TransferDestinationAccount")

  @@map("accounts")
}

model Asset {
  id             String        @id @default(cuid())
  code           String        @unique
  name           String
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  balances       Balance[]
  transfers      Transfer[]
  ledgerEntries  LedgerEntry[]

  @@map("assets")
}

model Balance {
  id         String   @id @default(cuid())
  accountId  String
  assetId    String
  amount     Decimal  @db.Decimal(38, 0)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  account    Account  @relation(fields: [accountId], references: [id], onDelete: Restrict)
  asset      Asset    @relation(fields: [assetId], references: [id], onDelete: Restrict)

  @@unique([accountId, assetId])
  @@index([assetId])
  @@map("balances")
}

model Transfer {
  id                   String        @id @default(cuid())
  requestId            String        @unique
  sourceAccountId      String
  destinationAccountId String
  assetId              String
  amount               Decimal       @db.Decimal(38, 0)
  state                TransferState
  createdAt            DateTime      @default(now())
  updatedAt            DateTime      @updatedAt
  executedAt           DateTime?
  failedAt             DateTime?

  request              Request       @relation(fields: [requestId], references: [id], onDelete: Restrict)
  sourceAccount        Account       @relation("TransferSourceAccount", fields: [sourceAccountId], references: [id], onDelete: Restrict)
  destinationAccount   Account       @relation("TransferDestinationAccount", fields: [destinationAccountId], references: [id], onDelete: Restrict)
  asset                Asset         @relation(fields: [assetId], references: [id], onDelete: Restrict)
  ledgerEntries        LedgerEntry[]

  @@index([sourceAccountId])
  @@index([destinationAccountId])
  @@index([assetId])
  @@index([state])
  @@map("transfers")
}

model LedgerEntry {
  id          String               @id @default(cuid())
  transferId  String
  accountId   String
  assetId     String
  amountDelta Decimal              @db.Decimal(38, 0)
  direction   LedgerEntryDirection
  createdAt   DateTime             @default(now())

  transfer    Transfer             @relation(fields: [transferId], references: [id], onDelete: Restrict)
  account     Account              @relation(fields: [accountId], references: [id], onDelete: Restrict)
  asset       Asset                @relation(fields: [assetId], references: [id], onDelete: Restrict)

  @@index([transferId])
  @@index([accountId, assetId])
  @@index([assetId])
  @@map("ledger_entries")
}

model Request {
  id             String                @id @default(cuid())
  identity       String                @unique
  operationType  RequestOperationType
  status         RequestStatus
  responseStatus Int?
  responseBody   Json?
  errorCode      String?
  createdAt      DateTime              @default(now())
  updatedAt      DateTime              @updatedAt
  completedAt    DateTime?

  transfer       Transfer?

  @@index([operationType])
  @@index([status])
  @@map("requests")
}
```

---

## SCHEMA_CONSTRAINT_MAPPING

| Source ID | Prisma / implementation guidance |
|---|---|
| SCHEMA-001 | Models: `Account`, `Asset`, `Balance`, `Transfer`, `LedgerEntry`, `Request` |
| SCHEMA-002 | `id` primary keys on all persisted models |
| SCHEMA-003 | `Balance.accountId`, `Balance.assetId`, `@@unique([accountId, assetId])` |
| SCHEMA-004 | `LedgerEntry` history plus `Balance.amount` as non-authoritative cached representation; reconstruction tested |
| SCHEMA-005 | Required `LedgerEntry.transferId`, `LedgerEntry.accountId`, `LedgerEntry.assetId` relations |
| SCHEMA-006 | No routed update/delete persistence methods for LedgerEntry; TEST-002 |
| SCHEMA-007 | Required `Transfer.sourceAccountId`, `Transfer.destinationAccountId`, `Transfer.assetId` relations |
| SCHEMA-008 | `TransferState` enum limited to `REQUESTED`, `VALIDATED`, `EXECUTED`, `FAILED` |
| SCHEMA-009 | `Request.identity @unique` |
| SCHEMA-010 | `Request` persisted outcome fields plus unique `Transfer.requestId`; duplicate identity returns same outcome |
| SCHEMA-011 | Transactional write grouping through Consistency Boundary and Persistence Boundary |
| SCHEMA-012 | Shared `assetId` across Balance, Transfer, LedgerEntry; cross-row consistency enforced by controls/tests |
| SCHEMA-013 | Local PostgreSQL persistence only; no external-system correctness dependency |

Where Prisma cannot fully enforce a source rule alone, implementation MUST rely on routed control code plus TEST-* coverage.

---

## DATABASE_CONSTRAINT_RULES

Generated Prisma schema MUST include where possible:

| Constraint | Required mechanism |
|---|---|
| Entity identity | `@id` on all models |
| Request identity uniqueness | `Request.identity @unique` |
| Account-Asset Balance uniqueness | `Balance @@unique([accountId, assetId])` |
| Transfer-to-Request one-to-one | `Transfer.requestId @unique` |
| Transfer lifecycle state domain | `TransferState` enum |
| Required LedgerEntry relations | non-null `transferId`, `accountId`, `assetId` |
| Required Transfer relations | non-null `sourceAccountId`, `destinationAccountId`, `assetId` |
| Required Balance relations | non-null `accountId`, `assetId` |
| Deletion restriction for referenced records | `onDelete: Restrict` where supported |
| Numeric precision | `Decimal @db.Decimal(38, 0)` for balance-affecting values |

Recommended indexes:

```txt
Balance.assetId
Transfer.sourceAccountId
Transfer.destinationAccountId
Transfer.assetId
Transfer.state
LedgerEntry.transferId
LedgerEntry.accountId + LedgerEntry.assetId
LedgerEntry.assetId
Request.operationType
Request.status
```

Indexes are performance guidance.

Indexes are not proof.

---

## NON_ENFORCEABLE_BY_SCHEMA_RULES

The following cannot be fully proven by Prisma schema alone:

| Source requirement | Why schema alone is insufficient | Required enforcement |
|---|---|---|
| LedgerEntry immutability | Prisma cannot globally prevent all update/delete calls | Persistence Boundary exposes no update/delete; TEST-002 |
| Replay determinism | Schema stores history but does not prove reconstruction | Read derivation and TEST-003 |
| Atomic operation representation | Schema relations do not guarantee transaction grouping | Consistency Boundary and TEST-004 |
| Duplicate Request same outcome | Unique identity helps but outcome behavior is procedural | Idempotency Control and TEST-007 |
| Asset consistency | Cross-row semantic equality needs control logic | Transfer validation, Balance Control, Ledger Control, TEST-006 |
| Transfer lifecycle execution timing | Enum restricts values but not transitions | Lifecycle Control and TEST-008 |
| Operation completeness | Schema cannot prove LedgerEntry meaning/count alone | Ledger Control, Persistence Boundary, TEST-010 |
| Bounded correctness | Schema cannot prove runtime dependency absence | Dependency checks and TEST-009 |

If generated code treats Prisma schema alone as sufficient proof for any of these, classify as PROOF_VIOLATION.

---

## PERSISTENCE_BEHAVIOR_RULES

### Balance representation

Balance exists as a persisted entity because L07 requires persistence representation of Balance.

Allowed pattern:

```txt
Balance.amount = operational cached representation
LedgerEntry history = reconstruction source for proof
```

Forbidden:
- Balance amount as sole source of truth
- Balance amount updated without LedgerEntry
- Balance amount updated directly by API route
- Balance amount updated outside Consistency Boundary
- Balance amount corrected manually without LedgerEntry
- Balance amount treated as proof without TEST-003 coverage

### LedgerEntry immutability

LedgerEntry is append-only implementation data.

`persistence-boundary.ts` MUST NOT expose:

```txt
updateLedgerEntry
deleteLedgerEntry
patchLedgerEntry
replaceLedgerEntry
upsertLedgerEntry
modifyLedgerEntryAmount
reassignLedgerEntryTransfer
reassignLedgerEntryAccount
reassignLedgerEntryAsset
```

Allowed method categories:

```txt
createLedgerEntriesForApprovedTransferIntent
findLedgerEntriesByTransferId
findLedgerEntriesByAccountAsset
```

If correction is required, classify as SOURCE_GAP unless source authority defines correction behavior.

Do not invent correction, reversal, adjustment, or repair operations.

### Request idempotency

Request identity is the durable idempotency anchor.

Required behavior:
- `Request.identity` is unique.
- Duplicate identity resolves to the same persisted Request row.
- Duplicate identity points to the same Transfer outcome when one exists.
- Duplicate Request does not create a second Transfer.
- Duplicate Request does not create additional LedgerEntries.
- Duplicate Request does not alter Balance more than once.
- Request outcome fields preserve enough response meaning to return non-divergent duplicate responses.

Forbidden:
- timestamp comparison
- in-memory cache
- client-side retry assumption
- log inspection
- best-effort deduplication
- external-system dependency

### Transfer persistence

Transfer is the only MVP Balance-Affecting Operation persisted as an operation.

Transfer persistence MUST preserve:
- one source Account
- one destination Account
- exactly one Asset
- one associated Request
- lifecycle state from L05
- amount using non-JavaScript-number representation
- relation to LedgerEntries

Transfer persistence MUST NOT include:
- unsupported operation subtype
- external settlement status
- distributed coordination status
- lifecycle states outside L05
- direct mutation authority
- API-controlled lifecycle state

### Asset consistency

For MVP Transfer:
- Transfer has one `assetId`.
- LedgerEntries for the Transfer use the same `assetId`.
- affected Balances use the same `assetId`.
- source and destination Balance rows are for the same Asset.
- cross-asset Transfer is unsupported.

Forbidden:
- `sourceAssetId` + `destinationAssetId` on Transfer
- implicit currency conversion
- cross-asset Balance Change
- LedgerEntry asset mismatch with Transfer asset
- Balance asset mismatch with LedgerEntry asset

unless source authority and routing are updated first.

### Atomicity

All writes for one executed Transfer must be coordinated inside one Consistency Boundary transaction.

Atomic write set generally includes:

```txt
Request reservation / outcome update
Transfer lifecycle state persistence
Balance amount updates
LedgerEntry creation
```

Forbidden:
- LedgerEntries in one transaction and Balance update later
- Balance update before LedgerEntry creation can succeed
- Transfer marked EXECUTED before required LedgerEntries exist
- Request outcome marked successful before operation write set completes
- Balance-affecting writes outside Consistency Boundary

### Bounded persistence

Persistence correctness must remain inside the Bounded System.

Allowed:
- PostgreSQL database in local Docker / deployed managed PostgreSQL
- Prisma client
- single application-owned Persistence Boundary

Forbidden correctness dependencies:
- external settlement system
- distributed database coordination
- event streaming correctness
- blockchain / consensus
- message queue replay as correctness authority
- webhook confirmation
- third-party payment state
- log aggregation
- analytics store
- cache

---

## PRISMA_CLIENT_ACCESS_RULE

Direct Prisma client access is allowed only where routed.

Allowed:

```txt
src/server/ledger/persistence-boundary.ts
prisma/seed.ts
```

Forbidden:

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
tests/* unless routed by IMP-08 / IMP-11
```

Do not create unless IMP-INDEX routes first:

```txt
src/lib/prisma.ts
src/db/*
src/server/db/*
src/persistence/*
```

If Prisma access appears needed outside routed files, classify as ROUTING_GAP.

---

## PERSISTENCE_BOUNDARY_METHOD_RULE

`persistence-boundary.ts` should expose narrow methods aligned to routed control authority.

Allowed method categories:
- Request identity lookup
- Request reservation persistence
- Request outcome persistence
- Transfer persistence
- Balance lookup by Account + Asset
- approved Balance update within transaction
- approved LedgerEntry creation within transaction
- LedgerEntry read by Transfer
- LedgerEntry read by Account + Asset
- derived read support

Forbidden method categories:
- business validation
- authorization decision
- lifecycle transition decision
- Balance Change authorization
- LedgerEntry semantic approval
- API Response construction
- direct operation orchestration
- external settlement calls
- unbounded raw query escape hatches
- general-purpose update/delete repository

Persistence Boundary may receive transaction context when routed.

Persistence Boundary MUST NOT open the Balance-Affecting Operation transaction unless IMP-INDEX and IMP-04 explicitly route that authority.

---

## SEED_DATA_RULE

Seed data must support proof and local development without creating false correctness assumptions.

Allowed seed entities:

```txt
Account
Asset
Balance
Request only when non-executing or explicitly routed
```

Seed data SHOULD include:
- at least two Accounts
- at least one Asset
- one Balance per seeded Account/Asset pair
- deterministic seed identifiers or unique values where useful for tests

Seed data MUST NOT:
- create arbitrary LedgerEntries
- create executed Transfers outside routed execution path
- create LedgerEntries without valid Transfer execution
- create duplicate Request identities
- create unsupported Balance-Affecting Operations
- create cross-asset operation data
- bypass lifecycle rules
- imply that seed state proves correctness

If tests need special fixtures, route through IMP-08 / IMP-11 rather than broadening `prisma/seed.ts`.

---

## MIGRATION_RULE

Prisma migrations are implementation artifacts.

A migration file may be generated only if routed by IMP-INDEX or explicitly requested as the one target file.

Generated migration files MUST NOT:
- introduce models absent from `prisma/schema.prisma`
- introduce unsupported operation tables
- weaken required constraints
- remove uniqueness constraints
- remove relation constraints
- add external-system correctness dependencies
- add triggers or raw SQL behavior that changes source meaning without routing

If raw SQL migration behavior is needed to enforce LedgerEntry immutability or advanced constraints, classify as ROUTING_GAP unless migration routing exists.

Do not silently generate migration files while generating `prisma/schema.prisma`.

---

## FORBIDDEN_SCHEMA_SHAPES

Generated Prisma schema MUST NOT include:

```txt
model Deposit
model Withdrawal
model Adjustment
model Settlement
model Reversal
model ExternalLedgerEntry
model Event
model OutboxEvent
model BlockchainTransaction
model StreamOffset
model ConsensusRecord
```

Generated Prisma schema MUST NOT include:

```txt
Float amount
Float amountDelta
Int amount for general balance-affecting arithmetic
String state without enum restriction
optional LedgerEntry.accountId
optional LedgerEntry.assetId
optional LedgerEntry.transferId
optional Balance.accountId
optional Balance.assetId
optional Transfer.sourceAccountId
optional Transfer.destinationAccountId
optional Transfer.assetId
```

Generated Prisma schema MUST NOT permit:
- LedgerEntry without Transfer
- LedgerEntry without Account
- LedgerEntry without Asset
- Balance without Account
- Balance without Asset
- Transfer without source Account
- Transfer without destination Account
- Transfer without Asset
- Transfer state outside L05
- duplicate Request identity
- duplicate Balance for same Account/Asset pair

---

## GENERATION_PACKET_REQUIREMENTS

Before generating `prisma/schema.prisma`, resolve:

```txt
Target file: prisma/schema.prisma
Boundary owner: Persistence Boundary
Source references: ENT-001, ENT-002, ENT-003, ENT-004, ENT-005, ENT-006, FSM-001, SCHEMA-001 through SCHEMA-013
Required IMP files: IMP-00, IMP-01, IMP-03
Allowed dependencies: none inside schema file
Forbidden dependencies: source imports, runtime imports, API imports, server imports, test imports
Mutation authority: None
Transaction authority: None
Persistence authority: Physical representation only
LedgerEntry authority: None
Balance authority: None
API exposure: None
Proof tests: TEST-001 through TEST-010
Output mode: One target file only
Classification: READY_TO_GENERATE
```

Before generating `prisma/seed.ts`, resolve:

```txt
Target file: prisma/seed.ts
Boundary owner: Persistence Boundary
Source references: ENT-001, ENT-002, ENT-003, ENT-006, SCHEMA-001, SCHEMA-002, SCHEMA-003, SCHEMA-013
Required IMP files: IMP-00, IMP-03, IMP-08
Allowed dependencies: Prisma client / generated Prisma types only unless routed
Forbidden dependencies: src/server/*, src/domain/* execution logic, src/app/*, tests/* unless routed
Mutation authority: Write seed data only
Transaction authority: None unless explicitly routed
Persistence authority: Physical write for seed data only
LedgerEntry authority: None
Balance authority: Persist seed Balance rows only
API exposure: None
Proof tests: TEST-003, TEST-005, TEST-006, TEST-009
Output mode: One target file only
Classification: READY_TO_GENERATE
```

Before generating `src/server/ledger/persistence-boundary.ts`, resolve:

```txt
Target file: src/server/ledger/persistence-boundary.ts
Boundary owner: ARCH-007 Persistence Boundary
Source references: ARCH-007, ARCH-009, INV-003, INV-009, SCHEMA-001 through SCHEMA-013
Required IMP files: IMP-00, IMP-02, IMP-03, IMP-04
Allowed dependencies: Prisma client / generated Prisma types only
Forbidden dependencies: API routes, request-boundary, authorization-control, lifecycle-control business decisions, balance-control decisions, ledger-control decisions, domain execution logic unless explicitly routed
Mutation authority: Physical write only
Transaction authority: Receive
Persistence authority: Read / write physical durable state
LedgerEntry authority: Persist approved intent only
Balance authority: Persist approved change only
API exposure: Internal
Proof tests: TEST-003, TEST-004, TEST-007, TEST-009, TEST-010
Output mode: One target file only
Classification: READY_TO_GENERATE
```

---

## POST_GENERATION_VALIDATION

After generating persistence-related files, check:

| Label | Meaning |
|---|---|
| MISSING_REQUIRED_MODEL | Required Account, Asset, Balance, Transfer, LedgerEntry, or Request model is missing |
| UNSUPPORTED_OPERATION_MODEL | Prisma schema includes unsupported Balance-Affecting Operation model |
| IDENTITY_CONSTRAINT_GAP | Required identity / uniqueness constraint is missing |
| BALANCE_UNIQUENESS_GAP | `Balance(accountId, assetId)` uniqueness is missing |
| REQUEST_IDEMPOTENCY_GAP | `Request.identity` uniqueness or persisted outcome representation is missing |
| LEDGER_RELATION_GAP | LedgerEntry lacks required Account, Asset, or Transfer relation |
| TRANSFER_RELATION_GAP | Transfer lacks source Account, destination Account, Asset, or Request relation |
| INVALID_LIFECYCLE_ENUM | Transfer state permits values outside L05-defined states |
| NUMERIC_REPRESENTATION_VIOLATION | Balance-affecting values use Float, JavaScript number semantics, or unrouted numeric representation |
| TIMESTAMP_AUTHORITY_VIOLATION | Timestamp is used as replay, ordering, idempotency, lifecycle, authorization, or proof authority |
| LEDGER_MUTABILITY_LEAK | Update/delete/upsert LedgerEntry authority is exposed without source routing |
| PERSISTENCE_BYPASS | Direct Prisma access exists outside routed files |
| BUSINESS_LOGIC_IN_PERSISTENCE | Persistence Boundary makes business-validity, lifecycle, authorization, Balance Control, or Ledger Control decisions |
| PARTIAL_OPERATION_REPRESENTATION | Schema/code can represent partial operation state as complete |
| EXTERNAL_CORRECTNESS_DEPENDENCY | Persistence state depends on external systems for correctness |
| PROOF_VIOLATION | Schema, migration, seed, logs, compile success, or runtime success treated as correctness proof |

If any label applies, generated persistence output is not complete.

---

## TEST_MAPPING

| Persistence concern | Source references | Required tests |
|---|---|---|
| LedgerEntry-backed Balance Change traceability | INV-001, SCHEMA-004, SCHEMA-005 | TEST-001 |
| LedgerEntry immutability | INV-002, SCHEMA-006 | TEST-002 |
| Replay determinism / reconstruction | INV-003, SCHEMA-004, SCHEMA-006 | TEST-003 |
| Atomic operation representation | INV-004, SCHEMA-011 | TEST-004 |
| Balance constraints | INV-005, SCHEMA-003 | TEST-005 |
| Asset consistency | INV-006, SCHEMA-003, SCHEMA-007, SCHEMA-012 | TEST-006 |
| Request idempotency | INV-007, SCHEMA-009, SCHEMA-010 | TEST-007 |
| Transfer lifecycle state persistence | INV-008, FSM-001, SCHEMA-008 | TEST-008 |
| Bounded persistence | INV-009, SCHEMA-013 | TEST-009 |
| Operation completeness | INV-010, SCHEMA-005, SCHEMA-011 | TEST-010 |

IMP-03 may guide test-relevant persistence implementation.

Verification authority remains with L10.

Concrete test implementation belongs to IMP-08.

Completion and CI gates belong to IMP-11.

---

## PROOF_LIMITS

The following are not proof of persistence correctness:
- Prisma schema exists
- migration succeeds
- seed succeeds
- database connection succeeds
- Prisma Client compiles
- TypeScript compiles
- relations are present
- indexes are present
- timestamps exist
- logs exist
- happy-path Transfer succeeds once
- no runtime exception occurred

Proof requires:
- source rule reference
- routed implementation ownership
- invalid-path rejection
- TEST-* coverage
- observed passing behavior

Persistence proof is incomplete until mapped TEST-* cases pass.

---

## TRACEABILITY

| Section | Basis |
|---|---|
| AUTHORITY_STATUS | I00, IMP-INDEX |
| PURPOSE | L07, IMP-INDEX |
| DEPENDS_ON | I00, L00–L07, L10, IMP-INDEX, IMP-00, IMP-01, IMP-02 |
| SOURCE_AUTHORITY_ORDER | I00, IMP-INDEX |
| SCOPE | IMP-INDEX TARGET_FILE_ROUTING_MATRIX |
| CLASSIFICATION_RULE | IMP-00, IMP-INDEX |
| PERSISTENCE_IMPLEMENTATION_MODEL | L07, IMP-INDEX |
| REQUIRED_PERSISTED_ENTITY_MATRIX | L01, L07, SCHEMA-001 |
| TARGET_RULE_MATRIX | IMP-INDEX |
| MODEL_IMPLEMENTATION_MATRIX | L01, L07 |
| NUMERIC_REPRESENTATION_RULE | IMP-00, L03, L07 |
| TEMPORAL_METADATA_RULE | IMP-00, L10 |
| ENUM_RULES | L05, L07 |
| PRISMA_SCHEMA_BLUEPRINT | L07, IMP-INDEX |
| SCHEMA_CONSTRAINT_MAPPING | SCHEMA-001 through SCHEMA-013 |
| DATABASE_CONSTRAINT_RULES | L07 |
| NON_ENFORCEABLE_BY_SCHEMA_RULES | L03, L05, L06, L07, L10 |
| PERSISTENCE_BEHAVIOR_RULES | INV-001, INV-002, INV-003, INV-004, INV-006, INV-007, INV-009, SCHEMA-* |
| PRISMA_CLIENT_ACCESS_RULE | IMP-02, IMP-INDEX |
| PERSISTENCE_BOUNDARY_METHOD_RULE | L06, L07 |
| SEED_DATA_RULE | SCHEMA-001, SCHEMA-002, SCHEMA-003, SCHEMA-013 |
| MIGRATION_RULE | IMP-INDEX, L07 |
| FORBIDDEN_SCHEMA_SHAPES | L07, IMP-INDEX |
| GENERATION_PACKET_REQUIREMENTS | IMP-INDEX |
| POST_GENERATION_VALIDATION | IMP-00, IMP-INDEX |
| TEST_MAPPING | L10 |
| PROOF_LIMITS | L10, IMP-00 |
| VALIDITY_CONDITIONS | I00, L07, IMP-INDEX |

---

## VALIDITY_CONDITIONS

This file is VALID if it:
- remains non-authoritative implementation guidance
- preserves L00–L10 as correctness authority
- preserves I00 as source lookup and traceability authority
- preserves IMP-INDEX as implementation routing authority
- does not define source-owned IDs
- does not define new correctness rules
- does not redefine L07 persistence constraints
- guides `prisma/schema.prisma` without treating Prisma as proof
- includes all required MVP persisted entities
- preserves SCHEMA-001 through SCHEMA-013 as source-owned constraints
- preserves Request identity uniqueness
- preserves Account-Asset Balance uniqueness
- preserves LedgerEntry relationship integrity
- preserves Transfer relationship integrity
- preserves Transfer lifecycle-state representation
- prevents unsupported Balance-Affecting Operation persistence
- prevents direct Prisma access outside routed files
- prevents JavaScript-number balance-affecting arithmetic
- prevents timestamp-as-proof reasoning
- identifies what schema cannot prove alone
- routes proof back to TEST-* coverage

This file is INVALID if it:
- defines correctness authority
- defines source-owned IDs
- weakens or extends L00–L10
- overrides I00 lookup
- overrides IMP-INDEX routing
- permits unsupported operation models
- permits duplicate Request identity
- permits duplicate Account-Asset Balance rows
- permits LedgerEntry without Account, Asset, or Transfer
- permits Transfer without source Account, destination Account, or Asset
- permits Transfer lifecycle states outside L05
- permits Balance mutation that bypasses LedgerEntry history
- permits direct Prisma access outside routed files
- permits Persistence Boundary to make business-validity decisions
- treats Prisma schema as proof
- treats migration success as proof
- treats seed success as proof
- treats compilation or runtime success as proof

---

## CLASSIFICATION

SOURCE_FACT:
- L00–L10 are correctness authority.
- I00 is source indexing and traceability authority.
- IMP-INDEX is implementation/codegen routing authority.
- L07 defines persistence representation for Account, Asset, Balance, Transfer, LedgerEntry, and Request.
- L07 defines SCHEMA-001 through SCHEMA-013 as persistence constraints only.
- L07 requires persistence to preserve traceability, reconstruction, idempotency, atomicity, asset consistency, lifecycle-state validity, and bounded correctness.
- L06 defines Persistence Boundary as durable state storage boundary.
- L10 owns verification authority.

INFERENCE:
- Prisma/PostgreSQL can implement many L07 persistence constraints directly through models, relations, enums, uniqueness constraints, and indexes.
- Some source requirements cannot be fully proven by schema alone and require routed control logic plus TEST-* coverage.
- A cached Balance amount is acceptable only if LedgerEntry-derived reconstruction remains the proof path.
- Decimal atomic-unit storage reduces JavaScript-number arithmetic risk.

ASSUMPTION:
- MVP implementation uses Prisma with PostgreSQL.
- Balance-affecting amounts are represented as integer-valued Decimal atomic units using `Decimal @db.Decimal(38, 0)`.
- Request outcome persistence uses JSON response-body storage plus status/error metadata.

These assumptions are implementation guidance only.

They MUST NOT define source correctness.

IMPLEMENTATION_GUIDANCE_ONLY:
- concrete Prisma model names
- concrete field names
- concrete enum names for implementation-only enums
- index selections
- Decimal precision / scale
- seed data shape
- persistence-boundary method naming
- Prisma migration expectations

SOURCE_GAP:
- No blocking SOURCE_GAP is identified within this IMP-03 document.

SOURCE_CONFLICT:
- No blocking SOURCE_CONFLICT is identified within this IMP-03 document.

---

## LOCK_STATUS

READY_FOR_USE only if:
- filename matches the IMP-INDEX registry entry for IMP-03
- IMP-INDEX routes `prisma/schema.prisma`
- IMP-INDEX routes `prisma/seed.ts`
- IMP-INDEX routes `src/server/ledger/persistence-boundary.ts`
- I00 indexes all source-owned IDs used by persistence targets
- L07 defines SCHEMA-001 through SCHEMA-013
- L05 defines valid Transfer lifecycle states
- L06 defines Persistence Boundary ownership
- L10 defines TEST-001 through TEST-010
- IMP-00 defines global generation protocol
- IMP-01 exists or is scheduled and defines MVP file manifest
- IMP-02 exists or is scheduled and defines dependency/import legality
- generated Prisma schema remains subordinate to L07
- generated persistence code remains subordinate to L06 and L07
- Prisma access remains routed through `persistence-boundary.ts` unless IMP-INDEX routes another file
- generated implementation treats unrouted persistence helpers as ROUTING_GAP
- generated implementation does not treat schema, migration, seed, compilation, runtime success, logs, or timestamps as proof

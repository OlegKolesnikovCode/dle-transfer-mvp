# 🧾 Deterministic Ledger Engine

## 🛡️ Correctness is enforced, not assumed.

This is a constraint-driven ledger system engineered to prove correctness for Balance-Affecting Operations under concurrency, retry, and partial failure.

The MVP does one thing only:

> **Transfer value from one Account to another Account within a single bounded ledger system.**

This is not a generic fintech app.  
This is a correctness-first ledger kernel where invalid states are rejected, structurally blocked, or made unrepresentable.

The system enforces correctness through:

- 🧱 **Immutable LedgerEntries** — every Balance Change must be explainable by ledger history.
- ⚛️ **Atomic Consistency Boundary** — Transfer fully applies or does not apply.
- 🆔 **Idempotency Control** — duplicate Requests resolve to the same outcome without duplicate effects.
- 🚦 **Lifecycle Governance** — Transfer execution is controlled by explicit FSM rules.
- 🧮 **Balance Control** — Balance Changes are authorized only through the correct boundary.
- 📜 **Ledger Control** — LedgerEntries are created only through the correct boundary.
- 🙅 **Explicit Rejection** — invalid operations fail at the boundary instead of corrupting state.

[![Run Demo](https://img.shields.io/badge/Run%20the%20Demo-Blue?style=for-the-badge&logo=vercel&logoColor=white)](https://dle-transfer-mvp.vercel.app/)

---

# 🚀 Start Here: The 2-Minute Proof

Do not start by reading the code.

Start by trying to break the ledger.

Follow this sequence to verify the system’s integrity:

## ✅ Valid Transfer

Submit a valid Transfer Request.

Expected result:
- Transfer executes.
- source Balance changes.
- destination Balance changes.
- LedgerEntries explain the Balance Changes.
- Response maps to exactly one Request.

---

## 🔄 Atomic Rollback

Force a failure mid-operation.

Expected result:
- no partial Balance mutation.
- no partial LedgerEntry set.
- no Transfer represented as successfully executed.
- no successful Request outcome is persisted.

---

## 🆔 Duplicate Request Protection

Submit the same Request identity more than once.

Expected result:
- duplicate Request resolves to the same persisted outcome.
- no second Transfer executes.
- no extra LedgerEntries are created.
- no extra Balance Changes occur.

---

## 🚦 Lifecycle Enforcement

Attempt an invalid Transfer state transition.

Expected result:
- request is rejected.
- lifecycle rules are not bypassed.
- Balance Change does not occur outside valid execution.

---

## 🧱 Ledger Integrity

Attempt to mutate or delete a LedgerEntry.

Expected result:
- mutation is rejected or impossible through routed paths.
- ledger history remains append-only.
- replay determinism is preserved.

---

## 🧪 Run Proof Tests

```powershell
npm test
```

The system is not proven by one successful Transfer.

The system is proven by valid-path and invalid-path behavior.

# 🏗️ Enforcement Path

All Balance-Affecting Operations must pass through one non-bypassable control path:

**Request Boundary**  
→ **Authorization Evaluation**  
→ **Idempotency Control**  
→ **Consistency Boundary** {  
&nbsp;&nbsp;&nbsp;&nbsp;**Lifecycle Control**  
&nbsp;&nbsp;&nbsp;&nbsp;→ **Balance Control**  
&nbsp;&nbsp;&nbsp;&nbsp;→ **Ledger Control**  
&nbsp;&nbsp;&nbsp;&nbsp;→ **Persistence Boundary**  
}  
→ **Read Derivation Boundary**  
→ **Response**

No layer is allowed to silently take over another layer’s authority.

### Enforcement Responsibilities

| Boundary | Responsibility |
| :--- | :--- |
| **Request Boundary** | Accepts external Request input and forwards into the routed path |
| **Authorization Evaluation** | Determines whether the Request may invoke a Transfer |
| **Idempotency Control** | Resolves duplicate Request identity before execution |
| **Consistency Boundary** | Owns atomic execution and transaction coordination |
| **Lifecycle Control** | Enforces valid Transfer state transitions |
| **Balance Control** | Authorizes Balance Changes |
| **Ledger Control** | Creates LedgerEntry intent for executed Transfer |
| **Persistence Boundary** | Performs durable storage only |
| **Read Derivation Boundary** | Reads derived state without mutating anything |

# 💎 System Guarantees

Each guarantee exists to eliminate a specific failure class.

| Guarantee | ⚙️ Mechanism | 🚫 Failure Prevented |
| :--- | :--- | :--- |
| **Traceability** | Every Balance Change maps to LedgerEntries | Untraceable Balance Change |
| **Ledger Immutability** | LedgerEntries cannot be modified after creation | Mutable Ledger History |
| **Replay Determinism** | State is reconstructable from LedgerEntry history | Non-Reconstructable State |
| **Atomicity** | Transfer fully applies or does not apply | Partial Operation |
| **Balance Constraint Enforcement** | Balance Control validates Balance state | Invalid Balance State |
| **Asset Consistency** | Transfer, Balance, and LedgerEntries preserve one Asset meaning | Asset Inconsistency |
| **Idempotency** | Duplicate Requests resolve to one persisted outcome | Duplicate Execution Effect |
| **Lifecycle Governance** | Transfer executes only through valid FSM transitions | Lifecycle Governance Violation |
| **Bounded Consistency** | Correctness stays inside one bounded system | Boundary Violation |
| **Operation Completeness** | Executed Transfer is fully represented by LedgerEntries | Incomplete Operation Representation |

# 🔒 Transfer-Only MVP Scope

The MVP supports only one Balance-Affecting Operation:
- **Transfer**

The MVP does not support:
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
- ManualBalancePatch

Any new Balance-Affecting Operation requires updated source authority, routing, lifecycle rules, schema rules, API rules, and verification coverage.

# 🧬 Proof Structure

This repository is organized as a correctness proof system, not just a feature set.

**Defined → Routed → Enforced → Tested → Falsifiable**

### Source Authority
`L00 → L01 → L02 → L03 → L04 → L05 → L06 → L07 → L08 → L09 → L10`

| Layer | Role |
| :--- | :--- |
| **L00** | Root purpose, guarantees, invalid states |
| **L01** | Domain entities and relationships |
| **L02** | Canonical terms |
| **L03** | Invariants |
| **L04** | Failure classes |
| **L05** | Transfer lifecycle / FSM |
| **L06** | Architecture control flow |
| **L07** | Persistence model |
| **L08** | API contracts |
| **L09** | Authorization constraints |
| **L10** | Verification requirements |

### Implementation Guidance
`IMP-INDEX`  
`IMP-00 → IMP-11`

The IMP files guide implementation, routing, dependencies, build order, observability, and done criteria.

They are not correctness authority.

Correctness authority remains with **L00–L10**.

# 📂 Project Structure

```text
.
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
│   │   └── operations/
│   │       └── transfer/
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

# 🌐 API Surface

The MVP exposes only the routed API surface.

| Method | Route | Purpose |
| :--- | :--- | :--- |
| **POST** | `/api/transfers` | Submit a Transfer Request |
| **GET** | `/api/transfers/:transferId` | Inspect a Transfer |
| **GET** | `/api/transfers/:transferId/ledger-entries` | Inspect Transfer LedgerEntries |
| **GET** | `/api/accounts/:accountId/balances` | Inspect derived Balance view |

**Forbidden API behavior:**
- direct Balance mutation
- direct LedgerEntry creation
- lifecycle override
- internal boundary selection
- direct transaction control
- direct Prisma access from API routes

# 🧪 Verification Suite

The system is verified by source-mapped tests.

| Test | Verifies |
| :--- | :--- |
| **TEST-001** | Traceability |
| **TEST-002** | LedgerEntry immutability |
| **TEST-003** | Replay determinism |
| **TEST-004** | Atomicity |
| **TEST-005** | Balance constraints |
| **TEST-006** | Asset consistency |
| **TEST-007** | Idempotency |
| **TEST-008** | Lifecycle governance |
| **TEST-009** | Bounded consistency |
| **TEST-010** | Operation completeness |
| **TEST-011** | API boundary restrictions |
| **TEST-012** | Authorization constraints |

A test is not proof unless it includes:
1. source rule references.
2. valid-path coverage.
3. invalid-path coverage.
4. observable behavior.
5. expected rejection or failure classification.

# 🛠️ Tech Stack
- **Framework:** Next.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **Testing:** Jest
- **Local DB:** Docker Compose

# ⚙️ Run Locally

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start local PostgreSQL**
   ```bash
   docker compose up -d
   ```
3. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```
4. **Run database migration**
   ```bash
   npx prisma migrate dev
   ```
5. **Seed database**
   ```bash
   npx prisma db seed
   ```
6. **Start development server**
   ```bash
   npm run dev
   ```
7. **Run verification tests**
   ```bash
   npm test
   ```

# ✅ Done Criteria

The project is **not** done because:
- files exist.
- code compiles.
- one happy-path Transfer works.
- API returns 200 once.
- logs look correct.
- timestamps align.
- generated code appears reasonable.

The project is done **only** when:
- routed implementation exists.
- no unsupported Balance-Affecting Operation exists.
- no direct Balance mutation path exists.
- no direct LedgerEntry creation path exists.
- no lifecycle override path exists.
- no boundary bypass exists.
- TEST-001 through TEST-012 pass.
- invalid-path coverage passes.
- CI fails closed.
- proof evidence maps: `Source ID → Implementation File → TEST-* → Observed Result`

# ⚖️ Design Principle

If a Balance can change without immutable ledger history, the system is invalid.

If a Transfer can partially apply, the system is invalid.

If a duplicate Request can create a duplicate effect, the system is invalid.

If execution can bypass lifecycle, balance, ledger, or persistence controls, the system is invalid.

This system is built so invalid ledger states are rejected, blocked, or unrepresentable.

# 🧠 Final Positioning

This is not a CRUD application.

This is a deterministic ledger engine that demonstrates:
- correctness under retry.
- integrity under partial failure.
- traceability through immutable LedgerEntries.
- idempotency under duplicate Requests.
- lifecycle-governed execution.
- API boundaries that prevent unsafe mutation.
- verification based on falsification, not optimism.

The system is proven by how it behaves when things go wrong — not when everything goes right.

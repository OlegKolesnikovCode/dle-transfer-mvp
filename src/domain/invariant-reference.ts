/**
 * Source-reference-only invariant registry.
 *
 * Source authority:
 * - L03__INVARIANTS__CORRECTNESS_RULES__LEDGER.md
 *
 * This file does not define correctness rules.
 * This file does not enforce invariants.
 * This file does not define failure classes.
 * This file does not define lifecycle transitions.
 * This file does not define architecture.
 * This file does not define persistence behavior.
 * This file does not define API behavior.
 * This file does not define authorization behavior.
 * This file does not define verification requirements.
 */

export type InvariantId =
  | "INV-001"
  | "INV-002"
  | "INV-003"
  | "INV-004"
  | "INV-005"
  | "INV-006"
  | "INV-007"
  | "INV-008"
  | "INV-009"
  | "INV-010";

export type InvariantName =
  | "Traceability"
  | "LedgerEntry Immutability"
  | "Replay Determinism"
  | "Atomicity"
  | "Balance Constraint Enforcement"
  | "Asset Consistency"
  | "Idempotency"
  | "Lifecycle Governance"
  | "Bounded Consistency"
  | "Operation Completeness";

export type InvariantReference = Readonly<{
  id: InvariantId;
  name: InvariantName;
  source: "L03__INVARIANTS__CORRECTNESS_RULES__LEDGER.md";
}>;

export const INVARIANT_REFERENCES = {
  "INV-001": {
    id: "INV-001",
    name: "Traceability",
    source: "L03__INVARIANTS__CORRECTNESS_RULES__LEDGER.md"
  },
  "INV-002": {
    id: "INV-002",
    name: "LedgerEntry Immutability",
    source: "L03__INVARIANTS__CORRECTNESS_RULES__LEDGER.md"
  },
  "INV-003": {
    id: "INV-003",
    name: "Replay Determinism",
    source: "L03__INVARIANTS__CORRECTNESS_RULES__LEDGER.md"
  },
  "INV-004": {
    id: "INV-004",
    name: "Atomicity",
    source: "L03__INVARIANTS__CORRECTNESS_RULES__LEDGER.md"
  },
  "INV-005": {
    id: "INV-005",
    name: "Balance Constraint Enforcement",
    source: "L03__INVARIANTS__CORRECTNESS_RULES__LEDGER.md"
  },
  "INV-006": {
    id: "INV-006",
    name: "Asset Consistency",
    source: "L03__INVARIANTS__CORRECTNESS_RULES__LEDGER.md"
  },
  "INV-007": {
    id: "INV-007",
    name: "Idempotency",
    source: "L03__INVARIANTS__CORRECTNESS_RULES__LEDGER.md"
  },
  "INV-008": {
    id: "INV-008",
    name: "Lifecycle Governance",
    source: "L03__INVARIANTS__CORRECTNESS_RULES__LEDGER.md"
  },
  "INV-009": {
    id: "INV-009",
    name: "Bounded Consistency",
    source: "L03__INVARIANTS__CORRECTNESS_RULES__LEDGER.md"
  },
  "INV-010": {
    id: "INV-010",
    name: "Operation Completeness",
    source: "L03__INVARIANTS__CORRECTNESS_RULES__LEDGER.md"
  }
} as const satisfies Record<InvariantId, InvariantReference>;

export const INVARIANT_IDS = [
  "INV-001",
  "INV-002",
  "INV-003",
  "INV-004",
  "INV-005",
  "INV-006",
  "INV-007",
  "INV-008",
  "INV-009",
  "INV-010"
] as const satisfies readonly InvariantId[];

export const INVARIANT_NAMES = [
  "Traceability",
  "LedgerEntry Immutability",
  "Replay Determinism",
  "Atomicity",
  "Balance Constraint Enforcement",
  "Asset Consistency",
  "Idempotency",
  "Lifecycle Governance",
  "Bounded Consistency",
  "Operation Completeness"
] as const satisfies readonly InvariantName[];

export function isInvariantId(value: string): value is InvariantId {
  return Object.prototype.hasOwnProperty.call(INVARIANT_REFERENCES, value);
}

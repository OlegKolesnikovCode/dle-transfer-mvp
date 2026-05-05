/**
 * Source-reference-only canonical term registry.
 *
 * Source authority:
 * - L02__LANGUAGE__CANONICAL_TERMS__GLOBAL.md
 *
 * This file does not define correctness rules.
 * This file does not define invariants.
 * This file does not define failure classes.
 * This file does not define lifecycle transitions.
 * This file does not define architecture.
 * This file does not define schema behavior.
 * This file does not define API behavior.
 * This file does not define authorization behavior.
 * This file does not define verification requirements.
 */

export type TermId =
  | "TERM-001"
  | "TERM-002"
  | "TERM-003"
  | "TERM-004"
  | "TERM-005"
  | "TERM-006"
  | "TERM-007"
  | "TERM-008"
  | "TERM-009"
  | "TERM-010"
  | "TERM-011"
  | "TERM-012"
  | "TERM-013"
  | "TERM-014"
  | "TERM-015"
  | "TERM-016"
  | "TERM-017"
  | "TERM-018";

export type CanonicalTermName =
  | "Bounded System"
  | "Consistency Boundary"
  | "Account"
  | "Asset"
  | "Balance"
  | "Balance Change"
  | "Balance-Affecting Operation"
  | "Transfer"
  | "LedgerEntry"
  | "Request"
  | "Idempotency"
  | "Atomicity"
  | "Replay Determinism"
  | "Traceability"
  | "Asset Consistency"
  | "Lifecycle-Governed"
  | "Immutable"
  | "Invalid State";

export type CanonicalTermReference = Readonly<{
  id: TermId;
  name: CanonicalTermName;
  source: "L02__LANGUAGE__CANONICAL_TERMS__GLOBAL.md";
}>;

export const CANONICAL_TERMS = {
  "TERM-001": {
    id: "TERM-001",
    name: "Bounded System",
    source: "L02__LANGUAGE__CANONICAL_TERMS__GLOBAL.md"
  },
  "TERM-002": {
    id: "TERM-002",
    name: "Consistency Boundary",
    source: "L02__LANGUAGE__CANONICAL_TERMS__GLOBAL.md"
  },
  "TERM-003": {
    id: "TERM-003",
    name: "Account",
    source: "L02__LANGUAGE__CANONICAL_TERMS__GLOBAL.md"
  },
  "TERM-004": {
    id: "TERM-004",
    name: "Asset",
    source: "L02__LANGUAGE__CANONICAL_TERMS__GLOBAL.md"
  },
  "TERM-005": {
    id: "TERM-005",
    name: "Balance",
    source: "L02__LANGUAGE__CANONICAL_TERMS__GLOBAL.md"
  },
  "TERM-006": {
    id: "TERM-006",
    name: "Balance Change",
    source: "L02__LANGUAGE__CANONICAL_TERMS__GLOBAL.md"
  },
  "TERM-007": {
    id: "TERM-007",
    name: "Balance-Affecting Operation",
    source: "L02__LANGUAGE__CANONICAL_TERMS__GLOBAL.md"
  },
  "TERM-008": {
    id: "TERM-008",
    name: "Transfer",
    source: "L02__LANGUAGE__CANONICAL_TERMS__GLOBAL.md"
  },
  "TERM-009": {
    id: "TERM-009",
    name: "LedgerEntry",
    source: "L02__LANGUAGE__CANONICAL_TERMS__GLOBAL.md"
  },
  "TERM-010": {
    id: "TERM-010",
    name: "Request",
    source: "L02__LANGUAGE__CANONICAL_TERMS__GLOBAL.md"
  },
  "TERM-011": {
    id: "TERM-011",
    name: "Idempotency",
    source: "L02__LANGUAGE__CANONICAL_TERMS__GLOBAL.md"
  },
  "TERM-012": {
    id: "TERM-012",
    name: "Atomicity",
    source: "L02__LANGUAGE__CANONICAL_TERMS__GLOBAL.md"
  },
  "TERM-013": {
    id: "TERM-013",
    name: "Replay Determinism",
    source: "L02__LANGUAGE__CANONICAL_TERMS__GLOBAL.md"
  },
  "TERM-014": {
    id: "TERM-014",
    name: "Traceability",
    source: "L02__LANGUAGE__CANONICAL_TERMS__GLOBAL.md"
  },
  "TERM-015": {
    id: "TERM-015",
    name: "Asset Consistency",
    source: "L02__LANGUAGE__CANONICAL_TERMS__GLOBAL.md"
  },
  "TERM-016": {
    id: "TERM-016",
    name: "Lifecycle-Governed",
    source: "L02__LANGUAGE__CANONICAL_TERMS__GLOBAL.md"
  },
  "TERM-017": {
    id: "TERM-017",
    name: "Immutable",
    source: "L02__LANGUAGE__CANONICAL_TERMS__GLOBAL.md"
  },
  "TERM-018": {
    id: "TERM-018",
    name: "Invalid State",
    source: "L02__LANGUAGE__CANONICAL_TERMS__GLOBAL.md"
  }
} as const satisfies Record<TermId, CanonicalTermReference>;

export const CANONICAL_TERM_IDS = [
  "TERM-001",
  "TERM-002",
  "TERM-003",
  "TERM-004",
  "TERM-005",
  "TERM-006",
  "TERM-007",
  "TERM-008",
  "TERM-009",
  "TERM-010",
  "TERM-011",
  "TERM-012",
  "TERM-013",
  "TERM-014",
  "TERM-015",
  "TERM-016",
  "TERM-017",
  "TERM-018"
] as const satisfies readonly TermId[];

export const CANONICAL_TERM_NAMES = [
  "Bounded System",
  "Consistency Boundary",
  "Account",
  "Asset",
  "Balance",
  "Balance Change",
  "Balance-Affecting Operation",
  "Transfer",
  "LedgerEntry",
  "Request",
  "Idempotency",
  "Atomicity",
  "Replay Determinism",
  "Traceability",
  "Asset Consistency",
  "Lifecycle-Governed",
  "Immutable",
  "Invalid State"
] as const satisfies readonly CanonicalTermName[];

export function isTermId(value: string): value is TermId {
  return Object.prototype.hasOwnProperty.call(CANONICAL_TERMS, value);
}

/**
 * Source-reference-only entity registry.
 *
 * Source authority:
 * - L01__DOMAIN__ENTITIES_RELATIONSHIPS__LEDGER.md
 *
 * This file does not define correctness rules.
 * This file does not define invariants.
 * This file does not define failure classes.
 * This file does not define lifecycle transitions.
 * This file does not define architecture.
 * This file does not define persistence behavior.
 */

export type EntityId =
  | "ENT-001"
  | "ENT-002"
  | "ENT-003"
  | "ENT-004"
  | "ENT-005"
  | "ENT-006";

export type EntityName =
  | "Account"
  | "Balance"
  | "Asset"
  | "Transfer"
  | "LedgerEntry"
  | "Request";

export type DomainEntityReference = Readonly<{
  id: EntityId;
  name: EntityName;
  source: "L01__DOMAIN__ENTITIES_RELATIONSHIPS__LEDGER.md";
  description: string;
}>;

export const DOMAIN_ENTITIES = {
  "ENT-001": {
    id: "ENT-001",
    name: "Account",
    source: "L01__DOMAIN__ENTITIES_RELATIONSHIPS__LEDGER.md",
    description: "uniquely identifiable ownership scope for Balances"
  },
  "ENT-002": {
    id: "ENT-002",
    name: "Balance",
    source: "L01__DOMAIN__ENTITIES_RELATIONSHIPS__LEDGER.md",
    description: "quantitative representation of value associated with Account and Asset"
  },
  "ENT-003": {
    id: "ENT-003",
    name: "Asset",
    source: "L01__DOMAIN__ENTITIES_RELATIONSHIPS__LEDGER.md",
    description: "unit of denomination for value"
  },
  "ENT-004": {
    id: "ENT-004",
    name: "Transfer",
    source: "L01__DOMAIN__ENTITIES_RELATIONSHIPS__LEDGER.md",
    description: "representation of intended value movement between Accounts"
  },
  "ENT-005": {
    id: "ENT-005",
    name: "LedgerEntry",
    source: "L01__DOMAIN__ENTITIES_RELATIONSHIPS__LEDGER.md",
    description: "immutable record representing a Balance Change"
  },
  "ENT-006": {
    id: "ENT-006",
    name: "Request",
    source: "L01__DOMAIN__ENTITIES_RELATIONSHIPS__LEDGER.md",
    description: "invocation of a Balance-Affecting Operation"
  }
} as const satisfies Record<EntityId, DomainEntityReference>;

export const DOMAIN_ENTITY_IDS = [
  "ENT-001",
  "ENT-002",
  "ENT-003",
  "ENT-004",
  "ENT-005",
  "ENT-006"
] as const satisfies readonly EntityId[];

export const DOMAIN_ENTITY_NAMES = [
  "Account",
  "Balance",
  "Asset",
  "Transfer",
  "LedgerEntry",
  "Request"
] as const satisfies readonly EntityName[];

export function isEntityId(value: string): value is EntityId {
  return Object.prototype.hasOwnProperty.call(DOMAIN_ENTITIES, value);
}

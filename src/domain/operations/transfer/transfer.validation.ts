import type {
  AtomicUnitDecimalString,
  TransferRequestInput
} from "./transfer.types";
import type { EntityId } from "../../entities";
import type { TermId } from "../../terms";

/**
 * Pure Transfer input validation.
 *
 * Source authority:
 * - L01__DOMAIN__ENTITIES_RELATIONSHIPS__LEDGER.md
 * - L02__LANGUAGE__CANONICAL_TERMS__GLOBAL.md
 * - L03__INVARIANTS__CORRECTNESS_RULES__LEDGER.md
 * - L04__FAILURE_MODEL__FAILURE_CLASSES__LEDGER.md
 *
 * Implementation guidance:
 * - IMP-05__TRANSFER_OPERATION__MVP_ONLY.md
 *
 * This file does not execute Transfers.
 * This file does not authorize Balance Changes.
 * This file does not create LedgerEntries.
 * This file does not persist state.
 * This file does not open transactions.
 * This file does not define API behavior.
 */

export type TransferValidationIssueCode =
  | "INVALID_INPUT_OBJECT"
  | "MISSING_REQUEST_IDENTITY"
  | "MISSING_SOURCE_ACCOUNT_ID"
  | "MISSING_DESTINATION_ACCOUNT_ID"
  | "MISSING_ASSET_ID"
  | "MISSING_AMOUNT"
  | "INVALID_AMOUNT_FORMAT"
  | "NON_POSITIVE_AMOUNT"
  | "SAME_SOURCE_AND_DESTINATION_ACCOUNT"
  | "FORBIDDEN_TRANSFER_FIELD";

export type TransferValidationIssue = Readonly<{
  code: TransferValidationIssueCode;
  message: string;
  sourceFailureId?: "FAIL-005" | "FAIL-006" | "FAIL-010";
  sourceReferences: readonly string[];
}>;

export type TransferValidationResult =
  | Readonly<{
      ok: true;
      value: TransferRequestInput;
      sourceReferences: TransferValidationSourceReferences;
    }>
  | Readonly<{
      ok: false;
      issues: readonly TransferValidationIssue[];
      sourceReferences: TransferValidationSourceReferences;
    }>;

export type TransferValidationSourceReferences = Readonly<{
  entityIds: readonly Extract<
    EntityId,
    "ENT-001" | "ENT-003" | "ENT-004" | "ENT-006"
  >[];
  termIds: readonly Extract<
    TermId,
    "TERM-007" | "TERM-008" | "TERM-010" | "TERM-015"
  >[];
  invariantIds: readonly ("INV-005" | "INV-006" | "INV-010")[];
  failureIds: readonly ("FAIL-005" | "FAIL-006" | "FAIL-010")[];
}>;

export const TRANSFER_VALIDATION_SOURCE_REFERENCES = {
  entityIds: ["ENT-001", "ENT-003", "ENT-004", "ENT-006"],
  termIds: ["TERM-007", "TERM-008", "TERM-010", "TERM-015"],
  invariantIds: ["INV-005", "INV-006", "INV-010"],
  failureIds: ["FAIL-005", "FAIL-006", "FAIL-010"]
} as const satisfies TransferValidationSourceReferences;

const ALLOWED_TRANSFER_INPUT_FIELDS = [
  "requestIdentity",
  "sourceAccountId",
  "destinationAccountId",
  "assetId",
  "amount"
] as const;

const FORBIDDEN_TRANSFER_INPUT_FIELDS = [
  "fromBalanceId",
  "toBalanceId",
  "ledgerEntryIds",
  "lifecycleState",
  "state",
  "stateOverride",
  "forceExecute",
  "skipIdempotency",
  "skipAuthorization",
  "skipLifecycle",
  "skipBalanceCheck",
  "skipLedgerEntryCreation",
  "skipPersistence",
  "transactionId",
  "externalSettlementId",
  "balanceDelta",
  "sourceBalanceMutation",
  "destinationBalanceMutation"
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isAtomicUnitDecimalString(
  value: unknown
): value is AtomicUnitDecimalString {
  if (typeof value !== "string") {
    return false;
  }

  if (!/^[0-9]+$/.test(value)) {
    return false;
  }

  if (value.length > 1 && value.startsWith("0")) {
    return false;
  }

  return true;
}

function isPositiveAtomicUnitDecimalString(
  value: AtomicUnitDecimalString
): boolean {
  return /^[1-9][0-9]*$/.test(value);
}

function createIssue(
  code: TransferValidationIssueCode,
  message: string,
  sourceReferences: readonly string[],
  sourceFailureId?: "FAIL-005" | "FAIL-006" | "FAIL-010"
): TransferValidationIssue {
  return {
    code,
    message,
    sourceFailureId,
    sourceReferences
  };
}

export function validateTransferRequestInput(
  input: unknown
): TransferValidationResult {
  const issues: TransferValidationIssue[] = [];

  if (!isRecord(input)) {
    return {
      ok: false,
      issues: [
        createIssue(
          "INVALID_INPUT_OBJECT",
          "Transfer input must be an object.",
          ["ENT-004", "TERM-008", "FAIL-010", "INV-010"],
          "FAIL-010"
        )
      ],
      sourceReferences: TRANSFER_VALIDATION_SOURCE_REFERENCES
    };
  }

  for (const field of FORBIDDEN_TRANSFER_INPUT_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(input, field)) {
      issues.push(
        createIssue(
          "FORBIDDEN_TRANSFER_FIELD",
          `Transfer input field '${field}' is not allowed.`,
          ["ENT-004", "TERM-008", "INV-010", "FAIL-010"],
          "FAIL-010"
        )
      );
    }
  }

  for (const field of Object.keys(input)) {
    if (
      !ALLOWED_TRANSFER_INPUT_FIELDS.includes(
        field as (typeof ALLOWED_TRANSFER_INPUT_FIELDS)[number]
      )
    ) {
      issues.push(
        createIssue(
          "FORBIDDEN_TRANSFER_FIELD",
          `Transfer input field '${field}' is not routed for MVP Transfer.`,
          ["ENT-004", "TERM-008", "INV-010", "FAIL-010"],
          "FAIL-010"
        )
      );
    }
  }

  if (!isNonEmptyString(input.requestIdentity)) {
    issues.push(
      createIssue(
        "MISSING_REQUEST_IDENTITY",
        "Transfer input requires a non-empty requestIdentity.",
        ["ENT-006", "TERM-010", "INV-007"]
      )
    );
  }

  if (!isNonEmptyString(input.sourceAccountId)) {
    issues.push(
      createIssue(
        "MISSING_SOURCE_ACCOUNT_ID",
        "Transfer input requires a non-empty sourceAccountId.",
        ["ENT-001", "ENT-004", "FAIL-010", "INV-010"],
        "FAIL-010"
      )
    );
  }

  if (!isNonEmptyString(input.destinationAccountId)) {
    issues.push(
      createIssue(
        "MISSING_DESTINATION_ACCOUNT_ID",
        "Transfer input requires a non-empty destinationAccountId.",
        ["ENT-001", "ENT-004", "FAIL-010", "INV-010"],
        "FAIL-010"
      )
    );
  }

  if (!isNonEmptyString(input.assetId)) {
    issues.push(
      createIssue(
        "MISSING_ASSET_ID",
        "Transfer input requires a non-empty assetId.",
        ["ENT-003", "ENT-004", "INV-006", "FAIL-006"],
        "FAIL-006"
      )
    );
  }

  if (!isNonEmptyString(input.amount)) {
    issues.push(
      createIssue(
        "MISSING_AMOUNT",
        "Transfer input requires a non-empty amount.",
        ["ENT-004", "TERM-008", "INV-005", "FAIL-005"],
        "FAIL-005"
      )
    );
  } else if (!isAtomicUnitDecimalString(input.amount)) {
    issues.push(
      createIssue(
        "INVALID_AMOUNT_FORMAT",
        "Transfer amount must be an integer-valued atomic-unit decimal string.",
        ["ENT-004", "TERM-008", "INV-005", "FAIL-005"],
        "FAIL-005"
      )
    );
  } else if (!isPositiveAtomicUnitDecimalString(input.amount)) {
    issues.push(
      createIssue(
        "NON_POSITIVE_AMOUNT",
        "Transfer amount must be greater than zero.",
        ["ENT-004", "TERM-008", "INV-005", "FAIL-005"],
        "FAIL-005"
      )
    );
  }

  if (
    isNonEmptyString(input.sourceAccountId) &&
    isNonEmptyString(input.destinationAccountId) &&
    input.sourceAccountId === input.destinationAccountId
  ) {
    issues.push(
      createIssue(
        "SAME_SOURCE_AND_DESTINATION_ACCOUNT",
        "Transfer sourceAccountId and destinationAccountId must be different.",
        ["ENT-001", "ENT-004", "INV-010", "FAIL-010"],
        "FAIL-010"
      )
    );
  }

  if (issues.length > 0) {
    return {
      ok: false,
      issues,
      sourceReferences: TRANSFER_VALIDATION_SOURCE_REFERENCES
    };
  }

const requestIdentity = input.requestIdentity;
const sourceAccountId = input.sourceAccountId;
const destinationAccountId = input.destinationAccountId;
const assetId = input.assetId;
const amount = input.amount;

if (
  !isNonEmptyString(requestIdentity) ||
  !isNonEmptyString(sourceAccountId) ||
  !isNonEmptyString(destinationAccountId) ||
  !isNonEmptyString(assetId) ||
  !isAtomicUnitDecimalString(amount)
) {
  return {
    ok: false,
    issues: [
      createIssue(
        "INVALID_INPUT_OBJECT",
        "Transfer input failed final type refinement.",
        ["ENT-004", "TERM-008", "INV-010", "FAIL-010"],
        "FAIL-010"
      )
    ],
    sourceReferences: TRANSFER_VALIDATION_SOURCE_REFERENCES
  };
}

return {
  ok: true,
  value: {
    requestIdentity,
    sourceAccountId,
    destinationAccountId,
    assetId,
    amount
  },
  sourceReferences: TRANSFER_VALIDATION_SOURCE_REFERENCES
};
}

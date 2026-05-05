import {
  authorizeBalanceChange,
  persistAuthorizedBalanceChange
} from "./balance-control";
import {
  authorizeLedgerEntryCreation,
  persistAuthorizedLedgerEntries
} from "./ledger-control";
import { evaluateLifecycleControl } from "./lifecycle-control";
import {
  createRequestInTransaction,
  createTransferInTransaction,
  getPrismaClient,
  updateRequestOutcomeInTransaction,
  updateTransferStateInTransaction
} from "./persistence-boundary";

/**
 * Consistency Boundary.
 *
 * Source authority:
 * - L03__INVARIANTS__CORRECTNESS_RULES__LEDGER.md
 * - L04__FAILURE_MODEL__FAILURE_CLASSES__LEDGER.md
 * - L05__FSM_WORKFLOW__LIFECYCLE_RULES__TRANSFER.md
 * - L06__ARCHITECTURE__CONTROL_FLOW__SYSTEM.md
 *
 * Source references:
 * - ARCH-003
 * - ARCH-004
 * - ARCH-005
 * - ARCH-006
 * - ARCH-007
 * - ARCH-009
 * - INV-004
 * - INV-007
 * - INV-009
 * - INV-010
 * - FAIL-004
 * - FAIL-007
 * - FAIL-009
 * - FAIL-010
 * - FSM-005
 * - FSM-007
 * - FSM-008
 *
 * This file opens and coordinates one transaction for a Transfer execution attempt.
 * This file does not authorize Balance Changes.
 * This file does not create semantic LedgerEntry authority.
 * This file does not decide API response shape.
 * This file does not import Prisma directly.
 */

export type ConsistencyTransferInput = Readonly<{
  requestIdentity: string;
  sourceAccountId: string;
  destinationAccountId: string;
  assetId: string;
  amount: string;
}>;

export type ConsistencyBoundaryCompleted = Readonly<{
  ok: true;
  boundary: "ARCH-003";
  requestId: string;
  requestIdentity: string;
  transferId: string;
  transferState: "EXECUTED";
  sourceReferences: readonly string[];
}>;

export type ConsistencyBoundaryFailed = Readonly<{
  ok: false;
  boundary: "ARCH-003";
  requestId?: string;
  requestIdentity: string;
  transferId?: string;
  transferState?: "FAILED";
  sourceFailureId:
    | "FAIL-001"
    | "FAIL-004"
    | "FAIL-005"
    | "FAIL-006"
    | "FAIL-008"
    | "FAIL-010";
  reason:
    | "REQUEST_RESERVATION_FAILED"
    | "REQUESTED_TO_VALIDATED_REJECTED"
    | "BALANCE_CONTROL_REJECTED"
    | "VALIDATED_TO_EXECUTED_REJECTED"
    | "LEDGER_CONTROL_REJECTED"
    | "TRANSACTION_FAILED";
  message: string;
  sourceReferences: readonly string[];
}>;

export type ConsistencyBoundaryResult =
  | ConsistencyBoundaryCompleted
  | ConsistencyBoundaryFailed;

const CONSISTENCY_BOUNDARY_SOURCE_REFERENCES = [
  "ARCH-003",
  "ARCH-004",
  "ARCH-005",
  "ARCH-006",
  "ARCH-007",
  "ARCH-009",
  "INV-004",
  "INV-007",
  "INV-009",
  "INV-010",
  "FAIL-004",
  "FAIL-007",
  "FAIL-009",
  "FAIL-010",
  "FSM-005",
  "FSM-007",
  "FSM-008"
] as const;

function failConsistencyBoundary(
  input: Omit<ConsistencyBoundaryFailed, "boundary" | "sourceReferences">
): ConsistencyBoundaryFailed {
  return {
    ...input,
    boundary: "ARCH-003",
    sourceReferences: CONSISTENCY_BOUNDARY_SOURCE_REFERENCES
  };
}

export async function executeTransferInConsistencyBoundary(
  input: ConsistencyTransferInput
): Promise<ConsistencyBoundaryResult> {
  const prisma = getPrismaClient();

  try {
    return await prisma.$transaction(async (tx) => {
      const now = new Date();

      const request = await createRequestInTransaction(tx, {
        identity: input.requestIdentity,
        operationType: "TRANSFER",
        status: "PROCESSING"
      });

      const transfer = await createTransferInTransaction(tx, {
        requestId: request.id,
        sourceAccountId: input.sourceAccountId,
        destinationAccountId: input.destinationAccountId,
        assetId: input.assetId,
        amount: input.amount,
        state: "REQUESTED"
      });

      const requestedToValidated = evaluateLifecycleControl({
        transferId: transfer.id,
        requestIdentity: input.requestIdentity,
        currentState: "REQUESTED",
        requestedState: "VALIDATED"
      });

      if (!requestedToValidated.ok) {
        await updateTransferStateInTransaction(tx, {
          transferId: transfer.id,
          state: "FAILED",
          failedAt: now
        });

        await updateRequestOutcomeInTransaction(tx, {
          requestId: request.id,
          status: "FAILED",
          errorBody: {
            reason: "REQUESTED_TO_VALIDATED_REJECTED",
            sourceFailureId: "FAIL-008"
          },
          completedAt: now
        });

        return failConsistencyBoundary({
          ok: false,
          requestId: request.id,
          requestIdentity: input.requestIdentity,
          transferId: transfer.id,
          transferState: "FAILED",
          sourceFailureId: "FAIL-008",
          reason: "REQUESTED_TO_VALIDATED_REJECTED",
          message: "Lifecycle Control rejected REQUESTED -> VALIDATED."
        });
      }

      await updateTransferStateInTransaction(tx, {
        transferId: transfer.id,
        state: "VALIDATED"
      });

      const balanceAuthorization = await authorizeBalanceChange({
        tx,
        transferInput: input
      });

      if (!balanceAuthorization.ok) {
        await updateTransferStateInTransaction(tx, {
          transferId: transfer.id,
          state: "FAILED",
          failedAt: now
        });

        await updateRequestOutcomeInTransaction(tx, {
          requestId: request.id,
          status: "FAILED",
          errorBody: {
            reason: "BALANCE_CONTROL_REJECTED",
            sourceFailureId: balanceAuthorization.sourceFailureId
          },
          completedAt: now
        });

        return failConsistencyBoundary({
          ok: false,
          requestId: request.id,
          requestIdentity: input.requestIdentity,
          transferId: transfer.id,
          transferState: "FAILED",
          sourceFailureId: balanceAuthorization.sourceFailureId,
          reason: "BALANCE_CONTROL_REJECTED",
          message: balanceAuthorization.message
        });
      }

      const validatedToExecuted = evaluateLifecycleControl({
        transferId: transfer.id,
        requestIdentity: input.requestIdentity,
        currentState: "VALIDATED",
        requestedState: "EXECUTED"
      });

      if (!validatedToExecuted.ok) {
        await updateTransferStateInTransaction(tx, {
          transferId: transfer.id,
          state: "FAILED",
          failedAt: now
        });

        await updateRequestOutcomeInTransaction(tx, {
          requestId: request.id,
          status: "FAILED",
          errorBody: {
            reason: "VALIDATED_TO_EXECUTED_REJECTED",
            sourceFailureId: "FAIL-008"
          },
          completedAt: now
        });

        return failConsistencyBoundary({
          ok: false,
          requestId: request.id,
          requestIdentity: input.requestIdentity,
          transferId: transfer.id,
          transferState: "FAILED",
          sourceFailureId: "FAIL-008",
          reason: "VALIDATED_TO_EXECUTED_REJECTED",
          message: "Lifecycle Control rejected VALIDATED -> EXECUTED."
        });
      }

      const ledgerAuthorization = authorizeLedgerEntryCreation({
        transferId: transfer.id,
        createdAt: now,
        transfer: {
          requestIdentity: input.requestIdentity,
          sourceAccountId: input.sourceAccountId,
          destinationAccountId: input.destinationAccountId,
          assetId: input.assetId,
          amount: input.amount,
          state: "VALIDATED"
        }
      });

      if (!ledgerAuthorization.ok) {
        await updateTransferStateInTransaction(tx, {
          transferId: transfer.id,
          state: "FAILED",
          failedAt: now
        });

        await updateRequestOutcomeInTransaction(tx, {
          requestId: request.id,
          status: "FAILED",
          errorBody: {
            reason: "LEDGER_CONTROL_REJECTED",
            sourceFailureId: ledgerAuthorization.sourceFailureId
          },
          completedAt: now
        });

        return failConsistencyBoundary({
          ok: false,
          requestId: request.id,
          requestIdentity: input.requestIdentity,
          transferId: transfer.id,
          transferState: "FAILED",
          sourceFailureId: ledgerAuthorization.sourceFailureId,
          reason: "LEDGER_CONTROL_REJECTED",
          message: ledgerAuthorization.message
        });
      }

      await persistAuthorizedBalanceChange(tx, balanceAuthorization);
      await persistAuthorizedLedgerEntries(tx, ledgerAuthorization);

      await updateTransferStateInTransaction(tx, {
        transferId: transfer.id,
        state: "EXECUTED",
        executedAt: now
      });

      await updateRequestOutcomeInTransaction(tx, {
        requestId: request.id,
        status: "COMPLETED",
        responseBody: {
          requestId: request.id,
          requestIdentity: input.requestIdentity,
          transferId: transfer.id,
          status: "COMPLETED"
        },
        completedAt: now
      });

      return {
        ok: true,
        boundary: "ARCH-003",
        requestId: request.id,
        requestIdentity: input.requestIdentity,
        transferId: transfer.id,
        transferState: "EXECUTED",
        sourceReferences: CONSISTENCY_BOUNDARY_SOURCE_REFERENCES
      };
    });
  } catch {
    return failConsistencyBoundary({
      ok: false,
      requestIdentity: input.requestIdentity,
      sourceFailureId: "FAIL-004",
      reason: "TRANSACTION_FAILED",
      message: "Consistency Boundary transaction failed."
    });
  }
}



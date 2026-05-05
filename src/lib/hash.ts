import { createHash } from "crypto";

/**
 * Narrow deterministic hashing utility.
 *
 * Source references:
 * - L00 IDENTITY REQUIREMENT
 * - INV-007
 * - API-002
 *
 * This file does not define Request identity.
 * This file does not replace persisted Request identity.
 * This file does not provide idempotency authority.
 * This file does not prove correctness.
 * This file does not mutate state.
 * This file does not import internal project files.
 */

export type Sha256Hex = string;

export type HashInput = Readonly<{
  value: string;
  sourceReferences: readonly string[];
}>;

export type HashResult = Readonly<{
  algorithm: "sha256";
  hex: Sha256Hex;
  sourceReferences: readonly string[];
}>;

export function sha256Hex(value: string): Sha256Hex {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function hashString(input: HashInput): HashResult {
  return {
    algorithm: "sha256",
    hex: sha256Hex(input.value),
    sourceReferences: input.sourceReferences
  };
}

export function hashRequestIdentityForInternalReference(
  requestIdentity: string
): HashResult {
  return hashString({
    value: requestIdentity,
    sourceReferences: ["L00 IDENTITY REQUIREMENT", "INV-007", "API-002"]
  });
}

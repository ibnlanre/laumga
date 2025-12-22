import type { MandateTier } from "./types";

export function determineTier(amount: number): MandateTier {
  if (amount === 5000) return "supporter";
  if (amount === 10000) return "builder";
  if (amount === 25000) return "guardian";
  return "custom";
}

export function generateMandateReference(userId: string): string {
  return `LAUMGA-${userId.slice(0, 8)}-${Date.now()}`;
}

export function generateDebitReference(mandateId: string): string {
  return `DEBIT-${mandateId.slice(0, 8)}-${Date.now()}`;
}

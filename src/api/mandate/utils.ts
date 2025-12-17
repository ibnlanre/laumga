import type { PaymentPartner } from "@/api/payment-partner/types";
import type { FlutterwaveSplitCharge } from "@/api/flutterwave/types";
import type { MandateStatus, MandateTier } from "./types";

export function determineTier(amount: number): MandateTier {
  if (amount === 500_000) return "supporter";
  if (amount === 1_000_000) return "builder";
  if (amount === 2_500_000) return "guardian";
  return "custom";
}

export function generateDebitReference(mandateId: string): string {
  return `DEBIT-${mandateId.slice(0, 8)}-${Date.now()}`;
}

export function ensureActivePartners(
  partners: PaymentPartner[]
): asserts partners is [PaymentPartner, ...PaymentPartner[]] {
  if (!partners.length) {
    throw new Error("No active payment partners configured");
  }
}

function ensureFlutterwaveSubAccounts(
  partners: PaymentPartner[]
): asserts partners is [PaymentPartner, ...PaymentPartner[]] {
  ensureActivePartners(partners);

  partners.forEach((partner) => {
    if (!partner.flutterwaveSubAccountId) {
      throw new Error(
        `${partner.name} is missing a Flutterwave sub-account configuration.`
      );
    }
  });
}

export function buildFlutterwaveSplitConfiguration(
  partners: PaymentPartner[],
  totalAmount: number
): FlutterwaveSplitCharge[] {
  ensureFlutterwaveSubAccounts(partners);

  return partners.map((partner) => {
    if (partner.allocationType === "fixed") {
      const baseAllocation = partner.allocationValue;
      const cappedAllocation =
        partner.allocationMax !== null
          ? Math.min(baseAllocation, partner.allocationMax)
          : baseAllocation;

      if (cappedAllocation > totalAmount) {
        throw new Error(
          `Allocated fixed total (${cappedAllocation}) exceeds the contribution value (${totalAmount}). Adjust ${partner.name}'s split.`
        );
      }

      return {
        id: partner.flutterwaveSubAccountId!,
        transaction_charge_type: "flat_subaccount" as const,
        transaction_charge: cappedAllocation,
      } satisfies FlutterwaveSplitCharge;
    }

    return {
      id: partner.flutterwaveSubAccountId!,
      transaction_split_ratio: partner.allocationValue,
    } satisfies FlutterwaveSplitCharge;
  });
}

export function mapFlutterwaveStatus(status?: string | null): MandateStatus {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return "active";
    case "SUSPENDED":
      return "paused";
    case "DELETED":
      return "cancelled";
    case "APPROVED":
      return "initiated";
    default:
      return "initiated";
  }
}

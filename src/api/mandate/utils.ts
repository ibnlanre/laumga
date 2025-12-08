import { addMonths, addYears } from "date-fns";

import type { PaymentPartner } from "@/api/payment-partner/types";
import type { MonoSplitConfiguration } from "@/api/mono/types";
import type {
  MandateDuration,
  MandateFrequency,
  MandateStatus,
  MandateTier,
} from "./types";
import type { User } from "@/api/user/types";

export function determineTier(amount: number): MandateTier {
  if (amount === 500_000) return "supporter";
  if (amount === 1_000_000) return "builder";
  if (amount === 2_500_000) return "guardian";
  return "custom";
}

export function calculateEndDate(
  startDate: Date,
  duration: MandateDuration
): Date {
  switch (duration) {
    case "12-months":
      return addYears(startDate, 1);
    case "24-months":
      return addYears(startDate, 2);
    case "indefinite":
      return addYears(startDate, 10);
    default:
      return addYears(startDate, 1);
  }
}

export function computeNextChargeDate(
  startDate: Date,
  frequency: MandateFrequency
): Date {
  switch (frequency) {
    case "monthly":
      return addMonths(startDate, 1);
    case "quarterly":
      return addMonths(startDate, 3);
    case "annually":
      return addYears(startDate, 1);
    case "one-time":
      return startDate;
    default:
      return startDate;
  }
}

export function generateMandateReference(userId: string): string {
  return `LAUMGA-${userId.slice(0, 8)}-${Date.now()}`;
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

export function buildSplitConfiguration(
  partners: PaymentPartner[],
  totalAmount: number
): MonoSplitConfiguration {
  ensureActivePartners(partners);

  const hasFixedAllocation = partners.some(
    (partner) => partner.allocationType === "fixed"
  );

  const splitType: MonoSplitConfiguration["type"] = hasFixedAllocation
    ? "fixed"
    : "percentage";

  const uniqueFeeBearers = new Set(
    partners.map((partner) => partner.feeBearer)
  );
  const feeBearer =
    uniqueFeeBearers.size === 1
      ? partners[0].feeBearer
      : ("business" as MonoSplitConfiguration["fee_bearer"]);

  const subAccounts = partners.map((partner) => {
    const baseAllocation =
      partner.allocationType === "percentage"
        ? Math.round((partner.allocationValue / 100) * totalAmount)
        : partner.allocationValue;

    const cappedAllocation =
      partner.allocationMax !== null
        ? Math.min(baseAllocation, partner.allocationMax)
        : baseAllocation;

    return {
      sub_account: partner.monoSubAccountId,
      value:
        splitType === "percentage" ? partner.allocationValue : cappedAllocation,
      ...(partner.allocationMax ? { max: partner.allocationMax } : undefined),
    };
  });

  if (splitType === "fixed") {
    const totalFixed = subAccounts.reduce((sum, { value }) => sum + value, 0);
    if (totalFixed > totalAmount) {
      throw new Error(
        "Allocated fixed amounts exceed the contribution value. Adjust partner splits."
      );
    }
  }

  return {
    type: splitType,
    fee_bearer: feeBearer,
    sub_accounts: subAccounts,
  };
}

export function mapMonoStatus(status: string): MandateStatus {
  switch (status) {
    case "approved":
      return "active";
    case "rejected":
    case "cancelled":
      return "cancelled";
    case "active":
      return "active";
    case "completed":
      return "completed";
    case "paused":
      return "paused";
    default:
      return "initiated";
  }
}

export function toAuditActor(partial: {
  id: string;
  fullName?: string | null;
  photoUrl?: string | null;
}): Pick<User, "id" | "fullName" | "photoUrl"> {
  return {
    id: partial.id,
    fullName: partial.fullName ?? "",
    photoUrl: partial.photoUrl ?? null,
  };
}

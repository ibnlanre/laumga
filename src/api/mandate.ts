import type { NullableExcept, LogEntry, WithId } from "@/services/types";
import type {
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";

export type MandateFrequency =
  | "monthly"
  | "quarterly"
  | "annually"
  | "one-time";

export type MandateTier = "supporter" | "builder" | "guardian" | "custom";

// The Commitment
export type Mandate = NullableExcept<
  {
    userId: string;
    userName: string; // Snapshot for easier display
    amount: number;
    currency: string; // Default 'NGN'
    frequency: MandateFrequency;
    tier: MandateTier;

    // Payment Logic
    paymentMethodId: string; // Paystack/Stripe authorization code
    nextChargeDate: string;
    isActive: boolean;

    created: LogEntry;
    modified: LogEntry;
  },
  "userId" | "amount" | "frequency" | "isActive"
>;

// The History
export type MandateTransaction = NullableExcept<
  {
    mandateId: string;
    userId: string;
    amount: number;
    reference: string; // Payment gateway ref
    status: "success" | "failed";
    paidAt: string;
  },
  "mandateId" | "amount" | "status" | "paidAt"
>;

export type MandateCollection = CollectionReference<Mandate>;
export type MandateDocumentReference = DocumentReference<Mandate>;
export type MandateData = WithId<Mandate>;

export interface CreateMandateVariables {
  data: Mandate;
  userId: string;
}

export const mandate = {};

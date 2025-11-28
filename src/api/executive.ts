import type { NullableExcept, LogEntry, WithId } from "@/services/types";
import type { CollectionReference } from "firebase/firestore";

export type ExecutiveTier = "presidential" | "council" | "directorate";
export type Executive = NullableExcept<
  {
    userId: string; // Link to User
    displayName: string; // e.g. "Prof. Taofiq Adedosu"
    photoUrl: string;

    // Role Details
    role: string; // e.g., "General Secretary"
    tier: ExecutiveTier; // Used for visual hierarchy (Card size)
    tenureYear: string; // e.g., "2019" (The Time Capsule Key)
    portfolio: string; // Optional description
    quote: string; // For the Presidential card

    created: LogEntry;
  },
  "userId" | "role" | "tenureYear" | "tier"
>;

export type ExecutiveCollection = CollectionReference<Executive>;
export type ExecutiveData = WithId<Executive>;

export const executive = {};
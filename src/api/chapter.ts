import type { NullableExcept, LogEntry } from "@/services/types";
import type { CollectionReference } from "firebase/firestore";

export type Chapter = NullableExcept<
  {
    name: string; // e.g., "Lagos State Chapter"
    state: string;
    region: string; // e.g., "South West"
    presidentId: string; // Link to current leader
    meetingVenue: string;
    contactEmail: string;
    created: LogEntry;
  },
  "name" | "state"
>;
export type ChapterCollection = CollectionReference<Chapter>;
export const chapter = {};
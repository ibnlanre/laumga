import type { NullableExcept, LogEntry } from "@/services/types";
import type { CollectionReference } from "firebase/firestore";


export type EventType = "convention" | "humanitarian" | "webinar" | "meeting";

export type Event = NullableExcept<
  {
    title: string;
    description: string;
    posterUrl: string; // The "Ticket" visual

    // Timing
    startDate: string;
    endDate: string;

    // Logistics
    locationName: string; // e.g. "MKO Lecture Theatre"
    locationAddress: string; // For Maps
    meetingLink: string; // If virtual

    type: EventType;
    registrationLink: string; // External or internal

    created: LogEntry;
    modified: LogEntry;
  },
  "title" | "startDate" | "type"
>;

export type EventCollection = CollectionReference<Event>;

export const event = {};
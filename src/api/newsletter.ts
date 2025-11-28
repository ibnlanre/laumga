import type { NullableExcept, LogEntry } from "@/services/types";
import type { CollectionReference } from "firebase/firestore";

export type NewsletterIssue = NullableExcept<
  {
    volume: number; // e.g. 5
    issueNumber: number; // e.g. 2
    title: string; // e.g. "Rebuilding Society"

    pdfUrl: string;
    coverImageUrl: string; // For the 3D Cover effect

    leadStoryTitle: string; // Displayed on the grid card
    highlights: string[]; // Bullet points for the Hero section

    publishedAt: string;
    downloadCount: number;

    created: LogEntry;
  },
  "title" | "pdfUrl" | "volume" | "issueNumber"
>;

export type NewsletterCollection = CollectionReference<NewsletterIssue>;

export const newsletter = {};
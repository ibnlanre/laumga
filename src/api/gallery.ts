import type { NullableExcept, LogEntry } from "@/services/types";
import type { CollectionReference } from "firebase/firestore";

export type Gallery = NullableExcept<
  {
    title: string; // e.g., "2019 Convention"
    year: string; // For the Year Filter
    category: string; // For the Tag Filter
    coverImageUrl: string;
    description: string; // For the "Story Break" section

    isFeatured: boolean; // Shows on Home Page
    created: LogEntry;
  },
  "title" | "year"
>;

export type GalleryMedia = NullableExcept<
  {
    collectionId: string;
    url: string;
    caption: string;
    uploadedBy: string; // For User Generated Content tracking

    created: LogEntry;
  },
  "collectionId" | "url"
>;

export type GalleryCollection = CollectionReference<Gallery>;

export const gallery = {};
import type { NullableExcept } from "@/services/types";
import type { CollectionReference } from "firebase/firestore";
import type { MandateTier } from "./mandate";
import type { Gender } from "./user";

type MandateFeed = NullableExcept<
  {
    type: "mandate";
    location: string; // "Lagos", "Abuja", or "Global"
    timestamp: string;
    tier: MandateTier; // Optional: show "Someone became a Guardian"
    gender: Gender; // Optional: "Brother" or "Sister"
    userId: string; // Optional: link to profile (if public)
  },
  "type" | "location" | "gender"
>;

type UserFeed = NullableExcept<
  {
    type: "user";
    location: string; // "Lagos", "Abuja", or "Global"
    timestamp: string;
  },
  "type" | "location"
>;

export type FeedItem = MandateFeed | UserFeed;

export type FeedCollection = CollectionReference<FeedItem>;

export const feed = {};
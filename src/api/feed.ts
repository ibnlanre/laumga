import type { NullableExcept } from "@/services/types";
import type { CollectionReference } from "firebase/firestore";
import {
  collection,
  query,
  where,
  orderBy,
  limit as limitQuery,
  getDocs,
  startAfter,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/services/firebase";
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

export interface FeedQueryResult {
  items: FeedItem[];
  nextCursor: string | null;
}

export interface FeedQueryParams {
  limit?: number;
  cursor?: string;
}

export const feed = {
  fetchUserFeed,
  fetchMandateFeed,
  fetchGlobalFeed,
};

/**
 * Fetch user-specific feed (posts visible to a specific user)
 */
async function fetchUserFeed({
  userId,
  limit = 20,
  cursor,
}: FeedQueryParams & { userId: string }): Promise<FeedQueryResult> {
  const feedRef = collection(db, "feed") as FeedCollection;

  let feedQuery = query(
    feedRef,
    where("userId", "==", userId),
    orderBy("timestamp", "desc"),
    limitQuery(limit + 1)
  );

  // If cursor is provided, start after that document
  if (cursor) {
    const cursorDoc = await getCursorDocument(cursor);
    if (cursorDoc) {
      feedQuery = query(
        feedRef,
        where("userId", "==", userId),
        orderBy("timestamp", "desc"),
        startAfter(cursorDoc),
        limitQuery(limit + 1)
      );
    }
  }

  const snapshot = await getDocs(feedQuery);
  const items = snapshot.docs.slice(0, limit).map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as FeedItem[];

  const nextCursor =
    snapshot.docs.length > limit ? snapshot.docs[limit - 1].id : null;

  return { items, nextCursor };
}

/**
 * Fetch mandate-specific feed (posts related to a mandate)
 */
async function fetchMandateFeed({
  mandateId,
  limit = 20,
  cursor,
}: FeedQueryParams & { mandateId: string }): Promise<FeedQueryResult> {
  const feedRef = collection(db, "feed") as FeedCollection;

  let feedQuery = query(
    feedRef,
    where("type", "==", "mandate"),
    orderBy("timestamp", "desc"),
    limitQuery(limit + 1)
  );

  if (cursor) {
    const cursorDoc = await getCursorDocument(cursor);
    if (cursorDoc) {
      feedQuery = query(
        feedRef,
        where("type", "==", "mandate"),
        orderBy("timestamp", "desc"),
        startAfter(cursorDoc),
        limitQuery(limit + 1)
      );
    }
  }

  const snapshot = await getDocs(feedQuery);
  const items = snapshot.docs.slice(0, limit).map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as FeedItem[];

  const nextCursor =
    snapshot.docs.length > limit ? snapshot.docs[limit - 1].id : null;

  return { items, nextCursor };
}

/**
 * Fetch global feed (all feed items visible globally)
 */
async function fetchGlobalFeed({
  limit = 20,
  cursor,
}: FeedQueryParams = {}): Promise<FeedQueryResult> {
  const feedRef = collection(db, "feed") as FeedCollection;

  let feedQuery = query(
    feedRef,
    orderBy("timestamp", "desc"),
    limitQuery(limit + 1)
  );

  if (cursor) {
    const cursorDoc = await getCursorDocument(cursor);
    if (cursorDoc) {
      feedQuery = query(
        feedRef,
        orderBy("timestamp", "desc"),
        startAfter(cursorDoc),
        limitQuery(limit + 1)
      );
    }
  }

  const snapshot = await getDocs(feedQuery);
  const items = snapshot.docs.slice(0, limit).map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as FeedItem[];

  const nextCursor =
    snapshot.docs.length > limit ? snapshot.docs[limit - 1].id : null;

  return { items, nextCursor };
}

/**
 * Helper function to get cursor document by ID
 */
async function getCursorDocument(
  cursorId: string
): Promise<QueryDocumentSnapshot | null> {
  const feedRef = collection(db, "feed") as FeedCollection;
  const snapshot = await getDocs(
    query(feedRef, where("__name__", "==", cursorId))
  );
  return snapshot.docs[0] || null;
}

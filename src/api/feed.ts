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
  Timestamp,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { z } from "zod/v4";

// Schemas
const mandateTierSchema = z.enum([
  "supporter",
  "builder",
  "guardian",
  "custom",
]);
const genderSchema = z.enum(["male", "female"]);

export const mandateFeedSchema = z.object({
  id: z.string(),
  type: z.literal("mandate"),
  location: z.string(),
  timestamp: z.instanceof(Timestamp),
  tier: mandateTierSchema.nullable(),
  gender: genderSchema,
  userId: z.string().nullable(),
});

export type MandateFeed = z.infer<typeof mandateFeedSchema>;

export const userFeedSchema = z.object({
  id: z.string(),
  type: z.literal("user"),
  location: z.string(),
  timestamp: z.instanceof(Timestamp),
});

export type UserFeed = z.infer<typeof userFeedSchema>;

export const feedItemSchema = z.union([mandateFeedSchema, userFeedSchema]);
export type FeedItem = z.infer<typeof feedItemSchema>;

export type FeedItemData = Omit<FeedItem, "id">;
export type FeedCollection = CollectionReference<FeedItemData>;
export type FeedDocumentReference = CollectionReference<FeedItemData>;

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
  const items = snapshot.docs.slice(0, limit).map((doc) =>
    feedItemSchema.parse({
      id: doc.id,
      ...doc.data(),
    })
  );

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
    where("location", "==", mandateId),
    orderBy("timestamp", "desc"),
    limitQuery(limit + 1)
  );

  if (cursor) {
    const cursorDoc = await getCursorDocument(cursor);
    if (cursorDoc) {
      feedQuery = query(
        feedRef,
        where("type", "==", "mandate"),
        where("location", "==", mandateId),
        orderBy("timestamp", "desc"),
        startAfter(cursorDoc),
        limitQuery(limit + 1)
      );
    }
  }

  const snapshot = await getDocs(feedQuery);
  const items = snapshot.docs.slice(0, limit).map((doc) =>
    feedItemSchema.parse({
      id: doc.id,
      ...doc.data(),
    })
  );

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
  const items = snapshot.docs.slice(0, limit).map((doc) =>
    feedItemSchema.parse({
      id: doc.id,
      ...doc.data(),
    })
  );

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

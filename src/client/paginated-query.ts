import type {
  CollectionReference,
  DocumentData,
  Query,
  QueryDocumentSnapshot,
} from "firebase/firestore";

import {
  endBefore,
  getCountFromServer,
  getDocs,
  limit,
  limitToLast,
  query,
  startAfter,
} from "firebase/firestore";
import { buildQuery, type Variables, type SortBy } from "./core-query";

/**
 * Pagination cursor - can be serialized/deserialized for API transmission
 */
export interface PaginationCursor<
  DocumentType extends DocumentData = DocumentData,
> {
  id: string;
  values: Partial<DocumentType>; // Stores all orderBy field values
}

/**
 * Pagination response format
 */
export interface PaginationResponse<DocumentType extends DocumentData> {
  data: Array<DocumentType & { id: string }>;
  meta: {
    total: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
    cursors: {
      next: PaginationCursor<DocumentType> | null;
      previous: PaginationCursor<DocumentType> | null;
    };
  };
}

/**
 * Options for pagination
 */
export interface PaginatedVariables<DocumentType extends DocumentData>
  extends Variables<DocumentType> {
  pageSize?: number;
  afterCursor?: PaginationCursor<DocumentType> | null;
  beforeCursor?: PaginationCursor<DocumentType> | null;
}

/**
 * Creates a cursor from a document snapshot
 */
function createCursor<DocumentType extends DocumentData>(
  docSnapshot: QueryDocumentSnapshot<DocumentType>,
  sortBy: SortBy<DocumentType>
): PaginationCursor<DocumentType> {
  const values: Partial<DocumentType> = {};
  const snapshot = docSnapshot.data();
  const id = docSnapshot.id;

  if (sortBy.length) {
    sortBy.forEach(({ field }) => {
      values[field] = snapshot[field];
    });
  }

  return { id, values };
}

function applyAfterCursor<DocumentType extends DocumentData>(
  q: Query<DocumentType>,
  cursor: PaginationCursor<DocumentType>,
  sortBy: SortBy<DocumentType>
): Query<DocumentType> {
  if (!sortBy.length) return q;
  const cursorValues = sortBy.map(({ field }) => cursor.values[field]);
  return query(q, startAfter(...cursorValues));
}

function applyBeforeCursor<DocumentType extends DocumentData>(
  q: Query<DocumentType>,
  cursor: PaginationCursor<DocumentType>,
  sortBy: SortBy<DocumentType>
): Query<DocumentType> {
  if (!sortBy.length) return q;
  const cursorValues = sortBy.map(({ field }) => cursor.values[field]);
  return query(q, endBefore(...cursorValues));
}

export async function buildPaginatedQuery<
  DocumentType extends DocumentData = DocumentData,
>(
  collection: CollectionReference<DocumentType>,
  variables: PaginatedVariables<DocumentType> = {}
) {
  const {
    pageSize = Infinity,
    afterCursor = null,
    beforeCursor = null,
    filterBy = [],
    sortBy = [],
  } = variables;

  let querySnapshot = buildQuery(collection, { filterBy, sortBy });
  const countSnapshot = await getCountFromServer(querySnapshot);
  const total = countSnapshot.data().count;

  if (afterCursor) {
    querySnapshot = applyAfterCursor(querySnapshot, afterCursor, sortBy);
    querySnapshot = query(querySnapshot, limit(pageSize));
  } else if (beforeCursor) {
    querySnapshot = applyBeforeCursor(querySnapshot, beforeCursor, sortBy);
    querySnapshot = query(querySnapshot, limitToLast(pageSize));
  } else {
    querySnapshot = query(querySnapshot, limit(pageSize));
  }

  return {
    querySnapshot,
    total,
    pageSize,
    afterCursor,
    beforeCursor,
    sortBy,
    filterBy,
  };
}

/**
 * Main pagination function - fetches a page of documents with cursor-based pagination
 */
export async function getPaginatedQueryDocs<
  DocumentType extends DocumentData = DocumentData,
>(
  collection: CollectionReference<DocumentType>,
  options: PaginatedVariables<DocumentType> = {}
): Promise<PaginationResponse<DocumentType>> {
  const { querySnapshot, total, afterCursor, beforeCursor, pageSize, sortBy } =
    await buildPaginatedQuery(collection, options);

  const documentSnapshots = await getDocs(querySnapshot);

  if (documentSnapshots.empty) {
    return {
      data: [],
      meta: {
        total,
        pageSize,
        hasNext: false,
        hasPrevious: afterCursor !== null || beforeCursor !== null,
        cursors: {
          next: null,
          previous: afterCursor || beforeCursor || null,
        },
      },
    };
  }

  // Extract data
  const docs = documentSnapshots.docs;
  const data = docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  // Create cursors
  const firstDoc = docs.at(0)!;
  const lastDoc = docs.at(-1)!;

  const nextCursor =
    docs.length === pageSize ? createCursor(lastDoc, sortBy) : null;
  const previousCursor =
    afterCursor || beforeCursor ? createCursor(firstDoc, sortBy) : null;

  // Determine if there are more pages
  const hasNext = docs.length === pageSize;
  const hasPrevious = afterCursor !== null || beforeCursor !== null;

  return {
    data: beforeCursor ? data.reverse() : data,
    meta: {
      total,
      pageSize,
      hasNext,
      hasPrevious,
      cursors: {
        next: nextCursor,
        previous: previousCursor,
      },
    },
  };
}

/**
 * Helper to serialize cursor for API transmission (e.g., base64 encode)
 */
export function serializeCursor<
  DocumentType extends DocumentData = DocumentData,
>(cursor: PaginationCursor<DocumentType> | null): string | null {
  if (!cursor) return null;
  return Buffer.from(JSON.stringify(cursor)).toString("base64");
}

/**
 * Helper to deserialize cursor from API
 */
export function deserializeCursor<
  DocumentType extends DocumentData = DocumentData,
>(cursorString: string | null): PaginationCursor<DocumentType> | null {
  if (!cursorString) return null;
  try {
    return JSON.parse(Buffer.from(cursorString, "base64").toString("utf-8"));
  } catch {
    return null;
  }
}

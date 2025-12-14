import { tryCatch } from "@/utils/try-catch";
import type { Paths } from "@/types/paths";
import type {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  OrderByDirection,
  WhereFilterOp,
} from "firebase/firestore";

import {
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
  Query,
} from "firebase/firestore";
import type z from "zod";

export const FilterOperator = Object.freeze({
  EqualTo: "==",
  NotEqualTo: "!=",
  LessThan: "<",
  LessThanOrEqualTo: "<=",
  GreaterThan: ">",
  GreaterThanOrEqualTo: ">=",
  Includes: "array-contains",
  IncludesAny: "array-contains-any",
  In: "in",
  NotIn: "not-in",
}) satisfies Record<string, WhereFilterOp>;

/**
 * Query filters for building Firestore queries
 */
export type FilterBy<
  DocumentType extends DocumentData,
  Operator extends WhereFilterOp = WhereFilterOp,
> = Array<{
  field: Paths<DocumentType>;
  operator: Operator;
  value: any;
}>;

/**
 * Sorting order interface for Firestore queries
 */
export type SortBy<DocumentType extends DocumentData> = Array<{
  field: Paths<DocumentType>;
  value: OrderByDirection;
}>;

export interface Variables<DocumentType extends DocumentData> {
  filterBy?: FilterBy<DocumentType>;
  sortBy?: SortBy<DocumentType>;
}

/**
 * Builds a Firestore query from filters
 */
export function buildQuery<DocumentType extends DocumentData = DocumentData>(
  collection: CollectionReference<DocumentType>,
  variables: Variables<DocumentType> = {}
): Query<DocumentType> {
  const { filterBy = [], sortBy = [] } = variables;

  let querySnapshot = query(collection);

  if (filterBy.length) {
    filterBy.forEach(({ field, operator, value }) => {
      querySnapshot = query(querySnapshot, where(field, operator, value));
    });
  }

  if (sortBy.length) {
    sortBy.forEach(({ field, value }) => {
      querySnapshot = query(querySnapshot, orderBy(field, value));
    });
  }

  return querySnapshot;
}

export async function getQueryDocs<
  DocumentType extends DocumentData,
  Schema extends z.ZodType,
>(querySnapshot: Query<DocumentType>, schema: Schema) {
  const result = await tryCatch(async () => {
    const snapshot = await getDocs(querySnapshot);
    if (snapshot.empty) return [];
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return schema.array().parse(data);
  });

  if (result.success) return result.data;
  return [];
}

async function getDocument<
  DocumentType extends DocumentData,
  Schema extends z.ZodType,
>(snapshot: DocumentSnapshot<DocumentType, DocumentData>, schema: Schema) {
  if (!snapshot.exists()) return null;
  const data = { id: snapshot.id, ...snapshot.data() };
  return schema.parse(data);
}

type Reference<DocumentType extends DocumentData> =
  | DocumentReference<DocumentType>
  | Query<DocumentType>;

export async function getQueryDoc<
  DocumentType extends DocumentData,
  Schema extends z.ZodType,
>(reference: Reference<DocumentType>, schema: Schema) {
  const result = await tryCatch(async () => {
    if (reference instanceof Query) {
      const result = await getDocs(reference);
      if (result.empty) return null;

      const [snapshot] = result.docs;
      return getDocument(snapshot, schema);
    }

    const snapshot = await getDoc(reference);
    return getDocument(snapshot, schema);
  });

  if (result.success) return result.data;
  return null;
}

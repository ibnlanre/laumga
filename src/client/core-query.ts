import { tryCatch } from "@/utils/try-catch";
import type {
  CollectionReference,
  DocumentData,
  DocumentReference,
  OrderByDirection,
  Query,
  WhereFilterOp,
} from "firebase/firestore";

import { getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
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
  DocumentType,
  Operator extends WhereFilterOp = WhereFilterOp,
> = Array<{
  field: Extract<keyof DocumentType, string>;
  operator: Operator;
  value: any;
}>;

/**
 * Sorting order interface for Firestore queries
 */
export type SortBy<DocumentType> = Array<{
  field: Extract<keyof DocumentType, string>;
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
  console.error("Error fetching documents:", result.error);
  return [];
}

export async function getQueryDoc<
  DocumentType extends DocumentData,
  Schema extends z.ZodType,
>(reference: DocumentReference<DocumentType>, schema: Schema) {
  const result = await tryCatch(async () => {
    const snapshot = await getDoc(reference);
    if (!snapshot.exists()) return null;
    const data = { id: snapshot.id, ...snapshot.data() };
    return schema.parse(data);
  });

  if (result.success) return result.data;
  console.error("Error fetching document:", result.error);
  return null;
}

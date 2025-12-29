import type { Paths } from "@/utils/to-paths/types";
import type {
  DocumentData,
  DocumentReference,
  OrderByDirection,
  WhereFilterOp,
} from "firebase/firestore";

import { Query } from "firebase/firestore";

/**
 * Query filters for building Firestore queries
 */
export type FilterBy<
  DocumentType extends DocumentData,
  Operator extends WhereFilterOp = WhereFilterOp,
> = Array<{
  field: Paths<DocumentType> | (string& {})
  operator: Operator;
  value: any;
}>;

/**
 * Sorting order interface for Firestore queries
 */
export type SortBy<DocumentType extends DocumentData> = Array<{
  field: Paths<DocumentType> | (string& {})
  direction: OrderByDirection;
}>;

export interface Variables<DocumentType extends DocumentData> {
  filterBy?: FilterBy<DocumentType>;
  sortBy?: SortBy<DocumentType>;
}

export type Reference<DocumentType extends DocumentData> =
  | DocumentReference<DocumentType>
  | Query<DocumentType>;

import type { WhereFilterOp } from "firebase/firestore";

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

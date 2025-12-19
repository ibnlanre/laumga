import { queryOptions } from "@tanstack/react-query";
import { mandate } from ".";

export const mandateQueryOptions = (id?: string) => {
  return queryOptions({
  queryKey: mandate.get.$get(id),
  queryFn: () => mandate.$use.get(id!),
  enabled: !!id,
});
}

export type mandateQueryOptions = typeof mandateQueryOptions;
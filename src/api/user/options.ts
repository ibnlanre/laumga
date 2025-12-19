import { queryOptions } from "@tanstack/react-query";
import { user } from ".";

export const userQueryOptions = (id?: string | null) => {
  return queryOptions({
  queryKey: user.get.$get(id),
  queryFn: () => user.$use.get(id!),
  enabled: !!id,
});
}

export type userQueryOptions = typeof userQueryOptions;
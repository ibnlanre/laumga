import { queryOptions, useQuery } from "@tanstack/react-query";

import type { Options } from "@/client/options";
import { executive } from "./index";

export function useCurrentExecutives(
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: executive.list.$get({ isActive: true }),
    queryFn: () => {
      return executive.$use.list({
        filterBy: [{ field: "isActive", operator: "==", value: true }],
        sortBy: [{ field: "tier", value: "asc" }],
      });
    },
  })
) {
  return useQuery({ ...query, ...options });
}

export function useExecutiveByUserId(
  userId?: string,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: executive.list.$get(userId),
    queryFn: () => {
      return executive.$use.list({
        filterBy: [
          { field: "userId", operator: "==", value: userId },
          { field: "isActive", operator: "==", value: true },
        ],
        sortBy: [{ field: "tier", value: "asc" }],
      });
    },
    enabled: !!userId,
  })
) {
  return useQuery({ ...query, ...options });
}

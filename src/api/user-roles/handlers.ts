import { queryOptions, useQuery } from "@tanstack/react-query";
import { userRole } from "./index";
import type { Options } from "@/client/options";

export function useGetUserPermissions(
  userId?: string,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: userRole.getUserPermissions.$get(userId),
    queryFn: () => userRole.$use.getUserPermissions(userId!),
    enabled: !!userId,
  })
) {
  return useQuery({ ...query, ...options });
}

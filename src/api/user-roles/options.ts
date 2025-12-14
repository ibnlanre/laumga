import { queryOptions } from "@tanstack/react-query";
import { userRole } from ".";

export const permissionQueryOptions = (userId?: string) => {
  return queryOptions({
    queryKey: userRole.getUserPermissions.$get(userId),
    queryFn: () => userRole.$use.getUserPermissions(userId!),
    enabled: !!userId,
  });
};

export type permissionQueryOptions = typeof permissionQueryOptions
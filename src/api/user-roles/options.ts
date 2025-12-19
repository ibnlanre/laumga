import { queryOptions } from "@tanstack/react-query";
import { userRole } from ".";
import type { ListUserRoleVariables } from "./types";

export const permissionQueryOptions = (userId?: string) => {
  return queryOptions({
    queryKey: userRole.getUserPermissions.$get(userId),
    queryFn: () => userRole.$use.getUserPermissions(userId!),
    enabled: !!userId,
  });
};

export const listUserRoleOptions = (variables: ListUserRoleVariables) => {
  return queryOptions({
    queryKey: userRole.list.$use(variables),
    queryFn: () => userRole.$use.list(variables),
  });
};

export const getUserRoleOptions = (id?: string) => {
  return queryOptions({
    queryKey: userRole.get.$get(id),
    queryFn: () => userRole.$use.get(id!),
    enabled: !!id,
  });
};

export type permissionQueryOptions = typeof permissionQueryOptions;

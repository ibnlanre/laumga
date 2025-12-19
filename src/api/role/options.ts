import { queryOptions } from "@tanstack/react-query";
import { role } from ".";
import type { ListRoleVariables } from "./types";

export const listRoleOptions = (variables?: ListRoleVariables) => {
  return queryOptions({
    queryKey: role.list.$use(variables),
    queryFn: () => role.$use.list(variables),
  });
};

export const getRoleOptions = (id?: string) => {
  return queryOptions({
    queryKey: role.get.$get(id),
    queryFn: () => role.$use.get(id!),
    enabled: !!id,
  });
};

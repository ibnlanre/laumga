import { queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { userRole } from ".";
import type { ListUserRoleVariables } from "./types";

export const getUserPermissionsOptions = (userId?: string) => {
  const getUserPermissions = useServerFn(userRole.$use.getUserPermissions);
  return queryOptions({
    queryKey: userRole.getUserPermissions.$get({ data: userId }),
    queryFn: () => getUserPermissions({ data: userId! }),
    enabled: !!userId,
  });
};

export const listUserRoleOptions = (variables: ListUserRoleVariables) => {
  const list = useServerFn(userRole.$use.list);
  return queryOptions({
    queryKey: userRole.list.$use({ data: variables }),
    queryFn: () => list({ data: variables }),
  });
};

export const getUserRoleOptions = (id?: string) => {
  const get = useServerFn(userRole.$use.get);
  return queryOptions({
    queryKey: userRole.get.$get({ data: id }),
    queryFn: () => get({ data: id! }),
    enabled: !!id,
  });
};

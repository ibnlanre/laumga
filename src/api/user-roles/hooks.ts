import { useMutation, useQuery, queryOptions } from "@tanstack/react-query";

import { userRole } from ".";
import type { Options } from "@/client/options";
import type { ListUserRoleVariables } from "./types";

export function useListUserRoles(
  variables: ListUserRoleVariables,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: userRole.list.$use(variables),
    queryFn: () => userRole.$use.list(variables),
  })
) {
  return useQuery({ ...query, ...options });
}

export function useGetUserRoles(
  id?: string,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: userRole.get.$get(id),
    queryFn: () => userRole.$use.get(id!),
    enabled: !!id,
  })
) {
  return useQuery({ ...query, ...options });
}

export function useAssignUserRoles() {
  return useMutation({
    mutationKey: userRole.assign.$get(),
    mutationFn: userRole.$use.assign,
    meta: {
      errorMessage: "Failed to assign role.",
      successMessage: "Role assigned successfully.",
    },
  });
}

export function useRemoveUserRoles() {
  return useMutation({
    mutationKey: userRole.remove.$get(),
    mutationFn: userRole.$use.remove,
    meta: {
      errorMessage: "Failed to remove role.",
      successMessage: "Role removed successfully.",
    },
  });
}

import { queryOptions, useMutation, useQuery, type DefaultError, type QueryKey } from "@tanstack/react-query";

import type { Options } from "@/client/options";
import { role } from "./index";
import type { ListRoleVariables } from "./types";

export function useCreateRole() {
  return useMutation({
    mutationKey: role.create.$get(),
    mutationFn: role.$use.create,
    meta: {
      errorMessage: "Failed to create role.",
      successMessage: "Role created successfully.",
    },
  });
}

export function useUpdateRole() {
  return useMutation({
    mutationKey: role.update.$get(),
    mutationFn: role.$use.update,
    meta: {
      errorMessage: "Failed to update role.",
      successMessage: "Role updated successfully.",
    },
  });
}

export function useRemoveRole() {
  return useMutation({
    mutationKey: role.remove.$get(),
    mutationFn: role.$use.remove,
    meta: {
      errorMessage: "Failed to delete role.",
      successMessage: "Role deleted successfully.",
    },
  });
}

export function useListRoles(
  variables?: ListRoleVariables,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: role.list.$use(variables),
    queryFn: () => role.$use.list(variables),
  })
) {
  return useQuery({ ...query, ...options });
}

export function useGetRole(id?: string) {
  return useQuery({
    queryKey: role.get.$get(id),
    queryFn: () => role.$use.get(id!),
    enabled: !!id,
  });
}


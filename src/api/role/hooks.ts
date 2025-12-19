import { useMutation, useQuery } from "@tanstack/react-query";

import { role } from "./index";

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

export function useGetRole(id?: string) {
  return useQuery({
    queryKey: role.get.$get(id),
    queryFn: () => role.$use.get(id!),
    enabled: !!id,
  });
}

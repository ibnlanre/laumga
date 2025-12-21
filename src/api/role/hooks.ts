import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { role } from "./index";

export function useCreateRole() {
  return useMutation({
    mutationKey: role.create.$get(),
    mutationFn: useServerFn(role.$use.create),
    meta: {
      errorMessage: "Failed to create role.",
      successMessage: "Role created successfully.",
    },
  });
}

export function useUpdateRole() {
  return useMutation({
    mutationKey: role.update.$get(),
    mutationFn: useServerFn(role.$use.update),
    meta: {
      errorMessage: "Failed to update role.",
      successMessage: "Role updated successfully.",
    },
  });
}

export function useRemoveRole() {
  return useMutation({
    mutationKey: role.remove.$get(),
    mutationFn: useServerFn(role.$use.remove),
    meta: {
      errorMessage: "Failed to delete role.",
      successMessage: "Role deleted successfully.",
    },
  });
}

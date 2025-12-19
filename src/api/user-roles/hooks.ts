import { useMutation } from "@tanstack/react-query";

import { userRole } from ".";

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

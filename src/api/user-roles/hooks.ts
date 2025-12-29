import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { userRole } from ".";

export function useAssignUserRoles() {
  return useMutation({
    mutationKey: userRole.assign.$get(),
    mutationFn: useServerFn(userRole.$use.assign),
    meta: {
      errorMessage: "Failed to assign role.",
      successMessage: "Role assigned successfully.",
    },
  });
}

export function useRemoveUserRoles() {
  return useMutation({
    mutationKey: userRole.remove.$get(),
    mutationFn: useServerFn(userRole.$use.remove),
    meta: {
      errorMessage: "Failed to remove role.",
      successMessage: "Role removed successfully.",
    },
  });
}

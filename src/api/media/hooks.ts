import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { media } from ".";

export function useCreateMedia() {
  return useMutation({
    mutationKey: media.create.$get(),
    mutationFn: useServerFn(media.$use.create),
    meta: {
      errorMessage: "Failed to add media.",
      successMessage: "Media added successfully.",
    },
  });
}

export function useUpdateMedia() {
  return useMutation({
    mutationKey: media.update.$get(),
    mutationFn: useServerFn(media.$use.update),
    meta: {
      errorMessage: "Failed to update media.",
      successMessage: "Media updated successfully.",
    },
  });
}

export function useRemoveMedia() {
  return useMutation({
    mutationKey: media.remove.$get(),
    mutationFn: useServerFn(media.$use.remove),
    meta: {
      errorMessage: "Failed to remove gallery media.",
      successMessage: "Media removed successfully.",
    },
  });
}

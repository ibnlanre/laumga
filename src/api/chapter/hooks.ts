import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { chapter } from "./index";

export function useCreateChapter() {
  return useMutation({
    mutationKey: chapter.create.$get(),
    mutationFn: useServerFn(chapter.$use.create),
    meta: {
      errorMessage: "Failed to create chapter.",
      successMessage: "Chapter created successfully.",
    },
  });
}

export function useUpdateChapter() {
  return useMutation({
    mutationKey: chapter.update.$get(),
    mutationFn: useServerFn(chapter.$use.update),
    meta: {
      errorMessage: "Failed to update chapter.",
      successMessage: "Chapter updated successfully.",
    },
  });
}

export function useRemoveChapter() {
  return useMutation({
    mutationKey: chapter.remove.$get(),
    mutationFn: useServerFn(chapter.$use.remove),
    meta: {
      errorMessage: "Failed to delete chapter.",
      successMessage: "Chapter deleted successfully.",
    },
  });
}

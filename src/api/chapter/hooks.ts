import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { chapter } from "./index";
import type { ListChapterVariables } from "./types";
import type { Options } from "@/client/options";

export function useCreateChapter() {
  return useMutation({
    mutationKey: chapter.create.$get(),
    mutationFn: chapter.$use.create,
    meta: {
      errorMessage: "Failed to create chapter.",
      successMessage: "Chapter created successfully.",
    },
  });
}

export function useUpdateChapter() {
  return useMutation({
    mutationKey: chapter.update.$get(),
    mutationFn: chapter.$use.update,
    meta: {
      errorMessage: "Failed to update chapter.",
      successMessage: "Chapter updated successfully.",
    },
  });
}

export function useRemoveChapter() {
  return useMutation({
    mutationKey: chapter.remove.$get(),
    mutationFn: chapter.$use.remove,
    meta: {
      errorMessage: "Failed to delete chapter.",
      successMessage: "Chapter deleted successfully.",
    },
  });
}

export function useListChapters(
  variables?: ListChapterVariables,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: chapter.list.$use(variables),
    queryFn: () => chapter.$use.list(variables),
  })
) {
  return useQuery({ ...query, ...options });
}

export function useGetChapter(id?: string) {
  return useQuery({
    queryKey: chapter.get.$get(id),
    queryFn: () => chapter.$use.get(id!),
    enabled: !!id,
  });
}

import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";

import type { Options } from "@/client/options";
import { library } from "./index";
import type { ListLibraryVariables } from "./types";

export function useCreateLibrary() {
  return useMutation({
    mutationKey: library.create.$get(),
    mutationFn: library.$use.create,
    meta: {
      errorMessage: "Failed to create library.",
      successMessage: "Library created successfully.",
    },
  });
}

export function useUpdateLibrary() {
  return useMutation({
    mutationKey: library.update.$get(),
    mutationFn: library.$use.update,
    meta: {
      errorMessage: "Failed to update library.",
      successMessage: "Library updated successfully.",
    },
  });
}

export function useRemoveLibrary() {
  return useMutation({
    mutationKey: library.remove.$get(),
    mutationFn: library.$use.remove,
    meta: {
      errorMessage: "Failed to delete library.",
      successMessage: "Library deleted successfully.",
    },
  });
}

export function useListLibraries(
  variables?: ListLibraryVariables,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: library.list.$use(variables),
    queryFn: () => library.$use.list(variables),
  })
) {
  return useQuery({ ...query, ...options });
}

export function useGetLibrary(id?: string) {
  return useQuery({
    queryKey: library.get.$get(id),
    queryFn: () => library.$use.get(id!),
    enabled: !!id,
  });
}

import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { author } from "./index";
import type { Options } from "@/client/options";
import type { ListAuthorVariables } from "./types";

export function useCreateAuthor() {
  return useMutation({
    mutationKey: author.create.$get(),
    mutationFn: author.$use.create,
    meta: {
      errorMessage: "Failed to create author.",
      successMessage: "Author created successfully.",
    },
  });
}

export function useUpdateAuthor() {
  return useMutation({
    mutationKey: author.update.$get(),
    mutationFn: author.$use.update,
    meta: {
      errorMessage: "Failed to update author.",
      successMessage: "Author updated successfully.",
    },
  });
}

export function useRemoveAuthor() {
  return useMutation({
    mutationKey: author.remove.$get(),
    mutationFn: author.$use.remove,
    meta: {
      errorMessage: "Failed to delete author.",
      successMessage: "Author deleted successfully.",
    },
  });
}

export function useListAuthors(
  variables?: ListAuthorVariables,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: author.list.$use(variables),
    queryFn: () => author.$use.list(variables),
  })
) {
  return useQuery({ ...query, ...options });
}

export function useGetAuthor(id?: string) {
  return useQuery({
    queryKey: author.get.$get(id),
    queryFn: () => author.$use.get(id!),
    enabled: !!id,
  });
}

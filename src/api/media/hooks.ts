import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";

import type { Options } from "@/client/options";
import { media } from ".";
import type { ListMediaVariables } from "./types";

export function useGetMedia(
  id?: string,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: media.get.$get(id),
    queryFn: () => media.$use.get(id!),
    enabled: !!id,
  })
) {
  return useQuery({ ...query, ...options });
}

export function useGetFeaturedMedia(
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: media.getFeaturedMedia.$get(),
    queryFn: () => media.$use.getFeaturedMedia(),
  })
) {
  return useQuery({ ...query, ...options });
}

export function useListMedia(
  variables?: ListMediaVariables,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: media.list.$use(variables),
    queryFn: () => media.$use.list(variables),
  })
) {
  return useQuery({ ...query, ...options });
}

export function useCreateMedia() {
  return useMutation({
    mutationKey: media.create.$get(),
    mutationFn: media.$use.create,
    meta: {
      errorMessage: "Failed to add media.",
      successMessage: "Media added successfully.",
    },
  });
}

export function useUpdateMedia() {
  return useMutation({
    mutationKey: media.update.$get(),
    mutationFn: media.$use.update,
    meta: {
      errorMessage: "Failed to update media.",
      successMessage: "Media updated successfully.",
    },
  });
}

export function useRemoveMedia() {
  return useMutation({
    mutationKey: media.remove.$get(),
    mutationFn: media.$use.remove,
    meta: {
      errorMessage: "Failed to remove gallery media.",
      successMessage: "Media removed successfully.",
    },
  });
}

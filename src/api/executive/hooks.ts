import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";

import type { Options } from "@/client/options";
import { executive } from "./index";
import type { ListExecutiveVariables } from "./types";

export function useCreateExecutive() {
  return useMutation({
    mutationKey: executive.create.$get(),
    mutationFn: executive.$use.create,
    meta: {
      errorMessage: "Failed to create executive.",
      successMessage: "Executive created successfully.",
    },
  });
}

export function useUpdateExecutive() {
  return useMutation({
    mutationKey: executive.update.$get(),
    mutationFn: executive.$use.update,
    meta: {
      errorMessage: "Failed to update executive.",
      successMessage: "Executive updated successfully.",
    },
  });
}

export function useRemoveExecutive() {
  return useMutation({
    mutationKey: executive.remove.$get(),
    mutationFn: executive.$use.remove,
    meta: {
      errorMessage: "Failed to delete executive.",
      successMessage: "Executive deleted successfully.",
    },
  });
}

export function useListExecutives(
  variables?: ListExecutiveVariables,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: executive.list.$use(variables),
    queryFn: () => executive.$use.list(variables),
  })
) {
  return useQuery({ ...query, ...options });
}

export function useGetExecutive(id?: string) {
  return useQuery({
    queryKey: executive.get.$get(id),
    queryFn: () => executive.$use.get(id!),
    enabled: !!id,
  });
}

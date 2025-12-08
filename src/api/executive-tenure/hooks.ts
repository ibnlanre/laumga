import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import type { ListExecutiveTenureVariables } from "./types";
import type { Options } from "@/client/options";
import { executiveTenure } from "./index";

export function useCreateExecutiveTenure() {
  return useMutation({
    mutationKey: executiveTenure.create.$get(),
    mutationFn: executiveTenure.$use.create,
    meta: {
      errorMessage: "Failed to create executive tenure.",
      successMessage: "Executive tenure created successfully.",
    },
  });
}

export function useUpdateExecutiveTenure() {
  return useMutation({
    mutationKey: executiveTenure.update.$get(),
    mutationFn: executiveTenure.$use.update,
    meta: {
      errorMessage: "Failed to update executive tenure.",
      successMessage: "Executive tenure updated successfully.",
    },
  });
}

export function useRemoveExecutiveTenure() {
  return useMutation({
    mutationKey: executiveTenure.remove.$get(),
    mutationFn: executiveTenure.$use.remove,
    meta: {
      errorMessage: "Failed to delete executive tenure.",
      successMessage: "Executive tenure deleted successfully.",
    },
  });
}

export function useListExecutiveTenures(
  variables?: ListExecutiveTenureVariables,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: executiveTenure.list.$use(variables),
    queryFn: () => executiveTenure.$use.list(variables),
  })
) {
  return useQuery({ ...query, ...options });
}

export function useGetExecutiveTenure(id?: string) {
  return useQuery({
    queryKey: executiveTenure.get.$get(id),
    queryFn: () => executiveTenure.$use.get(id!),
    enabled: !!id,
  });
}

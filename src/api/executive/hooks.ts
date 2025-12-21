import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";

import { executive } from "./index";

export function useCreateExecutive() {
  return useMutation({
    mutationKey: executive.create.$get(),
    mutationFn: useServerFn(executive.$use.create),
    meta: {
      errorMessage: "Failed to create executive.",
      successMessage: "Executive created successfully.",
    },
  });
}

export function useUpdateExecutive() {
  return useMutation({
    mutationKey: executive.update.$get(),
    mutationFn: useServerFn(executive.$use.update),
    meta: {
      errorMessage: "Failed to update executive.",
      successMessage: "Executive updated successfully.",
    },
  });
}

export function useRemoveExecutive() {
  return useMutation({
    mutationKey: executive.remove.$get(),
    mutationFn: useServerFn(executive.$use.remove),
    meta: {
      errorMessage: "Failed to delete executive.",
      successMessage: "Executive deleted successfully.",
    },
  });
}

export function useGetExecutive(id?: string) {
  return useQuery({
    queryKey: executive.get.$get(id),
    queryFn: () => executive.$use.get({ data: id! }),
    enabled: !!id,
  });
}

import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { executiveTenure } from "./index";

export function useCreateExecutiveTenure() {
  return useMutation({
    mutationKey: executiveTenure.create.$get(),
    mutationFn: useServerFn(executiveTenure.$use.create),
    meta: {
      errorMessage: "Failed to create executive tenure.",
      successMessage: "Executive tenure created successfully.",
    },
  });
}

export function useUpdateExecutiveTenure() {
  return useMutation({
    mutationKey: executiveTenure.update.$get(),
    mutationFn: useServerFn(executiveTenure.$use.update),
    meta: {
      errorMessage: "Failed to update executive tenure.",
      successMessage: "Executive tenure updated successfully.",
    },
  });
}

export function useRemoveExecutiveTenure() {
  return useMutation({
    mutationKey: executiveTenure.remove.$get(),
    mutationFn: useServerFn(executiveTenure.$use.remove),
    meta: {
      errorMessage: "Failed to delete executive tenure.",
      successMessage: "Executive tenure deleted successfully.",
    },
  });
}

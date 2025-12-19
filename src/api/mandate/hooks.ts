import { useMutation, useQuery } from "@tanstack/react-query";
import { mandate } from "./index";
import type { ListMandateVariables } from "./types";
import { mandateQueryOptions } from "./options";

export function useListMandates(variables?: ListMandateVariables) {
  return useQuery({
    queryKey: mandate.list.$get(variables),
    queryFn: () => mandate.$use.list(variables),
  });
}

export function useCreateMandate() {
  return useMutation({
    mutationKey: mandate.create.$get(),
    mutationFn: mandate.$use.create,
    meta: {
      errorMessage: "Failed to create mandate. Please try again.",
      successMessage: "Mandate created successfully.",
    },
  });
}

export function useUpdateMandate() {
  return useMutation({
    mutationKey: mandate.update.$get(),
    mutationFn: mandate.$use.update,
    meta: {
      errorMessage: "Failed to update mandate.",
      successMessage: "Mandate updated successfully.",
    },
  });
}

export function useGetMandate(id?: string) {
  return useQuery(mandateQueryOptions(id));
}

export function usePauseMandate() {
  return useMutation({
    mutationKey: mandate.pause.$get(),
    mutationFn: mandate.$use.pause,
    meta: {
      errorMessage: "Failed to pause mandate.",
      successMessage: "Mandate paused successfully.",
    },
  });
}

export function useCancelMandate() {
  return useMutation({
    mutationKey: mandate.cancel.$get(),
    mutationFn: mandate.$use.cancel,
    meta: {
      errorMessage: "Failed to cancel mandate.",
      successMessage: "Mandate cancelled successfully.",
    },
  });
}

export function useReinstateMandate() {
  return useMutation({
    mutationKey: mandate.reinstate.$get(),
    mutationFn: mandate.$use.reinstate,
    meta: {
      errorMessage: "Failed to reinstate mandate.",
      successMessage: "Mandate reinstated successfully.",
    },
  });
}

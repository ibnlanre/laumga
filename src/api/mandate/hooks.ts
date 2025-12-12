import { useMutation, useQuery } from "@tanstack/react-query";
import { mandate } from "./index";
import type { ListMandateVariables } from "./types";

export function useListMandates(variables?: ListMandateVariables) {
  return useQuery({
    queryKey: mandate.list.$get(),
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

export function useSyncMandateStatus() {
  return useMutation({
    mutationKey: mandate.syncStatus.$get(),
    mutationFn: mandate.$use.syncStatus,
    meta: {
      errorMessage: "Failed to sync mandate status.",
      successMessage: "Mandate status synced successfully.",
    },
  });
}

export function useDebitMandate() {
  return useMutation({
    mutationKey: mandate.debit.$get(),
    mutationFn: mandate.$use.debit,
    meta: {
      errorMessage: "Failed to process payment.",
      successMessage: "Payment processed successfully.",
    },
  });
}

export function useGetMandate(mandateId: string) {
  return useQuery({
    queryKey: mandate.get.$use(mandateId),
    queryFn: () => mandate.$use.get(mandateId),
    enabled: !!mandateId,
  });
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

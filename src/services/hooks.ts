import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/api";

/**
 * User Management Hooks
 */

export function useCreateUser() {
  return useMutation({
    mutationKey: api.user.create.$get(),
    mutationFn: api.$use.user.create,
    meta: {
      errorMessage: "Failed to create user. Please try again.",
      successMessage: "User created successfully.",
    },
  });
}

export function useCurrentUser() {
  return useMutation({
    mutationKey: api.user.fetch.$get(),
    mutationFn: api.$use.user.fetch,
    meta: {
      errorMessage: "Failed to fetch current user data.",
      successMessage: "User data fetched successfully.",
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationKey: api.user.login.$get(),
    mutationFn: api.$use.user.login,
    meta: {
      errorMessage: "Login failed. Please try again.",
      successMessage: "Logged in successfully.",
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationKey: api.user.resetPassword.$get(),
    mutationFn: api.$use.user.resetPassword,
    meta: {
      errorMessage: "Failed to send reset email. Please try again.",
      successMessage: "Reset email sent successfully.",
    },
  });
}

/**
 * Mandate Management Hooks
 */

export function useCreateMandate() {
  return useMutation({
    mutationKey: api.mandate.create.$get(),
    mutationFn: api.$use.mandate.create,
    meta: {
      errorMessage: "Failed to create mandate. Please try again.",
      successMessage: "Mandate created successfully.",
    },
  });
}

export function useSyncMandateStatus() {
  return useMutation({
    mutationKey: api.mandate.syncStatus.$get(),
    mutationFn: api.$use.mandate.syncStatus,
    meta: {
      errorMessage: "Failed to sync mandate status.",
      successMessage: "Mandate status synced successfully.",
    },
  });
}

export function useDebitMandate() {
  return useMutation({
    mutationKey: api.mandate.debit.$get(),
    mutationFn: api.$use.mandate.debit,
    meta: {
      errorMessage: "Failed to process payment.",
      successMessage: "Payment processed successfully.",
    },
  });
}

export function useFetchMandate(mandateId: string) {
  return useQuery({
    queryKey: api.mandate.fetch.$use(mandateId),
    queryFn: () => api.$use.mandate.fetch(mandateId),
    enabled: !!mandateId,
  });
}

export function useFetchUserMandates(userId: string) {
  return useQuery({
    queryKey: api.mandate.fetchByUserId.$use(userId),
    queryFn: () => api.$use.mandate.fetchByUserId(userId),
    enabled: !!userId,
  });
}

export function useFetchActiveMandate(userId: string) {
  return useQuery({
    queryKey: api.mandate.getActive.$use(userId),
    queryFn: () => api.$use.mandate.getActive(userId),
    enabled: !!userId,
  });
}

export function usePauseMandate() {
  return useMutation({
    mutationKey: api.mandate.pause.$get(),
    mutationFn: api.$use.mandate.pause,
    meta: {
      errorMessage: "Failed to pause mandate.",
      successMessage: "Mandate paused successfully.",
    },
  });
}

export function useCancelMandate() {
  return useMutation({
    mutationKey: api.mandate.cancel.$get(),
    mutationFn: api.$use.mandate.cancel,
    meta: {
      errorMessage: "Failed to cancel mandate.",
      successMessage: "Mandate cancelled successfully.",
    },
  });
}

export function useReinstateMandate() {
  return useMutation({
    mutationKey: api.mandate.reinstate.$get(),
    mutationFn: api.$use.mandate.reinstate,
    meta: {
      errorMessage: "Failed to reinstate mandate.",
      successMessage: "Mandate reinstated successfully.",
    },
  });
}

export function useFetchMandateTransactions(mandateId: string) {
  return useQuery({
    queryKey: api.mandate.fetchTransactions.$use(mandateId),
    queryFn: () => api.$use.mandate.fetchTransactions(mandateId),
    enabled: !!mandateId,
  });
}

export function useFetchUserTransactions(userId: string) {
  return useQuery({
    queryKey: api.mandate.fetchUserTransactions.$use(userId),
    queryFn: () => api.$use.mandate.fetchUserTransactions(userId),
    enabled: !!userId,
  });
}

/**
 * Payment Partner Hooks
 */

export function useCreatePaymentPartner() {
  return useMutation({
    mutationKey: api.paymentPartner.create.$get(),
    mutationFn: api.$use.paymentPartner.create,
    meta: {
      errorMessage: "Failed to create payment partner.",
      successMessage: "Payment partner created successfully.",
    },
  });
}

export function useFetchPaymentPartners() {
  return useQuery({
    queryKey: api.paymentPartner.fetchAll.$use(),
    queryFn: () => api.$use.paymentPartner.fetchAll(),
  });
}

export function useFetchClientPartner() {
  return useQuery({
    queryKey: api.paymentPartner.getClient.$use(),
    queryFn: () => api.$use.paymentPartner.getClient(),
  });
}

export function useFetchPlatformPartner() {
  return useQuery({
    queryKey: api.paymentPartner.getPlatform.$use(),
    queryFn: () => api.$use.paymentPartner.getPlatform(),
  });
}

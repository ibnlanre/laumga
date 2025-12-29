import { useMutation, useQuery } from "@tanstack/react-query";

import { flutterwave } from ".";
import { useServerFn } from "@tanstack/react-start";
import type { FlutterwaveTokenStatusResponse } from "./types";

export function useTokenizeFlutterwaveAccount() {
  return useMutation({
    mutationKey: flutterwave.account.tokenize.$get(),
    mutationFn: useServerFn(flutterwave.$use.account.tokenize),
    meta: {
      errorMessage: "Failed to tokenize bank account. Please try again.",
      successMessage: "Bank account tokenized successfully.",
    },
  });
}

export function useGetFlutterwaveAccountStatus(reference?: string | null) {
  const getStatus = useServerFn(flutterwave.$use.account.status);

  return useQuery<FlutterwaveTokenStatusResponse>({
    queryKey: flutterwave.account.status.$get(reference),
    queryFn: () => getStatus({ data: reference! }),
    meta: {
      errorMessage: "Failed to get bank account status. Please try again.",
    },
    enabled: !!reference,
  });
}

export function useUpdateFlutterwaveAccount() {
  return useMutation({
    mutationKey: flutterwave.account.update.$get(),
    mutationFn: useServerFn(flutterwave.$use.account.update),
    meta: {
      errorMessage: "Failed to update bank account. Please try again.",
      successMessage: "Bank account updated successfully.",
    },
  });
}

export function useTokenizedFlutterwaveCharge() {
  return useMutation({
    mutationKey: flutterwave.charge.tokenized.$get(),
    mutationFn: useServerFn(flutterwave.$use.charge.tokenized),
    meta: {
      errorMessage: "Failed to process tokenized charge. Please try again.",
      successMessage: "Tokenized charge processed successfully.",
    },
  });
}

export function useCreateFlutterwavePlanCheckout() {
  return useMutation({
    mutationKey: flutterwave.payment.planCheckout.$get(),
    mutationFn: useServerFn(flutterwave.$use.payment.planCheckout),
    meta: {
      errorMessage: "Unable to start secure checkout. Please try again.",
      successMessage: "Secure checkout ready.",
    },
  });
}

export function useCreateFlutterwavePaymentPlan() {
  return useMutation({
    mutationKey: flutterwave.paymentPlan.create.$get(),
    mutationFn: useServerFn(flutterwave.$use.paymentPlan.create),
    meta: {
      errorMessage: "Unable to prepare subscription plan. Please try again.",
      successMessage: "Subscription plan ready.",
    },
  });
}

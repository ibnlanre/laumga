import { useMutation, useQuery } from "@tanstack/react-query";

import { flutterwave } from ".";
import { useServerFn } from "@tanstack/react-start";

export function useFetchFlutterwaveBanks() {
  return useQuery({
    queryKey: flutterwave.bank.list.$use(),
    queryFn: () => flutterwave.$use.bank.list,
  });
}

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

export function useGetFlutterwaveAccountStatus() {
  return useMutation({
    mutationKey: flutterwave.account.status.$get(),
    mutationFn: useServerFn(flutterwave.$use.account.status),
    meta: {
      errorMessage: "Failed to get bank account status. Please try again.",
    },
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
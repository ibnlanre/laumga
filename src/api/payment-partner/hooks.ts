import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";

import type { Options } from "@/client/options";

import { paymentPartner } from "./index";

export function useCreatePaymentPartner() {
  return useMutation({
    mutationKey: paymentPartner.create.$get(),
    mutationFn: paymentPartner.$use.create,
    meta: {
      errorMessage: "Failed to create payment partner.",
      successMessage: "Payment partner created successfully.",
    },
  });
}

export function useUpdatePaymentPartner() {
  return useMutation({
    mutationKey: paymentPartner.update.$get(),
    mutationFn: paymentPartner.$use.update,
    meta: {
      errorMessage: "Failed to update payment partner.",
      successMessage: "Payment partner updated successfully.",
    },
  });
}

export function useListPaymentPartners(
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: paymentPartner.list.$use(),
    queryFn: () => paymentPartner.$use.list(),
  })
) {
  return useQuery({ ...query, ...options });
}

export function useGetPaymentPartner(id?: string) {
  return useQuery({
    queryKey: paymentPartner.get.$get(id),
    queryFn: () => paymentPartner.$use.get(id as string),
    enabled: !!id,
  });
}

export function useGetActivePaymentPartners(
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: paymentPartner.getActive.$use(),
    queryFn: () => paymentPartner.$use.getActive(),
  })
) {
  return useQuery({ ...query, ...options });
}

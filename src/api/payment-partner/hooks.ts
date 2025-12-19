import { useMutation } from "@tanstack/react-query";

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

import { useMutation } from "@tanstack/react-query";

import { monoCustomer } from ".";

export function useCreateMonoCustomer() {
  return useMutation({
    mutationKey: monoCustomer.create.$get(),
    mutationFn: monoCustomer.$use.create,
    meta: {
      errorMessage: "Failed to create customer profile. Please try again.",
      successMessage: "Customer profile created successfully.",
    },
  });
}

import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { monoCustomer } from ".";

export function useCreateMonoCustomer() {
  return useMutation({
    mutationKey: monoCustomer.create.$get(),
    mutationFn: useServerFn(monoCustomer.$use.create),
    meta: {
      errorMessage: "Failed to create customer profile. Please try again.",
      successMessage: "Customer profile created successfully.",
    },
  });
}

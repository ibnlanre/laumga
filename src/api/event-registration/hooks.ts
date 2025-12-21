import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { eventRegistration } from "./index";

export function useCreateEventRegistration() {
  return useMutation({
    mutationKey: eventRegistration.create.$get(),
    mutationFn: useServerFn(eventRegistration.$use.create),
    meta: {
      errorMessage: "Failed to register for event.",
      successMessage: "Registered successfully!",
    },
  });
}

export function useUpdateEventRegistration() {
  return useMutation({
    mutationKey: eventRegistration.update.$get(),
    mutationFn: useServerFn(eventRegistration.$use.update),
    meta: {
      errorMessage: "Failed to update registration.",
      successMessage: "Registration updated successfully.",
    },
  });
}

export function useRemoveEventRegistration() {
  return useMutation({
    mutationKey: eventRegistration.remove.$get(),
    mutationFn: useServerFn(eventRegistration.$use.remove),
    meta: {
      errorMessage: "Failed to cancel registration.",
      successMessage: "Registration cancelled successfully.",
    },
  });
}

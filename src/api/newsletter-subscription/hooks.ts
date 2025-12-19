import { useMutation } from "@tanstack/react-query";
import { newsletterSubscription } from ".";

export function useSubscribe() {
  return useMutation({
    mutationKey: newsletterSubscription.subscribe.$get(),
    mutationFn: newsletterSubscription.$use.subscribe,
    meta: {
      successMessage: "Subscribed to newsletter successfully",
      errorMessage: "Failed to subscribe to newsletter",
    },
  });
}

export function useUnsubscribe() {
  return useMutation({
    mutationKey: newsletterSubscription.unsubscribe.$get(),
    mutationFn: newsletterSubscription.$use.unsubscribe,
    meta: {
      successMessage: "Unsubscribed from newsletter successfully",
      errorMessage: "Failed to unsubscribe from newsletter",
    },
  });
}

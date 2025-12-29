import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { newsletterSubscription } from ".";

export function useSubscribe() {
  return useMutation({
    mutationKey: newsletterSubscription.subscribe.$get(),
    mutationFn: useServerFn(newsletterSubscription.$use.subscribe),
    meta: {
      successMessage: "Subscribed to newsletter successfully",
      errorMessage: "Failed to subscribe to newsletter",
    },
  });
}

export function useUnsubscribe() {
  return useMutation({
    mutationKey: newsletterSubscription.unsubscribe.$get(),
    mutationFn: useServerFn(newsletterSubscription.$use.unsubscribe),
    meta: {
      successMessage: "Unsubscribed from newsletter successfully",
      errorMessage: "Failed to unsubscribe from newsletter",
    },
  });
}

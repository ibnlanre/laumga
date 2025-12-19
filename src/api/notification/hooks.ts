import { useMutation } from "@tanstack/react-query";
import { notification } from ".";

export function useCreateNotification() {
  return useMutation({
    mutationKey: notification.create.$get(),
    mutationFn: notification.$use.create,
    meta: {
      successMessage: "Message sent successfully",
      errorMessage: "Unable to submit your message",
    },
  });
}

export function useUpdateNotificationStatus() {
  return useMutation({
    mutationKey: notification.updateStatus.$get(),
    mutationFn: notification.$use.updateStatus,
    meta: {
      successMessage: "Notification updated",
      errorMessage: "Unable to update notification",
    },
  });
}

import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";

import type { Options } from "@/client/options";
import { notification } from ".";
import type { ListNotificationVariables } from "./types";

export function useNotifications(
  variables?: ListNotificationVariables,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: notification.list.$use(variables),
    queryFn: () => notification.$use.list(variables),
  })
) {
  return useQuery({ ...query, ...options });
}

export function useGetNotification(
  id?: string,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: notification.get.$get(id),
    queryFn: () => notification.$use.get(id!),
    enabled: !!id,
  })
) {
  return useQuery({ ...query, ...options });
}

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

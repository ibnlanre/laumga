import { queryOptions } from "@tanstack/react-query";
import { notification } from ".";
import type { ListNotificationVariables } from "./types";

export const listNotificationOptions = (
  variables?: ListNotificationVariables
) => {
  return queryOptions({
    queryKey: notification.list.$use(variables),
    queryFn: () => notification.$use.list(variables),
  });
};

export const getNotificationOptions = (id?: string) => {
  return queryOptions({
    queryKey: notification.get.$get(id),
    queryFn: () => notification.$use.get(id!),
    enabled: !!id,
  });
};

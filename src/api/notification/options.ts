import { queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { notification } from ".";
import type { ListNotificationVariables } from "./types";

export const listNotificationOptions = (
  variables?: ListNotificationVariables
) => {
  const list = useServerFn(notification.$use.list);
  return queryOptions({
    queryKey: notification.list.$get(variables),
    queryFn: () => list({ data: variables }),
  });
};

export const getNotificationOptions = (id?: string) => {
  const get = useServerFn(notification.$use.get);
  return queryOptions({
    queryKey: notification.get.$get(id),
    queryFn: () => get({ data: id! }),
    enabled: !!id,
  });
};

import { queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { event } from ".";
import type { ListEventVariables } from "./types";

export const getEventOptions = (id?: string) => {
  const get = useServerFn(event.$use.get);
  return queryOptions({
    queryKey: event.get.$get(id),
    queryFn: () => get({ data: id! }),
    enabled: !!id,
  });
};

export const listEventOptions = (variables?: ListEventVariables) => {
  const list = useServerFn(event.$use.list);
  return queryOptions({
    queryKey: event.list.$get(variables),
    queryFn: () => list({ data: variables }),
  });
};

import { queryOptions } from "@tanstack/react-query";
import { event } from ".";
import type { ListEventVariables } from "./types";

export const getEventOptions = (id?: string) => {
  return queryOptions({
    queryKey: event.get.$get(id),
    queryFn: () => event.$use.get(id!),
    enabled: !!id,
  });
};

export const listEventOptions = (variables?: ListEventVariables) => {
  return queryOptions({
    queryKey: event.list.$get(variables),
    queryFn: () => event.$use.list(variables),
  });
};

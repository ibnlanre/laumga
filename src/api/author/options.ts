import { queryOptions } from "@tanstack/react-query";
import { author } from ".";
import type { ListAuthorVariables } from "./types";

export const getAuthorOptions = (id?: string) => {
  return queryOptions({
    queryKey: author.get.$get(id),
    queryFn: () => author.$use.get(id!),
    enabled: !!id,
  });
};

export const listAuthorOptions = (variables?: ListAuthorVariables) => {
  return queryOptions({
    queryKey: author.list.$get(variables),
    queryFn: () => author.$use.list(variables),
  });
};

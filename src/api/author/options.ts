import { queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { author } from ".";
import type { ListAuthorVariables } from "./types";

export const getAuthorOptions = (id?: string) => {
  const get = useServerFn(author.$use.get);
  return queryOptions({
    queryKey: author.get.$get(id),
    queryFn: () => get({ data: id! }),
    enabled: !!id,
  });
};

export const listAuthorOptions = (variables?: ListAuthorVariables) => {
  const list = useServerFn(author.$use.list);
  return queryOptions({
    queryKey: author.list.$get(variables),
    queryFn: () => list({ data: variables }),
  });
};

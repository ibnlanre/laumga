import { queryOptions } from "@tanstack/react-query";
import { executive } from ".";
import type { ListExecutiveVariables } from "./types";

export const listExecutiveOptions = (variables?: ListExecutiveVariables) => {
  return queryOptions({
    queryKey: executive.list.$use(variables),
    queryFn: () => executive.$use.list(variables),
  });
};

export const getExecutiveOptions = (id?: string) => {
  return queryOptions({
    queryKey: executive.get.$get(id),
    queryFn: () => executive.$use.get(id!),
    enabled: !!id,
  });
};

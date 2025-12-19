import { queryOptions } from "@tanstack/react-query";
import { mandate } from ".";
import type { ListMandateVariables } from "./types";

export const getMandateOptions = (id?: string) => {
  return queryOptions({
    queryKey: mandate.get.$get(id),
    queryFn: () => mandate.$use.get(id!),
    enabled: !!id,
  });
};

export const listMandateOptions = (variables?: ListMandateVariables) => {
  return queryOptions({
    queryKey: mandate.list.$get(variables),
    queryFn: () => mandate.$use.list(variables),
  });
};

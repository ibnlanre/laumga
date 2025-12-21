import { queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { mandate } from ".";
import type { ListMandateVariables } from "./types";

export const getMandateOptions = (id?: string) => {
  const get = useServerFn(mandate.$use.get);
  return queryOptions({
    queryKey: mandate.get.$get({ data: id }),
    queryFn: () => get({ data: id! }),
    enabled: !!id,
  });
};

export const listMandateOptions = (variables?: ListMandateVariables) => {
  const list = useServerFn(mandate.$use.list);
  return queryOptions({
    queryKey: mandate.list.$get({ data: variables }),
    queryFn: () => list({ data: variables }),
  });
};

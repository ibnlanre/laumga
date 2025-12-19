import { queryOptions } from "@tanstack/react-query";
import { executiveTenure } from ".";
import type { ListExecutiveTenureVariables } from "./types";

export const listExecutiveTenureOptions = (
  variables?: ListExecutiveTenureVariables
) => {
  return queryOptions({
    queryKey: executiveTenure.list.$use(variables),
    queryFn: () => executiveTenure.$use.list(variables),
  });
};

export const getExecutiveTenureOptions = (id?: string) => {
  return queryOptions({
    queryKey: executiveTenure.get.$get(id),
    queryFn: () => executiveTenure.$use.get(id!),
    enabled: !!id,
  });
};

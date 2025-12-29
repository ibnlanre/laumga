import { queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { executiveTenure } from ".";
import type { ListExecutiveTenureVariables } from "./types";

export const listExecutiveTenureOptions = (
  variables?: ListExecutiveTenureVariables
) => {
  const list = useServerFn(executiveTenure.$use.list);
  return queryOptions({
    queryKey: executiveTenure.list.$use({ data: variables }),
    queryFn: () => list({ data: variables }),
  });
};

export const getExecutiveTenureOptions = (id?: string) => {
  const get = useServerFn(executiveTenure.$use.get);
  return queryOptions({
    queryKey: executiveTenure.get.$get({ data: id }),
    queryFn: () => get({ data: id! }),
    enabled: !!id,
  });
};

export const getActiveTenureOptions = () => {
  const list = useServerFn(executiveTenure.$use.list);
  return queryOptions({
    queryKey: executiveTenure.list.$get({ data: { isActive: true } }),
    queryFn: () =>
      list({
        data: {
          filterBy: [{ field: "isActive", operator: "==", value: true }],
        },
      }),
    select: (data) => data.at(0),
  });
};

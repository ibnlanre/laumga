import { queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { executive } from ".";
import type { ListExecutiveVariables } from "./types";

export const listExecutiveOptions = (variables?: ListExecutiveVariables) => {
  const list = useServerFn(executive.$use.list);
  return queryOptions({
    queryKey: executive.list.$use({ data: variables }),
    queryFn: () => list({ data: variables }),
  });
};

export const getExecutiveOptions = (id?: string) => {
  const get = useServerFn(executive.$use.get);
  return queryOptions({
    queryKey: executive.get.$get({ data: id }),
    queryFn: () => get({ data: id! }),
    enabled: !!id,
  });
};

export const listCurrentExecutivesOptions = () => {
  const list = useServerFn(executive.$use.list);
  return queryOptions({
    queryKey: executive.list.$get({ data: { isActive: true } }),
    queryFn: () =>
      list({
        data: {
          filterBy: [{ field: "isActive", operator: "==", value: true }],
          sortBy: [{ field: "tier", value: "asc" }],
        },
      }),
  });
};

export const listExecutiveByUserIdOptions = (userId?: string) => {
  const list = useServerFn(executive.$use.list);
  return queryOptions({
    queryKey: executive.list.$get({ data: userId }),
    queryFn: () =>
      list({
        data: {
          filterBy: [
            { field: "userId", operator: "==", value: userId },
            { field: "isActive", operator: "==", value: true },
          ],
          sortBy: [{ field: "tier", value: "asc" }],
        },
      }),
    enabled: !!userId,
  });
};

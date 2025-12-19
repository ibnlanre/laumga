import { queryOptions } from "@tanstack/react-query";
import { user } from ".";
import type { ListUserVariables } from "./types";

export const listUserOptions = (variables?: ListUserVariables) => {
  return queryOptions({
    queryKey: user.list.$use(variables),
    queryFn: () => user.$use.list(variables),
  });
};

export const getUserOptions = (id?: string | null) => {
  return queryOptions({
    queryKey: user.get.$get(id),
    queryFn: () => user.$use.get(id!),
    enabled: !!id,
  });
};

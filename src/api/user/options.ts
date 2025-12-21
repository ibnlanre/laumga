import { queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { user } from ".";
import type { ListUserVariables } from "./types";

export const listUserOptions = (data?: ListUserVariables) => {
  const list = useServerFn(user.$use.list);
  return queryOptions({
    queryKey: user.list.$use({ data }),
    queryFn: () => list({ data }),
  });
};

export const getUserOptions = (id?: string) => {
  const get = useServerFn(user.$use.get);
  return queryOptions({
    queryKey: user.get.$get({ data: id }),
    queryFn: () => get({ data: id! }),
    enabled: !!id,
  });
};

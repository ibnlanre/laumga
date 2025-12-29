import { queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { role } from ".";
import type { ListRoleVariables } from "./types";

export const listRoleOptions = (variables?: ListRoleVariables) => {
  const list = useServerFn(role.$use.list);
  return queryOptions({
    queryKey: role.list.$use({ data: variables }),
    queryFn: () => list({ data: variables }),
  });
};

export const getRoleOptions = (id?: string) => {
  const get = useServerFn(role.$use.get);
  return queryOptions({
    queryKey: role.get.$get({ data: id }),
    queryFn: () => get({ data: id! }),
    enabled: !!id,
  });
};

export const getRoleByNameOptions = (name?: string) => {
  const getByName = useServerFn(role.$use.getByName);
  return queryOptions({
    queryKey: role.getByName.$get({ data: name }),
    queryFn: () => getByName({ data: name! }),
    select: (role) => role?.permissions || [],
    enabled: !!name,
  });
};

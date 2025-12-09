import { queryOptions, useQuery } from "@tanstack/react-query";
import { role } from "./index";
import type { Options } from "@/client/options";

export function useGetRoleByName(
  name?: string,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: role.getByName.$get(name),
    queryFn: () => role.$use.getByName(name!),
    select: (role) => role?.permissions || [],
    enabled: !!name,
  })
) {
  return useQuery({ ...query, ...options });
}

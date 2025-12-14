import { useQuery } from "@tanstack/react-query";
import type { Options } from "@/client/options";
import { permissionQueryOptions } from "./options";

export function useGetUserPermissions(
  userId?: string,
) {
  return useQuery(permissionQueryOptions(userId));
}

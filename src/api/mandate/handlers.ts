import { useQuery } from "@tanstack/react-query";
import { mandate } from ".";

export function useGetUserMandate(userId?: string) {
  return useQuery({
    queryKey: mandate.fetchByUserId.$get(userId),
    queryFn: () => mandate.$use.fetchByUserId(userId!),
    enabled: !!userId,
  });
}

export function useGetActiveMandate(userId?: string) {
  return useQuery({
    queryKey: mandate.getActive.$get(userId),
    queryFn: () => mandate.$use.getActive(userId!),
    enabled: !!userId,
  });
}

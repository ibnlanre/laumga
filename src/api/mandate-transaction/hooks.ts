import { queryOptions, useQuery } from "@tanstack/react-query";
import { mandateTransactions } from ".";
import type { Options } from "@/client/options";
import type { ListMandateVariables } from "./types";

export function useGetMandateTransaction(mandateId: string) {
  return useQuery({
    queryKey: mandateTransactions.get.$get(mandateId),
    queryFn: () => mandateTransactions.$use.get(mandateId),
    enabled: !!mandateId,
  });
}

export function useListMandateTransactions(
  variables?: ListMandateVariables,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: mandateTransactions.list.$use(variables),
    queryFn: () => mandateTransactions.$use.list(variables),
  })
) {
  return useQuery({ ...query, ...options });
}

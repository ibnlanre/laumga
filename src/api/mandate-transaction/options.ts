import { queryOptions } from "@tanstack/react-query";
import { mandateTransactions } from ".";
import type { ListMandateVariables } from "./types";

export const getMandateTransactionOptions = (mandateId: string) => {
  return queryOptions({
    queryKey: mandateTransactions.get.$get(mandateId),
    queryFn: () => mandateTransactions.$use.get(mandateId),
    enabled: !!mandateId,
  });
};

export const listMandateTransactionOptions = (
  variables?: ListMandateVariables
) => {
  return queryOptions({
    queryKey: mandateTransactions.list.$use(variables),
    queryFn: () => mandateTransactions.$use.list(variables),
  });
};

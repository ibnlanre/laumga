import { queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { mandateTransactions } from ".";
import type { ListMandateVariables } from "./types";

export const getMandateTransactionOptions = (mandateId: string) => {
  const get = useServerFn(mandateTransactions.$use.get);
  return queryOptions({
    queryKey: mandateTransactions.get.$use({ data: mandateId }),
    queryFn: () => get({ data: mandateId }),
    enabled: !!mandateId,
  });
};

export const listMandateTransactionOptions = (
  variables?: ListMandateVariables
) => {
  const list = useServerFn(mandateTransactions.$use.list);
  return queryOptions({
    queryKey: mandateTransactions.list.$use({ data: variables }),
    queryFn: () => list({ data: variables }),
  });
};

export const listUserMandateTransactionsOptions = (userId?: string) => {
  const options = listMandateTransactionOptions({
    filterBy: [{ field: "userId", operator: "==", value: userId }],
  });
  return {
    ...options,
    enabled: !!userId,
  };
};

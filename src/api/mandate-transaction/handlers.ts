import { useQuery } from "@tanstack/react-query";
import { listMandateTransactionOptions } from "./options";

export function useListUserMandateTransactions(userId?: string) {
  return useQuery(
    listMandateTransactionOptions({
      filterBy: [{ field: "userId", operator: "==", value: userId }],
    })
  );
}

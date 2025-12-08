import { useListMandateTransactions } from "./hooks";

export function useListUserMandateTransactions(userId?: string) {
  return useListMandateTransactions({
    filterBy: [{ field: "userId", operator: "==", value: userId }],
  });
}

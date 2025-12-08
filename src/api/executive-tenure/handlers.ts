import { useQuery, useMutation } from "@tanstack/react-query";
import { executiveTenure } from "./index";
import type { SetExecutiveTenureActiveVariables } from "./types";

export function useGetActiveTenure() {
  return useQuery({
    queryKey: executiveTenure.list.$get(),
    queryFn: () =>
      executiveTenure.$use.list({
        filterBy: [{ field: "isActive", operator: "==", value: true }],
      }),
    select: (data) => data.at(0),
  });
}

export function useSetActiveTenure() {
  return useMutation({
    mutationKey: executiveTenure.update.$get(),
    mutationFn: (variables: SetExecutiveTenureActiveVariables) => {
      return executiveTenure.$use.update({
        ...variables,
        data: { isActive: true },
      });
    },
    meta: {
      errorMessage: "Failed to set active tenure.",
      successMessage: "Active tenure updated successfully.",
    },
  });
}

import { useQuery } from "@tanstack/react-query";
import { listFeedOptions } from "./options";

export function useUserFeed(userId: string | null | undefined) {
  return useQuery({
    ...listFeedOptions({
      filterBy: [
        { field: "type", operator: "==", value: "user" },
        { field: "userId", operator: "==", value: userId },
      ],
      sortBy: [{ field: "timestamp", value: "desc" }],
    }),
    enabled: !!userId,
  });
}

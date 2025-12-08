import { useFeed } from "./hooks";

export function useUserFeed(userId: string | null | undefined) {
  return useFeed(
    {
      filterBy: [
        { field: "type", operator: "==", value: "user" },
        { field: "userId", operator: "==", value: userId },
      ],
      sortBy: [{ field: "timestamp", value: "desc" }],
    },
    { enabled: !!userId }
  );
}

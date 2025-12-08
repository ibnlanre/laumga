import { useMutation } from "@tanstack/react-query";
import { getServerUser } from "./get-server-user";

/**
 * Hook to fetch user data from the server using FirebaseServerApp.
 * Useful for pre-loading user data during route loading or in loaders.
 */
export function useGetServerUser() {
  return useMutation({
    mutationKey: ["getServerUser"],
    mutationFn: (uid: string) => getServerUser({ data: { uid } }),
    meta: {
      errorMessage: "Failed to load user data from server.",
    },
  });
}

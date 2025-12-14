import { MutationCache, QueryClient } from "@tanstack/react-query";
import { minutesToMilliseconds } from "date-fns";

import {
  showErrorNotification,
  showInfoNotification,
  showSuccessNotification,
} from "../components/notifications";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: minutesToMilliseconds(5),
    },
  },
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (!mutation.meta?.errorMessage) return;

      const actualError =
        error instanceof Error ? error.message : String(error);
      
      const displayError =
        actualError !== mutation.meta.errorMessage
          ? actualError
          : mutation.meta.errorMessage;

      showErrorNotification({
        message: displayError,
      });
    },
    onSettled: (_data, _error, _variables, _context, mutation) => {
      if (mutation.meta?.infoMessage) {
        showInfoNotification({
          message: mutation.meta.infoMessage,
        });
      }
    },
    onSuccess: (_data, _variables, _context, mutation) => {
      queryClient.invalidateQueries({
        predicate(query) {
          return query.options.staleTime !== Number.POSITIVE_INFINITY;
        },
      });

      if (mutation.meta?.successMessage) {
        showSuccessNotification({
          message: mutation.meta.successMessage,
        });
      }
    },
  }),
});

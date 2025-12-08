import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { event } from "./index";
import type { ListEventVariables } from "./types";
import type { Options } from "@/client/options";

export function useCreateEvent() {
  return useMutation({
    mutationKey: event.create.$get(),
    mutationFn: event.$use.create,
    meta: {
      errorMessage: "Failed to create event.",
      successMessage: "Event created successfully.",
    },
  });
}

export function useUpdateEvent() {
  return useMutation({
    mutationKey: event.update.$get(),
    mutationFn: event.$use.update,
    meta: {
      errorMessage: "Failed to update event.",
      successMessage: "Event updated successfully.",
    },
  });
}

export function useRemoveEvent() {
  return useMutation({
    mutationKey: event.remove.$get(),
    mutationFn: event.$use.remove,
    meta: {
      errorMessage: "Failed to delete event.",
      successMessage: "Event deleted successfully.",
    },
  });
}

export function useListEvents(
  variables?: ListEventVariables,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: event.list.$use(variables),
    queryFn: () => event.$use.list(variables),
  })
) {
  return useQuery({ ...query, ...options });
}

export function useGetEvent(id?: string) {
  return useQuery({
    queryKey: event.get.$get(id),
    queryFn: () => event.$use.get(id!),
    enabled: !!id,
  });
}

import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { eventRegistration } from "./index";
import type { ListEventRegistrationVariables } from "./types";
import type { Options } from "@/client/options";

export function useCreateEventRegistration() {
  return useMutation({
    mutationKey: eventRegistration.create.$get(),
    mutationFn: eventRegistration.$use.create,
    meta: {
      errorMessage: "Failed to register for event.",
      successMessage: "Registered successfully!",
    },
  });
}

export function useUpdateEventRegistration() {
  return useMutation({
    mutationKey: eventRegistration.update.$get(),
    mutationFn: eventRegistration.$use.update,
    meta: {
      errorMessage: "Failed to update registration.",
      successMessage: "Registration updated successfully.",
    },
  });
}

export function useRemoveEventRegistration() {
  return useMutation({
    mutationKey: eventRegistration.remove.$get(),
    mutationFn: eventRegistration.$use.remove,
    meta: {
      errorMessage: "Failed to cancel registration.",
      successMessage: "Registration cancelled successfully.",
    },
  });
}

export function useListEventRegistrations(
  variables?: ListEventRegistrationVariables,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: eventRegistration.list.$use(variables),
    queryFn: () => eventRegistration.$use.list(variables),
  })
) {
  return useQuery({ ...query, ...options });
}

export function useGetEventRegistration(id?: string) {
  return useQuery({
    queryKey: eventRegistration.get.$get(id),
    queryFn: () => eventRegistration.$use.get(id!),
    enabled: !!id,
  });
}

export function useCheckIfUserRegisteredForEvent(
  eventId?: string,
  userId?: string
) {
  return useQuery({
    queryKey: eventRegistration.isUserRegisteredForEvent.$get(eventId, userId),
    queryFn: () =>
      eventRegistration.$use.isUserRegisteredForEvent(eventId, userId),
    enabled: !!eventId && !!userId,
  });
}

import { queryOptions } from "@tanstack/react-query";
import { eventRegistration } from "./index";
import type { ListEventRegistrationVariables } from "./types";

export const listEventRegistrationOptions = (
  variables?: ListEventRegistrationVariables
) =>
  queryOptions({
    queryKey: eventRegistration.list.$use(variables),
    queryFn: () => eventRegistration.$use.list(variables),
  });

export const getEventRegistrationOptions = (id?: string) =>
  queryOptions({
    queryKey: eventRegistration.get.$get(id),
    queryFn: () => eventRegistration.$use.get(id!),
    enabled: !!id,
  });

export const checkUserRegistrationOptions = (
  eventId?: string,
  userId?: string
) =>
  queryOptions({
    queryKey: eventRegistration.isUserRegisteredForEvent.$use(eventId, userId),
    queryFn: () =>
      eventRegistration.$use.isUserRegisteredForEvent(eventId, userId),
    enabled: !!eventId && !!userId,
  });

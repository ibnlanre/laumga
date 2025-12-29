import { queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { eventRegistration } from "./index";
import type { ListEventRegistrationVariables } from "./types";

export const listEventRegistrationOptions = (
  variables?: ListEventRegistrationVariables
) => {
  const list = useServerFn(eventRegistration.$use.list);
  return queryOptions({
    queryKey: eventRegistration.list.$use({ data: variables }),
    queryFn: () => list({ data: variables }),
  });
};

export const getEventRegistrationOptions = (id?: string) => {
  const get = useServerFn(eventRegistration.$use.get);
  return queryOptions({
    queryKey: eventRegistration.get.$get({ data: id }),
    queryFn: () => get({ data: id! }),
    enabled: !!id,
  });
};

export const checkUserRegistrationOptions = (
  eventId?: string,
  userId?: string
) => {
  const isUserRegisteredForEvent = useServerFn(
    eventRegistration.$use.isUserRegisteredForEvent
  );
  return queryOptions({
    queryKey: eventRegistration.isUserRegisteredForEvent.$use({
      data: { eventId, userId },
    }),
    queryFn: () =>
      isUserRegisteredForEvent({
        data: { eventId, userId },
      }),
    enabled: !!eventId && !!userId,
  });
};

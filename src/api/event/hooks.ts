import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { event } from "./index";

export function useCreateEvent() {
  return useMutation({
    mutationKey: event.create.$get(),
    mutationFn: useServerFn(event.$use.create),
    meta: {
      errorMessage: "Failed to create event.",
      successMessage: "Event created successfully.",
    },
  });
}

export function useUpdateEvent() {
  return useMutation({
    mutationKey: event.update.$get(),
    mutationFn: useServerFn(event.$use.update),
    meta: {
      errorMessage: "Failed to update event.",
      successMessage: "Event updated successfully.",
    },
  });
}

export function useRemoveEvent() {
  return useMutation({
    mutationKey: event.remove.$get(),
    mutationFn: useServerFn(event.$use.remove),
    meta: {
      errorMessage: "Failed to delete event.",
      successMessage: "Event deleted successfully.",
    },
  });
}

import { z } from "zod";
import { dateSchema, fieldValueSchema } from "@/schema/date";

export const eventRegistrationDataSchema = z.object({
  eventId: z.string().min(1, "Event is required"),
  email: z.email("Invalid email address"),
  attending: z.enum(["yes", "no", "maybe"]).default("maybe"),
  registered: dateSchema,
  updated: dateSchema,
});

export const createEventRegistrationSchema = eventRegistrationDataSchema.extend(
  {
    registered: fieldValueSchema,
    updated: fieldValueSchema,
  }
);

export const updateEventRegistrationSchema =
  createEventRegistrationSchema.partial();

export const eventRegistrationSchema = eventRegistrationDataSchema.extend({
  id: z.string(),
});

export const EVENT_REGISTRATIONS_COLLECTION = "eventRegistrations";

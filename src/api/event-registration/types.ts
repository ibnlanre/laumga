import type {
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import type z from "zod";
import type {
  eventRegistrationDataSchema,
  createEventRegistrationSchema,
  updateEventRegistrationSchema,
  eventRegistrationSchema,
  eventRegistrationFormSchema,
} from "./schema";
import type { User } from "../user/types";
import type { Variables } from "@/client/types";

export type EventRegistration = z.infer<typeof eventRegistrationSchema>;
export type EventRegistrationForm = z.infer<typeof eventRegistrationFormSchema>;
export type EventRegistrationData = z.infer<typeof eventRegistrationDataSchema>;
export type CreateEventRegistrationData = z.infer<
  typeof createEventRegistrationSchema
>;
export type UpdateEventRegistrationData = z.infer<
  typeof updateEventRegistrationSchema
>;

export type UpstreamEventRegistrationCollection =
  CollectionReference<CreateEventRegistrationData>;
export type UpstreamEventRegistrationDocument =
  DocumentReference<CreateEventRegistrationData>;

export type DownstreamEventRegistrationCollection =
  CollectionReference<EventRegistrationData>;
export type DownstreamEventRegistrationDocument =
  DocumentReference<EventRegistrationData>;

export type ListEventRegistrationVariables = Variables<EventRegistrationData>;

export interface CreateEventRegistrationVariables {
  user: User;
  data: CreateEventRegistrationData;
}

export interface UpdateEventRegistrationVariables {
  id: string;
  user: User;
  data: UpdateEventRegistrationData;
}

export interface CancelEventRegistrationVariables {
  eventId: string;
  registrationId?: string;
  user: User;
}

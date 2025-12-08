import type {
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import type z from "zod";
import type {
  eventSchema,
  eventDataSchema,
  createEventSchema,
  updateEventSchema,
} from "./schema";
import type { Variables } from "@/client/core-query";
import type { User } from "../user/types";

export type Event = z.infer<typeof eventSchema>;
export type EventData = z.infer<typeof eventDataSchema>;
export type CreateEventData = z.infer<typeof createEventSchema>;
export type UpdateEventData = z.infer<typeof updateEventSchema>;
export type EventType = z.infer<typeof eventSchema.shape.type>;
export type EventStatus = z.infer<typeof eventSchema.shape.status>;

export type UpstreamEventCollection = CollectionReference<CreateEventData>;
export type UpstreamEventDocument = DocumentReference<CreateEventData>;
export type DownstreamEventCollection = CollectionReference<EventData>;
export type DownstreamEventDocument = DocumentReference<EventData>;

export type ListEventVariables = Variables<EventData>;

export interface CreateEventVariables {
  data: CreateEventData;
  user: User;
}

export interface UpdateEventVariables {
  id: string;
  data: UpdateEventData;
  user: User;
}

import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { buildQuery, getQueryDoc, getQueryDocs } from "@/client/core-query";
import { createBuilder } from "@ibnlanre/builder";
import {
  EVENT_REGISTRATIONS_COLLECTION,
  eventRegistrationSchema,
  updateEventRegistrationSchema,
} from "./schema";
import type {
  CreateEventRegistrationVariables,
  UpdateEventRegistrationVariables,
  UpstreamEventRegistrationCollection,
  UpstreamEventRegistrationDocument,
  DownstreamEventRegistrationCollection,
  DownstreamEventRegistrationDocument,
  ListEventRegistrationVariables,
  CreateEventRegistrationData,
  UpdateEventRegistrationData,
} from "./types";
import { record } from "@/utils/record";
import { EVENTS_COLLECTION, eventSchema } from "../event/schema";
import type { DownstreamEventDocument } from "../event/types";

export async function create(variables: CreateEventRegistrationVariables) {
  const { data, user } = variables;
  const validated = eventRegistrationSchema.parse(data);

  const registrationRef = collection(
    db,
    EVENT_REGISTRATIONS_COLLECTION
  ) as UpstreamEventRegistrationCollection;

  const existingQuery = query(
    registrationRef,
    where("eventId", "==", validated.eventId),
    where("email", "==", validated.email)
  );
  const existingSnapshot = await getDocs(existingQuery);

  if (!existingSnapshot.empty) {
    throw new Error("Already registered for this event");
  }

  const eventRef = doc(
    db,
    EVENTS_COLLECTION,
    validated.eventId
  ) as DownstreamEventDocument;
  const eventSnapshot = await getDoc(eventRef);

  if (!eventSnapshot.exists()) {
    throw new Error("Event not found");
  }

  const event = eventSchema.parse({
    id: eventSnapshot.id,
    ...eventSnapshot.data(),
  });

  if (event.maxAttendees && event.currentAttendees >= event.maxAttendees) {
    throw new Error("Event is full");
  }

  const registrationData: CreateEventRegistrationData = {
    ...validated,
    registered: record(user),
    updated: record(user),
  };

  const batch = writeBatch(db);

  batch.set(doc(registrationRef), registrationData);
  batch.update(eventRef, {
    currentAttendees: increment(1),
    updated: record(user),
  });

  await batch.commit();
}

async function update(variables: UpdateEventRegistrationVariables) {
  const { id, data, user } = variables;
  const validated = updateEventRegistrationSchema.parse(data);

  const registrationRef = doc(
    db,
    EVENT_REGISTRATIONS_COLLECTION,
    id
  ) as UpstreamEventRegistrationDocument;

  const updateData: UpdateEventRegistrationData = {
    ...validated,
    updated: record(user),
  };

  await updateDoc(registrationRef, updateData);
}

async function list(variables?: ListEventRegistrationVariables) {
  const registrationRef = collection(
    db,
    EVENT_REGISTRATIONS_COLLECTION
  ) as DownstreamEventRegistrationCollection;
  const registrationsQuery = buildQuery(registrationRef, variables);
  return await getQueryDocs(registrationsQuery, eventRegistrationSchema);
}

async function get(id: string) {
  const registrationRef = doc(
    db,
    EVENT_REGISTRATIONS_COLLECTION,
    id
  ) as DownstreamEventRegistrationDocument;
  return await getQueryDoc(registrationRef, eventRegistrationSchema);
}

async function remove(id: string) {
  const registrationRef = doc(
    db,
    EVENT_REGISTRATIONS_COLLECTION,
    id
  ) as UpstreamEventRegistrationDocument;

  const data = await getQueryDoc(registrationRef, eventRegistrationSchema);
  if (!data) throw new Error("Event registration not found");

  const eventRef = doc(
    db,
    EVENTS_COLLECTION,
    data.eventId
  ) as UpstreamEventRegistrationDocument;

  const batch = writeBatch(db);

  batch.delete(registrationRef);
  batch.update(eventRef, {
    currentAttendees: increment(-1),
  });

  await batch.commit();
}

async function isUserRegisteredForEvent(
  eventId?: string,
  userId?: string
) {
  if (!eventId || !userId) {
    throw new Error("Event ID and User ID are required");
  }

  const registrationRef = collection(
    db,
    EVENT_REGISTRATIONS_COLLECTION
  ) as DownstreamEventRegistrationCollection;

  const registrationsQuery = query(
    registrationRef,
    where("eventId", "==", eventId),
    where("email", "==", userId)
  );

  return await getDocs(registrationsQuery).then((snapshot) => !snapshot.empty);
}

export const eventRegistration = createBuilder({
  isUserRegisteredForEvent,
  create,
  update,
  list,
  get,
  remove,
});

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createBuilder } from "@ibnlanre/builder";
import { FieldValue } from "firebase-admin/firestore";

import { serverRecord } from "@/utils/server-record";
import {
  buildServerQuery,
  getServerQueryDoc,
  getServerQueryDocs,
  serverCollection,
} from "@/client/core-query/server";
import { createVariablesSchema } from "@/client/schema";
import { db } from "@/services/firebase-admin";

import {
  EVENT_REGISTRATIONS_COLLECTION,
  eventRegistrationSchema,
  createEventRegistrationSchema,
  updateEventRegistrationSchema,
} from "./schema";
import type {
  CreateEventRegistrationData,
  EventRegistrationData,
  UpdateEventRegistrationData,
} from "./types";
import { userSchema } from "../user/schema";
import { EVENTS_COLLECTION, eventSchema } from "../event/schema";
import type { Event, EventData } from "../event/types";

const list = createServerFn({ method: "GET" })
  .inputValidator(createVariablesSchema(eventRegistrationSchema))
  .handler(async ({ data: variables }) => {
    const registrationRef = serverCollection<EventRegistrationData>(
      EVENT_REGISTRATIONS_COLLECTION
    );
    const query = buildServerQuery(registrationRef, variables);
    return getServerQueryDocs(query, eventRegistrationSchema);
  });

const get = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const registrationRef = serverCollection<EventRegistrationData>(
      EVENT_REGISTRATIONS_COLLECTION
    ).doc(id);
    return getServerQueryDoc(registrationRef, eventRegistrationSchema);
  });

const create = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      user: userSchema,
      data: createEventRegistrationSchema,
    })
  )
  .handler(async ({ data: { user, data } }) => {
    const validated = eventRegistrationSchema.parse(data);
    const registrationRef = serverCollection<EventRegistrationData>(
      EVENT_REGISTRATIONS_COLLECTION
    );

    const existingSnapshot = await registrationRef
      .where("eventId", "==", validated.eventId)
      .where("email", "==", validated.email)
      .get();

    if (!existingSnapshot.empty) {
      throw new Error("Already registered for this event");
    }

    const eventRef = serverCollection<EventData>(EVENTS_COLLECTION).doc(
      validated.eventId
    );
    const eventSnapshot = await eventRef.get();

    if (!eventSnapshot.exists) {
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
      registered: serverRecord(user),
      updated: serverRecord(user),
    };

    const batch = db.batch();
    const newRegistrationRef = registrationRef.doc();

    batch.set(newRegistrationRef, registrationData);
    batch.update(eventRef, {
      currentAttendees: FieldValue.increment(1),
      updated: serverRecord(user),
    });

    await batch.commit();
  });

const update = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      user: userSchema,
      data: updateEventRegistrationSchema,
    })
  )
  .handler(async ({ data: { id, data, user } }) => {
    const validated = updateEventRegistrationSchema.parse(data);
    const registrationRef = serverCollection<EventRegistrationData>(
      EVENT_REGISTRATIONS_COLLECTION
    ).doc(id);

    const updateData: UpdateEventRegistrationData = {
      ...validated,
      updated: serverRecord(user),
    };

    await registrationRef.update(updateData);
  });

const remove = createServerFn({ method: "POST" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const registrationRef = serverCollection<EventRegistrationData>(
      EVENT_REGISTRATIONS_COLLECTION
    ).doc(id);

    const snapshot = await registrationRef.get();
    if (!snapshot.exists) throw new Error("Event registration not found");

    const data = eventRegistrationSchema.parse({
      id: snapshot.id,
      ...snapshot.data(),
    });

    const eventRef = serverCollection<Event>(EVENTS_COLLECTION).doc(
      data.eventId
    );

    const batch = db.batch();

    batch.delete(registrationRef);
    batch.update(eventRef, {
      currentAttendees: FieldValue.increment(-1),
    });

    await batch.commit();
  });

const isUserRegisteredForEvent = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      eventId: z.string().optional(),
      userId: z.string().optional(),
    })
  )
  .handler(async ({ data: { eventId, userId } }) => {
    if (!eventId || !userId) {
      throw new Error("Event ID and User ID are required");
    }

    const registrationRef = serverCollection<EventRegistrationData>(
      EVENT_REGISTRATIONS_COLLECTION
    );

    const snapshot = await registrationRef
      .where("eventId", "==", eventId)
      .where("email", "==", userId) // TODO: Fix userId to email or adjust schema
      .get();

    return !snapshot.empty;
  });

export const eventRegistration = createBuilder(
  {
    isUserRegisteredForEvent,
    create,
    update,
    list,
    get,
    remove,
  },
  { prefix: [EVENT_REGISTRATIONS_COLLECTION] }
);

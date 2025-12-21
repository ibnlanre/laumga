import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createBuilder } from "@ibnlanre/builder";

import { serverRecord } from "@/utils/server-record";
import {
  buildServerQuery,
  getServerQueryDoc,
  getServerQueryDocs,
  serverCollection,
} from "@/client/core-query/server";
import { createVariablesSchema } from "@/client/schema";

import {
  EVENTS_COLLECTION,
  createEventSchema,
  eventSchema,
  updateEventSchema,
} from "./schema";
import type { CreateEventData, EventData, UpdateEventData } from "./types";
import { userSchema } from "../user/schema";

const list = createServerFn({ method: "GET" })
  .inputValidator(createVariablesSchema(eventSchema))
  .handler(async ({ data: variables }) => {
    const eventsRef = serverCollection<EventData>(EVENTS_COLLECTION);
    const query = buildServerQuery(eventsRef, variables);
    return getServerQueryDocs(query, eventSchema);
  });

const get = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const eventRef = serverCollection<EventData>(EVENTS_COLLECTION).doc(id);
    return getServerQueryDoc(eventRef, eventSchema);
  });

const create = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      user: userSchema,
      data: createEventSchema,
    })
  )
  .handler(async ({ data: { user, data } }) => {
    const eventsRef = serverCollection<EventData>(EVENTS_COLLECTION);

    const eventData: CreateEventData = {
      ...data,
      created: serverRecord(user),
    };

    await eventsRef.add(eventData);
  });

const update = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      user: userSchema,
      data: updateEventSchema,
    })
  )
  .handler(async ({ data: { id, data, user } }) => {
    const eventRef = serverCollection<EventData>(EVENTS_COLLECTION).doc(id);

    const updateData: UpdateEventData = {
      ...data,
      updated: serverRecord(user),
    };

    await eventRef.update(updateData);
  });

const remove = createServerFn({ method: "POST" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const eventRef = serverCollection<EventData>(EVENTS_COLLECTION).doc(id);
    await eventRef.delete();
  });

export const event = createBuilder(
  {
    create,
    update,
    list,
    get,
    remove,
  },
  { prefix: [EVENTS_COLLECTION] }
);

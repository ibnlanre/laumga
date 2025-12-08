import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { buildQuery, getQueryDoc, getQueryDocs } from "@/client/core-query";
import { createBuilder } from "@ibnlanre/builder";
import {
  EVENTS_COLLECTION,
  createEventSchema,
  eventSchema,
  updateEventSchema,
} from "./schema";
import type {
  CreateEventVariables,
  UpdateEventVariables,
  UpstreamEventCollection,
  UpstreamEventDocument,
  DownstreamEventCollection,
  DownstreamEventDocument,
  ListEventVariables,
  CreateEventData,
  UpdateEventData,
} from "./types";
import { record } from "@/utils/record";

async function create(variables: CreateEventVariables) {
  const { data, user } = variables;
  const validated = createEventSchema.parse(data);

  const eventsRef = collection(
    db,
    EVENTS_COLLECTION
  ) as UpstreamEventCollection;

  const eventData: CreateEventData = {
    ...validated,
    created: record(user),
    updated: record(user),
  };

  await addDoc(eventsRef, eventData);
}

async function update(variables: UpdateEventVariables) {
  const { id, data, user } = variables;
  const validated = updateEventSchema.parse(data);

  const eventRef = doc(db, EVENTS_COLLECTION, id) as UpstreamEventDocument;

  const updateData: UpdateEventData = {
    ...validated,
    updated: record(user),
  };

  await updateDoc(eventRef, updateData);
}

async function list(variables?: ListEventVariables) {
  const eventsRef = collection(
    db,
    EVENTS_COLLECTION
  ) as DownstreamEventCollection;
  const eventsQuery = buildQuery(eventsRef, variables);
  return await getQueryDocs(eventsQuery, eventSchema);
}

async function get(id: string) {
  const eventRef = doc(db, EVENTS_COLLECTION, id) as DownstreamEventDocument;
  return await getQueryDoc(eventRef, eventSchema);
}

async function remove(id: string) {
  const eventRef = doc(db, EVENTS_COLLECTION, id) as UpstreamEventDocument;
  await deleteDoc(eventRef);
}

export const event = createBuilder({
  create,
  update,
  list,
  get,
  remove,
});

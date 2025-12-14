import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { createBuilder } from "@ibnlanre/builder";

import { db } from "@/services/firebase";
import { buildQuery, getQueryDoc, getQueryDocs } from "@/client/core-query";
import { newsletterSubscription } from "@/api/newsletter-subscription";
import {
  NOTIFICATIONS_COLLECTION,
  createNotificationSchema,
  notificationSchema,
} from "./schema";
import type {
  CreateNotificationVariables,
  DownstreamNotificationCollection,
  DownstreamNotificationDocument,
  ListNotificationVariables,
  UpdateNotificationStatusVariables,
  UpstreamNotificationCollection,
  UpstreamNotificationDocument,
} from "./types";

async function list(variables?: ListNotificationVariables) {
  const notificationsRef = collection(
    db,
    NOTIFICATIONS_COLLECTION
  ) as DownstreamNotificationCollection;

  const baseSort: ListNotificationVariables["sortBy"] = [
    { field: "createdAt", value: "desc" },
  ];
  const mergedVariables: ListNotificationVariables = {
    ...(variables ?? {}),
    sortBy: variables?.sortBy?.length ? variables.sortBy : baseSort,
  };

  const notificationsQuery = buildQuery(notificationsRef, mergedVariables);
  return await getQueryDocs(notificationsQuery, notificationSchema);
}

async function get(id: string) {
  const notificationRef = doc(
    db,
    NOTIFICATIONS_COLLECTION,
    id
  ) as DownstreamNotificationDocument;

  return await getQueryDoc(notificationRef, notificationSchema);
}

async function create(variables: CreateNotificationVariables) {
  const { data } = variables;
  const notificationsRef = collection(
    db,
    NOTIFICATIONS_COLLECTION
  ) as UpstreamNotificationCollection;

  const notificationData = createNotificationSchema.parse({
    ...data,
    category: "contact",
    createdAt: serverTimestamp(),
  });

  await addDoc(notificationsRef, notificationData);

  if (notificationData.newsletterOptIn) {
    await newsletterSubscription.$use.subscribe({
      data: {
        email: notificationData.email,
        fullName: notificationData.fullName,
      },
    });
  }
}

async function updateStatus(variables: UpdateNotificationStatusVariables) {
  const { id, status } = variables;
  const notificationRef = doc(
    db,
    NOTIFICATIONS_COLLECTION,
    id
  ) as UpstreamNotificationDocument;

  await updateDoc(notificationRef, { status });
}

export const notification = createBuilder({
  create,
  list,
  get,
  updateStatus,
});

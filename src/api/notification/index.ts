import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createBuilder } from "@ibnlanre/builder";
import { FieldValue } from "firebase-admin/firestore";

import {
  buildServerQuery,
  getServerQueryDoc,
  getServerQueryDocs,
  serverCollection,
} from "@/client/core-query/server";
import { newsletterSubscription } from "@/api/newsletter-subscription";
import {
  NOTIFICATIONS_COLLECTION,
  createNotificationSchema,
  notificationFormSchema,
  notificationSchema,
  notificationStatusSchema,
} from "./schema";
import type { CreateNotificationData, NotificationData } from "./types";
import { createVariablesSchema } from "@/client/schema";

const list = createServerFn({ method: "GET" })
  .inputValidator(createVariablesSchema(notificationSchema))
  .handler(async ({ data: variables }) => {
    const notificationsRef = serverCollection<NotificationData>(
      NOTIFICATIONS_COLLECTION
    );

    const notificationsQuery = buildServerQuery(notificationsRef, variables);
    return await getServerQueryDocs(notificationsQuery, notificationSchema);
  });

const get = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const notificationRef = serverCollection<NotificationData>(
      NOTIFICATIONS_COLLECTION
    ).doc(id);
    return await getServerQueryDoc(notificationRef, notificationSchema);
  });

const create = createServerFn({ method: "POST" })
  .inputValidator(notificationFormSchema)
  .handler(async ({ data: inputData }) => {
    const notificationData = createNotificationSchema.parse({
      ...inputData,
      category: "contact",
      createdAt: FieldValue.serverTimestamp(),
    });

    const notificationsRef = serverCollection<CreateNotificationData>(
      NOTIFICATIONS_COLLECTION
    );

    await notificationsRef.add(notificationData);

    if (notificationData.newsletterOptIn) {
      await newsletterSubscription.$use.subscribe({
        data: {
          email: notificationData.email,
          fullName: notificationData.fullName,
        },
      });
    }
  });

const updateStatus = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      status: notificationStatusSchema,
    })
  )
  .handler(async ({ data }) => {
    const { id, status } = data;
    const notificationRef = serverCollection<NotificationData>(
      NOTIFICATIONS_COLLECTION
    ).doc(id);

    await notificationRef.update({ status });
  });

export const notification = createBuilder(
  {
    create,
    list,
    get,
    updateStatus,
  },
  { prefix: [NOTIFICATIONS_COLLECTION] }
);

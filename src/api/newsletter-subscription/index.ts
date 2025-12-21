import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createBuilder } from "@ibnlanre/builder";
import { FieldValue } from "firebase-admin/firestore";

import {
  getServerQueryDocs,
  serverCollection,
} from "@/client/core-query/server";
import {
  NEWSLETTER_SUBSCRIPTIONS_COLLECTION,
  subscriptionFormSchema,
  subscriptionSchema,
} from "./schema";
import type { CreateSubscriptionData, NewsletterSubscription } from "./types";

const subscribe = createServerFn({ method: "POST" })
  .inputValidator(subscriptionFormSchema)
  .handler(async ({ data }) => {
    const validated = subscriptionFormSchema.parse(data);

    const subscriptionsRef = serverCollection<CreateSubscriptionData>(
      NEWSLETTER_SUBSCRIPTIONS_COLLECTION
    );

    const existingSnapshot = await subscriptionsRef
      .where("email", "==", validated.email)
      .get();

    if (!existingSnapshot.empty) return;

    const newSubscriptionData: CreateSubscriptionData = {
      ...validated,
      subscribedAt: FieldValue.serverTimestamp(),
    };

    await subscriptionsRef.add(newSubscriptionData);
  });

const unsubscribe = createServerFn({ method: "POST" })
  .inputValidator(z.string())
  .handler(async ({ data: email }) => {
    const subscriptionsRef = serverCollection<NewsletterSubscription>(
      NEWSLETTER_SUBSCRIPTIONS_COLLECTION
    );

    const snapshot = await subscriptionsRef.where("email", "==", email).get();

    if (snapshot.empty) {
      throw new Error("Subscription not found");
    }

    await snapshot.docs[0].ref.delete();
  });

const list = createServerFn({ method: "GET" }).handler(async () => {
  const subscriptionsRef = serverCollection<NewsletterSubscription>(
    NEWSLETTER_SUBSCRIPTIONS_COLLECTION
  );
  const activeQuery = subscriptionsRef.orderBy("subscribedAt", "desc");
  return await getServerQueryDocs(activeQuery, subscriptionSchema);
});

export const newsletterSubscription = createBuilder(
  {
    subscribe,
    unsubscribe,
    list,
  },
  { prefix: [NEWSLETTER_SUBSCRIPTIONS_COLLECTION] }
);

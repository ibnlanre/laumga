import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { createBuilder } from "@ibnlanre/builder";

import { db } from "@/services/firebase";
import {
  NEWSLETTER_SUBSCRIPTIONS_COLLECTION,
  createSubscriptionSchema,
  subscriptionSchema,
} from "./schema";
import type {
  CreateSubscriptionData,
  CreateSubscriptionVariables,
  NewsletterSubscription,
  SubscriptionCollection,
} from "./types";
import { getQueryDocs } from "@/client/core-query";

async function subscribe(variables: CreateSubscriptionVariables) {
  const { data, user } = variables;

  const validated = createSubscriptionSchema.parse(data);
  const subscriptionsRef = collection(
    db,
    NEWSLETTER_SUBSCRIPTIONS_COLLECTION
  ) as SubscriptionCollection;

  const existingQuery = query(
    subscriptionsRef,
    where("email", "==", validated.email)
  );
  const existingSnapshot = await getDocs(existingQuery);
  if (!existingSnapshot.empty) return;

  const subscriptionData: CreateSubscriptionData = {
    ...validated,
    subscribedAt: serverTimestamp(),
    firstName: user.firstName,
    lastName: user.lastName,
  };

  await addDoc(subscriptionsRef, subscriptionData);
}

async function unsubscribe(email: string) {
  const subscriptionsRef = collection(
    db,
    NEWSLETTER_SUBSCRIPTIONS_COLLECTION
  ) as SubscriptionCollection;

  const subscriptionQuery = query(
    subscriptionsRef,
    where("email", "==", email)
  );

  const snapshot = await getDocs(subscriptionQuery);
  if (snapshot.empty) {
    throw new Error("Subscription not found");
  }

  await deleteDoc(snapshot.docs[0].ref);
}

async function list(): Promise<NewsletterSubscription[]> {
  const subscriptionsRef = collection(
    db,
    NEWSLETTER_SUBSCRIPTIONS_COLLECTION
  ) as SubscriptionCollection;

  const activeQuery = query(subscriptionsRef, orderBy("subscribedAt", "desc"));
  return await getQueryDocs(activeQuery, subscriptionSchema);
}

export const newsletterSubscription = createBuilder({
  subscribe,
  unsubscribe,
  list,
});

import type {
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import type z from "zod";

import type {
  createSubscriptionSchema,
  subscriptionDataSchema,
  subscriptionSchema,
} from "./schema";
import type { User } from "../user/types";

export type NewsletterSubscription = z.infer<typeof subscriptionSchema>;
export type SubscriptionData = z.infer<typeof subscriptionDataSchema>;
export type CreateSubscriptionData = z.infer<typeof createSubscriptionSchema>;

export type SubscriptionCollection = CollectionReference<SubscriptionData>;
export type SubscriptionDocument = DocumentReference<SubscriptionData>;

export interface CreateSubscriptionVariables {
  data: CreateSubscriptionData;
  user: User;
}

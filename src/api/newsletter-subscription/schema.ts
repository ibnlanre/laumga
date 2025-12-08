import { z } from "zod";

import { fieldValueCodec, timestampCodec } from "@/schema/date";

const preferencesSchema = z.object({
  events: z.boolean().default(true),
  news: z.boolean().default(true),
  bulletins: z.boolean().default(true),
});

const subscriptionBaseSchema = z.object({
  email: z.email("Valid email is required"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  subscribedAt: timestampCodec,
  preferences: preferencesSchema.default({
    events: true,
    news: true,
    bulletins: true,
  }),
});

export const subscriptionDataSchema = subscriptionBaseSchema;

export const createSubscriptionSchema = subscriptionBaseSchema.extend({
  subscribedAt: fieldValueCodec,
});

export const subscriptionSchema = subscriptionDataSchema.extend({
  id: z.string(),
});

export const NEWSLETTER_SUBSCRIPTIONS_COLLECTION = "newsletterSubscriptions";

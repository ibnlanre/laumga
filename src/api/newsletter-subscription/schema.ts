import { z } from "zod";

import { fieldValueCodec, timestampCodec } from "@/schema/date";

const preferencesSchema = z.object({
  events: z.boolean().default(true),
  news: z.boolean().default(true),
  bulletins: z.boolean().default(true),
});

export const subscriptionFormSchema = z.object({
  email: z
    .email("Valid email is required"),
  fullName: z.string().optional(),
  preferences: preferencesSchema
    .default({
      events: true,
      news: true,
      bulletins: true,
    })
    .optional(),
});

export const subscriptionDataSchema = subscriptionFormSchema.extend({
  subscribedAt: timestampCodec,
});

export const createSubscriptionSchema = subscriptionFormSchema.extend({
  subscribedAt: fieldValueCodec,
});

export const subscriptionSchema = subscriptionDataSchema.extend({
  id: z.string(),
});

export const NEWSLETTER_SUBSCRIPTIONS_COLLECTION = "newsletterSubscriptions";

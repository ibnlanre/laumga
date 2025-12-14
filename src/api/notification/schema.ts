import { z } from "zod";

import { fieldValueCodec, timestampCodec } from "@/schema/date";

export const notificationStatusSchema = z.enum(["new", "reviewed", "resolved"]);

export const notificationFormSchema = z.object({
  fullName: z.string().min(3, "Kindly provide your full name"),
  email: z.string().email("Valid email address is required"),
  subject: z
    .string()
    .min(3, "Add a short subject so we can route your message"),
  message: z.string().min(24, "Please include a bit more detail"),
  newsletterOptIn: z.boolean().default(false),
});

export const notificationDataSchema = notificationFormSchema.extend({
  status: notificationStatusSchema.default("new"),
  category: z.string().default("contact"),
  createdAt: timestampCodec,
});

export const createNotificationSchema = notificationFormSchema.extend({
  status: notificationStatusSchema.default("new"),
  category: z.string().default("contact"),
  createdAt: fieldValueCodec,
});

export const notificationSchema = notificationDataSchema.extend({
  id: z.string(),
});

export const NOTIFICATIONS_COLLECTION = "notifications";

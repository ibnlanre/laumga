import type {
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import type z from "zod";

import type { Variables } from "@/client/types";

import type {
  createNotificationSchema,
  notificationDataSchema,
  notificationFormSchema,
  notificationSchema,
  notificationStatusSchema,
} from "./schema";

export type Notification = z.infer<typeof notificationSchema>;
export type NotificationData = z.infer<typeof notificationDataSchema>;
export type NotificationForm = z.infer<typeof notificationFormSchema>;
export type NotificationStatus = z.infer<typeof notificationStatusSchema>;
export type CreateNotificationData = z.infer<typeof createNotificationSchema>;

export type UpstreamNotificationCollection =
  CollectionReference<CreateNotificationData>;
export type UpstreamNotificationDocument =
  DocumentReference<CreateNotificationData>;
export type DownstreamNotificationCollection =
  CollectionReference<NotificationData>;
export type DownstreamNotificationDocument =
  DocumentReference<NotificationData>;

export type ListNotificationVariables = Variables<NotificationData>;

export interface CreateNotificationVariables {
  data: NotificationForm;
}

export interface UpdateNotificationStatusVariables {
  id: string;
  status: NotificationStatus;
}

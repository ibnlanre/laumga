import type {
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import type z from "zod";

import type {
  createMediaSchema,
  mediaDataSchema,
  mediaSchema,
  updateMediaSchema,
} from "./schema";
import type { Variables } from "@/client/core-query";
import type { User } from "../user/types";

export type Media = z.infer<typeof mediaSchema>;
export type MediaData = z.infer<typeof mediaDataSchema>;
export type CreateMediaData = z.infer<typeof createMediaSchema>;
export type UpdateMediaData = z.infer<typeof updateMediaSchema>;

export type UpstreamMediaCollection = CollectionReference<CreateMediaData>;
export type UpstreamMediaDocument = DocumentReference<CreateMediaData>;
export type DownstreamMediaCollection = CollectionReference<MediaData>;
export type DownstreamMediaDocument = DocumentReference<MediaData>;

export type ListMediaVariables = Variables<MediaData>;

export interface CreateMediaVariables {
  data: CreateMediaData;
  user: User;
}

export interface UpdateMediaVariables {
  id: string;
  data: UpdateMediaData;
  user: User;
}

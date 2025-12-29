import type {
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import type z from "zod";

import type {
  feedSchema,
  feedDataSchema,
  createFeedSchema,
  updateFeedSchema,
} from "./schema";
import type { Variables } from "@/client/types";

export type Feed = z.infer<typeof feedSchema>;
export type FeedData = z.infer<typeof feedDataSchema>;
export type CreateFeedData = z.infer<typeof createFeedSchema>;
export type UpdateFeedData = z.infer<typeof updateFeedSchema>;
export type FeedType = z.infer<typeof feedSchema.shape.type>;

export type UpstreamFeedCollection = CollectionReference<CreateFeedData>;
export type UpstreamFeedDocument = DocumentReference<CreateFeedData>;
export type DownstreamFeedCollection = CollectionReference<FeedData>;
export type DownstreamFeedDocument = DocumentReference<FeedData>;

export type ListFeedVariables = Variables<FeedData>;

export interface CreateFeedVariables {
  data: CreateFeedData;
}

export interface UpdateFeedVariables {
  id: string;
  data: UpdateFeedData;
}

import type {
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import type z from "zod";
import type {
  chapterSchema,
  createChapterSchema,
  updateChapterSchema,
  chapterDataSchema,
} from "./schema";
import type { Variables } from "@/client/types";
import type { User } from "../user/types";

export type Chapter = z.infer<typeof chapterSchema>;
export type ChapterData = z.infer<typeof chapterDataSchema>;
export type CreateChapterData = z.infer<typeof createChapterSchema>;
export type UpdateChapterData = z.infer<typeof updateChapterSchema>;
export type ChapterRegion = z.infer<typeof chapterSchema.shape.region>;

export type UpstreamChapterCollection = CollectionReference<CreateChapterData>;
export type UpstreamChapterDocument = DocumentReference<CreateChapterData>;

export type DownstreamChapterCollection = CollectionReference<ChapterData>;
export type DownstreamChapterDocument = DocumentReference<ChapterData>;

export type ListChapterVariables = Variables<ChapterData>;

export interface CreateChapterVariables {
  data: CreateChapterData;
  user: User;
}

export interface UpdateChapterVariables {
  id: string;
  data: UpdateChapterData;
  user: User;
}

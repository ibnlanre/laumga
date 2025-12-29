import type {
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import type z from "zod";
import type {
  authorSchema,
  createAuthorSchema,
  updateAuthorSchema,
  authorSocialLinkSchema,
  authorDataSchema,
} from "./schema";
import type { User } from "../user/types";
import type { Variables } from "@/client/types";

export type AuthorSocialLink = z.infer<typeof authorSocialLinkSchema>;
export type CreateAuthorData = z.infer<typeof createAuthorSchema>;
export type UpdateAuthorData = z.infer<typeof updateAuthorSchema>;
export type Author = z.infer<typeof authorSchema>;
export type AuthorData = z.infer<typeof authorDataSchema>;
export type AuthorStatus = z.infer<typeof authorSchema.shape.status>;

export type UpstreamAuthorCollection = CollectionReference<CreateAuthorData>;
export type UpstreamAuthorDocument = DocumentReference<CreateAuthorData>;

export type DownstreamAuthorCollection = CollectionReference<AuthorData>;
export type DownstreamAuthorDocument = DocumentReference<AuthorData>;

export type ListAuthorVariables = Variables<AuthorData>;

export interface CreateAuthorVariables {
  user: User;
  data: CreateAuthorData;
}

export interface UpdateAuthorVariables {
  user: User;
  data: UpdateAuthorData;
  id: string;
}

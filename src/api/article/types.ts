import type {
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import type z from "zod";
import type {
  createArticleSchema,
  articleSchema,
  articleDataSchema,
  updateArticleSchema,
} from "./schema";
import type { User } from "../user/types";
import type { Variables } from "@/client/core-query";

export type CreateArticleData = z.infer<typeof createArticleSchema>;
export type ArticleCategory = z.infer<typeof articleSchema.shape.category>;
export type UpdateArticleData = z.infer<typeof updateArticleSchema>;
export type ArticleData = z.infer<typeof articleDataSchema>;
export type Article = z.infer<typeof articleSchema>;

export type UpstreamArticleCollection = CollectionReference<CreateArticleData>;
export type UpstreamArticleDocument = DocumentReference<CreateArticleData>;

export type DownstreamArticleCollection = CollectionReference<ArticleData>;
export type DownstreamArticleDocument = DocumentReference<ArticleData>;

export type ListArticleVariables = Variables<ArticleData>;

export type ArticleStatus = z.infer<typeof articleSchema.shape.status>;

export interface CreateArticleVariables {
  user: User;
  data: CreateArticleData;
}

export interface UpdateArticleVariables {
  user: User;
  data: UpdateArticleData;
  id: string;
}

export interface PublishArticleVariables {
  user: User;
  id: string;
}

export interface ArchiveArticleVariables {
  user: User;
  id: string;
}
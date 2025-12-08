import type {
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import type z from "zod";

import type {
  createIssueSchema,
  issueDataSchema,
  issueSchema,
  updateIssueSchema,
} from "./schema";
import type { Variables } from "@/client/core-query";
import type { User } from "../user/types";

export type NewsletterIssue = z.infer<typeof issueSchema>;
export type IssueData = z.infer<typeof issueDataSchema>;
export type CreateIssueData = z.infer<typeof createIssueSchema>;
export type UpdateIssueData = z.infer<typeof updateIssueSchema>;

export type UpstreamIssueCollection = CollectionReference<CreateIssueData>;
export type UpstreamIssueDocument = DocumentReference<CreateIssueData>;
export type DownstreamIssueCollection = CollectionReference<IssueData>;
export type DownstreamIssueDocument = DocumentReference<IssueData>;

export type ListIssueVariables = Variables<IssueData>;

export interface CreateIssueVariables {
  data: CreateIssueData;
  user: User;
}

export interface UpdateIssueVariables {
  id: string;
  data: UpdateIssueData;
  user: User;
}

export interface PublishIssueVariables {
  id: string;
  data: UpdateIssueData;
  user: User;
}

export interface DownloadIssueVariables {
  id: string;
}

export interface ArchiveIssueVariables {
  id: string;
  user: User;
}
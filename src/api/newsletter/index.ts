import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";
import { createBuilder } from "@ibnlanre/builder";

import { db } from "@/services/firebase";
import { buildQuery, getQueryDoc, getQueryDocs } from "@/client/core-query";
import { record } from "@/utils/record";
import {
  NEWSLETTER_ISSUES_COLLECTION,
  createIssueSchema,
  issueSchema,
} from "./schema";
import type {
  CreateIssueData,
  CreateIssueVariables,
  DownstreamIssueCollection,
  DownstreamIssueDocument,
  ListIssueVariables,
  UpdateIssueData,
  UpdateIssueVariables,
  UpstreamIssueCollection,
  UpstreamIssueDocument,
} from "./types";

async function create(variables: CreateIssueVariables) {
  const { data, user } = variables;
  const validated = createIssueSchema.parse(data);

  const issuesRef = collection(
    db,
    NEWSLETTER_ISSUES_COLLECTION
  ) as UpstreamIssueCollection;

  const issueData: CreateIssueData = {
    ...validated,
    created: record(user),
    updated: record(user),
  };

  if (validated.status === "published") {
    issueData.published = record(user);
  }

  await addDoc(issuesRef, issueData);
}

async function update(variables: UpdateIssueVariables) {
  const { id, data, user } = variables;
  const validated = createIssueSchema.parse(data);

  const issueRef = doc(
    db,
    NEWSLETTER_ISSUES_COLLECTION,
    id
  ) as UpstreamIssueDocument;

  const updatedData: UpdateIssueData = {
    ...validated,
    updated: record(user),
  };

  if (validated.status === "published" && !validated.published) {
    updatedData.published = record(user);
  }

  if (validated.status === "archived" && !validated.archived) {
    updatedData.archived = record(user);
  }

  await updateDoc(issueRef, updatedData);
}

async function list(variables?: ListIssueVariables) {
  const issuesRef = collection(
    db,
    NEWSLETTER_ISSUES_COLLECTION
  ) as DownstreamIssueCollection;

  const issuesQuery = buildQuery(issuesRef, variables);
  return await getQueryDocs(issuesQuery, issueSchema);
}

async function get(id: string) {
  const issueRef = doc(
    db,
    NEWSLETTER_ISSUES_COLLECTION,
    id
  ) as DownstreamIssueDocument;

  return await getQueryDoc(issueRef, issueSchema);
}

async function remove(id: string) {
  const issueRef = doc(
    db,
    NEWSLETTER_ISSUES_COLLECTION,
    id
  ) as UpstreamIssueDocument;

  await deleteDoc(issueRef);
}

async function download(id: string) {
  const issueRef = doc(
    db,
    NEWSLETTER_ISSUES_COLLECTION,
    id
  ) as UpstreamIssueDocument;

  await updateDoc(issueRef, {
    downloadCount: increment(1),
  });

  return await getQueryDoc(issueRef, issueSchema);
}

async function publish(variables: UpdateIssueVariables) {
  const { id, data, user } = variables;
  const validated = createIssueSchema.parse(data);

  const issueRef = doc(
    db,
    NEWSLETTER_ISSUES_COLLECTION,
    id
  ) as UpstreamIssueDocument;

  const updatedData: UpdateIssueData = {
    ...validated,
    status: "published",
    published: record(user),
    updated: record(user),
  };

  await updateDoc(issueRef, updatedData);
}

async function archive(variables: UpdateIssueVariables) {
  const { id, data, user } = variables;
  const validated = createIssueSchema.parse(data);

  const issueRef = doc(
    db,
    NEWSLETTER_ISSUES_COLLECTION,
    id
  ) as UpstreamIssueDocument;

  const updatedData: UpdateIssueData = {
    ...validated,
    status: "archived",
    archived: record(user),
    updated: record(user),
  };

  await updateDoc(issueRef, updatedData);
}

export const newsletter = createBuilder({
  create,
  list,
  get,
  update,
  remove,
  download,
  publish,
  archive,
});

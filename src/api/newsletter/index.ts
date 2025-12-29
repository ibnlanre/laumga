import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createBuilder } from "@ibnlanre/builder";
import { FieldValue } from "firebase-admin/firestore";

import {
  buildServerQuery,
  getServerQueryDoc,
  getServerQueryDocs,
  serverCollection,
} from "@/client/core-query/server";
import { serverRecord } from "@/utils/server-record";
import {
  NEWSLETTER_ISSUES_COLLECTION,
  createIssueSchema,
  issueSchema,
} from "./schema";
import type { CreateIssueData, IssueData, UpdateIssueData } from "./types";
import { userSchema } from "../user/schema";
import { createVariablesSchema } from "@/client/schema";

const create = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      data: createIssueSchema,
      user: userSchema,
    })
  )
  .handler(async ({ data }) => {
    const { data: issueData, user } = data;
    const validated = createIssueSchema.parse(issueData);

    const issuesRef = serverCollection<CreateIssueData>(
      NEWSLETTER_ISSUES_COLLECTION
    );

    const newIssueData: CreateIssueData = {
      ...validated,
      created: serverRecord(user),
    };

    if (validated.status === "published") {
      newIssueData.published = serverRecord(user);
    }

    await issuesRef.add(newIssueData);
  });

const update = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      data: createIssueSchema,
      user: userSchema,
    })
  )
  .handler(async ({ data }) => {
    const { id, data: issueData, user } = data;
    const validated = createIssueSchema.parse(issueData);

    const issueRef = serverCollection<UpdateIssueData>(
      NEWSLETTER_ISSUES_COLLECTION
    ).doc(id);

    const updatedData: UpdateIssueData = {
      ...validated,
      updated: serverRecord(user),
    };

    if (validated.status === "published" && !validated.published) {
      updatedData.published = serverRecord(user);
    }

    if (validated.status === "archived" && !validated.archived) {
      updatedData.archived = serverRecord(user);
    }

    await issueRef.update(updatedData);
  });

const list = createServerFn({ method: "GET" })
  .inputValidator(createVariablesSchema(issueSchema))
  .handler(async ({ data: variables }) => {
    const issuesRef = serverCollection<IssueData>(NEWSLETTER_ISSUES_COLLECTION);
    const issuesQuery = buildServerQuery(issuesRef, variables);
    return await getServerQueryDocs(issuesQuery, issueSchema);
  });

const get = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const issueRef = serverCollection<IssueData>(
      NEWSLETTER_ISSUES_COLLECTION
    ).doc(id);
    return await getServerQueryDoc(issueRef, issueSchema);
  });

const remove = createServerFn({ method: "POST" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const issueRef = serverCollection<IssueData>(
      NEWSLETTER_ISSUES_COLLECTION
    ).doc(id);
    await issueRef.delete();
  });

const download = createServerFn({ method: "POST" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const issueRef = serverCollection<IssueData>(
      NEWSLETTER_ISSUES_COLLECTION
    ).doc(id);

    await issueRef.update({
      downloadCount: FieldValue.increment(1),
    });

    return await getServerQueryDoc(issueRef, issueSchema);
  });

const publish = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      data: createIssueSchema,
      user: userSchema,
    })
  )
  .handler(async ({ data }) => {
    const { id, data: issueData, user } = data;
    const validated = createIssueSchema.parse(issueData);

    const issueRef = serverCollection<UpdateIssueData>(
      NEWSLETTER_ISSUES_COLLECTION
    ).doc(id);

    const updatedData: UpdateIssueData = {
      ...validated,
      status: "published",
      published: serverRecord(user),
      updated: serverRecord(user),
    };

    await issueRef.update(updatedData);
  });

const archive = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      data: createIssueSchema,
      user: userSchema,
    })
  )
  .handler(async ({ data }) => {
    const { id, data: issueData, user } = data;
    const validated = createIssueSchema.parse(issueData);

    const issueRef = serverCollection<UpdateIssueData>(
      NEWSLETTER_ISSUES_COLLECTION
    ).doc(id);

    const updatedData: UpdateIssueData = {
      ...validated,
      status: "archived",
      archived: serverRecord(user),
      updated: serverRecord(user),
    };

    await issueRef.update(updatedData);
  });

export const newsletter = createBuilder(
  {
    create,
    list,
    get,
    update,
    remove,
    download,
    publish,
    archive,
  },
  { prefix: [NEWSLETTER_ISSUES_COLLECTION] }
);

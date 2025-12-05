import { z } from "zod";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  orderBy,
  where,
  increment,
  serverTimestamp,
  CollectionReference,
  DocumentReference,
  type WithFieldValue,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { buildQuery, getQueryDoc, getQueryDocs, type Variables } from "@/client/core-query";

/**
 * Newsletter Subscription Schema
 */
export const newsletterSubscriptionSchema = z.object({
  id: z.string(),
  email: z.email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  subscribedAt: z.instanceof(Timestamp),
  isActive: z.boolean().default(true),
  preferences: z
    .object({
      events: z.boolean().default(true),
      news: z.boolean().default(true),
      bulletins: z.boolean().default(true),
    })
    .optional(),
});

export const createSubscriptionSchema = newsletterSubscriptionSchema.omit({
  id: true,
  subscribedAt: true,
  isActive: true,
});

export type NewsletterSubscription = z.infer<
  typeof newsletterSubscriptionSchema
>;
export type CreateSubscriptionData = z.infer<typeof createSubscriptionSchema>;

export type SubscriptionData = Omit<NewsletterSubscription, "id">;
export type SubscriptionCollection =
  CollectionReference<SubscriptionData>;
export type SubscriptionDocumentReference = DocumentReference<SubscriptionData>;

/**
 * Newsletter Issue Schema
 */
export const newsletterIssueSchema = z.object({
  id: z.string(),
  volume: z.number(),
  issueNumber: z.number(),
  title: z.string(),
  pdfUrl: z.url(),
  coverImageUrl: z.url(),
  leadStoryTitle: z.string(),
  highlights: z.array(z.string()),
  publishedAt: z.instanceof(Timestamp),
  downloadCount: z.number().default(0),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
});

export const createIssueSchema = newsletterIssueSchema.omit({
  id: true,
  downloadCount: true,
  createdAt: true,
  updatedAt: true,
});

export type NewsletterIssue = z.infer<typeof newsletterIssueSchema>;
export type CreateIssueData = z.infer<typeof createIssueSchema>;

export type IssueData = Omit<NewsletterIssue, "id">;
export type IssueCollection = CollectionReference<IssueData>;
export type IssueDocumentReference = DocumentReference<IssueData>;

const SUBSCRIPTIONS_COLLECTION = "newsletterSubscriptions";
const ISSUES_COLLECTION = "newsletterIssues";

/**
 * Subscribe to newsletter
 */
async function subscribe(
  data: CreateSubscriptionData
) {
  const validated = createSubscriptionSchema.parse(data);

  // Check if email already exists
  const subscriptionsRef = collection(
    db,
    SUBSCRIPTIONS_COLLECTION
  ) as SubscriptionCollection;

  const existingQuery = query(
    subscriptionsRef,
    where("email", "==", validated.email)
  );
  const existingSnapshot = await getDocs(existingQuery);

  if (!existingSnapshot.empty) {
    const existing = existingSnapshot.docs[0];
    const existingData = existing.data();

    // If already active, throw error
    if (existingData.isActive) {
      throw new Error("Email is already subscribed");
    }

    // Reactivate subscription
    await updateDoc(existing.ref, {
      isActive: true,
      subscribedAt: serverTimestamp(),
    });

    // Fetch updated doc to get resolved timestamp
    const updatedDoc = await getDoc(existing.ref);
    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    } as NewsletterSubscription;
  }

  const docRef = await addDoc(subscriptionsRef, {
    ...validated,
    subscribedAt: serverTimestamp(),
    isActive: true,
  });

  return await getQueryDoc(docRef);
}

/**
 * Unsubscribe from newsletter
 */
async function unsubscribe(email: string): Promise<void> {
  const subscriptionsRef = collection(
    db,
    SUBSCRIPTIONS_COLLECTION
  ) as SubscriptionCollection;

  const subscriptionQuery = query(
    subscriptionsRef,
    where("email", "==", email),
    where("isActive", "==", true)
  );
  const snapshot = await getDocs(subscriptionQuery);

  if (snapshot.empty) {
    throw new Error("Subscription not found");
  }

  const subscriptionDoc = snapshot.docs[0];
  await updateDoc(subscriptionDoc.ref, {
    isActive: false,
  });
}

/**
 * Fetch all active subscriptions
 */
async function fetchSubscriptions(): Promise<NewsletterSubscription[]> {
  const subscriptionsRef = collection(
    db,
    SUBSCRIPTIONS_COLLECTION
  ) as SubscriptionCollection;

  const subscriptionsQuery = query(
    subscriptionsRef,
    where("isActive", "==", true),
    orderBy("subscribedAt", "desc")
  );
  const snapshot = await getDocs(subscriptionsQuery);

  const subscriptions = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return newsletterSubscriptionSchema.array().parse(subscriptions);
}

/**
 * Create newsletter issue
 */
async function createIssue(data: CreateIssueData): Promise<NewsletterIssue> {
  const validated = createIssueSchema.parse(data);

  const issueData = {
    ...validated,
    downloadCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } satisfies WithFieldValue<IssueData> as unknown as IssueData;

  const issuesRef = collection(db, ISSUES_COLLECTION) as IssueCollection;
  const docRef = await addDoc(issuesRef, issueData);

  // Fetch to get resolved timestamps
  const newDoc = await getDoc(docRef);
  return {
    id: newDoc.id,
    ...newDoc.data(),
  } as NewsletterIssue;
}

/**
 * Fetch all newsletter issues
 */
async function fetchIssues(
  variables?: Variables<IssueData>
): Promise<NewsletterIssue[]> {
  const issuesRef = collection(db, ISSUES_COLLECTION) as IssueCollection;

  const q = buildQuery(issuesRef, variables);
  const docs = await getQueryDocs(q);

  return newsletterIssueSchema.array().parse(docs);
}

/**
 * Fetch newsletter issue by ID
 */
async function fetchIssueById(id: string): Promise<NewsletterIssue | null> {
  const issueRef = doc(db, ISSUES_COLLECTION, id) as IssueDocumentReference;
  const issueDoc = await getDoc(issueRef);

  if (!issueDoc.exists()) {
    return null;
  }

  const issue = {
    id: issueDoc.id,
    ...issueDoc.data(),
  };

  return newsletterIssueSchema.parse(issue);
}

/**
 * Increment download count
 */
async function incrementDownloadCount(id: string): Promise<void> {
  const issueRef = doc(db, ISSUES_COLLECTION, id) as IssueDocumentReference;
  await updateDoc(issueRef, {
    downloadCount: increment(1),
  });
}

export const newsletter = {
  subscribe,
  unsubscribe,
  fetchSubscriptions,
  createIssue,
  fetchIssues,
  fetchIssueById,
  incrementDownloadCount,
};

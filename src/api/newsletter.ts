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
} from "firebase/firestore";
import { db } from "@/services/firebase";

/**
 * Newsletter Subscription Schema
 */
export const newsletterSubscriptionSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  subscribedAt: z.number(),
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

/**
 * Newsletter Issue Schema
 */
export const newsletterIssueSchema = z.object({
  id: z.string(),
  volume: z.number(),
  issueNumber: z.number(),
  title: z.string(),
  pdfUrl: z.string().url(),
  coverImageUrl: z.string().url(),
  leadStoryTitle: z.string(),
  highlights: z.array(z.string()),
  publishedAt: z.number(),
  downloadCount: z.number().default(0),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const createIssueSchema = newsletterIssueSchema.omit({
  id: true,
  downloadCount: true,
  createdAt: true,
  updatedAt: true,
});

export type NewsletterIssue = z.infer<typeof newsletterIssueSchema>;
export type CreateIssueData = z.infer<typeof createIssueSchema>;

const SUBSCRIPTIONS_COLLECTION = "newsletterSubscriptions";
const ISSUES_COLLECTION = "newsletterIssues";

/**
 * Subscribe to newsletter
 */
async function subscribe(
  data: CreateSubscriptionData
): Promise<NewsletterSubscription> {
  const validated = createSubscriptionSchema.parse(data);

  // Check if email already exists
  const subscriptionsRef = collection(db, SUBSCRIPTIONS_COLLECTION);
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
      subscribedAt: Date.now(),
    });

    return {
      id: existing.id,
      ...existingData,
      isActive: true,
      subscribedAt: Date.now(),
    } as NewsletterSubscription;
  }

  // Create new subscription
  const subscriptionData = {
    ...validated,
    subscribedAt: Date.now(),
    isActive: true,
  };

  const docRef = await addDoc(subscriptionsRef, subscriptionData);

  return {
    id: docRef.id,
    ...subscriptionData,
  };
}

/**
 * Unsubscribe from newsletter
 */
async function unsubscribe(email: string): Promise<void> {
  const subscriptionsRef = collection(db, SUBSCRIPTIONS_COLLECTION);
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
  const subscriptionsRef = collection(db, SUBSCRIPTIONS_COLLECTION);
  const subscriptionsQuery = query(
    subscriptionsRef,
    where("isActive", "==", true),
    orderBy("subscribedAt", "desc")
  );
  const snapshot = await getDocs(subscriptionsQuery);

  const subscriptions = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as NewsletterSubscription[];

  return newsletterSubscriptionSchema.array().parse(subscriptions);
}

/**
 * Create newsletter issue
 */
async function createIssue(data: CreateIssueData): Promise<NewsletterIssue> {
  const validated = createIssueSchema.parse(data);
  const now = Date.now();

  const issueData = {
    ...validated,
    downloadCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(collection(db, ISSUES_COLLECTION), issueData);

  return {
    id: docRef.id,
    ...issueData,
  };
}

/**
 * Fetch all newsletter issues
 */
async function fetchIssues(): Promise<NewsletterIssue[]> {
  const issuesRef = collection(db, ISSUES_COLLECTION);
  const issuesQuery = query(
    issuesRef,
    orderBy("volume", "desc"),
    orderBy("issueNumber", "desc")
  );
  const snapshot = await getDocs(issuesQuery);

  const issues = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as NewsletterIssue[];

  return newsletterIssueSchema.array().parse(issues);
}

/**
 * Fetch newsletter issue by ID
 */
async function fetchIssueById(id: string): Promise<NewsletterIssue | null> {
  const issueRef = doc(db, ISSUES_COLLECTION, id);
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
  const issueRef = doc(db, ISSUES_COLLECTION, id);
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

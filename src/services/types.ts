import { CollectionReference } from "firebase/firestore";

export type WithId<T> = T & { id: string };
export type Prettify<T> = { [K in keyof T]: T[K] } & {};
export type Dictionary = Record<string, any>;

export type Nullable<T> = { [K in keyof T]: null | T[K] };
export type NullableExcept<T, K extends keyof T> = Prettify<
  Nullable<Omit<T, K>> & Pick<T, K>
>;

// Audit trail for every document
export type LogEntry = NullableExcept<
  {
    at: string; // ISO String
    by: string; // User ID
    name: string; // User Name (snapshot)
    photoUrl: string; // User Photo (snapshot)
  },
  "at" | "by"
>;

export type ApprovalStatus = "pending" | "approved" | "rejected" | "suspended";
export type Gender = "male" | "female"; // Mapped to Brother/Sister in UI
export type MandateFrequency =
  | "monthly"
  | "quarterly"
  | "annually"
  | "one-time";
export type MandateTier = "supporter" | "builder" | "guardian" | "custom";
export type ExcoTier = "presidential" | "council" | "directorate";

export type UserProfile = NullableExcept<
  {
    // Identity
    email: string;
    firstName: string;
    lastName: string;
    middleName: string;
    maidenName: string; // Optional
    gender: Gender;
    dateOfBirth: string;
    nationality: string;
    phoneNumber: string;

    // Membership Data
    membershipId: string; // Generated (e.g., LAU/19/001)
    passportUrl: string; // The uploaded ID photo
    stateOfOrigin: string;
    stateOfResidence: string;
    chapterId: string; // Linked to Chapters collection

    // System
    status: ApprovalStatus;
    isAdmin: boolean;
    fcmToken: string; // For push notifications

    // Meta
    created: LogEntry;
    modified: LogEntry;
  },
  "email" | "firstName" | "lastName" | "gender" | "status"
>;

export type UserCollection = CollectionReference<UserProfile>;
export type UserData = WithId<UserProfile>;

export interface CreateUserVariables {
  data: UserProfile;
  userId: string; // Auth UID
}

export interface UpdateUserVariables {
  userId: string;
  updates: Partial<UserProfile>; // Flexible updates for profile edits
}

// The Commitment
export type Mandate = NullableExcept<
  {
    userId: string;
    userName: string; // Snapshot for easier display
    amount: number;
    currency: string; // Default 'NGN'
    frequency: MandateFrequency;
    tier: MandateTier;

    // Payment Logic
    paymentMethodId: string; // Paystack/Stripe authorization code
    nextChargeDate: string;
    isActive: boolean;

    created: LogEntry;
    modified: LogEntry;
  },
  "userId" | "amount" | "frequency" | "isActive"
>;

// The History
export type MandateTransaction = NullableExcept<
  {
    mandateId: string;
    userId: string;
    amount: number;
    reference: string; // Payment gateway ref
    status: "success" | "failed";
    paidAt: string;
  },
  "mandateId" | "amount" | "status" | "paidAt"
>;

export type MandateCollection = CollectionReference<Mandate>;
export type MandateData = WithId<Mandate>;

export interface CreateMandateVariables {
  data: Mandate;
  userId: string;
}

export type Chapter = NullableExcept<
  {
    name: string; // e.g., "Lagos State Chapter"
    state: string;
    region: string; // e.g., "South West"
    presidentId: string; // Link to current leader
    meetingVenue: string;
    contactEmail: string;
    created: LogEntry;
  },
  "name" | "state"
>;

export type Executive = NullableExcept<
  {
    userId: string; // Link to UserProfile
    displayName: string; // e.g. "Prof. Taofiq Adedosu"
    photoUrl: string;

    // Role Details
    role: string; // e.g., "General Secretary"
    tier: ExcoTier; // Used for visual hierarchy (Card size)
    tenureYear: string; // e.g., "2019" (The Time Capsule Key)
    portfolio: string; // Optional description
    quote: string; // For the Presidential card

    created: LogEntry;
  },
  "userId" | "role" | "tenureYear" | "tier"
>;

export type ExecutiveCollection = CollectionReference<Executive>;
export type ExecutiveData = WithId<Executive>;

export type ArticleCategory = "news" | "health" | "islamic" | "campus";

export type Article = NullableExcept<
  {
    title: string;
    slug: string; // For pretty URLs
    excerpt: string;
    content: string; // HTML/Rich Text
    coverImageUrl: string;
    authorName: string;
    category: ArticleCategory;

    tags: string[];
    isPublished: boolean;
    publishedAt: string;

    created: LogEntry;
    modified: LogEntry;
  },
  "title" | "content" | "isPublished"
>;

export type EventType = "convention" | "humanitarian" | "webinar" | "meeting";

export type Event = NullableExcept<
  {
    title: string;
    description: string;
    posterUrl: string; // The "Ticket" visual

    // Timing
    startDate: string;
    endDate: string;

    // Logistics
    locationName: string; // e.g. "MKO Lecture Theatre"
    locationAddress: string; // For Maps
    meetingLink: string; // If virtual

    type: EventType;
    registrationLink: string; // External or internal

    created: LogEntry;
    modified: LogEntry;
  },
  "title" | "startDate" | "type"
>;

export type ArticleCollection = CollectionReference<Article>;
export type EventCollection = CollectionReference<Event>;

export type Gallery = NullableExcept<
  {
    title: string; // e.g., "2019 Convention"
    year: string; // For the Year Filter
    category: string; // For the Tag Filter
    coverImageUrl: string;
    description: string; // For the "Story Break" section

    isFeatured: boolean; // Shows on Home Page
    created: LogEntry;
  },
  "title" | "year"
>;

export type GalleryMedia = NullableExcept<
  {
    collectionId: string;
    url: string;
    caption: string;
    uploadedBy: string; // For User Generated Content tracking

    created: LogEntry;
  },
  "collectionId" | "url"
>;

export type GalleryCollection = CollectionReference<Gallery>;

export type NewsletterIssue = NullableExcept<
  {
    volume: number; // e.g. 5
    issueNumber: number; // e.g. 2
    title: string; // e.g. "Rebuilding Society"

    pdfUrl: string;
    coverImageUrl: string; // For the 3D Cover effect

    leadStoryTitle: string; // Displayed on the grid card
    highlights: string[]; // Bullet points for the Hero section

    publishedAt: string;
    downloadCount: number;

    created: LogEntry;
  },
  "title" | "pdfUrl" | "volume" | "issueNumber"
>;

export type NewsletterCollection = CollectionReference<NewsletterIssue>;

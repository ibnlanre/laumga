import { z } from "zod";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  increment,
  CollectionReference,
  serverTimestamp,
  DocumentReference,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import {
  buildQuery,
  getQueryDoc,
  getQueryDocs,
  type Variables,
} from "@/client/core-query";

/**
 * Event Schema
 */
export const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  excerpt: z.string().optional(),
  date: z.instanceof(Timestamp), // timestamp
  endDate: z.instanceof(Timestamp).optional(), // timestamp
  time: z.string().optional(), // e.g., "2:00 PM - 4:00 PM"
  location: z.string(),
  type: z.enum(["convention", "seminar", "iftar", "sports", "dawah", "other"]),
  category: z.string().optional(), // e.g., "Community", "Educational"
  status: z.enum(["draft", "published", "cancelled"]).default("draft"),
  imageUrl: z.url(),
  registrationLink: z.url().optional(),
  maxAttendees: z.number().optional(),
  currentAttendees: z.number().default(0),
  organizer: z.string(),
  isPublic: z.boolean().default(true),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
});

export const createEventSchema = eventSchema.omit({
  id: true,
  currentAttendees: true,
  createdAt: true,
  updatedAt: true,
});

export const updateEventSchema = createEventSchema.partial();

export type Event = z.infer<typeof eventSchema>;
export type EventType = Event["type"];
export type CreateEventData = z.infer<typeof createEventSchema>;
export type UpdateEventData = z.infer<typeof updateEventSchema>;

export type EventData = Omit<Event, "id">;
export type EventCollection = CollectionReference<EventData>;
export type EventDocumentReference = DocumentReference<EventData>;

/**
 * Event Registration Schema
 */
export const eventRegistrationSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  userId: z.string(),
  userName: z.string(),
  userEmail: z.email(),
  registeredAt: z.instanceof(Timestamp),
  attended: z.boolean().default(false),
});

export type EventRegistration = z.infer<typeof eventRegistrationSchema>;

export type EventRegistrationData = Omit<EventRegistration, "id">;
export type EventRegistrationCollection =
  CollectionReference<EventRegistrationData>;
export type EventRegistrationDocumentReference =
  DocumentReference<EventRegistrationData>;

const EVENTS_COLLECTION = "events";
const REGISTRATIONS_COLLECTION = "eventRegistrations";

/**
 * Fetch all events
 */
async function fetchAll(variables?: Variables<EventData>) {
  const eventsRef = collection(db, EVENTS_COLLECTION) as EventCollection;
  const q = buildQuery(eventsRef, variables);
  return await getQueryDocs(q);
}

/**
 * Fetch event by ID
 */
async function fetchById(id: string): Promise<Event | null> {
  const eventRef = doc(db, EVENTS_COLLECTION, id) as EventDocumentReference;
  const eventDoc = await getDoc(eventRef);

  if (!eventDoc.exists()) {
    return null;
  }

  const event = { id: eventDoc.id, ...eventDoc.data() };
  return eventSchema.parse(event);
}

/**
 * Create a new event
 */
async function create(data: CreateEventData) {
  const validated = createEventSchema.parse(data);

  const eventsRef = collection(db, EVENTS_COLLECTION) as EventCollection;
  const docRef = await addDoc(eventsRef, {
    ...validated,
    currentAttendees: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return await getQueryDoc(docRef);
}

/**
 * Update an event
 */
async function update(id: string, data: UpdateEventData) {
  const validated = updateEventSchema.parse(data);
  const eventRef = doc(db, EVENTS_COLLECTION, id);

  const updateData = {
    ...validated,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(eventRef, updateData);

  const updated = await fetchById(id);
  if (!updated) {
    throw new Error("Event not found after update");
  }

  return updated;
}

/**
 * Delete an event
 */
async function deleteEvent(id: string): Promise<void> {
  const eventRef = doc(db, EVENTS_COLLECTION, id) as EventDocumentReference;
  await updateDoc(eventRef, { status: "cancelled" });
}

/**
 * Register for an event
 */
async function register(params: {
  eventId: string;
  userId: string;
  userData: { name: string; email: string };
}) {
  const { eventId, userId, userData } = params;

  // Check if already registered
  const registrationsRef = collection(
    db,
    REGISTRATIONS_COLLECTION
  ) as EventRegistrationCollection;
  const existingQuery = query(
    registrationsRef,
    where("eventId", "==", eventId),
    where("userId", "==", userId)
  );
  const existingSnapshot = await getDocs(existingQuery);

  if (!existingSnapshot.empty) {
    throw new Error("Already registered for this event");
  }

  // Check event capacity
  const event = await fetchById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  if (event.maxAttendees && event.currentAttendees >= event.maxAttendees) {
    throw new Error("Event is full");
  }

  const docRef = await addDoc(registrationsRef, {
    eventId,
    userId,
    userName: userData.name,
    userEmail: userData.email,
    registeredAt: serverTimestamp(),
    attended: false,
  });

  // Update attendee count
  const eventRef = doc(
    db,
    EVENTS_COLLECTION,
    eventId
  ) as EventDocumentReference;
  await updateDoc(eventRef, {
    currentAttendees: increment(1),
  });

  return await getQueryDoc(docRef);
}

/**
 * Fetch user's registered events
 */
async function fetchUserEvents(userId: string) {
  // Get user's registrations
  const registrationsRef = collection(
    db,
    REGISTRATIONS_COLLECTION
  ) as EventRegistrationCollection;
  const registrationsQuery = query(
    registrationsRef,
    where("userId", "==", userId)
  );
  const registrationsSnapshot = await getDocs(registrationsQuery);

  const eventIds = registrationsSnapshot.docs.map((doc) => doc.data().eventId);

  if (eventIds.length === 0) {
    return [];
  }

  // Fetch events (Firestore has a limit of 10 for 'in' queries, so we batch)
  const events: Event[] = [];
  for (let i = 0; i < eventIds.length; i += 10) {
    const batch = eventIds.slice(i, i + 10);

    const eventsRef = collection(db, EVENTS_COLLECTION) as EventCollection;
    const eventsQuery = query(eventsRef, where("__name__", "in", batch));
    const eventsSnapshot = await getDocs(eventsQuery);

    eventsSnapshot.docs.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
      });
    });
  }

  return eventSchema.array().parse(events);
}

/**
 * Check if user is registered for an event
 */
async function isUserRegistered(
  eventId: string,
  userId: string
): Promise<boolean> {
  const registrationsRef = collection(
    db,
    REGISTRATIONS_COLLECTION
  ) as EventRegistrationCollection;
  const registrationsQuery = query(
    registrationsRef,
    where("eventId", "==", eventId),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(registrationsQuery);

  return !snapshot.empty;
}

export const event = {
  fetchAll,
  fetchById,
  create,
  update,
  delete: deleteEvent,
  register,
  fetchUserEvents,
  isUserRegistered,
};

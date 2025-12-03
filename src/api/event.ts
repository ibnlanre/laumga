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
  orderBy,
  increment,
} from "firebase/firestore";
import { db } from "@/services/firebase";

/**
 * Event Schema
 */
export const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  excerpt: z.string().optional(),
  date: z.number(), // timestamp
  endDate: z.number().optional(), // timestamp
  time: z.string().optional(), // e.g., "2:00 PM - 4:00 PM"
  location: z.string(),
  type: z.enum(["convention", "seminar", "iftar", "sports", "dawah", "other"]),
  category: z.string().optional(), // e.g., "Community", "Educational"
  status: z.enum(["draft", "published", "cancelled"]).default("draft"),
  imageUrl: z.string().url(),
  registrationLink: z.string().url().optional(),
  maxAttendees: z.number().optional(),
  currentAttendees: z.number().default(0),
  organizer: z.string(),
  isPublic: z.boolean().default(true),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const createEventSchema = eventSchema.omit({
  id: true,
  currentAttendees: true,
  createdAt: true,
  updatedAt: true,
});

export const updateEventSchema = createEventSchema.partial();

export type Event = z.infer<typeof eventSchema>;
export type CreateEventData = z.infer<typeof createEventSchema>;
export type UpdateEventData = z.infer<typeof updateEventSchema>;

/**
 * Event Registration Schema
 */
export const eventRegistrationSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  userId: z.string(),
  userName: z.string(),
  userEmail: z.string().email(),
  registeredAt: z.number(),
  attended: z.boolean().default(false),
});

export type EventRegistration = z.infer<typeof eventRegistrationSchema>;

const EVENTS_COLLECTION = "events";
const REGISTRATIONS_COLLECTION = "eventRegistrations";

/**
 * Fetch all events
 */
async function fetchAll(filters?: {
  type?: Event["type"];
  upcoming?: boolean;
}): Promise<Event[]> {
  const eventsRef = collection(db, EVENTS_COLLECTION);
  let eventsQuery = query(eventsRef, orderBy("date", "desc"));

  // Filter by type
  if (filters?.type) {
    eventsQuery = query(eventsQuery, where("type", "==", filters.type));
  }

  // Filter upcoming events
  if (filters?.upcoming) {
    const now = Date.now();
    eventsQuery = query(eventsQuery, where("date", ">=", now));
  }

  const snapshot = await getDocs(eventsQuery);
  const events = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Event[];

  return eventSchema.array().parse(events);
}

/**
 * Fetch event by ID
 */
async function fetchById(id: string): Promise<Event | null> {
  const eventRef = doc(db, EVENTS_COLLECTION, id);
  const eventDoc = await getDoc(eventRef);

  if (!eventDoc.exists()) {
    return null;
  }

  const event = {
    id: eventDoc.id,
    ...eventDoc.data(),
  };

  return eventSchema.parse(event);
}

/**
 * Create a new event
 */
async function create(data: CreateEventData): Promise<Event> {
  const validated = createEventSchema.parse(data);
  const now = Date.now();

  const eventData = {
    ...validated,
    currentAttendees: 0,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(collection(db, EVENTS_COLLECTION), eventData);

  return {
    id: docRef.id,
    ...eventData,
  };
}

/**
 * Update an event
 */
async function update(id: string, data: UpdateEventData): Promise<Event> {
  const validated = updateEventSchema.parse(data);
  const eventRef = doc(db, EVENTS_COLLECTION, id);

  const updateData = {
    ...validated,
    updatedAt: Date.now(),
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
  const eventRef = doc(db, EVENTS_COLLECTION, id);
  await updateDoc(eventRef, { status: "cancelled" });
}

/**
 * Register for an event
 */
async function register(params: {
  eventId: string;
  userId: string;
  userData: { name: string; email: string };
}): Promise<EventRegistration> {
  const { eventId, userId, userData } = params;

  // Check if already registered
  const registrationsRef = collection(db, REGISTRATIONS_COLLECTION);
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

  // Create registration
  const registrationData = {
    eventId,
    userId,
    userName: userData.name,
    userEmail: userData.email,
    registeredAt: Date.now(),
    attended: false,
  };

  const docRef = await addDoc(registrationsRef, registrationData);

  // Update attendee count
  const eventRef = doc(db, EVENTS_COLLECTION, eventId);
  await updateDoc(eventRef, {
    currentAttendees: increment(1),
  });

  return {
    id: docRef.id,
    ...registrationData,
  };
}

/**
 * Fetch user's registered events
 */
async function fetchUserEvents(userId: string): Promise<Event[]> {
  // Get user's registrations
  const registrationsRef = collection(db, REGISTRATIONS_COLLECTION);
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
    const eventsQuery = query(
      collection(db, EVENTS_COLLECTION),
      where("__name__", "in", batch)
    );
    const eventsSnapshot = await getDocs(eventsQuery);

    eventsSnapshot.docs.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
      } as Event);
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
  const registrationsRef = collection(db, REGISTRATIONS_COLLECTION);
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

import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  Timestamp,
} from "firebase/firestore";
import { z } from "zod/v4";
import { db } from "@/services/firebase";
import { mono } from "./mono";

const logEntrySchema = z.object({
  at: z.instanceof(Timestamp),
  by: z.string().nullable(),
  name: z.string().nullable(),
  photoUrl: z.string().nullable(),
});

/**
 * Payment Partner - Sub-account for receiving payment splits
 * Used for both platform and client payment distribution
 */
export const paymentPartnerSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Partner name is required"),
  monoSubAccountId: z.string(),
  accountNumber: z.string(),
  bankName: z.string(),
  nipCode: z.string(),
  isActive: z.boolean(),
  isPlatform: z.boolean(), // True for platform, false for client
  created: logEntrySchema,
  modified: logEntrySchema.nullable(),
});

export type PaymentPartner = z.infer<typeof paymentPartnerSchema>;

export type PaymentPartnerData = Omit<PaymentPartner, "id">;
export type PaymentPartnerCollection = CollectionReference<PaymentPartnerData>;
export type PaymentPartnerDocumentReference =
  DocumentReference<PaymentPartnerData>;

/**
 * Create Payment Partner Schema
 */
export const createPaymentPartnerSchema = z.object({
  name: z.string().min(1, "Partner name is required"),
  accountNumber: z
    .string()
    .min(10, "Account number must be at least 10 digits"),
  nipCode: z.string().min(1, "NIP code is required"),
  isPlatform: z.boolean().default(false),
});

export type CreatePaymentPartnerInput = z.infer<
  typeof createPaymentPartnerSchema
>;

/**
 * Update Payment Partner Schema
 */
export const updatePaymentPartnerSchema = createPaymentPartnerSchema.partial();

export type UpdatePaymentPartnerInput = z.infer<
  typeof updatePaymentPartnerSchema
>;

export const paymentPartner = {
  /**
   * Create a payment partner with Mono sub-account
   */
  create: async (variables: CreatePaymentPartnerInput & { userId: string }) => {
    const { name, accountNumber, nipCode, isPlatform, userId } = variables;

    // Validate input
    const validated = createPaymentPartnerSchema.parse({
      name,
      accountNumber,
      nipCode,
      isPlatform,
    });

    // Create sub-account in Mono
    const subAccountResponse = await mono.subAccount.create(
      nipCode,
      accountNumber
    );

    // Create payment partner document
    const partnerRef = doc(
      collection(db, "paymentPartners")
    ) as PaymentPartnerDocumentReference;

    await setDoc(partnerRef, {
      name: validated.name,
      monoSubAccountId: subAccountResponse.data.id,
      accountNumber: validated.accountNumber,
      bankName: subAccountResponse.data.name,
      nipCode: validated.nipCode,
      isActive: true,
      isPlatform: validated.isPlatform,
      created: {
        at: serverTimestamp(),
        by: userId,
        name: null,
        photoUrl: null,
      },
      modified: null,
    });

    return {
      id: partnerRef.id,
      monoSubAccountId: subAccountResponse.data.id,
    };
  },

  /**
   * Update a payment partner
   */
  update: async (
    partnerId: string,
    updates: UpdatePaymentPartnerInput & { userId: string }
  ) => {
    const { userId, ...updateData } = updates;

    // Validate updates
    const validated = updatePaymentPartnerSchema.parse(updateData);

    const partnerRef = doc(
      db,
      "paymentPartners",
      partnerId
    ) as PaymentPartnerDocumentReference;

    await updateDoc(partnerRef, {
      ...validated,
      modified: {
        at: serverTimestamp(),
        by: userId,
        name: null,
        photoUrl: null,
      },
    });

    const partnerDoc = await getDoc(partnerRef);
    if (!partnerDoc.exists()) {
      throw new Error("Payment partner not found after update");
    }

    return { id: partnerDoc.id, ...partnerDoc.data() };
  },

  /**
   * Fetch all payment partners
   */
  fetchAll: async () => {
    const partnersRef = collection(
      db,
      "paymentPartners"
    ) as PaymentPartnerCollection;
    const querySnapshot = await getDocs(partnersRef);

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  /**
   * Fetch active client partner
   */
  getClient: async () => {
    const partnersRef = collection(
      db,
      "paymentPartners"
    ) as PaymentPartnerCollection;
    const q = query(
      partnersRef,
      where("isPlatform", "==", false),
      where("isActive", "==", true)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length > 0) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }

    return null;
  },

  /**
   * Fetch active platform partner
   */
  getPlatform: async () => {
    const partnersRef = collection(
      db,
      "paymentPartners"
    ) as PaymentPartnerCollection;
    const q = query(
      partnersRef,
      where("isPlatform", "==", true),
      where("isActive", "==", true)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length > 0) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }

    return null;
  },

  /**
   * Fetch a specific payment partner by ID
   */
  fetch: async (partnerId: string) => {
    const partnerRef = doc(
      db,
      "paymentPartners",
      partnerId
    ) as PaymentPartnerDocumentReference;
    const partnerDoc = await getDoc(partnerRef);

    if (!partnerDoc.exists()) {
      return null;
    }

    return { id: partnerDoc.id, ...partnerDoc.data() };
  },
};

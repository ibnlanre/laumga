import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  limit,
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

export const allocationTypeSchema = z.enum(["percentage", "fixed"]);
export const feeBearerSchema = z.enum(["business", "sub_accounts"]);
export type AllocationType = z.infer<typeof allocationTypeSchema>;
export type FeeBearer = z.infer<typeof feeBearerSchema>;

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
  allocationType: allocationTypeSchema,
  allocationValue: z.number().positive(),
  allocationMax: z.number().positive().nullable(),
  feeBearer: feeBearerSchema,
  isActive: z.boolean(),
  created: logEntrySchema,
  modified: logEntrySchema.nullable(),
});

export type PaymentPartner = z.infer<typeof paymentPartnerSchema>;

export type PaymentPartnerData = Omit<PaymentPartner, "id">;
export type PaymentPartnerCollection = CollectionReference<PaymentPartnerData>;
export type PaymentPartnerDocumentReference =
  DocumentReference<PaymentPartnerData>;

async function deactivateOtherPartners(
  activePartnerId: string,
  userId: string
) {
  const partnersRef = collection(
    db,
    "paymentPartners"
  ) as PaymentPartnerCollection;

  const snapshot = await getDocs(
    query(partnersRef, where("isActive", "==", true))
  );

  const updates = snapshot.docs.filter((doc) => doc.id !== activePartnerId);

  await Promise.all(
    updates.map((docSnapshot) =>
      updateDoc(docSnapshot.ref, {
        isActive: false,
        modified: {
          at: serverTimestamp(),
          by: userId,
          name: null,
          photoUrl: null,
        },
      })
    )
  );
}

/**
 * Create Payment Partner Schema
 */
export const createPaymentPartnerSchema = z
  .object({
    name: z.string().min(1, "Partner name is required"),
    accountNumber: z
      .string()
      .min(10, "Account number must be at least 10 digits"),
    nipCode: z.string().min(1, "NIP code is required"),
    allocationType: allocationTypeSchema,
    allocationValue: z.number().positive(),
    allocationMax: z.number().positive().nullable().optional(),
    feeBearer: feeBearerSchema.default("business"),
    isActive: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.allocationType === "percentage") {
      if (data.allocationValue <= 0 || data.allocationValue >= 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["allocationValue"],
          message: "Percentage allocation must be between 1 and 99",
        });
      }
    }
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
    const { userId, ...payload } = variables;

    // Validate input
    const validated = createPaymentPartnerSchema.parse(payload);

    // Create sub-account in Mono
    const subAccountResponse = await mono.subAccount.create(
      validated.nipCode,
      validated.accountNumber
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
      allocationType: validated.allocationType,
      allocationValue: validated.allocationValue,
      allocationMax: validated.allocationMax ?? null,
      feeBearer: validated.feeBearer,
      isActive: validated.isActive,
      created: {
        at: serverTimestamp(),
        by: userId,
        name: null,
        photoUrl: null,
      },
      modified: null,
    });

    if (validated.isActive) {
      await deactivateOtherPartners(partnerRef.id, userId);
    }

    return {
      id: partnerRef.id,
      monoSubAccountId: subAccountResponse.data.id,
    };
  },

  /**
   * Update a payment partner
   */
  update: async (
    variables: { partnerId: string; userId: string; updates: UpdatePaymentPartnerInput }
  ) => {
    const { partnerId,userId, updates } = variables;

    // Validate updates
    const validated = updatePaymentPartnerSchema.parse(updates);

    const partnerRef = doc(
      db,
      "paymentPartners",
      partnerId
    ) as PaymentPartnerDocumentReference;

    const partnerDoc = await getDoc(partnerRef);
    if (!partnerDoc.exists()) {
      throw new Error("Payment partner not found");
    }

    const existingData = partnerDoc.data();
    const mergedData = {
      ...existingData,
      ...validated,
      allocationMax:
        validated.allocationMax !== undefined
          ? (validated.allocationMax ?? null)
          : (existingData.allocationMax ?? null),
      isActive:
        validated.isActive !== undefined
          ? validated.isActive
          : existingData.isActive,
    };

    paymentPartnerSchema.parse({ id: partnerDoc.id, ...mergedData });

    const updatePayload: Record<string, unknown> = {
      ...validated,
      modified: {
        at: serverTimestamp(),
        by: userId,
        name: null,
        photoUrl: null,
      },
    };

    if (validated.allocationMax !== undefined) {
      updatePayload.allocationMax = validated.allocationMax ?? null;
    }

    await updateDoc(partnerRef, updatePayload);

    if (validated.isActive) {
      await deactivateOtherPartners(partnerId, userId);
    }

    const refreshedDoc = await getDoc(partnerRef);
    if (!refreshedDoc.exists()) {
      throw new Error("Payment partner not found after update");
    }

    return { id: refreshedDoc.id, ...refreshedDoc.data() };
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
   * Fetch currently active partner
   */
  getActive: async () => {
    const partnersRef = collection(
      db,
      "paymentPartners"
    ) as PaymentPartnerCollection;
    const q = query(partnersRef, where("isActive", "==", true), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const docSnapshot = snapshot.docs[0];
    return { id: docSnapshot.id, ...docSnapshot.data() };
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

import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDoc,
  serverTimestamp,
  setDoc,
  query,
  where,
  getDocs,
  updateDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import type { WithId } from "@/services/types";
import { db } from "@/services/firebase";
import { z } from "zod/v4";
import { user } from "./user";
import {
  mono,
  type MonoCustomerInput,
  type MonoSplitConfiguration,
} from "./mono";
import {
  paymentPartner,
  allocationTypeSchema,
  feeBearerSchema,
  type PaymentPartner,
} from "./payment-partner";
import { addMonths, addYears } from "date-fns";
import { formatDate } from "@/utils/date";

const logEntrySchema = z.object({
  at: z.instanceof(Timestamp),
  by: z.string().nullable(),
  name: z.string().nullable(),
  photoUrl: z.string().nullable(),
});

/**
 * Predefined contribution tiers
 */
export type MandateTier = "supporter" | "builder" | "guardian" | "custom";

/**
 * Mandate status types
 */
export type MandateStatus =
  | "initiated" // Mandate created, awaiting Mono approval
  | "active" // Approved and ready for debits
  | "paused" // Temporarily suspended
  | "cancelled" // Permanently cancelled
  | "completed"; // Mandate period ended

const legacyFeeSplitSchema = z.object({
  platformFee: z.number(),
  clientAmount: z.number(),
  totalAmount: z.number(),
});

const allocationFeeSplitSchema = z.object({
  partnerId: z.string(),
  partnerName: z.string(),
  allocationType: allocationTypeSchema,
  allocationValue: z.number(),
  allocationMax: z.number().nullable(),
  feeBearer: feeBearerSchema,
  allocatedAmount: z.number(),
  retainedAmount: z.number(),
  totalAmount: z.number(),
});

export type LegacyFeeSplit = z.infer<typeof legacyFeeSplitSchema>;
export type AllocationFeeSplit = z.infer<typeof allocationFeeSplitSchema>;

export const feeSplitSchema = z.union([
  legacyFeeSplitSchema,
  allocationFeeSplitSchema,
]);

export type FeeSplit = z.infer<typeof feeSplitSchema>;

/**
 * The Mandate - Recurring payment commitment
 */
export const mandateSchema = z.object({
  userId: z.string(),
  userName: z.string(), // Snapshot for easier display
  userEmail: z.string(),
  amount: z.number(), // Amount per payment in kobo
  currency: z.string(), // Default 'NGN'
  frequency: z.enum(["monthly", "quarterly", "annually", "one-time"]),
  duration: z.enum(["12-months", "24-months", "indefinite"]),
  tier: z.enum(["supporter", "builder", "guardian", "custom"]),
  status: z.enum(["initiated", "active", "paused", "cancelled", "completed"]),
  monoMandateId: z.string().nullable(), // Mono mandate ID
  monoCustomerId: z.string().nullable(), // Mono customer ID
  monoReference: z.string().nullable(), // Unique mandate reference
  monoUrl: z.string().nullable(), // Mono authorization URL
  accountNumber: z.string().nullable(), // Bank account number
  accountName: z.string().nullable(), // Account holder name
  bankName: z.string().nullable(), // Bank name
  approved: z.boolean(), // Mono approval status
  readyToDebit: z.boolean(), // Ready for automatic debits
  startDate: z.string(), // ISO date string
  endDate: z.string(), // ISO date string
  nextChargeDate: z.string(), // Next scheduled debit
  feeSplit: feeSplitSchema.nullable(), // Fee breakdown
  totalCollected: z.number().nullable(), // Total amount collected so far
  totalTransactions: z.number().nullable(), // Number of successful transactions
  created: logEntrySchema,
  modified: logEntrySchema.nullable(),
});

export type Mandate = z.infer<typeof mandateSchema>;

/**
 * Validation: Create Mandate Schema
 * Keep validation close to the domain types
 */
export const createMandateSchema = z.object({
  amount: z
    .number()
    .min(5_000, "Amount must be at least ₦5,000") // ₦50 minimum for mandate
    .max(1_000_000, "Amount cannot exceed ₦1,000,000"),
  frequency: z.enum(["monthly", "quarterly", "annually", "one-time"], {
    message: "Frequency is required",
  }),
  duration: z.enum(["12-months", "24-months", "indefinite"], {
    message: "Duration is required",
  }),
  accountNumber: z
    .string()
    .min(10, "Account number must be at least 10 digits"),
  bankCode: z.string().min(1, "Bank is required"),
  bvn: z.string().length(11, "BVN must be 11 digits"),
});

export type MandateFrequency = z.infer<
  typeof createMandateSchema.shape.frequency
>;
export type MandateDuration = z.infer<
  typeof createMandateSchema.shape.duration
>;
export type CreateMandateInput = z.infer<typeof createMandateSchema>;

const mandateCertificateSettingsSchema = z.object({
  chairmanName: z.string().min(1),
  chairmanTitle: z.string().min(1),
  signatureUrl: z.url().nullable(),
  updated: logEntrySchema.nullable(),
});

const mandateCertificateSettingsUpdateSchema = mandateCertificateSettingsSchema
  .omit({ updated: true })
  .partial();

export type MandateCertificateSettings = z.infer<
  typeof mandateCertificateSettingsSchema
>;

export interface UpdateMandateCertificateSettingsInput
  extends z.infer<typeof mandateCertificateSettingsUpdateSchema> {}

export interface MandateCertificatePayload {
  id: string;
  certificateNumber: string;
  userName: string;
  amount: number;
  frequency: MandateFrequency;
  tier: MandateTier;
  startDate: string;
  chairmanName: string;
  chairmanTitle: string;
  signatureUrl: string | null;
}

/**
 * Mandate Transaction - Payment history record
 */
export const mandateTransactionSchema = z.object({
  mandateId: z.string(),
  userId: z.string(),
  amount: z.number(),
  platformFee: z.number().optional(), // Legacy platform fee
  clientAmount: z.number().optional(), // Legacy client amount
  partnerId: z.string().optional(),
  partnerName: z.string().optional(),
  allocatedAmount: z.number().optional(),
  retainedAmount: z.number().optional(),
  monoReference: z.string(), // Mono payment reference
  monoDebitId: z.string(), // Mono debit transaction ID
  status: z.enum(["successful", "failed", "processing"]),
  splitSettled: z.boolean(), // Whether split settlement completed
  failureReason: z.string().nullable(), // Error message if failed
  paidAt: z.string(),
  created: logEntrySchema,
  splitSnapshot: feeSplitSchema.nullable().optional(),
});

export type MandateTransaction = z.infer<typeof mandateTransactionSchema>;

export type MandateCollection = CollectionReference<Mandate>;
export type MandateDocumentReference = DocumentReference<Mandate>;
export type MandateData = WithId<Mandate>;

export type TransactionCollection = CollectionReference<MandateTransaction>;
export type TransactionData = WithId<MandateTransaction>;

const defaultCertificateSettings: MandateCertificateSettings = {
  chairmanName: "A. B. Chairman",
  chairmanTitle: "Foundation Chairman",
  signatureUrl: null,
  updated: null,
};

const certificateSettingsRef = doc(
  db,
  "mandateCertificate",
  "settings"
) as DocumentReference<MandateCertificateSettings>;

async function ensureCertificateSettings(): Promise<MandateCertificateSettings> {
  const snapshot = await getDoc(certificateSettingsRef);

  if (!snapshot.exists()) {
    await setDoc(certificateSettingsRef, defaultCertificateSettings);
    return defaultCertificateSettings;
  }

  return mandateCertificateSettingsSchema.parse(snapshot.data());
}

async function getActiveMandateDocument(
  userId: string
): Promise<MandateData | null> {
  const mandatesRef = collection(db, "mandates") as MandateCollection;
  const q = query(
    mandatesRef,
    where("userId", "==", userId),
    where("status", "==", "active")
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docSnapshot = querySnapshot.docs[0];
    return {
      id: docSnapshot.id,
      ...mandateSchema.parse(docSnapshot.data()),
    };
  }

  return null;
}

/**
 * Variables for creating a mandate
 */
export interface CreateMandateVariables {
  userId: string;
  data: CreateMandateInput;
}

/**
 * Utility: Calculate mandate end date based on duration
 */
function calculateEndDate(startDate: Date, duration: string): Date {
  const endDate = new Date(startDate);

  switch (duration) {
    case "12-months":
      return addYears(endDate, 1);
    case "24-months":
      return addYears(endDate, 2);
    case "indefinite":
      return addYears(endDate, 10); // 10 years for indefinite
    default:
      return addYears(endDate, 1);
  }
}

/**
 * Utility: Calculate next charge date based on frequency
 */
function calculateNextChargeDate(
  startDate: Date,
  frequency: MandateFrequency
): Date {
  const next = new Date(startDate);

  switch (frequency) {
    case "monthly":
      return addMonths(next, 1);
    case "quarterly":
      return addMonths(next, 3);
    case "annually":
      return addYears(next, 1);
    case "one-time":
      return next;
    default:
      return next;
  }
}

/**
 * Utility: Determine mandate tier from amount
 */
function determineTier(amount: number): MandateTier {
  if (amount === 500000) return "supporter"; // ₦5,000
  if (amount === 1000000) return "builder"; // ₦10,000
  if (amount === 2500000) return "guardian"; // ₦25,000
  return "custom";
}

/**
 * Utility: Generate unique mandate reference
 */
function generateMandateReference(userId: string): string {
  return `LAUMGA-${userId.slice(0, 8)}-${Date.now()}`;
}

/**
 * Utility: Generate unique debit reference
 */
function generateDebitReference(mandateId: string): string {
  return `DEBIT-${mandateId.slice(0, 8)}-${Date.now()}`;
}

/**
 * Utility helpers for payment partner allocation
 */
function ensureActivePartner(
  partner: PaymentPartner | null
): asserts partner is PaymentPartner {
  if (!partner) {
    throw new Error("Active payment partner not configured");
  }
}

function computeAllocatedAmount(partner: PaymentPartner, totalAmount: number) {
  const baseAllocation =
    partner.allocationType === "percentage"
      ? Math.round((partner.allocationValue / 100) * totalAmount)
      : partner.allocationValue;

  const withCap =
    partner.allocationMax !== null
      ? Math.min(baseAllocation, partner.allocationMax)
      : baseAllocation;

  return Math.min(withCap, totalAmount);
}

function buildPartnerAllocation(
  partner: PaymentPartner,
  totalAmount: number
): {
  snapshot: AllocationFeeSplit;
  split: MonoSplitConfiguration;
} {
  const allocatedAmount = computeAllocatedAmount(partner, totalAmount);
  const retainedAmount = Math.max(totalAmount - allocatedAmount, 0);

  const snapshot: AllocationFeeSplit = {
    partnerId: partner.id,
    partnerName: partner.name,
    allocationType: partner.allocationType,
    allocationValue: partner.allocationValue,
    allocationMax: partner.allocationMax,
    feeBearer: partner.feeBearer,
    allocatedAmount,
    retainedAmount,
    totalAmount,
  };

  const subAccountValue =
    partner.allocationType === "percentage"
      ? partner.allocationValue
      : snapshot.allocatedAmount;

  const split: MonoSplitConfiguration = {
    type: partner.allocationType,
    fee_bearer: partner.feeBearer,
    sub_accounts: [
      {
        sub_account: partner.monoSubAccountId,
        value: subAccountValue,
        ...(partner.allocationMax ? { max: partner.allocationMax } : undefined),
      },
    ],
  };

  return { snapshot, split };
}

/**
 * Mandate API functions
 * Handles recurring payment commitments with Mono integration
 */
export const mandate = {
  /**
   * Create a new mandate with Mono integration
   */
  create: async (variables: CreateMandateVariables) => {
    const { data, userId } = variables;

    // Fetch user data
    const userData = await user.fetch(userId);
    if (!userData) throw new Error("User not found");

    const activePartner = await paymentPartner.getActive();
    ensureActivePartner(activePartner);

    // Generate reference and calculate dates
    const reference = generateMandateReference(userId);
    const startDate = new Date();
    const endDate = calculateEndDate(startDate, data.duration);
    const nextChargeDate = calculateNextChargeDate(startDate, data.frequency);

    // Determine tier and partner allocation snapshot
    const tier = determineTier(data.amount);
    const { split, snapshot } = buildPartnerAllocation(
      activePartner,
      data.amount
    );

    // Create Mono customer
    let monoCustomerId: string;
    try {
      const customerData: MonoCustomerInput = {
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        address: userData.address || "",
        phone: userData.phoneNumber || "",
        identity: {
          type: "bvn",
          number: data.bvn,
        },
      };

      const customerResponse = await mono.customer.create(customerData);
      monoCustomerId = customerResponse.data.id;
    } catch (error: any) {
      throw new Error(`Failed to create Mono customer: ${error.message}`);
    }

    // Initiate Mono mandate with sub-account IDs
    const mandateResponse = await mono.mandate.initiate({
      amount: data.amount,
      type: "recurring-debit",
      method: "mandate",
      mandate_type: "emandate",
      debit_type: data.frequency === "one-time" ? "variable" : "variable",
      description: `LAUMGA ${data.frequency} contribution - ${userData.firstName} ${userData.lastName}`,
      reference,
      customer: { id: monoCustomerId },
      redirect_url: `${window.location.origin}/mandate/dashboard`,
      start_date: formatDate(startDate, "yyyy-MM-dd"),
      end_date: formatDate(endDate, "yyyy-MM-dd"),
      split,
      meta: {
        userId,
        tier,
        partnerId: snapshot.partnerId,
        allocationType: snapshot.allocationType,
        allocationValue: snapshot.allocationValue,
        allocationMax: snapshot.allocationMax,
        feeBearer: snapshot.feeBearer,
      },
    });

    // Create mandate document
    const mandateRef = doc(
      collection(db, "mandates")
    ) as MandateDocumentReference;

    await setDoc(mandateRef, {
      userId,
      userName: `${userData.firstName} ${userData.lastName}`,
      userEmail: userData.email,
      amount: data.amount,
      currency: "NGN",
      frequency: data.frequency,
      duration: data.duration,
      tier,
      status: "initiated",
      monoMandateId: mandateResponse.data.mandate_id,
      monoCustomerId,
      monoReference: reference,
      monoUrl: mandateResponse.data.mono_url,
      accountNumber: data.accountNumber,
      accountName: null,
      bankName: null,
      approved: false,
      readyToDebit: false,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      nextChargeDate: nextChargeDate.toISOString(),
      feeSplit: snapshot,
      totalCollected: 0,
      totalTransactions: 0,
      created: {
        at: serverTimestamp(),
        by: userId,
        name: `${userData.firstName} ${userData.lastName}`,
        photoUrl: userData.profilePictureUrl,
      },
      modified: null,
    });

    const newMandate = await getDoc(mandateRef);
    return {
      id: mandateRef.id,
      ...mandateSchema.parse(newMandate.data()),
      monoUrl: mandateResponse.data.mono_url,
      mandateId: mandateResponse.data.mandate_id,
    };
  },

  /**
   * Sync mandate status from Mono
   */
  syncStatus: async (mandateId: string) => {
    const mandateRef = doc(
      db,
      "mandates",
      mandateId
    ) as MandateDocumentReference;
    const mandateDoc = await getDoc(mandateRef);

    if (!mandateDoc.exists()) {
      throw new Error("Mandate not found");
    }

    const mandateData = mandateSchema.parse(mandateDoc.data());
    if (!mandateData.monoMandateId) {
      throw new Error("Mono mandate ID not found");
    }

    // Fetch mandate details from Mono
    const monoDetails = await mono.mandate.fetch(mandateData.monoMandateId);

    // Update mandate with latest status
    await updateDoc(mandateRef, {
      status:
        monoDetails.data.status === "approved"
          ? "active"
          : monoDetails.data.status === "rejected"
            ? "cancelled"
            : "initiated",
      approved: monoDetails.data.approved,
      readyToDebit: monoDetails.data.ready_to_debit,
      accountName: monoDetails.data.account_name,
      bankName: monoDetails.data.institution.name,
      modified: {
        at: serverTimestamp(),
        by: mandateData.userId,
        name: null,
        photoUrl: null,
      },
    });

    return {
      id: mandateDoc.id,
      ...mandateData,
      status: monoDetails.data.status,
    };
  },

  /**
   * Process a debit for a mandate
   */
  debit: async (variables: { mandateId: string; userId: string }) => {
    const { mandateId, userId } = variables;

    const mandateRef = doc(
      db,
      "mandates",
      mandateId
    ) as MandateDocumentReference;
    const mandateDoc = await getDoc(mandateRef);

    if (!mandateDoc.exists()) {
      throw new Error("Mandate not found");
    }

    const mandateData = mandateSchema.parse(mandateDoc.data());

    if (mandateData.status !== "active") {
      throw new Error("Mandate is not active");
    }

    if (!mandateData.readyToDebit) {
      throw new Error("Mandate is not ready for debiting");
    }

    const activePartner = await paymentPartner.getActive();
    ensureActivePartner(activePartner);

    const { split, snapshot } = buildPartnerAllocation(
      activePartner,
      mandateData.amount
    );

    // Generate debit reference
    const debitReference = generateDebitReference(mandateId);

    // Process debit with Mono
    const debitResponse = await mono.mandate.debit(mandateData.monoMandateId!, {
      amount: mandateData.amount,
      reference: debitReference,
      narration: `LAUMGA ${mandateData.frequency} contribution`,
      split,
    });

    // Create transaction record
    const transactionRef = collection(
      db,
      "transactions"
    ) as TransactionCollection;

    const transaction = {
      mandateId,
      userId: mandateData.userId,
      amount: mandateData.amount,
      partnerId: snapshot.partnerId,
      partnerName: snapshot.partnerName,
      allocatedAmount: snapshot.allocatedAmount,
      retainedAmount: snapshot.retainedAmount,
      monoReference: debitReference,
      monoDebitId: debitResponse.data.reference_number,
      status: debitResponse.data.status as
        | "successful"
        | "failed"
        | "processing",
      splitSettled: false,
      failureReason: null,
      paidAt: debitResponse.data.date,
      createdBy: mandateData.userId,
      createdAt: serverTimestamp(),
      created: {
        at: serverTimestamp(),
        by: mandateData.userId,
        name: null,
        photoUrl: null,
      },
      splitSnapshot: snapshot,
    };

    const transactionDoc = await addDoc(transactionRef, transaction);

    // Update mandate if successful
    if (debitResponse.data.status === "successful") {
      const newNextChargeDate = calculateNextChargeDate(
        new Date(),
        mandateData.frequency
      );

      await updateDoc(mandateRef, {
        totalCollected: (mandateData.totalCollected || 0) + mandateData.amount,
        totalTransactions: (mandateData.totalTransactions || 0) + 1,
        nextChargeDate: newNextChargeDate.toISOString(),
        modified: {
          at: serverTimestamp(),
          by: userId,
          name: null,
          photoUrl: null,
        },
      });
    }

    return {
      transactionId: transactionDoc.id,
      status: debitResponse.data.status,
      reference: debitReference,
    };
  },

  /**
   * Fetch a single mandate by ID
   */
  fetch: async (mandateId: string) => {
    const mandateRef = doc(
      db,
      "mandates",
      mandateId
    ) as MandateDocumentReference;
    const mandateDoc = await getDoc(mandateRef);

    if (mandateDoc.exists()) {
      return { id: mandateDoc.id, ...mandateDoc.data() };
    }

    return null;
  },

  /**
   * Fetch all mandates for a user
   */
  fetchByUserId: async (userId: string) => {
    const mandatesRef = collection(db, "mandates") as MandateCollection;
    const q = query(mandatesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  /**
   * Get the active mandate for a user
   */
  getActive: (userId: string) => getActiveMandateDocument(userId),

  /**
   * Pause an active mandate
   */
  pause: async (variables: { mandateId: string; userId: string }) => {
    const { mandateId, userId } = variables;

    const mandateRef = doc(
      db,
      "mandates",
      mandateId
    ) as MandateDocumentReference;
    const mandateDoc = await getDoc(mandateRef);

    if (!mandateDoc.exists()) {
      throw new Error("Mandate not found");
    }

    const mandateData = mandateDoc.data();

    // Pause mandate in Mono
    if (mandateData.monoMandateId) {
      await mono.mandate.pause(mandateData.monoMandateId);
    }

    await updateDoc(mandateRef, {
      status: "paused",
      modified: {
        at: serverTimestamp(),
        by: userId,
        name: null,
        photoUrl: null,
      },
    });

    return { success: true };
  },

  /**
   * Cancel a mandate
   */
  cancel: async (variables: { mandateId: string; userId: string }) => {
    const { mandateId, userId } = variables;

    const mandateRef = doc(
      db,
      "mandates",
      mandateId
    ) as MandateDocumentReference;
    const mandateDoc = await getDoc(mandateRef);

    if (!mandateDoc.exists()) {
      throw new Error("Mandate not found");
    }

    const mandateData = mandateDoc.data();

    // Cancel mandate in Mono
    if (mandateData.monoMandateId) {
      await mono.mandate.cancel(mandateData.monoMandateId);
    }

    await updateDoc(mandateRef, {
      status: "cancelled",
      modified: {
        at: serverTimestamp(),
        by: userId,
        name: null,
        photoUrl: null,
      },
    });

    return { success: true };
  },

  /**
   * Reinstate a paused mandate
   */
  reinstate: async (variables: { mandateId: string; userId: string }) => {
    const { mandateId, userId } = variables;

    const mandateRef = doc(
      db,
      "mandates",
      mandateId
    ) as MandateDocumentReference;
    const mandateDoc = await getDoc(mandateRef);

    if (!mandateDoc.exists()) {
      throw new Error("Mandate not found");
    }

    const mandateData = mandateDoc.data();

    // Reinstate mandate in Mono
    if (mandateData.monoMandateId) {
      await mono.mandate.reinstate(mandateData.monoMandateId);
    }

    await updateDoc(mandateRef, {
      status: "active",
      modified: {
        at: serverTimestamp(),
        by: userId,
        name: null,
        photoUrl: null,
      },
    });

    return { success: true };
  },

  /**
   * Fetch transactions for a mandate
   */
  fetchTransactions: async (mandateId: string) => {
    const transactionsRef = collection(
      db,
      "transactions"
    ) as TransactionCollection;
    const q = query(transactionsRef, where("mandateId", "==", mandateId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  /**
   * Fetch all transactions for a user
   */
  fetchUserTransactions: async (userId: string) => {
    const transactionsRef = collection(
      db,
      "transactions"
    ) as TransactionCollection;
    const q = query(transactionsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  fetchCertificate: async (
    userId: string
  ): Promise<MandateCertificatePayload | null> => {
    if (!userId) return null;

    const activeMandate = await getActiveMandateDocument(userId);
    if (!activeMandate) {
      return null;
    }

    const settings = await ensureCertificateSettings();

    return {
      id: activeMandate.id,
      certificateNumber: `MAND-${activeMandate.id.slice(0, 6).toUpperCase()}`,
      userName: activeMandate.userName,
      amount: activeMandate.amount,
      frequency: activeMandate.frequency,
      tier: activeMandate.tier,
      startDate: activeMandate.startDate,
      chairmanName: settings.chairmanName,
      chairmanTitle: settings.chairmanTitle,
      signatureUrl: settings.signatureUrl,
    };
  },

  fetchCertificateSettings: ensureCertificateSettings,

  updateCertificateSettings: async (variables: {
    userId: string;
    data: UpdateMandateCertificateSettingsInput;
  }) => {
    const { userId, data } = variables;
    const payload = mandateCertificateSettingsUpdateSchema.parse(data);

    if (Object.keys(payload).length === 0) {
      return ensureCertificateSettings();
    }

    await setDoc(
      certificateSettingsRef,
      {
        ...payload,
        updated: {
          at: serverTimestamp(),
          by: userId,
          name: null,
          photoUrl: null,
        },
      },
      { merge: true }
    );

    return ensureCertificateSettings();
  },
};

/**
 * Payment Partner API
 */

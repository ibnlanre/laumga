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
  limit,
} from "firebase/firestore";
import type { NullableExcept, LogEntry, WithId } from "@/services/types";
import { db } from "@/services/firebase";
import { z } from "zod/v4";
import { user } from "./user";
import { mono, type MonoCustomerInput } from "./mono";
import { addMonths, addYears, format } from "date-fns";

/**
 * Payment Partner - Entity receiving payment splits
 */
export type PaymentPartner = NullableExcept<
  {
    name: string; // Partner name
    monoSubAccountId: string; // Mono sub-account ID
    accountNumber: string; // Bank account number
    bankName: string; // Bank name
    nipCode: string; // NIP code for transfers
    isActive: boolean; // Active status
    isPlatform: boolean; // True for platform, false for client
    created: LogEntry;
    modified: LogEntry;
  },
  "name" | "monoSubAccountId" | "isActive"
>;

export type PaymentPartnerCollection = CollectionReference<PaymentPartner>;
export type PaymentPartnerData = WithId<PaymentPartner>;

/**
 * Mandate frequencies supported by the system
 */
export type MandateFrequency =
  | "monthly"
  | "quarterly"
  | "annually"
  | "one-time";

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

/**
 * Fee split configuration
 * Platform takes a fixed ₦50 fee, client receives the rest
 */
export type FeeSplit = {
  platformFee: number; // Fixed ₦50 in kobo (5000)
  clientAmount: number; // Remaining amount after platform fee
  totalAmount: number; // Total payment amount
};

/**
 * The Mandate - Recurring payment commitment
 */
export type Mandate = NullableExcept<
  {
    userId: string;
    userName: string; // Snapshot for easier display
    userEmail: string;
    amount: number; // Amount per payment in kobo
    currency: string; // Default 'NGN'
    frequency: MandateFrequency;
    duration: "12-months" | "24-months" | "indefinite";
    tier: MandateTier;
    status: MandateStatus;
    monoMandateId: string; // Mono mandate ID
    monoCustomerId: string; // Mono customer ID
    monoReference: string; // Unique mandate reference
    monoUrl: string; // Mono authorization URL
    accountNumber: string; // Bank account number
    accountName: string; // Account holder name
    bankName: string; // Bank name
    approved: boolean; // Mono approval status
    readyToDebit: boolean; // Ready for automatic debits
    startDate: string; // ISO date string
    endDate: string; // ISO date string
    nextChargeDate: string; // Next scheduled debit
    feeSplit: FeeSplit; // Fee breakdown
    totalCollected: number; // Total amount collected so far
    totalTransactions: number; // Number of successful transactions
    created: LogEntry;
    modified: LogEntry;
  },
  "userId" | "amount" | "frequency" | "status"
>;

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

export type CreateMandateInput = z.infer<typeof createMandateSchema>;

/**
 * Mandate Transaction - Payment history record
 */
export type MandateTransaction = NullableExcept<
  {
    mandateId: string;
    userId: string;
    amount: number;
    platformFee: number; // Platform's ₦50 fee
    clientAmount: number; // Amount to client
    monoReference: string; // Mono payment reference
    monoDebitId: string; // Mono debit transaction ID
    status: "successful" | "failed" | "processing";
    splitSettled: boolean; // Whether split settlement completed
    failureReason: string; // Error message if failed
    paidAt: string;
    created: LogEntry;
  },
  "mandateId" | "amount" | "status"
>;

export type MandateCollection = CollectionReference<Mandate>;
export type MandateDocumentReference = DocumentReference<Mandate>;
export type MandateData = WithId<Mandate>;

export type TransactionCollection = CollectionReference<MandateTransaction>;
export type TransactionData = WithId<MandateTransaction>;

/**
 * Variables for creating a mandate
 */
export interface CreateMandateVariables {
  userId: string;
  data: CreateMandateInput;
}

/**
 * Constants
 */
const PLATFORM_FEE = 50_00; // ₦50 in kobo

/**
 * Utility: Calculate fee split
 */
function calculateFeeSplit(amount: number): FeeSplit {
  return {
    platformFee: PLATFORM_FEE,
    clientAmount: amount - PLATFORM_FEE,
    totalAmount: amount,
  };
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
 * Fetch active payment partners using optimized Firebase queries
 * Returns both client and platform partners in a single operation
 */
async function fetchActivePartners(): Promise<{
  client: PaymentPartner | null;
  platform: PaymentPartner | null;
}> {
  const partnersRef = collection(
    db,
    "paymentPartners"
  ) as PaymentPartnerCollection;

  // Query for active client partner (not platform)
  const clientQuery = query(
    partnersRef,
    where("isPlatform", "==", false),
    where("isActive", "==", true),
    limit(1)
  );
  const clientSnapshot = await getDocs(clientQuery);
  const client = clientSnapshot.empty
    ? null
    : { id: clientSnapshot.docs[0].id, ...clientSnapshot.docs[0].data() };

  // Query for active platform partner
  const platformQuery = query(
    partnersRef,
    where("isPlatform", "==", true),
    where("isActive", "==", true),
    limit(1)
  );
  const platformSnapshot = await getDocs(platformQuery);
  const platform = platformSnapshot.empty
    ? null
    : { id: platformSnapshot.docs[0].id, ...platformSnapshot.docs[0].data() };

  return { client, platform };
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

    // Fetch payment partners using optimized queries
    const { client: clientPartner, platform: platformPartner } =
      await fetchActivePartners();

    if (!clientPartner || !platformPartner) {
      throw new Error("Payment partners not configured");
    }

    // Generate reference and calculate dates
    const reference = generateMandateReference(userId);
    const startDate = new Date();
    const endDate = calculateEndDate(startDate, data.duration);
    const nextChargeDate = calculateNextChargeDate(startDate, data.frequency);

    // Determine tier and fee split
    const tier = determineTier(data.amount);
    const feeSplit = calculateFeeSplit(data.amount);

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
    const mandateResponse = await mono.mandate.initiate(
      {
        amount: data.amount,
        type: "recurring-debit",
        method: "mandate",
        mandate_type: "emandate",
        debit_type: data.frequency === "one-time" ? "variable" : "variable",
        description: `LAUMGA ${data.frequency} contribution - ${userData.firstName} ${userData.lastName}`,
        reference,
        customer: { id: monoCustomerId },
        redirect_url: `${window.location.origin}/mandate/dashboard`,
        start_date: format(startDate, "yyyy-MM-dd"),
        end_date: format(endDate, "yyyy-MM-dd"),
        meta: {
          userId,
          tier,
          platformFee: feeSplit.platformFee.toString(),
        },
      },
      clientPartner.monoSubAccountId,
      platformPartner.monoSubAccountId
    );

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
      feeSplit,
      totalCollected: 0,
      totalTransactions: 0,
      created: {
        at: serverTimestamp(),
        by: userId,
        name: `${userData.firstName} ${userData.lastName}`,
        photoUrl: userData.passportUrl,
      },
      modified: null,
    });

    return {
      id: mandateRef.id,
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

    const mandateData = mandateDoc.data();
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
      ...mandateDoc.data(),
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

    const mandateData = mandateDoc.data();

    if (mandateData.status !== "active") {
      throw new Error("Mandate is not active");
    }

    if (!mandateData.readyToDebit) {
      throw new Error("Mandate is not ready for debiting");
    }

    // Fetch payment partners using optimized queries
    const { client: clientPartner, platform: platformPartner } =
      await fetchActivePartners();

    if (!clientPartner || !platformPartner) {
      throw new Error("Payment partners not configured");
    }

    // Generate debit reference
    const debitReference = generateDebitReference(mandateId);

    // Process debit with Mono
    const debitResponse = await mono.mandate.debit(
      mandateData.monoMandateId!,
      {
        amount: mandateData.amount,
        reference: debitReference,
        narration: `LAUMGA ${mandateData.frequency} contribution`,
      },
      clientPartner.monoSubAccountId,
      platformPartner.monoSubAccountId
    );

    // Create transaction record
    const transactionRef = collection(
      db,
      "transactions"
    ) as TransactionCollection;

    const transaction: Omit<MandateTransaction, "id"> = {
      mandateId,
      userId: mandateData.userId,
      amount: mandateData.amount,
      platformFee: mandateData.feeSplit?.platformFee ?? PLATFORM_FEE,
      clientAmount:
        mandateData.feeSplit?.clientAmount ?? mandateData.amount - PLATFORM_FEE,
      monoReference: debitReference,
      monoDebitId: debitResponse.data.reference_number,
      status: debitResponse.data.status as
        | "successful"
        | "failed"
        | "processing",
      splitSettled: false,
      failureReason: null,
      paidAt: debitResponse.data.date,
      created: {
        at: new Date().toISOString(),
        by: mandateData.userId,
        name: null,
        photoUrl: null,
      },
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
  getActive: async (userId: string) => {
    const mandatesRef = collection(db, "mandates") as MandateCollection;
    const q = query(
      mandatesRef,
      where("userId", "==", userId),
      where("status", "==", "active")
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length > 0) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }

    return null;
  },

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
};

/**
 * Payment Partner API
 */
export const paymentPartner = {
  /**
   * Create a payment partner with Mono sub-account
   */
  create: async (variables: {
    name: string;
    accountNumber: string;
    nipCode: string;
    isPlatform: boolean;
    userId: string;
  }) => {
    const { name, accountNumber, nipCode, isPlatform, userId } = variables;

    // Create sub-account in Mono
    const subAccountResponse = await mono.subAccount.create(
      nipCode,
      accountNumber
    );

    // Create payment partner document
    const partnerRef = doc(
      collection(db, "paymentPartners")
    ) as DocumentReference<PaymentPartner>;

    await setDoc(partnerRef, {
      name,
      monoSubAccountId: subAccountResponse.data.id,
      accountNumber,
      bankName: subAccountResponse.data.name,
      nipCode,
      isActive: true,
      isPlatform,
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
};

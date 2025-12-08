import { z } from "zod";

export const monoCustomerSchema = z.object({
  email: z.email(),
  type: z.enum(["individual", "business"]).optional(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  address: z.string().min(1).max(100),
  phone: z.string().min(1),
  identity: z.object({
    type: z.literal("bvn"),
    number: z.string().length(11),
  }),
});



export const monoSplitEntrySchema = z.object({
  sub_account: z.string(),
  value: z.number(),
  max: z.number().optional(),
});

export const monoSplitConfigurationSchema = z.object({
  type: z.enum(["percentage", "fixed"]),
  fee_bearer: z.enum(["business", "sub_accounts"]),
  sub_accounts: z.array(monoSplitEntrySchema).min(1),
});

export const monoMandateSchema = z.object({
  amount: z.number().min(20000), // Minimum ₦200 in kobo
  type: z.literal("recurring-debit"),
  method: z.literal("mandate"),
  mandate_type: z.enum(["emandate", "signed", "gsm"]),
  debit_type: z.enum(["variable", "fixed"]),
  description: z.string().min(1),
  reference: z.string().min(10),
  customer: z.object({
    id: z.string(),
  }),
  redirect_url: z.url().optional(),
  start_date: z.string(), // YYYY-MM-DD
  end_date: z.string(), // YYYY-MM-DD
  split: monoSplitConfigurationSchema.optional(),
  meta: z.record(z.string(), z.any()).optional(),
});

export const monoDebitSchema = z.object({
  amount: z.number().min(20000),
  reference: z.string().min(10),
  narration: z.string().min(1),
  split: monoSplitConfigurationSchema.optional(),
});

export const monoCustomerResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    name: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    identification_no: z.string(),
    identification_type: z.string(),
    bvn: z.string(),
  }),
});

export const monoMandateResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    mono_url: z.string(),
    mandate_id: z.string(),
    type: z.string(),
    method: z.string(),
    mandate_type: z.string(),
    amount: z.number(),
    description: z.string(),
    reference: z.string(),
    customer: z.string(),
    redirect_url: z.string().optional(),
    created_at: z.string(),
    updated_at: z.string(),
    start_date: z.string(),
    end_date: z.string(),
  }),
});


export const monoMandateDetailsResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    status: z.enum(["initiated", "approved", "rejected", "cancelled"]),
    reference: z.string(),
    amount: z.number(),
    balance: z.number(),
    mandate_type: z.string(),
    debit_type: z.string(),
    account_name: z.string(),
    account_number: z.string(),
    live_mode: z.boolean(),
    approved: z.boolean(),
    ready_to_debit: z.boolean(),
    nibss_code: z.string(),
    institution: z.object({
      bank_code: z.string(),
      nip_code: z.string(),
      name: z.string(),
    }),
    customer: z.string(),
    narration: z.string(),
    start_date: z.string(),
    end_date: z.string(),
    date: z.string(),
  }),
});

export const monoDebitResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  response_code: z.string(),
  data: z.object({
    success: z.boolean(),
    status: z.enum(["successful", "failed", "processing"]),
    event: z.string(),
    amount: z.number(),
    mandate: z.string(),
    reference_number: z.string(),
    date: z.string(),
    live_mode: z.boolean(),
    account_details: z.object({
      bank_code: z.string(),
      account_name: z.string(),
      account_number: z.string(),
      bank_name: z.string(),
    }),
    beneficiary: z.object({
      bank_code: z.string(),
      account_name: z.string(),
      account_number: z.string(),
      bank_name: z.string(),
    }),
    split: z
      .object({
        type: z.string(),
        fee_bearer: z.string(),
        sub_accounts: z.array(
          z.object({
            sub_account: z.string(),
            value: z.number(),
            max: z.number().optional(),
          })
        ),
      })
      .optional(),
  }),
});

export const monoSubAccountResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    name: z.string(),
    account_number: z.string(),
    nip_code: z.string(),
    bank_code: z.string(),
  }),
});

export const monoBankListResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    banks: z.array(
      z.object({
        name: z.string(),
        bank_code: z.string(),
        nip_code: z.string(),
        direct_debit: z.boolean(),
      })
    ),
  }),
});

export const monoPaymentVerifyResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    status: z.string(),
    amount: z.number(),
    reference: z.string(),
    split: z.any().optional(),
  }),
});

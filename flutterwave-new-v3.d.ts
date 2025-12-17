declare module "flutterwave-node-v3" {
  export interface FlutterwaveResponse<T> {
    status: string;
    message: string;
    data: T;
    meta?: {
      page_info?: {
        total: number;
        current_page: number;
        total_pages: number;
      };
    };
  }

  export interface CardChargeRequest {
    card_number: string;
    cvv: string;
    expiry_month: string;
    expiry_year: string;
    currency: string;
    amount: string;
    email: string;
    fullname?: string;
    tx_ref: string;
    redirect_url?: string;
    type?: string;
    authorization?: {
      mode: string;
      pin?: string;
      city?: string;
      address?: string;
      state?: string;
      country?: string;
      zipcode?: string;
    };
    payment_plan?: string;
  }

  export interface MobileMoneyChargeRequest {
    tx_ref: string;
    amount: string;
    currency: string;
    email: string;
    phone_number: string;
    fullname?: string;
    network?: string;
    redirect_url?: string;
    type?: string; // mobile_money_ghana, mobile_money_uganda, etc.
    voucher?: string; // for vodafone
  }

  export interface BankTransferChargeRequest {
    tx_ref: string;
    amount: string;
    email: string;
    phone_number?: string;
    currency: string;
    is_permanent?: boolean;
    expires?: number; // duration in seconds
  }

  export interface USSDChargeRequest {
    tx_ref: string;
    account_bank: string;
    amount: string;
    currency: string;
    email: string;
    phone_number: string;
    fullname?: string;
  }

  export interface ChargeResponseData {
    id: number;
    tx_ref: string;
    flw_ref: string;
    device_fingerprint: string;
    amount: number;
    currency: string;
    charged_amount: number;
    app_fee: number;
    merchant_fee: number;
    processor_response: string;
    auth_model: string;
    ip: string;
    narration: string;
    status: string;
    payment_type: string;
    created_at: string;
    account_id: number;
    customer: {
      id: number;
      name: string;
      phone_number: string;
      email: string;
      created_at: string;
    };
    card?: {
      first_6digits: string;
      last_4digits: string;
      issuer: string;
      country: string;
      type: string;
      token: string;
      expiry: string;
    };
    meta?: any;
    amount_settled?: number;
  }

  export interface ValidateChargeRequest {
    otp: string;
    flw_ref: string;
    type?: string; // account, card
  }

  export interface BillCategory {
    id: number;
    biller_code: string;
    name: string;
    default_commission: number;
    date_added: string;
    country: string;
    is_airtime: boolean;
    biller_name: string;
    item_code: string;
    short_name: string;
    fee: number;
    commission_on_fee: boolean;
    label_name: string;
    amount: number;
  }

  export interface CreateBillRequest {
    country: string;
    customer: string;
    amount: number;
    recurrence: string;
    type: string;
    reference: string;
    biller_name?: string;
  }

  export interface BillResponseData {
    phone_number: string;
    amount: number;
    network: string;
    flw_ref: string;
    tx_ref: string;
    reference?: string;
  }

  export interface Bank {
    id: number;
    code: string;
    name: string;
  }

  export interface ResolveAccountRequest {
    account_number: string;
    account_bank: string;
  }

  export interface ResolveAccountResponseData {
    account_number: string;
    account_name: string;
  }

  export interface Balance {
    currency: string;
    available_balance: number;
    ledger_balance: number;
  }

  export interface ResolveBVNResponseData {
    bvn: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    date_of_birth: string;
    phone_number: string;
    registration_date: string;
    enrollment_bank: string;
    enrollment_branch: string;
  }

  export interface Settlement {
    id: number;
    account_id: number;
    merchant_name: string;
    merchant_email: string;
    settlement_account: string;
    bank_code: string;
    transaction_date: string;
    due_date: string;
    processed_date: string | null;
    status: string;
    is_local: boolean;
    currency: string;
    gross_amount: number;
    app_fee: number;
    merchant_fee: number;
    chargeback: number;
    refund: number;
    net_amount: number;
    flag_message: string | null;
    meta: any;
    destination: string;
  }

  export interface CreateSubaccountRequest {
    account_bank: string;
    account_number: string;
    business_name: string;
    business_email?: string;
    business_contact?: string;
    business_contact_mobile?: string;
    business_mobile: string;
    country: string;
    meta?: any;
    split_type?: string;
    split_value?: number;
  }

  export interface Subaccount {
    id: number;
    account_number: string;
    account_bank: string;
    business_name: string;
    fullname: string;
    created_at: string;
    meta: any;
    bank_name: string;
    split_ratio?: number;
    split_type?: string;
    split_value?: number;
  }

  export interface TokenizedChargeRequest {
    token: string;
    currency: string;
    country: string;
    amount: number;
    email: string;
    first_name?: string;
    last_name?: string;
    ip?: string;
    narration?: string;
    tx_ref: string;
  }

  export interface TransactionVerifyResponseData {
    id: number;
    tx_ref: string;
    flw_ref: string;
    device_fingerprint: string;
    amount: number;
    currency: string;
    charged_amount: number;
    app_fee: number;
    merchant_fee: number;
    processor_response: string;
    auth_model: string;
    ip: string;
    narration: string;
    status: string;
    payment_type: string;
    created_at: string;
    account_id: number;
    card: {
      first_6digits: string;
      last_4digits: string;
      issuer: string;
      country: string;
      type: string;
      token: string;
      expiry: string;
    };
    meta: any;
    amount_settled: number;
    customer: {
      id: number;
      name: string;
      phone_number: string;
      email: string;
      created_at: string;
    };
  }

  export interface InitiateTransferRequest {
    account_bank: string;
    account_number: string;
    amount: number;
    narration: string;
    currency: string;
    reference: string;
    callback_url?: string;
    debit_currency?: string;
    beneficiary_name?: string;
  }

  export interface TransferResponseData {
    id: number;
    account_number: string;
    bank_code: string;
    full_name: string;
    created_at: string;
    currency: string;
    debit_currency: string;
    amount: number;
    fee: number;
    status: string;
    reference: string;
    meta: any;
    narration: string;
    complete_message: string;
    requires_approval: number;
    is_approved: number;
    bank_name: string;
  }

  export interface CreateVirtualAccountRequest {
    email: string;
    is_permanent: boolean;
    bvn?: string;
    tx_ref?: string;
    phonenumber?: string;
    firstname?: string;
    lastname?: string;
    narration?: string;
  }

  export interface VirtualAccount {
    response_code: string;
    response_message: string;
    flw_ref: string;
    order_ref: string;
    account_number: string;
    account_status: string;
    frequency: string;
    bank_name: string;
    created_at: string;
    expiry_date: string;
    note: string;
    amount: string | null;
  }

  export interface CreateVirtualCardRequest {
    currency: string;
    amount: number;
    billing_name: string;
    billing_address: string;
    billing_city: string;
    billing_state: string;
    billing_postal_code: string;
    billing_country: string;
    callback_url?: string;
  }

  export interface VirtualCard {
    id: string;
    account_id: number;
    amount: string;
    currency: string;
    card_hash: string;
    card_pan: string;
    masked_pan: string;
    city: string;
    state: string;
    address_1: string;
    address_2: string | null;
    zip_code: string;
    cvv: string;
    expiration: string;
    send_to: string | null;
    bin_check_name: string | null;
    card_type: string;
    name_on_card: string;
    created_at: string;
    is_active: boolean;
    callback_url: string | null;
  }

  export interface CreateBeneficiaryRequest {
    account_number: string;
    account_bank: string;
  }

  export interface Beneficiary {
    id: number;
    account_number: string;
    bank_code: string;
    full_name: string;
    created_at: string;
    bank_name: string;
  }

  export interface Subscription {
    id: number;
    amount: number;
    customer: {
      id: number;
      customer_email: string;
    };
    plan: number;
    status: string;
    created_at: string;
  }

  export interface CreatePaymentPlanRequest {
    amount: number;
    name: string;
    interval: string;
    duration: number;
  }

  export interface PaymentPlan {
    id: number;
    name: string;
    amount: number;
    interval: string;
    duration: number;
    status: string;
    currency: string;
    plan_token: string;
    created_at: string;
  }

  export default class Flutterwave {
    constructor(publicKey: string, secretKey: string);
    Charge: {
      card(
        data: CardChargeRequest
      ): Promise<FlutterwaveResponse<ChargeResponseData>>;
      mobileMoney(
        data: MobileMoneyChargeRequest
      ): Promise<FlutterwaveResponse<ChargeResponseData>>;
      bankTransfer(
        data: BankTransferChargeRequest
      ): Promise<FlutterwaveResponse<ChargeResponseData>>;
      ussd(
        data: USSDChargeRequest
      ): Promise<FlutterwaveResponse<ChargeResponseData>>;
      validate(
        data: ValidateChargeRequest
      ): Promise<FlutterwaveResponse<ChargeResponseData>>;
    };
    Bills: {
      create_bill(
        data: CreateBillRequest
      ): Promise<FlutterwaveResponse<BillResponseData>>;
      fetch_bills_Cat(): Promise<FlutterwaveResponse<BillCategory[]>>;
      validate(data: {
        item_code: string;
        code: string;
        customer: string;
      }): Promise<FlutterwaveResponse<any>>;
    };
    Bank: {
      country(data: { country: string }): Promise<FlutterwaveResponse<Bank[]>>;
    };
    Misc: {
      verify_Account(
        data: ResolveAccountRequest
      ): Promise<FlutterwaveResponse<ResolveAccountResponseData>>;
      bvn(data: {
        bvn: string;
      }): Promise<FlutterwaveResponse<ResolveBVNResponseData>>;
      bal_currency(data: {
        currency: string;
      }): Promise<FlutterwaveResponse<Balance>>;
    };
    Settlement: {
      fetch(data?: {
        page?: number;
        from?: string;
        to?: string;
      }): Promise<FlutterwaveResponse<Settlement[]>>;
    };
    Subaccount: {
      create(
        data: CreateSubaccountRequest
      ): Promise<FlutterwaveResponse<Subaccount>>;
      fetch(data?: {
        page?: number;
      }): Promise<FlutterwaveResponse<Subaccount[]>>;
      delete(data: { id: number }): Promise<FlutterwaveResponse<any>>;
    };
    Tokenized: {
      charge(
        data: TokenizedChargeRequest
      ): Promise<FlutterwaveResponse<ChargeResponseData>>;
    };
    Transaction: {
      verify(data: {
        id: string;
      }): Promise<FlutterwaveResponse<TransactionVerifyResponseData>>;
      refund(data: {
        id: string;
        amount?: string;
      }): Promise<FlutterwaveResponse<any>>;
    };
    Transfer: {
      initiate(
        data: InitiateTransferRequest
      ): Promise<FlutterwaveResponse<TransferResponseData>>;
      fetch(data?: {
        page?: number;
        status?: string;
      }): Promise<FlutterwaveResponse<TransferResponseData[]>>;
      get_a_transfer(data: {
        id: number;
      }): Promise<FlutterwaveResponse<TransferResponseData>>;
    };
    VirtualAccount: {
      create(
        data: CreateVirtualAccountRequest
      ): Promise<FlutterwaveResponse<VirtualAccount>>;
      fetch(data: {
        order_ref: string;
      }): Promise<FlutterwaveResponse<VirtualAccount>>;
    };
    VirtualCard: {
      create(
        data: CreateVirtualCardRequest
      ): Promise<FlutterwaveResponse<VirtualCard>>;
      fetch(data?: {
        page?: number;
      }): Promise<FlutterwaveResponse<VirtualCard[]>>;
      get(data: { id: string }): Promise<FlutterwaveResponse<VirtualCard>>;
      fund(data: {
        id: string;
        amount: number;
        debit_currency: string;
      }): Promise<FlutterwaveResponse<any>>;
      withdraw(data: {
        id: string;
        amount: number;
      }): Promise<FlutterwaveResponse<any>>;
      block(data: { id: string }): Promise<FlutterwaveResponse<any>>;
      unblock(data: { id: string }): Promise<FlutterwaveResponse<any>>;
    };
    Beneficiary: {
      create(
        data: CreateBeneficiaryRequest
      ): Promise<FlutterwaveResponse<Beneficiary>>;
      fetch(data?: {
        page?: number;
      }): Promise<FlutterwaveResponse<Beneficiary[]>>;
      delete(data: { id: number }): Promise<FlutterwaveResponse<any>>;
    };
    Subscription: {
      fetch(data?: {
        page?: number;
      }): Promise<FlutterwaveResponse<Subscription[]>>;
      activate(data: {
        id: number;
      }): Promise<FlutterwaveResponse<Subscription>>;
      cancel(data: { id: number }): Promise<FlutterwaveResponse<Subscription>>;
    };
    PaymentPlan: {
      create(
        data: CreatePaymentPlanRequest
      ): Promise<FlutterwaveResponse<PaymentPlan>>;
      fetch(data?: {
        page?: number;
      }): Promise<FlutterwaveResponse<PaymentPlan[]>>;
      get(data: { id: number }): Promise<FlutterwaveResponse<PaymentPlan>>;
      cancel(data: { id: number }): Promise<FlutterwaveResponse<PaymentPlan>>;
      update(data: {
        id: number;
        name?: string;
        status?: string;
      }): Promise<FlutterwaveResponse<PaymentPlan>>;
    };
  }
}

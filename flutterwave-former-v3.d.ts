declare module "flutterwave-node-v3" {
  export interface BaseResponse<T = any> {
    status: string;
    message: string;
    data: T;
    meta?: {
      page_info?: {
        total: number;
        current_page: number;
        total_pages: number;
      };
      authorization?: {
        mode: string;
        redirect: string;
        [key: string]: any;
      };
      [key: string]: any;
    };
  }

  export interface BankBranch {
    id: number;
    branch_code: string;
    branch_name: string;
    swift_code: string;
    bic_code: string;
    bank_id: number;
  }

  export interface Bank {
    branches(data: { id: string }): Promise<BaseResponse<BankBranch[]>>;
    country(data: {
      country: string;
    }): Promise<BaseResponse<{ id: number; code: string; name: string }[]>>;
  }

  export interface BeneficiaryPayload {
    account_number: string;
    account_bank: string;
    beneficiary_name: string;
  }

  export interface BeneficiaryResponse {
    id: number;
    account_number: string;
    bank_code: string;
    full_name: string;
    created_at: string;
    bank_name: string;
  }

  export interface Beneficiary {
    create(
      data: BeneficiaryPayload
    ): Promise<BaseResponse<BeneficiaryResponse>>;
    delete(data: { id: string }): Promise<BaseResponse<null>>;
    fetch_all(): Promise<BaseResponse<BeneficiaryResponse[]>>;
    fetch(data: { id: string }): Promise<BaseResponse<BeneficiaryResponse>>;
  }

  export interface BillPayload {
    country: string;
    customer: string;
    amount: number;
    recurrence: "ONCE" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
    type: string;
    reference: string;
    biller_name?: string;
  }

  export interface BulkBillPayload {
    bulk_reference: string;
    callback_url: string;
    bulk_data: BillPayload[];
  }

  export interface BillResponse {
    phone_number: string;
    amount: number;
    network: string;
    flw_ref: string;
    tx_ref: string;
    reference?: string;
    [key: string]: any;
  }

  export interface Bills {
    create_bill(data: BillPayload): Promise<BaseResponse<BillResponse>>;
    amt_to_be_paid(data: {
      country: string;
      customer: string;
      amount: number;
      recurrence: string;
      type: string;
    }): Promise<BaseResponse<any>>;
    create_bulk(data: BulkBillPayload): Promise<BaseResponse<any>>;
    create_ord_billing(data: {
      customer_id: string;
      product_id: string;
      amount: number;
      reference: string;
    }): Promise<BaseResponse<any>>;
    fetch_bills(data: { from: string; to: string }): Promise<BaseResponse<any>>;
    fetch_bills_Cat(data: { country: string }): Promise<BaseResponse<any>>;
    fetch_bills_agencies(data: any): Promise<BaseResponse<any>>;
    fetch_status(data: { reference: string }): Promise<BaseResponse<any>>;
    products_under_agency(data: { id: string }): Promise<BaseResponse<any>>;
    update_bills(data: {
      order_id: string;
      amount: number;
    }): Promise<BaseResponse<any>>;
    validate(data: {
      item_code: string;
      code: string;
      customer: string;
    }): Promise<BaseResponse<any>>;
  }

  export interface ChargeCardPayload {
    card_number: string;
    cvv: string;
    expiry_month: string;
    expiry_year: string;
    currency: string;
    amount: string | number;
    email: string;
    fullname?: string;
    phone_number?: string;
    tx_ref: string;
    redirect_url?: string;
    enckey?: string;
    authorization?: {
      mode: "pin" | "avs" | "redirect" | "validate";
      pin?: string;
      city?: string;
      address?: string;
      state?: string;
      country?: string;
      zipcode?: string;
    };
    payment_plan?: string;
    subaccounts?: any[];
    meta?: any;
  }

  export interface ChargeResponse {
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
    account?: {
      account_number: string;
      account_bank: string;
      bank_code: string;
    };
    meta?: any;
  }

  export interface ChargeNGPayload {
    account_bank: string;
    account_number: string;
    amount: string | number;
    email: string;
    tx_ref: string;
    currency: string;
    phone_number?: string;
    fullname?: string;
    passcode?: string;
    bvn?: string;
  }

  export interface ChargeACHPayload {
    amount: string | number;
    currency: string;
    email: string;
    tx_ref: string;
    fullname?: string;
    phone_number?: string;
    client_ip?: string;
    device_fingerprint?: string;
    meta?: any;
  }

  export interface ChargeUKPayload {
    amount: string | number;
    currency: string;
    email: string;
    tx_ref: string;
    fullname?: string;
    phone_number?: string;
    account_bank: string;
    account_number: string;
  }

  export interface ChargeUSSDPayload {
    account_bank: string;
    amount: string | number;
    currency: string;
    email: string;
    tx_ref: string;
    fullname?: string;
    phone_number?: string;
  }

  export interface ChargeBankTransferPayload {
    amount: string | number;
    currency: string;
    email: string;
    tx_ref: string;
    fullname?: string;
    phone_number?: string;
    is_permanent?: boolean;
    expires?: number; // duration in seconds
  }

  export interface Charge {
    card(data: ChargeCardPayload): Promise<BaseResponse<ChargeResponse>>;
    ng(data: ChargeNGPayload): Promise<BaseResponse<ChargeResponse>>;
    ach(data: ChargeACHPayload): Promise<BaseResponse<ChargeResponse>>;
    uk(data: ChargeUKPayload): Promise<BaseResponse<ChargeResponse>>;
    ussd(data: ChargeUSSDPayload): Promise<BaseResponse<ChargeResponse>>;
    validate(data: {
      flw_ref: string;
      otp: string;
      type?: string;
    }): Promise<BaseResponse<ChargeResponse>>;
    voucher(data: {
      amount: number;
      currency: string;
      email: string;
      tx_ref: string;
      pin: string;
      fullname?: string;
      phone_number?: string;
    }): Promise<BaseResponse<ChargeResponse>>;
    bank_transfer(
      data: ChargeBankTransferPayload
    ): Promise<BaseResponse<ChargeResponse>>;
    applepay(data: {
      amount: number;
      currency: string;
      email: string;
      tx_ref: string;
      fullname?: string;
      phone_number?: string;
    }): Promise<BaseResponse<ChargeResponse>>;
    googlepay(data: {
      amount: number;
      currency: string;
      email: string;
      tx_ref: string;
      fullname?: string;
      phone_number?: string;
    }): Promise<BaseResponse<ChargeResponse>>;
    enaira(data: {
      amount: number;
      currency: string;
      email: string;
      tx_ref: string;
      fullname?: string;
      phone_number?: string;
      is_token?: number;
    }): Promise<BaseResponse<ChargeResponse>>;
    fawrypay(data: {
      amount: number;
      currency: string;
      email: string;
      tx_ref: string;
      fullname?: string;
      phone_number?: string;
    }): Promise<BaseResponse<ChargeResponse>>;
  }

  export interface EbillsOrderPayload {
    narration: string;
    number_of_units: number;
    currency: string;
    amount: number;
    phone_number: string;
    email: string;
    tx_ref: string;
    ip: string;
    custom_business_name: string;
    country: string;
  }

  export interface Ebills {
    order(data: EbillsOrderPayload): Promise<BaseResponse<ChargeResponse>>;
    update(data: {
      reference: string;
      currency: string;
      amount: number;
    }): Promise<BaseResponse<ChargeResponse>>;
  }

  export interface Misc {
    bal_currency(data: { currency: string }): Promise<
      BaseResponse<{
        currency: string;
        available_balance: number;
        ledger_balance: number;
      }>
    >;
    bal(data?: any): Promise<
      BaseResponse<
        {
          currency: string;
          available_balance: number;
          ledger_balance: number;
        }[]
      >
    >;
    bvn(data: { bvn: string }): Promise<BaseResponse<any>>;
    verifybvn(data: { bvn: string }): Promise<BaseResponse<any>>;
    verify_Account(data: {
      account_number: string;
      account_bank: string;
    }): Promise<BaseResponse<{ account_number: string; account_name: string }>>;
  }

  export interface MobileMoneyPayload {
    amount: string | number;
    currency: string;
    email: string;
    tx_ref: string;
    phone_number: string;
    fullname?: string;
    network?: string; // For Ghana, Zambia etc.
    voucher?: string; // For Vodafone Ghana
  }

  export interface MobileMoney {
    ghana(data: MobileMoneyPayload): Promise<BaseResponse<ChargeResponse>>;
    mpesa(data: MobileMoneyPayload): Promise<BaseResponse<ChargeResponse>>;
    rwanda(data: MobileMoneyPayload): Promise<BaseResponse<ChargeResponse>>;
    uganda(data: MobileMoneyPayload): Promise<BaseResponse<ChargeResponse>>;
    franco_phone(
      data: MobileMoneyPayload & { country: string }
    ): Promise<BaseResponse<ChargeResponse>>;
    zambia(data: MobileMoneyPayload): Promise<BaseResponse<ChargeResponse>>;
    tanzania(data: MobileMoneyPayload): Promise<BaseResponse<ChargeResponse>>;
  }

  export interface Security {
    getIntegrityHash(data: any): any;
  }

  export interface Otp {
    create(data: {
      length: number;
      customer: { name: string; email: string; phone: string };
      sender: string;
      send: boolean;
      medium: string[];
      expiry: number;
    }): Promise<BaseResponse<any>>;
    validate(data: {
      reference: string;
      otp: string;
    }): Promise<BaseResponse<any>>;
  }

  export interface PaymentPlanPayload {
    amount: number;
    name: string;
    interval: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
    duration?: number;
  }

  export interface PaymentPlanResponse {
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

  export interface PaymentPlan {
    create(
      data: PaymentPlanPayload
    ): Promise<BaseResponse<PaymentPlanResponse>>;
    cancel(data: { id: string }): Promise<BaseResponse<PaymentPlanResponse>>;
    get_all(data?: {
      from?: string;
      to?: string;
      page?: string;
      limit?: string;
    }): Promise<BaseResponse<PaymentPlanResponse[]>>;
    get_plan(data: { id: string }): Promise<BaseResponse<PaymentPlanResponse>>;
    update(data: {
      id: string;
      name?: string;
      status?: "active" | "cancelled";
    }): Promise<BaseResponse<PaymentPlanResponse>>;
  }

  export interface Settlement {
    fetch_all(data?: {
      page?: string;
      from?: string;
      to?: string;
      subaccount_id?: string;
    }): Promise<BaseResponse<any[]>>;
    fetch(data: { id: string }): Promise<BaseResponse<any>>;
  }

  export interface SubscriptionResponse {
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

  export interface Subscription {
    activate(data: { id: string }): Promise<BaseResponse<SubscriptionResponse>>;
    cancel(data: { id: string }): Promise<BaseResponse<SubscriptionResponse>>;
    fetch_all(data?: {
      email?: string;
      transaction_id?: string;
      plan?: string;
      page?: string;
    }): Promise<BaseResponse<SubscriptionResponse[]>>;
    get(data: { email: string }): Promise<BaseResponse<SubscriptionResponse>>;
  }

  export interface SubaccountPayload {
    account_bank: string;
    account_number: string;
    business_name: string;
    business_email?: string;
    business_contact?: string;
    business_contact_mobile?: string;
    business_mobile?: string;
    country: string;
    meta?: any[];
    split_type: "percentage" | "flat";
    split_value: number;
  }

  export interface SubaccountResponse {
    id: number;
    account_number: string;
    account_bank: string;
    business_name: string;
    fullname: string;
    created_at: string;
    split_type: string;
    split_value: number;
    subaccount_id: string;
    bank_name: string;
  }

  export interface Subaccount {
    create(data: SubaccountPayload): Promise<BaseResponse<SubaccountResponse>>;
    delete(data: { id: string }): Promise<BaseResponse<any>>;
    fetch_all(data?: {
      page?: string;
      limit?: string;
    }): Promise<BaseResponse<SubaccountResponse[]>>;
    fetch(data: { id: string }): Promise<BaseResponse<SubaccountResponse>>;
    update(data: {
      id: string;
      business_name?: string;
      business_email?: string;
      account_bank?: string;
      account_number?: string;
      split_type?: string;
      split_value?: number;
    }): Promise<BaseResponse<SubaccountResponse>>;
  }

  export interface TokenizedChargePayload {
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

  export interface Tokenized {
    charge(data: TokenizedChargePayload): Promise<BaseResponse<ChargeResponse>>;
    fetch_bulk(data: { bulk_id: string }): Promise<BaseResponse<any>>;
    bulk(data: {
      title: string;
      retry_strategy: {
        retry_interval: number;
        retry_amount_variable: number;
        retry_attempt: number;
      };
      bulk_data: TokenizedChargePayload[];
    }): Promise<BaseResponse<any>>;
    fetch_charge_transactions(data: {
      id: string;
      from?: string;
      to?: string;
    }): Promise<BaseResponse<any>>;
    update_token(data: {
      token: string;
      status?: "active" | "inactive";
      email?: string;
    }): Promise<BaseResponse<any>>;
  }

  export interface Transaction {
    event(data: { id: string }): Promise<BaseResponse<any>>;
    fee(data: { amount: number; currency: string }): Promise<BaseResponse<any>>;
    refund(data: { id: string; amount?: number }): Promise<BaseResponse<any>>;
    resend_hooks(data: { id: string }): Promise<BaseResponse<any>>;
    fetch(data: {
      from?: string;
      to?: string;
      page?: string;
      limit?: string;
      status?: string;
      currency?: string;
      tx_ref?: string;
    }): Promise<BaseResponse<ChargeResponse[]>>;
    verify(data: { id: string }): Promise<BaseResponse<ChargeResponse>>;
    verify_by_tx(data: {
      tx_ref: string;
    }): Promise<BaseResponse<ChargeResponse>>;
  }

  export interface TransferPayload {
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

  export interface TransferResponse {
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

  export interface Transfer {
    bulk(data: {
      title: string;
      bulk_data: TransferPayload[];
    }): Promise<BaseResponse<any>>;
    fee(data: {
      amount: number;
      currency: string;
      type?: string;
    }): Promise<BaseResponse<any>>;
    initiate(data: TransferPayload): Promise<BaseResponse<TransferResponse>>;
    fetch(data: {
      from?: string;
      to?: string;
      page?: string;
      status?: string;
    }): Promise<BaseResponse<TransferResponse[]>>;
    get_a_transfer(data: {
      id: string;
    }): Promise<BaseResponse<TransferResponse>>;
    wallet_to_wallet(data: {
      amount: number;
      currency: string;
      merchant_id: string;
    }): Promise<BaseResponse<TransferResponse>>;
  }

  export interface VirtualAccountPayload {
    email: string;
    is_permanent?: boolean;
    bvn?: string;
    tx_ref?: string;
    phonenumber?: string;
    firstname?: string;
    lastname?: string;
    narration?: string;
    amount?: number;
  }

  export interface VirtualAccountResponse {
    response_code: string;
    response_message: string;
    flw_ref: string;
    order_ref: string;
    account_number: string;
    bank_name: string;
    created_at: string;
    expiry_date: string;
    note: string;
    amount: number;
  }

  export interface VirtualAcct {
    create_bulk(data: {
      accounts: number;
      email: string;
      is_permanent?: boolean;
      tx_ref?: string;
      bvn?: string;
    }): Promise<BaseResponse<any>>;
    create(
      data: VirtualAccountPayload
    ): Promise<BaseResponse<VirtualAccountResponse>>;
    fetch(data: {
      order_ref: string;
    }): Promise<BaseResponse<VirtualAccountResponse>>;
    fetch_bulk(data: { batch_id: string }): Promise<BaseResponse<any>>;
  }

  export interface VirtualCardPayload {
    currency: string;
    amount: number;
    debit_currency?: string;
    billing_name?: string;
    billing_address?: string;
    billing_city?: string;
    billing_state?: string;
    billing_postal_code?: string;
    billing_country?: string;
    first_name?: string;
    last_name?: string;
    date_of_birth?: string;
    email?: string;
    phone?: string;
    title?: string;
    gender?: string;
    callback_url?: string;
  }

  export interface VirtualCardResponse {
    id: string;
    account_id: string;
    amount: string;
    currency: string;
    card_pan: string;
    masked_pan: string;
    city: string;
    state: string;
    address_1: string;
    address_2: string;
    zip_code: string;
    cvv: string;
    expiration: string;
    send_to: string;
    bin_check_name: string;
    card_type: string;
    name_on_card: string;
    created_at: string;
    is_active: boolean;
    callback_url: string;
  }

  export interface VirtualCard {
    create(
      data: VirtualCardPayload
    ): Promise<BaseResponse<VirtualCardResponse>>;
    fund(data: {
      id: string;
      amount: number;
      debit_currency?: string;
    }): Promise<BaseResponse<any>>;
    fetch_all(data?: {
      page?: number;
      limit?: number;
    }): Promise<BaseResponse<VirtualCardResponse[]>>;
    fetch(data: { id: string }): Promise<BaseResponse<VirtualCardResponse>>;
    block(data: { id: string }): Promise<BaseResponse<VirtualCardResponse>>;
    unblock(data: { id: string }): Promise<BaseResponse<VirtualCardResponse>>;
    terminate(data: { id: string }): Promise<BaseResponse<VirtualCardResponse>>;
    transactions(data: {
      id: string;
      from?: string;
      to?: string;
      index?: number;
      size?: number;
    }): Promise<BaseResponse<any>>;
    withdraw_funds(data: {
      id: string;
      amount: number;
    }): Promise<BaseResponse<any>>;
  }

  export interface Chargeback {
    fetch_all(data?: {
      page?: string;
      from?: string;
      to?: string;
      status?: string;
    }): Promise<BaseResponse<any[]>>;
    fetch(data: { id: string }): Promise<BaseResponse<any>>;
    accept(data: { id: string }): Promise<BaseResponse<any>>;
    decline(data: { id: string }): Promise<BaseResponse<any>>;
  }

  class Rave {
    constructor(
      publicKey: string,
      privateKey: string,
      productionFlag?: boolean
    );
    Bank: Bank;
    Beneficiary: Beneficiary;
    Bills: Bills;
    Charge: Charge;
    Ebills: Ebills;
    Misc: Misc;
    MobileMoney: MobileMoney;
    security: Security;
    Otp: Otp;
    PaymentPlan: PaymentPlan;
    Settlement: Settlement;
    Subscription: Subscription;
    Subaccount: Subaccount;
    Tokenized: Tokenized;
    Transaction: Transaction;
    Transfer: Transfer;
    VirtualAcct: VirtualAcct;
    VirtualCard: VirtualCard;
    Chargeback: Chargeback;
    getIntegrityHash(data: any): string;
  }

  export = Rave;
}

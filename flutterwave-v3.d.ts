declare module "flutterwave-node-v3" {
  export interface FlutterwaveResponse<T = any> {
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
        redirect?: string;
        pin?: number;
        note?: string;
        validate_instructions?: string;
        transfer_reference?: string;
        transfer_account?: string;
        transfer_bank?: string;
        account_expiration?: number;
        transfer_note?: string;
        transfer_amount?: string;
        [key: string]: any;
      };
      [key: string]: any;
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
    phone_number?: string;
    tx_ref: string;
    redirect_url?: string;
    enckey?: string;
    type?: string;
    authorization?: {
      mode: string;
      pin?: string | number;
      city?: string;
      address?: string;
      state?: string;
      country?: string;
      zipcode?: string;
      fields?: string[];
    };
    payment_plan?: string;
    subaccounts?: any[];
    meta?: any;
  }

  export interface NGChargeRequest {
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

  export interface UKChargeRequest {
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
    is_token_io?: number;
    redirect_url?: string;
  }

  export interface ACHChargeRequest {
    tx_ref: string;
    amount: string;
    type: string; // 'ach_payment'
    currency: string;
    country: string;
    email: string;
    phone_number?: string;
    fullname?: string;
    client_ip?: string;
    redirect_url?: string;
    device_fingerprint?: string;
    meta?: any;
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
    type?: string;
    voucher?: string;
    order_id?: string;
    country?: string;
    client_ip?: string;
    device_fingerprint?: string;
    meta?: any;
  }

  export interface BankTransferChargeRequest {
    tx_ref: string;
    amount: string | number;
    email: string;
    fullname?: string;
    phone_number?: string;
    currency: string;
    is_permanent?: boolean;
    expires?: number; // duration in seconds
    client_ip?: string;
    device_fingerprint?: string;
    narration?: string;
  }

  export interface USSDChargeRequest {
    tx_ref: string;
    account_bank: string;
    amount: string | number;
    currency: string;
    email: string;
    phone_number?: string;
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
    auth_url?: string;
    payment_code?: string;
  }

  export interface ValidateChargeRequest {
    otp: string;
    flw_ref: string;
    type?: string;
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

  export interface BillResponseData {
    phone_number: string;
    amount: number;
    network: string;
    flw_ref: string;
    tx_ref: string;
    reference?: string;
    [key: string]: any;
  }

  export interface Bank {
    id: number;
    code: string;
    name: string;
  }

  export interface BankBranch {
    id: number;
    branch_code: string;
    branch_name: string;
    swift_code: string;
    bic_code: string;
    bank_id: number;
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
    subaccount_id?: string;
  }

  export interface TokenizedChargeRequest {
    token: string;
    currency: string;
    amount: number;
    email: string;
    first_name?: string;
    last_name?: string;
    ip?: string;
    country?: string;
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
    debit_currency?: string;
    first_name?: string;
    last_name?: string;
    date_of_birth?: string;
    email?: string;
    phone?: string;
    title?: string;
    gender?: string;
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
    beneficiary_name?: string;
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
    duration?: number;
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

  export interface OtpRequest {
    length: number;
    customer: {
      name: string;
      email: string;
      phone: string;
    };
    sender: string;
    send: boolean;
    medium: string[];
    expiry: number;
  }

  export interface OtpResponseData {
    medium: string;
    reference: string;
    otp: string;
    expiry: string;
  }

  export interface EbillsOrderRequest {
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

  export interface EbillsOrderResponseData {
    flw_ref: string;
    tx_ref: string;
    response_message: string;
  }

  export default class Flutterwave {
    constructor(publicKey: string, secretKey: string, productionFlag?: boolean);
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
      ng(
        data: NGChargeRequest
      ): Promise<FlutterwaveResponse<ChargeResponseData>>;
      uk(
        data: UKChargeRequest
      ): Promise<FlutterwaveResponse<ChargeResponseData>>;
      ach(
        data: ACHChargeRequest
      ): Promise<FlutterwaveResponse<ChargeResponseData>>;
      validate(
        data: ValidateChargeRequest
      ): Promise<FlutterwaveResponse<ChargeResponseData>>;
      voucher(data: {
        amount: number;
        currency: string;
        email: string;
        tx_ref: string;
        pin: string;
        fullname?: string;
        phone_number?: string;
      }): Promise<FlutterwaveResponse<ChargeResponseData>>;
      applepay(data: {
        amount: number;
        currency: string;
        email: string;
        tx_ref: string;
        fullname?: string;
        phone_number?: string;
      }): Promise<FlutterwaveResponse<ChargeResponseData>>;
      googlepay(data: {
        amount: number;
        currency: string;
        email: string;
        tx_ref: string;
        fullname?: string;
        phone_number?: string;
      }): Promise<FlutterwaveResponse<ChargeResponseData>>;
      enaira(data: {
        amount: number;
        currency: string;
        email: string;
        tx_ref: string;
        fullname?: string;
        phone_number?: string;
        is_token?: number;
      }): Promise<FlutterwaveResponse<ChargeResponseData>>;
      fawrypay(data: {
        amount: number;
        currency: string;
        email: string;
        tx_ref: string;
        fullname?: string;
        phone_number?: string;
      }): Promise<FlutterwaveResponse<ChargeResponseData>>;
    };
    MobileMoney: {
      mpesa(
        data: MobileMoneyChargeRequest
      ): Promise<FlutterwaveResponse<ChargeResponseData>>;
      ghana(
        data: MobileMoneyChargeRequest
      ): Promise<FlutterwaveResponse<ChargeResponseData>>;
      rwanda(
        data: MobileMoneyChargeRequest
      ): Promise<FlutterwaveResponse<ChargeResponseData>>;
      uganda(
        data: MobileMoneyChargeRequest
      ): Promise<FlutterwaveResponse<ChargeResponseData>>;
      franco_phone(
        data: MobileMoneyChargeRequest
      ): Promise<FlutterwaveResponse<ChargeResponseData>>;
      zambia(
        data: MobileMoneyChargeRequest
      ): Promise<FlutterwaveResponse<ChargeResponseData>>;
      tanzania(
        data: MobileMoneyChargeRequest
      ): Promise<FlutterwaveResponse<ChargeResponseData>>;
    };
    Bills: {
      create_bill(
        data: CreateBillRequest
      ): Promise<FlutterwaveResponse<BillResponseData>>;
      fetch_bills_Cat(data?: {
        country: string;
      }): Promise<FlutterwaveResponse<BillCategory[]>>;
      validate(data: {
        item_code: string;
        code: string;
        customer: string;
      }): Promise<FlutterwaveResponse<any>>;
      amt_to_be_paid(data: {
        country: string;
        customer: string;
        amount: number;
        recurrence: string;
        type: string;
      }): Promise<FlutterwaveResponse<any>>;
      create_bulk(data: BulkBillPayload): Promise<FlutterwaveResponse<any>>;
      create_ord_billing(data: {
        customer_id: string;
        product_id: string;
        amount: number;
        reference: string;
      }): Promise<FlutterwaveResponse<any>>;
      fetch_bills(data: {
        from: string;
        to: string;
      }): Promise<FlutterwaveResponse<any>>;
      fetch_bills_agencies(data: any): Promise<FlutterwaveResponse<any>>;
      fetch_status(data: {
        reference: string;
      }): Promise<FlutterwaveResponse<any>>;
      products_under_agency(data: {
        id: string;
      }): Promise<FlutterwaveResponse<any>>;
      update_bills(data: {
        order_id: string;
        amount: number;
      }): Promise<FlutterwaveResponse<any>>;
    };
    Bank: {
      country(data: { country: string }): Promise<FlutterwaveResponse<Bank[]>>;
      branches(data: {
        id: string;
      }): Promise<FlutterwaveResponse<BankBranch[]>>;
    };
    Misc: {
      bal(data?: any): Promise<FlutterwaveResponse<Balance[]>>;
      verify_Account(
        data: ResolveAccountRequest
      ): Promise<FlutterwaveResponse<ResolveAccountResponseData>>;
      bvn(data: {
        bvn: string;
      }): Promise<FlutterwaveResponse<ResolveBVNResponseData>>;
      verifybvn(data: {
        bvn: string;
      }): Promise<FlutterwaveResponse<ResolveBVNResponseData>>;
      bal_currency(data: {
        currency: string;
      }): Promise<FlutterwaveResponse<Balance>>;
    };
    Settlement: {
      fetch_all(data?: {
        page?: string;
        from?: string;
        to?: string;
        subaccount_id?: string;
      }): Promise<FlutterwaveResponse<Settlement[]>>;
      fetch(data: { id: string }): Promise<FlutterwaveResponse<Settlement>>;
    };
    Subaccount: {
      create(
        data: CreateSubaccountRequest
      ): Promise<FlutterwaveResponse<Subaccount>>;
      fetch_all(data?: {
        page?: string;
        limit?: string;
      }): Promise<FlutterwaveResponse<Subaccount[]>>;
      fetch(data: { id: string }): Promise<FlutterwaveResponse<Subaccount>>;
      update(data: {
        id: string;
        business_name?: string;
        business_email?: string;
        account_bank?: string;
        account_number?: string;
        split_type?: string;
        split_value?: number;
      }): Promise<FlutterwaveResponse<Subaccount>>;
      delete(data: { id: string }): Promise<FlutterwaveResponse<any>>;
    };
    Tokenized: {
      charge(
        data: TokenizedChargeRequest
      ): Promise<FlutterwaveResponse<ChargeResponseData>>;
      bulk_charge(data: {
        title: string;
        retry_strategy: {
          retry_interval: number;
          retry_amount_variable: number;
        };
        bulk_data: TokenizedChargeRequest[];
      }): Promise<FlutterwaveResponse<any>>;
      bulk_status(data: { bulk_id: string }): Promise<FlutterwaveResponse<any>>;
      bulk_transactions(data: {
        bulk_id: string;
      }): Promise<FlutterwaveResponse<any>>;
      update_token(data: {
        token: string;
        email?: string;
        phone_number?: string;
        full_name?: string;
        status?: "active" | "inactive";
      }): Promise<FlutterwaveResponse<any>>;
      fetch_charge_transactions(data: {
        id: string;
        from?: string;
        to?: string;
      }): Promise<FlutterwaveResponse<any>>;
      bulk(data: {
        title: string;
        retry_strategy: {
          retry_interval: number;
          retry_amount_variable: number;
          retry_attempt: number;
        };
        bulk_data: TokenizedChargeRequest[];
      }): Promise<FlutterwaveResponse<any>>;
      fetch_bulk(data: { bulk_id: string }): Promise<FlutterwaveResponse<any>>;
    };
    Transaction: {
      fetch(data?: {
        from?: string;
        to?: string;
        page?: string;
        limit?: string;
        currency?: string;
        status?: string;
        tx_ref?: string;
      }): Promise<FlutterwaveResponse<any[]>>;
      fee(data: {
        amount: string;
        currency: string;
        payment_type?: string;
        card_first6digits?: string;
      }): Promise<FlutterwaveResponse<any>>;
      resend_hooks(data: {
        tx_ref?: string;
        id?: string;
        wait?: boolean;
      }): Promise<FlutterwaveResponse<any>>;
      verify(data: {
        id: string;
      }): Promise<FlutterwaveResponse<TransactionVerifyResponseData>>;
      verify_by_tx(data: {
        tx_ref: string;
      }): Promise<FlutterwaveResponse<TransactionVerifyResponseData>>;
      refund(data: {
        id: string;
        amount?: string | number;
      }): Promise<FlutterwaveResponse<any>>;
      event(data: { id: string }): Promise<FlutterwaveResponse<any>>;
    };
    Transfer: {
      initiate(
        data: InitiateTransferRequest
      ): Promise<FlutterwaveResponse<TransferResponseData>>;
      bulk(data: {
        title: string;
        bulk_data: InitiateTransferRequest[];
      }): Promise<FlutterwaveResponse<any>>;
      fetch(data?: {
        page?: string;
        status?: string;
        from?: string;
        to?: string;
      }): Promise<FlutterwaveResponse<TransferResponseData[]>>;
      get_a_transfer(data: {
        id: string;
      }): Promise<FlutterwaveResponse<TransferResponseData>>;
      wallet_to_wallet(data: {
        amount: number;
        currency: string;
        email?: string;
        reference?: string;
        narration?: string;
        merchant_id?: string;
      }): Promise<FlutterwaveResponse<any>>;
      fee(data: {
        amount: number;
        currency: string;
        type?: string;
      }): Promise<FlutterwaveResponse<any[]>>;
    };
    VirtualAcct: {
      create(
        data: CreateVirtualAccountRequest
      ): Promise<FlutterwaveResponse<VirtualAccount>>;
      create_bulk(data: {
        accounts: number;
        email: string;
        is_permanent?: boolean;
        tx_ref?: string;
        bvn?: string;
      }): Promise<FlutterwaveResponse<any>>;
      fetch(data: {
        order_ref: string;
      }): Promise<FlutterwaveResponse<VirtualAccount>>;
      fetch_bulk(data: { batch_id: string }): Promise<FlutterwaveResponse<any>>;
    };
    VirtualCard: {
      create(
        data: CreateVirtualCardRequest
      ): Promise<FlutterwaveResponse<VirtualCard>>;
      fetch(data?: {
        page?: number;
      }): Promise<FlutterwaveResponse<VirtualCard[]>>;
      fetch_all(data?: {
        page?: number;
        limit?: number;
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
      withdraw_funds(data: {
        id: string;
        amount: number;
      }): Promise<FlutterwaveResponse<any>>;
      block(data: { id: string }): Promise<FlutterwaveResponse<any>>;
      unblock(data: { id: string }): Promise<FlutterwaveResponse<any>>;
      terminate(data: { id: string }): Promise<FlutterwaveResponse<any>>;
      transactions(data: {
        id: string;
        from?: string;
        to?: string;
        index?: number;
        size?: number;
      }): Promise<FlutterwaveResponse<any>>;
    };
    Beneficiary: {
      create(
        data: CreateBeneficiaryRequest
      ): Promise<FlutterwaveResponse<Beneficiary>>;
      fetch_all(data?: {
        page?: string;
      }): Promise<FlutterwaveResponse<Beneficiary[]>>;
      fetch(data: { id: string }): Promise<FlutterwaveResponse<Beneficiary>>;
      delete(data: { id: string }): Promise<FlutterwaveResponse<any>>;
    };
    Subscription: {
      fetch_all(data?: {
        page?: string;
        email?: string;
        transaction_id?: string;
        plan?: string;
      }): Promise<FlutterwaveResponse<Subscription[]>>;
      get(data: {
        email: string;
      }): Promise<FlutterwaveResponse<Subscription[]>>;
      activate(data: {
        id: string;
      }): Promise<FlutterwaveResponse<Subscription>>;
      cancel(data: { id: string }): Promise<FlutterwaveResponse<Subscription>>;
    };
    PaymentPlan: {
      create(
        data: CreatePaymentPlanRequest
      ): Promise<FlutterwaveResponse<PaymentPlan>>;
      get_all(data?: {
        page?: string;
        from?: string;
        to?: string;
        limit?: string;
      }): Promise<FlutterwaveResponse<PaymentPlan[]>>;
      get_plan(data: { id: string }): Promise<FlutterwaveResponse<PaymentPlan>>;
      cancel(data: { id: string }): Promise<FlutterwaveResponse<PaymentPlan>>;
      update(data: {
        id: string;
        name?: string;
        status?: string;
      }): Promise<FlutterwaveResponse<PaymentPlan>>;
    };
    Otp: {
      create(data: OtpRequest): Promise<FlutterwaveResponse<OtpResponseData[]>>;
      validate(data: {
        reference: string;
        otp: string;
      }): Promise<FlutterwaveResponse<any>>;
    };
    Ebills: {
      order(
        data: EbillsOrderRequest
      ): Promise<FlutterwaveResponse<EbillsOrderResponseData>>;
      update(data: {
        reference: string;
        currency: string;
        amount: number;
      }): Promise<FlutterwaveResponse<any>>;
    };
    security: {
      getIntegrityHash(data: any): any;
    };
    Chargeback: {
      fetch_all(data?: {
        page?: string;
        from?: string;
        to?: string;
        status?: string;
      }): Promise<FlutterwaveResponse<any[]>>;
      fetch(data: { id: string }): Promise<FlutterwaveResponse<any>>;
      accept(data: { id: string }): Promise<FlutterwaveResponse<any>>;
      decline(data: { id: string }): Promise<FlutterwaveResponse<any>>;
    };
  }
}

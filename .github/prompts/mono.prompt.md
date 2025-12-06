---
agent: agent
---

<head>
<base href="https://docs.mono.co">
  <title>My Markdown Page</title>
</head>

# Mono API Documentation

## Create a Customer (Individual)

October 23rd, 2025

`post` api.withmono.com/v2/customers

v1.0

**This resource is to create a unique customer.**

Body

**email** string `required`  
This field expects the unique email of the user

**type** string

This field expects the type of customer i.e. individual.

**first_name** string `required`  
This field expects the first name of the user

**last_name** string `required`  
This field expects the last name of the user

**address** string `required`  
This field expects the current address of the user [Maximum of 100 characters]

**phone** string `required`  
This field expects the phone number of the user

**identity** object `required`  
This field expects the kyc identity fields such as the type and the number

**identity.type** string `required`  
This field expects the identity type i.e "BVN" [No white spaces allowed]

**identity.number** string `required`  
This field expects the BVN number of the user

Headers

**mono-sec-key** string `required`  
Your app’s secret key

### Request

```js
const axios = require("axios");

const options = {
  method: "POST",
  url: "https://api.withmono.com/v2/customers",
  headers: { accept: "application/json", "content-type": "application/json" },
  data: {
    identity: {
      type: "string",
      number: "string",
    },
    email: "string",
    type: "string",
    last_name: "string",
    first_name: "string",
    address: "string",
    phone: "string",
  },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

201 - Result

```json
{
  "status": "successful",
  "message": "Created customer successfully",
  "data": {
    "id": "6578295bbf09b0a505bc567c",
    "name": "Samuel Olamide",
    "first_name": "Samuel",
    "last_name": "Samuel Olamide",
    "email": "samuel@olamide.com",
    "phone": "08012345678",
    "address": "23 shittu animashaun street",
    "identification_no": "0123456789011",
    "identification_type": "bvn",
    "bvn": "0123456789011"
  }
}
```

400 - Customer already exists

```json
{
  "status": "failed",
  "message": "Customer already exists with similar credentials (email or names supplied)",
  "data": null
}
```

## Create a Customer (Business)

October 23rd, 2025

`post` api.withmono.com/v2/customers

v1.0

**This resource is to create a unique Business customer.**

Body

**email** string `required`  
This field expects the unique email of the user

**type** string `required`  
This field expects the type of customer i.e. business

**business_name** string `required`  
This field expects the business name

**address** string `required`

This field expects the current address of the business [Maximum of 100 characters]

**phone** string `required`

This field expects the phone number of the user

**identity** object `required`

This field expects the kyc identity fields such as the type and the number

**identity.type** string `required`

This field expects the identity type i.e "BVN" [No white spaces allowed]

**identity.number** string `required`

This field expects the BVN number of one of the shareholders of the company

Headers

**mono-sec-key** string `required`  
Your app’s secret key

### Request

```js
const axios = require("axios");

const options = {
  method: "POST",
  url: "https://api.withmono.com/v2/customers",
  headers: { accept: "application/json", "content-type": "application/json" },
  data: {
    identity: {
      type: "string",
      number: "string",
    },
    email: "string",
    type: "string",
    business_name: "string",
    address: "string",
    phone: "string",
  },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

201 - Result

```json
{
  "status": "successful",
  "message": "Created customer successfully",
  "data": {
    "id": "668d303e06d2d5aac",
    "type": "business",
    "business_name": "Nomo Global Systems",
    "email": "only@nomo.co",
    "phone": "01042658500",
    "address": "1 Nomo Street, Yaba ",
    "identification_no": "12461501556",
    "identification_type": "bvn",
    "bvn": "12461501556"
  }
}
```

400 - Customer already exists

```json
{
  "status": "failed",
  "message": "Customer already exists with similar credentials (email or names supplied)",
  "data": null
}
```

## Retrieve a Customer

March 20th, 2025

`get` api.withmono.com/v2/customers/{id}

v1.0

**This resource is to retrieve information about a single customer.**

Path Params

**id** string `required`  
This field expects your customer's id

Headers

**mono-sec-key** string `required`  
Your app’s secret key

### Request

```js
const axios = require("axios");

const options = {
  method: "POST",
  url: "https://api.withmono.com/v2/customers/id",
  headers: { accept: "application/json", "content-type": "application/json" },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

200 - Result

```json
{
  "status": "successful",
  "message": "Customer Data retrieved successfully",
  "data": {
    "id": "6641af2a7c9ff1663be1d59b",
    "name": "Samuel Olamide",
    "first_name": "Samuel",
    "last_name": "Olamide",
    "email": "samuel@neem.co",
    "phone": "08012345609",
    "address": "23 shittu animashaun street",
    "identification_no": "01234567801",
    "identification_type": "bvn",
    "bvn": "01234567801"
  }
}
```

400 - Invalid Customer Id

```json
{
  "status": "failed",
  "message": "Invalid Customer Id, could not fetch customer",
  "data": null
}
```

## List all Customers

March 20th, 2025

`get` api.withmono.com/v2/customers

v1.0

**This resource is to retrieve information about all customers.**

### Request

```js
const axios = require("axios");

const options = {
  method: "POST",
  url: "https://api.withmono.com/v2/customers",
  headers: { accept: "application/json", "content-type": "application/json" },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

200 - Result

```json
{
  "status": "successful",
  "message": "Data retrieved successfully",
  "data": [
    {
      "id": "6641af2a7c9ff1663be1d59b",
      "name": "Samuel Olamide",
      "first_name": "Samuel",
      "last_name": "Olamide",
      "email": "samuel@neem.co",
      "phone": "08012345609",
      "address": "23 shittu animashaun street ",
      "identification_no": "01234567801",
      "identification_type": "bvn",
      "bvn": "01234567801"
    }
  ],
  "meta": {
    "total": 187,
    "pages": 38,
    "previous": null,
    "next": "https://api.withmono.com/v2/customers?page=2"
  }
}
```

400 - Result

```
{
}
```

## Get all Customer Transactions

March 20th, 2025

`get` api.withmono.com/v2/customers/{id}/transactions

v1.0

This resource retrieves all transactions performed by a customer via our payments products

### Request

```js
const axios = require("axios");

const options = {
  method: "GET",
  url: "https://api.withmono.com/v2/customers/{id}/transactions?period=last12months&page=1&account={accountId}",
  headers: {
    accept: "application/json",
    "mono-sec-key": "string",
    "content-type": "application/json",
  },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

200 - Result

```json
{
  "status": "successful",
  "message": "Data retrieved successfully",
  "data": [
    {
      "account": "6375c00000000007b76af7",
      "account_name": "SAMUEL OLAMIDE NOMO",
      "bank": "Zenith Bank",
      "account_transaction_data": {
        "errored": false,
        "data": {
          "message": "Data retrieved successfully",
          "status": "successful",
          "data": {
            "transactions": [
              {
                "id": "6375cb76b33",
                "type": "credit",
                "amount": 780000,
                "narration": "NIP/ROL/Transfer/single/AT5_MF1111",
                "date": "2022-11-16T16:53:00.000Z",
                "balance": 2073332,
                "category": null
              },
              {
                "id": "6375c87b76bf7",
                "type": "credit",
                "amount": 780000,
                "narration": "NIP/ROL/Transfer/single/AT5_MFDS48F4LS8P",
                "date": "2022-11-16T16:53:00.000Z",
                "balance": 2073332,
                "category": null
              },
              {
                "id": "6375sss76bf8",
                "type": "debit",
                "amount": 2688,
                "narration": "NIP Charge + VAT",
                "date": "2022-11-16T10:15:00.000Z",
                "balance": 2069568,
                "category": null
              },
              {
                "id": "63757b76b35",
                "type": "debit",
                "amount": 780000,
                "narration": "NIP CR//OPAY",
                "date": "2022-11-16T10:15:00.000Z",
                "balance": 786881,
                "category": null
              }
            ],
            "meta": {
              "total": 516,
              "pages": 65,
              "previous": null,
              "next": "https://api.withmono.com/v2/customers?page=4&period=last5months"
            }
          }
        },
        "error": null
      }
    }
  ]
}
```

404 - Result

```json
{
  "status": "failed",
  "message": "Unable to fetch connected account from customer supplied",
  "data": null
}
```

## Fetch all linked accounts

March 20th, 2025

`get` api.withmono.com/v2/accounts

v1.0

This resource helps to retrieve all accounts linked to a business

### Request

```js
const axios = require("axios");

const options = {
  method: "POST",
  url: "https://api.withmono.com/v2/accounts",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
    "mono-sec-key": "string",
  },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

200 - Result

```json
{
  "status": "successful",
  "message": "Data retrieved successfully",
  "timestamp": "2024-04-16T07:23:43.813Z",
  "data": [
    {
      "id": "660e9c267474f97aba212345",
      "name": "OLAMIDE SAMUEL NOMO",
      "account_number": "2002451234",
      "currency": "NGN",
      "balance": 12335,
      "auth_method": "internet_banking",
      "status": "AVAILABLE",
      "bvn": "22354051234",
      "type": "DIGITAL_SAVINGS_ACCOUNT",
      "institution": {
        "id": "5f2d08bf60b92e2888287704",
        "name": "Kuda Bank",
        "bank_code": "090267",
        "type": "PERSONAL_BANKING"
      },
      "customer": {
        "id": "660e9be2c83b157a5f161234",
        "name": "OLAMIDE SAMUEL",
        "email": "samuel@neem.com"
      }
    }
  ],
  "meta": {
    "total": 40,
    "pages": 4,
    "previous": null,
    "next": "https://api.withmono.com/v2/accounts/?page=2"
  }
}
```

400 - Result

```json
{
  "status": "failed",
  "message": "Invalid id query parameter",
  "timestamp": "2024-03-15T14:54:13.178Z",
  "data": null
}
```

## Update a Customer

July 30th, 2025

`patch` api.withmono.com/v2/customers/{id}

v1.0

**This resource is to update some information about a single customer.**

### Request

```js
const axios = require("axios");

const options = {
  method: "PATCH",
  url: "https://api.withmono.com/v2/customers/id",
  headers: {
    accept: "application/json",
    "mono-sec-key": "string",
    "content-type": "application/json",
  },
  data: {
    identity: { type: "bvn", number: "string" },
    address: "string",
    phone: "string",
  },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

200 - Result

```json
{
  "status": "successful",
  "message": "Customer updated successfully",
  "data": null
}
```

400 - Result

```json
{}
```

## Delete a Customer

March 20th, 2025

`delete` api.withmono.com/v2/customers/{id}

v1.0

**This resource is used to delete a single customer.**

### Request

```js
const axios = require("axios");

const options = {
  method: "DELETE",
  url: "https://api.withmono.com/v2/customers/id",
  headers: {
    accept: "application/json",
    "mono-sec-key": "string",
  },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

200 - Result

```json
{
  "status": "successful",
  "message": "Deleted customer successfully",
  "data": null
}
```

400 - Invalid Customer Id

```json
{
  "status": "failed",
  "message": "Invalid Customer Id",
  "data": null
}
```

## Initiate One-Time Payment

Last updated Sept 9th, 2025

`post` api.withmono.com/v2/payments/initiate

v1.0

This resource is to initiate a one-time payment. To initiate a one-time payment, an amount, type, reference etc can be populated on the Initiate endpoint. Once this is provided, a payment link is generated, which your customers can open in their browsers or mobile app in form of a web view.

Please ensure to verify the payment status via the verify payment endpoint before proceeding to give value for the payment.

Split Payments

You can seamlessly allocate or split payments into multiple accounts in a single transaction by passing a `split` object in your body request.

We also provide flexibility in setting up both percentage-based and fixed-amount splits.

### Request

```js
const axios = require("axios");

const options = {
  method: "POST",
  url: "https://api.withmono.com/v2/payments/initiate",
  headers: { accept: "application/json", "content-type": "application/json", "mono-sec-key": "string" },
  data: {
    "amount": 20000,
    "type": "onetime-debit",
    "method": "account" //transfer, whatsapp
    "description": "testing",
    "reference": "testing-10039819098",
    "redirect_url": "https://mono.co",
    "customer": {
        "email": "samuel@neem.com",
        "phone": "08122334455",
        "address": "home address",
        "identity": {
            "type": "bvn",
            "number": "22110033445"
        },
        "name": "Samuel Olamide"
    },
    "meta": {}
}
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

200 - Onetime-Debit

```json
{
  "status": "successful",
  "message": "Payment Initiated Successfully",
  "timestamp": "2025-05-21T21:58:21.087Z",
  "data": {
    "id": "ODW2QV0WLIDG",
    "mono_url": "https://checkout.mono.co/ODW2QV0WLIDG",
    "type": "onetime-debit",
    "method": "transfer",
    "amount": 21000,
    "description": "Ticket",
    "reference": "ref03098",
    "customer": "67aa0961271cb661d8cbae3b",
    "institution": "5f2d08bf60b92e2888287704",
    "auth_method": "internet_banking",
    "redirect_url": "https://mono.co",
    "created_at": "2025-05-21T21:58:21.078Z",
    "updated_at": "2025-05-21T21:58:21.078Z",
    "meta": {},
    "liveMode": true
  }
}
```

400 - Invalid reference

```json
{
  "status": "failed",
  "message": "Invalid reference, please retry with a unique reference",
  "timestamp": "2024-05-22T07:07:55.464Z",
  "data": null
}
```

## Verify Payment Status

June 11th, 2025

`get` api.withmono.com/v2/payments/verify/{reference}

v1.0

Verify the payment status using the reference passed when [initiating](https://docs.mono.co/api/directpay/initiate) payment.

### Request

```js
const axios = require("axios");

const options = {
  method: "GET",
  url: "https://api.withmono.com/v2/payments/verify/{reference}",
  headers: { accept: "application/json", "content-type": "application/json" },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

200 - Result

```json
{
  "status": "successful",
  "message": "Payment retrieved successfully",
  "timestamp": "2025-06-11T12:50:08.866Z",
  "data": {
    "id": "6836e6addc85c314cfbb400a",
    "meta": null,
    "instruments": ["6836e6addc85c314cfbb400a"],
    "channel": "mandate",
    "fee": 5500,
    "feeBearer": "business",
    "type": "variable-debit",
    "status": "successful",
    "amount": 20000,
    "currency": "NGN",
    "description": "Ticket",
    "reference": "iupr81gt9jksgn812odtcc6u",
    "liveMode": true,
    "account": {
      "name": "Samuel Olamide",
      "accountNumber": "012345678",
      "currency": "NGN",
      "type": "mandate_account",
      "institution": {
        "name": "ALAT by WEMA",
        "bankCode": "035",
        "type": "PERSONAL_BANKING"
      }
    },
    "customer": "6836e648bcb53ec765cc2c51",
    "refunded": false,
    "created_at": "2025-05-31T11:43:00.061Z",
    "updated_at": "2025-05-31T11:43:02.301Z",
    "device_fingerprint": null,
    "ip_address": null,
    "flag_rule_names": [],
    "flag_reasons": [],
    "held_settlement": false
  }
}
```

404 - Result

```json
{
  "status": "failed",
  "message": "Invalid reference, payment not found",
  "timestamp": "2024-04-27T22:02:36.893Z",
  "data": null
}
```

## Fetch all Payments

June 11th, 2025

`get` api.withmono.com/v2/payments/transactions

v1.0

### Request

```js
const axios = require("axios");

const options = {
  method: "GET",
  url: "https://api.withmono.com/v2/payments/transactions?page=1&start=01-01-2022&end=10-01-2022&status=successful",
  headers: { accept: "application/json" },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

200 - Transactions

```json
{
    "status": "successful",
    "message": "Data retrieved successfully",
    "timestamp": "2025-06-11T12:38:25.798Z",
    "data": {
        "payments": [
            {
                "id": "683aeb444db1ba1bf92ad6df",
                "instruments": [
                    "6836e6addc85c314cfbb400a"
                ],
                "channel": "mandate",
                "fee": 5500,
                "fee_bearer": "business",
                "type": "variable-debit",
                "status": "successful",
                "amount": 20000,
                "currency": "NGN",
                "description": "Books and Sports Limited",
                "reference": "iupr81gt9jksgn812odtcc6e",
                "account": {
                    "id": "6836e75cc511bb53165c3f42",
                    "name": "SAMUEL OLAMIDE",
                    "account_number": "0123456789",
                    "currency": "NGN",
                    "institution": {
                        "id": "5f5b530a67ffc15e5911e0d2",
                        "name": "ALAT by WEMA",
                        "type": "PERSONAL_BANKING"
                    },
                    "created_at": "2025-05-28T10:37:16.407Z",
                    "updated_at": "2025-05-31T11:43:00.354Z"
                },
                "customer": {
                    "id": "6836e648bcb53ec765cc2c50",
                    "name": "IB",
                    "created_at": "2025-05-28T10:32:40.448Z",
                    "updated_at": "2025-05-28T10:32:40.448Z"
                },
                "refunded": false,
                "flag_rule_names": [],
                "flag_reasons": [],
                "created_at": "2025-05-31T11:43:00.061Z",
                "updated_at": "2025-05-31T11:43:02.301Z"
            },
            {
                "id": "6839afa3cd2e24e71c0eca6b",
                "instruments": [
                    "6836e6addc85c314cfbb400a"
                ],
                "channel": "mandate",
                "fee": 5500,
                "fee_bearer": "business",
                "type": "variable-debit",
                "status": "failed",
                "amount": 20000,
                "currency": "NGN",
                "description": "FBNQuest Asset Management",
                "reference": "nejhxji3b1cwo56tv8qkuybi",
                "account": {
                    "id": "6836e75cc511bb53165c3f42",
                    "name": "SAMUEL OLAMIDE",
                    "account_number": "0123456789",
                    "currency": "NGN",
                    "institution": {
                        "id": "5f5b530a67ffc15e5911e0d2",
                        "name": "ALAT by WEMA",
                        "type": "PERSONAL_BANKING"
                    },
                    "created_at": "2025-05-28T10:37:16.407Z",
                    "updated_at": "2025-05-31T11:43:00.354Z"
                },
                "customer": {
                    "id": "6836e648bcb53ec765cc2c50",
                    "name": "IB",
                    "created_at": "2025-05-28T10:32:40.448Z",
                    "updated_at": "2025-05-28T10:32:40.448Z"
                },
                "refunded": false,
                "flag_rule_names": [],
                "flag_reasons": [],
                "created_at": "2025-05-30T13:16:19.186Z",
                "updated_at": "2025-05-30T13:16:20.186Z"
            }...
        ]
    },
    "meta": {
        "paging": {
            "total": 3,
            "pages": 1,
            "previous": null,
            "next": null
        }
    }
}
```

400 - Result

```json
{}
```

## Get Banks

Last updated March 3rd, 2025

`get` api.withmono.com/v3/banks/list

v1.0

**This resource is to retrieve all available banks.**

### Request

```js
const axios = require("axios");

const options = {
  method: "GET",
  url: "https://api.withmono.com/v3/banks/list",
  headers: { accept: "application/json", "mono-sec-key": "string" },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

200 - Result

```json
{
  "status": "successful",
  "message": "request completed successfully",
  "data": {
    "banks": [
      {
        "name": "NIBSS",
        "bank_code": "999",
        "nip_code": "999999",
        "direct_debit": false
      },
      {
        "name": "CBN",
        "bank_code": "001",
        "nip_code": "000028",
        "direct_debit": false
      },
      {
        "name": "ACCESS BANK PLC",
        "bank_code": "044",
        "nip_code": "000014",
        "direct_debit": true
      },
      ...
    ]
  }
}
```

400 - Result

```json
{}
```

## Initiate Mandate Authorisation

Last updated October 24th, 2025

`post` api.withmono.com/v2/payments/initiate

v1.0

**This resource returns a link for your customers to authorise their mandate. It is helpful when you don't need to customise the flow. When you use this resource to setup a mandate, you have no need for the `create a mandate` [endpoint](https://docs.mono.co/api/direct-debit/mandate/create-a-mandate).**

A more detailed guide on using this resource can be found [here](https://docs.mono.co/docs/payments/direct-debit/mandate-setup-explained).

Regarding the readiness for debiting the account:

- Signed Mandate: Upon bank approval, signed mandate accounts are immediately available for debiting and balance inquiries.
- E-mandate: With an e-mandate setup, a waiting period of 1 hour max should be observed following approval before debiting and balance inquiries can be conducted.

Debit Types & Amount

**Variable**: The `amount` represents the total funds a business plans to collect from a customer over the mandate period. Individual debit amounts can vary within this total limit.

**Fixed**: The `amount` specifies the exact amount to be debited per transaction. The total debit is automatically calculated based on this fixed amount. Once set during mandate authorization, this amount cannot be modified.

Body Params - Variable Mandate

**amount** string `required`  
In kobo. Minimum amount value is NGN 200 (20000 kobo)

**type** string `required`  
i.e. recurring-debit

**method** string `required`  
This field expects a string value i.e mandate

**mandate_type** string `required`  
This field expects the mandate type i.e `emandate` or `signed` or `gsm`

**debit_type** string `required`  
This field expects the type of debit i.e. `variable`

**description** string `required`  
E.g Shipping fee

**reference** string `required`  
Unique reference (Minimum of 10 characters)

**customer** string  
the customer id as seen in the response [here](https://docs.mono.co/api/customer/create-a-customer)

**redirect_url** string  
This field expects a valid URL (with the url protocol i.e **https://** included) which redirects your users after a successful/failed payment.

**start_date** string `required`  
This field expects the start date of the mandate e.g. 2023-12-15

**end_date** string `required`  
This field expects the end date of the mandate e.g. 2024-05-25

**meta** object  
This is used to include additional payment information.

**N.B:** You can add additional meta keys apart from reference key used below.

Body Params - Fixed Mandate

**amount** number `required`  
In kobo. Minimum amount value is NGN 200 (20000 kobo)

**type** string `required`  
i.e. recurring-debit

**method** string `required`  
This field expects a string value i.e mandate

**mandate_type** string `required`  
This field expects the mandate type i.e `emandate` or `signed` or `gsm`

**debit_type** string `required`  
This field expects the type of debit i.e. `fixed`

**description** string `required`  
E.g Shipping fee

**reference** string `required`  
Unique reference (Minimum of 10 characters)

**customer** string  
the customer id as seen in the response [here](https://docs.mono.co/api/customer/create-a-customer)

**redirect_url** string  
This field expects a valid URL (with the url protocol i.e **https://** included) which redirects your users after a successful/failed payment.

**start_date** string `required`  
This field expects the start date of the mandate e.g. 2023-12-15

**end_date** string `required`  
This field expects the end date of the mandate e.g. 2024-05-25

**frequency** string `required`  
This field expects the frequency of the debit `daily` , `weekly` , `monthly` and `yearly`.  
For custom-frequencies use `days`, `weeks`, `months` and provide a whole number value in the interval field.

**interval** string  
This expects any whole number (e.g. 1, 5) as it's only required when `days`, `weeks`, `months` are set as the frequency

**retrial_frequency** string `required`  
This field expects the number of retries on a particular debit date [ Minimum is 1 & Maximum is 6 ].

**initial_debit_date** string `required`  
This field expects the the first day/date to debit the mandate account. Must be greater than `start_date` e.g. 2024-01-25.

**initial_debit_amount** number This field expects the initial amount to debit on the `initial_debit_date` e.g. 20000(in kobo)

**grace_period** number `required`  
This field expects the number of days to continue debiting an account before setting the next debit date to next frequency date i.e

**minimum_due** number `required`  
This field expects the amount in a case of failed debits due to insufficient funds, then the minimum_due is attempted

**meta** object  
This is used to include additional payment information.

**N.B:** You can add additional meta keys apart from reference key used below.

Headers

**mono-sec-key** string `required`  
Your app’s secret key

### Request

```js
const axios = require("axios");

const options = {
  method: "POST",
  url: "https://api.withmono.com/v2/payments/initiate",
  headers: { accept: "application/json", "content-type": "application/json" },
  data: {
    amount: 9190030,
    type: "recurring-debit",
    method: "mandate",
    mandate_type: "emandate",
    debit_type: "variable",
    description: "Repayment for samuel.olamide@nomo.co",
    reference: "test-O2b9O9EF903-949493432",
    redirect_url: "https://mono.co",
    customer: {
      id: "65eb623b0000900009e5c1f21cd",
    },
    start_date: "2024-03-29",
    end_date: "2024-08-04",
    meta: {},
  },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

200 - Recurring-Debit

```json
{
  "status": "successful",
  "message": "Payment Initiated Successfully",
  "data": {
    "mono_url": "https://authorise.mono.co/RD3044259",
    "mandate_id": "mmc_682b977203c0b7360787b460",
    "type": "recurring-debit",
    "method": "mandate",
    "mandate_type": "emandate",
    "amount": 9190030,
    "description": "Repayment for samuel@neem.com",
    "reference": "test-O2b9O9EF903-949493432",
    "customer": "65eb623b0000900009e5c1f21cd",
    "redirect_url": "https://mono.co",
    "created_at": "2024-03-12T14:17:31.548Z",
    "updated_at": "2024-03-12T14:17:31.548Z",
    "start_date": "2024-03-19",
    "end_date": "2024-08-04"
  }
}
```

400 - Result

```json
{
  "status": "failed",
  "message": "Validation error",
  "data": [
    {
      "field": "start_date",
      "message": "The date should be at least today or later when mandate_type is emandate."
    },
    {
      "field": "reference",
      "message": "reference must be shorter than or equal to 24 characters"
    }
  ]
}
```

200 - Variable Mandate - Result

```json
{
  "status": "successful",
  "message": "Payment Initiated Successfully",
  "data": {
    "mono_url": "https://authorise.mono.co/RD3044259",
    "mandate_id": "mmc_682b977203c0b7360787b460",
    "type": "recurring-debit",
    "method": "mandate",
    "mandate_type": "emandate",
    "amount": 9190030,
    "description": "Repayment for samuel@neem.com",
    "reference": "test-O2b9O9EF903-949493432",
    "customer": "65eb623b0000900009e5c1f21cd",
    "redirect_url": "https://mono.co",
    "created_at": "2024-03-12T14:17:31.548Z",
    "updated_at": "2024-03-12T14:17:31.548Z",
    "start_date": "2024-03-19",
    "end_date": "2024-08-04"
  }
}
```

200 - Fixed Mandate - Result

```json
{
  "status": "successful",
  "message": "Payment Initiated Successfully",
  "data": {
    "mono_url": "https://authorise.mono.co/RD9152019674",
    "mandate_id": "mmc_682b977203c0b7360787b460",
    "type": "recurring-debit",
    "mandate_type": "emandate", // or "signed" or "gsm"
    "amount": 200000,
    "description": "nomo Mandate Test",
    "reference": "nomo-test-24-04-24-02",
    "customer": "6629259fe903b1",
    "redirect_url": "https://mono.co",
    "created_at": "2024-04-24T17:44:17.833Z",
    "updated_at": "2024-04-24T17:44:17.833Z",
    "start_date": "2024-04-29",
    "end_date": "2024-05-30"
  }
}
```

## Create a Mandate

Last updated Novemeber 28th, 2025

`post` api.withmono.com/v3/payments/mandates

v1.0

**This resource allows you to create your own mandate authorisation experience. When you use this resource to setup a mandate, you have no need for the `initiate a mandate` [endpoint](https://docs.mono.co/api/direct-debit/mandate/initiate-mandate-authorisation).**

A more detailed guide on using this resource can be found [here](https://docs.mono.co/docs/payments/direct-debit/mandate-setup-explained).

Regarding the readiness for debiting the account:

- Signed Mandate: Upon bank approval, signed mandate accounts are immediately available for debiting and balance inquiries.
- E-mandate: With an e-mandate setup, a waiting period of 1 hour max should be observed following approval before debiting and balance inquiries can be conducted.

Debit Types & Amount

**Variable**: The `amount` represents the total funds a business plans to collect from a customer over the mandate period. Individual debit amounts can vary within this total limit.

**Fixed**: The `amount` specifies the exact amount to be debited per transaction. The total debit is automatically calculated based on this fixed amount. Once set during mandate authorization, this amount cannot be modified.

Fee Bearer

The fee bearer is the entity that will be charged for the transaction. This feature is only available for e-mandates (fixed and variable).

- `business`: The fee will be charged to the business (default)
- `customer`: The fee will be charged to the customer

Mandate verification options

Mandates default to `transfer_verification`, which follows the ₦50 transfer flow when `verification_method` is omitted. Include the optional `verification_method` field and set it to `selfie_verification` to trigger Biometric Verification. This runs BVN validation and a Face Match, returns a verification link (`mono_url`), and approves the mandate automatically when the customer completes the selfie + liveness checks.

### Request

```js
const axios = require("axios");

const options = {
  method: "POST",
  url: "https://api.withmono.com/v3/payments/mandates",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
    "mono-sec-key": "string",
  },
  data: {
    debit_type: "variable",
    customer: "string",
    mandate_type: "string",
    amount: "integer",
    reference: "string",
    account_number: "string",
    bank_code: "string",
    fee_bearer: "string",
    description: "string",
    start_date: "string",
    end_date: "string",
    verification_method: "string",
    meta: {},
  },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

400 - Result

```json
{
  "status": "failed",
  "response_code": "400",
  "message": "Customer not found. Add a customer and try again",
  "timestamps": "2024-02-15T13:13:25.491Z",
  "documentation": "https://mono.co/docs/error-codes/400",
  "data": null
}
```

200 - E-Mandate - Result

```json
{
  "status": "successful",
  "message": "To proceed, please authorize this mandate by transferring N50.00 to any of the listed banks below",
  "data": {
        "meta": {},
        "id": "mmc_682bb5be03c0b736078cd83f",
        "status": "initiated",
        "mandate_type": "emandate",
        "debit_type": "variable",
        "ready_to_debit": false,
        "nibss_code": "RC227914/1580/0008722498",
        "approved": false,
        "reference": "refO2b9O9EF03944930",
        "account_name": "SAMUEL OLAMIDE",
        "account_number": "0123456789",
        "bank": "Wema Bank",
        "bank_code": "035",
        "customer": "68274fb5565971e625b9115c",
        "fee_bearer": "business",
        "verification_method": "transfer_verification",
        "description": "Test Payment",
        "live_mode": true,
        "start_date": "2025-05-28T00:00:00.000Z",
        "end_date": "2026-05-29T22:59:59.999Z",
        "date": "2025-05-19T22:50:38.529Z",
        "initial_debit_date": "2025-05-30T00:00:00.000Z",
        "transfer_destinations": [
                {
                        "bank_name": "Fidelity",
                        "account_number": 9020025928,
                        "icon": "https://mono-public-bucket.s3.eu-west-2.amazonaws.com/images/fidelity-bank-icon.png",
                        "primary_color": "#081A6F"
                },
                {
                    "bank_name": "Paystack Titan",
                    "account_number": 9880218357,
                    "icon": "https://mono-public-bucket.s3.eu-west-2.amazonaws.com/images/paystack-icon.png",
                    "primary_color": "#09A5DB"
                },
                {
                    "bank_name": "Parallex Bank",
                    "account_number": 6007049662,
                    "icon": "https://mono-public-bucket.s3.eu-west-2.amazonaws.com/institution-logo/parallex-logo.png",
                    "primary_color": "#0056ba"
                }
        ]
        "amount": 5000000,
        "initial_debit_amount": 300000
  }
}
```

200 - Biometric Verification - Result

```json
{
  "status": "successful",
  "message": "Mandate created successfully",
  "data": {
    "id": "mmc_691d957a87120578aeb864af",
    "status": "initiated",
    "mandate_type": "emandate",
    "debit_type": "variable",
    "ready_to_debit": false,
    "mono_url": "https://develop.d25lmvlzvrkhwa.amplifyapp.com/RC227914%2F1580%2F0015154303",
    "nibss_code": "RC227914/1580/0015154303",
    "approved": false,
    "reference": "mandatevrif7l9d4",
    "account_name": "Samuel Olamide",
    "account_number": "2012345678",
    "bank": "Access Bank",
    "bank_code": "044",
    "customer": "691af11398baaa44e1567bde",
    "description": "Mono Test",
    "live_mode": true,
    "start_date": "2025-11-27T00:00:00.000Z",
    "end_date": "2026-12-31T22:59:59.999Z",
    "date": "2025-11-19T10:01:30.471Z",
    "amount": 1000000,
    "fee_bearer": "business",
    "verification_method": "selfie_verification"
  }
}
```

200 - Signed - Result

```json
{
  "status": "successful",
  "message": "Mandate created successfully. Awaiting bank approval. The approval process takes between 24-48 hours for processing.",
  "data": {
    "id": "mmc_65774eee32fdbd96ff046b36",
    "mandate_type": "signed",
    "debit_type": "variable",
    "verification_method": "transfer_verification",
    "status": "active",
    "approved": false,
    "reference": "MONO2349491838391",
    "account_name": "SAMUEL OLAMIDE",
    "account_number": "0123456789",
    "bank": "GUARANTY TRUST BANK PLC",
    "customer": "6570ee1115ddbc5528fea123",
    "description": "Subscriptions",
    "start_date": "2023-12-14T00:00:00.000Z",
    "end_date": "2024-05-25T00:00:00.000Z",
    "date": "2023-12-11T18:03:26.246Z"
  }
}
```

## Retrieve a Mandate

Last updated June 11th, 2025

`get` api.withmono.com/v3/payments/mandates/{id}

v1.0

**This resource is to retrieve information about a mandate.**

### Request

```js
const axios = require("axios");

const options = {
  method: "GET",
  url: "https://api.withmono.com/v3/payments/mandates/id",
  headers: { accept: "application/json", "mono-sec-key": "string" },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

200 - Result

```json
{
  "status": "successful",
  "message": "request completed successfully",
  "data": {
    "id": "mmc_682b9c5803c0b736078889a3",
    "status": "approved",
    "reference": "refO2b9O9E03m",
    "amount": 80030,
    "balance": 80030,
    "mandate_type": "emandate",
    "debit_type": "variable",
    "account_name": "SAMUEL OLAMIDE",
    "account_number": "0123456789",
    "live_mode": true,
    "approved": true,
    "ready_to_debit": false,
    "nibss_code": "RC227914/1580/0008721216",
    "institution": {
      "bank_code": "672",
      "nip_code": "090267",
      "name": "Kuda Bank"
    },
    "customer": "682b96680a74b6af4de736ee",
    "narration": "Subscriptions",
    "redirect_url": "https://mono.co",
    "start_date": "2025-05-21T00:00:00.000Z",
    "end_date": "2026-08-04T22:59:59.999Z",
    "date": "2025-05-19T21:02:16.342Z"
  }
}
```

400 - Result

```json
{}
```

## Get all Mandates

Last updated July 7th, 2025

`get` api.withmono.com/v3/payments/mandates

v1.0

**This resource is to retrieve all mandates created by your business.**

### Request

```js
const axios = require("axios");

const options = {
  method: "GET",
  url: "https://api.withmono.com/v3/payments/mandates",
  headers: { accept: "application/json", "mono-sec-key": "string" },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

200 - Result

```json
{
  "status": "successful",
  "message": "request completed successfully",
  "data": [
    {
      "id": "mmc_682b9c5803c0b736078889a3",
      "status": "approved",
      "reference": "testO2b9O9E03m",
      "amount": 80030,
      "balance": 80030,
      "mandate_type": "emandate",
      "debit_type": "variable",
      "account_name": "IBRAHIM, KOBI SALIM",
      "account_number": "2075601658",
      "live_mode": true,
      "approved": true,
      "ready_to_debit": false,
      "nibss_code": "RC227914/1580/0008721216",
      "institution": {
        "bank_code": "672",
        "nip_code": "090267",
        "name": "Kuda Bank"
      },
      "customer": "682b96680a74b6af4de736ee",
      "narration": "Testing",
      "redirect_url": "https://mono.co",
      "fee_bearer": "business",
      "start_date": "2025-05-21T00:00:00.000Z",
      "end_date": "2026-08-04T22:59:59.999Z",
      "date": "2025-05-19T21:02:16.342Z"
    }
  ]
}
```

400 - Result

```json
{}
```

## Cancel a Mandate

Last updated June 11th, 2025

`patch` api.withmono.com/v3/payments/mandates/{id}/cancel

v1.0

**This resource is to cancel an active mandate.**

### Request

```js
const axios = require("axios");

const options = {
  method: "PATCH",
  url: "https://api.withmono.com/v3/payments/mandates/id/cancel",
  headers: { accept: "application/json", "mono-sec-key": "string" },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

200 - Result

```json
{
  "status": "success",
  "response_code": "200",
  "message": "This mandate is now cancelled and deleted, and can't be used again",
  "timestamp": "2025-05-19T22:15:56.343Z",
  "documentation": "https://mono.co/docs/error-codes/200",
  "data": null
}
```

400 - Result

```json
{
  "status": "failed",
  "response_code": "50",
  "message": "The Mono mandate code provided is incorrect, invalid, or does not exist. Please verify the code and try again.",
  "timestamp": "2025-05-19T22:19:23.583Z",
  "documentation": "https://mono.co/docs/error-codes/50",
  "data": null
}
```

## Pause a Mandate

Last updated June 11th, 2025

`patch` api.withmono.com/v3/payments/mandates/{id}/pause

v1.0

**This resource is to pause an active mandate.**

### Request

```js
const axios = require("axios");

const options = {
  method: "PATCH",
  url: "https://api.withmono.com/v3/payments/mandates/id/pause",
  headers: { accept: "application/json", "mono-sec-key": "string" },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

200 - Result

```json
{
  "status": "success",
  "response_code": "200",
  "message": "This mandate is now paused and can't be used for debit or balance inquiry, but you can reinstate it back.",
  "timestamps": "2023-12-13T20:23:07.074Z",
  "documentation": "https://mono.co/docs/error-codes/400",
  "data": null
}
```

400 - Result

```json
{
  "status": "failed",
  "response_code": "400",
  "message": "This mandate is already paused, but you can reinstate it back.",
  "timestamp": "2025-05-19T21:30:38.195Z",
  "documentation": "https://mono.co/docs/error-codes/400",
  "data": null
}
```

## Reinstate a Mandate

Last updated June 11th, 2025

`patch` api.withmono.com/v3/payments/mandates/{id}/reinstate

v1.0

**This resource is to reinstate a paused mandate.**

### Request

```js
const axios = require("axios");

const options = {
  method: "PATCH",
  url: "https://api.withmono.com/v3/payments/mandates/id/reinstate",
  headers: { accept: "application/json", "mono-sec-key": "string" },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

200 - Result

```json
{
  "status": "success",
  "response_code": "200",
  "message": "The mandate has been reinstated successfully and is now active for debit and balance inquiry",
  "timestamp": "2025-05-19T21:37:50.430Z",
  "documentation": "https://mono.co/docs/error-codes/200",
  "data": null
}
```

400 - Result

```json
{
  "status": "failed",
  "response_code": "400",
  "message": "This mandate is already active, but you can pause or cancel it.",
  "timestamp": "2025-05-19T21:40:53.095Z",
  "documentation": "https://mono.co/docs/error-codes/400",
  "data": null
}
```

## Payouts

Last updated Mar 15th, 2024

`get` api.withmono.com/v2/payments/payouts

v1.0

Retrieve payout details based on status

### Request

```js
const axios = require("axios");

const options = {
  method: "get",
  url: "https://api.withmono.com/v2/payments/payouts",
  headers: { accept: "application/json", "content-type": "application/json" },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

200 - Result

```json
{
  "status": "successful",
  "message": "Data retrieved successfully",
  "data": {
    "payouts": [
      {
        "id": "63f2a17899ea4c2f",
        "status": "settled",
        "amount": 237116135,
        "fee": 1890855.5339999998,
        "currency": "ngn",
        "date": "2023-02-19T23:00:00.000Z",
        "bank": "613129d96d02ca",
        "message": "Successfully settled.",
        "settled_amount": 235225279.466,
        "settled_account": {
          "beneficiary_bank": "Piggyvest",
          "beneficiary_account_name": "FLUTTERWAVE TECH. SOLUTIONS",
          "beneficiary_account_number": "9876512345"
        }
      },
      {
        "id": "63f158d90faf59",
        "status": "settled",
        "amount": 924792473,
        "fee": 4089128.2103999997,
        "currency": "ngn",
        "date": "2023-02-18T23:00:00.000Z",
        "bank": "613120696d02ca",
        "processor": "providus",
        "response": "{'transactionReference':'po_ksdWrqqyYieNEr','responseMessage':'Approved or completed successfully','responseCode':'00'}",
        "message": "Successfully settled."
      },
      {
        "id": "63f007d90d7302",
        "status": "settled",
        "amount": 387625764,
        "fee": 3021235.2839999995,
        "currency": "ngn",
        "date": "2023-02-17T23:00:00.000Z",
        "bank": "613120636d02ca",
        "processor": "providus",
        "response": "{'transactionReference':'po_O0Mz95uB8AGBBCAK','responseMessage':'Approved or completed successfully','responseCode':'00'}",
        "message": "Successfully settled."
      }
    ]
  },
  "meta": {
    "paging": {
      "total": 153,
      "pages": 31,
      "previous": null,
      "next": "http://withmono.com/payouts?status=settled&page=2"
    }
  }
}
```

## Payout Transactions

Last updated Mar 15th, 2024

`get` api.withmono.com/v2/payments/payout/{payout}/transactions

v1.0

Using the accountId and PayoutId to retrieve status of a payout transactions

### Request

```js
const axios = require("axios");

const options = {
  method: "get",
  url: "https://api.withmono.com/v2/payments/payout/{payout}/transactions",
  headers: { accept: "application/json", "content-type": "application/json" },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

200 - Result

```json
{
  "status": "successful",
  "message": "Data retrieved successfully",
  "data": {
    "payments": [
      {
        "id": "63f4e4749a61db",
        "type": "onetime-debit",
        "status": "successful",
        "amount": 9015000,
        "description": "Asset Management",
        "currency": "NGN",
        "account": {
          "id": "63f4e49a61d5",
          "institution": {
            "id": "5f2d088287702",
            "name": "GTBank",
            "type": "PERSONAL_BANKING"
          },
          "name": "SAMUEL OLAMIDE NOMO",
          "account_number": "00360012345",
          "currency": "NGN",
          "created_at": "2023-02-21T15:36:27.191Z",
          "updated_at": "2023-02-21T15:36:27.220Z"
        },
        "customer": null,
        "reference": "ZXZU964368214",
        "created_at": "2023-02-21T15:36:27.582Z",
        "updated_at": "2023-02-21T15:36:56.449Z",
        "fee": 75726
      }
    ]
  },
  "meta": {
    "paging": {
      "total": 1,
      "pages": 1,
      "previous": null,
      "next": null
    }
  }
}
```

400 - Result

```json
{}
```

## Refund

Last updated May 13th, 2024

`post` api.withmono.com/v2/payments/refund

v1.0

This endpoint allows you to initiate refunds for payments to your customers.

NOTE

- Refunds can be processed from either your dashboard wallet or from your pending payout for that specific transaction.
- By default, the refund source is set to the pending payout.
- Make sure your wallet has sufficient funds if you choose to use it as the source to ensure successful refund processing.

### Request

Copy

1234567891011121314

```js
const axios = require("axios");

const options = {
  method: "POST",
  url: "https://api.withmono.com/v2/payments/refund",
  headers: { accept: "application/json", "content-type": "application/json" },
  data: { reference: "string", source: "string" },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

200 - Result

```json
{
  "status": "successful",
  "message": "Refunded payment successfully",
  "timestamp": "2024-04-11T17:25:52.535Z",
  "data": {
    "id": "6615f0baaaa34e17e8d01234",
    "reference": "demo_ref_mxy0mb1234",
    "refunded": true,
    "refunded_amount": 20000,
    "beneficiary": {
      "name": "SAMUEL OLAMIDE",
      "bank_name": "Opay",
      "bank_code": "100004",
      "account_number": "90123456789"
    }
  }
}
```

400 - Result

```json
{
  "status": "failed",
  "message": "payment has already been refunded.",
  "timestamp": "2024-04-11T17:34:50.214Z",
  "data": null
}
```

## Create a Sub-Account

Last updated December 10th, 2024

`post` api.withmono.com/v2/payments/payout/sub-account

v1.0

This endpoint allows you to create a sub-account for split payments.

### Request

```js
const axios = require("axios");

const options = {
  method: "POST",
  url: "https://api.withmono.com/v2/payments/payout/sub-account",
  headers: { accept: "application/json", "content-type": "application/json" },
  data: { nip_code: "string", account_number: "string" },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

200 - Result

```json
{
  "status": "successful",
  "message": "Request completed successfully",
  "data": {
    "id": "6126aef671612f6126aef671612f",
    "name": "Sub Account Name",
    "account_number": "1234567890",
    "nip_code": "000000",
    "bank_code": "058"
  }
}
```

## Fetch all Sub-Accounts

Last updated December 10th, 2024

`get` api.withmono.com/v2/payments/payout/sub-accounts

v1.0

This endpoint allows you to fetch all created sub-accounts used for split payments.

### Request

```js
const axios = require("axios");

const options = {
  method: "GET",
  url: "https://api.withmono.com/v2/payments/payout/sub-accounts",
  headers: { accept: "application/json", "content-type": "application/json" },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

200 - Result

```json
{
  "status": "successful",
  "message": "Subaccounts retrieved successfully",
  "timestamp": "2024-11-29T16:45:00.581Z",
  "data": [
    {
      "id": "6749cccf1ee148a8af436c59",
      "account_number": "01234567893",
      "status": "active",
      "name": "Samuel Olamide",
      "category": "sub_account",
      "bank_name": "Kuda Microfinance Bank",
      "bank_code": "672",
      "nibss_code": "090267",
      "created_at": "2024-11-29T14:16:47.958Z",
      "updated_at": "2024-11-29T14:16:47.958Z"
    },
    {
      "id": "6749cc951ee148a8af436c13",
      "account_number": "01234567891",
      "status": "active",
      "name": "Samuel Olamide 2",
      "category": "sub_account",
      "bank_name": "ZENITH INTERNATIONAL BANK PLC",
      "bank_code": "057",
      "nibss_code": "000015",
      "created_at": "2024-11-29T14:15:49.204Z",
      "updated_at": "2024-11-29T14:15:49.204Z"
    },
    {
      "id": "673e258cbfc6fc07bf0f34b3",
      "account_number": "01234567890",
      "status": "active",
      "name": "Samuel Olamide 3",
      "category": "sub_account",
      "bank_name": "ACCESS BANK PLC",
      "bank_code": "044",
      "nibss_code": "000014",
      "created_at": "2024-11-20T18:08:12.723Z",
      "updated_at": "2024-11-20T18:08:12.723Z"
    }
  ],
  "meta": {
    "paging": {
      "total": 7,
      "pages": 1,
      "previous": null,
      "next": null
    }
  }
}
```

### Overview

Mono Split Payments enables businesses with the ability to effortlessly split funds from payments received through Mono DirectPay and Direct Debit. By using this functionality, businesses can define how payouts are allocated to multiple accounts, whether on a fixed amount or percentage basis.

This feature not only streamlines financial operations but also ensures transparency and accuracy in fund distribution, making it ideal for businesses managing partnerships, commissions, or multi-party transactions. With customizable options like specifying fee bearers and setting distribution limits, Mono Split Payments offers flexibility and efficiency in managing complex payout scenarios.

### Key Features

- Seamless allocation: Split payments to multiple accounts in a single transaction.
- Flexibility: Supports both percentage-based and fixed-amount splits.
- Webhook support: Receive real-time updates on settlement statuses.

### Integration Steps

To integrate the Split Payments workflow, follow these steps:

- Create a Sub-Account: Set up a sub-account using the third-party bank details associated with the payment splits.
- Configure Split Payments: Include the split configuration and specify the sub-account ID when initiating a One-Time DirectPay transaction and Direct Debit setup.
- Payment Process and Settlement: Once the payment is processed, settlement webhooks will be sent with the settlement configuration details.

### Step 1: Create a Sub-Account

To create a sub-account for payout allocations, send a POST request to the following endpoint:

### Request

```js
POST https://api.withmono.com/v2/payments/payout/sub-account
```

### Request Body Parameters

- `nip_code` (required): String field for the NIP code of the destination bank.
- `account_number` (required): String field for a valid account number to which payments will be split.

### Request Headers

Include the following header in your request:

- `mono-sec-key` (required): Your Mono secret key for authentication.

### Request

```js
const axios = require("axios");

const options = {
  method: "POST",
  url: "https://api.withmono.com/v2/payments/payout/sub-account",
  headers: { accept: "application/json", "content-type": "application/json" },
  data: { nip_code: "string", account_number: "string" },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

```json
{
  "status": "successful",
  "message": "Request completed successfully",
  "data": {
    "id": "6126aef671612f6126aef671612f",
    "name": "Sub Account Name",
    "account_number": "1234567890",
    "nip_code": "000000",
    "bank_code": "058"
  }
}
```

### Step 2: Configure Split Payments

#### Split Payments in API Requests

The `split` object can now be included in the body parameters of the following APIs for handling split payments:

1.  **[Initiate Payment API](https://docs.mono.co/api/directpay/initiate)**: `https://api.withmono.com/v2/payments/initiate`
2.  **[Direct Debit API](https://docs.mono.co/api/direct-debit/account/debit-account)**: `https://api.withmono.com/v3/payments/mandates/id/debit`

#### **Initiate Payment API** Example with Split

**Endpoint**: `https://api.withmono.com/v2/payments/initiate`

### Request

```js
const axios = require("axios");

const options = {
  method: "POST",
  url: "https://api.withmono.com/v2/payments/initiate",
  headers: { accept: "application/json", "content-type": "application/json", "mono-sec-key": "string" },
  data: {
    "method": "account",
    "type": "onetime-debit",
    "reference": "testsplitiientoi7",
    "description": "testing split payment 7",
    "customer": {
      "name": "Samuel Olamide",
      "email": "samuel@neem.com"
    },
    "amount": 450000,
    "split": {
      "type": "percentage",
      "fee_bearer": "business",
      "distribution": [
        {
          "account": "673e258cbfc6fc07bf0f34b3",
          "value": 50,
          "max": 20000
        },
        {
          "account": "673b40afbfc6fc07bf0e4d07",
          "value": 40
        }
      ]
    }
    "meta": {}
  }
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

```json
{
  "status": "successful",
  "message": "Payment Initiated Successfully",
  "timestamp": "2024-12-10T18:10:43.887Z",
  "data": {
    "id": "ODDZI5AT7NQW",
    "mono_url": "https://checkout.mono.co/ODDZI5AT7NQW",
    "type": "onetime-debit",
    "method": "account",
    "amount": 450000,
    "description": "testing split payment 7",
    "reference": "testsplitiddientdoi7",
    "customer": "673b783a737146d49343f6ed",
    "created_at": "2024-12-10T18:10:43.882Z",
    "updated_at": "2024-12-10T18:10:43.882Z",
    "meta": null,
    "liveMode": true,
    "split": {
      "type": "percentage",
      "fee_bearer": "business",
      "distribution": [
        {
          "account": "673e258cbfc6fc07bf0f34b3",
          "value": 50,
          "max": 200
        },
        {
          "account": "673b40afbfc6fc07bf0e4d07",
          "value": 40
        }
      ]
    }
  }
}
```

#### **Direct Debit API** Example with Split

**Endpoint**:  
`post https://api.withmono.com/v3/payments/mandates/id/debit`

**Request**:

### Request

```js
const axios = require("axios");

const options = {
  method: "POST",
  url: "https://api.withmono.com/v3/payments/mandates/id/debit",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
    "mono-sec-key": "string",
  },
  data: {
    amount: 48000,
    reference: "testingSplitingit1",
    narration: "testing Split",
    split: {
      type: "percentage",
      fee_bearer: "business",
      distribution: [
        {
          account: "673b4668bfc6fc07bf0e4e9e",
          value: 45,
        },
        {
          account: "673b40afbfc6fc07bf0e4d07",
          value: 50,
          max: 20000,
        },
      ],
    },
  },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

```json
{
  "status": "successful",
  "message": "Account debited successfully.",
  "response_code": "00",
  "data": {
    "success": true,
    "status": "successful",
    "event": "successful",
    "amount": 48000,
    "mandate": "mmc_65785f380155557f95da1547",
    "reference_number": "TPSDD319991D118-02",
    "date": "2023-12-10T14:01:39.619Z",
    "live_mode": true,
    "account_details": {
      "bank_code": "044",
      "account_name": "Samuel Olamide",
      "account_number": "012345679",
      "bank_name": "GUARANTY TRUST BANK PLC"
    },
    "beneficiary": {
      "bank_code": "000",
      "account_name": "SAMUEL",
      "account_number": "123456",
      "bank_name": "MONO SETTLEMENT WALLET"
    },
    "split": {
      "type": "percentage",
      "fee_bearer": "business",
      "distribution": [
        {
          "account": "673b4668bfc6fc07bf0e4e9e",
          "value": 45
        },
        {
          "account": "673b40afbfc6fc07bf0e4d07",
          "value": 50,
          "max": 20000
        }
      ]
    }
  }
}
```

#### Notes on Split Types

- **Percentage**: Provide values as percentages (e.g., 1 to 99). Ensure the total distribution does not exceed 100%, as some allocation is reserved for fee offsetting.
- **Fixed**: Provide values in the smallest currency unit (e.g., `5000000` for NGN 50,000).

Optional max field

Use the `max` parameter to cap the amount distributed for each transaction.  
Example: If `value` is `10` i.e 10% and `max` is `300000` (NGN 3,000), a NGN 50,000 payment will allocate NGN 3,000 (capped).

#### Notes on Fee Bearer

1.  **`sub_accounts`**: Fees are deducted from sub-accounts (e.g., NGN 10 per split).
2.  **`business`**: Fees are deducted from the business account.

### Step 3: Payment Process and Settlement

Once a payment is processed, the remaining amount is distributed as specified in the split configuration. Settlement details are sent via webhooks (i.e direct_debit.split_settlement_successful).

### Settlement Webhook Example

### Request

```json
{
  "event": "direct_debit.split_settlement_successful",
  "data": {
    "reference": "po_tr65CqSSomGEv785xQYvJ3P5",
    "business": "60cc8f95ba1772018c5c6b1d",
    "app": "61e270e2bbe2010771c0dec7",
    "status": "settled",
    "message": "Successfully settled",
    "date": "2024-12-08T23:00:00.000Z",
    "currency": "NGN",
    "split_fee": 10,
    "amount_settled": 200,
    "fee_bearer": "sub_accounts",
    "account": {
      "account_name": "Samuel Olamide",
      "account_number": "0123456789",
      "account_type": "sub_account",
      "institution": {
        "name": "Access bank",
        "code": "044",
        "nibss_code": "000014"
      }
    }
  }
}
```

## Direct Debit Overview

Last updated Oct 7th, 2025

### Mono Direct Debit (MDD)

Mono Direct Debit (MDD) empowers you to seamlessly collect variable payments from your customers, on an ongoing basis from all major Nigerian banks through a unified API integration.

With MDD, you can seamlessly collect multiple variable payments without the need for reauthorization. Users can establish payment limits within the long-lasting consent, specifying both the total amount and payment frequency.

Additionally, MDD also offers a "confirmation of funds" feature that enables you to check the customer account balance for the availability of funds before initiating a debit. This enhances payment success rates by ensuring funds are accessible before proceeding with the transaction.

### Features

- **Compatibility with Connect**: Using an already linked account, a business can initiate a recurring payment, this will pass all the account details + user details and the user simply has to authorize the mandate.
- **Future-dated payments:** Future-dated payments are financial transactions scheduled to occur on a specific date in the future. These payments can be automated, such as bills or loan instalments, ensuring timely execution without manual intervention.
- **Variable payments:** Variable payments are payments that fluctuate in amount, often based on changing factors. They lack a fixed, predetermined value and can vary over time such as savings etc (Piggyvest use case)
- **Subscription payments:** Subscription payments involve regular, usually recurring, financial transactions made to access a service, product, or content. These payments are typically scheduled at set intervals, such as monthly or annually. Subscriptions are commonly used for services like streaming, software, magazines, or gym memberships.
- **Money sweeping:** Money sweeping facilitates seamless and efficient money movement between accounts. e.g. You can set a direct debit sweep to move money monthly from your GTbank to your Access bank.

### Types of Debit

#### Variable Debit

A variable debit allows flexible withdrawals from a customer's account at any time, up to a predefined limit. For example, a food delivery service can set up a variable mandate allowing customers to pay for orders using their bank account, up to a maximum amount during the mandate period. If you authorize a mandate `amount` of ₦200,000 for 12 months, you can debit the account multiple times in varying amounts until the total limit is reached.

#### Fixed Debit

A fixed debit automatically deducts a predetermined amount from the customer's account at regular intervals. This is ideal for lending companies collecting recurring loan repayments. For example, if you authorize a mandate `amount` of ₦10,000 to be debited monthly for twelve months, the system automatically calculates the total mandate amount as ₦120,000.

### Types of Mandates

There are three categories of mandates:

#### Signature mandate

##### Overview

Using the signed mandate, the process begins by attaching the user's signature to the mandate creation, which is then electronically sent to the bank for confirmation. The bank verifies the signature, and they may reach out to the customer for further confirmation. Once approved by the bank, the mandate becomes instantly available for debiting and balance inquiries.

##### Process

1.  Initiate the setup of a mandate by collecting your customer's information, such as their account number, bank details, BVN, and signature.
2.  Programmatically, we automatically forward the mandate to the bank for their approval.
3.  The bank conducts a verification of the provided signature and may initiate contact with the customer for additional confirmation if deemed necessary.
4.  Once approved, the mandate becomes functional for conducting debits and checking account balances.

#### Electronic mandate

##### Overview

E-mandate provides a faster approval process. After creating the mandate and transferring NGN 50 to the designated account, approval typically occurs within 1-3 minutes. However, please note that there is a 24-hour waiting period before the mandate becomes fully functional for debiting and balance inquiries.

##### Process

- 1 Initiate the setup of a mandate by providing your customer's essential information, including their account number, bank details, and BVN.
- 2 Instruct the customer to promptly make an ₦50 transfer to the designated bank account returned from the create mandate response.
- i.) Ensure that the NGN 50 transfer is made from the same account where the mandate was initially created; otherwise, it will not be approved.
- 3 Expect the mandate's status to transition to "approved" within a timeframe of 1 minute.
- 4 It takes 24 hours to become fully functional for both debits (variable and fixed) and balance inquiries.

#### Global Standing Mandate (GSM)

##### Overview

Global standing mandate (GSM) or Multiple Account Direct Debit enables payments to be deducted from any linked accounts with sufficient balance. If the primary mandated account lacks adequate funds, the system automatically attempts to collect the repayment from those linked accounts.

The setup of the direct debit is almost instant for personal accounts, allowing you to provide immediate loan disbursement. For company accounts, the process waits for bank approval after the mandate is signed.

**Note:** The cost to establish GSM is N500, with a debit fee of 1% per transaction, capped at N1,000. Ensure your [wallet](https://support.mono.co/en/articles/7108842-how-do-i-fund-my-wallet) has sufficient funds to cover the setup fees.

##### Process

- Your customer selects their bank type then proceeds to provide their account number, after which they then choose their type of account, which determines the verification flow. For a company account, only signatures are used for authorization.
- The customer enters their Bank Verification Number (BVN) and date of birth. If these details are verified, the process moves to the next step.
- In this step, an OTP is sent to the customer's phone or email to confirm all bank accounts linked to their BVN. Mono then sets up a signed mandate using the customer signature from step 4 on all the accounts except the main one entered in step 1.
- The customer confirms the loan terms (e.g., amount, validity) and provides their signature to authorize the recovery of the loan from all their accounts if the main account is not funded.
- For customers using either personal and business accounts, note that they will be asked to send 50N to a NIBSS designated account to complete the mandate setup after which a success screen is displayed, and a webhook is sent to your webhook URL.
- The setup of the direct debit is instant for personal accounts, allowing immediate loan disbursement. For company accounts, the process waits for bank approval after the mandate is signed.

### Choosing the Right Mandate Type

It's essential to consider your specific requirements when selecting a mandate type:

#### Signed mandate:

- Longer approval process. (1 hour - 72 hours, depending on the bank)
- Works with Retail, Joint and Corporate bank accounts
- Instantly ready for debiting and balance inquiries after bank approval.

#### E-mandate:

- Faster approval process. (1–2 minutes)
- Works with Retail and Corporate bank accounts
- A 1 hour maximum waiting period after approval before debiting and balance inquiries is possible.

#### Global Standing Mandate (GSM):

- Works with Retail and Corporate bank accounts
- For the linked accounts to a created gsm mandate, approval can be within (1 hour - 72 hours) depending on the bank.

Mandate Debit Limits

The maximum daily debit limits for personal account and corporate accounts are shown below:

- **Minimum Amount:** 200 Naira
- **Maximum Amount for Personal Accounts:** 25 million Naira
- **Maximum Amount for Corporate Accounts:** 250 million Naira

These limits ensure a secure and reliable processing of debit transactions and mandates through our platform. Make sure to adhere to these constraints when initiating debits via the API endpoints. This may vary based on business model.

## **Mandate Terminologies**

This section details the various statuses a mandate can assume throughout its lifecycle, from initiation to completion or cancellation.

| Terminolgy             | Meaning                                                                                                                          |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Initiated              | The mandate has been created but not yet authorized                                                                              |
| Awaiting Authorization | The mandate is created and pending authorization via the widget                                                                  |
| Authorized             | The mandate has been sent to the bank for approval                                                                               |
| Approved               | The mandate authorization transfer has been completed successfully, and the mandate is approved                                  |
| Rejected               | The bank has rejected the mandate. This could be due to a discrepancy in information, signature or lack of customer consent.     |
| Suspended              | The mandate has been temporarily paused by the partner                                                                           |
| Cancelled              | The mandate has been canceled by the business or due to an issue such as a failed transfer or NIBSS downtime preventing approval |

## **Error Messages**

This section details common error messages encountered during mandate setup, both via the widget and API endpoints, along with their corresponding explanations and solutions.

| Error Message                                                                | Meaning                                                                            | Action                                                     |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| The start date provided is already in use for an existing mandate associated | This means that there is a mandate on the account number with the same start date. | Select a different date in the future for the new mandate. |
| with this account number. Please choose a different start date and try again |                                                                                    |                                                            |
| Mandate reference already exists                                             | This means that the reference has been used previously.                            | Retry with a unique mandate reference.                     |

### Bank Coverage

Supported banks

- FIRST BANK OF NIGERIA PLC
- UNION BANK OF NIGERIA PLC
- GUARANTY TRUST BANK PLC
- ACCESS BANK PLC
- ZENITH INTERNATIONAL BANK PLC
- ECOBANK Plc
- FIDELITY BANK PLC
- FIRST CITY MONUMENT BANK PLC
- GLOBUS BANK LTD
- JAIZ Bank
- KEYSTONE BANK PLC
- POLARIS BANK LIMITED
- PROVIDUS BANK
- STANBIC IBTC BANK LTD
- STANDARD CHARTERED BANK PLC
- STERLING BANK PLC
- SUNTRUST BANK
- TAJ BANK LTD
- TITAN TRUST BANK
- UNITED BANK for AFRICA PLC
- UNITY BANK PLC
- WEMA BANK

### Pricing

Please ensure that your Mono wallet on the dashboard has sufficient funds to cover any applicable fees that will be debited. Additionally, transaction fees will be deducted prior to settlement.

| Action                                                    | Fee                                                                                                      |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Transaction fee                                           | All Transactions between NGN 200 and NGN 20,000 will be charged a minimum fee of NGN 65 per transaction. |
|                                                           | While transactions above NGN 20,000 will be charged at 1% capped at NGN 1000 per transaction.            |
| Balance Inquiry with balance                              | NGN 100, charged from your Mono Wallet                                                                   |
| Balance Inquiry without balance                           | NGN 20, charged from your Mono Wallet                                                                    |
| Global Standing Mandate (GSM) Setup Cost                  | NGN 500 setup fee                                                                                        |
| Separate charge of NGN 50 for successful mandates created | No longer applies                                                                                        |

### Note

- Transaction fees are deducted from the transaction amount.

### Settlement Options

You have two settlement methods to choose from:

1.  Instant Settlement: Funds are transferred to your designated beneficiary account immediately after a successful debit. When the fee_bearer option is enabled, the transaction fee is also included in this immediate settlement to your account. Your business is then responsible for refunding the fee amount upon receipt of the monthly invoice.
2.  Next-day Settlement: All successful debits are settled in your bank account on the following business day.

### Important Information

For partners who want instant and direct settlement:

- Instant settlement is only available to Select Businesses. Please contact `sales@mono.co` to enable this feature for your business.
- Fund your wallet on the Mono Partners Dashboard to enable Mono to charge the fees (Global Standing Mandate + transaction fee).
- Alternatively, if you want an invoicing system for the fees, please contact `support@mono.co` to request an invoicing system, where we bill you monthly for the fees.

### FAQs

##### Can I have multiple mandates on a single account?

Yes, you can set multiple mandates on a single account, but you need to wait for approval on one mandate before you set a new one. Mandates for the same account can have the same amount and type but they should not have the same start date.

##### How do we track the status of the Direct Debit?

We send webhooks as well as provide status endpoints for you to track the mandate and debit operations

##### How long does it take a mandate to be approved

This depends on the authorization method and varies from bank to bank:

1.  For E-Mandates: 1 minute
2.  For Signed mandate: 1 hour - 72 hours (depending on the bank).
3.  For GSM, 1 hour - 72 hours depending on the bank for each linked accounts to a mandate.

##### What's a waiting period?

Once the user has authorized the e-mandate and it has been approved by the bank, there is a waiting period (24 hours) associated with the approved mandate during which debiting or conducting balance inquiries on the customer's bank account is not permitted. However, for a signed mandate, there is no waiting period in place.

Please note, the transfer to authorize the mandate should be done within 1 hour of the mandate creation. The mandate is automatically canceled after 6 hours if unauthorized or unapproved.

##### Is there a limit on the number of times the partner can debit the user account

No, the limit only applies to the maximum debit amount set during mandate creation

##### Can the user cancel the debit

Yes, our mandate action endpoint allows you to cancel, pause and reinstate a mandate

##### Is there a limit on the total amount that can be debited

A maximum amount of NGN 200M

##### Who does the NGN 50 on mandate creation go to?

The payer transfers it to NIBSS as authorization.

##### Do I need to fund my Mono Dashboard wallet to use this service

You only need to fund when using instant settlement or the Global Standing Mandate

##### What if I don’t include the `fee_bearer` field?

The fee will be charged to your business by default.

##### Can I pass charges on an existing mandate?

Yes, you can. This means you can deduct the charges from existing mandates, once the fee_bearer field is passed on the debit endpoint.

## Direct Debit Integration Guide

Last updated May 8th, 2024

### Introduction

Welcome to the Mono Direct Debit Integration Guide, designed to assist developers in seamlessly incorporating the Mono Direct Debit (MDD) APIs into their applications. This comprehensive guide provides step-by-step instructions, enabling you to leverage these resources for direct debit purposes.

### Prerequisites

Before you begin, make sure to complete the following essential steps:

- Register on the Mono dashboard. You can find a detailed guide [here](https://support.mono.co/en/articles/4614335-signing-up-on-mono).
- Create an application with the product specified as "Payments" and obtain the associated secret key. Refer to the guide [here](https://support.mono.co/en/articles/8712310-how-to-create-an-app-directpay) for assistance.

Re: Sandbox/Test Enviroment

- Kindly note that to test Direct Debit in sandbox you simply need to pass your test keys in the headers of your request. You can find the test keys on your dashboard as shown by [this guide](https://support.mono.co/en/articles/7066615-what-are-public-and-secret-keys).
- We also send test webhooks in sandbox to simplify your integration experience.
- The credentials passed for testing Direct debit are random credentials.
- When the create a mandate endpoint is used to setup a mandate in sandbox, the mandate is automatically approved. No transfer is needed.

Mandate Endpoints

We currently support two endpoints for setting up a mandate. You can choose either of them depending on your integration preferences

- [Create-mandate endpoint](https://docs.mono.co/api/direct-debit/mandate/create-a-mandate): This allows you to customise the initial mandate setup experience for your users.
- [Initiate-mandate-link endpoint](https://docs.mono.co/api/direct-debit/mandate/initiate-mandate-authorisation): This generates a link to widget for your users to complete the mandate setup process.

### Integration Guide

After satisfying the prerequisites outlined above, you'll navigate through three key stages to successfully integrate the Mono Direct Debit functionality into your application:

1.  Customer Profile Creation:  
    In this initial stage, you will establish a customer profile by providing basic KYC (Know Your Customer) information. This includes details such as the customer's first name, last name, phone number, and BVN (Bank Verification Number).
2.  Bank Mandate Setup:  
    In this step, you'll configure a Fixed or Variable on the customer's bank account. This Fixed or Variable mandate can be authorized as either a signed mandate or e-mandate or global standing mandate (gsm). Each mandate creation/setup is a one-time authorization process, simplifying subsequent debit transactions.
3.  Debiting Bank Accounts:  
    With everything in place, you can initiate direct debit transactions from a customer's account at your convenience. Simply provision the necessary details, including the amount, reference, and narration.

Re: Debiting an Account

Please take note that the third step - **Debit an Account** is only necessary for Variable Mandates. The debits for fixed mandates are scheduled when creating the mandate and automatically debited from the customer's account on the set date.

By following these stages, you'll seamlessly integrate Mono Direct Debit capabilities into your application, providing efficient direct debit services to your users.

## Step 1: Create a Customer

Last updated October 23rd, 2025

Before a Direct Debit mandate can be set up on an account, it is important to create a Customer profile. Creating a customer requires the user's first name, last name, phone number, bvn, house address and email.

Re: Mandates on Business Accounts

Kindly note that when creating a customer/mandate for a **business account**, you need to pass in the business name split as first name & last name. Also, the KYC identity type - BVN must belong to one of the shareholders of the company.

To create a Customer, send a POST request to the following endpoint:

### Request

```js
  POST https://api.withmono.com/v2/customers
```

1. Creating an Individual Customer

#### Request Body Parameters

| Field                      | Description                                                                     |
| -------------------------- | ------------------------------------------------------------------------------- |
| email (required)           | The email of the customer.                                                      |
| firstName (required)       | The first name of the customer.                                                 |
| lastName (required)        | The last name of the customer.                                                  |
| address (required)         | The house address of this customer (Maximum of 100 characters)                  |
| phone (required)           | The phone number of this customer.                                              |
| identity.type (required)   | The KYC identity type of the user should be "bvn".                              |
| identity.number (required) | The BVN identity number associated with the customer. (No white spaces allowed) |

### Request

```js
const axios = require("axios");

const options = {
  method: "POST",
  url: "https://api.withmono.com/v2/customers",
  headers: { accept: "application/json", "content-type": "application/json" },
  data: {
    identity: {
      type: "bvn",
      number: "09876543212",
    },
    email: "samuelolamide@gmail.com",
    first_name: "Samuel",
    last_name: "Olamide",
    address: "Agungi, Lagos",
    phone: "08012345678",
  },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Success Response

If the initiation request is successful, you will receive the following response:

```json
{
  "status": "successful",
  "message": "Created customer successfully",
  "data": {
    "id": "6578295bbf09b0a505123456",
    "name": "Samuel Olamide",
    "first_name": "Samuel",
    "last_name": "Olamide",
    "email": "samuelolamide@gmail.com",
    "phone": "08012345678",
    "address": "Agungi, Lagos",
    "identification_no": "0123456789",
    "identification_type": "bvn",
    "bvn": "0123456789"
  }
}
```

2. Creating a Business Customer

#### Request Body Parameters

| Field                      | Description                                                                 |
| -------------------------- | --------------------------------------------------------------------------- |
| email (required)           | The email of the customer.                                                  |
| type (optional)            | The entity type i.e. business.                                              |
| business_name (required)   | The name of the business.                                                   |
| address (required)         | The office address of this business.                                        |
| phone (required)           | The primary contact number of the business.                                 |
| identity.type (required)   | The KYC identity type of the user should be "bvn".                          |
| identity.number (required) | The BVN identity number associated with one of the businesses shareholders. |

### Request

```js
const axios = require("axios");

const options = {
  method: "POST",
  url: "https://api.withmono.com/v2/customers",
  headers: { accept: "application/json", "content-type": "application/json" },
  data: {
    identity: {
      type: "bvn",
      number: "12461501556",
    },
    email: "business@example.com",
    type: "business",
    business_name: "Example Business",
    address: "123 Business St, Business City",
    phone: "08012345678",
  },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Success Response

If the initiation request is successful, you will receive the following response:

```json
{
  "status": "successful",
  "message": "Created customer successfully",
  "data": {
    "id": "66806d2d5aac",
    "type": "business",
    "business_name": "Nomo Global Systems",
    "email": "only@nomo.co",
    "phone": "01042658500",
    "address": "1 Nomo Street, Yaba ",
    "identification_no": "12461501556",
    "identification_type": "bvn",
    "bvn": "12461501556"
  }
}
```

Other API actions that can be taken when managing your customer include:

- Updating a Customer [🔗](https://docs.mono.co/api/customer/update-a-customer)
- Retrieving a customer [🔗](https://docs.mono.co/api/customer/retrieve-a-customer)
- Listing all Customers [🔗](https://docs.mono.co/api/customer/list-all-customers)
- Delete a Customer [🔗](https://docs.mono.co/api/customer/delete-a-customer)

## Step 2: Setup bank mandate

Last updated Oct 24, 2025

As a partner, you can set up a mandate on either personal accounts or business accounts using the two authorisation types: E-mandate and Signed mandate. Select your preferred method for initiating mandates from the available endpoints.

Mandate Initiation Endpoints

- [Create mandate endpoint](https://docs.mono.co/api/direct-debit/mandate/create-a-mandate): This allows you to customise the initial mandate setup experience for your users.
- [Initiate mandate link endpoint](https://docs.mono.co/api/direct-debit/mandate/initiate-mandate-authorisation): This generates a link to widget for your users to complete the mandate setup process.

More information on mandate authorization types:

i. **E-mandate**: This mandate type utilizes designated authorization transfer accounts (including Fidelity, Paystack-Titan, and Parallex accounts) to facilitate the Direct Debit e-mandate creation process. The N50 charged for this process can't be **modified**, this fee goes to NIBSS.

Banks charging minimum of N100 for mandate approval

Certain bank apps have a minimum transfer amount of N100, hence, users will not be able to transfer N50 for authorization for the following banks:

- Unity Bank
- Union Bank
- Standard Chartered Bank
- Ecobank

### **E-Mandate Flow**

1.  Mandate is created → **Awaiting Authorization**
2.  User opens the link and starts the authorization process → **Initiated**
3.  Mandate authorization transfer has been successfully completed → **Approved**
4.  Mandate authorization transfer failed or there was a downtime affecting approvals → **Cancelled**

Image E-mandate flow

ii. **Signed mandate**: On the other hand, for a signature mandate, the user must provide a signature for approval, and the payer's bank typically contacts the payer to confirm the mandate's approval.

#### **Physical Signed Mandate Flow**

1.  Mandate form is uploaded → **Initiated**
2.  Mandate has been sent to the bank for processing → **Authorized**
3.  Mandate has been approved by the bank → **Approved**
4.  Mandate has been rejected by the bank → **Rejected**

Image Physical Signed Mandate Flow

#### **Digital Signed Mandate Flow**

1.  Mandate is created → **Awaiting Authorization**
2.  User opens the link and starts the authorization process → **Initiated**
3.  Mandate has been sent to the bank for processing → **Authorized**
4.  Mandate has been approved by the bank → **Approved**
5.  Mandate has been rejected by the bank → **Rejected**

Digital Signed Mandate Flow

Re: E-mandates

- It's important to note that the account the E-mandate is being set up on MUST be used for the ₦50 funding. This funding acts as the customer's approval of the mandate. If the user fails to send the ₦50 the mandate will be inactive and unapproved.
- Your customer can choose either Fidelity, Parallex or Paystack-Titan accounts as the authorization transfer accounts when creating Direct Debit e-mandates. This bank accounts are returned in the transfer_destinations field under the data objects.
- Note that the ₦50 transfer must come from the bank account that requires mandate setup.
- The user must send the ₦50 money within 1 hour, else the mandate will be cancelled and they have to create another mandate again.
- When such mandate is cancelled, the mandate cancelled event ([events.mandate.action.cancel](https://docs.mono.co/docs/payments/direct-debit/webhook-events)) is sent with the reason for cancellation included in the response.

Ready to Debit Status

After sending NGN 50 to the NIBSS-designated account, the mandated account enters the "ready-to-debit" status within approximately 24 hours. This reduces debit failures.

A [ready-to-debit webhook event](https://docs.mono.co/docs/payments/direct-debit/webhook-events) confirms when the account is ready for debiting.

**Example**: A mandate approved at 4:00 PM will be ready for debiting by 4:00 PM the next day. Mandates approved on Friday will be ready for debiting on the following Monday.

Debit Types & Amount

**Variable**: The `amount` represents the total funds a business plans to collect from a customer over the mandate period. Individual debit amounts can vary within this total limit.

**Fixed**: The `amount` specifies the exact amount to be debited per transaction. The total debit is automatically calculated based on this fixed amount. Once set during mandate authorization, this amount cannot be modified.

NIBSS Code

Every mandate returns a NIBSS code is generated by NIBSS. This can be used to track mandates in cases that require further investigation

To set up a mandate on the customer's bank account, send a POST request to the following endpoint:

### Request

```js
  POST https://api.withmono.com/v2/payments/initiate
```

## Step 2 (Option A): Variable bank mandate

Last updated June 11th, 2025

Variable recurring mandate is an ideal option for businesses looking to collect a varied amount from their customers based on a set total debit for a period of time. For example, you authorise a mandate `amount` of ₦200,000 for 6 months which can debited in varied amounts and time.

### Request Body Parameters

Using the customer ID (which is returned in the previous step) the next step is to create a mandate on an account belonging to this customer. To do this, a partner will need to provide the following information:

| Field                   | Description                                                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| amount (required)       | This is the maximum amount to be debited from the user’s account throughout the mandate (i.e from start to end date). NGN 200 (20000 kobo). |
| type (required)         | This expects a string value i.e recurring-debit.                                                                                            |
| method (required)       | This field expects a string value i.e mandate.                                                                                              |
| mandate_type (required) | This can either be signed or emandate or gsm.                                                                                               |
| debit_type (required)   | This field expects the type of debit i.e variable                                                                                           |
| description (required)  | This field expects a description of the set mandate.                                                                                        |
| reference (required)    | This expects a unique reference ID for this particular reference.                                                                           |
| start_date (required)   | This expects the start date for this mandate to begin. e.g. 2024-12-15                                                                      |
| end_date (required)     | This expects the end date for this mandate to end. e.g. 2024-05-25                                                                          |
| customer                | This expects the the customer id as seen in the response [here](https://docs.mono.co/api/customer/create-a-customer)                        |
| meta (object)           | This object used to include additional payment information. e.g meta                                                                        |

### Sample Request: For Variable E-Mandate/Signed Mandate

```js
const axios = require("axios");

const options = {
  method: "POST",
  url: "https://api.withmono.com/v2/payments/initiate",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
    "mono-sec-key": "string",
  },
  data: {
    amount: 9190030,
    type: "recurring-debit",
    method: "mandate",
    mandate_type: "emandate", // or "signed" or "gsm"
    debit_type: "variable",
    description: "Repayment for samuel@neem.com",
    reference: "test-O2b9O9EF903-949493432",
    redirect_url: "https://mono.co",
    customer: {
      id: "65eb623b0000900009e5c1f21cd",
    },
    start_date: "2024-03-29",
    end_date: "2024-08-04",
    meta: {},
  },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Success Response

If the emandate, signed or gsm request has been initiated successfully, you will receive the following response:

```json
{
  "status": "successful",
  "message": "Payment Initiated Successfully",
  "data": {
    "mono_url": "https://authorise.mono.co/RD3044259",
    "mandate_id": "mmc_682b977203c0b7360787b46g",
    "type": "recurring-debit",
    "method": "mandate",
    "mandate_type": "emandate", // or "signed" or "gsm"
    "amount": 9190030,
    "description": "Repayment for samuel@neem.com",
    "reference": "test-O2b9O9EF903-949493432",
    "customer": "65eb623b0000900009e5c1f21cd",
    "redirect_url": "https://mono.co",
    "created_at": "2024-03-12T14:17:31.548Z",
    "updated_at": "2024-03-12T14:17:31.548Z",
    "start_date": "2024-03-19",
    "end_date": "2024-08-04"
  }
}
```

Mandate Webhooks

Upon successful creation, rejection, or approval of a mandate, different webhooks are triggered based on the specific scenario. Explore [this](https://docs.mono.co/docs/payments/direct-debit/webhook-events) resource for more details on the diverse webhook workflows.

N.B On Mandate Creation

Please take note that for the successful creation of a direct debit mandate, it is essential that the Customer Name and Account Name match accurately.

Re: Debits by Variable Mandate

Please note that since there is no fixed schedule for debiting an account for **Variable Mandates**, each debit must be triggered via the API, following the instructions in **Step 3: Debit an Account**.

## Step 2 (Option B): Fixed bank mandate

Last updated June 11th, 2024

The fixed recurring mandate is an ideal option for businesses looking to collect a consistent amount from their customers for a set period. The fixed debit type handles recurring debits using our internal schedulers. For example, you authorise a mandate `amount` of ₦10,000 to debited monthly for twelve months which will automatically totalled and calculated by our systems as ₦120,000.

Re: Debits by Fixed Mandate

Please take note that the debits for **fixed mandates** are scheduled when creating the mandate and automatically debited from the customer's account on the set date. The "Debit Account API endpoint" is not supported for a fixed mandate type.

### Request Body Parameters

Using the customer ID (which is returned in the previous step) the next step is to create a mandate on an account belonging to this customer. To do this, a partner will need to provide the following information:

| Field                         | Description                                                                                                                                                                                        |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| amount (required)             | This is the fixed amount to be debited from the user’s account throughout the mandate (i.e from start to end date). NGN 200 (20000 kobo).                                                          |
| type (required)               | This expects a string value i.e recurring-debit                                                                                                                                                    |
| method (required)             | This field expects a string value i.e mandate.                                                                                                                                                     |
| mandate_type (required)       | This can either be signed or emandate or gsm.                                                                                                                                                      |
| debit_type (required)         | This field expects the type of debit i.e fixed                                                                                                                                                     |
| description (required)        | This field expects a description of the set mandate.                                                                                                                                               |
| reference (required)          | This expects a unique reference ID for this particular reference.                                                                                                                                  |
| start_date (required)         | This expects the start date for this mandate to begin. e.g. 2024-12-15                                                                                                                             |
| end_date (required)           | This expects the end date for this mandate to end. e.g. 2024-05-25                                                                                                                                 |
| frequency (required)          | This expects the frequency of the debit `daily` , `weekly` , `monthly` and `yearly`. For custom -frequencies use `days`, `weeks`, `months` and provide an whole number value in the interval field |
| interval                      | This expects any whole number (e.g. 1, 5) as it's only required when `days`, `weeks`, `months` are set as the frequency                                                                            |
| retrial_frequency (required)  | This expects the number of retries on a particular debit date [ Minimum is 1 & Maximum is 6 ]. For example, a customer’s debit date is 2023-03-04,                                               |
|                               | but the initial debit failed, the `retrial_frequency` keeps retrying the transaction for the number of times specified at mandate creation.                                                        |
| initial_debit_date (required) | This expects the first day/date to debit the mandate account. Must be greater than `start_date`                                                                                                    |
| initial_debit_amount          | This expects the initial amount to debit on the `initial_debit_date`                                                                                                                               |
| grace_period (required)       | This expects the number of days to continue debiting an account before setting the next debit date to next frequency date                                                                          |
| minimum_due (required)        | This expects an amount in a case of failed debits due to insufficient funds, the minimum_due is attempted i.e anything you can find, give debit                                                    |
| customer                      | This expects the customer id as seen in the response [here](https://docs.mono.co/api/customer/create-a-customer)                                                                                   |
| meta (object)                 | This object used to include additional payment information. e.g meta                                                                                                                               |

### Sample Request: For Fixed E-Mandate or Signed Mandate

```js
const axios = require("axios");

const options = {
  method: "POST",
  url: "https://api.withmono.com/v2/payments/initiate",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
    "mono-sec-key": "string",
  },
  data: {
    type: "recurring-debit",
    debit_type: "fixed",
    customer: {
      id: "6629259fe903b1",
    },
    mandate_type: "emandate", // or "signed" or "gsm"
    amount: 200000,
    reference: "nomo-test-24-04-24-02",
    description: "nomo Mandate Test",
    start_date: "2024-04-29",
    end_date: "2024-05-30",
    redirect_url: "https://mono.co",
    retrial_frequency: 1,
    frequency: "weekly", // monthly, weekly, daily
    initial_debit_date: "2024-04-30",
    grace_period: 6,
    minimum_due: 20000, // if we are unable to debit the main amount, this minimum due is what we can collect from the account
    initial_debit_amount: 30000, // After the approval of the mandate, this is the first debit (OPTIONAL)
    meta: {},
  },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Success Response

If the emandate or signed or gsm request has been initiated successfully, you will receive the following response:

```js
{
    "status": "successful",
    "message": "Payment Initiated Successfully",
    "data": {
        "mono_url": "https://authorise.mono.co/RD9152019674",
        "mandate_id": "mmc_682b9a48868508ef6f37a880",
        "type": "recurring-debit",
        "mandate_type": "emandate", // or "signed" or "gsm"
        "amount": 200000,
        "description": "nomo Mandate Test",
        "reference": "nomo-test-24-04-24-02",
        "customer": "6629259fe903b1",
        "redirect_url": "https://mono.co",
        "created_at": "2024-04-24T17:44:17.833Z",
        "updated_at": "2024-04-24T17:44:17.833Z",
        "start_date": "2024-04-29",
        "end_date": "2024-05-30"
    }
}
```

Mandate Webhooks

Upon successful creation, rejection, or approval of a mandate, different webhooks are triggered based on the specific scenario. Explore [this](https://docs.mono.co/payments/direct-debit/webhook-events) resource for more details on the diverse webhook workflows.

Custom Frequencies

If you need to configure custom frequencies for a fixed mandate beyond the standard daily, weekly, bi-weekly, monthly, and yearly options, you can use `days`, `weeks`, or `months` as the frequency.

You can then set any whole number (e.g., 1, 5) in the interval field to specify the frequency.

N.B On Mandate Creation

Please take note that for the successful creation of a direct debit mandate, it is essential that the Customer Name and Account Name match accurately.

## Global Standing Mandate Guide

Last updated Oct 24, 2025

### Overview

The Global Standing Mandate (GSM) lets you recover funds from any BVN-linked account that has enough balance. If the primary mandated account does not have sufficient funds, the system automatically attempts collection from other linked accounts. The order in which the linked accounts are attempted is not guaranteed.

Prerequisites

To get started, you need to:

- [Sign up](https://app.mono.co/signup) on the Mono Dashboard and complete KYC.
- [Create an app](https://docs.mono.co/docs/create-app) with the `payments` scope and retrieve the secret key.
- Configure a webhook URL in your dashboard to receive webhook event notifications. This [guide](https://docs.mono.co/docs/webhooks) will help you set up a webhook properly.

### How it works

Setting up a GSM involves four key stages:

1.  **Mandate initiation**: Specify the mandate type when you launch the Direct Debit widget by setting `mandate_type` to `gsm`.
2.  **Customer setup and confirmation**: The customer confirms their bank account and verifies their BVN with date of birth. The customer also uploads their signature and sends NGN 50 to a NIBSS-designated account to complete the mandate setup.
3.  **Monitor mandate status**: Check when linked accounts are approved and ready to debit.
4.  **Funds collection**: Debit funds from the primary account or linked accounts based on your mandate type (fixed or variable).

GSM setup and transaction costs

- Setup fee: NGN 500 per GSM setup.
- Debit fee: 1% per successful debit, capped at NGN 1,000.

**Wallet funding:** Ensure your wallet can cover setup fees. See [how to fund your wallet](https://support.mono.co/en/articles/7108842-how-do-i-fund-my-wallet).

### Step 1: Mandate initiation

Initiate the Global Standing Mandate via the [Initiate a Mandate API](https://docs.mono.co/api/direct-debit/mandate/initiate-mandate-authorisation). Ensure the `mandate_type` is set to `gsm`.

GSM supports both fixed and variable debit types:

1.  **Fixed GSM**: This is best when you want Mono to automatically debit the primary account and linked accounts with sufficient balances on a consistent schedule. Learn how to initiate a fixed GSM mandate [here](https://docs.mono.co/docs/payments/direct-debit/mandate-setup-fixed).
2.  **Variable GSM**: This is used when you want to trigger debits on your schedule via the Debit Account [API](https://docs.mono.co/api/direct-debit/account/debit-account). Learn how to initiate a variable GSM [here](https://docs.mono.co/docs/payments/direct-debit/mandate-setup-variable).

Use the Initiate a Mandate API

To set up GSM, you must use the [Initiate a Mandate API](https://docs.mono.co/api/direct-debit/mandate/initiate-mandate-authorisation). The Create a Mandate API does not support GSM and will fail for GSM setups.

The API response includes a `mono_url` which you will use to redirect the user to the Mono mandate widget, where they can add additional details to complete the process.

### Response

```js
{
    "status": "successful",
    "message": "Payment Initiated Successfully",
    "data": {
        "mono_url": "https://authorise.mono.co/RD9152019674",
        "mandate_id": "mmc_682b977203c0b7360787b460",
        "type": "recurring-debit",
        "mandate_type": "gsm",
        "amount": 200000,
        "description": "GSM Test",
        "reference": "nomo-test-24-04-24-02",
        "customer": "6629259fe903b1",
        "redirect_url": "https://mono.co",
        "created_at": "2024-04-24T17:44:17.833Z",
        "updated_at": "2024-04-24T17:44:17.833Z",
        "start_date": "2024-04-29",
        "end_date": "2024-05-30"
    }
}
```

### Step 2: Customer setup and confirmation

After initiating the mandate, a `mono_url` is returned in the response. Your customer uses this URL to confirm and authorize the mandate. Here's the flow the customer would take to complete the process:

- **Account linking**: Choose bank, enter account number, and select account type (Personal or Business).
- **Identity verification**: Enter BVN, then input the OTP sent to their phone to verify it. The Date of birth associated with the BVN is required to complete verification.
- **Confirm mandate terms**: Confirm and agree to the mandates terms such as amount, duration, etc.
- **Signature upload**: Upload or scan a signature to authorize the direct debit and approve other BVN-linked accounts.
- **Ownership validation**: Send NGN 50 to the NIBSS-designated account displayed on screen. A webhook is sent to your URL after confirmation, which approves the primary account.

Mandate approval timeline

Once the NGN 50 payment is confirmed, primary account approval typically completes within 1–3 minutes (e-mandate). Linked account approvals usually complete within 1–72 hours depending on the bank.

### Step 3: Monitor mandate status

Before you can collect funds, the GSM must be ready to debit. This is indicated by the `events.mandates.ready` webhook [event](https://docs.mono.co/docs/payments/direct-debit/webhook-events), which is sent after a 24-hour waiting period.

You can also check which accounts have been linked to the mandate and their `ready_to_debit` statuses via API.

#### Fetch linked mandates

Use the [Retrieve a Mandate](https://docs.mono.co/api/direct-debit/mandate/retrieve-a-mandate) API with the mandate ID to see linked mandates and statuses. You can also view them on the Mono dashboard.

### Request

```js
const axios = require("axios");

const options = {
  method: "GET",
  url: "https://api.withmono.com/v3/payments/mandates/mmc_66b513c139a0229aa1234567",
  headers: {
    accept: "application/json",
    "mono-sec-key": "live_sk_your_secret_key",
  },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### Response

```js
{
  "status": "successful",
  "message": "request completed successfully",
  "data": {
    "id": "mmc_66b513c139a0229aa1234567",
    "status": "initiated",
    "reference": "Reference0000012345",
    "amount": 50600,
    "balance": 50600,
    "mandate_type": "gsm",
    "debit_type": "variable",
    "account_name": "SAMUEL OLAMIDE",
    "account_number": "2212345678",
    "live_mode": true,
    "approved": false,
    "ready_to_debit": false,
    "nibss_code": "RC012345/4321/098765432",
    "institution": {
      "bank_code": "033",
      "nip_code": "000004",
      "name": "UNITED BANK FOR AFRICA PLC"
    },
    "customer": "66b1ef9f1a0fe7906d35432a",
    "narration": "Repayment for samuel olamide",
    "redirect_url": "https://mono.co",
    "linked_mandates": [
      {
        "account_name": "SAMUEL OLAMIDE",
        "account_number": "2099999999",
        "bank": "ZENITH INTERNATIONAL BANK PLC",
        "ready_to_debit": false
      },
      {
        "account_name": "SAMUEL OLAMIDE",
        "account_number": "0788888888",
        "bank": "ACCESS BANK PLC",
        "ready_to_debit": false
      },
      {
        "account_name": "SAMUEL OLAMIDE",
        "account_number": "3044444444",
        "bank": "POLARIS BANK",
        "ready_to_debit": false
      },
      {
        "account_name": "SAMUEL OLAMIDE",
        "account_number": "2012132923",
        "bank": "Globus Bank",
        "ready_to_debit": false
      },
      {
        "account_name": "SAMUEL OLAMIDE",
        "account_number": "8292910291",
        "bank": "FIRST CITY MONUMENT BANK PLC",
        "ready_to_debit": false
      }
    ],
    "total_linked_mandates": 5,
    "start_date": "2024-08-09T00:00:00.000Z",
    "end_date": "2024-10-30T00:00:00.000Z",
    "date": "2024-08-08T18:51:45.770Z"
  }
}
```

### Step 4: Funds collection

Once the mandate is ready to debit (confirmed via the `events.mandates.ready` webhook), you can begin collecting funds. Mono debits the agreed amount from the primary account first. If the account doesn't have sufficient balance, the system automatically attempts the debit on an approved linked account.

#### Debit actions

- **Fixed GSM**: Mono automatically runs debits on the primary and linked accounts based on the schedule you provided when you [initiated the mandate](https://docs.mono.co/docs/payments/direct-debit/mandate-setup-fixed). Track processed debits via the Retrieve all Debits [API](https://docs.mono.co/api/direct-debit/account/retrieve-all-debits) or on the Mandates History tab in the dashboard [here](https://app.mono.co/mandates/).
- **Variable GSM**: You trigger debits on your schedule by calling the Debit Account API as described [here](https://docs.mono.co/docs/payments/direct-debit/debit-an-account) under Debiting the account.

Debiting linked accounts

Mono attempts the primary account first. If the balance is insufficient, GSM checks for an approved linked account with adequate balance and debits it.

#### Webhook confirmation

On each successful debit, you will receive the `events.mandates.debit.successful` webhook.

### Request

```json
{
  "event": "events.mandates.debit.successful",
  "data": {
    "status": "successful",
    "message": "Account debited successfully.",
    "response_code": "00",
    "amount": 50000,
    "customer": "6570ee1115ddbc5528fea1c8",
    "mandate": "mmc_6571f4e55c7d1843d7d162e9",
    "reference_number": "Ah20141329b841234",
    "account_details": {
      "bank_code": "058",
      "account_name": "SAMUEL OLAMIDE",
      "account_number": "0123456789",
      "bank_name": "GUARANTY TRUST BANK PLC"
    },
    "beneficiary": {
      "bank_code": "000",
      "account_name": "Mono",
      "account_number": "P000001",
      "bank_name": "MONO SETTLEMENT WALLET"
    },
    "date": "2023-12-14T10:41:42.016Z",
    "app": "60cc8f95ba1772018c123456",
    "fee_bearer": "business",
    "business": "60cc8f95ba1772018c123456"
  }
}
```

## Biometric Verification for Direct Debit

Last updated November 28th, 2025

Biometric Verification is an alternative authorization method for Direct Debit mandates that uses real-time BVN validation + Face Match checks. When the feature is enabled for your business, customers verify their identity with a selfie and liveness check inside your product, and mandates are approved once the match succeeds.

Feature access

This flow is available on request. Please reach out to support team via support@mono.co for access, before calling the `create a mandate` API with `verification_method: "selfie_verification"`.

Key benefits:

- **Instant Approval:** Mandates auto-transition to `approved` once the face match succeeds.
- **In-platform experience:** Customers complete the selfie/liveness journey without leaving your mobile or web experience.
- **Secure & compliant:** BVN validation + Face Match runs against the BVN photo, reducing fraud and supporting faster onboarding.

## API Flow

1.  **Customer creation with BVN:** Before creating a mandate, call the [Create Customer](https://docs.mono.co/api/customer/create-a-customer) endpoint to capture the customer BVN so Mono can look up the associated image.
2.  **Mandate creation with `verification_method`:** Use the [Create a Mandate API](https://docs.mono.co/api/direct-debit/mandate/create-a-mandate) and send `verification_method: "selfie_verification"` to trigger Biometric Verification instead of the default transfer flow.
3.  **Face Match & liveness:** The customer follows the `mono_url` returned in the response, completes the selfie/liveness journey, and Mono compares the selfie against the BVN photo.
4.  **Mandate activation:** Once the match succeeds, the mandate status flips to `approved` and a `mandate approved` webhook fires. The mandate becomes available for debits after the `ready to debit` event is sent.

Configure `verification_method`

If you omit `verification_method`, the API falls back to `transfer_verification` and the ₦50 transfer path. The Biometric path requires `verification_method: "selfie_verification"` so you can include the returned `mono_url` in your UI and keep track of the chosen method via the `verification_method` field in the response data.

Track this entire verification flow inside your platform, handle `approved` statuses, and make sure your webhook consumers listen for both the `mandate approved` event and the `mandate ready` event before debiting.

## API flow breakdown

1.  **Create the customer record with BVN details.** Include the BVN when calling the [Create Customer](https://docs.mono.co/api/customer/create-a-customer) endpoint so Mono can fetch the BVN photo used in face matching.
2.  **Call the Create a Mandate API with biometric verification.** Send `verification_method: "selfie_verification"` and the standard mandate payload—Mono validates the BVN, ties the mandate to the customer, and returns the `mono_url` for the customer to complete the selfie + liveness experience.

### Request

```js
const axios = require("axios");

const options = {
  method: "POST",
  url: "https://api.withmono.com/v3/payments/mandates",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
    "mono-sec-key": "live_sk_your_secret_key",
  },
  data: {
    debit_type: "variable",
    customer: "string",
    mandate_type: "emandate",
    amount: 1000000,
    reference: "mandatevrif7l9d4",
    account_number: "2012345678",
    bank_code: "044",
    fee_bearer: "business",
    description: "Mono Test",
    start_date: "2025-11-27T00:00:00.000Z",
    end_date: "2026-12-31T22:59:59.999Z",
    verification_method: "selfie_verification",
    meta: {},
  },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

1.  **Customer completes the selfie + liveness journey.** Use the `mono_url` to render the verification experience, then wait for the callback/webhook indicating the mandate status changed to `approved`.
2.  **Mandate activated.** Upon success the mandate is approved automatically; the `mandate approved` webhook fires. The mandate only becomes eligible for debits after the `ready to debit` event is sent.

### Request

```json
{
  "status": "successful",
  "message": "Mandate created successfully",
  "data": {
    "id": "mmc_691d957a87120578aeb864af",
    "status": "initiated",
    "mandate_type": "emandate",
    "debit_type": "variable",
    "ready_to_debit": false,
    "mono_url": "https://develop.d25lmvlzvrkhwa.amplifyapp.com/RC227914%2F1580%2F0015154303",
    "nibss_code": "RC227914/1580/0015154303",
    "approved": false,
    "reference": "mandatevrif7l9d4",
    "account_name": "Samuel Olamide",
    "account_number": "2012345678",
    "bank": "Access Bank",
    "bank_code": "044",
    "customer": "691af11398baaa44e1567bde",
    "description": "Mono Test",
    "live_mode": true,
    "start_date": "2025-11-27T00:00:00.000Z",
    "end_date": "2026-12-31T22:59:59.999Z",
    "date": "2025-11-19T10:01:30.471Z",
    "amount": 1000000,
    "fee_bearer": "business",
    "verification_method": "selfie_verification"
  }
}
```

The response always includes the `verification_method` field so you can verify whether the biometric path or transfer path executed.

## Pricing

- **₦100** for Biometric Verification (charged to the business wallet).
- **₦50** for NIBSS mandate activation.

Charges

We charge both together when selfie verification path is used and they are both charged to the wallet when the mandate is approved.

## Direct Debit Webhook Events

Last updated Oct 7th, 2025

### Overview

Our Direct Debit webhook events are categorised based on the following :

1.  Mandate webhook events.
2.  Debit webhook events.

### 1. Mandate webhook events

These are webhooks that are triggered when some specific direct debit mandate actions have been taken. We have itemised them down below:

- Mandate created event.
- Mandate rejected event.
- Mandate approved event.
- Mandate ready-to-debit event.
- Mandate paused event.
- Mandate cancelled event.
- Mandate reinstated event.

##### a. Mandate-created event:

This webhook is sent when a direct debit mandate has been successfully created on your end.

### Request

```json
{
  "event": "events.mandates.created",
  "event_id": "65f9c4a2e1b123456789",
  "timestamp": "2023-12-14T10:41:42.016Z",
  "data": {
    "id": "mmc_664b428e362a3",
    "status": "initiated",
    "mandate_type": "emandate",
    "debit_type": "variable",,
    "ready_to_debit": false,
    "nibss_code": "RC/5008/4942090",
    "approved": false,
    "reference": "ZONO240520",
    "account_name": "Samuel Olamide",
    "account_number": "0100013078",
    "bank": "GTB TESTING",
    "customer": "664769512f321a8c",
    "description": "Mono TEST",
    "live_mode": false,
    "message": "The mandate has been successfully initiated and is awaiting
     customer approval. Once approved, you can begin debiting customers
     based on the agreed terms",
    "start_date": "2024-09-12T00:00:00.000Z",
    "end_date": "2024-12-25T00:00:00.000Z",
    "date": "2024-05-20T12:31:10.481Z",
    "amount": 200020,
    "fee_bearer": "business",
    "app": "662fd4468d1db5",
    "business": "60cc8f95bac5c6b1d"
  }
}
```

##### b. Mandate rejected event:

This webhook is triggered when a created direct debit mandate has been rejected.

### Request

```json
{
  "event": "events.mandates.rejected",
  "event_id": "65f9c4a2e1b123456789",
  "timestamp": "2023-12-14T10:41:42.016Z",
  "data": {
    "id": "mmc_65795ef187e8bc6f0c112345",
    "mandate_type": "emandate",
    "debit_type": "variable",
    "status": "rejected",
    "approved": false,
    "reference": "TPS-blablaba-03",
    "account_name": "SAMUEL OLAMIDE",
    "account_number": "0123456789",
    "bank": "ZENITH INTERNATIONAL BANK PLC",
    "customer": "60cc8f95ba1772018c123456",
    "description": "Mono subscriptions",
    "message": "Mandate was rejected by Bank",
    "start_date": "2023-12-13T00:00:00.000Z",
    "end_date": "2024-05-25T00:00:00.000Z",
    "date": "2023-12-13T08:36:17.114Z",
    "app": "60cc8f95ba1772018c123456",
    "business": "60cc8f95ba1772018c123456"
  }
}
```

##### c. Mandate approved event:

This webhook is triggered when a created direct debit mandate has been successfully approved.

### Request

```json
{
  "event": "events.mandates.approved",
  "event_id": "65f9c4a2e1b123456789",
  "timestamp": "2023-12-14T10:41:42.016Z",
  "data": {
    "id": "mmc_664b428362a3",
    "status": "approved",
    "mandate_type": "emandate",
    "debit_type": "variable",
    "ready_to_debit": false,
    "nibss_code": "RC/5008/4942090",
    "approved": true,
    "reference": "ZONO240520",
    "account_name": "Samuel Olamide",
    "account_number": "0100013078",
    "bank": "GTB TESTING",
    "customer": "664769512f321a8c",
    "description": "Mono TPS TEST",
    "live_mode": false,
    "message": "Mandate approved",
    "start_date": "2024-09-12T00:00:00.000Z",
    "end_date": "2024-12-25T00:00:00.000Z",
    "date": "2024-05-20T12:31:10.481Z",
    "amount": 200020,
    "fee_bearer": "business",
    "app": "662fd49468d1db5",
    "business": "60cc8f95c5c6b1d"
  }
}
```

##### d. Mandate ready-to-debit event:

This webhook is triggered when a mandate has been approved and the account is ready to be debitted.

### Request

```json
{
  "event": "events.mandates.ready",
  "event_id": "65f9c4a2e1b123456789",
  "timestamp": "2023-12-14T10:41:42.016Z",
  "data": {
    "id": "mmc_66476972650cb58",
    "status": "approved",
    "mandate_type": "emandate",
    "debit_type": "variable",
    "ready_to_debit": true,
    "nibss_code": "RC000014/1000/00026",
    "approved": true,
    "reference": "ZONO2349416",
    "account_name": "SAMUEL OLAMIDE",
    "account_number": "0100013078",
    "bank": "GUARANTY TRUST BANK PLC",
    "description": "Mono TEST",
    "message": "Mandate is now ready for debiting",
    "start_date": "2024-08-12T00:00:00.000Z",
    "end_date": "2024-12-25T00:00:00.000Z",
    "date": "2024-05-17T14:28:09.034Z",
    "amount": 200000,
    "fee_bearer": "business",
    "app": "662fd49d68d1db5",
    "business": "60cc8fc5c6b1d"
  }
}
```

##### e. Mandate paused event:

When a direct debit mandate has been paused, the webhook below is triggered.

### Request

```json
{
  "event": "events.mandate.action.pause",
  "event_id": "65f9c4a2e1b123456789",
  "timestamp": "2023-12-14T10:41:42.016Z",
  "data": {
    "mandate": "mmc_6571f4e55c7d1843d7d162e9",
    "status": "success",
    "response_code": "",
    "message": "This mandate is now paused and can't be used for
    debit or balance inquiry, but you can reinstate it back.",
    "timestamps": "2023-12-14T10:40:47.713Z",
    "documentation": "https://mono.co/docs/error-codes/400",
    "data": null,
    "app": "60cc8f95ba1772018c123456",
    "business": "60cc8f95ba1772018c123456"
  }
}
```

##### f. Mandate cancelled event:

This webhook is triggered when a created/approved direct debit mandate has been cancelled.

### Request

```json
{
  "event": "events.mandate.action.cancel",
  "event_id": "65f9c4a2e1b123456789",
  "timestamp": "2023-12-14T10:41:42.016Z",
  "data": {
    "mandate": "mmc_6579495142cc7e8894f6e031",
    "status": "success",
    "response_code": "",
    "message": "This mandate is now cancelled and deleted, and can’t be used again",
    "timestamps": "2023-12-14T10:34:30.114Z",
    "documentation": "https://mono.co/docs/error-codes/400",
    "data": null,
    "app": "60cc8f95ba1772018c123456",
    "business": "60cc8f95ba1772018c123456"
  }
}
```

##### g. Mandate reinstated event:

When a direct debit mandate has been paused, we send the webhook below when this mandate has been reinstated.

### Request

```json
{
  "event": "events.mandate.action.reinstate",
  "event_id": "65f9c4a2e1b123456789",
  "timestamp": "2023-12-14T10:41:42.016Z",
  "data": {
    "mandate": "mmc_6571f4e55c7d1843d7d162e9",
    "status": "success",
    "response_code": "",
    "message": "The mandate has been reinstated successfully and is
     now active for debit and balance inquiry",
    "timestamps": "2023-12-14T10:40:19.322Z",
    "documentation": "https://mono.co/docs/error-codes/400",
    "data": null,
    "app": "60cc8f95ba1772018c123456",
    "business": "60cc8f95ba1772018c123456"
  }
}
```

### 2. Debit webhook events

When a direct debit action is taken, either of the two results below will be shared:

- Processing direct debit event.
- Successful direct debit event.
- Failed direct debit event.

##### a. Processing direct debit event:

This processing webhook is sent to indicate a debit transaction is pending confirmation. When the transaction is finally confirmed as successful or failed, a webhook is sent and the status will be updated.

### Request

```json
{
  "event": "events.mandates.debit.processing",
  "event_id": "65f9c4a2e1b123456789",
  "timestamp": "2023-12-14T10:41:42.016Z",
  "data": {
    "status": "processing",
    "message": "Payment is currently in processing state, please wait for a final state webhook before giving value",
    "event": "processing",
    "response_code": "99",
    "amount": 140000,
    "mandate": "mmc_66b724f8be2c101e38151234",
    "reference_number": "LBA3B086406D4851234A",
    "account_details": {
      "bank_code": "058",
      "account_name": "HASSAN ABDULHAMID TOMIWA",
      "account_number": "0123456789",
      "bank_name": "GUARANTY TRUST BANK PLC"
    },
    "beneficiary": {
      "bank_code": "000",
      "account_number": "P000001",
      "bank_name": "MONO SETTLEMENT WALLET"
    },
    "date": "2024-08-12T00:32:17.192Z",
    "live_mode": true,
    "app": "661fb072e5fcc75328866c9a",
    "fee_bearer": "business",
    "business": "630c84e6059cbfc70fdaag15",
    "customer": "66b724f51a0fe7906d05d617"
  }
}
```

##### b. Successful direct debit event:

The webhook below is sent whenever an account has been debited successfully

### Request

```json
{
  "event": "events.mandates.debit.successful",
  "event_id": "65f9c4a2e1b123456789",
  "timestamp": "2023-12-14T10:41:42.016Z",
  "data": {
    "success": true,
    "status": "successful",
    "message": "Account debited successfully.",
    "response_code": "00",
    "amount": 50000,
    "mandate": "mmc_6571f4e55c7d1843d7d162e9",
    "reference_number": "Ah20141329b841234",
    "fee": 1000,
    "fee_bearer": "business",
    "narration": "Subscription",
    "app": "60cc8f95ba1772018c123456",
    "session_id": "999999250919103136775149584552",
    "business": "60cc8f95ba1772018c123456"
    "customer": "6570ee1115ddbc5528fea1c8",
    "account_details": {
      "bank_code": "058",
      "account_name": "SAMUEL OLAMIDE",
      "account_number": "0123456789",
      "bank_name": "GUARANTY TRUST BANK PLC"
    },
    "beneficiary": {
      "bank_code": "000",
      "account_name": "Mono",
      "account_number": "P000001",
      "bank_name": "MONO SETTLEMENT WALLET"
    },
    "date": "2023-12-14T10:41:42.016Z",
  }
}
```

##### c. Failed direct debit event:

This webhook is sent whenever a direct debit process performed is failed.

### Request

```json
{
  "event": "events.mandates.debit.failed",
  "event_id": "65f9c4a2e1b123456789",
  "timestamp": "2023-12-14T10:41:42.016Z",
  "data": {
    "success": false,
    "status": "failed",
    "message": "",
    "response_code": "96",
    "amount": 50000,
    "customer": "6570ee1115ddbc5528fea1c8",
    "mandate": "mmc_6571f4e55c7d1843d7d162e9",
    "reference_number": "Ah20141329b841841",
    "account_details": {
      "bank_code": "058",
      "account_name": "SAMUEL OLAMIDE",
      "account_number": "0123456789",
      "bank_name": "GUARANTY TRUST BANK PLC"
    },
    "beneficiary": {
      "bank_code": "000",
      "account_name": "SAMUEL OLAMIDE",
      "account_number": "P000000",
      "bank_name": "MONO SETTLEMENT WALLET"
    },
    "date": "2023-12-14T10:41:42.016Z",
    "fee_bearer": "business",
    "app": "60cc8f95ba1772018c123456",
    "business": "60cc8f95ba1772018c123456"
  }
}
```

### Handling duplicate webhook deliveries

Mono may send the same webhook event more than once due to network retries or system redundancy. To prevent duplicate processing of the same event, always check the `event_id` field before processing webhooks. Store processed event IDs and skip any events you've already handled.

#### Example implementation (Node.js)

```js
const express = require("express");
const app = express();

// Store processed event IDs (use a database in production)
const processedEvents = new Set();

app.post("/webhooks/mono", express.json(), (req, res) => {
  const { event, event_id, data } = req.body;

  // Check if already processed
  if (processedEvents.has(event_id)) {
    return res.status(200).json({ message: "Already processed" });
  }

  // Process the webhook
  console.log(`Processing ${event} with ID ${event_id}`);

  // Your business logic here
  if (event === "events.mandates.debit.successful") {
    // Handle successful debit
    console.log(`Debit successful: ${data.reference_number}`);
  }

  // Mark as processed
  processedEvents.add(event_id);

  res.status(200).json({ message: "Webhook received" });
});
```

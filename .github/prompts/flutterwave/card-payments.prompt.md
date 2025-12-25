---
agent: flutterwave
---

# Card Payments

Charge customers' credit and debit cards.

Card payments allow you to accept payments from customers using their credit and debit cards linked to their bank accounts. Customers complete the payment online by entering their card information during checkout.

## Supported Card Networks

1.  Mastercard
2.  Visa
3.  American Express
4.  Verve
5.  Afrigo

## Requirements

Before integrating card payments, complete the following steps:

1.  Review the introduction section before you continue with this guide.
2.  Retrieve your API keys from the [Flutterwave Dashboard](https://app.flutterwave.com/) to authorize requests.
3.  Configure your webhooks to manage payment status updates.

## How Card Payments Work

When a customer pays online with their card, these steps happen behind the scenes:

1.  **Encrypt and send payment details**: The customer enters their card details. The merchant encrypts this information along with the transaction data (like amount and currency), then sends it to Flutterwave.
2.  **Forward the request to the acquiring bank**: Flutterwave securely forwards the encrypted payment request to our acquiring bank, including any extra metadata needed to process the transaction.
3.  **Route through the card scheme**: The acquiring bank sends the request to the relevant card scheme (e.g., Visa, Mastercard). The scheme then passes it to the customer’s issuing bank.
4.  **Perform checks on the customer's account**: The issuing bank runs key validations, such as:
    - Confirming the customer has sufficient funds
    - Checking for restrictions like blacklisted accounts, liens, or transaction limits

5.  **Initiate authentication and approve the transaction**: If the checks pass, the issuing bank initiates payment authentication using the appropriate model. Once the customer approves, the bank sends the authorization back through the scheme and acquiring bank to Flutterwave.
6.  **Notify your system of the payment**: Flutterwave confirms the completed payment and notifies you via webhook.
7.  **Settle the transaction**: We settle the payment based on your settlement schedule.

## Payment Flow

To successfully collect card payments from customers, follow these steps:

1.  Collect the customer's information to initiate the transaction. You need to specify their `email`, `name` and `mobile` at this stage.
2.  Create a payment method object using the customer's card information and encryption `nonce`: `encrypted_card_number`, `encrypted_expiry_month`, `encrypted_expiry_year` and `encrypted_cvv`. Sensitive information must be encrypted before passing them into your request.
3.  Initiate the charge with the `customer_id`, `payment_id` and transaction details like amount, currency, and transaction `reference`.
4.  Prompt the customer to authenticate the transaction using the auth model returned from the charge response.
5.  Verify the payment `status`, `amount`, `customer_id` and `transaction_id` before providing the value to the customer.

## Steps to Collecting Card Payments with Flutterwave

> ## 🚧 Integration Method
>
> This guide follows the general flow for demonstration. Please refer to the orchestrator flow for the alternative integration method.

### Step 1: Create a Customer

To create a new customer, send a request to the create customer endpoint, including the `name`, `email`, `phone`, `address`, and other details. Only the `email` is required, but we recommend collecting as much information as possible for future use.

To fetch an existing customer's details, use the retrieve customer endpoint with the customer's `id`. This is useful when initiating charges for returning users.

cURL

```bash
curl --request POST \
  --url 'https://developersandbox-api.flutterwave.com/customers' \
  --header 'Authorization: Bearer {{YOUR_ACCESS_TOKEN}}' \
  --header 'Content-Type: application/json' \
  --header 'X-Trace-Id: {{YOUR_UNIQUE_TRACE_ID}}' \
  --header 'X-Idempotency-Key: {{YOUR_UNIQUE_INDEMPOTENCY_KEY}}' \
  --data '{
    "address": {
      "city": "Gotham",
      "country": "US",
      "line1": "221B Baker Street",
      "line2": "",
      "postal_code": "94105",
      "state": "Colorado"
    },
    "name": {
      "first": "King",
      "middle": "Leo",
      "last": "James"
    },
    "phone": {
      "country_code": "1",
      "number": "6313958745"
    },
    "email": "james@example.com"
  }'
```

You'll get a response similar to this:

200 OK

```json
{
  "status": "success",
  "message": "Customer created",
  "data": {
    "id": "cus_X0yJv3ZMpL",
    "address": {
      "city": "Gotham",
      "country": "US",
      "line1": "221B Baker Street",
      "line2": "",
      "postal_code": "94105",
      "state": "Colorado"
    },
    "email": "james@example.com",
    "name": {
      "first": "King",
      "middle": "Leo",
      "last": "James"
    },
    "phone": {
      "country_code": "1",
      "number": "6313958745"
    },
    "meta": {},
    "created_datetime": "2025-01-29T12:44:53.049Z"
  }
}
```

### Step 2: Create the Card Payment Method

Next, create a payment method for the customer. Send the customer's card details in a payment method request to generate a card object. Be sure to encrypt all sensitive information before sending the request.

cURL

```bash
curl --request POST \
  --url 'https://developersandbox-api.flutterwave.com/payment-methods' \
  --header 'Authorization: Bearer {{YOUR_ACCESS_TOKEN}}' \
  --header 'Content-Type: application/json' \
  --header 'X-Trace-Id: {{YOUR_UNIQUE_TRACE_ID}}' \
  --header 'X-Idempotency-Key: {{YOUR_UNIQUE_INDEMPOTENCY_KEY}}' \
  --data '{
    "type": "card",
    "card": {
      "encrypted_card_number": "{{$encrypted_card_number}}",
      "encrypted_expiry_month": "{{$encrypted_expiry_month}}",
      "encrypted_expiry_year": "{{$encrypted_expiry_year}}",
      "encrypted_cvv": "{{$encrypted_cvv}}",
      "nonce": "{{$randomly_generated_nonce}}"
    }
  }'
```

You'll get a response similar to this:

200 OK

```json
{
  "status": "success",
  "message": "Payment method created",
  "data": {
    "type": "card",
    "card": {
      "expiry_month": 8,
      "expiry_year": 32,
      "first6": "123412",
      "last4": "2222",
      "network": "mastercard"
    },
    "id": "pmd_wlVhaYmkl2",
    "meta": {},
    "created_datetime": "2024-12-03T14:29:26.650973145Z"
  }
}
```

### Step 3: Create the Charge

To initiate a card charge, send a request to the create charge endpoint with the following:

- `customer_id`: Returned after creating the customer.
- `payment_method_id`: Returned after creating the payment method.
- Transaction details: Include the `amount`, `currency`, and a unique `reference`.

cURL

```bash
curl --request POST \
  --url 'https://developersandbox-api.flutterwave.com/charges' \
  --header 'Authorization: Bearer {{YOUR_ACCESS_TOKEN}}' \
  --header 'Content-Type: application/json' \
  --header 'X-Trace-Id: {{YOUR_UNIQUE_TRACE_ID}}' \
  --header 'X-Idempotency-Key: {{YOUR_UNIQUE_INDEMPOTENCY_KEY}}' \
  --data-raw '{
    "reference": "cedfa85a-a803-4a06-a586-0f81fb9b9f22",
    "currency": "USD",
    "customer_id": "cus_IpH7CKCUtD",
    "payment_method_id": "pmd_wlVhaYmkl2",
    "redirect_url": "https://google.com",
    "amount": 250,
    "meta": {
      "person_name": "King James",
      "role": "Developer"
    }
  }'
```

### Step 4: Authorising the Payment

After you initiate a charge, the customer must authenticate the transaction. Authentication requirements vary by card. Flutterwave returns an `authmodel` to indicate the type of authentication needed.

Check out the authorizing payments section to learn more about the steps required for handling different authentication models.

Once the payment is completed and funds are received, Flutterwave sends you a webhook with the final transaction status.

## Authorizing Payments (Auth Models)

When you make a card charge request, Flutterwave evaluates the card to determine what information is required to complete the charge on the card.

> ## 🚧 Required Authorization
>
> For transactions that do not require authorization, you can skip to verifying transactions section .

For cards that require authorization, we return the parameters needed to authorize each payment.

## 3DS / VBVSECURECODE

`3DS` also referred to as `VBVSECURECODE` involves redirecting the customer to their Bank to authorize the transaction. When charging a card using 3DS, we'd return a redirect URL in the response for you to redirect your customer.

Auth Response

```json
{
  "status": "success",
  "message": "Charge created",
  "data": {
    "id": "chg_VoUhmFMhmF",
    "next_action": {
      "type": "redirect_url",
      "redirect_url": {
        "url": "https://developer-sandbox-ui-sit.flutterwave.cloud/redirects?card&token=eyJhbGciOiJIUzI1NiJ9.eyJjbGllbnRJZCI6ImFjODMxOTNlLWFhMmItNDc2ZS1hZTNjLTMxYmVmMTc4NDUxZCIsImNoYXJnZUlkIjoiY2hnX1JDRHNDQkR5YVYiLCJzdWIiOiJhYzgzMTkzZS1hYTJiLTQ3NmUtYWUzYy0zMWJlZjE3ODQ1MWQiLCJpYXQiOjE3MzA5NjQ1MTIsImV4cCI6MTczMDk2NDgxMn0.tMv1VZ4WevvZ_dg37AzYnhj0Z1YtXK_tQIOJcErNscI"
      }
    },
    "payment_method_details": {},
    "status": "pending"
  }
}
```

## External 3DS

External 3DS allows you to control how your customers' identity is verified. With this model, you can authorize the payment using your preferred provider.

Unlike the regular 3DS, where Flutterwave handles the identity verification process, External 3DS allows you to manage this verification process according to your specific needs.

Next Action

```json
{
  "next_action": {
    "type": "redirect_url",
    "redirect_url": {
      "url": "https://developer-sandbox-ui-sit.flutterwave.cloud/redirects?card&token=eyJhbGciOiJIUzI1NiJ9.eyJjbGllbnRJZCI6ImFjODMxOTNlLWFhMmItNDc2ZS1hZTNjLTMxYmVmMTc4NDUxZCIsImNoYXJnZUlkIjoiY2hnX2tPMWVSblF6N1AiLCJzdWIiOiJhYzgzMTkzZS1hYTJiLTQ3NmUtYWUzYy0zMWJlZjE3ODQ1MWQiLCJpYXQiOjE3MzgyNDU3MjAsImV4cCI6MTczODI0NjAyMH0.Le9JEoZx87G1cE6OtMaRHSbKMqlYB8eMq2-9PdNkdco"
    }
  }
}
```

## AVS

Address Verification (`AVS`) requires the customer to provide their address information to authorize the payment. This model is popular with cards issued in the US and Canada.

If the charge response contains `data.next_action.requires_additional_fields`, it means that you are charging an AVS card.

Auth Response (AVS)

```json
{
  "status": "success",
  "message": "Charge created",
  "data": {
    "id": "chg_VoUhmFMhmF",
    "...": "...",
    "next_action": {
      "type": "requires_additional_fields",
      "requires_additional_fields": {
        "fields": [
          "authorization.avs.address.postal_code",
          "authorization.avs.address.line1",
          "authorization.avs.address.state",
          "authorization.avs.address.country",
          "authorization.avs.address.city"
        ]
      }
    },
    "payment_method_details": {},
    "status": "pending",
    "...": "..."
  }
}
```


To complete a card charge using the`AVS` auth model, update the charge with the address information.

Next Action

```bash
curl --request PUT \
  --url 'https://developersandbox-api.flutterwave.com/charges/{id}' \
  --header 'Authorization: Bearer {{YOUR_ACCESS_TOKEN}}' \
  --header 'Content-Type: application/json' \
  --header 'X-Trace-Id: {{YOUR_UNIQUE_TRACE_ID}}' \
  --header 'X-Idempotency-Key: {{YOUR_UNIQUE_INDEMPOTENCY_KEY}}' \
  --data '{
    "authorization": {
      "type": "avs",
      "avs": {
        "address": {
          "city": "Gotham",
          "country": "US",
          "line1": "221B Baker Street",
          "line2": "Coker Estate",
          "postal_code": "94105",
          "state": "Colorado"
        }
      }
    }
  }'
```


## PIN

PIN card transactions are the most widely used authorization method. In this process, customers enter their card `PIN` with a one-time password (OTP) to securely complete the transaction. Flutterwave informs you about a PIN card charge by returning the`next_action` object with the value of `requires_pin` in the charge response.

Auth Response (PIN)

```json
{
  "status": "success",
  "message": "Charge created",
  "data": {
    "id": "chg_VoUhmFMhmF",
    "next_action": {
      "type": "requires_pin",
      "requires_pin": {}
    },
    "payment_method_details": {},
    "status": "pending"
  }
}
```


Auth Response (OTP)

```json
{
  "status": "success",
  "message": "Charge created",
  "data": {
    "id": "chg_VoUhmFMhmF",
    "...": "...",
    "next_action": {
      "type": "requires_otp",
      "requires_otp": {}
    },
    "payment_method_details": {},
    "status": "pending",
    "...": "..."
  }
}
```

To complete a charge using the `PIN` auth model, you’ll first need to update the charge with the encrypted card PIN.

PIN Update

```bash
curl --request PUT \
  --url 'https://developersandbox-api.flutterwave.com/charges/{id}' \
  --header 'Authorization: Bearer {{YOUR_ACCESS_TOKEN}}' \
  --header 'Content-Type: application/json' \
  --header 'X-Trace-Id: {{YOUR_UNIQUE_TRACE_ID}}' \
  --header 'X-Idempotency-Key: {{YOUR_UNIQUE_INDEMPOTENCY_KEY}}' \
  --data '{
    "authorization": {
      "type": "pin",
      "pin": {
        "nonce": "{{$randomly_generated_nonce}}",
        "encrypted_pin": "{{$encrypted_pin}}"
      }
    }
  }'
```

Followed by updating the charge request with the OTP.

OTP Update

```bash
curl --request PUT \
  --url 'https://developersandbox-api.flutterwave.com/charges/{id}' \
  --header 'Authorization: Bearer {{YOUR_ACCESS_TOKEN}}' \
  --header 'Content-Type: application/json' \
  --header 'X-Trace-Id: {{YOUR_UNIQUE_TRACE_ID}}' \
  --header 'X-Idempotency-Key: {{YOUR_UNIQUE_INDEMPOTENCY_KEY}}' \
  --data '{
    "authorization": {
      "type": "otp",
      "otp": {
        "code": "123456"
      }
    }
  }'
```

## Making Recurring Payments

Recurring payments allow businesses to automatically charge customers at regular intervals, such as weekly, monthly, or annually. This is ideal for subscription-based services, memberships, and installment plans.

There are two ways you can collect recurring payments from your customers on Flutterwave:

- Tokenization
- Credential-on-File Transaction.

## Tokenization

> ## 🚧 Authorization Requirement
>
> Charging a customer using the recurring flow doesn't require authorization.

Tokenization is a secure method for handling recurring payments by replacing sensitive card details with a unique token or ID. Instead of storing card information, you store IDs that can be used for future transactions.

### How Does it Work?

1.  The merchant collects the customer's card information and creates a card payment method object.
2.  The merchant stores the payment method ID linked to the card.
3.  For subsequent payments, the merchant provides the `payment_method_id` and specifies the `recurring` flag in their charge request.

To charge a customer using the recurring payment flow: provide the `payment_method_id`, `customer_id` and set the `recurring` flag to `true` in your charge request.

cURL

```bash
curl --request POST \
  --url 'https://developersandbox-api.flutterwave.com/charges' \
  --header 'Authorization: Bearer {{YOUR_ACCESS_TOKEN}}' \
  --header 'Content-Type: application/json' \
  --header 'X-Trace-Id: {{YOUR_UNIQUE_TRACE_ID}}' \
  --header 'X-Idempotency-Key: {{YOUR_UNIQUE_INDEMPOTENCY_KEY}}' \
  --data-raw '{
    "reference": "cedfa85a-a803-4a06-a586-0f81fb9b9f22",
    "currency": "USD",
    "customer_id": "cus_IpH7CKCUtD",
    "payment_method_id": "pmd_TusjN23anB",
    "recurring": true,
    "redirect_url": "https://google.com",
    "amount": 250
  }'
```


## Credential-on-File (COF) transactions

> ## 🚧 Approval Required
>
> This feature is available only by request. To enable it on your account, `contact Flutterwave support`.

The Credential on File (COF) feature enables merchants to securely save a reference to their customers' card details for future payments. This allows merchants to charge customers later without asking for their card information again.

Unlike tokenization, COF references can be used across different platforms, even if the initial transaction wasn't processed through Flutterwave

To initiate a COF card transaction, include the `COF` object in your request. This object would contain the `agreement_id` that acts as a reference to track the transaction.

Sample Request (General)

cURL

```bash
curl --request POST \
  --url 'https://developersandbox-api.flutterwave.com/payment-methods' \
  --header 'Authorization: Bearer {{YOUR_ACCESS_TOKEN}}' \
  --header 'Content-Type: application/json' \
  --header 'X-Trace-Id: {{YOUR_UNIQUE_TRACE_ID}}' \
  --header 'X-Idempotency-Key: {{YOUR_UNIQUE_INDEMPOTENCY_KEY}}' \
  --data-raw '{
    "type": "card",
    "card": {
      "encrypted_card_number": "{{$encrypted_card_number}}",
      "encrypted_expiry_month": "{{$encrypted_expiry_month}}",
      "encrypted_expiry_year": "{{$encrypted_expiry_year}}",
      "encrypted_cvv": "{{$encrypted_cvv}}",
      "nonce": "{{$randomly_generated_nonce}}",
      "cof": {
        "enabled": true,
        "agreement_id": "Agreement00w02W1"
      }
    }
  }'
```

Sample Request (Orchestrator)

cURL

```bash
curl --location 'https://developersandbox-api.flutterwave.com/orchestration/direct-charges' \
  --header 'X-Trace-Id: {{UNIQUE_TRACE_ID}}' \
  --header 'X-Idempotency-Key: {{UNIQUE_IDEMPOTENCY_KEY}}' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer {{API_ACCESS_TOKEN}}' \
  --data-raw '{
    "amount": "1234.56",
    "currency": "NGN",
    "reference": "{{UNIQUE_TRANSACTION_REFERENCE}}",
    "customer": {
      "name": { "first": "King", "middle": "Leo", "last": "James" },
      "email": "james@example.com",
      "phone": { "country_code": "234", "number": "9010001111" },
      "address": {
        "line1": "221B Baker Street",
        "line2": "",
        "city": "Gotham",
        "state": "Colorado",
        "postal_code": "94105",
        "country": "US"
      },
      "meta": {}
    },
    "payment_method": {
      "type": "card",
      "card": {
        "encrypted_card_number": "{{$encrypted_card_number}}",
        "encrypted_expiry_month": "{{$encrypted_expiry_month}}",
        "encrypted_expiry_year": "{{$encrypted_expiry_year}}",
        "encrypted_cvv": "{{$encrypted_cvv}}",
        "nonce": "{{$randomly_generated_nonce}}",
        "cof": { "enabled": true, "agreement_id": "Agreement00w02W1" }
      }
    }
  }'
```


## Verifying Transactions

Before you provide value to the customer, confirm the transaction's final status and amount. You can verify the transaction information either using webhooks or by retrieving the charge details:

- **Webhooks**: It is important to have webhooks enabled on your Flutterwave dashboard. If you have webhooks enabled, we'll call your webhook URL with the payment details when the transaction is completed or fails. Below is a sample webhook payload:

Sample Webhook

```json
{
  "webhook_id": "wbk_yXvsB4LzWSwhUCpAPCBR",
  "timestamp": 1739456704200,
  "type": "charge.completed",
  "data": {
    "id": "chg_zam88NgLb7",
    "amount": 2000,
    "currency": "NGN",
    "customer": {
      "id": "cus_dc0FUyBpd0",
      "address": {
        "city": "Gotham",
        "country": "US",
        "line1": "221B Baker Street",
        "line2": "",
        "postal_code": "94105",
        "state": "Colorado"
      },
      "email": "james@example.com",
      "name": {
        "first": "King",
        "middle": "Leo",
        "last": "James"
      },
      "phone": {
        "country_code": "1",
        "number": "6313958745"
      },
      "meta": {},
      "created_datetime": "2024-12-25T20:16:38.246Z"
    },
    "description": null,
    "meta": {},
    "payment_method": {
      "type": "card",
      "card": {
        "expiry_month": 9,
        "expiry_year": 32,
        "first6": "553188",
        "last4": "2950",
        "network": "MASTERCARD",
        "billing_address": null,
        "cof": null,
        "card_holder_name": null
      },
      "id": "pmd_ujxuBcf4cJ",
      "customer_id": null,
      "meta": {},
      "device_fingerprint": null,
      "client_ip": null,
      "created_datetime": "2025-02-05T14:06:10.344Z"
    },
    "redirect_url": null,
    "reference": "ex61m23ja3feykheoidho8ilrri",
    "status": "succeeded",
    "processor_response": {
      "type": "approved",
      "code": "00"
    },
    "created_datetime": "2025-02-13T14:24:43.133Z"
  }
}
```


- **Retrieve the Charge**: You can manually check the status of a charge by calling the retrieve a charge endpoint using the charge ID, which is returned in the `data.id` field of the response after successfully initiating a charge.

cURL

```bash
curl -X GET "https://developersandbox-api.flutterwave.com/charges/{charge_id}" \
  -H "Authorization: Bearer {{YOUR_ACCESS_TOKEN}}" \
  -H "Content-Type: application/json" \
  -H "X-Trace-Id: {{YOUR_UNIQUE_TRACE_ID}}" \
  -H "X-Idempotency-Key: {{YOUR_UNIQUE_INDEMPOTENCY_KEY}}"
```

You'll get a response similar to this:

200 OK

```json
{
  "status": "success",
  "message": "Charge updated",
  "data": {
    "id": "chg_VoUhmFMhmF",
    "amount": 1500.25,
    "currency": "NGN",
    "customer": "cus_EFE4TQhBSf",
    "meta": {},
    "next_action": {
      "type": "requires_pin"
    },
    "payment_method_details": {
      "type": "card",
      "card": {
        "expiry_month": 8,
        "expiry_year": 2024,
        "first6": "123412",
        "last4": "4444",
        "network": "mastercard"
      },
      "id": "pmd_NkWibrRJIy",
      "customer": "cus_EFE4TQhBSf",
      "meta": {}
    },
    "redirect_url": "www.flutterwave.com",
    "reference": "XYZ123",
    "status": "succeeded",
    "issuer_response": {
      "type": "approved",
      "code": "00"
    }
  }
}
```

## Testing your Integration

Flutterwave provides scenario keys to simulate various outcomes during testing, such as successful and failed payments. The scenario key follows this form: `scenario:<value>&issuer:<value>`. The scenario tells us which auth model you're testing, while the issuer indicates the processor message you want to mock.

Refer to the testing helpers for a complete list of scenario keys available for card payments.

Sample

```bash
curl --request POST \
  --url 'https://developersandbox-api.flutterwave.com/charges' \
  --header 'Authorization: Bearer {{YOUR_ACCESS_TOKEN}}' \
  --header 'Content-Type: application/json' \
  --header 'X-Trace-Id: {{YOUR_UNIQUE_TRACE_ID}}' \
  --header 'X-Scenario-Key: scenario:auth_3ds&issuer:approved' \
  --data-raw '{
    "reference": "cedfa85a-a803-4a06-a586-0f81fb9b9f22",
    "currency": "USD",
    "customer_id": "cus_IpH7CKCUtD",
    "payment_method_id": "pmd_wlVhaYmkl2",
    "redirect_url": "https://google.com",
    "amount": 250,
    "meta": {
      "person_name": "King James",
      "role": "Developer"
    }
  }'
```

## Next steps

Congrats! You have successfully integrated the card payments, but it doesn't end there; there is more:

- Learn about settlements of successful payments into your Flutterwave balance.
- For cases where refunds are necessary, see the refunds guide for more information on how to process transaction refunds.

Updated 2 months ago

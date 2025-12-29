---
agent: flutterwave
---

# Direct Debit (E-mandate)

Learn how to use your customer’s bank account to process recurring payments.

> ## 🚧
>
> Approval Required
>
> Before you use this payment method, you need to request access from the [support team](https://flutterwave.com/support/submit-request).

NIBSS E-Mandate allows merchants to debit customers' Nigerian bank accounts repeatedly. This service helps you to support direct debit as a payment option for subscription and recurring payments.

Merchants can collect payments for loans, package subscriptions and other recurring payment use cases using this payment method.

This method is available for only Naira (NGN) Payments.

##

How does E-Mandate Work?

This payment method enables businesses to securely tokenize a customer's bank account after the customer has given consent, allowing for future debits directly from the account.

Just like card tokenization, the merchant needs to first generate a token for the customer's account. This token maps the customer's account details and authorization to a token, allowing the merchant to charge the customer.

> ## 🚧
>
> Managing Sensitive Data
>
> Tokens are highly sensitive and can only be used by the merchant who generated them and for the specific customer they were created for.

A customer can tokenize their account multiple times with different merchants that use Flutterwave.

Once the customer's account is tokenized, the merchant can charge it until the token expires. For details on token expiry, refer to the token generation section.

##

Prerequisite

You need to meet the following requirements before integrating this payment method:

- Account status: Your account needs to be approved for live payments.
- Request payment method: You'll need to request access to this payment method from our support team. Send us an email to `hi@flutterwavego.com`.
- Set up transaction webhooks on your account to receive the token after authorizing the mandate.

##

Payment Flow

Follow these steps to complete a direct debit:

- **Initiate token generation**: Send the customer's bank details along with other necessary information to create a mandate.
- **Authorize the mandate**: This process requires the customer to give consent for their bank account to be tokenized by the merchant.
- **Query the token status**: Merchants can query the Retrieve a Bank Account Token endpoint to confirm the current status of the token. Verifying the token's status before initiating a charge ensures it’s active and ready for use.
- **Charge a customer using the token**: Once the token is active, proceed to charge the customer's bank account directly using the token.

###

Token Generation

To generate a token for the customer, You need to collect the customer's details (`email`, `address`, `account_bank` and `account_number`). From your server, send a request to Tokenize a customer's bank account endpoint with the customer information, transaction amount and token expiry date (`end_date`).

cURL

`{     "email": "user@example.com",     "amount": "100",     "address": "XYZ Example Street, Example City.",     "phone_number": "08081806271",     "account_bank": "058",     "account_number": "0002093669",     "start_date": "2024-06-22T01:28:00.000Z",     "end_date": "2025-04-04T01:28:00.000Z",     "narration": "e-Mandate token for tester" }`

Please note that:

1.  The `start_date` and `narration` are optional.
2.  The specified `start_date` must be at least one day after the current date.
3.  The maximum value for `end_date` is 365 days (one year) from the `start_date`.
4.  The recipient's bank code should be passed as the `account_bank`

> ## 📘
>
> Supported Banks
>
> Note that not all NG banks are supported on this feature, Below is a comprehensive list of supported banks.

| Bank Name                   | Code   |
| --------------------------- | ------ |
| First Bank PLC              | 011    |
| Citi Bank                   | 023    |
| Union Bank PLC              | 032    |
| United Bank for Africa      | 033    |
| Wema Bank PLC               | 035    |
| Access Bank                 | 044    |
| EcoBank PLC                 | 050    |
| Zenith Bank PLC             | 057    |
| Guaranty Trust Bank         | 058    |
| Standard Chartered Bank PLC | 068    |
| Fidelity Bank               | 070    |
| Polaris Bank                | 076    |
| Keystone Bank               | 082    |
| Suntrust Bank               | 100    |
| ProvidusBank PLC            | 101    |
| First City Monument Bank    | 214    |
| Unity Bank PLC              | 215    |
| Stanbic IBTC Bank           | 221    |
| Sterling Bank PLC           | 232    |
| Jaiz Bank                   | 301    |
| Titan Trust Bank            | 000025 |
| Globus Bank                 | 000027 |
| PremiumTrust Bank           | 000031 |

After sending the token generation request, you'll get a response like this:

200 OK400 Bad Request

`{     "status": "success",     "message": "Account tokenization successful.",     "data": {         "status": "PENDING",         "amount": 100,         "address": "09797 Volkman Place",         "narration": "e-Mandate token for tester",         "account_id": 188360,         "currency": "NGN",         "end_date": "2025-10-10T01:28:00.000Z",         "customer_id": 295028522,         "start_date": "2024-10-22T12:46:47.108Z",         "reference": "URF_EMANDATE_1729601207335_39068",         "updated_at": "2024-10-22T12:46:51.000Z",         "created_at": "2024-10-22T12:46:47.000Z",         "processor_code": "02",         "processor_response": "Welcome to NIBSS e-mandate authentication service, a seamless and convenient authentication experience. Kindly proceed with a token payment of N100:00 into account number 9020025928 with Fidelity Bank {Account name : NIBSS MANDATE ACTIVATION}. This payment will trigger the authentication of your mandate. Note: You have 10 minutes to complete this payment. Thank You",         "mandate_consent": {             "bank_name": "Fidelity Bank",             "account_name": "NIBSS MANDATE ACTIVATION",             "account_number": "9020025928",             "amount": "N100:00"         }     } }`

`{ 	"status": "error", 	"message": "Account details could not be resolved.", 	"data": null }`

###

Authorizing a Mandate

> ## 📘
>
> Customer consent
>
> After a successful response from initiating a token generation, the customer is required to give consent by authorizing the mandate before a token is generated.

When you get a successful response after initiating a token generation, you will need to prompt the customer to make a transfer to the specified account in order to authorize the mandate. The authorization fee must be paid from the bank account on which the authorization is requested.

This transfer is a fee (NGN 100) to trigger your customer's authorization and it must be completed within 10 minutes of the token generation.

Before authorizing a mandate, the status of your generated token is pending. After the mandate is authorized, the status moves to approved and we'll send you a webhook with the token information.

Sample Webhook

`{ 	"data": { 		"token": "flw-1bt-XXXXXX-k3n", 		"status": "APPROVED", 		"start_date": "2024-09-29T17:01:03.000Z", 		"end_date": "2025-09-27T01:28:00.000Z", 		"amount": 500, 		"currency": "NGN", 		"address": "3843 Kub Square", 		"narration": "e-Mandate Firstbank again", 		"response_code": "00", 		"response_message": "Approved Or Completed Successfully", 		"active_on": "2024-09-29T20:04:15.755Z", 		"reference": "URF_EMANDATE_1727629264278_59850", 		"created_at": "2024-09-29T17:01:04.000Z", 		"account_id": 188360, 		"customer_id": 295028841, 		"bank_account_id": 467038 	}, 	"event": "account.tokenize" }`

For a new customer, after the mandate has been authorized, the wait period for activating the token is returned as the `active_on` in the response. This wait period is usually less than three hours after token authorization. With a returning customer, the token is activated immediately.

> ## 📘
>
> The `active_on` field in the response specifies the exact time at which the token's status will transition to active

When waiting for activation, the token’s status will be `Approved`. This gets updated to `Active` after activation. Only active tokens can be used to debit the customer’s account.

###

Querying a Token's Status

Only active tokens can be used to recurrently debit your customers. After you generate the token, it's important to query its status before attempting to charge the customer. A generated token can have multiple statuses. The statuses to keep an eye out for include:

- Pending - This status indicates that the customer is yet to give their consent for the mandate.
- Approved - An approved status means that the customer has granted consent, but the bank is yet to activate the mandate for the transaction.
- Active - The token is now active and ready for recurring charges.
- Suspended - This status shows that a token is suspended by the merchant. Subsequent transactions for suspended tokens would fail automatically.
- Deleted - The merchant has permanently deleted the token.

Send the token reference to the Retrieve a Bank Account Token endpoint to confirm the token's current status.

cURL

`curl --request GET \ --url 'https://api.flutterwave.com/v3/accounts/token/:reference' \ --header 'Authorization: Bearer YOUR_SECRET_KEY' \ --header 'Content-Type: application/json' \`

You'll get a response like this:

200 OK400 Bad Request

`{     "status": "success",     "message": "Account token fetched successfully.",     "data": {         "token": "flw-1bt-5e1ba73fff7f1aa9642606d4d82a45d3-k3n",         "reference": "URF_EMANDATE_1728385553726_55174",         "status": "APPROVED",         "start_date": "2024-10-08T11:05:52.000Z",         "end_date": "2024-10-10T01:28:56.000Z",         "amount": 100,         "currency": "NGN",         "address": "06548 Clay Path",         "narration": "eMandate test on F4B flow for an nigerian merchant",         "processor_code": "00",         "processor_response": "Approved Or Completed Successfully",         "active_on": "2024-10-08T11:36:26.724Z",         "created_at": "2024-10-08T11:05:53.000Z",         "updated_at": "2024-10-08T11:06:26.000Z",         "account_id": 1091430,         "customer_id": 585229978     } }`

`{ 	"status": "error", 	"message": "No mandate token found for reference.", 	"data": null }`

###

Charging a Customer Using your Token

After a customer authorizes a mandate and the status of the token is active, you can initiate the charge using the generated token. Send the `token`, `email`, `amount`, transaction reference (`tx_ref`) and the transaction `type` to the Create a tokenized charge endpoint to initiate the payment.

The transaction amount should not exceed the amount specified when generating the token.

cURL

`curl --request POST \ --url 'https://api.flutterwave.com/v3/tokenized-charge' \ --header 'Authorization: Bearer YOUR_SECRET_KEY' \ --header 'Content-Type: application/json' \ --data '{     "token": "flw-1bt-xxxxxxxxxxxxxxxxxxx-k3n", "email": "user@example.com",     "amount": "100",     "tx_ref": "YOUR_TRANSACTION_REFERENCE",     "type": "account" } '`

You'll get a response like this:

200 OK400 Bad RequestSample Webhook

`{     "status": "success",     "message": "Charge successful",     "data": {         "id": 510991384,         "tx_ref": "QA/ADD/1727792865",         "flw_ref": "NKHIFRQWFPLETELPMT",         "redirect_url": "N/A",         "device_fingerprint": "N/A",         "amount": 50,         "charged_amount": 50.7,         "app_fee": 0.7,         "merchant_fee": 0,         "processor_response": "Approved Or Completed Successfully",         "auth_model": "EMANDATE",         "currency": "NGN",         "ip": "85.255.21.158",         "narration": "TOKENIZED ACCOUNT CHARGE FOR Fumz Enterprise",         "status": "successful",         "payment_type": "account",         "created_at": "2024-10-01T14:27:46.000Z",         "account_id": 188360,         "customer": {             "id": 295028841,             "phone_number": "07000000000",             "name": "JOSHUA WISDOM",             "email": "wisdom@flutterwavego.com",             "created_at": "2024-09-27T15:01:22.000Z"         },         "account": {             "account_number": "3000040010",             "bank_code": "011",             "first_name": "WISDOM EFFIONG",             "last_name": "JOSHUA"         }     } }`

`{ 	"status": "error", 	"message": "Wrong account token or customer email passed in.", 	"data": null }`

`{ 	"event": "charge.completed", 	"data": { 		"id": 510991224, 		"tx_ref": "PERF123456", 		"flw_ref": "YAUXQHMWOJETXEGYMT", 		"device_fingerprint": "N/A", 		"amount": 50, 		"currency": "NGN", 		"charged_amount": 50.7, 		"app_fee": 0.7, 		"merchant_fee": 0, 		"processor_response": "Approved Or Completed Successfully", 		"auth_model": "EMANDATE", 		"ip": "34.251.145.60", 		"narration": "TOKENIZED ACCOUNT CHARGE FOR Fumz Enterprise", 		"status": "successful", 		"payment_type": "account", 		"created_at": "2024-09-30T15:20:58.000Z", 		"account_id": 188360, 		"customer": { 			"id": 295028841, 			"name": "JOSHUA WISDOM EFFIONG", 			"phone_number": "07000000000", 			"email": "wisdom@flutterwavego.com", 			"created_at": "2024-09-27T15:01:22.000Z" 		}, 		"account": { 			"account_name": "WISDOM EFFIONG JOSHUA", 			"account_number": "3000040010", 			"bank_code": "011" 		} 	}, 	"meta_data": {}, 	"event.type": "ACCOUNT_TRANSACTION" }`

##

Testing your Integration

Here's how you test your integration, most data we'd use in the examples are custom and can be easily replaced.

1.  Generate a token for your customer.
2.  Mandate authorization occurs automatically after a successful token generation.
3.  Retrieve the token from your webhook server.
4.  Verify the token's status by querying the Get Token endpoint.
5.  Charge the demo customer using the generated token.

Sample Response (Test)

`{     "status": "success",     "message": "Account tokenization successful.",     "data": {         "status": "PENDING",         "amount": 100,         "address": "540 Bayer Highway",         "narration": "eMandate test on F4B flow for an nigerian merchant",         "account_id": 1090457,         "currency": "NGN",         "end_date": "2024-10-10T01:28:56.000Z",         "customer_id": 585216092,         "start_date": "2024-10-08T10:18:56.036Z",         "reference": "URF_EMANDATE_1728382736750_24889",         "updated_at": "2024-10-08T10:18:56.000Z",         "created_at": "2024-10-08T10:18:56.000Z",         "processor_code": "02",         "processor_response": "Welcome to Flutterwave e-mandate authentication service, a seamless and convenient authentication experience. Kindly proceed with a token payment of N100:00 into account number 3662146895 with Mock Bank {Account name : FLUTTERWAVE MANDATE ACTIVATION}. This payment will trigger the  authentication of your mandate. Note: You have 10 minutes to complete this payment. Thank You",         "mandate_consent": {             "bank_name": "Mock Bank",             "account_name": "FLUTTERWAVE MANDATE ACTIVATION",             "account_number": "3662146895",             "amount": "N100:00",         }     } }`

##

Updating an Account Token

You can enhance your customers' experience by properly managing tokens. In the event that your customer opts out of a payment plan or you suspect some foul play, we offer the flexibility of suspending or even deleting the token. This helps you to provide a secure and seamless payment experience in your solution.

Deleting a token is an irreversible action; please consider this carefully before you delete your customer’s token. If you need to debit a previous customer whose token has been deleted, you would need to generate and authorize a new token.

cURL

`curl --request PUT \ --url 'https://api.flutterwave.com/v3/accounts/token/:reference' \ --header 'Authorization: Bearer YOUR_SECRET_KEY' \ --header 'Content-Type: application/json' \ --data '{     "status": "SUSPENDED" // supported statuses also include ACTIVE and DELETED } '`

You'll get a response like this:

200 OK

`{ 	"status": "success", 	"message": "Account token updated successfully.", 	"data": { 		"token": "flw-1bt-XXXXXXXX-k3n", 		"reference": "URF_EMANDATE_1726257451101_39351", 		"status": "SUSPENDED", 		"start_date": "2024-09-13T19:57:30.000Z", 		"end_date": "2025-09-13T01:28:56.000Z", 		"amount": 100, 		"currency": "NGN", 		"address": "8463 Elouise Valley", 		"narration": "eMandate test on F4B flow for an nigerian merchant", 		"response_code": "00", 		"response_message": "Approved Or Completed Successfully", 		"active_on": "2024-09-13T23:02:55.000Z", 		"created_at": "2024-09-13T19:57:31.000Z", 		"updated_at": "2024-10-01T14:24:02.000Z", 		"account_id": 188360, 		"customer_id": 295028780 	} }`

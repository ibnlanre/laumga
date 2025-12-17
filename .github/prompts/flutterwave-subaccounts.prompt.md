---
agent: agent
---

# Split Payments

# Split Payments

Learn how to split incoming payments into Subaccounts.

Suggest Edits

Flutterwave’s split payments feature allows you to split an incoming payment and a commission fee between one or more bank accounts. This can be useful in the following example:

- You act as an aggregator, managing payments for different entities in exchange for a commission.
- You run a marketplace where different vendors provide services while you handle payments and collect a commission for each transaction.

To use split payments, you’ll need to first set up one or more subaccounts (the bank accounts you want to split to). Then, when collecting payment, you can specify how you would like to split the money. Any funds you direct to them will be settled into their account based on your settlement cycle.

> ## 🚧
>
> Your Merchants are your Responsibility
>
> As the marketplace owner, you are responsible for thoroughly vetting the merchants who sign up under your platform. Any disputes or chargebacks that arise will be logged against your account. Therefore, ensure that your merchants are trustworthy and that proper processes are in place.

##

Creating Subaccounts

You can create subaccounts easily from your [dashboard](https://flutterwave.com/ng/support/payments/split-payments-with-sub-accounts). Alternatively, you can use the create subaccount endpoint. You’ll need to supply the following details:

> ## ℹ️
>
> Testing Tip
>
> When in Test Mode, you can use any of our test account numbers for your subaccount.

Parameters

Functions

`account_bank`

This is the subaccount's bank code, which you can retrieve from the get banks endpoint.

`account_number`

This is the customer's account number. When testing on the sandbox, you can find a list of all available test bank accounts here. You can pass the IBAN in this field for countries that utilize the IBAN system.

`country`

The country the bank account is in.

`business_name`

This is the sub-account business name.

`business_mobile`

This is the primary business contact number

`split_type`

This specifies the type of split you want to use with this subaccount. Use "percentage" to receive a percentage of each transaction, or "flat" to receive a fixed amount while the subaccount gets the remainder.

`split_value`

The amount you want to get as a commission on each transaction. This goes with the `split_type`.

###

Split Payment Rules

To ensure you and your customers receive the correct amounts, you must provide instructions on how payments should be processed. You must define the following parameters:

- `split_type`: Specifies the type of split to apply to this subaccount.
  - "`percentage`": The subaccount receives a percentage of each transaction.
  - "`flat`": The subaccount receives a fixed amount, while the remainder goes to the main account.
- `split_value`: The amount or percentage to be allocated, depending on the split_type.

####

Examples

- **Percentage Split**: If you want to collect 9% from each transaction:

JSON

`"split_type": "percentage", "split_value": 0.09`

- **Flat Split**: If you want to charge a fixed amount of 600 NGN per transaction:

JSON

`"split_type": "flat", "split_value": 600`

####

Overriding Defaults

By default, `split_type` and `split_value` determine how split payments are processed. However, you can override these settings for specific use cases.

For example, if you are working with a third-party service or running a referral program and want the provider to receive a flat fee of 4200 NGN on each transaction, you can specify `transaction_charge_type` and `transaction_charge`:

JSON

`"subaccounts": [   {     "id": "RS_A8EB7D4D9C66C0B1C75014EE67D4D663",     "transaction_charge_type": "flat_subaccount",     "transaction_charge": 4200   } ]`

**Difference Between `flat` and `flat_subaccount`**

- `flat` (with `split_type`): The subaccount receives a fixed amount, and you get the remainder of the transaction.
- `flat_subaccount` (with `transaction_charge_type`): The subaccount is charged a fixed fee, and you receive the remainder of the transaction.

Use `flat` when you want the subaccount to earn a fixed amount.  
Use `flat_subaccount` when you want to deduct a fixed fee from the subaccount instead.

Check out the override defaults section for more details.

> ## 🚧
>
> VAT on Split Payment
>
> A successful split payment attracts a 7.5% [Value Added Tax (VAT)](https://firs.gov.ng/wp-content/uploads/2021/01/VAT.pdf) on the transaction fee. To learn more, contact `hi@flutterwavego.com`.

Here is an example using our backend SDKs:

> ## ℹ️
>
> Handling Currencies in Subaccount
>
> We'll use "Naira (NGN)" in this guide, but subaccounts work the same regardless of the currency the transaction is in.

Node.jsPHPRubyPythonGocURL

`// Install with: npm i flutterwave-node-v3  const Flutterwave = require('flutterwave-node-v3'); const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY); const details = { account_bank: “044”, account_number: “0690000037”, business_name: “Flutterwave Developers”, business_mobile: “09087930450”, country: “NG”, split_type: “percentage”, split_value: 0.2 }; flw.Subaccount.create(details) .then(console.log) .catch(console.log);`

``// Install with: composer require flutterwavedev/flutterwave-v3  $flw = new \Flutterwave\Rave(getenv('FLW_SECRET_KEY')); // Set `PUBLIC_KEY` as an environment variable $subaccountService = new \Flutterwave\Subaccount(); $details = array(     "account_bank"=> "044",     "account_number"=> "0690000037",     "business_name"=> "Flutterwave Developers",     "business_mobile"=> "09087930450",     "country"=> "NG",     "split_type"=> "percentage",     "split_value"=> 0.2 ); $response = $subaccountService->createSubaccount($details);``

`# Install with: gem install flutterwave_sdk  require 'flutterwave_sdk'  flw = Flutterwave.new(ENV["FLW_PUBLIC_KEY"], ENV["FLW_SECRET_KEY"], ENV["FLW_ENCRYPTION_KEY"]) subaccount = Subaccount.new(flw) details = {    account_bank: "044",    account_number: "0690000037",    business_name: "Flutterwave Developers",    business_mobile: "09087930450",    country: "NG",    split_type: "percentage",    split_value: 0.2 } response = subaccount.create_subaccount details print response`

`# Install with: pip install rave_python  import os from rave_python import Rave  rave = Rave(os.getenv("FLW_PUBLIC_KEY"), os.getenv("FLW_SECRET_KEY")) details = {  "account_bank": "044",  "account_number": "0690000037",  "business_name": "Flutterwave Developers",  "business_mobile": "09087930450",  "country": "NG",  "split_type": "percentage",  "split_value": 0.2 } response = rave.SubAccount.create(details) print(response)`

`// Install with: go get github.com/Flutterwave/Rave-go/rave  import (   "fmt"   "os"   "github.com/Flutterwave/Rave-go/rave" ) var r = rave.Rave{   false,   os.Getenv("FLW_PUBLIC_KEY"),   os.Getenv("FLW_SECRET_KEY"), } var subaccoun = rave.Subaccoun{     r, } details := rave.CreateSubaccountData{         AccountBank: "044",         AccountNumber: "0690000035",         BusinessName: "Flutterwave Developers",         BusinessMobile: "09087930123",         SplitType: "percentage",         SplitValue: "0.2",     } err, response := subaccoun.CreateSubaccoun(details) if err != nil {     panic(err) } fmt.Println(response)`

`curl --request POST 'https://api.flutterwave.com/v3/subaccounts' \   --header 'Authorization: Bearer YOUR_SECRET_KEY'\   --header 'Content-Type: application/json'\   --data-raw '{    "account_bank": "044",    "account_number": "0690000037",    "business_name": "Flutterwave Developers",    "business_mobile": "09087930450",    "country": "NG",    "split_type": "percentage",    "split_value": 0.2 }'`

> ## 📘
>
> Country-specific Requirements
>
> For certain countries, you’ll also need to include a meta object with additional bank account information.
>
> - For accounts in the US, provide a SWIFT code and routing number.
> - For accounts in Ghana, Tanzania, Rwanda, or Uganda, provide a branch code (you can retrieve this from the Get Bank Branches endpoint).
> - For [SEPA countries](https://www.ecb.europa.eu/paym/integration/retail/sepa/html/index.en.html), provide a SWIFT code.

USGhana/Tanzania/Rwanda/UgandaSEPA countries

`{   //.. Required parameters for creating a subaccount   country: “US”   meta: [     {       swiftCode: "USMMI120"     },     {       routingNumber: "121212121"     }   ] }`

`{   //.. Required parameters for creating a subaccount   country: “UG”   meta: [     {       swiftCode:””     },     {       bank_branch: "UG301847"     }   ] }`

`{   //.. Required parameters for creating a subaccount   country: "ES",   meta: [     {       swiftCode: "BSCHESMM"     }   ] }`

You’ll get a response like this:

SuccessBad Request

`{   “status”: “success”,   “message”: “Subaccount created”,   “data”: {     “id”: 9530,     “account_number”: “0690000037”,     “account_bank”: “044”,     “full_name”: “Ibra Mili”,     "created_at": "2021-04-21T10:43:24.000Z",     “meta”: [],     “split_type”: “percentage”,     “split_value”: 0.2,     "subaccount_id": "RS_FB312AA6C2C84A13421F3079E714F2CB",     “bank_name”: “ACCESS BANK NIGERIA”   } }`

`{   “status”: “error”,   “message”: “A subaccount with the account number and bank already exists”,   “data”: null }`

The important value here is the `data.subaccount_id`. You’ll use this when you want to split payments into that subaccount.

##

Using Subaccounts

Now that you’ve created a subaccount, you can split payments with it by specifying the ID whenever you’re collecting payments. This applies across our different integration options, including Flutterwave Inline, Standard, HTML checkout, and direct card charge.

To specify how the payment should be split across subaccounts, define a `subaccounts` field. The `subaccounts` field holds an array of objects, each containing the ID of the subaccount returned from the create subaccount call or as displayed on your dashboard.

InlineCard Charge (Node.js)Card Charge (PHP)Card Charge (Ruby)Card Charge (Python)

`<script> 	function makePayment() { 	  FlutterwaveCheckout({ 	    // ... 	    amount: 54600, 	    currency: “NGN”, 	    subaccounts: [ 	      { 	        id: “RS_A8EB7D4D9C66C0B1C75014EE67D4D663”, 	      } 	    ], 	  }); 	} </script>`

`// require('flutterwave-node-v3');  const payload = {   // ...   card_number: ‘4556052704172643’,   amount: 54600,   currency: “NGN”,   subaccounts: [     {       id: “RS_A8EB7D4D9C66C0B1C75014EE67D4D663”,     }   ], }; var response = await flw.Charge.card(payload);`

`// use Flutterwave\Card;  $data = array(   // ...   “card_number” => “5531886652142950”,   “currency” => “NGN”,   “amount” => “1000”,   “subaccounts” => [     {       id: “RS_A8EB7D4D9C66C0B1C75014EE67D4D663”,     }   ], );  $payment = new Card(); $response = $payment->cardCharge($data);`

`# require 'flutterwave_sdk'  payload = {   # ...   “card_number” => “5531886652142950”,   “currency” => “NGN”,   “amount” => “1000”,   “subaccounts” => [     {       id: “RS_A8EB7D4D9C66C0B1C75014EE67D4D663”,     }   ] }  charge_card = Card.new(payment) response = charge_card.initiate_charge(payload)`

`# from rave_python import Rave  payload = {   # ...   card_number: ‘4556052704172643’,   amount: 54600,   currency: “NGN”,   subaccounts: [     {       id: “RS_A8EB7D4D9C66C0B1C75014EE67D4D663”,     }   ], } response = rave.Card.charge(payload)`

##

Overriding the Default

When collecting payment, you can override the default `split_type` and `split_value` you set when creating the subaccount by specifying these fields in the `subaccounts` item:

1.  `transaction_charge_type`: The type of commission to charge for this transaction:
    - `"flat_subaccount"` if you want the subaccount to get a flat fee from this transaction while you get the rest.
    - `"flat"` if you want to get a flat fee while the subaccount gets the rest or
    - `"percentage"` if you want to get a percentage of the settlement amount.
2.  `transaction_charge` : The amount to charge as commission on the transaction. This should match with the `transaction_charge_type`, for example:
    - to collect a 9% commission, `transaction_charge_type` will be `"percentage"` and `transaction_charge` will be `0.09`
    - to collect a 600 naira commission, `transaction_charge_type` will be `"flat"` and `transaction_charge` will be `600`
    - to give the subaccount 4200 naira from this transaction while you get whatever’s left, `transaction_charge_type` will be `"flat_subaccount"` and `transaction_charge` will be `4200`/

Here are some examples. In each of these transactions, let’s suppose the total amount paid is 6000 naira and Flutterwave fees are 60 naira.

flat_subaccountflatpercentage

`subaccounts: [   {     id: “RS_A8EB7D4D9C66C0B1C75014EE67D4D663”,     // If you want the subaccount to get 4200 naira only     // Subaccount gets: 4200     // You get: 6000 - 4200 - 60 = 1740     transaction_charge_type: "flat_subaccount",     transaction_charge: 4200,   }, ],`

`subaccounts: [   {     id: “RS_A8EB7D4D9C66C0B1C75014EE67D4D663”,     // If you want to get 400 naira as a commission     // Subaccount gets: 6000 - 400 - 60 = 5540     // You get: 400     transaction_charge_type: “flat”,     transaction_charge: "400",   }, ],`

`subaccounts: [   {     id: "RS_A8EB7D4D9C66C0B1C75014EE67D4D663",     // If you want to get 20% of the transaction as commission     // You get: (0.2 * 6000) = 1200     // Subaccount gets: 6000 - 1200 - 60 = 4740     transaction_charge_type: "percentage",     transaction_charge: 0.2,   }, ],`

##

Splitting Across Multiple Subaccounts

If you’re splitting payment between multiple subaccounts, you can specify a `transaction_split_ratio` that defines how the money (excluding your commission and Flutterwave fees) is shared proportionally.

**For example**: If you are splitting a payment between 3 vendors. Let’s say you want a commission of 300 naira, and the vendors should share what’s left:

- vendor A should get 20% of the payment
- vendor B should get 30% of the payment
- vendor C should get the remaining 50%

This means your split ratio will be `2:3:5`. So your `subaccounts` array would look like this:

JSON

      `subaccounts: [         {           // vendor A           id: “RS_D87A9EE339AE28BFA2AE86041C6DE70E”,           transaction_split_ratio: 2,           transaction_charge_type: “flat”,           transaction_charge: "100",         },         {           // vendor B           id: “RS_344DD49DB5D471EF565C897ECD67CD95”,           transaction_split_ratio: 3,           transaction_charge_type: “flat”,           transaction_charge: "100",         },         {           // vendor C           id: “RS_839AC07C3450A65004A0E11B83E22CA9”,           transaction_split_ratio: 5,           transaction_charge_type: “flat”,           transaction_charge: "100",         },       ],`

Assuming the total payment is 16,000 naira, and Flutterwave fees are 200 naira, this means:

- You’ll get 300 naira (100 naira flat commission from each subaccount)
- The settlement amount (the amount the subaccounts will split) is 15,500 (`16000 - 200 - 300`)
  - vendor A will get 3,100 (`2/(2+3+5) * 15500`)
  - vendor A will get 4,650 (`3/(2+3+5) * 15500`)
  - vendor A will get 7,750 (`5/(2+3+5) * 15500`)

##

Splitting into Another Flutterwave Account

You can also split payments into other Flutterwave accounts. To do this, you need the Merchant Identifier (MID) of the Flutterwave account you want to split the payment into.

To split a payment into a Flutterwave account, create a subaccount using the MID as the `account_number` and set the `is_f4b_account` parameter to `true`.

Request with Flutterwave Account

`curl -X POST https://api.flutterwave.com/v3/subaccounts \ -H "Authorization: Bearer <YOUR_SECRET_KEY>" \ -H "Content-Type: application/json" \ -d '{    "account_number": "300212657",    "business_name": "Flutterwave Developers",    "currency": "NGN",    "business_email": "developers@flutterwavego.com",    "business_mobile": "08000010100",    "country": "US",    "is_f4b_account": true,    "split_type": "percentage",    "split_value": 0.60 }'`

You'll get a response similar to this:

200 OK

`{     "status": "success",     "message": "Subaccount created",     "data": {         "id": 22097,         "account_number": "300212657",         "account_bank": "flutterwave",         "full_name": "Flutterwave Developers",         "created_at": "2023-09-25T21:41:11.000Z",         "split_type": "percentage",         "split_value": 0.6,         "subaccount_id": "RS_24196D82F7AB6611C9D2E71E78215370",         "bank_name": "Flutterwave For Business"     } }`

##

Stamp Duties on Split Payment

For transactions above NGN 10,000, a [CBN stamp duty fee](https://flutterwave.com/us/blog/cbns-stamp-duty-charge-a-flutterwave-merchants-guide) of NGN 50 will be charged and debited from the settlement amount. If you set up your subaccount to receive a flat amount and your settlement amount is less than the flat amount, there will not be a split payment. Instead, the entire settlement amount will be sent to your main account.

For example, if you receive a transaction of NGN 15,000 and your subaccount is set to receive a flat amount of NGN 14,960, your subaccount will not be able to receive any amount for this transaction.

This is because after the CBN stamp duty of NGN 50 is debited, your settlement will become NGN 14,950, which is less than what you’ve set for the subaccount to receive. In a case like this, your settlement will be sent to your main account.

##

Learn More

If you need more details about splitting payments, [this article](https://flutterwave.com/us/blog/handling-split-payments-with-rave) goes through several possible scenarios when splitting payments across subaccounts.

To learn more about managing subaccounts with our API, check out the API reference. If you get lost, feel free to reach out to our [support team](https://flutterwave.com/support/submit-request).

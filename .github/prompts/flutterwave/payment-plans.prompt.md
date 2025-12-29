---
agent: flutterwave
---

# Payment Plans

Payment plans let you set up subscriptions for your customers on Flutterwave.

You can customize the billing interval, amount, and duration when creating a payment plan. When you first charge a customer, they are automatically subscribed to the plan.  
Flutterwave will then manage future billing cycles and offer options to cancel or reactivate the subscription.

### How Subscription Works

To use our subscription features, you will need to create a payment plan via our API or [from your dashboard](https://app.flutterwave.com/dashboard/home). Then, subscribe a customer to the plan by specifying the plan ID the first time you charge the customer. We'll handle subsequent charges when the billing is due.

> ## 📘 How Subscription Works
>
> Subscriptions are tied to a customer's email address and cannot be changed afterwards. This means that if a customer changes their email address on your app, you'll need to cancel any existing subscription and create a new one with the new email.

On subsequent billing cycles, we'll send the customer an email reminder before automatically charging them. If the charge fails, we'll try 3 more times at 30-minute intervals.

> ## 🚧 Cancelling Charge
>
> If we attempt to charge a customer and it fails three consecutive times, we'll cancel the user's subscription.

We'll send you a webhook notification whenever a charge succeeds or fails or when a subscription is cancelled.

To learn more about payment plans, check out our [Help Center](https://flutterwave.com/ng/support/my-account/creating-and-cancelling-payment-plans).

### Creating a Payment Plan

To create a payment plan, you'll need to specify these details:

| parameter             | meaning                                                                                              |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| `name`                | The name of the plan. This will be used on the email reminders we send customers.                    |
| `interval`            | This is the billing interval. Here are the supported values:                                         |
|                       | `hourly` `daily` `weekly` `monthly` `yearly` `quarterly` `bi-annually` `every x y`                   |
|                       | (where x is a number and y is a period, e.g. "every five months", "every 90 days", "every one year") |
| `amount` (optional)   | The amount to charge the customer each time. You can set the amount when creating the plan           |
|                       | or collecting the first payment or both (see Dynamic amounts).                                       |
| `currency` (optional) | The currency to charge in. The default is "NGN".                                                     |
| `duration` (optional) | How long the subscription should last (in terms of the interval). For example,                       |
|                       | if the `interval` is `monthly`, a `duration` of `5` will charge the customer once a month            |
|                       | for 5 months and then stop. If you don't specify a duration,                                         |
|                       | we'll charge the customer indefinitely until they (or you) cancel.                                   |

Once you've got these details, call our create payment plans endpoint to create a new payment plan. Here's an example using our backend SDKs:

```js
// Install with: npm i flutterwave-node-v3

const Flutterwave = require("flutterwave-node-v3");
const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);
const details = {
  amount: 5000,
  name: "Church collections plan",
  interval: "monthly",
};
flw.PaymentPlan.create(details).then(console.log).catch(console.log);
```

And you'll get a response like this:

```json
// Sample response
{
  "status": "success",
  "message": "Payment plan created",
  "data": {
    "id": 3807,
    "name": "Church collections plan",
    "amount": 5000,
    "interval": "monthly",
    "duration": 48,
    "status": "active",
    "currency": "NGN",
    "plan_token": "rpp_12d2ef3d5ac1c13b9d30",
    "created_at": "2020-01-16T18:08:19.000Z"
  }
}
```

### Adding a Customer to a Subscription

To add a customer to a subscription, specify the payment plan ID when charging the customer for the first time. This works regardless of how you're charging your customers—Inline, Standard, HTML checkout, or direct card charge.

> ## 📘 Integration Tip
>
> The `currency` you specify when charging the customer must be the same as the currency you specified when creating the payment plan.

> ## 🚧 Card Payments Only
>
> If you include a payment plan when initiating a payment, the payment method will automatically be fixed to `card`.
> Here's an example of charging a customer and subscribing them to a payment plan using the direct card charge endpoint:

```js
const response = await got.post(
  "https://api.flutterwave.com/v3/charges?type=card",
  {
    headers: {
      Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
    },
    json: {
      // other fields...
      payment_plan: 3807,
    },
  }
);
```

After the first successful payment, Flutterwave will charge the card subsequently based on the interval set for the payment plan.

### Dynamic Amounts

When you want to charge customers different amounts on the same plan, or charge a different amount for the first month (for example, as a launch promo), you can do this by setting the `amount` when charging the customer. Here are your options:

- **To charge a different amount per customer**: Don't set `amount` when **creating the payment plan**. The `amount` you set when charging the customer will be used for that customer's subscription.
- **To charge the customer a different amount the first time, and a standard amount for subsequent payments**: Specify the standard `amount` when creating the payment plan, and specify the custom `amount` when charging the customer. We'll charge the customer the custom amount for the first payment, and the standard amount on the plan for subsequent payments.

## Cancelling and Activating

Cancelling a subscription can happen in one of three ways:

1.  A customer can cancel their subscription using the cancellation link in our email reminders. You can disable this in the **Account Settings page** of your dashboard.
2.  You can cancel an individual customer's subscription, either from the **Payment Plans** page on your dashboard or via the cancel subscription endpoint.
3.  You can cancel an entire payment plan, which will cancel all associated subscriptions. You can also do this from the **Payment Plans page** on your dashboard or via the cancel payment plan endpoint.

Cancelling a subscription will tigger a webhook event.

Cancelled subscriptions and payment plans can be activated later using the activate subscription and update payment plan endpoints respectively.

## Webhooks

Each time we try to charge the customer's card, we'll send a notification to your webhook URL containing the details and result of the charge. We'll also send a webhook when the subscription is cancelled.

Here are some sample webhooks:

Successful Charge

````js
{
  "event": "charge.completed",
  "data": {
    "id": 285959875,
    "tx_ref": "Links-616626414629",
    "flw_ref": "PeterEkene/FLW270177170",
    "device_fingerprint": "a42937f4a73ce8bb8b8df14e63a2df31",
    "amount": 100,
    "currency": "NGN",
    "charged_amount": 100,
    "app_fee": 1.4,
    "merchant_fee": 0,
    "processor_response": "Approved by Financial Institution",
    "auth_model": "PIN",
    "ip": "197.210.64.96",
    "narration": "CARD Transaction ",
    "status": "successful",
    "payment_type": "card",
    "created_at": "2020-07-06T19:17:04.000Z",
    "account_id": 17321,
    "customer": {
      "id": 215604089,
      "name": "Yemi Desola",
      "phone_number": null,
      "email": "user@gmail.com",
      "created_at": "2020-07-06T19:17:04.000Z"
    },
    "card": {
      "first_6digits": "123456",
      "last_4digits": "7889",
      "issuer": "VERVE FIRST CITY MONUMENT BANK PLC",
      "country": "NG",
      "type": "VERVE",
      "expiry": "02/23"
    }
  }
}```

Cancelled Subscription

```json
{
  "event": "subscription.cancelled",
  "data": {
    "status": "deactivated",
    "currency": "NGN",
    "amount": 200,
    "customer": {
      "email": "adeoyesamuel14@gmail.com",
      "full_name": "Anonymous customer"
    },
    "plan": {
     "id": 10944,
      "name": "month",
      "amount": 200,
      "currency": "NGN",
      "interval": "monthly",
      "duration": 1,
      "status": "cancel",
      "date_created": "2021-04-19T10:52:06.000Z"
    }
  }
}```

## Learn More

To learn more about what you can do with payment plans on Flutterwave, check out our reference docs. If you have any questions, [reach out to us](https://flutterwave.com/support/submit-request).

Updated about 1 year ago

````

# Monthly Donation Mandate System - Implementation Guide

## Overview
This guide covers the complete setup for a monthly donation system using Mono's Direct Debit API with Firebase backend.

---

## 1. Firestore Data Structure

### Collections

#### `users` Collection
```typescript
{
  uid: string;                    // Firebase Auth UID
  email: string;
  displayName: string;
  phoneNumber: string;
  activeMandateId?: string;       // Reference to current mandate
  hasActiveMandate: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  fcmToken?: string;              // For push notifications
}
```

#### `mandates` Collection
```typescript
{
  userId: string;                 // Reference to user
  mandateId: string;              // Mono mandate ID (e.g., mmc_xxx)
  customerId: string;             // Mono customer ID
  monthlyAmount: number;          // Amount in Naira
  status: 'pending_authorization' | 'created' | 'approved' | 'ready_to_debit' | 'paused' | 'cancelled';
  monoStatus: string;             // Raw status from Mono
  reference: string;              // Unique reference
  accountNumber: string;
  bankCode: string;
  bankName: string;
  startDate: string;              // YYYY-MM-DD
  endDate: string;                // YYYY-MM-DD
  frequency: 'monthly';
  readyToDebit: boolean;
  approvedAt?: Timestamp;
  readyAt?: Timestamp;
  lastDebitAt?: Timestamp;
  cancelledAt?: Timestamp;
  pausedAt?: Timestamp;
  totalDebited: number;           // Running total
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### `transactions` Collection
```typescript
{
  mandateId: string;              // Reference to mandate
  type: 'debit';
  status: 'successful' | 'failed' | 'processing';
  amount: number;                 // In Naira
  fee: number;                    // Transaction fee
  referenceNumber: string;        // Mono reference
  accountDetails: {
    bank_code: string;
    account_name: string;
    account_number: string;
    bank_name: string;
  };
  beneficiary: {
    bank_code: string;
    account_name: string;
    account_number: string;
    bank_name: string;
  };
  failureReason?: string;
  responseCode?: string;
  date: Timestamp;
  createdAt: Timestamp;
}
```

#### `webhook_events` Collection
```typescript
{
  event: string;                  // Event type
  event_id: string;               // Unique event ID (for deduplication)
  data: any;                      // Full webhook payload
  processedAt: Timestamp;
}
```

#### `notifications` Collection
```typescript
{
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: Timestamp;
}
```

---

## 2. Setup Instructions

### Step 1: Create Mono Sub-Accounts (One-time Setup)

Before integrating, create two sub-accounts for split payments:

```bash
curl -X POST https://api.withmono.com/v2/payments/payout/sub-account \
  -H "Content-Type: application/json" \
  -H "mono-sec-key: YOUR_SECRET_KEY" \
  -d '{
    "nip_code": "000014",
    "account_number": "0123456789"
  }'
```

Save the returned `id` for each sub-account. You'll need these IDs in your code.

### Step 2: Configure Firebase Functions

1. Install dependencies:
```bash
npm install firebase-functions firebase-admin axios
npm install --save-dev typescript @types/node
```

2. Set Mono secret key:
```bash
firebase functions:config:set mono.secret_key="YOUR_MONO_SECRET_KEY"
```

3. Deploy functions:
```bash
firebase deploy --only functions
```

### Step 3: Configure Webhook URL

In your Mono dashboard, set webhook URL to:
```
https://YOUR_PROJECT_ID.cloudfunctions.net/monoWebhook
```

### Step 4: Frontend Integration

Update the form component with your actual Firebase Function URLs:

```typescript
// Replace in the React component
const response = await fetch('YOUR_FIREBASE_FUNCTION_URL/createMonoCustomer', {
  // ... becomes ...
const response = await fetch('https://YOUR_PROJECT_ID.cloudfunctions.net/createMonoCustomer', {
```

Or use the Firebase SDK (recommended):

```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const createMonoCustomer = httpsCallable(functions, 'createMonoCustomer');

// In your form handler:
const customerResponse = await createMonoCustomer({
  email: values.email,
  first_name: values.firstName,
  last_name: values.lastName,
  address: values.address,
  phone: values.phone,
  identity: {
    type: 'bvn',
    number: values.bvn,
  },
});
```

---

## 3. Data Flow Diagram

```
┌─────────────────┐
│  User fills     │
│  donation form  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Create Mono Customer    │
│ (Firebase Function)     │
│ Stores in Mono DB       │
└────────┬────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Create Fixed Mandate             │
│ with Split Payment               │
│ (Firebase Function)              │
│ • 60% → Sub-Account 1            │
│ • 40% → Sub-Account 2            │
└────────┬─────────────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Save to Firestore       │
│ mandates collection     │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ User authorizes via     │
│ Mono widget (₦50)       │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Webhooks update status  │
│ • created               │
│ • approved              │
│ • ready_to_debit        │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Monthly auto-debits     │
│ (Mono handles this)     │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Webhook: debit success  │
│ Store in transactions   │
└─────────────────────────┘
```

---

## 4. What Data Goes Where?

### Store in Mono (via API):
- ✅ Customer KYC info (name, BVN, address, phone, email)
- ✅ Bank account details
- ✅ Mandate configuration (amount, dates, frequency)
- ✅ Transaction history

### Store in Firebase:
- ✅ User authentication data
- ✅ References to Mono IDs (customerId, mandateId)
- ✅ Mandate status tracking
- ✅ Aggregated transaction summaries
- ✅ User preferences & settings
- ✅ Notifications

### Don't Duplicate:
- ❌ Don't store sensitive bank details in Firebase
- ❌ Don't store BVN in Firebase
- ❌ Don't replicate full transaction data (just summaries)

---

## 5. Key Integration Points

### E-Mandate vs Signed Mandate

**E-Mandate** (Recommended for your use case):
- Faster approval (1-3 minutes)
- User sends ₦50 to NIBSS account
- Ready to debit after 24 hours
- Works with retail accounts

**Signed Mandate**:
- Slower approval (1-72 hours)
- Requires bank confirmation
- No ₦50 payment
- Ready immediately after approval

For monthly donations, **use E-Mandate** with `mandate_type: 'emandate'`.

### Split Payment Configuration

In the mandate creation, the split happens automatically:

```typescript
split: {
  type: 'percentage',
  fee_bearer: 'business', // Your org pays fees
  distribution: [
    {
      account: 'SUB_ACCOUNT_ID_1', // 60% recipient
      value: 60,
    },
    {
      account: 'SUB_ACCOUNT_ID_2', // 40% recipient
      value: 40,
    },
  ],
}
```

**Important**: The percentages must not exceed 100%, and Mono reserves some for fee offsetting.

---

## 6. Testing Flow

### Sandbox Testing:

1. Use test secret key from Mono dashboard
2. Create customer with any random BVN (sandbox accepts any)
3. Create mandate - it auto-approves in sandbox
4. Test webhooks are sent automatically

### Production Testing:

1. Use small amount (₦200 minimum)
2. Test with real bank account
3. Complete ₦50 authorization
4. Wait 24 hours for "ready to debit"
5. Monitor first debit via webhooks

---

## 7. User Actions

### Pause Donation
```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const pauseMandate = httpsCallable(functions, 'pauseMandate');

await pauseMandate({ mandateId: 'mmc_xxx' });
```

### Resume Donation
```typescript
const reinstateMandate = httpsCallable(functions, 'reinstateMandate');
await reinstateMandate({ mandateId: 'mmc_xxx' });
```

### Cancel Donation
```typescript
const cancelMandate = httpsCallable(functions, 'cancelMandate');
await cancelMandate({ mandateId: 'mmc_xxx' });
```

---

## 8. Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only read their own mandates
    match /mandates/{mandateId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if false; // Only backend can write
    }
    
    // Users can only read their own transactions
    match /transactions/{transactionId} {
      allow read: if request.auth != null;
      allow write: if false; // Only backend can write
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 9. Pricing Considerations

### Mono Fees (Deducted from transactions):
- ₦200 - ₦20,000: ₦65 minimum per transaction
- Above ₦20,000: 1% capped at ₦1,000

### Setup Costs:
- Sub-account creation: Free
- E-mandate setup: ₦50 (paid by user to NIBSS)
- Balance inquiry: ₦100 (if needed)

Since you set `fee_bearer: 'business'`, your organization pays the transaction fees, not the donor.

---

## 10. Monitoring & Alerts

Create a Cloud Function to alert you of issues:

```typescript
export const mandateMonitor = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    // Check for mandates that should be ready but aren't
    const mandates = await admin.firestore()
      .collection('mandates')
      .where('status', '==', 'approved')
      .where('readyToDebit', '==', false)
      .get();
    
    // Alert if any are stuck
    if (!mandates.empty) {
      // Send alert to admin
    }
  });
```

---

## 11. Common Issues & Solutions

### Issue: Mandate not approved
- **Solution**: Check if user sent ₦50 from correct account
- **Check**: Webhook events in Firestore

### Issue: Debit failed
- **Reason**: Insufficient funds
- **Solution**: Automatic retries (retrial_frequency: 3)

### Issue: Split not working
- **Solution**: Verify sub-account IDs are correct
- **Check**: Mono dashboard for sub-accounts

---

## 12. Next Steps

1. ✅ Set up Mono account and get API keys
2. ✅ Create two sub-accounts for split payments
3. ✅ Deploy Firebase Functions
4. ✅ Configure webhook URL in Mono dashboard
5. ✅ Update React form with sub-account IDs
6. ✅ Test in sandbox environment
7. ✅ Test with small amount in production
8. ✅ Launch! 🚀

---

## Support

- Mono Docs: https://docs.mono.co
- Mono Support: support@mono.co
- Firebase Docs: https://firebase.google.com/docs
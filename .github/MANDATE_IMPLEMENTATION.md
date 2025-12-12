# Mandate System Implementation Guide

## Overview

The mandate (recurring donation/pledge) system has been reworked following Mono API best practices and architecture guidelines provided. The system now properly implements the complete flow:

1. **User Signs In** → Authenticated via Firebase Auth
2. **Fill Donation Form** → Collect amount, bank details, BVN
3. **Create Mono Customer** → KYC verification in Mono's system
4. **Create Fixed Mandate with Split Payment** → Configure recurring debits
5. **User Authorizes Mandate** → Via Mono's authorization widget
6. **Store Minimal Data** → Only essential IDs and metadata in Firebase
7. **Manage Mandate** → Pause, resume, or cancel via admin interface

## Architecture Changes

### Core Principle: Client-Side First

The system prioritizes **client-side Mono integration** over Firebase Functions:

- Mono API calls happen directly from the browser
- Firebase stores only mandate references and status
- Mono handles all mandate state management and debits
- Firebase listens to webhooks for status updates

### Files Modified

#### 1. **src/api/mandate/index.ts** (Core API)

**Key Changes:**

- Enhanced `create()` function with proper Mono integration
- Step 1: Create Mono Customer with KYC data
- Step 2: Create Fixed Mandate with E-Mandate type
- Step 3: Store minimal data in Firestore
- Improved `pause()`, `cancel()`, `reinstate()` functions with error handling
- Simplified `list()` function to fetch all mandates

**New Error Handling:**

```typescript
// Customer creation with duplicate check
try {
  customerResponse = await mono.$use.customer.create(monoCustomerPayload);
} catch (error: any) {
  if (error.response?.status === 400) {
    throw new Error("Customer with this email/BVN already exists in Mono");
  }
  throw error;
}
```

**Mono Mandate Configuration:**

```typescript
{
  amount: payload.amount,           // In Naira (e.g., 5000 = ₦5,000)
  type: "recurring-debit",          // Type of payment
  method: "mandate",                // Payment method
  mandate_type: "emandate",         // E-Mandate: faster, user pays ₦50
  debit_type: "fixed",              // Same amount each time
  description: `LAUMGA Foundation ${payload.frequency} contribution`,
  reference: uniqueReference,
  customer: { id: monoCustomerId },
  start_date: "YYYY-MM-DD",         // When debits begin
  end_date: "YYYY-MM-DD",           // When debits end
  split: splitConfiguration,        // Distribute funds to 2 sub-accounts
  meta: {                           // Custom metadata
    userId,
    tier,
    frequency,
    bankCode,
    accountNumber
  }
}
```

#### 2. **src/layouts/mandate/mandate-pledge-form.tsx** (User-Facing Form)

**Key Changes:**

- Added error state and error alert display
- Proper error handling in `handleSubmit`
- Error messages from Mono API displayed to user
- Alert component removed `closeButtonProps` (unsupported in Mantine)
- Form validation via Zod schema

**Error Handling Example:**

```typescript
const [creationError, setCreationError] = useState<string | null>(null);

const handleSubmit = async (data: CreateMandateInput) => {
  if (!user) {
    setCreationError("You must be logged in to create a mandate");
    return;
  }

  setCreationError(null);

  try {
    const result = await createMandate.mutateAsync({ user, data });
    if (result.monoUrl) {
      setMonoUrl(result.monoUrl); // Show authorization widget
    }
  } catch (error: any) {
    const errorMessage = error?.message || "Failed to create mandate";
    setCreationError(errorMessage);
  }
};
```

**User Flow After Creation:**

1. Mandate shell created in Mono
2. User sees authorization alert
3. User clicks "Authorize Mandate"
4. Opens Mono widget (authorization URL)
5. User sends ₦50 to NIBSS account
6. Mandate moves to "approved" status
7. After 24 hours, moves to "ready_to_debit"
8. Automatic debits begin on schedule

#### 3. **src/routes/admin/mandates.tsx** (Admin Management Page)

**Key Changes:**

- Import `useAuth`, pause/resume/cancel hooks, notifications
- Add `Section` component wrapper for consistent styling
- Implement confirmation modal for destructive actions
- Wire up action handlers for pause, resume, cancel
- Toast notifications for success/error feedback
- Optimistic refetch after actions

**Action Handler Pattern:**

```typescript
const handlePauseMandate = async (mandateId: string) => {
  if (!user) return;

  try {
    await pauseMandate.mutateAsync({
      id: mandateId,
      user,
    });

    notifications.show({
      title: "Mandate paused",
      message: "The mandate has been paused successfully.",
      color: "green",
    });

    refetch(); // Refresh the table
    setConfirmAction(null); // Close modal
  } catch (error: any) {
    notifications.show({
      title: "Error",
      message: error.message || "Failed to pause mandate",
      color: "red",
    });
  }
};
```

**Confirmation Modal:**

- Shows before pause/resume/cancel actions
- Displays warning about what will happen
- Prevents accidental mandate changes
- Shows loading state during action

#### 4. **src/api/mandate/hooks.ts** (React Query Integration)

**Key Changes:**

- Fixed `useListMandates` to accept optional variables
- Updated import to use correct `ListMandateVariables` type
- All mutation hooks have proper error/success messages

```typescript
export function useListMandates(variables?: ListMandateVariables) {
  return useQuery({
    queryKey: mandate.list.$get(),
    queryFn: () => mandate.$use.list(variables || {}),
  });
}
```

## Data Flow

### Mandate Creation Flow

```
┌─────────────────────────┐
│  User fills pledge form │
│ (amount, bank, BVN)     │
└────────────┬────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Create Mono Customer (KYC)       │
│ POST /v2/customers               │
│ ← Returns: monoCustomerId        │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Create Fixed Mandate             │
│ POST /v2/payments/initiate       │
│ ← Returns: monoUrl, mandateId    │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Save to Firebase                 │
│ status: "initiated"              │
│ Store only: IDs, dates, amount   │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ User sees authorization alert    │
│ "Authorize with Mono"            │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ User authorizes via Mono widget  │
│ Sends ₦50 to NIBSS account       │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Mono Webhook: mandate.authorized │
│ Update Firebase status: "active"  │
│ Automatic debits begin            │
└──────────────────────────────────┘
```

### Mandate Management Flow

```
Active Mandate
├─ Pause → status: "paused"
│  └─ Resume → status: "active"
├─ Cancel → status: "cancelled"
│  └─ (Cannot resume)
└─ View Details
   └─ See charges, next date, etc.
```

## Firebase Data Structure

### Mandates Collection

```typescript
{
  id: string; // Firebase doc ID
  userId: string; // Reference to user
  monoMandateId: string; // Mono's mandate ID
  monoCustomerId: string; // Mono's customer ID
  monoReference: string; // Unique reference
  monoUrl: string | null; // Authorization URL
  amount: number; // Amount in Naira
  frequency: "monthly" | "quarterly" | "annually" | "one-time";
  duration: "12-months" | "24-months" | "indefinite";
  tier: "supporter" | "builder" | "guardian" | "custom";
  status: "initiated" | "active" | "paused" | "cancelled" | "completed";
  startDate: string; // ISO date
  endDate: string; // ISO date
  nextChargeDate: string | null; // ISO date
  created: {
    (by, name, photoUrl, at);
  }
  updated: {
    (by, name, photoUrl, at);
  }
}
```

## Mono Integration Details

### E-Mandate vs Signed Mandate

**E-Mandate (Used):**

- Faster approval (1-3 minutes)
- User sends ₦50 to NIBSS account
- Ready to debit after 24 hours
- Works with retail accounts
- Suitable for small donations

**Signed Mandate:**

- Slower approval (1-72 hours)
- Requires bank confirmation
- No ₦50 payment
- Ready immediately after approval
- Better for large amounts

### Split Payment Configuration

Funds are automatically split between two sub-accounts:

```typescript
split: {
  type: "percentage",
  fee_bearer: "business",        // Organization pays fees
  sub_accounts: [
    { sub_account: "SUB_ACCOUNT_ID_1", value: 60 },  // 60%
    { sub_account: "SUB_ACCOUNT_ID_2", value: 40 },  // 40%
  ]
}
```

### Webhook Events to Monitor

```
mandate.created
├─ Mandate created, waiting for authorization

mandate.approved
├─ User authorized, but not ready to debit yet

mandate.ready
├─ Mandate ready for debits (24 hours after approval)

debit.successful
├─ Successful charge occurred
├─ Update nextChargeDate
├─ Record transaction

debit.failed
├─ Charge failed
├─ Reason stored in transaction
├─ Mono retries automatically

mandate.cancelled
├─ Mandate was cancelled
├─ Status updated to "cancelled"
```

## Admin Actions

### Pause Mandate

- **When:** Active mandate
- **Action:** Mono API `PATCH /v3/payments/mandates/{id}/pause`
- **Result:** Status changes to "paused"
- **Debits:** Stop immediately

### Resume Mandate

- **When:** Paused mandate
- **Action:** Mono API `PATCH /v3/payments/mandates/{id}/reinstate`
- **Result:** Status changes to "active"
- **Debits:** Resume on next scheduled date

### Cancel Mandate

- **When:** Active, paused, or initiated mandate
- **Action:** Mono API `PATCH /v3/payments/mandates/{id}/cancel`
- **Result:** Status changes to "cancelled"
- **Debits:** Stop permanently (cannot be undone)

### Delete Mandate

- **Note:** Currently not implemented
- **Future:** Firestore deletion (only for "cancelled" or "initiated" mandates)

## Testing Checklist

### Unit Tests

- [ ] Mandate creation with valid bank details
- [ ] Duplicate customer detection (email/BVN)
- [ ] Mono API error handling
- [ ] Firebase storage of mandate data
- [ ] Pause/resume/cancel operations

### Integration Tests

- [ ] End-to-end mandate creation
- [ ] Authorization flow
- [ ] Webhook status updates
- [ ] Admin action execution

### Manual Testing

- [ ] Form validation (missing fields)
- [ ] Error messages display properly
- [ ] Authorization URL opens correctly
- [ ] Admin actions show confirmation modal
- [ ] Toast notifications appear
- [ ] Table refreshes after actions

## Environment Variables

Ensure these are set in `.env.local`:

```env
VITE_MONO_API_URL=https://api.withmono.com
VITE_MONO_PUBLIC_KEY=your_public_key
VITE_MONO_SECRET_KEY=your_secret_key
```

## Error Scenarios

### Customer Already Exists

- **Cause:** Same email/BVN already created in Mono
- **Message:** "Customer with this email/BVN already exists in Mono"
- **Solution:** Use different email or contact support

### Mono API Failure

- **Cause:** Network error, invalid data, rate limiting
- **Message:** Specific error from Mono API
- **Solution:** Retry after fix or contact Mono support

### Authorization Failed

- **Cause:** User didn't complete ₦50 payment or canceled
- **Message:** Mandate remains in "initiated" status
- **Solution:** User can re-authorize or create new mandate

### Debit Failed

- **Cause:** Insufficient funds, account closed, invalid bank details
- **Message:** Error stored in transaction record
- **Solution:** Mono retries automatically (3 times)

## Future Enhancements

1. **Webhook Handling:** Implement Firebase Cloud Functions to listen to Mono webhooks
2. **Transaction History:** Display past debits and failed attempts
3. **Amendment:** Allow users to change amount mid-mandate
4. **Analytics:** Dashboard showing total pledges, revenue, etc.
5. **Notifications:** Email/SMS to users about charges
6. **Batch Operations:** Admin action on multiple mandates
7. **Verification:** Manual mandate verification before auto-debit

## Security Considerations

1. **BVN Storage:** Never store BVN in Firebase (only in Mono)
2. **API Keys:** Use environment variables, never hardcode
3. **User Auth:** Verify user before allowing mandate creation
4. **Admin Actions:** Only admins can pause/cancel mandates
5. **Webhook Verification:** Verify Mono webhook signatures
6. **Rate Limiting:** Implement on mandate creation endpoint

## References

- **Mono API Docs:** https://docs.mono.co
- **Mono Webhook Events:** https://docs.mono.co/webhooks
- **E-Mandate Guide:** https://docs.mono.co/emandate
- **Split Payments:** https://docs.mono.co/split-payments

## Support

For issues or questions:

1. Check Mono API documentation
2. Review error messages in browser console
3. Check Firebase Firestore for mandate records
4. Monitor Mono dashboard for webhook events
5. Contact Laumga development team

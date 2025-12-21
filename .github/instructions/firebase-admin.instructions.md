---
applyTo: "**"
---

# Firebase Admin SDK Setup

## Overview

The application now uses **Firebase Admin SDK** for server-side operations that require elevated permissions. This allows server functions to bypass Firestore security rules when necessary (e.g., when creating mandates).

## Setup Instructions

### 1. Generate Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon (⚙️) → **Project Settings**
4. Navigate to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Click **Generate Key** to download the JSON file

⚠️ **Important**: Keep this file secure! Never commit it to version control.

### 2. Add to Environment Variables

1. Open the downloaded JSON file
2. Copy the entire JSON content (it should be a single object with keys like `project_id`, `private_key`, etc.)
3. Open your `.env` file (create one if it doesn't exist)
4. Add the following line with the JSON as a single-line string:

```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

### 3. Verify Setup

Run the application and try creating a mandate. If the environment variable is not set correctly, you'll see an error:

```shell
Error: FIREBASE_SERVICE_ACCOUNT environment variable is not set
```

or

```shell
Error: Failed to initialize Firebase Admin SDK: ...
```

## How It Works

- **Client-side Firebase**: Used for authentication, reading data, and operations that respect security rules
- **Server-side Admin SDK**: Used in server functions (`createServerFn`) to perform write operations with elevated privileges

### Files Modified

- `src/services/firebase-admin.ts` - Admin SDK initialization
- `src/api/mandate/index.ts` - Converted to use Admin SDK for writes
- `.env.example` - Added `FIREBASE_SERVICE_ACCOUNT` variable

### Server Functions Using Admin SDK

All mandate operations now use Admin SDK:

- `create` - Creates mandate with Flutterwave tokenization
- `syncStatus` - Syncs mandate status with Flutterwave
- `pause` - Pauses an active mandate
- `cancel` - Cancels a mandate
- `reinstate` - Reactivates a paused mandate

## Security Rules

The Firestore security rules remain unchanged. Users can read their own mandates, but only server functions (with Admin SDK) can create/update them. This provides an additional security layer where business logic validation happens server-side.

## Troubleshooting

### Error: Missing or insufficient permissions

This means the server function is trying to use the client SDK instead of Admin SDK. Ensure:

- The server function is using `getAdminFirestore()` instead of `db`
- The function is wrapped in `createServerFn()`

### Error: FIREBASE_SERVICE_ACCOUNT environment variable is not set

- Check that your `.env` file exists in the project root
- Verify the variable name is exactly `FIREBASE_SERVICE_ACCOUNT`
- Ensure the JSON is properly formatted (no extra spaces, all on one line)
- Restart your development server after adding the variable

### Invalid JSON error

The service account JSON must be:

- Properly escaped (especially the private key with `\n` newlines)
- A single line (remove all actual line breaks)
- Valid JSON (use a JSON validator if unsure)

Example of properly formatted private key in the JSON:

```json
"private_key": "-----BEGIN PRIVATE KEY-----\\nMIIE...\\n-----END PRIVATE KEY-----\\n"
```

---
agent: firebase
---

# Use Firebase in dynamic web apps with SSR (Server-side Rendering) bookmark_borderbookmark Stay organized with collections Save and categorize content based on your preferences.

- On this page
- The FirebaseServerApp lifecycle
  - Cleaning up FirebaseServerApp instances
- Resume authenticated sessions created on the client
- Use App Check in SSR environments
- Pass client tokens to the server-side rendering phase

If you have worked with the Firebase JS SDK or other Firebase client SDKs, you are probably familiar with the `FirebaseApp` interface and how to use it to configure app instances. To facilitate similar operations on the server side, Firebase provides `FirebaseServerApp`.

`FirebaseServerApp` is a variant of `FirebaseApp` for use in server-side rendering (SSR) environments. It includes tools to continue Firebase sessions that span the client side rendering (CSR) / server-side rendering divide. These tools and strategies can help enhance dynamic web apps built with Firebase and deployed in Google environments like Firebase App Hosting.

Use `FirebaseServerApp` to:

- Execute server-side code within the _user_ context, in contrast to the Firebase Admin SDK which has full administration rights.
- Enable the use of App Check in SSR environments.
- Continue a Firebase Auth session that was created in the client.

## The FirebaseServerApp lifecycle

Server-side rendering (SSR) frameworks and other non-browser runtimes such as cloud workers optimize for initialization time by reusing resources across multiple executions. `FirebaseServerApp` is designed to accommodate these environments by using a reference count mechanism. If an app invokes `initializeServerApp` with the same parameters as a previous `initializeServerApp`, it receives the same `FirebaseServerApp` instance that was already initialized. This cuts down on unnecessary initialization overhead and memory allocations. When `deleteApp` is invoked on a `FirebaseServerApp` instance, it reduces the reference count, and the instance is freed after the reference count reaches zero.

### Cleaning up `FirebaseServerApp` instances

It can be tricky to know when to call `deleteApp` on a `FirebaseServerApp` instance, especially if you are running many asynchronous operations in parallel. The `releaseOnDeref` field of the `FirebaseServerAppSettings` helps simplify this. If you assign `releaseOnDeref` a reference to an object with the lifespan of the request's scope (for example, the headers object of the SSR request), the `FirebaseServerApp` will reduce its reference count when the framework reclaims the header object. This automatically cleans up your `FirebaseServerApp` instance.

Here's an example usage of `releaseOnDeref`:

```tsx
/// Next.js
import { headers } from 'next/headers'
import { FirebaseServerAppSettings, initializeServerApp} from "@firebase/app";

export default async function Page() {
  const headersObj = await headers();
  appSettings.releaseOnDeref = headersObj;
  let appSettings: FirebaseServerAppSettings = {};
  const serverApp = initializeServerApp(firebaseConfig, appSettings);
  ...
}
```

## Resume authenticated sessions created on the client

When an instance of `FirebaseServerApp` is initialized with an Auth ID token, it enables bridging of authenticated user sessions between the client-side rendering (CSR) and server-side rendering (SSR) environments. Instances of the Firebase Auth SDK initialized with a `FirebaseServerApp` object containing an Auth ID token will attempt to sign in the user on initialization without the need for the application to invoke any sign-in methods.

Providing an Auth ID token allows apps to use any of Auth's sign-in methods on the client, ensuring that the session continues on the server-side, even for those sign-in methods that require user interaction. Additionally, it enables the offloading of intensive operations to the server such as authenticated Firestore queries, which should improve your app's rendering performance.

```tsx
/// Next.js
import { initializeServerApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Replace the following with your app's
// Firebase project configuration
const firebaseConfig = {
  // ...
};

const firebaseServerAppSettings = {
  authIdToken: token, // See "Pass client tokens to the server side
  // rendering phase" for an example on how transmit
  // the token from the client and the server.
};

const serverApp = initializeServerApp(
  firebaseConfig,
  firebaseServerAppSettings
);
const serverAuth = getAuth(serverApp);

// FirebaseServerApp and Auth will now attempt
// to sign in the current user based on provided
// authIdToken.
```

## Use App Check in SSR environments

App Check enforcement relies on an App Check SDK instance that Firebase SDKs use to internally call `getToken`. The resulting token is then included in requests to all Firebase services, allowing the backend to validate the app.

However, because the App Check SDK needs a browser to access specific heuristics for app validation, it can't be initialized in server environments.

`FirebaseServerApp` provides an alternative. If a client-generated App Check token is provided during `FirebaseServerApp` initialization, it will be used by the Firebase product SDKs when invoking Firebase services, eliminating the need for an App Check SDK instance.

```tsx
/// Next.js
import { initializeServerApp } from "firebase/app";

// Replace the following with your app's
// Firebase project configuration
const firebaseConfig = {
  // ...
};

const firebaseServerAppSettings = {
  appCheckToken: token, // See "Pass client tokens to the server side
  // rendering phase" for an example on how transmit
  // the token from the client and the server.
};

const serverApp = initializeServerApp(
  firebaseConfig,
  firebaseServerAppSettings
);

// The App Check token will now be appended to all Firebase service requests.
```

## Pass client tokens to the server-side rendering phase

To transmit authenticated Auth ID tokens (and App Check tokens) from the client to the server-side rendering (SSR) phase, use a service worker. This approach involves intercepting fetch requests that trigger SSR and appending the tokens to the request headers.

Refer to Session management with service workers for a reference implementation of a Firebase Auth service worker. Also see Server side changes for code that demonstrates how to parse these tokens from the headers for use in `FirebaseServerApp` initialization.

## Streamline SSR app development with FirebaseServerApp

Working with Server-Side Rendering (SSR) frameworks and the traditional Firebase JavaScript SDK can present challenges in handling Firebase Auth user sessions in both CSR (Client-Side Rendering) and SSR code. Often implementations duplicate logic on the client and the server, which can increase code complexity, introduce race conditions, and significantly increase render time while waiting for redundant asynchronous operations to complete.

To address these challenges, the Firebase Web SDK has introduced `FirebaseServerApp`, a new type of `FirebaseApp` object that enables client-authenticated auth sessions created in the browser to be shared with SSR rendering phases in Node.js.

### FirebaseServerApp usage

The process of creating an instance of `FirebaseServerApp` is comparable to creating an instance of `FirebaseApp`. In fact, your application may use an instance of `FirebaseServerApp` wherever a `FirebaseApp` instance is used. However, there are a few additional pieces of information that can be configured in `FirebaseServerApp`, most importantly a Firebase Auth user ID token.

When an instance of `FirebaseServerApp` is initialized with an Auth ID token, it enables seamless bridging of authenticated user sessions between the client-side rendering (CSR) and server-side rendering (SSR) environments. Instances of the Firebase Auth SDK initialized with a `FirebaseServerApp` will attempt to log in the user on initialization without the need for the application to invoke any sign-in methods.

```javascript
import { initializeServerApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Replace the following with your app's
// Firebase project configuration
const firebaseConfig = {
  // ...
};

const firebaseServerAppSettings = {
  authIdToken: idToken, // We'll explain how to get the
  // idToken in the service worker
  // example below.
};

const serverApp = initializeServerApp(
  firebaseConfig,
  firebaseServerAppSettings
);
const serverAuth = getAuth(serverApp);

// FirebaseServerApp and Auth will now attempt
// to sign in the current user based on provided
// authIdToken.
```

The use of `FirebaseServerApp` allows developers to leverage any of Auth’s many sign-in methods on the client, ensuring that the session seamlessly continues on the server-side, even for those sign-in methods that require user interaction. Additionally, it enables the offloading of heavy-lifting operations to the server, such as database queries, which should improve your app’s rendering performance.

Now that we have the baseline down, let’s go over some recommendations for your app’s use of `FirebaseServerApp`.

### Plumbing Auth ID Tokens into the SSR phase

[Our example Firebase Auth service worker](https://firebase.google.com/docs/auth/web/service-worker-sessions) facilitates the transmission of authenticated Auth ID tokens from the client to the SSR rendering phases. It works to intercept fetch requests that would trigger an SSR phase, and it appends the ID token in the request headers. In addition, it proactively attempts to refresh the token to minimize the possibility of invalid ID tokens reaching the SSR phase.

While you may write a custom solution using your chosen SSR framework to attach the User’s Auth ID token to the SSR request, we suggest at least reading over our service worker to note some of our best practices for Auth ID token management.

### Await authStateReady to ensure user authentication

Standard Firebase Auth sign in operations return a promise that applications may await before continuing. This allows apps to wait for the authentication steps to resolve, and then to leverage the signed-in user for other Firebase operations (storage, database access, etc) later on in the application flow.

In contrast, the initialization of the `FirebaseServerApp` returns immediately. It will attempt to sign in the user behind the scenes, which is a nice streamlined experience, but alas, there’s nothing to await.

Therefore, to ensure that your app actually has a signed in user before attempting to access databases, storage, or other operations, it’s recommended to await `FirebaseAuth.authStateReady()` or to use the `onAuthSateChanged` handler to detect user sign-in stemming from `FirebaseServerApp` initialization.

```javascript
const serverApp = initializeServerApp(
  firebaseConfig,
  firebaseServerAppSettings
);
const serverAuth = getAuth(serverApp);

await serverAuth.authStateReady();
if (serverAuth.currentUser === null) {
  // authIdToken was missing or invalid.
}

// Proceed with any Firebase operations that
// require a signed-in user.
```

### Handling no current user after initialization

It’s crucial to verify the existence of the `currentUser` in the Auth module after initialization is complete. If `currentUser` is null, it could indicate one of two things: either the `FirebaseServerAppSettings.authIdToken` was omitted during initialization, or the Auth service detected an invalid Auth ID token.

In these cases we recommend that your app redirects to a sign in page, as it’s probably a signal that the user either hasn’t signed in, or that their Auth session on the client has expired.

### FirebaseServerApp cleanup

In SSR applications, there might be many asynchronous operations running concurrently and independent of each other. It can be challenging to determine the precise end of the rendering pipeline, which raises the question: “when should I clean up the app’s use of the `FirebaseServerApp` object?”

`FirebaseServerApp` uses reference counting. Creating a new `FirebaseServerApp` with identical parameters will return the same `FirebaseServerApp` and increment its reference count. This design allows us to reuse the `FirebaseServerApp` with the same authorization header to save resources.

Invoking `FirebaseServerApp.delete()` will decrement the reference count and mark the object for deletion if the reference count drops to zero. In modern SSR frameworks however, it can be hard to determine when to delete the app—there’s an option to automatically decrement the reference count when another object (say the request) is garbage collected, with the `releaseOnDeref` field. Here’s an example in Next.js. Here, we assume that the Auth ID token was appended to the request headers by the example service worker mentioned above.

```javascript
// Example usage in Next.js.
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FirebaseServerAppSettings, initializeServerApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // ...
};

export default async function Page() {
  const headersList = await headers();
  const authIdToken = headersList.get("authorization")?.split(" ")[1];
  const serverApp = initializeServerApp(firebaseConfig, { authIdToken });
  const auth = getAuth(serverApp);
  await auth.authStateReady();
  if (!auth.currentUser) {
    return redirect("/unauthorized");
  }
  // ...
}
```

### What’s next

You can start using the `FirebaseServerApp` feature starting with the `10.10.0` release of the Firebase JavaScript SDK.

We’re working on new ideas to take FirebaseServerApp further and we’d like to hear your thoughts! Visit our [Firebase JavaScript SDK GitHub repository](https://github.com/firebase/firebase-js-sdk) if you encounter any technical issues, and reach out to us in our [Firebase UserVoice](https://firebase.uservoice.com/forums/948424-general) to let us know of any feature requests. Thanks!

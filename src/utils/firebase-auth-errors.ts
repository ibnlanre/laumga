import { FirebaseError } from "firebase/app";

const DEFAULT_MESSAGE = "Authentication failed. Please try again.";

const firebaseErrorMessages: Record<string, string> = {
  "auth/claims-too-large": "Account data is too large.",
  "auth/email-already-exists": "This email is already registered.",
  "auth/id-token-expired": "Your session expired. Please sign in again.",
  "auth/id-token-revoked": "Your session was revoked. Please sign in again.",
  "auth/insufficient-permission": "You don't have permission to do that.",
  "auth/internal-error": "Something went wrong. Please try again later.",
  "auth/invalid-argument": "Invalid input. Please check your information.",
  "auth/invalid-claims": "Account data error. Please contact support.",
  "auth/invalid-continue-uri": "Invalid link. Please try again.",
  "auth/invalid-creation-time": "Invalid date format.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/invalid-disabled-field": "Invalid account status.",
  "auth/invalid-display-name": "Please enter a valid name.",
  "auth/invalid-dynamic-link-domain": "Link configuration error.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/invalid-email-verified": "Invalid verification status.",
  "auth/invalid-hash-algorithm": "Security configuration error.",
  "auth/invalid-hash-block-size": "Security configuration error.",
  "auth/invalid-hash-derived-key-length": "Security configuration error.",
  "auth/invalid-hash-key": "Security configuration error.",
  "auth/invalid-hash-memory-cost": "Security configuration error.",
  "auth/invalid-hash-parallelization": "Security configuration error.",
  "auth/invalid-hash-rounds": "Security configuration error.",
  "auth/invalid-hash-salt-separator": "Security configuration error.",
  "auth/invalid-id-token": "Invalid session. Please sign in again.",
  "auth/invalid-last-sign-in-time": "Invalid sign-in time.",
  "auth/invalid-page-token": "Page expired. Please refresh.",
  "auth/invalid-password": "Password must be at least 6 characters.",
  "auth/invalid-password-hash": "Security configuration error.",
  "auth/invalid-password-salt": "Security configuration error.",
  "auth/invalid-phone-number": "Please enter a valid phone number.",
  "auth/invalid-photo-url": "Invalid photo link.",
  "auth/invalid-provider-data": "Invalid account data.",
  "auth/invalid-provider-id": "Sign-in method not supported.",
  "auth/invalid-oauth-responsetype": "Sign-in configuration error.",
  "auth/invalid-session-cookie-duration": "Session configuration error.",
  "auth/invalid-uid": "Invalid user identifier.",
  "auth/invalid-user-import": "Import error.",
  "auth/maximum-user-count-exceeded": "Limit exceeded.",
  "auth/missing-android-pkg-name": "App configuration error.",
  "auth/missing-continue-uri": "Link error.",
  "auth/missing-hash-algorithm": "Security configuration error.",
  "auth/missing-ios-bundle-id": "App configuration error.",
  "auth/missing-uid": "User identifier missing.",
  "auth/missing-oauth-client-secret": "Sign-in configuration error.",
  "auth/operation-not-allowed": "This sign-in method is currently disabled.",
  "auth/phone-number-already-exists":
    "This phone number is already registered.",
  "auth/project-not-found": "System configuration error.",
  "auth/reserved-claims": "Account data error.",
  "auth/session-cookie-expired": "Session expired. Please sign in again.",
  "auth/session-cookie-revoked": "Session revoked. Please sign in again.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/uid-already-exists": "User ID already exists.",
  "auth/unauthorized-continue-uri": "Unauthorized link domain.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/user-not-found": "Account not found.",
  "auth/wrong-password": "Incorrect email or password.",
};

export function getFirebaseAuthErrorMessage<Error = unknown>(
  error: Error,
  fallbackMessage = DEFAULT_MESSAGE
): string {
  if (error instanceof FirebaseError) {
    return firebaseErrorMessages[error.code] || fallbackMessage;
  }

  return fallbackMessage;
}

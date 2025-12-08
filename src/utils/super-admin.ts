const SUPER_ADMIN_EMAILS = import.meta.env.VITE_SUPER_ADMIN_EMAILS || "";

const superAdminEmails = new Set(
  SUPER_ADMIN_EMAILS.split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
);

export function isSuperAdminEmail(email?: string | null) {
  if (!email) return false;
  return superAdminEmails.has(email.toLowerCase());
}

import { z } from "zod";

const firestoreCollectionsScehma = z.enum([
  "users",
  "article",
  "author",
  "chapter",
  "event",
  "event-registration",
  "executive",
  "executive-tenure",
  "feed",
  "gallery",
  "library",
  "mandate",
  "mandate-certificate",
  "media",
  "newsletter",
  "newsletter-subscription",
  "registration",
  "roles",
  "upload",
]);

export const permissionActions = z.enum(["view", "edit", "delete"]);

export type FirestoreCollection = z.infer<typeof firestoreCollectionsScehma>;
export type PermissionAction = z.infer<typeof permissionActions>;
export type Permission = `can-${PermissionAction}-${FirestoreCollection}`;
export type Permissions = Array<Permission>;

function isValidPermission(value: unknown): value is Permission {
  if (typeof value !== "string") return false;

  const parts = value.split("-") as [
    "can",
    PermissionAction,
    FirestoreCollection,
  ];
  const [can, action, collection] = parts;

  if (parts.length !== 3) return false;
  if (can !== "can") return false;
  if (!action || !collection) return false;
  if (!permissionActions.options.includes(action)) return false;
  if (!firestoreCollectionsScehma.options.includes(collection)) return false;

  return true;
}

export const permissionSchema = z.custom<Permission>(isValidPermission, {
  message: "Invalid permission format",
});

type PermissionOptions = Array<{ label: string; value: Permission }>;

export const permissionOptions: PermissionOptions =
  firestoreCollectionsScehma.options
    .flatMap((collection) => {
      return permissionActions.options.map((action) => ({
        label: `Can ${action} ${collection}`,
        value: `can-${action}-${collection}` as Permission,
      }));
    })
    .sort((a, b) => a.label.localeCompare(b.label));

export const DEFAULT_ROLE = "member";

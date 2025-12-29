import type { User } from "@/api/user/types";
import { FieldValue } from "firebase-admin/firestore";

export function serverRecord(user: Pick<User, "id" | "fullName" | "photoUrl">) {
  return {
    by: user.id,
    name: user.fullName,
    photoUrl: user.photoUrl,
    at: FieldValue.serverTimestamp(),
  };
}

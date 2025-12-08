import type { User } from "@/api/user/types";
import { serverTimestamp } from "firebase/firestore";

export function record(user: Pick<User, "id" | "fullName" | "photoUrl">) {
  return {
    by: user.id,
    name: user.fullName,
    photoUrl: user.photoUrl,
    at: serverTimestamp(),
  };
}

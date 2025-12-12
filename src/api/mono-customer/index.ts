import { createBuilder } from "@ibnlanre/builder";
import { doc, updateDoc } from "firebase/firestore";

import { mono } from "@/api/mono";
import type { MonoCustomerInput } from "@/api/mono/types";
import { db } from "@/services/firebase";
import { record } from "@/utils/record";
import { USERS_COLLECTION } from "@/api/user/schema";

import { monoCustomerFormSchema } from "./schema";
import type { CreateMonoCustomerVariables } from "./types";

async function create(variables: CreateMonoCustomerVariables) {
  const { user, data } = variables;

  const payload = monoCustomerFormSchema.parse(data);

  const monoPayload: MonoCustomerInput = {
    email: payload.email,
    type: payload.type,
    first_name: payload.firstName,
    last_name: payload.lastName,
    address: payload.address,
    phone: payload.phoneNumber,
    identity: {
      type: "bvn",
      number: payload.bvn,
    },
  };

  const response = await mono.$use.customer.create(monoPayload);
  const monoCustomerId = response.data.id;

  const userRef = doc(db, USERS_COLLECTION, user.id);

  await updateDoc(userRef, {
    monoCustomerId,
    updated: record(user),
  });

  return {
    monoCustomerId,
    customer: response.data,
  };
}

export const monoCustomer = createBuilder({
  create,
});

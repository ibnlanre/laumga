import { createServerFn } from "@tanstack/react-start";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { createBuilder } from "@ibnlanre/builder";

import { mono } from "@/api/mono";
import type { MonoCustomerInput } from "@/api/mono/types";
import { serverCollection } from "@/client/core-query/server";
import { serverRecord } from "@/utils/server-record";
import { USERS_COLLECTION } from "@/api/user/schema";
import { userSchema } from "@/api/user/schema";

import { monoCustomerFormSchema } from "./schema";

const create = createServerFn({ method: "POST" })
  .inputValidator(
    zodValidator(
      z.object({
        data: monoCustomerFormSchema,
        user: userSchema,
      })
    )
  )
  .handler(async ({ data }) => {
    const { user, data: payload } = data;

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

    const response = await mono.$use.customer.create({
      data: monoPayload,
    });
    const monoCustomerId = response.data.id;

    const userRef = serverCollection(USERS_COLLECTION).doc(user.id);

    await userRef.update({
      monoCustomerId,
      updated: serverRecord(user),
    });

    return {
      monoCustomerId,
      customer: response,
    };
  });

export const monoCustomer = createBuilder(
  {
    create,
  },
  { prefix: ["monoCustomer"] }
);

import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod/v4";

import { MandateHeader } from "@/layouts/mandate/header";
import { Stack } from "@mantine/core";
import { queryClient } from "@/routing/query-client";
import { flutterwave } from "@/api/flutterwave";
import type {
  FlutterwavePaymentPlan,
  FlutterwavePaymentPlanListResponse,
} from "@/api/flutterwave/types";
import type { GetNextPageParamFunction } from "@tanstack/react-query";
import {
  minimumPaymentAmount,
  PaymentPlanForm,
} from "@/layouts/mandate/payment-plan-form";
import { user } from "@/api/user";
import { mandate } from "@/api/mandate";
import { feed } from "@/api/feed";

const mandateSearchSchema = z
  .object({
    amount: z.coerce.number().default(minimumPaymentAmount),
    status: z.string(),
    transaction_id: z.number(),
    tx_ref: z.string(),
  })
  .partial();

interface LoaderData {
  paymentPlans: FlutterwavePaymentPlan[];
}

const getNextPageParam: GetNextPageParamFunction<
  number,
  FlutterwavePaymentPlanListResponse
> = (lastPage, allPages) => {
  const { total_pages = 1, current_page = allPages.length } = {
    ...lastPage.meta?.page_info,
  };

  if (current_page < total_pages) return allPages.length + 1;
};

export const Route = createFileRoute("/_auth/mandate/_layout/pledge")({
  validateSearch: mandateSearchSchema,
  loaderDeps: ({ search }) => ({
    txRef: search.tx_ref,
    transactionId: search.transaction_id,
    status: search.status,
  }),
  loader: async ({ context, deps }): Promise<LoaderData> => {
    const { isAuthenticated } = context;
    const { txRef, transactionId, status } = deps;

    if (!isAuthenticated) return { paymentPlans: [] };

    const planResponse = await queryClient.fetchInfiniteQuery({
      queryKey: flutterwave.paymentPlan.list.$get({ status: "active" }),
      initialPageParam: 1,
      queryFn: () =>
        flutterwave.$use.paymentPlan.list({
          data: { status: "active" },
        }),
      getNextPageParam,
      staleTime: Infinity,
    });

    const paymentPlans = planResponse.pages.flatMap(({ data }) => data);
    if (!deps.txRef) return { paymentPlans };

    const verification = await flutterwave.$use.transaction
      .verify({ data: deps.txRef })
      .catch(() => null);

    if (!verification) throw redirect({ to: "/mandate/pledge" });
    const { amount, meta } = verification.data;

    if (
      verification.data.status !== status ||
      verification.data.tx_ref !== txRef ||
      verification.data.id !== transactionId
    ) {
      throw redirect({ to: "/mandate/pledge" });
    }

    const subscriptionList = await flutterwave.$use.subscription
      .list({
        data: {
          email: verification.data.customer.email,
          transaction_id: verification.data.id,
          status: "active",
        },
      })
      .catch(() => null);

    if (!subscriptionList) throw redirect({ to: "/mandate/pledge" });

    const subscription = subscriptionList.data[0];
    const userData = await user.$use
      .get({ data: context.uid })
      .catch(() => null);

    if (!userData) throw redirect({ to: "/mandate/pledge" });
    const { branch, gender, email, id } = userData;

    await mandate.$use
      .create({
        data: {
          user: userData,
          data: {
            amount,
            customerEmail: email,
            frequency: meta.cadence,
            paymentPlanId: meta.paymentPlanId,
            subscriptionId: subscription.id,
            transactionReference: txRef,
            transactionId,
          },
        },
      })
      .catch(() => {
        throw redirect({ to: "/mandate/pledge" });
      });

    await feed.$use
      .create({
        data: {
          amount,
          location: branch,
          userId: id,
          gender,
          type: "donation",
        },
      })
      .catch(() => null);

    throw redirect({ to: "/mandate/pledge" });
  },
  head: () => ({
    meta: [
      {
        title: "Create Mandate - LAUMGA",
      },
      {
        name: "description",
        content:
          "Set up your LAUMGA membership pledge. Choose a giving tier and commitment level to support community initiatives.",
      },
      {
        name: "robots",
        content: "noindex, nofollow",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { amount } = Route.useSearch();
  const { paymentPlans } = Route.useLoaderData();

  return (
    <div className="relative flex-1 w-full bg-linear-to-b spacey-10 from-mist-green via-white to-sage-green/40 text-deep-forest pt-6 sm:pt-8 pb-10 sm:pb-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 20%, rgba(203,229,167,0.6), transparent 55%), radial-gradient(circle at 88% 5%, rgba(0,35,19,0.15), transparent 50%)",
        }}
      />

      <Stack gap={40} className="relative">
        <MandateHeader />
        <PaymentPlanForm amount={amount} paymentPlans={paymentPlans} />
      </Stack>
    </div>
  );
}

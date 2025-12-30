import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod/v4";

import { MandateHeader } from "@/layouts/mandate/header";
import { Stack } from "@mantine/core";
import { queryClient } from "@/routing/query-client";
import { flutterwave } from "@/api/flutterwave";
import type {
  FlutterwavePaymentPlan,
  FlutterwavePaymentPlanListResponse,
  FlutterwaveSubscriptionListResponse,
  FlutterwaveTransactionVerifyResponse,
} from "@/api/flutterwave/types";
import type { GetNextPageParamFunction } from "@tanstack/react-query";
import {
  minimumPaymentAmount,
  PaymentPlanForm,
} from "@/layouts/mandate/payment-plan-form";
import { useAuth } from "@/contexts/use-auth";
import { useLayoutEffect } from "@tanstack/react-router";
import { useCreateMandate } from "@/api/mandate/hooks";

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
  verification: FlutterwaveTransactionVerifyResponse | null;
  subscriptionList: FlutterwaveSubscriptionListResponse | null;
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

    if (!isAuthenticated) {
      return { paymentPlans: [], verification: null, subscriptionList: null };
    }

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
    if (!deps.txRef) {
      return { paymentPlans, verification: null, subscriptionList: null };
    }

    const verification = await flutterwave.$use.transaction
      .verify({ data: deps.txRef })
      .catch(() => null);

    if (
      !verification ||
      verification.data.status !== deps.status ||
      verification.data.tx_ref !== deps.txRef ||
      verification.data.id !== deps.transactionId
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
    return { paymentPlans, verification, subscriptionList };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  const { amount } = Route.useSearch();
  const { paymentPlans, verification, subscriptionList } =
    Route.useLoaderData();

  const createMandate = useCreateMandate();
  const navigate = Route.useNavigate();

  useLayoutEffect(() => {
    if (!user || !verification || !subscriptionList) return;

    const { amount, meta, id } = verification.data;
    const subscription = subscriptionList.data[0];

    createMandate.mutate(
      {
        data: {
          user,
          data: {
            amount,
            customerEmail: user.email,
            frequency: meta.cadence,
            paymentPlanId: meta.paymentPlanId,
            subscriptionId: subscription.id,
            transactionReference: verification.data.tx_ref,
            transactionId: id,
          },
        },
      },
      {
        onSettled() {
          navigate({ to: "/mandate/pledge" });
        },
      }
    );
  }, [verification, user]);

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

import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  Title,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  ActionIcon,
  Tooltip,
  Grid,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { Eye, Pause, Play, X, CreditCard, DollarSign } from "lucide-react";
import { useMemo } from "react";

import { DataTable } from "@/components/data-table";
import { PageLoader } from "@/components/page-loader";
import type { Mandate } from "@/api/mandate/types";
import type { FlutterwaveTransaction } from "@/api/flutterwave/types";
import {
  usePauseMandate,
  useReinstateMandate,
  useCancelMandate,
} from "@/api/mandate/hooks";
import { listMandateOptions } from "@/api/mandate/options";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/use-auth";
import { formatCurrency } from "@/utils/currency";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminStatCard } from "@/components/admin/stat-card";
import { listFlutterwaveTransactionOptions } from "@/api/flutterwave/options";
import { createColumnHelper } from "@tanstack/react-table";
import { formatDate } from "@/utils/date";
import clsx from "clsx";
import { Activity } from "lucide-react";
import type { MandateStatus } from "@/api/mandate/types";

export const Route = createFileRoute("/admin/mandates")({
  component: MandatesAdmin,
});

const getStatusColor = (status: MandateStatus | string) => {
  switch (status) {
    case "active":
      return "green";
    case "paused":
      return "orange";
    case "cancelled":
      return "red";
    default:
      return "gray";
  }
};

const getTierIcon = (tier: string) => {
  switch (tier) {
    case "supporter":
      return "🌱";
    case "builder":
      return "🏗️";
    case "guardian":
      return "🦅";
    case "custom":
      return "⭐";
    default:
      return "💜";
  }
};

function MandatesAdmin() {
  const { user } = useAuth();

  const { data: mandates = [], isLoading } = useQuery(listMandateOptions());

  const pauseMutation = usePauseMandate();
  const reinstateMutation = useReinstateMandate();
  const cancelMutation = useCancelMandate();

  const handlePauseMandate = ({ tier, subscriptionId }: Mandate) => {
    modals.openConfirmModal({
      title: "Pause Mandate",
      children: (
        <Text size="sm">
          Pause the <strong>{tier}</strong> mandate? You can resume it anytime.
        </Text>
      ),
      labels: { confirm: "Pause", cancel: "Cancel" },
      onConfirm: () => {
        if (!user || !subscriptionId) return;

        pauseMutation.mutate({ data: { user } });
      },
    });
  };

  const handleResumeMandate = ({ tier, subscriptionId }: Mandate) => {
    modals.openConfirmModal({
      title: "Resume Mandate",
      children: (
        <Text size="sm">
          Resume the <strong>{tier}</strong> mandate? Debits will resume on
          schedule.
        </Text>
      ),
      labels: { confirm: "Resume", cancel: "Cancel" },
      onConfirm: () => {
        if (!user || !subscriptionId) return;

        reinstateMutation.mutate({ data: { user } });
      },
    });
  };

  const handleCancelMandate = ({ tier, subscriptionId }: Mandate) => {
    modals.openConfirmModal({
      title: "Cancel Mandate",
      children: (
        <Text size="sm">
          Cancel the <strong>{tier}</strong> mandate permanently? This action
          cannot be undone.
        </Text>
      ),
      labels: { confirm: "Cancel", cancel: "Back" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        if (!user || !subscriptionId) return;

        cancelMutation.mutate({ data: { user } });
      },
    });
  };

  const handleDetailsModal = (mandate: Mandate) => {
    modals.open({
      title: "Mandate Details",
      children: <MandateDetailsContent mandate={mandate} />,
    });
  };

  const columnHelper = createColumnHelper<Mandate>();

  const columns = [
    columnHelper.accessor("tier", {
      header: "Tier",
      cell: ({ row }) => (
        <Group gap="sm">
          <span className="text-lg">{getTierIcon(row.original.tier)}</span>
          <div>
            <Text size="sm" fw={500} className="capitalize">
              {row.original.tier}
            </Text>
            <Text size="xs" c="dimmed">
              {row.original.frequency}
            </Text>
          </div>
        </Group>
      ),
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: ({ row }) => (
        <Group gap="xs">
          <DollarSign className="size-4 text-vibrant-lime-600" />
          <Text size="sm" fw={500}>
            {formatCurrency(row.original.amount)}
          </Text>
        </Group>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => (
        <Badge
          color={getStatusColor(row.original.status)}
          variant="light"
          className="capitalize"
        >
          {row.original.status}
        </Badge>
      ),
    }),
    columnHelper.accessor("subscriptionId", {
      header: "Subscription ID",
      cell: ({ row }) => (
        <Text size="sm" ff="monospace">
          {row.original.subscriptionId}
        </Text>
      ),
    }),
    columnHelper.display({
      id: "history",
      cell: ({ row }) => (
        <Button
          variant="subtle"
          size="xs"
          leftSection={<Activity className="size-4" />}
          onClick={() => {
            if (!user) return;

            modals.open({
              title: "Transaction History",
              size: "xl",
              children: <TransactionHistoryModal email={user?.email} />,
            });
          }}
        >
          History
        </Button>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Group gap="xs">
          <Tooltip label="View details">
            <ActionIcon
              variant="light"
              color="blue"
              onClick={() => handleDetailsModal(row.original)}
            >
              <Eye className="size-4" />
            </ActionIcon>
          </Tooltip>

          {row.original.status === "active" && (
            <Tooltip label="Pause mandate">
              <ActionIcon
                variant="light"
                color="orange"
                onClick={() => handlePauseMandate(row.original)}
              >
                <Pause className="size-4" />
              </ActionIcon>
            </Tooltip>
          )}

          {row.original.status === "paused" && (
            <Tooltip label="Resume mandate">
              <ActionIcon
                variant="light"
                color="green"
                onClick={() => handleResumeMandate(row.original)}
              >
                <Play className="size-4" />
              </ActionIcon>
            </Tooltip>
          )}

          {["active", "paused"].includes(row.original.status) && (
            <Tooltip label="Cancel mandate">
              <ActionIcon
                variant="light"
                color="red"
                onClick={() => handleCancelMandate(row.original)}
              >
                <X className="size-4" />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      ),
    }),
  ];

  const stats = useMemo(() => {
    const active = mandates.filter(({ status }) => status === "active");
    const paused = mandates.filter(({ status }) => status === "paused");
    const totalPledged = mandates.reduce(
      (acc, { amount = 0 }) => acc + amount,
      0
    );

    return [
      {
        label: "Total mandates",
        value: mandates.length,
        description: "Recurring pledges",
        icon: CreditCard,
        tone: "forest" as const,
      },
      {
        label: "Active",
        value: active.length,
        description: "Currently debiting",
        icon: Play,
        tone: "sage" as const,
      },
      {
        label: "Paused",
        value: paused.length,
        description: "Need attention",
        icon: Pause,
        tone: "coral" as const,
      },
      {
        label: "Total pledged",
        value: totalPledged,
        description: "Aggregate commitment",
        icon: DollarSign,
        tone: "gold" as const,
        formatValue: formatCurrency,
      },
    ];
  }, [mandates]);

  if (isLoading) return <PageLoader message="Loading mandates..." />;

  return (
    <Stack gap="xl">
      <AdminPageHeader
        eyebrow="Finance"
        title="Mandate management"
        description="Monitor recurring pledges, pause or resume debit flows, and keep contributions on track."
      />

      <Grid gutter="lg">
        {stats.map((stat) => (
          <Grid.Col key={stat.label} span={{ base: 12, sm: 6, lg: 3 }}>
            <AdminStatCard
              label={stat.label}
              value={
                stat.formatValue ? stat.formatValue(stat.value) : stat.value
              }
              description={stat.description}
              icon={stat.icon}
              tone={stat.tone}
              isLoading={isLoading}
            />
          </Grid.Col>
        ))}
      </Grid>

      <Card withBorder shadow="md" radius="xl" padding="0">
        <div className="border-b border-sage-green/20 px-6 py-4">
          <Title order={3} size="h4" className="text-deep-forest">
            Mandate registry
          </Title>
          <Text size="sm" c="dimmed">
            Search, filter, and triage every standing instruction.
          </Text>
        </div>
        <div className="p-0">
          <DataTable
            columns={columns}
            data={mandates}
            enableSearch={true}
            enableFilters={true}
            enableSorting={true}
            enablePagination={true}
            enableColumnOrdering={true}
            filters={[
              {
                key: "status",
                label: "Status",
                options: [
                  { value: "all", label: "All Statuses" },
                  { value: "active", label: "Active" },
                  { value: "paused", label: "Paused" },
                  { value: "initiated", label: "Initiated" },
                  { value: "cancelled", label: "Cancelled" },
                  { value: "completed", label: "Completed" },
                ],
              },
              {
                key: "tier",
                label: "Tier",
                options: [
                  { value: "all", label: "All Tiers" },
                  { value: "supporter", label: "🌱 Supporter" },
                  { value: "builder", label: "🏗️ Builder" },
                  { value: "guardian", label: "🦅 Guardian" },
                  { value: "custom", label: "⭐ Custom" },
                ],
              },
              {
                key: "frequency",
                label: "Frequency",
                options: [
                  { value: "all", label: "All Frequencies" },
                  { value: "daily", label: "Daily" },
                  { value: "weekly", label: "Weekly" },
                  { value: "monthly", label: "Monthly" },
                  { value: "yearly", label: "Yearly" },
                ],
              },
            ]}
            searchPlaceholder="Search by tier or amount..."
            pageSize={10}
            loading={isLoading}
          />
        </div>
      </Card>
    </Stack>
  );
}

interface MandateDetailsContentProps {
  mandate: Mandate;
}

function MandateDetailsContent({ mandate }: MandateDetailsContentProps) {
  return (
    <Stack gap="md">
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <div>
            <Text size="sm" c="dimmed" mb="xs">
              Tier
            </Text>
            <Group gap="sm">
              <span className="text-2xl">{getTierIcon(mandate.tier)}</span>
              <Text fw={600} className="capitalize">
                {mandate.tier}
              </Text>
            </Group>
          </div>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <div>
            <Text size="sm" c="dimmed" mb="xs">
              Status
            </Text>
            <Badge
              color={getStatusColor(mandate.status)}
              variant="light"
              size="lg"
              className="capitalize"
            >
              {mandate.status}
            </Badge>
          </div>
        </Grid.Col>
      </Grid>

      <div>
        <Text size="sm" c="dimmed" mb="xs">
          Amount
        </Text>
        <Text fw={600} size="lg">
          {formatCurrency(mandate.amount)}
        </Text>
      </div>

      <Grid>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <div>
            <Text size="sm" c="dimmed" mb="xs">
              Subscription ID
            </Text>
            <Text fw={600} ff="monospace">
              {mandate.subscriptionId}
            </Text>
          </div>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <div>
            <Text size="sm" c="dimmed" mb="xs">
              Payment Plan ID
            </Text>
            <Text fw={600} ff="monospace">
              {mandate.paymentPlanId}
            </Text>
          </div>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <div>
            <Text size="sm" c="dimmed" mb="xs">
              Customer Email
            </Text>
            <Text fw={600}>{mandate.customerEmail}</Text>
          </div>
        </Grid.Col>
      </Grid>

      <div className="border-t border-gray-200 pt-md">
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={() => modals.closeAll()}>
            Close
          </Button>
        </Group>
      </div>
    </Stack>
  );
}

const columnHelper = createColumnHelper<FlutterwaveTransaction>();

const transactionColumns = [
  columnHelper.accessor("created_at", {
    header: "Date",
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => (
      <span
        className={clsx(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
          info.getValue() === "successful"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        )}
      >
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    cell: (info) => formatCurrency(info.getValue()),
  }),
  columnHelper.accessor("narration", {
    header: "Narration",
    cell: (info) => (
      <span className="text-sm text-gray-500">{info.getValue()}</span>
    ),
  }),
];

function TransactionHistoryModal({ email }: { email: string }) {
  const { data: transactionsResponse, isLoading } = useQuery(
    listFlutterwaveTransactionOptions({
      customer_email: email,
      status: "successful",
    })
  );

  const transactions = transactionsResponse?.data || [];

  return (
    <DataTable
      data={transactions}
      columns={transactionColumns}
      loading={isLoading}
    />
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
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
import type { FlutterwaveStatus } from "@/api/flutterwave/types";
import { flutterwaveStatusSchema } from "@/api/flutterwave/schema";
import {
  useListMandates,
  usePauseMandate,
  useReinstateMandate,
  useCancelMandate,
} from "@/api/mandate/hooks";
import { useUpdateFlutterwaveAccount } from "@/api/flutterwave/hooks";
import { useAuth } from "@/contexts/use-auth";
import { formatCurrency } from "@/utils/currency";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminStatCard } from "@/components/admin/stat-card";
import { zodValidator } from "@tanstack/zod-adapter";
import z from "zod";

export const Route = createFileRoute("/admin/mandates")({
  validateSearch: zodValidator(
    z.object({
      status: flutterwaveStatusSchema.optional(),
    })
  ),
  component: MandatesAdmin,
});

const getStatusColor = (status: FlutterwaveStatus) => {
  switch (status) {
    case "PENDING":
      return "blue";
    case "ACTIVE":
      return "green";
    case "SUSPENDED":
      return "orange";
    case "DELETED":
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

  const { data: mandates = [], isLoading } = useListMandates();

  const updateFlutterwaveAccount = useUpdateFlutterwaveAccount();
  const pauseMutation = usePauseMandate();
  const reinstateMutation = useReinstateMandate();
  const cancelMutation = useCancelMandate();

  const handlePauseMandate = ({ tier, flutterwaveReference }: Mandate) => {
    modals.openConfirmModal({
      title: "Pause Mandate",
      children: (
        <Text size="sm">
          Pause the <strong>{tier}</strong> mandate? You can resume it anytime.
        </Text>
      ),
      labels: { confirm: "Pause", cancel: "Cancel" },
      onConfirm: () => {
        if (!user || !flutterwaveReference) return;

        updateFlutterwaveAccount.mutate(
          {
            data: {
              reference: flutterwaveReference,
              payload: { status: "SUSPENDED" },
            },
          },
          {
            onSuccess: ({ data }) => {
              pauseMutation.mutate({
                user,
                data: {
                  flutterwaveStatus: data.status,
                  flutterwaveProcessorResponse: data.processor_response,
                },
              });
            },
          }
        );
      },
    });
  };

  const handleResumeMandate = ({ tier, flutterwaveReference }: Mandate) => {
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
        if (!user || !flutterwaveReference) return;

        updateFlutterwaveAccount.mutate(
          {
            data: {
              reference: flutterwaveReference,
              payload: { status: "ACTIVE" },
            },
          },
          {
            onSuccess: ({ data }) => {
              reinstateMutation.mutate({
                user,
                data: {
                  flutterwaveStatus: data.status,
                  flutterwaveProcessorResponse: data.processor_response,
                },
              });
            },
          }
        );
      },
    });
  };

  const handleCancelMandate = ({ tier, flutterwaveReference }: Mandate) => {
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
        if (!user || !flutterwaveReference) return;

        updateFlutterwaveAccount.mutate(
          {
            data: {
              reference: flutterwaveReference,
              payload: { status: "DELETED" },
            },
          },
          {
            onSuccess: ({ data }) => {
              cancelMutation.mutate({
                user,
                data: {
                  flutterwaveStatus: data.status,
                  flutterwaveProcessorResponse: data.processor_response,
                },
              });
            },
          }
        );
      },
    });
  };

  const handleDetailsModal = (mandate: Mandate) => {
    modals.open({
      title: "Mandate Details",
      children: <MandateDetailsContent mandate={mandate} />,
    });
  };

  const columns: ColumnDef<Mandate>[] = [
    {
      accessorKey: "tier",
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
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <Group gap="xs">
          <DollarSign className="size-4 text-vibrant-lime-600" />
          <Text size="sm" fw={500}>
            {formatCurrency(row.original.amount)}
          </Text>
        </Group>
      ),
    },
    {
      accessorKey: "flutterwaveStatus",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          color={getStatusColor(row.original.flutterwaveStatus)}
          variant="light"
          className="capitalize"
        >
          {row.original.flutterwaveStatus}
        </Badge>
      ),
    },
    {
      accessorKey: "flutterwaveReference",
      header: "Reference",
      cell: ({ row }) => (
        <Text size="sm" ff="monospace">
          {row.original.flutterwaveReference}
        </Text>
      ),
    },
    {
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

          {row.original.flutterwaveStatus === "ACTIVE" && (
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

          {row.original.flutterwaveStatus === "SUSPENDED" && (
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

          {["INITIATED", "ACTIVE", "SUSPENDED"].includes(
            row.original.flutterwaveStatus
          ) && (
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
    },
  ];

  const stats = useMemo(() => {
    const active = mandates.filter(
      ({ flutterwaveStatus }) => flutterwaveStatus === "ACTIVE"
    ).length;
    const paused = mandates.filter(
      ({ flutterwaveStatus }) => flutterwaveStatus === "SUSPENDED"
    ).length;
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
        value: active,
        description: "Currently debiting",
        icon: Play,
        tone: "sage" as const,
      },
      {
        label: "Paused",
        value: paused,
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
        actions={
          <Button
            component={Link}
            to="/admin/payment-partners"
            variant="light"
            color="deep-forest"
            size="sm"
          >
            Configure split accounts
          </Button>
        }
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

function MandateDetailsContent({ mandate }: { mandate: Mandate }) {
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
              color={getStatusColor(mandate.flutterwaveStatus)}
              variant="light"
              size="lg"
              className="capitalize"
            >
              {mandate.flutterwaveStatus}
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
              Frequency
            </Text>
            <Text fw={600} className="capitalize">
              {mandate.frequency}
            </Text>
          </div>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <div>
            <Text size="sm" c="dimmed" mb="xs">
              Reference
            </Text>
            <Text fw={600} ff="monospace">
              {mandate.flutterwaveReference}
            </Text>
          </div>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <div>
            <Text size="sm" c="dimmed" mb="xs">
              Flutterwave Account ID
            </Text>
            <Text fw={600} ff="monospace">
              {mandate.flutterwaveAccountId}
            </Text>
          </div>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <div>
            <Text size="sm" c="dimmed" mb="xs">
              Flutterwave Customer ID
            </Text>
            <Text fw={600} ff="monospace">
              {mandate.flutterwaveCustomerId}
            </Text>
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

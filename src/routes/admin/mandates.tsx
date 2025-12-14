import { createFileRoute } from "@tanstack/react-router";
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

import { DataTable } from "@/components/data-table";
import { PageLoader } from "@/components/page-loader";
import { Section } from "@/components/section";
import type { Mandate, MandateStatus } from "@/api/mandate/types";
import {
  useListMandates,
  usePauseMandate,
  useReinstateMandate,
  useCancelMandate,
} from "@/api/mandate/hooks";
import { useAuth } from "@/contexts/use-auth";
import clsx from "clsx";
import { formatCurrency } from "@/utils/currency";

export const Route = createFileRoute("/admin/mandates")({
  validateSearch: (search: Record<string, unknown>) => ({
    status: (search.status as MandateStatus) || undefined,
  }),
  component: MandatesAdmin,
});

const getStatusColor = (status: MandateStatus) => {
  switch (status) {
    case "active":
      return "green";
    case "paused":
      return "orange";
    case "initiated":
      return "blue";
    case "cancelled":
      return "red";
    case "completed":
      return "gray";
    default:
      return "blue";
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

  const pauseMutation = usePauseMandate();
  const reinstateMutation = useReinstateMandate();
  const cancelMutation = useCancelMandate();

  const handlePauseMandate = ({ id, tier }: Mandate) => {
    modals.openConfirmModal({
      title: "Pause Mandate",
      children: (
        <Text size="sm">
          Pause the <strong>{tier}</strong> mandate? You can resume it anytime.
        </Text>
      ),
      labels: { confirm: "Pause", cancel: "Cancel" },
      onConfirm: () => {
        if (!user) return;
        pauseMutation.mutate({ id, user });
      },
    });
  };

  const handleResumeMandate = ({ id, tier }: Mandate) => {
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
        if (!user) return;
        reinstateMutation.mutate({ id, user });
      },
    });
  };

  const handleCancelMandate = ({ id, tier }: Mandate) => {
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
        if (!user) return;
        cancelMutation.mutate({ id, user });
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
      accessorKey: "status",
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
    },
    {
      accessorKey: "monoReference",
      header: "Reference",
      cell: ({ row }) => (
        <Text size="sm" ff="monospace">
          {row.original.monoReference}
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

          {["active", "paused", "initiated"].includes(row.original.status) && (
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

  // Stats
  const stats = [
    {
      label: "Total Mandates",
      value: mandates.length,
      icon: CreditCard,
      background: "bg-blue-50",
      color: "text-blue-700",
    },
    {
      label: "Active",
      value: mandates.filter(({ status }) => status === "active").length,
      icon: Play,
      background: "bg-green-50",
      color: "text-green-700",
    },
    {
      label: "Paused",
      value: mandates.filter(({ status }) => status === "paused").length,
      icon: Pause,
      background: "bg-orange-50",
      color: "text-orange-700",
    },
    {
      label: "Total Pledged",
      value: mandates.reduce((acc, { amount = 0 }) => acc + amount, 0),
      icon: DollarSign,
      background: "bg-vibrant-lime-50",
      color: "text-vibrant-lime-700",
      format: (v: number) => formatCurrency(v),
    },
  ];

  if (isLoading) return <PageLoader message="Loading mandates..." />;

  return (
    <Section>
      <Stack gap="xl">
        {/* Header */}
        <div>
          <Title order={1} className="text-deep-forest mb-2">
            Mandate Management
          </Title>
          <Text c="dimmed">
            Manage member financial commitments and pledges
          </Text>
        </div>

        {/* Statistics */}
        <Grid>
          {stats.map((stat) => (
            <Grid.Col key={stat.label} span={{ base: 12, sm: 6, lg: 3 }}>
              <Card shadow="md" padding="lg" radius="lg" withBorder>
                <Group justify="space-between" mb="md">
                  <div className={clsx("p-3 rounded-lg", stat.background)}>
                    <stat.icon className={clsx("size-6", stat.color)} />
                  </div>
                </Group>
                <Text size="sm" c="dimmed" mb="xs">
                  {stat.label}
                </Text>
                <Text size="xl" fw={700} className="text-deep-forest">
                  {stat.format ? stat.format(stat.value) : stat.value}
                </Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {/* Mandates Table */}
        <Card shadow="md" padding="lg" radius="lg" withBorder>
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
        </Card>
      </Stack>
    </Section>
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
              {mandate.monoReference}
            </Text>
          </div>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <div>
            <Text size="sm" c="dimmed" mb="xs">
              Mono Mandate ID
            </Text>
            <Text fw={600} ff="monospace">
              {mandate.monoMandateId}
            </Text>
          </div>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <div>
            <Text size="sm" c="dimmed" mb="xs">
              Mono Customer ID
            </Text>
            <Text fw={600} ff="monospace">
              {mandate.monoCustomerId}
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

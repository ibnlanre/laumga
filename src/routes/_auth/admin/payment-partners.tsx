import { useCallback, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  NumberInput,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  PencilLine,
  Plus,
  Power,
  PowerOff,
  RefreshCw,
  Sparkles,
  Wallet,
} from "lucide-react";
import { DataTable } from "@/components/data-table";
import { formatDate } from "@/utils/date";
import {
  useCreatePaymentPartner,
  useFetchPaymentPartners,
  useFetchMonoBanks,
  useUpdatePaymentPartner,
} from "@/services/hooks";
import type {
  CreatePaymentPartnerInput,
  PaymentPartner,
} from "@/api/payment-partner";
import { createPaymentPartnerSchema } from "@/api/payment-partner";
import { useAuth } from "@/contexts/auth";

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const columnHelper = createColumnHelper<PaymentPartner>();
const PARTNER_FORM_MODAL_ID = "payment-partner-form-modal";

type BankOption = { label: string; value: string };

const getInitialFormValues = (): CreatePaymentPartnerInput => ({
  name: "",
  accountNumber: "",
  nipCode: "",
  allocationType: "percentage",
  allocationValue: 10,
  allocationMax: null,
  feeBearer: "business",
  isActive: false,
});

export const Route = createFileRoute("/_auth/admin/payment-partners")({
  component: PaymentPartnerDashboard,
});

function PaymentPartnerDashboard() {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid ?? null;

  const { data: partners = [], isLoading: isPartnersLoading } =
    useFetchPaymentPartners();

  const {
    data: banks = [],
    isFetching: isFetchingBanks,
    refetch: refetchBanks,
  } = useFetchMonoBanks();

  const { mutateAsync: togglePartnerMutation, isPending: isTogglingPartner } =
    useUpdatePaymentPartner();

  const activePartner = useMemo(
    () => partners.find((partner) => partner.isActive) ?? null,
    [partners]
  );

  const percentageCoverage = useMemo(
    () =>
      partners
        .filter((partner) => partner.allocationType === "percentage")
        .reduce((total, partner) => total + partner.allocationValue, 0),
    [partners]
  );

  const fixedAllocationTotal = useMemo(
    () =>
      partners
        .filter((partner) => partner.allocationType === "fixed")
        .reduce((total, partner) => total + partner.allocationValue, 0),
    [partners]
  );

  const bankOptions = useMemo<BankOption[]>(
    () =>
      banks.map((bank) => ({
        label: bank.label,
        value: bank.value,
      })),
    [banks]
  );

  const stats = useMemo(
    () => [
      {
        label: "Live split",
        value: activePartner ? activePartner.name : "No partner live",
        icon: Sparkles,
        accent: "text-vibrant-lime",
        subline: activePartner
          ? `${activePartner.bankName} • ${activePartner.accountNumber}`
          : "Activate a partner to start routing payouts",
      },
      {
        label: "Percentage pool",
        value: `${percentageCoverage.toFixed(0)}%`,
        icon: Banknote,
        accent: "text-institutional-green",
        subline: "of inflows allocated",
      },
      {
        label: "Fixed transfers",
        value: currencyFormatter.format(fixedAllocationTotal),
        icon: Wallet,
        accent: "text-sage-green",
        subline: "total guaranteed payouts",
      },
    ],
    [activePartner, fixedAllocationTotal, percentageCoverage]
  );

  const openPartnerFormModal = useCallback(
    (mode: "create" | "edit", partner?: PaymentPartner) => {
      if (!userId) return;

      modals.open({
        modalId: PARTNER_FORM_MODAL_ID,
        title: (
          <Title order={3} className="text-deep-forest">
            {mode === "edit" ? "Edit payment partner" : "New payment partner"}
          </Title>
        ),
        size: "lg",
        radius: "lg",
        children: (
          <PaymentPartnerFormModal
            key={partner?.id ?? "create"}
            mode={mode}
            partner={partner ?? null}
            bankOptions={bankOptions}
            userId={userId}
            onCancel={() => modals.close(PARTNER_FORM_MODAL_ID)}
            onSuccess={() => modals.close(PARTNER_FORM_MODAL_ID)}
          />
        ),
      });
    },
    [bankOptions, userId]
  );

  const handleTogglePartner = useCallback(
    async (partner: PaymentPartner, nextState: boolean) => {
      if (!userId) return;

      await togglePartnerMutation({
        partnerId: partner.id,
        updates: { isActive: nextState },
        userId,
      });
    },
    [togglePartnerMutation, userId]
  );

  const columns = useMemo(
    () =>
      [
        columnHelper.accessor("name", {
          header: "Partner",
          cell: (info) => {
            const partner = info.row.original;
            return (
              <div>
                <Text fw={600}>{partner.name}</Text>
                <Text size="xs" c="dimmed">
                  {partner.bankName} • {partner.accountNumber}
                </Text>
              </div>
            );
          },
        }),
        columnHelper.accessor("allocationType", {
          header: "Allocation",
          cell: (info) => {
            const partner = info.row.original;
            const valueLabel =
              partner.allocationType === "percentage"
                ? `${partner.allocationValue}%`
                : currencyFormatter.format(partner.allocationValue);

            return (
              <Stack gap={2}>
                <Text size="sm" fw={500}>
                  {valueLabel}
                </Text>
                {partner.allocationMax && (
                  <Text size="xs" c="dimmed">
                    Cap: {currencyFormatter.format(partner.allocationMax)}
                  </Text>
                )}
              </Stack>
            );
          },
        }),
        columnHelper.accessor("feeBearer", {
          header: "Fees",
          cell: (info) => (
            <Badge color={info.getValue() === "business" ? "blue" : "grape"}>
              {info.getValue() === "business" ? "Platform" : "Partners"}
            </Badge>
          ),
        }),
        columnHelper.accessor((row) => (row.isActive ? "active" : "inactive"), {
          id: "status",
          header: "Status",
          cell: (info) => {
            const partner = info.row.original;
            return (
              <Badge color={partner.isActive ? "green" : "gray"}>
                {partner.isActive ? "Active" : "Inactive"}
              </Badge>
            );
          },
        }),
        columnHelper.accessor((row) => row.created?.at ?? null, {
          id: "createdAt",
          header: "Created",
          cell: (info) => (
            <Text size="sm" c="dimmed">
              {info.getValue()
                ? formatDate(info.getValue(), "MMM d, yyyy")
                : "—"}
            </Text>
          ),
        }),
        columnHelper.display({
          id: "actions",
          header: "",
          cell: (info) => {
            const partner = info.row.original;
            return (
              <Group gap="xs">
                <Tooltip label="Edit partner">
                  <ActionIcon
                    variant="light"
                    color="blue"
                    disabled={!userId}
                    onClick={() => openPartnerFormModal("edit", partner)}
                  >
                    <PencilLine className="size-4" />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label={partner.isActive ? "Deactivate" : "Activate"}>
                  <ActionIcon
                    variant="light"
                    color={partner.isActive ? "orange" : "green"}
                    onClick={() =>
                      handleTogglePartner(partner, !partner.isActive)
                    }
                    disabled={!userId || isTogglingPartner}
                  >
                    {partner.isActive ? (
                      <Power className="size-4" />
                    ) : (
                      <PowerOff className="size-4" />
                    )}
                  </ActionIcon>
                </Tooltip>
              </Group>
            );
          },
        }),
      ] as ColumnDef<PaymentPartner>[],
    [handleTogglePartner, isTogglingPartner, openPartnerFormModal, userId]
  );

  return (
    <Stack gap="xl">
      <Card
        padding="xl"
        radius="xl"
        className="rounded-4xl border border-white/10 bg-linear-to-r from-deep-forest via-institutional-green to-vibrant-lime/70 text-white shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
      >
        <Stack gap="lg">
          <Group justify="space-between" align="flex-start">
            <div>
              <Text size="xs" fw={600} className="tracking-[0.4em] uppercase">
                Payment partners
              </Text>
              <Title order={2} className="text-white" mt="sm">
                Keep Mono splits under super-admin control
              </Title>
              <Text size="sm" c="white" mt="xs" className="max-w-2xl">
                Centralize sub-account ownership, guarantee the right bank
                receives every debit, and switch partners without touching your
                mandate flows.
              </Text>
            </div>
            <Group gap="sm">
              <Button
                variant="white"
                color="dark"
                leftSection={<RefreshCw className="size-4" />}
                onClick={() => refetchBanks()}
                loading={isFetchingBanks}
              >
                Refresh banks
              </Button>
              <Button
                color="dark"
                variant="filled"
                leftSection={<Plus className="size-4" />}
                onClick={() => openPartnerFormModal("create")}
                disabled={!userId}
              >
                New partner
              </Button>
            </Group>
          </Group>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
            {stats.map((stat) => (
              <Card
                key={stat.label}
                radius="xl"
                padding="lg"
                className="bg-white/10 backdrop-blur border border-white/20"
              >
                <Group justify="space-between">
                  <div
                    className={`p-2 rounded-full bg-white/15 ${stat.accent}`}
                  >
                    <stat.icon className="size-5" />
                  </div>
                  <CheckCircle2 className="size-5 text-white/70" />
                </Group>
                <Text size="xs" c="white/70" mt="md">
                  {stat.label}
                </Text>
                <Text size="xl" fw={700} className="text-white">
                  {stat.value}
                </Text>
                <Text size="xs" c="white/70" mt="xs">
                  {stat.subline}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      </Card>

      {!activePartner && (
        <Alert
          icon={<AlertCircle className="size-4" />}
          color="orange"
          radius="lg"
          title="No active payment partner"
        >
          Choose a payment partner to receive Mono payouts. Until a partner is
          active, split instructions will fail.
        </Alert>
      )}

      <Card withBorder radius="xl" p="xl" shadow="sm">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={3} className="text-deep-forest">
              Payment partners
            </Title>
            <Text size="sm" c="dimmed">
              Manage Mono sub-accounts, allocation logic, and activation states
            </Text>
          </div>
        </Group>
        <Divider my="lg" />
        <DataTable
          columns={columns}
          data={partners}
          loading={isPartnersLoading}
          enableColumnOrdering
          enableFilters
          enablePagination
          enableSearch
          enableSorting
          filters={[
            {
              key: "status",
              label: "Status",
              options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ],
            },
            {
              key: "allocationType",
              label: "Allocation mode",
              options: [
                { label: "Percentage", value: "percentage" },
                { label: "Fixed", value: "fixed" },
              ],
            },
          ]}
          searchPlaceholder="Search by partner or bank"
          pageSize={8}
        />
      </Card>
    </Stack>
  );
}

interface PaymentPartnerFormModalProps {
  mode: "create" | "edit";
  partner: PaymentPartner | null;
  bankOptions: BankOption[];
  userId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

function PaymentPartnerFormModal({
  mode,
  partner,
  bankOptions,
  userId,
  onCancel,
  onSuccess,
}: PaymentPartnerFormModalProps) {
  const form = useForm<CreatePaymentPartnerInput>({
    initialValues: partner
      ? {
          name: partner.name,
          accountNumber: partner.accountNumber,
          nipCode: partner.nipCode,
          allocationType: partner.allocationType,
          allocationValue: partner.allocationValue,
          allocationMax: partner.allocationMax ?? null,
          feeBearer: partner.feeBearer,
          isActive: partner.isActive,
        }
      : getInitialFormValues(),
    validate: zod4Resolver(createPaymentPartnerSchema),
  });

  const { mutateAsync: createPartner, isPending: isCreatingPartner } =
    useCreatePaymentPartner();
  const { mutateAsync: updatePartner, isPending: isUpdatingPartner } =
    useUpdatePaymentPartner();

  const isEditing = mode === "edit" && !!partner;
  const isSubmitting = isEditing ? isUpdatingPartner : isCreatingPartner;

  const handleSubmit = form.onSubmit(async (values) => {
    const payload = {
      ...values,
      allocationValue: Number(values.allocationValue),
      allocationMax:
        values.allocationMax === null || values.allocationMax === undefined
          ? null
          : Number(values.allocationMax),
    };

    if (isEditing && partner) {
      await updatePartner({
        partnerId: partner.id,
        updates: payload,
        userId,
      });
    } else {
      await createPartner({ userId, ...payload });
    }

    onSuccess();
  });

  const handleAllocationValueChange = (value: string | number | "") => {
    const parsed = parseNumericValue(value);
    form.setFieldValue("allocationValue", parsed ?? 0);
  };

  const handleAllocationCapChange = (value: string | number | "") => {
    const parsed = parseNumericValue(value);
    form.setFieldValue("allocationMax", parsed);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="Partner name"
          placeholder="e.g. Scholarship Board"
          withAsterisk
          {...form.getInputProps("name")}
        />

        <Group grow>
          <TextInput
            label="Settlement account"
            placeholder="0123456789"
            withAsterisk
            maxLength={10}
            {...form.getInputProps("accountNumber")}
          />
          <Select
            label="Bank"
            placeholder="Pick a bank"
            data={bankOptions}
            searchable
            nothingFoundMessage="No banks match your search"
            withAsterisk
            {...form.getInputProps("nipCode")}
          />
        </Group>

        <Stack gap={6}>
          <Text size="sm" fw={600}>
            Allocation type
            <span className="text-red-500"> *</span>
          </Text>
          <SegmentedControl
            value={form.values.allocationType}
            onChange={(value) =>
              form.setFieldValue(
                "allocationType",
                value as CreatePaymentPartnerInput["allocationType"]
              )
            }
            data={[
              { label: "Percentage", value: "percentage" },
              { label: "Fixed amount", value: "fixed" },
            ]}
          />
          {form.errors.allocationType && (
            <Text size="xs" c="red">
              {form.errors.allocationType}
            </Text>
          )}
        </Stack>

        <Group grow>
          <NumberInput
            label="Allocation value"
            description={
              form.values.allocationType === "percentage"
                ? "Share of every debit"
                : "Amount routed per run"
            }
            withAsterisk
            value={form.values.allocationValue}
            min={1}
            max={form.values.allocationType === "percentage" ? 99 : undefined}
            thousandSeparator={
              form.values.allocationType === "fixed" ? "," : undefined
            }
            rightSection={
              form.values.allocationType === "percentage" ? (
                <Text size="sm" c="dimmed">
                  %
                </Text>
              ) : undefined
            }
            leftSection={
              form.values.allocationType === "fixed" ? "₦" : undefined
            }
            hideControls
            allowNegative={false}
            error={form.errors.allocationValue}
            onChange={handleAllocationValueChange}
          />
          <NumberInput
            label="Allocation cap"
            description="Optional override for very large payouts"
            value={form.values.allocationMax ?? undefined}
            min={1}
            leftSection="₦"
            hideControls
            allowNegative={false}
            error={form.errors.allocationMax}
            onChange={handleAllocationCapChange}
          />
        </Group>

        <Stack gap={6}>
          <Text size="sm" fw={600}>
            Fees billed to
            <span className="text-red-500"> *</span>
          </Text>
          <SegmentedControl
            value={form.values.feeBearer}
            onChange={(value) =>
              form.setFieldValue(
                "feeBearer",
                value as CreatePaymentPartnerInput["feeBearer"]
              )
            }
            data={[
              { label: "LAUMGA", value: "business" },
              { label: "Partner", value: "sub_accounts" },
            ]}
          />
          {form.errors.feeBearer && (
            <Text size="xs" c="red">
              {form.errors.feeBearer}
            </Text>
          )}
        </Stack>

        <Switch
          label="Activate immediately"
          description="Automatically routes upcoming debits to this sub-account"
          checked={form.values.isActive}
          onChange={(event) =>
            form.setFieldValue("isActive", event.currentTarget.checked)
          }
        />

        <Group justify="flex-end" mt="md">
          <Button
            variant="subtle"
            color="gray"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isEditing ? "Save changes" : "Create partner"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

function parseNumericValue(value: string | number | "") {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim().length) {
    const parsed = Number(value.replace(/,/g, ""));
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}

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
import { useAuth } from "@/contexts/use-auth";
import {
  useCreatePaymentPartner,
  useGetActivePaymentPartners,
  useUpdatePaymentPartner,
} from "@/api/payment-partner/hooks";
import { useFetchMonoBanks } from "@/api/mono/hooks";
import type {
  PaymentPartner,
  PaymentPartnerAllocationType,
  PaymentPartnerFeeBearer,
  PaymentPartnerFormData,
} from "@/api/payment-partner/types";
import {
  createPaymentPartnerSchema,
  paymentPartnerFormSchema,
} from "@/api/payment-partner/schema";
import type { User } from "@/api/user/types";
const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const columnHelper = createColumnHelper<PaymentPartner>();
const CREATE_PARTNER_MODAL_ID = "create-payment-partner-modal";
const EDIT_PARTNER_MODAL_ID = "edit-payment-partner-modal";

type BankOption = { label: string; value: string };

export const Route = createFileRoute("/_auth/admin/payment-partners")({
  component: PaymentPartnerDashboard,
});

function PaymentPartnerDashboard() {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const { data: partners = [], isLoading: isPartnersLoading } =
    useGetActivePaymentPartners();

  const {
    data: banks = [],
    isFetching: isFetchingBanks,
    refetch: refetchBanks,
  } = useFetchMonoBanks();

  const { mutateAsync: updatePartner, isPending: isUpdatingPartner } =
    useUpdatePaymentPartner();

  const bankOptions = useMemo<BankOption[]>(
    () =>
      banks.map((bank) => ({
        label: bank.label,
        value: bank.value,
      })),
    [banks]
  );

  const activePartners = useMemo(
    () => partners.filter((partner) => partner.isActive),
    [partners]
  );

  const percentageCoverage = useMemo(
    () =>
      activePartners
        .filter((partner) => partner.allocationType === "percentage")
        .reduce((total, partner) => total + partner.allocationValue, 0),
    [activePartners]
  );

  const fixedAllocationTotal = useMemo(
    () =>
      activePartners
        .filter((partner) => partner.allocationType === "fixed")
        .reduce((total, partner) => total + partner.allocationValue, 0),
    [activePartners]
  );

  const inactiveCount = partners.length - activePartners.length;
  const overAllocated = percentageCoverage > 100;

  const stats = useMemo(
    () => [
      {
        label: "Active accounts",
        value: `${activePartners.length}`,
        description:
          inactiveCount > 0
            ? `${inactiveCount} temporarily disabled`
            : "All accounts participate",
        icon: Sparkles,
        accent: "text-vibrant-lime",
      },
      {
        label: "Percentage coverage",
        value: `${percentageCoverage.toFixed(0)}%`,
        description: "of debit value routed",
        icon: Banknote,
        accent: "text-institutional-green",
      },
      {
        label: "Fixed pool",
        value: currencyFormatter.format(fixedAllocationTotal),
        description: "guaranteed per charge",
        icon: Wallet,
        accent: "text-sage-green",
      },
    ],
    [
      activePartners.length,
      fixedAllocationTotal,
      inactiveCount,
      percentageCoverage,
    ]
  );

  const openCreatePartnerModal = useCallback(() => {
    if (!user) return;

    modals.open({
      modalId: CREATE_PARTNER_MODAL_ID,
      title: (
        <Title order={3} className="text-deep-forest">
          New split account
        </Title>
      ),
      size: "xl",
      radius: "xl",
      children: (
        <CreatePaymentPartnerModal
          bankOptions={bankOptions}
          user={user}
          onClose={() => modals.close(CREATE_PARTNER_MODAL_ID)}
        />
      ),
    });
  }, [bankOptions, userId]);

  const openEditPartnerModal = useCallback(
    (partner: PaymentPartner) => {
      if (!user) return;

      modals.open({
        modalId: EDIT_PARTNER_MODAL_ID,
        title: (
          <Title order={3} className="text-deep-forest">
            Edit {partner.name}
          </Title>
        ),
        size: "xl",
        radius: "xl",
        children: (
          <EditPaymentPartnerModal
            partner={partner}
            bankOptions={bankOptions}
            user={user}
            onClose={() => modals.close(EDIT_PARTNER_MODAL_ID)}
          />
        ),
      });
    },
    [bankOptions, userId]
  );

  const handleTogglePartner = useCallback(
    async (partner: PaymentPartner, nextState: boolean) => {
      if (!user) return;

      await updatePartner({
        id: partner.id,
        data: { isActive: nextState },
        user,
      });
    },
    [updatePartner]
  );

  const columns = useMemo(
    () =>
      [
        columnHelper.accessor("name", {
          header: "Account",
          cell: (info) => {
            const partner = info.row.original;
            return (
              <Stack gap={0}>
                <Text fw={600}>{partner.name}</Text>
                <Text size="xs" c="dimmed">
                  {partner.bankName} • {partner.accountNumber}
                </Text>
              </Stack>
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
              {info.getValue() === "business" ? "Platform" : "Sub accounts"}
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
                <Tooltip label="Edit account">
                  <ActionIcon
                    variant="light"
                    color="blue"
                    disabled={!userId}
                    onClick={() => openEditPartnerModal(partner)}
                  >
                    <PencilLine className="size-4" />
                  </ActionIcon>
                </Tooltip>
                <Tooltip
                  label={
                    partner.isActive ? "Disable account" : "Enable account"
                  }
                >
                  <ActionIcon
                    variant="light"
                    color={partner.isActive ? "orange" : "green"}
                    disabled={!userId || isUpdatingPartner}
                    onClick={() =>
                      handleTogglePartner(partner, !partner.isActive)
                    }
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
    [isUpdatingPartner, userId]
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
                Split accounts
              </Text>
              <Title order={2} className="text-white" mt="sm">
                Control how every debit lands
              </Title>
              <Text size="sm" c="white" mt="xs" className="max-w-2xl">
                Declare every Mono sub-account that should share in recurring
                mandates. Mix percentages with fixed transfers and pause
                accounts whenever needed.
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
                onClick={openCreatePartnerModal}
                disabled={!userId}
              >
                New account
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
                  {stat.description}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      </Card>

      {!activePartners.length && (
        <Alert
          icon={<AlertCircle className="size-4" />}
          color="orange"
          radius="lg"
          title="No active split accounts"
        >
          Mono cannot distribute mandate debits until at least one account is
          active. Enable an existing account or create a new one.
        </Alert>
      )}

      {overAllocated && (
        <Alert
          icon={<AlertCircle className="size-4" />}
          color="red"
          radius="lg"
          title="Percentage coverage exceeds 100%"
        >
          Reduce one or more percentage allocations so the combined share stays
          within 100%.
        </Alert>
      )}

      <Card withBorder radius="xl" p="xl" shadow="sm">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={3} className="text-deep-forest">
              Payment partners
            </Title>
            <Text size="sm" c="dimmed">
              Manage Mono sub-accounts, allocation logic, and participation
              states
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
          searchPlaceholder="Search by account or bank"
          pageSize={8}
        />
      </Card>
    </Stack>
  );
}

interface CreatePaymentPartnerModalProps {
  bankOptions: BankOption[];
  user: User;
  onClose: () => void;
}

function CreatePaymentPartnerModal({
  bankOptions,
  user,
  onClose,
}: CreatePaymentPartnerModalProps) {
  const form = useForm<PaymentPartnerFormData>({
    initialValues: {
      name: "",
      accountNumber: "",
      nipCode: "",
      allocationType: "fixed",
      allocationValue: 0,
      allocationMax: 0,
      feeBearer: "sub_accounts",
      isActive: true,
    },
    validate: zod4Resolver(paymentPartnerFormSchema),
  });

  const { mutateAsync: createPartner, isPending } = useCreatePaymentPartner();

  const handleSubmit = form.onSubmit(async (data) => {
    await createPartner({ data, user });
    onClose();
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        <Card radius="lg" withBorder>
          <Stack gap="md">
            <Text size="xs" fw={600} className="tracking-[0.3em] uppercase">
              Settlement details
            </Text>
            <TextInput
              label="Account label"
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
                inputMode="numeric"
                {...form.getInputProps("accountNumber")}
              />
              <Select
                label="Bank"
                placeholder="Pick a bank"
                data={bankOptions}
                clearable
                searchable
                nothingFoundMessage="No banks match your search"
                withAsterisk
                value={form.values.nipCode}
                onChange={(value) => form.setFieldValue("nipCode", value ?? "")}
                error={form.errors.nipCode}
              />
            </Group>
          </Stack>
        </Card>

        <Card radius="lg" withBorder>
          <Stack gap="md">
            <Text size="xs" fw={600} className="tracking-[0.3em] uppercase">
              Allocation logic
            </Text>
            <SegmentedControl
              value={form.values.allocationType}
              onChange={(value) =>
                form.setFieldValue(
                  "allocationType",
                  value as PaymentPartnerAllocationType
                )
              }
              data={[
                { label: "Percentage", value: "percentage" },
                { label: "Fixed amount", value: "fixed" },
              ]}
            />
            <Group grow>
              <NumberInput
                label="Allocation value"
                description={
                  form.values.allocationType === "percentage"
                    ? "Share of every debit"
                    : "Amount routed per charge"
                }
                withAsterisk
                min={1}
                max={
                  form.values.allocationType === "percentage" ? 99 : undefined
                }
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
                {...form.getInputProps("allocationValue")}
              />
              <NumberInput
                label="Allocation cap"
                description="Optional ceiling for large mandates"
                min={1}
                leftSection="₦"
                hideControls
                allowNegative={false}
                {...form.getInputProps("allocationMax")}
              />
            </Group>
            <SegmentedControl
              value={form.values.feeBearer}
              onChange={(value) =>
                form.setFieldValue(
                  "feeBearer",
                  value as PaymentPartnerFeeBearer
                )
              }
              data={[
                { label: "Platform pays fees", value: "business" },
                { label: "Partners pay fees", value: "sub_accounts" },
              ]}
            />
            <Switch
              label="Participate immediately"
              description="Enabled accounts join the next debit split"
              {...form.getInputProps("isActive", { type: "checkbox" })}
            />
          </Stack>
        </Card>

        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            You can edit this split later without interrupting existing
            mandates.
          </Text>
          <Group gap="sm">
            <Button
              variant="subtle"
              color="gray"
              type="button"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isPending}>
              Create account
            </Button>
          </Group>
        </Group>
      </Stack>
    </form>
  );
}

interface EditPaymentPartnerModalProps {
  partner: PaymentPartner;
  bankOptions: BankOption[];
  user: User;
  onClose: () => void;
}

function EditPaymentPartnerModal({
  partner,
  bankOptions,
  user,
  onClose,
}: EditPaymentPartnerModalProps) {
  const form = useForm<PaymentPartnerFormData>({
    initialValues: {
      name: partner.name,
      accountNumber: partner.accountNumber,
      nipCode: partner.nipCode,
      allocationType: partner.allocationType,
      allocationValue: partner.allocationValue,
      allocationMax: partner.allocationMax,
      feeBearer: partner.feeBearer,
      isActive: partner.isActive,
    },
    validate: zod4Resolver(createPaymentPartnerSchema),
  });

  const { mutateAsync: updatePartner, isPending } = useUpdatePaymentPartner();

  const handleSubmit = form.onSubmit(async (data) => {
    await updatePartner({
      id: partner.id,
      data,
      user,
    });
    onClose();
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        <Card radius="lg" withBorder>
          <Stack gap="md">
            <Group justify="space-between" align="flex-start">
              <div>
                <Text size="xs" c="dimmed">
                  Settlement account
                </Text>
                <Text fw={600}>{partner.name}</Text>
                <Text size="sm" c="dimmed">
                  {partner.bankName} • {partner.accountNumber}
                </Text>
              </div>
              <Select
                label="NIP code"
                placeholder={partner.bankName}
                data={bankOptions}
                clearable
                searchable
                nothingFoundMessage="No banks match your search"
                value={form.values.nipCode}
                onChange={(value) =>
                  form.setFieldValue("nipCode", value ?? partner.nipCode)
                }
                error={form.errors.nipCode}
              />
            </Group>
            <TextInput
              label="Display label"
              withAsterisk
              {...form.getInputProps("name")}
            />
          </Stack>
        </Card>

        <Card radius="lg" withBorder>
          <Stack gap="md">
            <Group justify="space-between" align="flex-start">
              <div>
                <Text size="xs" c="dimmed">
                  Allocation mode
                </Text>
                <Title order={4}>
                  {form.values.allocationType === "percentage"
                    ? "Percentage"
                    : "Fixed"}
                </Title>
              </div>
              <SegmentedControl
                value={form.values.allocationType}
                onChange={(value) =>
                  form.setFieldValue(
                    "allocationType",
                    value as PaymentPartnerAllocationType
                  )
                }
                data={[
                  { label: "Percentage", value: "percentage" },
                  { label: "Fixed amount", value: "fixed" },
                ]}
              />
            </Group>
            <Group grow>
              <NumberInput
                label="Allocation value"
                withAsterisk
                min={1}
                max={
                  form.values.allocationType === "percentage" ? 99 : undefined
                }
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
                {...form.getInputProps("allocationValue")}
              />
              <NumberInput
                label="Allocation cap"
                leftSection="₦"
                hideControls
                allowNegative={false}
                {...form.getInputProps("allocationMax")}
              />
            </Group>
            <SegmentedControl
              value={form.values.feeBearer}
              onChange={(value) =>
                form.setFieldValue(
                  "feeBearer",
                  value as PaymentPartnerFeeBearer
                )
              }
              data={[
                { label: "Platform pays fees", value: "business" },
                { label: "Partners pay fees", value: "sub_accounts" },
              ]}
            />
          </Stack>
        </Card>

        <Card radius="lg" withBorder>
          <Stack gap="sm">
            <Group justify="space-between" align="center">
              <div>
                <Text fw={600}>Participation</Text>
                <Text size="sm" c="dimmed">
                  Disabled accounts stay on record but stop receiving splits.
                </Text>
              </div>
              <Switch
                {...form.getInputProps("isActive", { type: "checkbox" })}
                labelPosition="left"
                label={form.values.isActive ? "Active" : "Inactive"}
              />
            </Group>
          </Stack>
        </Card>

        <Group justify="flex-end">
          <Button variant="subtle" color="gray" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            Save changes
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

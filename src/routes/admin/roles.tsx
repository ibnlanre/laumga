import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  MultiSelect,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { zod4Resolver } from "mantine-form-zod-resolver";
import {
  PencilLine,
  Plus,
  Shield,
  ShieldCheck,
  ShieldQuestion,
  Trash2,
} from "lucide-react";

import { DataTable } from "@/components/data-table";
import { useAuth } from "@/contexts/use-auth";
import { formatDate } from "@/utils/date";
import { permissionOptions, type Permission } from "@/schema/permissions";
import {
  useCreateRole,
  useListRoles,
  useRemoveRole,
  useUpdateRole,
} from "@/api/role/hooks";
import { roleDataSchema } from "@/api/role/schema";
import type { Role, RoleForm } from "@/api/role/types";

const columnHelper = createColumnHelper<Role>();

const CREATE_ROLE_MODAL_ID = "create-role-modal";
const EDIT_ROLE_MODAL_ID = "edit-role-modal";

export const Route = createFileRoute("/admin/roles")({
  component: RoleManagement,
});

function RoleManagement() {
  const { user, permissions } = useAuth();

  const canViewRoles = permissions.includes("can-view-roles");
  const canEditRoles = permissions.includes("can-edit-roles");
  const canDeleteRoles = permissions.includes("can-delete-roles");

  const { data: roles = [], isLoading } = useListRoles(undefined, {
    enabled: canViewRoles,
  });

  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const removeRole = useRemoveRole();

  const closeModal = (modalId: string) => modals.close(modalId);

  const handleCreateRole = async (values: RoleForm) => {
    if (!user) return;
    await createRole.mutateAsync({
      user,
      data: values,
    });

    closeModal(CREATE_ROLE_MODAL_ID);
  };

  const handleUpdateRole = async (roleId: string, values: RoleForm) => {
    if (!user) return;
    await updateRole.mutateAsync({
      id: roleId,
      user,
      data: values,
    });

    closeModal(EDIT_ROLE_MODAL_ID);
  };

  const handleDeleteRole = async (roleId: string) => {
    await removeRole.mutateAsync(roleId);
  };

  const openCreateModal = () => {
    if (!canEditRoles) return;

    modals.open({
      modalId: CREATE_ROLE_MODAL_ID,
      title: <Title order={3}>Create new role</Title>,
      radius: "lg",
      children: (
        <RoleForm
          mode="create"
          initialValues={getDefaultFormValues()}
          submitting={createRole.isPending}
          onSubmit={(values) => handleCreateRole(values)}
          onCancel={() => closeModal(CREATE_ROLE_MODAL_ID)}
        />
      ),
    });
  };

  const openEditModal = (record: Role) => {
    if (!canEditRoles) return;

    modals.open({
      modalId: EDIT_ROLE_MODAL_ID,
      title: `Edit ${record.name}`,
      radius: "lg",
      children: (
        <RoleForm
          mode="edit"
          initialValues={roleToFormValues(record)}
          submitting={updateRole.isPending}
          onSubmit={(values) => handleUpdateRole(record.id, values)}
          onCancel={() => closeModal(EDIT_ROLE_MODAL_ID)}
        />
      ),
    });
  };

  const openDeleteModal = (record: Role) => {
    if (!canDeleteRoles) return;

    modals.openConfirmModal({
      title: `Delete ${record.name}?`,
      children: (
        <Text size="sm">
          This action cannot be undone. Users assigned to this role will lose
          their permissions.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red", loading: removeRole.isPending },
      onConfirm: () => handleDeleteRole(record.id),
    });
  };

  const columns = getColumns({
    canEditRoles,
    canDeleteRoles,
    openEditModal,
    openDeleteModal,
  });

  if (!canViewRoles) {
    return (
      <Card padding="xl" radius="xl" withBorder>
        <Stack gap="md" align="center" className="py-16 text-center">
          <ShieldQuestion className="size-12 text-orange-500" />
          <Title order={3}>Insufficient permissions</Title>
          <Text c="dimmed">
            Your current role does not grant access to view or manage roles. If
            you believe this is a mistake, please contact an administrator.
          </Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Stack gap="xl">
      <Card
        padding="xl"
        radius="xl"
        withBorder
        className="bg-white shadow-lg border-sage-green/50"
      >
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
              Access control
            </Text>
            <Title order={2} className="text-deep-forest">
              Manage roles & permissions
            </Title>
            <Text size="sm" c="dimmed" maw={480}>
              Create finely tuned roles, assign capabilities, and keep your
              administrative surface tidy. Every role powers the menus your team
              sees.
            </Text>
            <Group gap="xs">
              <Badge color="vibrant-lime" variant="light">
                {roles.length} roles
              </Badge>
              <Badge color="deep-forest" variant="outline">
                {permissionOptions.length} permissions available
              </Badge>
            </Group>
          </Stack>

          <Group gap="sm">
            <Button
              variant="outline"
              leftSection={<ShieldCheck className="size-4" />}
              disabled
            >
              Audit log
            </Button>
            <Button
              leftSection={<Plus className="size-4" />}
              onClick={openCreateModal}
              disabled={!canEditRoles}
            >
              New role
            </Button>
          </Group>
        </Group>
      </Card>

      <DataTable
        data={roles}
        columns={columns}
        loading={isLoading}
        enableSearch
        enablePagination
        enableSorting
        enableColumnOrdering
        searchPlaceholder="Search roles by name..."
      />
    </Stack>
  );
}

interface ColumnConfig {
  canEditRoles: boolean;
  canDeleteRoles: boolean;
  openEditModal: (role: Role) => void;
  openDeleteModal: (role: Role) => void;
}

function getColumns(config: ColumnConfig) {
  const { canEditRoles, canDeleteRoles, openEditModal, openDeleteModal } =
    config;

  return [
    columnHelper.accessor("name", {
      header: "Role",
      cell: (info) => {
        const record = info.row.original;
        return (
          <Stack gap={2}>
            <Group gap={8}>
              <Shield className="size-4 text-deep-forest" />
              <Text fw={600}>{record.name}</Text>
              {record.isSystemRole && (
                <Badge size="xs" color="gray" variant="light">
                  System
                </Badge>
              )}
            </Group>
            {record.description && (
              <Text size="xs" c="dimmed">
                {record.description}
              </Text>
            )}
          </Stack>
        );
      },
    }),
    columnHelper.accessor((row) => row.permissions, {
      id: "permissions",
      header: "Permissions",
      cell: (info) => <PermissionBadges permissions={info.getValue() ?? []} />,
    }),
    columnHelper.accessor((row) => row.updated?.at ?? row.created?.at ?? null, {
      id: "updated",
      header: "Last updated",
      cell: (info) => (
        <Text size="sm" c="dimmed">
          {info.getValue()
            ? formatDate(info.getValue() as Date, "MMM d, yyyy")
            : "—"}
        </Text>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      cell: (info) => {
        const record = info.row.original;
        const disableEdit = record.isSystemRole;
        return (
          <Group gap="xs">
            <Tooltip label="Edit role" disabled={!canEditRoles}>
              <ActionIcon
                variant="light"
                color="blue"
                disabled={!canEditRoles || disableEdit}
                onClick={() => openEditModal(record)}
              >
                <PencilLine className="size-4" />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Delete role" disabled={!canDeleteRoles}>
              <ActionIcon
                variant="light"
                color="red"
                disabled={!canDeleteRoles || record.isSystemRole}
                onClick={() => openDeleteModal(record)}
              >
                <Trash2 className="size-4" />
              </ActionIcon>
            </Tooltip>
          </Group>
        );
      },
    }),
  ] as ColumnDef<Role>[];
}

function PermissionBadges({ permissions }: { permissions: Permission[] }) {
  if (!permissions.length) {
    return (
      <Text size="xs" c="dimmed">
        No permissions
      </Text>
    );
  }

  const [first, second, third, ...rest] = permissions;
  const visible = [first, second, third].filter(Boolean);

  return (
    <Group gap={6} wrap="wrap">
      {visible.map((permission) => (
        <Badge key={permission} size="xs" color="sage-green" variant="light">
          {permission.replace(/can-/g, "").replace(/-/g, " ")}
        </Badge>
      ))}
      {rest.length > 0 && (
        <Badge size="xs" color="gray" variant="outline">
          +{rest.length} more
        </Badge>
      )}
    </Group>
  );
}

interface RoleFormProps {
  mode: "create" | "edit";
  initialValues: RoleForm;
  submitting: boolean;
  onSubmit: (values: RoleForm) => Promise<void> | void;
  onCancel: () => void;
}

function RoleForm({
  mode,
  initialValues,
  submitting,
  onSubmit,
  onCancel,
}: RoleFormProps) {
  const form = useForm<RoleForm>({
    initialValues,
    validate: zod4Resolver(roleDataSchema),
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Role name"
          placeholder="e.g. Operations steward"
          withAsterisk
          {...form.getInputProps("name")}
        />

        <Textarea
          label="Description"
          placeholder="Short summary to help teammates choose the right role"
          minRows={2}
          autosize
          {...form.getInputProps("description")}
        />

        <MultiSelect
          label="Permissions"
          placeholder="Select one or more permissions"
          searchable
          data={permissionOptions}
          nothingFoundMessage="No permission matches"
          checkIconPosition="right"
          {...form.getInputProps("permissions")}
        />

        <Group justify="flex-end" gap="sm">
          <Button
            type="button"
            variant="subtle"
            color="gray"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {mode === "create" ? "Create role" : "Save changes"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

function getDefaultFormValues(): RoleForm {
  return {
    name: "",
    description: "",
    permissions: [],
    isSystemRole: false,
  };
}

function roleToFormValues(role: Role): RoleForm {
  return {
    name: role.name,
    description: role.description,
    permissions: role.permissions,
    isSystemRole: role.isSystemRole,
  };
}

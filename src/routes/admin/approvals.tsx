import { createFileRoute } from "@tanstack/react-router";
import { ActionIcon, Avatar, Group, Stack, Text, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { Check, X } from "lucide-react";

import { useUpdateUser } from "@/api/user/hooks";
import { listUserOptions } from "@/api/user/options";
import type { User } from "@/api/user/types";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/data-table";
import { useAuth } from "@/contexts/use-auth";
import { formatDate } from "@/utils/date";

export const Route = createFileRoute("/admin/approvals")({
  component: RouteComponent,
});

const columnHelper = createColumnHelper<User>();

function RouteComponent() {
  const { user: currentUser } = useAuth();
  const { data: pendingUsers = [], isLoading } = useQuery({
    ...listUserOptions(),
    select: (data) => {
      return data.filter(({ status }) => status === "pending");
    },
  });

  const updateUser = useUpdateUser();

  const handleApprove = (user: User) => {
    modals.openConfirmModal({
      title: "Approve Member",
      children: (
        <Text size="sm">
          Are you sure you want to approve <strong>{user.fullName}</strong>?
          They will gain access to member features.
        </Text>
      ),
      labels: { confirm: "Approve", cancel: "Cancel" },
      confirmProps: { color: "green" },
      onConfirm: () => {
        if (!currentUser) return;
        updateUser.mutate({
          data: {
            id: user.id,
            data: { status: "approved" } as any,
            user: currentUser,
          },
        });
      },
    });
  };

  const handleReject = (user: User) => {
    modals.openConfirmModal({
      title: "Reject Member",
      children: (
        <Text size="sm">
          Are you sure you want to reject <strong>{user.fullName}</strong>?
        </Text>
      ),
      labels: { confirm: "Reject", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        if (!currentUser) return;
        updateUser.mutate({
          data: {
            id: user.id,
            data: { status: "rejected" } as any,
            user: currentUser,
          },
        });
      },
    });
  };

  const columns = [
    columnHelper.accessor("fullName", {
      header: "Member",
      cell: (info) => (
        <Group gap="sm">
          <Avatar src={info.row.original.photoUrl} radius="xl" />
          <div>
            <Text size="sm" fw={500}>
              {info.getValue()}
            </Text>
            <Text size="xs" c="dimmed">
              {info.row.original.email}
            </Text>
          </div>
        </Group>
      ),
    }),
    columnHelper.accessor("phoneNumber", {
      header: "Phone",
      cell: (info) => <Text size="sm">{info.getValue()}</Text>,
    }),
    columnHelper.accessor("stateOfResidence", {
      header: "Location",
      cell: (info) => <Text size="sm">{info.getValue()}</Text>,
    }),
    columnHelper.accessor("created", {
      header: "Registered",
      cell: (info) => (
        <Text size="sm">
          {info.getValue()?.at
            ? formatDate(info.getValue()!.at, "MMM d, yyyy")
            : "-"}
        </Text>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Group gap="xs">
          <Tooltip label="Approve">
            <ActionIcon
              variant="light"
              color="green"
              onClick={() => handleApprove(row.original)}
            >
              <Check size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Reject">
            <ActionIcon
              variant="light"
              color="red"
              onClick={() => handleReject(row.original)}
            >
              <X size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    }),
  ];

  return (
    <Stack gap="xl">
      <AdminPageHeader
        eyebrow="Verification"
        title="Approval control room"
        description="Filter, audit, and action on every onboarding request from a single cockpit."
      />

      <DataTable
        columns={columns}
        data={pendingUsers}
        loading={isLoading}
        enableSearch
        searchPlaceholder="Search pending members..."
      />
    </Stack>
  );
}

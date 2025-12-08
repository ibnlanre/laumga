import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Badge,
  Button,
  Group,
  Stack,
  Avatar,
  Modal,
  Text,
  Title,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { Eye, Check, X, Ban, RefreshCw } from "lucide-react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { formatDate } from "@/utils/date";
import type { ApprovalStatus, User } from "@/api/user/types";
import { useListUsers, useUpdateUser } from "@/api/user/hooks";

export const Route = createFileRoute("/_auth/admin/users")({
  component: UserManagement,
});

function UserManagement() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailsOpened, setDetailsOpened] = useState(false);

  const { data: users = [], isLoading } = useListUsers();
  const updateUserMutation = useUpdateUser();

  const columnHelper = createColumnHelper<User>();

  const columns = [
    columnHelper.accessor("firstName", {
      header: "Member",
      cell: (info) => {
        const userRow = info.row.original;
        return (
          <Group gap="sm">
            <Avatar
              src={userRow.photoUrl}
              alt={`${userRow.firstName} ${userRow.lastName}`}
              size="md"
              radius="xl"
            >
              {userRow.fullName}
            </Avatar>
            <div>
              <Text size="sm" fw={500}>
                {userRow.gender === "male" ? "Bro." : "Sis."}{" "}
                {userRow.firstName} {userRow.lastName}
              </Text>
              <Text size="xs" c="dimmed">
                {userRow.stateOfResidence}
              </Text>
            </div>
          </Group>
        );
      },
    }),

    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => <Text size="sm">{info.getValue() ?? ""}</Text>,
    }),

    columnHelper.accessor("phoneNumber", {
      header: "Phone",
      cell: (info) => <Text size="sm">{info.getValue() ?? ""}</Text>,
    }),

    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <Badge color={getStatusColor(info.getValue())} variant="light">
          {info.getValue() ?? ""}
        </Badge>
      ),
    }),

    columnHelper.accessor("created", {
      header: "Registered",
      cell: (info) => {
        const created = info.getValue();
        return (
          <Text size="xs" c="dimmed">
            {created?.at ? formatDate(created.at, "MMM d, yyyy") : "N/A"}
          </Text>
        );
      },
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <Group gap="xs">
          <Tooltip label="View details">
            <ActionIcon
              variant="light"
              color="blue"
              onClick={() => viewUserDetails(info.row.original)}
            >
              <Eye className="size-4" />
            </ActionIcon>
          </Tooltip>

          {info.row.original.status === "pending" && (
            <>
              <Tooltip label="Approve">
                <ActionIcon
                  variant="light"
                  color="green"
                  onClick={() =>
                    handleStatusChange("approved")
                  }
                >
                  <Check className="size-4" />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Reject">
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() =>
                    handleStatusChange("rejected")
                  }
                >
                  <X className="size-4" />
                </ActionIcon>
              </Tooltip>
            </>
          )}

          {info.row.original.status === "approved" && (
            <Tooltip label="Suspend">
              <ActionIcon
                variant="light"
                color="orange"
                onClick={() =>
                  handleStatusChange("suspended")
                }
              >
                <Ban className="size-4" />
              </ActionIcon>
            </Tooltip>
          )}

          {info.row.original.status === "suspended" && (
            <Tooltip label="Reactivate">
              <ActionIcon
                variant="light"
                color="green"
                onClick={() =>
                  handleStatusChange("approved")
                }
              >
                <RefreshCw className="size-4" />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      ),
    }),
  ] as ColumnDef<User>[];

  const handleStatusChange = async (
 
    newStatus: ApprovalStatus
  ) => {
    if (!selectedUser) return;

    await updateUserMutation.mutateAsync({
      user: selectedUser,
      data: { status: newStatus },
      id: selectedUser.id,
    });

    setDetailsOpened(false);
  };

  const getStatusColor = (status: ApprovalStatus) => {
    switch (status) {
      case "approved":
        return "green";
      case "pending":
        return "orange";
      case "rejected":
        return "red";
      case "suspended":
        return "gray";
      default:
        return "blue";
    }
  };

  const viewUserDetails = (user: User) => {
    setSelectedUser(user);
    setDetailsOpened(true);
  };

  return (
    <Stack gap="xl">
      {/* Header */}
      <div>
        <Title order={1} className="text-deep-forest mb-2">
          User Management
        </Title>
        <Text c="dimmed">Manage member registrations and approvals</Text>
      </div>

      {/* User Table */}
      <DataTable
        columns={columns}
        data={users}
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
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
              { value: "suspended", label: "Suspended" },
            ],
          },
        ]}
        searchPlaceholder="Search by name, email, or membership ID..."
        pageSize={10}
        loading={isLoading}
      />

      {/* User Details Modal */}
      <Modal
        opened={detailsOpened}
        onClose={() => setDetailsOpened(false)}
        title={<Title order={3}>Member Details</Title>}
        size="lg"
      >
        {selectedUser && (
          <Stack gap="md">
            <Group>
              <Avatar src={selectedUser.photoUrl} size="xl" radius="md">
                {selectedUser.firstName[0]}
                {selectedUser.lastName[0]}
              </Avatar>
              <div>
                <Text size="lg" fw={600}>
                  {selectedUser.gender === "male" ? "Bro." : "Sis."}{" "}
                  {selectedUser.firstName} {selectedUser.lastName}
                </Text>
                <Badge color={getStatusColor(selectedUser.status)} mt="xs">
                  {selectedUser.status}
                </Badge>
              </div>
            </Group>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text size="xs" c="dimmed">
                  Email
                </Text>
                <Text size="sm">{selectedUser.email}</Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">
                  Phone
                </Text>
                <Text size="sm">{selectedUser.phoneNumber}</Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">
                  Date of Birth
                </Text>
                <Text size="sm">
                  {selectedUser.dateOfBirth
                    ? formatDate(selectedUser.dateOfBirth, "MMM d, yyyy")
                    : "N/A"}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">
                  State of Origin
                </Text>
                <Text size="sm">{selectedUser.stateOfOrigin}</Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">
                  State of Residence
                </Text>
                <Text size="sm">{selectedUser.stateOfResidence}</Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">
                  Address
                </Text>
                <Text size="sm">{selectedUser.address}</Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">
                  Registered
                </Text>
                <Text size="sm">
                  {selectedUser.created?.at
                    ? formatDate(selectedUser.created.at, "MMM d, yyyy HH:mm")
                    : "N/A"}
                </Text>
              </div>
            </div>

            {selectedUser.status === "pending" && (
              <Group mt="md" justify="flex-end">
                <Button
                  leftSection={<X className="size-4" />}
                  variant="outline"
                  color="red"
                  onClick={() =>
                    handleStatusChange("rejected")
                  }
                  loading={updateUserMutation.isPending}
                >
                  Reject
                </Button>
                <Button
                  leftSection={<Check className="size-4" />}
                  variant="filled"
                  color="green"
                  onClick={() =>
                    handleStatusChange("approved")
                  }
                  loading={updateUserMutation.isPending}
                >
                  Approve
                </Button>
              </Group>
            )}

            {selectedUser.status === "approved" && (
              <Group mt="md" justify="flex-end">
                <Button
                  leftSection={<Ban className="size-4" />}
                  variant="outline"
                  color="orange"
                  onClick={() =>
                    handleStatusChange("suspended")
                  }
                  loading={updateUserMutation.isPending}
                >
                  Suspend
                </Button>
              </Group>
            )}

            {selectedUser.status === "suspended" && (
              <Group mt="md" justify="flex-end">
                <Button
                  leftSection={<RefreshCw className="size-4" />}
                  variant="filled"
                  color="green"
                  onClick={() =>
                    handleStatusChange("approved")
                  }
                  loading={updateUserMutation.isPending}
                >
                  Reactivate
                </Button>
              </Group>
            )}
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}

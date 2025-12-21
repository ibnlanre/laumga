import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Badge,
  Button,
  Group,
  Stack,
  Avatar,
  Text,
  Title,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { Eye, Check, X, Ban, RefreshCw, Shield } from "lucide-react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { formatDate } from "@/utils/date";
import type { ApprovalStatus, User } from "@/api/user/types";
import { useUpdateUser } from "@/api/user/hooks";
import { listUserOptions } from "@/api/user/options";
import { useQuery } from "@tanstack/react-query";
import { modals } from "@mantine/modals";
import { UserRolesModal } from "@/components/user-roles-modal";

export const Route = createFileRoute("/admin/users")({
  component: UserManagement,
});

function UserManagement() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: users = [], isLoading } = useQuery(listUserOptions());
  const updateUserMutation = useUpdateUser();

  const columnHelper = createColumnHelper<User>();

  const columns = [
    columnHelper.accessor("firstName", {
      header: "Member",
      cell: (info) => {
        const userRow = info.row.original;
        const assignment = userRow.gender === "male" ? "Bro." : "Sis.";
        const title = userRow.title || assignment;

        return (
          <Group gap="sm">
            <Avatar
              src={userRow.photoUrl}
              alt={userRow.fullName}
              size="md"
              radius="xl"
            >
              {userRow.fullName}
            </Avatar>
            <div>
              <Text size="sm" fw={500}>
                {title} {userRow.fullName}
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
              <Eye size={16} />
            </ActionIcon>
          </Tooltip>

          {info.row.original.status === "pending" && (
            <>
              <Tooltip label="Approve">
                <ActionIcon
                  variant="light"
                  color="green"
                  onClick={() => handleStatusChange("approved")}
                >
                  <Check size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Reject">
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => handleStatusChange("rejected")}
                >
                  <X size={16} />
                </ActionIcon>
              </Tooltip>
            </>
          )}

          {info.row.original.status === "approved" && (
            <Tooltip label="Suspend">
              <ActionIcon
                variant="light"
                color="orange"
                onClick={() => handleStatusChange("suspended")}
              >
                <Ban size={16} />
              </ActionIcon>
            </Tooltip>
          )}

          {info.row.original.status === "suspended" && (
            <Tooltip label="Reactivate">
              <ActionIcon
                variant="light"
                color="green"
                onClick={() => handleStatusChange("approved")}
              >
                <RefreshCw size={16} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      ),
    }),
  ] as ColumnDef<User>[];

  const handleStatusChange = async (status: ApprovalStatus) => {
    if (!selectedUser) return;

    await updateUserMutation.mutateAsync({
      data: {
        data: { status },
        id: selectedUser.id,
        user: selectedUser,
      },
    });
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
    modals.open({
      title: "Member Details",
      children: <UserDetailsContent user={user} />,
    });
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
    </Stack>
  );
}

interface UserDetailsContentProps {
  user: User;
}

function UserDetailsContent({ user }: UserDetailsContentProps) {
  const updateUserMutation = useUpdateUser();

  const handleStatusChange = async (status: ApprovalStatus) => {
    await updateUserMutation.mutateAsync({
      data: {
        user,
        data: { status },
        id: user.id,
      },
    });

    modals.closeAll();
  };

  const getStatusColorLocal = (status: ApprovalStatus) => {
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

  const initials = `${user.firstName[0]}${user.lastName[0]}`;
  const assignment = user.gender === "male" ? "Bro." : "Sis.";
  const title = user.title || assignment;

  return (
    <Stack gap="md">
      <Group>
        <Avatar src={user.photoUrl} size="xl" radius="md" alt={user.fullName}>
          {initials}
        </Avatar>
        <div>
          <Text size="lg" fw={600}>
            {title} {user.fullName}
          </Text>
          <Badge color={getStatusColorLocal(user.status)} mt="xs">
            {user.status}
          </Badge>
        </div>
      </Group>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Text size="xs" c="dimmed">
            Email
          </Text>
          <Text size="sm">{user.email}</Text>
        </div>
        <div>
          <Text size="xs" c="dimmed">
            Phone
          </Text>
          <Text size="sm">{user.phoneNumber}</Text>
        </div>
        <div>
          <Text size="xs" c="dimmed">
            Date of Birth
          </Text>
          <Text size="sm">
            {user.dateOfBirth
              ? formatDate(user.dateOfBirth, "MMM d, yyyy")
              : "N/A"}
          </Text>
        </div>
        <div>
          <Text size="xs" c="dimmed">
            State of Origin
          </Text>
          <Text size="sm">{user.stateOfOrigin}</Text>
        </div>
        <div>
          <Text size="xs" c="dimmed">
            State of Residence
          </Text>
          <Text size="sm">{user.stateOfResidence}</Text>
        </div>
        <div>
          <Text size="xs" c="dimmed">
            Address
          </Text>
          <Text size="sm">{user.address}</Text>
        </div>
        <div>
          <Text size="xs" c="dimmed">
            Registered
          </Text>
          <Text size="sm">
            {user.created?.at
              ? formatDate(user.created.at, "MMM d, yyyy HH:mm")
              : "N/A"}
          </Text>
        </div>
      </div>

      {user.status === "pending" && (
        <Group mt="md" justify="flex-end">
          <Button
            leftSection={<X size={16} />}
            variant="outline"
            color="red"
            onClick={() => handleStatusChange("rejected")}
            loading={updateUserMutation.isPending}
          >
            Reject
          </Button>
          <Button
            leftSection={<Check size={16} />}
            variant="filled"
            color="green"
            onClick={() => handleStatusChange("approved")}
            loading={updateUserMutation.isPending}
          >
            Approve
          </Button>
        </Group>
      )}

      {user.status === "approved" && (
        <Group mt="md" justify="flex-end">
          <Button
            leftSection={<Shield size={16} />}
            variant="outline"
            onClick={() =>
              modals.open({
                title: "Manage User Roles",
                children: <UserRolesModal id={user.id} />,
              })
            }
          >
            Manage Roles
          </Button>
          <Button
            leftSection={<Ban size={16} />}
            variant="outline"
            color="orange"
            onClick={() => handleStatusChange("suspended")}
            loading={updateUserMutation.isPending}
          >
            Suspend
          </Button>
        </Group>
      )}

      {user.status === "suspended" && (
        <Group mt="md" justify="flex-end">
          <Button
            leftSection={<RefreshCw size={16} />}
            variant="filled"
            color="green"
            onClick={() => handleStatusChange("approved")}
            loading={updateUserMutation.isPending}
          >
            Reactivate
          </Button>
        </Group>
      )}
    </Stack>
  );
}

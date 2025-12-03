import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Table,
  Badge,
  Button,
  TextInput,
  Select,
  Group,
  Stack,
  Avatar,
  Modal,
  Text,
  Title,
  Card,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Search, Eye, Check, X, Ban, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { useFetchUsers, useUpdateUser } from "@/services/hooks";
import type { User, ApprovalStatus } from "@/api/user";

export const Route = createFileRoute("/_auth/admin/users")({
  component: UserManagement,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      status: (search.status as ApprovalStatus) || undefined,
    };
  },
});

function UserManagement() {
  const { status } = Route.useSearch();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(status || "all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailsOpened, setDetailsOpened] = useState(false);

  const { data: users = [], isLoading } = useFetchUsers();
  const updateUserMutation = useUpdateUser();

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.membershipId?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (
    userId: string,
    newStatus: ApprovalStatus
  ) => {
    try {
      await updateUserMutation.mutateAsync({
        userId: userId,
        updates: { status: newStatus },
      });

      notifications.show({
        title: "Status updated",
        message: `User status changed to ${newStatus}`,
        color: "green",
      });

      setDetailsOpened(false);
    } catch (error: any) {
      notifications.show({
        title: "Update failed",
        message: error?.message || "Failed to update user status",
        color: "red",
      });
    }
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

      {/* Filters */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group>
          <TextInput
            placeholder="Search by name, email, or ID..."
            leftSection={<Search className="size-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value || "all")}
            data={[
              { value: "all", label: "All Statuses" },
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
              { value: "suspended", label: "Suspended" },
            ]}
            className="w-48"
          />
        </Group>
      </Card>

      {/* User Table */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        {isLoading ? (
          <Text ta="center" py="xl" c="dimmed">
            Loading users...
          </Text>
        ) : filteredUsers.length === 0 ? (
          <Text ta="center" py="xl" c="dimmed">
            No users found
          </Text>
        ) : (
          <Table.ScrollContainer minWidth={800}>
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Member</Table.Th>
                  <Table.Th>Membership ID</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>Phone</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Registered</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredUsers.map((user: any) => (
                  <Table.Tr key={user.email}>
                    <Table.Td>
                      <Group gap="sm">
                        <Avatar
                          src={user.passportUrl}
                          alt={`${user.firstName} ${user.lastName}`}
                          size="md"
                          radius="xl"
                        >
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </Avatar>
                        <div>
                          <Text size="sm" fw={500}>
                            {user.gender === "male" ? "Bro." : "Sis."}{" "}
                            {user.firstName} {user.lastName}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {user.stateOfResidence}
                          </Text>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" ff="monospace">
                        {user.membershipId || "N/A"}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{user.email}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{user.phoneNumber}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={getStatusColor(user.status)}
                        variant="light"
                      >
                        {user.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" c="dimmed">
                        {user.created?.at
                          ? format(new Date(user.created.at), "MMM d, yyyy")
                          : "N/A"}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Tooltip label="View details">
                          <ActionIcon
                            variant="light"
                            color="blue"
                            onClick={() => viewUserDetails(user)}
                          >
                            <Eye className="size-4" />
                          </ActionIcon>
                        </Tooltip>
                        {user.status === "pending" && (
                          <>
                            <Tooltip label="Approve">
                              <ActionIcon
                                variant="light"
                                color="green"
                                onClick={() =>
                                  handleStatusChange(user.email, "approved")
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
                                  handleStatusChange(user.email, "rejected")
                                }
                              >
                                <X className="size-4" />
                              </ActionIcon>
                            </Tooltip>
                          </>
                        )}
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </Card>

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
              <Avatar src={selectedUser.passportUrl} size="xl" radius="md">
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
                  Membership ID
                </Text>
                <Text size="sm" fw={500} ff="monospace">
                  {selectedUser.membershipId || "N/A"}
                </Text>
              </div>
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
                    ? format(new Date(selectedUser.dateOfBirth), "MMM d, yyyy")
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
                    ? format(
                        new Date(selectedUser.created.at),
                        "MMM d, yyyy HH:mm"
                      )
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
                    handleStatusChange(selectedUser.email, "rejected")
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
                    handleStatusChange(selectedUser.email, "approved")
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
                    handleStatusChange(selectedUser.email, "suspended")
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
                    handleStatusChange(selectedUser.email, "approved")
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

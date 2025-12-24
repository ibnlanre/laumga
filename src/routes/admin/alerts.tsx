import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ActionIcon,
  Badge,
  Group,
  Stack,
  Text,
  Tooltip,
  Menu,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { CheckCircle, Eye, MoreHorizontal, Archive, Inbox } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";

import { AdminPageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/data-table";
import { listNotificationOptions } from "@/api/notification/options";
import { useUpdateNotificationStatus } from "@/api/notification/hooks";
import type { Notification } from "@/api/notification/types";
import { formatDate } from "@/utils/date";

export const Route = createFileRoute("/admin/alerts")({
  component: RouteComponent,
});

const columnHelper = createColumnHelper<Notification>();

function RouteComponent() {
  const updateStatusMutation = useUpdateNotificationStatus();

  const { data: notifications = [], isLoading } = useQuery(
    listNotificationOptions({
      sortBy: [{ field: "createdAt", direction: "desc" }],
    })
  );

  const handleViewDetails = (item: Notification) => {
    modals.open({
      title: <Text fw={700}>{item.subject}</Text>,
      size: "lg",
      children: (
        <Stack gap="md">
          <Group justify="space-between">
            <div>
              <Text size="sm" c="dimmed">
                From
              </Text>
              <Text fw={500}>
                {item.fullName} ({item.email})
              </Text>
            </div>
            <div className="text-right">
              <Text size="sm" c="dimmed">
                Date
              </Text>
              <Text fw={500}>{formatDate(item.createdAt)}</Text>
            </div>
          </Group>

          <div>
            <Text size="sm" c="dimmed" mb={4}>
              Message
            </Text>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
              <Text style={{ whiteSpace: "pre-wrap" }}>{item.message}</Text>
            </div>
          </div>

          <Group justify="flex-end">
            {item.status === "new" && (
              <ActionIcon
                variant="light"
                color="blue"
                size="lg"
                onClick={() => {
                  updateStatusMutation.mutate({
                    data: {
                      id: item.id,
                      status: "reviewed",
                    },
                  });
                  modals.closeAll();
                }}
              >
                <Tooltip label="Mark as Reviewed">
                  <Inbox className="size-5" />
                </Tooltip>
              </ActionIcon>
            )}
            {item.status !== "resolved" && (
              <ActionIcon
                variant="light"
                color="green"
                size="lg"
                onClick={() => {
                  updateStatusMutation.mutate({
                    data: {
                      id: item.id,
                      status: "resolved",
                    },
                  });
                  modals.closeAll();
                }}
              >
                <Tooltip label="Mark as Resolved">
                  <CheckCircle className="size-5" />
                </Tooltip>
              </ActionIcon>
            )}
          </Group>
        </Stack>
      ),
    });
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("subject", {
        header: "Subject",
        cell: (info) => (
          <Text fw={500} lineClamp={1}>
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor("fullName", {
        header: "Sender",
        cell: (info) => (
          <div>
            <Text size="sm" fw={500}>
              {info.getValue()}
            </Text>
            <Text size="xs" c="dimmed">
              {info.row.original.email}
            </Text>
          </div>
        ),
      }),
      columnHelper.accessor("category", {
        header: "Category",
        cell: (info) => (
          <Badge variant="dot" color="gray">
            {info.getValue()}
          </Badge>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue();
          const color =
            status === "new"
              ? "blue"
              : status === "resolved"
                ? "green"
                : "gray";
          return (
            <Badge color={color} variant="light">
              {status}
            </Badge>
          );
        },
      }),
      columnHelper.accessor("createdAt", {
        header: "Date",
        cell: (info) => <Text size="sm">{formatDate(info.getValue())}</Text>,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <Group gap={4} justify="flex-end">
            <Tooltip label="View Details">
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => handleViewDetails(info.row.original)}
              >
                <Eye className="size-4" />
              </ActionIcon>
            </Tooltip>
            <Menu position="bottom-end" withArrow>
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray">
                  <MoreHorizontal className="size-4" />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Update Status</Menu.Label>
                <Menu.Item
                  leftSection={<Inbox className="size-4" />}
                  onClick={() =>
                    updateStatusMutation.mutate({
                      data: {
                        id: info.row.original.id,
                        status: "reviewed",
                      },
                    })
                  }
                  disabled={info.row.original.status === "reviewed"}
                >
                  Mark as Reviewed
                </Menu.Item>
                <Menu.Item
                  leftSection={<CheckCircle className="size-4" />}
                  onClick={() =>
                    updateStatusMutation.mutate({
                      data: {
                        id: info.row.original.id,
                        status: "resolved",
                      },
                    })
                  }
                  disabled={info.row.original.status === "resolved"}
                >
                  Mark as Resolved
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<Archive className="size-4" />}
                  color="red"
                  disabled
                >
                  Archive
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        ),
      }),
    ],
    [updateStatusMutation.isPending]
  );

  return (
    <Stack gap="xl">
      <AdminPageHeader
        eyebrow="Signals"
        title="Inbox & Alerts"
        description="Manage incoming messages and system notifications."
      />

      <DataTable
        data={notifications}
        columns={columns}
        loading={isLoading}
        searchPlaceholder="Search notifications..."
      />
    </Stack>
  );
}

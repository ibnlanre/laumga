import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, Grid, Button, Group, Stack, Text, Title } from "@mantine/core";
import {
  Users,
  UserCheck,
  UserX,
  Calendar,
  Image,
  FileText,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { useFetchUsers } from "@/services/hooks";

export const Route = createFileRoute("/_auth/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: users = [], isLoading } = useFetchUsers();

  // Calculate statistics
  const pendingUsers = users.filter((u) => u.status === "pending").length;
  const approvedUsers = users.filter((u) => u.status === "approved").length;
  const rejectedUsers = users.filter((u) => u.status === "rejected").length;
  const totalUsers = users.length;

  const stats = [
    {
      title: "Total Members",
      value: totalUsers,
      icon: Users,
      color: "blue",
      description: "Registered users",
    },
    {
      title: "Pending Approval",
      value: pendingUsers,
      icon: UserCheck,
      color: "orange",
      description: "Awaiting review",
      link: "/admin/users?status=pending",
    },
    {
      title: "Approved Members",
      value: approvedUsers,
      icon: UserCheck,
      color: "green",
      description: "Active members",
    },
    {
      title: "Rejected",
      value: rejectedUsers,
      icon: UserX,
      color: "red",
      description: "Declined applications",
    },
  ];

  const quickActions = [
    {
      title: "Pending Users",
      description: `${pendingUsers} users awaiting approval`,
      icon: UserCheck,
      color: "orange",
      link: "/admin/users?status=pending",
    },
    {
      title: "Events",
      description: "Manage upcoming events",
      icon: Calendar,
      color: "blue",
      link: "/admin/events",
    },
    {
      title: "Gallery",
      description: "Moderate photo uploads",
      icon: Image,
      color: "violet",
      link: "/admin/gallery",
    },
    {
      title: "Articles",
      description: "Manage bulletin content",
      icon: FileText,
      color: "green",
      link: "/admin/articles",
    },
  ];

  return (
    <Stack gap="xl">
      {/* Header */}
      <div>
        <Title order={1} className="text-deep-forest mb-2">
          Admin Dashboard
        </Title>
        <Text c="dimmed">Manage your LAUMGA community</Text>
      </div>

      {/* Statistics Cards */}
      <Grid>
        {stats.map((stat) => (
          <Grid.Col key={stat.title} span={{ base: 12, sm: 6, lg: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                  <stat.icon className={`size-6 text-${stat.color}-600`} />
                </div>
                {stat.link && (
                  <Button
                    component={Link}
                    to={stat.link}
                    variant="subtle"
                    size="xs"
                    color={stat.color}
                  >
                    View
                  </Button>
                )}
              </Group>

              <Text size="sm" c="dimmed" mb={5}>
                {stat.title}
              </Text>
              <Text size="xl" fw={700} className="text-deep-forest">
                {isLoading ? "..." : stat.value}
              </Text>
              <Text size="xs" c="dimmed" mt={5}>
                {stat.description}
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {/* Quick Actions */}
      <div>
        <Title order={2} size="h3" mb="md" className="text-deep-forest">
          Quick Actions
        </Title>
        <Grid>
          {quickActions.map((action) => (
            <Grid.Col key={action.title} span={{ base: 12, sm: 6, md: 3 }}>
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                component={Link}
                to={action.link}
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <Stack gap="md">
                  <div className={`p-3 rounded-lg bg-${action.color}-50 w-fit`}>
                    <action.icon
                      className={`size-6 text-${action.color}-600`}
                    />
                  </div>
                  <div>
                    <Text fw={600} className="text-deep-forest">
                      {action.title}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {action.description}
                    </Text>
                  </div>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </div>

      {/* Recent Activity */}
      <div>
        <Title order={2} size="h3" mb="md" className="text-deep-forest">
          Recent Activity
        </Title>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            {pendingUsers > 0 ? (
              <>
                <Group justify="space-between">
                  <Group>
                    <div className="p-2 rounded-lg bg-orange-50">
                      <UserCheck className="size-5 text-orange-600" />
                    </div>
                    <div>
                      <Text size="sm" fw={500}>
                        {pendingUsers} new registration
                        {pendingUsers !== 1 ? "s" : ""} pending approval
                      </Text>
                      <Text size="xs" c="dimmed">
                        Action required
                      </Text>
                    </div>
                  </Group>
                  <Button
                    component={Link}
                    to="/admin/users?status=pending"
                    variant="light"
                    color="orange"
                    size="sm"
                  >
                    Review
                  </Button>
                </Group>
              </>
            ) : (
              <Text c="dimmed" ta="center" py="xl">
                No pending actions
              </Text>
            )}
          </Stack>
        </Card>
      </div>

      {/* System Overview */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} size="h4" mb="md" className="text-deep-forest">
              Membership Growth
            </Title>
            <div className="flex items-center justify-center py-8">
              <TrendingUp className="size-16 text-vibrant-lime" />
            </div>
            <Text ta="center" c="dimmed">
              Analytics coming soon
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} size="h4" mb="md" className="text-deep-forest">
              Contribution Overview
            </Title>
            <div className="flex items-center justify-center py-8">
              <DollarSign className="size-16 text-institutional-green" />
            </div>
            <Text ta="center" c="dimmed">
              Financial reports coming soon
            </Text>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

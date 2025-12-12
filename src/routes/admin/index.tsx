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
  Banknote,
} from "lucide-react";
import { Section } from "@/components/section";
import { useListUsers } from "@/api/user/hooks";

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: users = [], isLoading } = useListUsers();

  const pendingUsers = users.filter(
    ({ status }) => status === "pending"
  ).length;

  const approvedUsers = users.filter(
    ({ status }) => status === "approved"
  ).length;

  const rejectedUsers = users.filter(
    ({ status }) => status === "rejected"
  ).length;

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
      title: "Payment Partners",
      description: "Control Mono split accounts",
      icon: Banknote,
      color: "teal",
      link: "/admin/payment-partners",
    },
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
    <div className="min-h-screen bg-linear-to-br from-mist-green via-white to-mist-green/50">
      <Stack gap="0">
        {/* Header Section - Full Width Background */}
        <div className="bg-white border-b border-sage-green/20 py-8">
          <Section>
            <Title
              order={1}
              className="text-deep-forest mb-2 text-4xl font-bold"
            >
              Admin Dashboard
            </Title>
            <Text c="dimmed" size="lg">
              Manage your LAUMGA community
            </Text>
          </Section>
        </div>

        {/* Main Content */}
        <div className="py-8">
          <Section component={Stack} gap="xl">
            {/* Statistics Cards */}
            <div>
              <Grid gutter="lg">
                {stats.map((stat) => (
                  <Grid.Col key={stat.title} span={{ base: 12, sm: 6, lg: 3 }}>
                    <Card
                      shadow="md"
                      padding="xl"
                      radius="lg"
                      withBorder
                      className="bg-white hover:shadow-lg transition-shadow h-full"
                    >
                      <Group justify="space-between" mb="lg">
                        <div className={`p-4 rounded-xl bg-${stat.color}-50`}>
                          <stat.icon
                            className={`size-7 text-${stat.color}-700`}
                          />
                        </div>
                        {stat.link && (
                          <Button
                            component={Link}
                            to={stat.link}
                            variant="subtle"
                            size="sm"
                            color={stat.color}
                          >
                            View
                          </Button>
                        )}
                      </Group>

                      <Text size="sm" c="dimmed" mb={8}>
                        {stat.title}
                      </Text>
                      <Text
                        size="2xl"
                        fw={700}
                        className="text-deep-forest mb-3"
                      >
                        {isLoading ? "..." : stat.value}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {stat.description}
                      </Text>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            </div>

            {/* Quick Actions */}
            <div>
              <Title order={2} size="h3" mb="lg" className="text-deep-forest">
                Quick Actions
              </Title>
              <Grid gutter="lg">
                {quickActions.map((action) => (
                  <Grid.Col
                    key={action.title}
                    span={{ base: 12, sm: 6, md: 3 }}
                  >
                    <Card
                      shadow="md"
                      padding="xl"
                      radius="lg"
                      withBorder
                      component={Link}
                      to={action.link}
                      className="bg-white hover:shadow-lg transition-all hover:border-${action.color}-300 cursor-pointer h-full"
                    >
                      <Stack gap="lg" h="100%">
                        <div
                          className={`p-4 rounded-xl bg-${action.color}-50 w-fit`}
                        >
                          <action.icon
                            className={`size-7 text-${action.color}-700`}
                          />
                        </div>
                        <div>
                          <Text
                            fw={600}
                            size="lg"
                            className="text-deep-forest mb-2"
                          >
                            {action.title}
                          </Text>
                          <Text size="sm" c="dimmed" lh="1.5">
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
              <Title order={2} size="h3" mb="lg" className="text-deep-forest">
                Recent Activity
              </Title>
              <Card
                shadow="md"
                padding="xl"
                radius="lg"
                withBorder
                className="bg-white"
              >
                <Stack gap="md">
                  {pendingUsers > 0 ? (
                    <>
                      <Group justify="space-between" align="center">
                        <Group gap="md">
                          <div className="p-3 rounded-xl bg-orange-50">
                            <UserCheck className="size-6 text-orange-600" />
                          </div>
                          <div>
                            <Text
                              size="base"
                              fw={600}
                              className="text-deep-forest"
                            >
                              {pendingUsers} new registration
                              {pendingUsers !== 1 ? "s" : ""} pending approval
                            </Text>
                            <Text size="sm" c="dimmed">
                              Action required
                            </Text>
                          </div>
                        </Group>
                        <Button
                          component={Link}
                          to="/admin/users?status=pending"
                          variant="light"
                          color="orange"
                          size="md"
                        >
                          Review
                        </Button>
                      </Group>
                    </>
                  ) : (
                    <Text c="dimmed" ta="center" py="xl" size="base">
                      No pending actions
                    </Text>
                  )}
                </Stack>
              </Card>
            </div>

            {/* System Overview */}
            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card
                  shadow="md"
                  padding="xl"
                  radius="lg"
                  withBorder
                  className="bg-white h-full"
                >
                  <Title
                    order={3}
                    size="h4"
                    mb="lg"
                    className="text-deep-forest"
                  >
                    Membership Growth
                  </Title>
                  <div className="flex flex-col items-center justify-center py-12">
                    <TrendingUp className="size-20 text-vibrant-lime mb-4" />
                    <Text ta="center" c="dimmed" size="base">
                      Analytics coming soon
                    </Text>
                  </div>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card
                  shadow="md"
                  padding="xl"
                  radius="lg"
                  withBorder
                  className="bg-white h-full"
                >
                  <Title
                    order={3}
                    size="h4"
                    mb="lg"
                    className="text-deep-forest"
                  >
                    Contribution Overview
                  </Title>
                  <div className="flex flex-col items-center justify-center py-12">
                    <DollarSign className="size-20 text-institutional-green mb-4" />
                    <Text ta="center" c="dimmed" size="base">
                      Financial reports coming soon
                    </Text>
                  </div>
                </Card>
              </Grid.Col>
            </Grid>
          </Section>
        </div>
      </Stack>
    </div>
  );
}

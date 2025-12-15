import { useMemo } from "react";
import type { ComponentType, ReactNode, SVGProps } from "react";
import clsx from "clsx";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import {
  ArrowUpRight,
  CalendarDays,
  LineChart,
  Paperclip,
  Sparkles,
  Users,
} from "lucide-react";

import { useListUsers } from "@/api/user/hooks";
import { useListMandates } from "@/api/mandate/hooks";
import { useListEvents } from "@/api/event/hooks";
import { useListArticles } from "@/api/article/hooks";
import type { Mandate } from "@/api/mandate/types";
import type { User } from "@/api/user/types";
import type { Event } from "@/api/event/types";
import type { Article } from "@/api/article/types";
import { AdminPageHeader } from "@/components/admin/page-header";
import { formatCurrency } from "@/utils/currency";
import { formatDate, formatRelative, toTimestamp } from "@/utils/date";

const buildUserLink = (params: Record<string, string | number | undefined>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `/admin/users?${query}` : "/admin/users";
};

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: users = [] } = useListUsers();
  const { data: mandates = [] } = useListMandates();
  const { data: events = [] } = useListEvents();
  const { data: articles = [] } = useListArticles();

  const pendingUsers = useMemo(
    () => users.filter(({ status }) => status === "pending"),
    [users]
  );

  const totalMembers = users.length;
  const activeMandates = mandates.filter(({ status }) => status === "active");
  const mandateMRR = activeMandates.reduce(
    (sum, mandate) => sum + (mandate.amount ?? 0),
    0
  );
  const eventFocus = pickUpcomingEvent(events);
  const eventRsvps = eventFocus?.currentAttendees ?? 0;

  const pulseCards = [
    {
      key: "members",
      label: "Total members",
      value: totalMembers.toLocaleString(),
      meta: "↑ 12 this week",
      icon: Users,
      chart: <Sparkline tone="forest" />,
    },
    {
      key: "mrr",
      label: "Mandate MRR",
      value: formatCurrency(mandateMRR),
      meta: "↑ 4.5% vs last month",
      icon: LineChart,
    },
    {
      key: "approvals",
      label: "Pending approvals",
      value: pendingUsers.length.toString(),
      meta: "Awaiting verification",
      icon: Sparkles,
      action: (
        <Button
          component={Link}
          to={buildUserLink({ status: "pending" })}
          variant="subtle"
          size="xs"
          rightSection={<ArrowUpRight className="size-4" />}
        >
          Review queue
        </Button>
      ),
    },
    {
      key: "events",
      label: "Event RSVPs",
      value: eventRsvps.toLocaleString(),
      meta: eventFocus?.title ?? "Next convention",
      icon: CalendarDays,
    },
  ];

  const verificationRows = useMemo(
    () => pendingUsers.slice(0, 5),
    [pendingUsers]
  );

  const tierBreakdown = buildTierBreakdown(activeMandates);

  const upcomingEvents = buildUpcomingEvents(events);
  const recentArticles = buildRecentArticles(articles);

  return (
    <Stack gap="xl">
      <AdminPageHeader
        eyebrow="Command deck"
        title="The Stewardship Console"
        description="Navigate LAUMGA operations with confidence—member growth, mandate health, and comms all in one calm cockpit."
      />

      <Grid gutter="lg">
        {pulseCards.map((card) => (
          <Grid.Col key={card.key} span={{ base: 12, sm: 6, lg: 3 }}>
            <PulseCard {...card} />
          </Grid.Col>
        ))}
      </Grid>

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, xl: 8 }}>
          <Card
            withBorder
            shadow="md"
            radius="xl"
            padding="xl"
            className="bg-white/80"
          >
            <Group justify="space-between" align="flex-end" mb="lg">
              <div>
                <Title order={3} className="text-deep-forest">
                  Pending member requests
                </Title>
                <Text size="sm" c="dimmed">
                  Verification queue prioritized by recency
                </Text>
              </div>
              <Button
                component={Link}
                to={buildUserLink({ status: "pending" })}
                variant="light"
                size="xs"
              >
                View directory
              </Button>
            </Group>
            {verificationRows.length ? (
              <Table verticalSpacing="md" horizontalSpacing="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Member</Table.Th>
                    <Table.Th>Proof</Table.Th>
                    <Table.Th>Submitted</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {verificationRows.map((member) => (
                    <VerificationRow key={member.id} member={member} />
                  ))}
                </Table.Tbody>
              </Table>
            ) : (
              <div className="rounded-2xl bg-mist-green/60 p-8 text-center">
                <Text fw={600} className="text-deep-forest">
                  All caught up
                </Text>
                <Text size="sm" c="dimmed">
                  New submissions will flow in here the moment members complete
                  onboarding.
                </Text>
              </div>
            )}
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, xl: 4 }}>
          <MandateBreakdownCard tiers={tierBreakdown} total={mandateMRR} />
        </Grid.Col>
      </Grid>

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <UpcomingEventsCard events={upcomingEvents} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <LatestArticlesCard articles={recentArticles} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <SystemHealthCard pendingAlerts={pendingUsers.length} />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

interface PulseCardProps {
  label: string;
  value: string;
  meta: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  chart?: ReactNode;
  action?: ReactNode;
}

function PulseCard({
  label,
  value,
  meta,
  icon: Icon,
  chart,
  action,
}: PulseCardProps) {
  return (
    <Card
      withBorder
      shadow="sm"
      radius="xl"
      padding="lg"
      className="h-full bg-white/90"
    >
      <Stack gap="sm">
        <div className="flex items-start justify-between">
          <div>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
              {label}
            </Text>
            <Text fz={28} fw={700} className="text-deep-forest">
              {value}
            </Text>
            <Text size="sm" c="dimmed">
              {meta}
            </Text>
          </div>
          {Icon && (
            <div className="rounded-2xl bg-mist-green p-3 text-deep-forest">
              <Icon className="size-5" />
            </div>
          )}
        </div>
        {chart}
        {action}
      </Stack>
    </Card>
  );
}

function Sparkline({ tone }: { tone: "forest" | "lime" }) {
  const stroke = tone === "forest" ? "#006838" : "#8dc63f";
  return (
    <svg viewBox="0 0 120 32" className="h-10 w-full">
      <path
        d="M0 20 L20 15 L40 18 L60 10 L80 14 L100 6 L120 12"
        fill="none"
        stroke={stroke}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={0.9}
      />
    </svg>
  );
}

interface VerificationRowProps {
  member: User;
}

function VerificationRow({ member }: VerificationRowProps) {
  const proofLabel = `${member.fullName?.split(" ")[0] ?? "member"}-certificate.pdf`;
  return (
    <Table.Tr>
      <Table.Td>
        <Group gap="sm">
          <Avatar
            radius="xl"
            src={member.photoUrl ?? undefined}
            alt={member.fullName}
          >
            {member.fullName?.[0] ?? "?"}
          </Avatar>
          <div>
            <Text fw={600} className="text-deep-forest">
              {member.fullName}
            </Text>
            <Text size="xs" c="dimmed">
              {member.classSet
                ? `Class of ${member.classSet}`
                : (member.department ?? "Awaiting profile")}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Button
          variant="subtle"
          size="xs"
          leftSection={<Paperclip className="size-4" />}
          className="text-deep-forest"
        >
          {proofLabel}
        </Button>
      </Table.Td>
      <Table.Td>
        <Text size="sm" className="text-deep-forest">
          {formatRelative(member.created?.at ?? null)}
        </Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs" wrap="wrap">
          <Button
            component={Link}
            to={buildUserLink({ status: "pending", focusId: member.id })}
            size="xs"
            className="bg-institutional-green text-white hover:bg-institutional-green/90"
          >
            Approve
          </Button>
          <Button
            component={Link}
            to={buildUserLink({ status: "pending", queryId: member.id })}
            size="xs"
            variant="outline"
            color="orange"
          >
            Query
          </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  );
}

interface TierSegment {
  label: string;
  amount: number;
  percentage: number;
  color: string;
  description: string;
}

function MandateBreakdownCard({
  tiers,
  total,
}: {
  tiers: TierSegment[];
  total: number;
}) {
  const gradientStops = tiers.reduce<{ stops: string[]; cursor: number }>(
    (acc, segment) => {
      const end = acc.cursor + segment.percentage;
      acc.stops.push(`${segment.color} ${acc.cursor}% ${end}%`);
      acc.cursor = end;
      return acc;
    },
    { stops: [], cursor: 0 }
  ).stops;

  const gradient = (
    gradientStops.length ? gradientStops : ["#d5e6ba 0% 100%"]
  ).join(", ");

  return (
    <Card
      withBorder
      shadow="md"
      radius="xl"
      padding="xl"
      className="bg-white/85"
    >
      <Stack gap="lg">
        <div>
          <Title order={3} className="text-deep-forest">
            Donation inflow
          </Title>
          <Text size="sm" c="dimmed">
            Tier distribution across active mandates
          </Text>
        </div>
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div
              className="h-48 w-48 rounded-full"
              style={{
                background:
                  tiers.length && gradient
                    ? `conic-gradient(${gradient})`
                    : "conic-gradient(#d5e6ba 0deg, #d5e6ba 360deg)",
              }}
            />
            <div className="absolute inset-6 rounded-full bg-white/95 px-6 py-8 text-center">
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Active inflow
              </Text>
              <Text fz={22} fw={700} className="text-deep-forest">
                {formatCurrency(total)}
              </Text>
            </div>
          </div>
          <Stack gap="sm" className="w-full">
            {tiers.length ? (
              tiers.map((segment) => (
                <Group key={segment.label} justify="space-between">
                  <Group gap="sm">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ background: segment.color }}
                    />
                    <Text fw={600} className="text-deep-forest">
                      {segment.label}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {segment.description}
                    </Text>
                  </Group>
                  <Text fw={600} className="text-deep-forest">
                    {segment.percentage}%
                  </Text>
                </Group>
              ))
            ) : (
              <Text size="sm" c="dimmed" ta="center">
                No active inflows yet.
              </Text>
            )}
          </Stack>
          <Button
            component={Link}
            to="/admin/mandates"
            variant="subtle"
            rightSection={<ArrowUpRight className="size-4" />}
          >
            View detailed financial report
          </Button>
        </div>
      </Stack>
    </Card>
  );
}

function UpcomingEventsCard({ events }: { events: Event[] }) {
  return (
    <Card
      withBorder
      shadow="md"
      radius="xl"
      padding="xl"
      className="bg-white/85 h-full"
    >
      <Stack gap="md">
        <Group justify="space-between">
          <div>
            <Title order={4} className="text-deep-forest">
              Upcoming events
            </Title>
            <Text size="sm" c="dimmed">
              Calendar hotspots
            </Text>
          </div>
          <Button component={Link} to="/admin/events" size="xs" variant="light">
            Add event
          </Button>
        </Group>
        <Divider variant="dashed" color="sage-green" />
        <Stack gap="sm">
          {events.length ? (
            events.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border border-sage-green/30 bg-mist-green/40 p-3"
              >
                <Text size="xs" c="dimmed">
                  {formatDate(event.startDate, "EEE, dd MMM")}
                </Text>
                <Text fw={600} className="text-deep-forest">
                  {event.title}
                </Text>
                <Text size="xs" c="dimmed">
                  {event.location}
                </Text>
              </div>
            ))
          ) : (
            <Text size="sm" c="dimmed">
              No upcoming events. Schedule the next community gathering.
            </Text>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}

function LatestArticlesCard({ articles }: { articles: Article[] }) {
  return (
    <Card
      withBorder
      shadow="md"
      radius="xl"
      padding="xl"
      className="bg-white/85 h-full"
    >
      <Stack gap="md">
        <div>
          <Title order={4} className="text-deep-forest">
            Latest articles
          </Title>
          <Text size="sm" c="dimmed">
            Editorial pipeline
          </Text>
        </div>
        <Stack gap="sm">
          {articles.length ? (
            articles.map((article) => (
              <Group
                key={article.id}
                justify="space-between"
                align="flex-start"
                className="rounded-2xl border border-sage-green/20 bg-white/70 p-3"
              >
                <div>
                  <Text fw={600} className="text-deep-forest">
                    {article.title}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Updated {formatDate(article.updated?.at ?? null, "dd MMM")}
                  </Text>
                </div>
                <Badge
                  color={
                    article.status === "published"
                      ? "green"
                      : article.status === "draft"
                        ? "gray"
                        : "orange"
                  }
                  radius="xl"
                >
                  {article.status}
                </Badge>
              </Group>
            ))
          ) : (
            <Text size="sm" c="dimmed">
              Add a new story to keep alumni engaged.
            </Text>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}

function SystemHealthCard({ pendingAlerts }: { pendingAlerts: number }) {
  const statuses = [
    { label: "Payment gateway", state: "operational" as const },
    { label: "Email server", state: "operational" as const },
    {
      label: "Database sync",
      state: pendingAlerts ? ("syncing" as const) : ("operational" as const),
    },
  ];

  return (
    <Card
      withBorder
      shadow="md"
      radius="xl"
      padding="xl"
      className="bg-white/85 h-full"
    >
      <Stack gap="md">
        <div>
          <Title order={4} className="text-deep-forest">
            System health
          </Title>
          <Text size="sm" c="dimmed">
            Infrastructure heartbeat
          </Text>
        </div>
        <Stack gap="sm">
          {statuses.map((status) => (
            <Group
              key={status.label}
              justify="space-between"
              className="rounded-2xl border border-sage-green/20 bg-mist-green/40 p-3"
            >
              <Group gap="sm">
                <StatusDot state={status.state} />
                <Text fw={600} className="text-deep-forest">
                  {status.label}
                </Text>
              </Group>
              <Text size="sm" className="capitalize text-deep-forest">
                {status.state}
              </Text>
            </Group>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}

function StatusDot({
  state,
}: {
  state: "operational" | "syncing" | "degraded";
}) {
  const map = {
    operational: "bg-vibrant-lime",
    syncing: "bg-orange-400",
    degraded: "bg-red-500",
  } as const;
  return <span className={clsx("h-3 w-3 rounded-full", map[state])} />;
}

function pickUpcomingEvent(events: Event[]): Event | undefined {
  return [...events].sort(
    (a, b) =>
      (toTimestamp(a.startDate) ?? Number.MAX_SAFE_INTEGER) -
      (toTimestamp(b.startDate) ?? Number.MAX_SAFE_INTEGER)
  )[0];
}

function buildUpcomingEvents(events: Event[]): Event[] {
  return [...events]
    .sort(
      (a, b) =>
        (toTimestamp(a.startDate) ?? Number.MAX_SAFE_INTEGER) -
        (toTimestamp(b.startDate) ?? Number.MAX_SAFE_INTEGER)
    )
    .slice(0, 3);
}

function buildRecentArticles(articles: Article[]): Article[] {
  return [...articles]
    .sort(
      (a, b) =>
        (toTimestamp(b.updated?.at) ?? 0) - (toTimestamp(a.updated?.at) ?? 0)
    )
    .slice(0, 3);
}

function buildTierBreakdown(mandates: Mandate[]): TierSegment[] {
  const palette: Record<
    string,
    { label: string; color: string; description: string }
  > = {
    supporter: {
      label: "Supporter",
      color: "#cbe5a7",
      description: "₦1k tier",
    },
    builder: {
      label: "Builder",
      color: "#8dc63f",
      description: "₦5k tier",
    },
    guardian: {
      label: "Guardian",
      color: "#002313",
      description: "₦10k tier",
    },
    custom: {
      label: "Custom",
      color: "#e2e8f0",
      description: "Bespoke",
    },
  };

  const totals = mandates.reduce<Record<string, number>>((acc, mandate) => {
    const tier = mandate.tier ?? "custom";
    acc[tier] = (acc[tier] ?? 0) + (mandate.amount ?? 0);
    return acc;
  }, {});

  const totalAmount = Object.values(totals).reduce(
    (sum, value) => sum + value,
    0
  );
  const order: Array<keyof typeof palette> = [
    "supporter",
    "builder",
    "guardian",
    "custom",
  ];

  return order
    .filter((tier) => totals[tier])
    .map((tier) => {
      const config = palette[tier];
      const amount = totals[tier] ?? 0;
      return {
        label: config.label,
        amount,
        percentage: totalAmount ? Math.round((amount / totalAmount) * 100) : 0,
        color: config.color,
        description: config.description,
      };
    });
}

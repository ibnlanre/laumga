import { createFileRoute } from "@tanstack/react-router";
import { Card, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { AlertTriangle, Bell } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/admin/alerts")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Stack gap="xl">
      <AdminPageHeader
        eyebrow="Signals"
        title="Operational alerts"
        description="Surface urgent workflows—failed debits, suspended accounts, or integration hiccups."
      />

      <Card
        withBorder
        shadow="md"
        radius="xl"
        padding="xl"
        className="bg-white/80"
      >
        <Stack gap="md">
          <Group gap="sm">
            <ThemeIcon size="lg" radius="xl" variant="light" color="orange">
              <Bell className="size-4" />
            </ThemeIcon>
            <div>
              <Text fw={600} className="text-deep-forest">
                No blocking alerts
              </Text>
              <Text size="sm" c="dimmed">
                The system is humming along. Any degraded experience will show
                up here instantly.
              </Text>
            </div>
          </Group>
          <Group gap="md">
            <ThemeIcon size="lg" radius="xl" variant="light" color="red">
              <AlertTriangle className="size-4" />
            </ThemeIcon>
            <div>
              <Text fw={600} className="text-deep-forest">
                Configure alert routing
              </Text>
              <Text size="sm" c="dimmed">
                Decide which operators receive mandate failures, payment partner
                downtime, or security notices.
              </Text>
            </div>
          </Group>
        </Stack>
      </Card>
    </Stack>
  );
}

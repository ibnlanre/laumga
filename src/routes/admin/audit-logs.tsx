import { createFileRoute } from "@tanstack/react-router";
import { Card, Stack, Text } from "@mantine/core";
import { ShieldCheck } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/admin/audit-logs")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Stack gap="xl">
      <AdminPageHeader
        eyebrow="System oversight"
        title="Audit logs"
        description="Track every sensitive change across mandates, profiles, and permissions."
      />

      <Card
        withBorder
        shadow="md"
        radius="xl"
        padding="xl"
        className="bg-white/80"
      >
        <Stack gap="md" align="center" ta="center">
          <div className="rounded-full bg-mist-green p-4">
            <ShieldCheck className="size-7 text-deep-forest" />
          </div>
          <Text fw={600} className="text-deep-forest">
            Coming soon
          </Text>
          <Text size="sm" c="dimmed">
            The audit timeline is being wired up so every configuration change,
            payment update, and approval decision can be replayed with context.
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
}

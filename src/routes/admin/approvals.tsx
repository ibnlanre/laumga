import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Card, Stack, Text, Title } from "@mantine/core";

import { AdminPageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/admin/approvals")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Stack gap="xl">
      <AdminPageHeader
        eyebrow="Verification"
        title="Approval control room"
        description="Filter, audit, and action on every onboarding request from a single cockpit."
      />

      <Card
        withBorder
        shadow="md"
        radius="xl"
        padding="xl"
        className="bg-white/80"
      >
        <Stack gap="md">
          <Title order={4} className="text-deep-forest">
            Route in progress
          </Title>
          <Text size="sm" c="dimmed">
            The dedicated approvals workspace is under construction. In the
            meantime, you can continue processing requests from the member
            directory filtered by the pending status.
          </Text>
          <div className="flex flex-wrap gap-3">
            <Button component={Link} to="/admin/users?status=pending">
              Review pending members
            </Button>
            <Button
              component={Link}
              to="/admin/audit-logs"
              color="orange"
              variant="light"
            >
              Open audit log
            </Button>
          </div>
        </Stack>
      </Card>
    </Stack>
  );
}

import type { ReactNode } from "react";
import { Group, Stack, Text, Title } from "@mantine/core";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  metadata?: ReactNode;
}

export function AdminPageHeader({
  title,
  description,
  eyebrow,
  actions,
  metadata,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-sage-green/30 pb-6">
      <Group justify="space-between" align="flex-start">
        <Stack gap={4} maw={640}>
          {eyebrow && (
            <Text size="sm" fw={600} c="dimmed" tt="uppercase">
              {eyebrow}
            </Text>
          )}
          <Title order={1} className="text-deep-forest">
            {title}
          </Title>
          {description && (
            <Text size="sm" c="dimmed">
              {description}
            </Text>
          )}
          {metadata && metadata}
        </Stack>
        {actions && <div className="flex gap-2">{actions}</div>}
      </Group>
    </div>
  );
}

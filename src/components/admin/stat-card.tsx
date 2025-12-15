import type { ReactNode } from "react";
import { Card, Group, Stack, Text } from "@mantine/core";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

const toneMap = {
  forest: {
    iconBg: "bg-deep-forest/10 text-deep-forest",
    value: "text-deep-forest",
    chip: "text-deep-forest/70",
  },
  sage: {
    iconBg: "bg-sage-green/20 text-sage-green-600",
    value: "text-sage-green-700",
    chip: "text-sage-green-600/70",
  },
  gold: {
    iconBg: "bg-vibrant-lime/20 text-vibrant-lime-700",
    value: "text-vibrant-lime-800",
    chip: "text-vibrant-lime-700/70",
  },
  coral: {
    iconBg: "bg-orange-100 text-orange-600",
    value: "text-orange-700",
    chip: "text-orange-600/70",
  },
} as const;

export type AdminStatTone = keyof typeof toneMap;

interface AdminStatCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  tone?: AdminStatTone;
  footer?: string;
  isLoading?: boolean;
  link?: ReactNode;
}

export function AdminStatCard({
  label,
  value,
  description,
  icon: Icon,
  tone = "forest",
  footer,
  isLoading,
  link,
}: AdminStatCardProps) {
  const toneStyles = toneMap[tone] ?? toneMap.forest;

  return (
    <Card
      shadow="md"
      padding="lg"
      radius="xl"
      withBorder
      className="h-full bg-white/90 backdrop-blur-sm"
    >
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
              {label}
            </Text>
            <Text size="xl" fw={700} className={toneStyles.value}>
              {isLoading ? "—" : value}
            </Text>
          </Stack>
          {Icon && (
            <div
              className={clsx("rounded-2xl p-3 text-base", toneStyles.iconBg)}
            >
              <Icon className="size-5" />
            </div>
          )}
        </Group>
        {description && (
          <Text size="sm" c="dimmed">
            {description}
          </Text>
        )}
        {(footer || link) && (
          <Group gap="xs" wrap="nowrap" className="text-sm">
            {footer && <Text c="dimmed">{footer}</Text>}
            {link}
          </Group>
        )}
      </Stack>
    </Card>
  );
}

import { Card, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";

interface AdminQuickActionCardProps {
  title: string;
  description: string;
  to: string;
  icon: LucideIcon;
  color?: "forest" | "sage" | "gold" | "teal" | "orange" | "violet";
  badge?: string;
}

const colorMap = {
  forest: {
    bg: "bg-deep-forest/10",
    text: "text-deep-forest",
  },
  sage: {
    bg: "bg-sage-green/20",
    text: "text-sage-green-700",
  },
  gold: {
    bg: "bg-vibrant-lime/20",
    text: "text-vibrant-lime-800",
  },
  teal: {
    bg: "bg-institutional-green/15",
    text: "text-institutional-green-700",
  },
  orange: {
    bg: "bg-orange-100",
    text: "text-orange-600",
  },
  violet: {
    bg: "bg-purple-100",
    text: "text-purple-600",
  },
} as const;

export function AdminQuickActionCard({
  title,
  description,
  to,
  icon: Icon,
  color = "forest",
  badge,
}: AdminQuickActionCardProps) {
  const palette = colorMap[color];

  return (
    <Card
      component={Link}
      to={to}
      shadow="md"
      radius="lg"
      padding="lg"
      withBorder
      className="h-full transition-all hover:-translate-y-0.5 hover:shadow-xl"
    >
      <Stack gap="md">
        <ThemeIcon
          size="lg"
          radius="xl"
          variant="light"
          className={clsx("w-fit", palette.bg, palette.text)}
        >
          <Icon className="size-5" />
        </ThemeIcon>

        <div>
          <Group justify="space-between" align="flex-start">
            <Text fw={600} className="text-deep-forest">
              {title}
            </Text>
            {badge && (
              <Text size="xs" c="dimmed">
                {badge}
              </Text>
            )}
          </Group>
          <Text size="sm" c="dimmed" mt={4} lineClamp={3}>
            {description}
          </Text>
        </div>
      </Stack>
    </Card>
  );
}

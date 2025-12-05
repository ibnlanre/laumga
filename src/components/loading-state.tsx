import { Loader, Skeleton, Stack, Text } from "@mantine/core";

interface LoadingStateProps {
  type?: "spinner" | "skeleton";
  message?: string;
  count?: number;
}

export function LoadingState({
  type = "spinner",
  message = "Loading...",
  count = 3,
}: LoadingStateProps) {
  if (type === "skeleton") {
    return (
      <Stack gap="md">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} height={100} radius="md" />
        ))}
      </Stack>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader size="lg" color="institutional-green" />
      <Text c="dimmed" size="sm" mt="md">
        {message}
      </Text>
    </div>
  );
}

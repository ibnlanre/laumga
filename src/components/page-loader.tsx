import { Loader } from "@mantine/core";

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = "Loading..." }: PageLoaderProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mist-green">
      <div className="flex flex-col items-center gap-6">
        <Loader size="xl" color="vibrant-lime" />
        <p className="text-lg font-medium text-deep-forest">{message}</p>
      </div>
    </div>
  );
}

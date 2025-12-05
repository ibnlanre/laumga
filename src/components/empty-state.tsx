import type { LucideIcon } from "lucide-react";
import type { PropsWithChildren } from "react";

interface EmptyStateProps extends PropsWithChildren {
  icon: LucideIcon;
  title: string;
  message: string;
}

export function EmptyState({
  icon: Icon,
  title,
  message,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-sage-green/40 bg-mist-green/30 px-6 py-10 text-center text-deep-forest justify-center h-full">
      <Icon className="h-10 w-10 text-deep-forest/40" />
      <p className="text-lg font-semibold">{title}</p>
      <p className="text-sm text-deep-forest/70">{message}</p>
      {children}
    </div>
  );
}

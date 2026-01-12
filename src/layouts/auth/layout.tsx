interface AuthLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  backgroundColor?: string;
}

export function AuthLayout({
  children,
  sidebar,
  backgroundColor = "bg-mist-green",
}: AuthLayoutProps) {
  return (
    <div className="grid h-[calc(100vh-70px)] w-full grid-cols-1 lg:grid-cols-[1fr_1.5fr] overflow-hidden">
      <div className="relative hidden flex-col bg-deep-forest text-white lg:flex">
        {sidebar}
      </div>

      {/* Scrollable Content Area - Centered */}
      <div
        className={`flex flex-col items-center justify-start lg:justify-center overflow-y-auto ${backgroundColor}`}
      >
        {children}
      </div>
    </div>
  );
}

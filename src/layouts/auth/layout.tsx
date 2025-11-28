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
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="flex h-full min-h-screen grow flex-col">
        <div className="flex flex-1">
          <div className="flex w-full flex-wrap">
            {/* Desktop Sidebar */}
            <div className="relative hidden w-2/5 flex-col bg-deep-forest text-white lg:flex">
              {sidebar}
            </div>

            {/* Main Content */}
            <div
              className={`flex w-full flex-col items-center justify-center ${backgroundColor} p-6 lg:w-3/5`}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
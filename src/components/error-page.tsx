import { RefreshCcw, Home } from "lucide-react";
import { useNavigate, useRouter } from "@tanstack/react-router";

interface ErrorPageProps {
  error?: Error | null;
  resetError?: () => void;
}

export function ErrorPage({ error, resetError }: ErrorPageProps) {
  const router = useRouter();
  const navigate = useNavigate();

  const handleGoHome = () => {
    router.navigate({ to: "/" });
  };

  const handleRefresh = () => {
    if (resetError) resetError();
    else
      navigate({
        to: router.state.location.pathname,
        reloadDocument: true,
        replace: true,
      });
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-deep-forest">
      <div className="absolute inset-0 bg-[url('/patterns/arabesque-tile.png')] opacity-[0.1]" />

      <div className="flex h-full grow flex-col relative">
        <div className="flex flex-1 sm:items-center justify-center px-4 py-10 sm:px-8 md:px-20 lg:px-40">
          <div className="flex w-full max-w-7xl flex-1 flex-col">
            <div className="flex flex-col items-start pt-16">
              <p className="font-mono text-xs font-normal leading-normal text-sage-green/60">
                • ERROR CODE: VALIDATION_ERROR
              </p>
              <h1 className="font-display mt-4 text-4xl font-bold leading-tight tracking-tight text-mist-green md:text-5xl lg:text-6xl">
                Something unexpected happened.
              </h1>
              <p className="mt-4 max-w-lg text-base font-normal leading-relaxed text-gray-300">
                We encountered an issue processing your request. This is usually
                temporary. Try refreshing the page or return home.
              </p>

              {error?.message && (
                <div className="mt-6 max-w-2xl rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                  <p className="font-mono text-sm text-red-300/80">
                    {error.message}
                  </p>
                </div>
              )}

              <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
                <button
                  onClick={handleRefresh}
                  className="group flex h-12 min-w-[140px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border-2 border-vibrant-lime bg-transparent px-6 text-sm font-bold leading-normal tracking-wide text-vibrant-lime transition-colors duration-300 hover:bg-vibrant-lime"
                >
                  <RefreshCcw className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180 group-hover:text-deep-forest" />
                  <span className="truncate group-hover:text-deep-forest">
                    Refresh Page
                  </span>
                </button>

                <button
                  onClick={handleGoHome}
                  className="group flex h-12 min-w-[140px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border-2 border-white/20 bg-transparent px-6 text-sm font-bold leading-normal tracking-wide text-white transition-colors duration-300 hover:border-white/40 hover:bg-white/5"
                >
                  <Home className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
                  <span className="truncate">Return Home</span>
                </button>
              </div>

              <div className="mt-12 flex flex-col gap-3 text-sm font-medium text-white/60">
                <p className="text-xs uppercase tracking-wider">Need help?</p>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                  <a
                    className="underline-offset-4 transition-all hover:text-vibrant-lime hover:underline"
                    href="mailto:info@hikey.com.ng"
                  >
                    Contact Support
                  </a>
                  <a
                    className="underline-offset-4 transition-all hover:text-vibrant-lime hover:underline"
                    href="/mandate/dashboard"
                  >
                    Dashboard
                  </a>
                  <a
                    className="underline-offset-4 transition-all hover:text-vibrant-lime hover:underline"
                    href="/mandate/pledge"
                  >
                    Pledge
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute left-0 bottom-0 sm:bottom-auto right-0 h-2/5 w-full sm:h-1/2 md:h-3/5 font-display">
            <div className="relative mx-auto h-full w-full max-w-xl lg:max-w-4xl xl:max-w-7xl grid place-items-end">
              <div
                style={{
                  color: "rgba(255, 255, 255, 0.03)",
                  fontSize: "40vw",
                  lineHeight: 1,
                  fontWeight: 900,
                }}
              >
                <span
                  className="bg-clip-text text-transparent align-text-bottom leading-[10vh]"
                  style={{
                    backgroundImage:
                      "linear-gradient(to top, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0))",
                  }}
                >
                  ⓘ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

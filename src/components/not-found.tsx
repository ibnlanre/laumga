import { ArrowUpRight } from "lucide-react";

export function NotFound() {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-deep-forest font-display">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-grain.png')] opacity-[0.02]" />
      <div className="absolute -top-1/4 -left-1/4 size-1/2 rounded-full bg-white/5 blur-[100px]" />

      <div className="flex h-full grow flex-col">
        <div className="flex flex-1 items-start justify-center px-4 py-10 sm:px-8 md:px-20 lg:px-40">
          <div className="flex w-full max-w-7xl flex-1 flex-col">
            <div className="flex flex-col items-start pt-16">
              <p className="font-mono text-xs font-normal leading-normal text-sage-green/60">
                • ERROR CODE: 404_PAGE_NOT_FOUND
              </p>
              <h1 className="font-display-serif mt-4 text-4xl font-bold leading-tight tracking-tight text-mist-green md:text-5xl lg:text-6xl">
                You seem to have wandered off the path.
              </h1>
              <p className="mt-4 max-w-lg text-base font-normal leading-relaxed text-gray-300">
                The link you followed may be broken, or the page has been
                removed. But the brotherhood is always here.
              </p>

              <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
                <button className="group flex h-12 min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border-2 border-vibrant-lime bg-transparent px-6 text-sm font-bold leading-normal tracking-wide text-vibrant-lime transition-colors duration-300 hover:bg-vibrant-lime">
                  <span className="truncate group-hover:text-deep-forest">
                    Return to Home
                  </span>
                  <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-deep-forest" />
                </button>
                <div className="flex flex-col items-start gap-3 text-sm font-medium text-white sm:flex-row sm:gap-6">
                  <a
                    className="underline-offset-4 transition-all hover:underline hover:underline-vibrant-lime"
                    href="#"
                  >
                    Mandate
                  </a>
                  <a
                    className="underline-offset-4 transition-all hover:underline hover:underline-vibrant-lime"
                    href="#"
                  >
                    Events
                  </a>
                  <a
                    className="underline-offset-4 transition-all hover:underline hover:underline-vibrant-lime"
                    href="#"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-2/5 w-full sm:h-1/2 md:h-3/5">
        <div className="relative mx-auto h-full w-full max-w-7xl">
          <div
            className="absolute -bottom-12 -left-16 sm:-bottom-16 sm:-left-24"
            style={{
              color: "#006838",
              fontSize: "50vw",
              lineHeight: 1,
              fontWeight: 900,
              opacity: 0.2,
              WebkitTextStroke: "2px",
              fill: "transparent",
            }}
          >
            4
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="relative flex items-center justify-center"
              style={{
                color: "#cbe5a7",
                fontSize: "35vw",
                lineHeight: 1,
                fontWeight: 900,
              }}
            >
              0
              <div
                className="absolute inset-0 bg-[url('/backgrounds/arabesque-tile.png')] bg-center bg-repeat opacity-10"
                style={{
                  maskImage:
                    "radial-gradient(circle, white 60%, transparent 100%)",
                  WebkitMaskImage:
                    "radial-gradient(circle, white 60%, transparent 100%)",
                }}
              />
            </div>
          </div>

          <div
            className="absolute -bottom-10 -right-12 sm:-bottom-12 sm:-right-20"
            style={{
              color: "rgba(255, 255, 255, 0.05)",
              fontSize: "45vw",
              lineHeight: 1,
              fontWeight: 900,
            }}
          >
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))",
                backdropFilter: "blur(8px)",
              }}
            >
              4
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

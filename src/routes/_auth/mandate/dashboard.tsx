import { createFileRoute } from "@tanstack/react-router";
import { Settings, CreditCard, Download, GraduationCap } from "lucide-react";
import { useGlobalFeed } from "@/services/hooks";
import { ErrorBoundary } from "@/components/error-boundary";
import { LoadingState } from "@/components/loading-state";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/_auth/mandate/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGlobalFeed(10);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allFeedItems = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <ErrorBoundary>
      <div className="w-full">
        <main className="flex flex-col gap-8 mt-8">
          <div className="flex flex-wrap justify-between gap-3 px-4">
            <p className="text-deep-forest text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
              The Stewardship Console
            </p>
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
            <div
              className="flex flex-col items-stretch justify-start rounded-xl bg-deep-forest text-white p-6 shadow-lg"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBzj-He7wBu59W2wXrZWnXWHf4uFhYgPV8HNk5sXNz-2CKrcNcAYss7HVXbyPmYtCHLkZNVwEeLw4dophtV3HPupuold-Ohe_-tBUVE_JzG0pqBtaOlbNSuiNZ8EEO-c920K2CPXD4Qmfl24MyiGpKYg8DUBfL_Rdmz234ly8l7uw__Tr9X4qjI4BqlXD3m8kZItP5-AfcNPjWSV-F30ddSg53GCwdqmod6Q9-qghYC1tEe7213h00-o4airYicUrVh6XjCaRVK2oA')",
              }}
            >
              <div className="flex w-full min-w-72 grow flex-col items-stretch justify-between gap-10 h-full">
                <div className="flex justify-between items-start">
                  <p className="text-sage-green text-sm font-normal leading-normal">
                    Active Mandate
                  </p>
                  <button className="text-white/70 hover:text-white">
                    <Settings className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-white text-4xl font-bold leading-tight tracking-[-0.015em] text-center">
                  ₦5,000
                  <span className="font-medium text-2xl"> / Monthly</span>
                </p>
                <div className="flex items-center gap-2 justify-end">
                  <div className="w-2 h-2 rounded-full bg-vibrant-lime"></div>
                  <p className="text-sage-green text-sm font-normal leading-normal">
                    Next Charge: May 18
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-stretch justify-start rounded-xl shadow-[0_0_12px_rgba(0,0,0,0.05)] bg-white p-6">
              <div className="flex w-full min-w-72 grow flex-col items-stretch justify-between gap-4 h-full">
                <p className="text-deep-forest text-sm font-normal leading-normal">
                  Total Contributed
                </p>
                <p className="text-deep-forest text-4xl font-bold leading-tight tracking-[-0.015em]">
                  ₦120,000
                </p>
                <div className="flex flex-col gap-2">
                  <div className="w-full bg-mist-green rounded-full h-2.5">
                    <div
                      className="bg-vibrant-lime h-2.5 rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                  <p className="text-deep-forest/70 text-sm font-normal leading-normal">
                    Progress to next Donor Tier
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-stretch justify-start rounded-xl shadow-[0_0_12px_rgba(0,0,0,0.05)] bg-white p-6">
              <div className="flex w-full min-w-72 grow flex-col items-stretch justify-between gap-4 h-full">
                <div>
                  <p className="text-deep-forest text-sm font-normal leading-normal">
                    Your funds have supported:
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <GraduationCap className="h-8 w-8 text-institutional-green" />
                    <p className="text-deep-forest text-4xl font-bold leading-tight tracking-[-0.015em]">
                      2 Students
                    </p>
                  </div>
                </div>
                <p className="text-deep-forest/70 text-base font-normal leading-normal">
                  received semester materials thanks to your tier.
                </p>
              </div>
            </div>
          </section>

          <section className="w-full bg-sage-green/30 py-4 overflow-hidden">
            {isLoading ? (
              <div className="px-8">
                <LoadingState type="spinner" message="Loading feed..." />
              </div>
            ) : isError ? (
              <div className="px-8 py-4">
                <p className="text-deep-forest/80 text-center">
                  Failed to load feed. Please try again later.
                </p>
              </div>
            ) : allFeedItems.length > 0 ? (
              <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
                <h3 className="text-lg font-bold text-deep-forest pl-8">
                  The Brotherhood is Building:
                </h3>
                {allFeedItems.map((item, index) => (
                  <div
                    key={`${item.timestamp}-${index}`}
                    className="flex items-center gap-4"
                  >
                    {item.type === "mandate" ? (
                      <p className="text-deep-forest/80">
                        📍 A {item.gender === "male" ? "brother" : "sister"}{" "}
                        from {item.location} joined the {item.tier} tier
                      </p>
                    ) : (
                      <p className="text-deep-forest/80">
                        🚀 New member from {item.location} registered
                      </p>
                    )}
                    <p className="text-xl text-deep-forest/50 font-light mx-4">
                      •
                    </p>
                  </div>
                ))}
                {allFeedItems.map((item, index) => (
                  <div
                    key={`${item.timestamp}-duplicate-${index}`}
                    className="flex items-center gap-4"
                  >
                    {item.type === "mandate" ? (
                      <p className="text-deep-forest/80">
                        📍 A {item.gender === "male" ? "brother" : "sister"}{" "}
                        from {item.location} joined the {item.tier} tier
                      </p>
                    ) : (
                      <p className="text-deep-forest/80">
                        🚀 New member from {item.location} registered
                      </p>
                    )}
                    <p className="text-xl text-deep-forest/50 font-light mx-4">
                      •
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-8 py-4">
                <p className="text-deep-forest/80 text-center">
                  No feed items yet.
                </p>
              </div>
            )}
            <div ref={observerRef} className="h-1" />
          </section>

          <section className="px-4">
            <div className="bg-white rounded-xl shadow-[0_0_12px_rgba(0,0,0,0.05)] p-6">
              <h3 className="text-xl font-bold text-deep-forest mb-4">
                Payment History
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-mist-green">
                    <tr>
                      <th className="py-3 px-4 text-sm font-medium text-deep-forest/60">
                        Date
                      </th>
                      <th className="py-3 px-4 text-sm font-medium text-deep-forest/60">
                        Description
                      </th>
                      <th className="py-3 px-4 text-sm font-medium text-deep-forest/60">
                        Method
                      </th>
                      <th className="py-3 px-4 text-sm font-medium text-deep-forest/60 text-right">
                        Amount
                      </th>
                      <th className="py-3 px-4 text-sm font-medium text-deep-forest/60 text-center">
                        Status
                      </th>
                      <th className="py-3 px-4 text-sm font-medium text-deep-forest/60 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-mist-green">
                      <td className="py-4 px-4 text-sm text-deep-forest/80">
                        Apr 18, 2024
                      </td>
                      <td className="py-4 px-4 text-sm font-bold text-deep-forest">
                        Monthly Mandate (The Builder)
                      </td>
                      <td className="py-4 px-4 text-sm text-deep-forest/80">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-institutional-green" />
                          **** 4242
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-deep-forest text-right">
                        - ₦5,000
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-mist-green text-deep-forest">
                          Success
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="text-deep-forest/60 hover:text-deep-forest">
                          <Download className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-mist-green">
                      <td className="py-4 px-4 text-sm text-deep-forest/80">
                        Mar 18, 2024
                      </td>
                      <td className="py-4 px-4 text-sm font-bold text-deep-forest">
                        Monthly Mandate (The Builder)
                      </td>
                      <td className="py-4 px-4 text-sm text-deep-forest/80">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-institutional-green" />
                          **** 4242
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-deep-forest text-right">
                        - ₦5,000
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-mist-green text-deep-forest">
                          Success
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="text-deep-forest/60 hover:text-deep-forest">
                          <Download className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 text-sm text-deep-forest/80">
                        Feb 18, 2024
                      </td>
                      <td className="py-4 px-4 text-sm font-bold text-deep-forest">
                        Monthly Mandate (The Builder)
                      </td>
                      <td className="py-4 px-4 text-sm text-deep-forest/80">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-institutional-green" />
                          **** 4242
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-deep-forest text-right">
                        - ₦5,000
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-mist-green text-deep-forest">
                          Success
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="text-deep-forest/60 hover:text-deep-forest">
                          <Download className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="px-4 pb-8">
            <div className="bg-deep-forest rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-white/90 text-center md:text-left max-w-xl">
                Allah loves the consistent deed, even if small. But if you have
                the means, consider upgrading your tier.
              </p>
              <button className="shrink-0 bg-vibrant-lime text-deep-forest font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity">
                Increase My Mandate
              </button>
            </div>
          </section>
        </main>
      </div>
    </ErrorBoundary>
  );
}

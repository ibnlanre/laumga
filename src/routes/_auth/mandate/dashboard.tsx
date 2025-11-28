import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/mandate/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden font-display bg-mist-green">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-sage-green/50 px-4 sm:px-10 py-3">
              <div className="flex items-center gap-4 text-deep-forest">
                <div className="size-6">
                  <svg
                    fill="none"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_6_535)">
                      <path
                        clipRule="evenodd"
                        d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                        fill="currentColor"
                        fillRule="evenodd"
                      ></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_6_535">
                        <rect fill="white" height="48" width="48"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <h2 className="text-deep-forest text-lg font-bold leading-tight tracking-[-0.015em]">
                  LAUMGA
                </h2>
              </div>
              <div className="flex flex-1 justify-end gap-4 sm:gap-8">
                <div className="hidden md:flex items-center gap-9">
                  <a
                    className="text-deep-forest text-sm font-medium leading-normal"
                    href="#"
                  >
                    Dashboard
                  </a>
                  <a
                    className="text-deep-forest/70 hover:text-deep-forest text-sm font-medium leading-normal"
                    href="#"
                  >
                    Impact Stories
                  </a>
                  <a
                    className="text-deep-forest/70 hover:text-deep-forest text-sm font-medium leading-normal"
                    href="#"
                  >
                    Community
                  </a>
                  <a
                    className="text-deep-forest/70 hover:text-deep-forest text-sm font-medium leading-normal"
                    href="#"
                  >
                    Settings
                  </a>
                </div>
                <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-white/50 text-deep-forest gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
                  <span
                    className="material-symbols-outlined text-deep-forest"
                    style={{ fontSize: "20px" }}
                  >
                    notifications
                  </span>
                </button>
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                  data-alt="User profile picture"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCAueUCSEHgta02eYDH3GxnbkMRrFIHUPNSR_7ySpMlpYku0V31iG-2Vz6D0HwuIAOF9dBLRF3-j8UTjGODR_IpJd04qLHboHK9YfYQ-T8rxfBjN9nsNKJr4bzASXtTW7iDJPKvTtE5nzQLapXFn9SZYMVohxx95y6kcadebsXfc1Xkkj43HjKcbsfSZaY4sowm5mIzk6oP5DBIDQqFdppTTNLuLrJ9NAvgWbO7jGVJAhcYCobVCq32Ookimpm5tASQOZnPvU9PyIc')",
                  }}
                ></div>
              </div>
            </header>
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
                        <span className="material-symbols-outlined">
                          settings
                        </span>
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
                        <span
                          className="material-symbols-outlined text-institutional-green"
                          style={{ fontSize: "32px" }}
                        >
                          school
                        </span>
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
                <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
                  <h3 className="text-lg font-bold text-deep-forest pl-8">
                    The Brotherhood is Building:
                  </h3>
                  <p className="text-deep-forest/80">
                    📍 A member from Abuja joined the 1% Club (5 mins ago)
                  </p>
                  <p className="text-xl text-deep-forest/50 font-light mx-4">
                    •
                  </p>
                  <p className="text-deep-forest/80">
                    🚀 12 New Mandates established this week.
                  </p>
                  <p className="text-xl text-deep-forest/50 font-light mx-4">
                    •
                  </p>
                  <p className="text-deep-forest/80">
                    🌱 Total Monthly Pledges just crossed ₦6.5M!
                  </p>
                  <p className="text-xl text-deep-forest/50 font-light mx-4">
                    •
                  </p>
                  <p className="text-deep-forest/80">
                    📍 A member from Lagos upgraded their tier (1 hour ago)
                  </p>

                  <p className="text-xl text-deep-forest/50 font-light mx-4">
                    •
                  </p>
                  <h3 className="text-lg font-bold text-deep-forest">
                    The Brotherhood is Building:
                  </h3>
                  <p className="text-deep-forest/80">
                    📍 A member from Abuja joined the 1% Club (5 mins ago)
                  </p>
                  <p className="text-xl text-deep-forest/50 font-light mx-4">
                    •
                  </p>
                  <p className="text-deep-forest/80">
                    🚀 12 New Mandates established this week.
                  </p>
                  <p className="text-xl text-deep-forest/50 font-light mx-4">
                    •
                  </p>
                  <p className="text-deep-forest/80">
                    🌱 Total Monthly Pledges just crossed ₦6.5M!
                  </p>
                </div>
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
                          <td className="py-4 px-4 text-sm text-deep-forest/80 flex items-center gap-2">
                            <span
                              className="material-symbols-outlined text-institutional-green"
                              style={{ fontSize: "20px" }}
                            >
                              credit_card
                            </span>
                            **** 4242
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
                              <span className="material-symbols-outlined">
                                download
                              </span>
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
                          <td className="py-4 px-4 text-sm text-deep-forest/80 flex items-center gap-2">
                            <span
                              className="material-symbols-outlined text-institutional-green"
                              style={{ fontSize: "20px" }}
                            >
                              credit_card
                            </span>
                            **** 4242
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
                              <span className="material-symbols-outlined">
                                download
                              </span>
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
                          <td className="py-4 px-4 text-sm text-deep-forest/80 flex items-center gap-2">
                            <span
                              className="material-symbols-outlined text-institutional-green"
                              style={{ fontSize: "20px" }}
                            >
                              credit_card
                            </span>
                            **** 4242
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
                              <span className="material-symbols-outlined">
                                download
                              </span>
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
                    Allah loves the consistent deed, even if small. But if you
                    have the means, consider upgrading your tier.
                  </p>
                  <button className="shrink-0 bg-vibrant-lime text-deep-forest font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity">
                    Increase My Mandate
                  </button>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

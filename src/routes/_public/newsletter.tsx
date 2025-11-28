import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/newsletter")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="w-full bg-deep-forest text-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-20 text-center sm:gap-8 sm:px-10">
          <div className="relative">
            <span className="material-symbols-outlined text-7xl text-white/80">
              mark_email_unread
            </span>
            <div className="absolute -right-1 top-0 h-4 w-4 rounded-full border-2 border-deep-forest bg-vibrant-lime"></div>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              An-Naseehah: Wisdom Delivered
            </h1>
            <p className="max-w-[720px] text-base font-normal leading-normal text-white/80">
              Join 5,000+ alumni receiving quarterly insights on faith, society,
              and professional growth.
            </p>
          </div>
          <div className="flex w-full max-w-lg justify-center">
            <label className="flex h-14 w-full flex-col sm:h-16">
              <div className="flex h-full w-full flex-1 items-stretch rounded-full">
                <input
                  className="form-input h-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-full border-none bg-white px-5 pr-2 text-sm font-normal leading-normal text-stone-800 placeholder:text-stone-500 focus:outline-0 focus:ring-0 sm:text-base"
                  placeholder="Enter your email"
                  value=""
                />
                <div className="flex items-center justify-center rounded-r-full bg-white pr-2">
                  <button className="flex h-10 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-vibrant-lime px-4 text-sm font-bold leading-normal tracking-wide text-deep-forest hover:bg-opacity-90 sm:h-12 sm:px-5 sm:text-base">
                    <span className="truncate">Subscribe Free</span>
                  </button>
                </div>
              </div>
            </label>
          </div>
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 p-6 md:grid-cols-2 md:gap-16 md:p-12">
          <div className="flex justify-center">
            <div
              className="w-full max-w-sm bg-center bg-no-repeat aspect-3/4 bg-cover rounded-xl shadow-2xl"
              data-alt="Cover of the latest newsletter with an abstract geometric design."
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDQo7uJ3sFaa8Y6Dk6NZ06nIzFaODpcDgPel2VAOM8RmJh7QyRuhcKYrYdwBkHsmavXusXqmkAoizzHQ7Hqd6GXqkrohut3jKroYjvtB4FNzZzdFHpzTQICmf2idzmQSnZNY9xbqCUJ75-AZNZoPMH0TCONA4ZTgMjt0_sDraNrFlI7K9LMzxmXB-0uD1tU0sy5O70FPp2FlB1r1JHq03QymZxl9nmY_Obl-6-OLgsJbsvTXIkCDwFG4kFhPbchVf_5FyfqVDn0rcg')",
                transform: "rotate(-3deg) translateY(-5px)",
              }}
            ></div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex h-7 w-fit items-center justify-center rounded-full bg-vibrant-lime/20 px-3">
                <p className="text-sm font-bold text-vibrant-lime">
                  LATEST RELEASE
                </p>
              </div>
              <h2 className="font-display text-3xl font-bold leading-tight text-deep-forest md:text-4xl">
                Volume 5, Issue 5: Rebuilding the Collapsing Society.
              </h2>
              <ul className="list-disc space-y-1 pl-5 text-stone-600">
                <li>The Role of Faith in Modern Ethics</li>
                <li>Community Resilience: Lessons from the Past</li>
                <li>Sustainable Futures: An Islamic Perspective</li>
              </ul>
            </div>
            <button className="flex w-fit cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-deep-forest text-white text-base font-bold leading-normal hover:bg-opacity-90">
              <span className="truncate">Read This Issue</span>
            </button>
          </div>
        </div>
      </section>

      <nav className="sticky top-[69px] z-40 border-b border-t border-stone-200/80 bg-mist-green/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto p-3 px-4 sm:gap-3 sm:px-6">
          <div className="flex h-9 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-full bg-deep-forest pl-4 pr-4 text-white">
            <p className="text-sm font-medium leading-normal">All Volumes</p>
          </div>
          <div className="flex h-9 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-full bg-white pl-4 pr-4 hover:bg-stone-100">
            <p className="text-sm font-medium leading-normal text-deep-forest">
              Volume 5
            </p>
          </div>
          <div className="flex h-9 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-full bg-white pl-4 pr-4 hover:bg-stone-100">
            <p className="text-sm font-medium leading-normal text-deep-forest">
              Volume 4
            </p>
          </div>
          <div className="flex h-9 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-full bg-white pl-4 pr-4 hover:bg-stone-100">
            <p className="text-sm font-medium leading-normal text-deep-forest">
              Volume 3
            </p>
          </div>
          <div className="flex h-9 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-full bg-white pl-4 pr-4 hover:bg-stone-100">
            <p className="text-sm font-medium leading-normal text-deep-forest">
              Special Editions
            </p>
          </div>
        </div>
      </nav>

      <section className="bg-mist-green py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group flex flex-col gap-4 rounded-lg border border-sage-green bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div
                className="w-full bg-center bg-no-repeat aspect-4/3 bg-cover rounded"
                data-alt="Newsletter cover for A Secret to Positive Mood"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCYfFnCVBGjrzsPSXINfsHl1-NlvwZNYOKlWKmxx2L1PDzOtM7Y-VZiXWS1hCPPLGTrhYLA8IwUV2r8WejcTLqYJd6iIcyHWLoprY3EkpQKo56ExnEEMkzWjk8cUWURTFeAERQ3iSTiSAaXihYlF0X4GmL_i9gjQHf4SuW8JcWAXFUL8YSaVBgnJOnGyn3kNhc8jBER9hsM1xndfmKkcxxpygCMgy_fE6Ggra6WrGxb6dxPJVi2LVlT6l6Y4aKUWnZ_PFYVC4-387k')",
                }}
              ></div>
              <div className="flex flex-1 flex-col justify-between gap-4">
                <div className="flex flex-col">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Volume 4, Issue 5
                  </p>
                  <p className="font-display text-xl font-bold leading-tight text-deep-forest">
                    A Secret to Positive Mood
                  </p>
                  <p className="mt-1 text-sm text-stone-600">
                    This issue explores the psychological and spiritual
                    dimensions of maintaining a positive outlook...
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <button className="flex h-10 w-full items-center justify-center rounded-full border border-deep-forest text-deep-forest transition-colors group-hover:bg-vibrant-lime group-hover:border-vibrant-lime group-hover:text-deep-forest">
                    <span className="text-sm font-bold">Download PDF</span>
                  </button>
                  <span className="material-symbols-outlined ml-3 cursor-pointer text-stone-400 hover:text-deep-forest">
                    share
                  </span>
                </div>
              </div>
            </div>
            <div className="group flex flex-col gap-4 rounded-lg border border-sage-green bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div
                className="w-full bg-center bg-no-repeat aspect-4/3 bg-cover rounded"
                data-alt="Newsletter cover for The Future of Islamic Finance"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAq-Z7NnnHFtylgSlv6MM43euym99h2nKqIVt6aE5hVat3ajuXXxpgVNAP-ShR2fGZsMiOiriIgRFz9QOrGzt4Mms9pvGA4jIe207pxHcT3bYpda_Wv5B4RNQJY7vFm-XMSjhf7GjHaiWVlAoOjM_QPIGIQ5SRKGIYBExcAQSTNW-5BeCewd8oY3aJpOoCIaBYHjqY0EhXSqdfUESd7zJV8YCs6AeLaIe1upcrlxIYgSTfMRWQi9EAh6spwhejpeYFcqi4-9g9e9KI')",
                }}
              ></div>
              <div className="flex flex-1 flex-col justify-between gap-4">
                <div className="flex flex-col">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Volume 4, Issue 4
                  </p>
                  <p className="font-display text-xl font-bold leading-tight text-deep-forest">
                    The Future of Islamic Finance
                  </p>
                  <p className="mt-1 text-sm text-stone-600">
                    An in-depth look at emerging trends and ethical
                    considerations in the financial world...
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <button className="flex h-10 w-full items-center justify-center rounded-full border border-deep-forest text-deep-forest transition-colors group-hover:bg-vibrant-lime group-hover:border-vibrant-lime group-hover:text-deep-forest">
                    <span className="text-sm font-bold">Download PDF</span>
                  </button>
                  <span className="material-symbols-outlined ml-3 cursor-pointer text-stone-400 hover:text-deep-forest">
                    share
                  </span>
                </div>
              </div>
            </div>
            <div className="group flex flex-col gap-4 rounded-lg border border-sage-green bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex w-full items-center justify-center bg-sage-green aspect-4/3 rounded">
                <span className="font-display text-4xl font-bold text-deep-forest/50">
                  VOL 4
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-between gap-4">
                <div className="flex flex-col">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Volume 4, Issue 3
                  </p>
                  <p className="font-display text-xl font-bold leading-tight text-deep-forest">
                    Navigating Modern Identity
                  </p>
                  <p className="mt-1 text-sm text-stone-600">
                    How to balance cultural heritage with contemporary life in a
                    globalized society...
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <button className="flex h-10 w-full items-center justify-center rounded-full border border-deep-forest text-deep-forest transition-colors group-hover:bg-vibrant-lime group-hover:border-vibrant-lime group-hover:text-deep-forest">
                    <span className="text-sm font-bold">Download PDF</span>
                  </button>
                  <span className="material-symbols-outlined ml-3 cursor-pointer text-stone-400 hover:text-deep-forest">
                    share
                  </span>
                </div>
              </div>
            </div>
            <div className="group flex flex-col gap-4 rounded-lg border border-sage-green bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div
                className="w-full bg-center bg-no-repeat aspect-4/3 bg-cover rounded"
                data-alt="Newsletter cover for Community Building"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCRulEjjoqR4VJwbg5m7asJLGUwAMGn_PT3cKp5fpWisjyn1zqMDq2obxjxT4bQEVO_7Gkb5Chk2udHtNOp4JrLzpr58MWSZ3DKjebZt8AiKw5KWJYGyj-P53Rj8dwqmU6aStKcghRrKG11u9rOpJQQx3QuQ6VyXBfkG8dxq7dvKMjPUPjfRGwD7bX1ckONbTWoBcw2SmjZ6T4vtnrI9cWZyWJp1FI4LSvRZCU6gBoybjTZY5ZuuF4HkRIzabh4uQCW-2s7cqmdPzU')",
                }}
              ></div>
              <div className="flex flex-1 flex-col justify-between gap-4">
                <div className="flex flex-col">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Volume 4, Issue 2
                  </p>
                  <p className="font-display text-xl font-bold leading-tight text-deep-forest">
                    Community Building in Diaspora
                  </p>
                  <p className="mt-1 text-sm text-stone-600">
                    Strategies and stories on fostering strong community bonds
                    away from home...
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <button className="flex h-10 w-full items-center justify-center rounded-full border border-deep-forest text-deep-forest transition-colors group-hover:bg-vibrant-lime group-hover:border-vibrant-lime group-hover:text-deep-forest">
                    <span className="text-sm font-bold">Download PDF</span>
                  </button>
                  <span className="material-symbols-outlined ml-3 cursor-pointer text-stone-400 hover:text-deep-forest">
                    share
                  </span>
                </div>
              </div>
            </div>
            <div className="group flex flex-col gap-4 rounded-lg border border-sage-green bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex w-full items-center justify-center bg-sage-green aspect-4/3 rounded">
                <span className="font-display text-4xl font-bold text-deep-forest/50">
                  VOL 4
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-between gap-4">
                <div className="flex flex-col">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Volume 4, Issue 1
                  </p>
                  <p className="font-display text-xl font-bold leading-tight text-deep-forest">
                    Lessons from the Seerah
                  </p>
                  <p className="mt-1 text-sm text-stone-600">
                    Timeless wisdom from the life of the Prophet (PBUH) for
                    today's challenges...
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <button className="flex h-10 w-full items-center justify-center rounded-full border border-deep-forest text-deep-forest transition-colors group-hover:bg-vibrant-lime group-hover:border-vibrant-lime group-hover:text-deep-forest">
                    <span className="text-sm font-bold">Download PDF</span>
                  </button>
                  <span className="material-symbols-outlined ml-3 cursor-pointer text-stone-400 hover:text-deep-forest">
                    share
                  </span>
                </div>
              </div>
            </div>
            <div className="group flex flex-col gap-4 rounded-lg border border-sage-green bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div
                className="w-full bg-center bg-no-repeat aspect-4/3 bg-cover rounded"
                data-alt="Newsletter cover for Spiritual Growth"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCUKElqZz3P26oaPVTifJprFNQV5sS0FBO0e_8GpSZRoB-xT8H0B_tM0nGxhFhaESZawo0AuRQctKHXY_3FV7kQmRvkGo40tLNjvg8v2bY2ujEDNY2CC5eTThJFaxqTfNfgtNEF9c0bxtSNEO0bpn---7ntsT407M9yIKfVTL9rRc7F1aQMdtSHqYpDv8LGfEsHZkI9SyzR2Ku0HVD0sRWmxfzYUtvHeATdp-JtlIn2vnYhPN922OYQvHMUBXvZWsdB7PB32F1P_zg')",
                }}
              ></div>
              <div className="flex flex-1 flex-col justify-between gap-4">
                <div className="flex flex-col">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Special Edition 2023
                  </p>
                  <p className="font-display text-xl font-bold leading-tight text-deep-forest">
                    Reflections on Spiritual Growth
                  </p>
                  <p className="mt-1 text-sm text-stone-600">
                    Personal essays and scholarly articles on the journey of
                    self-improvement and faith...
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <button className="flex h-10 w-full items-center justify-center rounded-full border border-deep-forest text-deep-forest transition-colors group-hover:bg-vibrant-lime group-hover:border-vibrant-lime group-hover:text-deep-forest">
                    <span className="text-sm font-bold">Download PDF</span>
                  </button>
                  <span className="material-symbols-outlined ml-3 cursor-pointer text-stone-400 hover:text-deep-forest">
                    share
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-mist-green py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 rounded-lg bg-sage-green p-8 sm:flex-row sm:p-10">
            <p className="max-w-xl text-center font-display text-xl text-deep-forest sm:text-left sm:text-2xl">
              Have a perspective to share? We accept scholarly articles and
              op-eds from members.
            </p>
            <button className="flex h-12 shrink-0 items-center justify-center rounded-full border-2 border-deep-forest px-8 text-base font-bold text-deep-forest hover:bg-deep-forest hover:text-white">
              Submit an Article
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

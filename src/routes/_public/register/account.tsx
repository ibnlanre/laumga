import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/register/account")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden font-display">
      <div className="flex min-h-screen">
        <div
          className="fixed top-0 left-0 flex h-full w-[35%] flex-col bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDFPgQiMy1t8UPUYOq8JLndAhaDNR-lRB5MBSDdCdD2922RIG9gUdYkgU9HBoFHWHtCO1E1cKg2DcLvdLuSYsufdzR3wBgxlMnUtAIL2IUJv4nhOH7DUdTaW-16Ls300Z2kiir6mmznxhoJwCkLOxxDJBjrDlsa8Uo3u8LiTwXIpbVDzp7_8X933lOAPJNzWoOr_L6HdcHSpDaQ6O6_JJaGl5wLv7Vd0Zo3lXcyudkg-HWUp7ydIm0NVxq3ZCDZK0_7BZf9sVfmSsM')",
          }}
        >
          <div
            className="absolute inset-0 h-full w-full bg-deep-forest mix-blend-multiply"
            style={{ opacity: 0.9 }}
          ></div>
          <div
            className="absolute bottom-0 left-0 h-1/3 w-full bg-contain bg-bottom bg-no-repeat opacity-20"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDqsIk7zGl4JAO1nz5hEePmOHS1c2sO8RS-tJhXvnXsTdt3Wcz7WCuEOCfiAVzHcvDorSXjPsGtu4JE6pwe0jgvYQ7MnidBN8IgI11mTtyB0DxBw7pjqOoXU0iNlUMNhvDJ3NUSnrA4PIzuTu1iDY459MUBiTb8eA5tkhIKHL2m1iwA4rW9DGQqyzwT_mYr_HFEraAP9gi_VyP7vN4wy3EgpyWu8i9792AHgyFBX6ZmCiOEvBUNIjd_UXWhRmrJIroprjrInPEWkzM')",
            }}
          ></div>
          <div className="relative z-10 flex h-full flex-col p-12 text-white">
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <h2 className="font-serif text-4xl leading-relaxed">
                Expand Your Network.
              </h2>
              <p className="mt-4 text-lg text-white/80">
                Connecting you to the chapter closest to your residence.
              </p>
            </div>
            <div className="shrink-0 text-center">
              <p className="text-white/80">
                Already a member?
                <a
                  className="font-semibold text-vibrant-lime underline hover:text-white"
                  href="#"
                >
                  Log in here.
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="ml-[35%] w-[65%] bg-mist-green">
          <div className="flex h-full min-h-screen w-full flex-col bg-white">
            <div className="grow p-20 pb-48">
              <div className="mb-12 w-full">
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex h-2 items-center justify-center rounded-full bg-sage-green">
                    <span className="material-symbols-outlined text-sm text-white">
                      check
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-deep-forest"></div>
                  <div className="h-2 rounded-full bg-sage-green/50"></div>
                </div>
                <p className="mt-3 text-xs font-bold uppercase tracking-wider text-deep-forest">
                  02. LOCATION &amp; ACCESS
                </p>
              </div>
              <div className="space-y-10">
                <div className="space-y-8">
                  <p className="font-serif text-3xl font-bold text-deep-forest">
                    Network Details
                  </p>
                  <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
                    <div>
                      <label
                        className="block text-xs font-semibold uppercase tracking-wide text-deep-forest"
                        htmlFor="state-origin"
                      >
                        State of Origin
                      </label>
                      <div className="relative mt-2">
                        <select
                          className="w-full appearance-none border-0 border-b-2 border-deep-forest bg-[#F9F9F9] p-3 pr-10 font-serif text-lg text-deep-forest placeholder-gray-400 focus:outline-none focus:ring-0"
                          id="state-origin"
                        >
                          <option>Select your state...</option>
                          <option>Oyo</option>
                          <option>Lagos</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="material-symbols-outlined text-institutional-green">
                            location_on
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label
                        className="block text-xs font-semibold uppercase tracking-wide text-deep-forest"
                        htmlFor="state-residence"
                      >
                        State of Residence
                      </label>
                      <div className="relative mt-2">
                        <select
                          className="w-full appearance-none border-0 border-b-2 border-deep-forest bg-[#F9F9F9] p-3 pr-10 font-serif text-lg text-deep-forest placeholder-gray-400 focus:outline-none focus:ring-0"
                          id="state-residence"
                        >
                          <option>Select your state...</option>
                          <option>Oyo</option>
                          <option>Lagos</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="material-symbols-outlined text-institutional-green">
                            location_on
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start rounded-md border-l-4 border-vibrant-lime bg-mist-green p-4">
                    <div className="ml-3 flex-1">
                      <p className="text-sm text-deep-forest">
                        Based on your residence, you will be assigned to the
                        Lagos State Chapter. You can change this later in your
                        profile.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-8">
                  <p className="font-serif text-3xl font-bold text-deep-forest">
                    Account Credentials
                  </p>
                  <div className="space-y-8">
                    <div>
                      <label
                        className="block text-xs font-semibold uppercase tracking-wide text-deep-forest"
                        htmlFor="email"
                      >
                        Email Address
                      </label>
                      <div className="relative mt-2">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="material-symbols-outlined text-deep-forest">
                            mail
                          </span>
                        </div>
                        <input
                          className="w-full border-0 border-b-2 border-deep-forest bg-[#F9F9F9] p-3 pl-12 pr-10 font-serif text-lg text-deep-forest placeholder-gray-400 focus:outline-none focus:ring-0"
                          id="email"
                          placeholder="you@laumga.org"
                          type="email"
                          value="aminah.alfaruq@email.com"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="material-symbols-outlined text-vibrant-lime">
                            check_circle
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label
                        className="block text-xs font-semibold uppercase tracking-wide text-deep-forest"
                        htmlFor="password"
                      >
                        Create Password
                      </label>
                      <div className="relative mt-2">
                        <input
                          className="w-full border-0 border-b-2 border-vibrant-lime bg-[#F9F9F9] p-3 font-serif text-lg text-deep-forest placeholder-gray-400 shadow-[0_4px_15px_-5px_rgba(141,198,63,0.6)] focus:outline-none focus:ring-0"
                          id="password"
                          placeholder="••••••••••••"
                          type="password"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <button className="text-sm font-semibold text-institutional-green hover:underline">
                            Show
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 space-y-1 text-xs">
                        <p className="text-gray-400 line-through">
                          <span className="text-deep-forest">
                            At least 8 characters
                          </span>
                        </p>
                        <p className="text-gray-400 line-through">
                          <span className="text-deep-forest">
                            Contains a number
                          </span>
                        </p>
                        <p className="text-gray-400 line-through">
                          <span className="text-deep-forest">
                            Contains a capital letter
                          </span>
                        </p>
                        <p className="text-gray-400">
                          Contains a special character (!@#...)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-sage-green p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-deep-forest">
                      I agree to abide by the constitution of LAUMGA and uphold
                      the values of the brotherhood.
                    </p>
                    <button
                      aria-checked="true"
                      className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-vibrant-lime transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-vibrant-lime focus:ring-offset-2"
                      role="switch"
                    >
                      <span className="inline-block h-5 w-5 translate-x-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed bottom-0 right-0 w-[65%] bg-linear-to-t from-white via-white/90 to-white/0 p-8 pt-16">
            <div className="flex items-center justify-between">
              <a
                className="font-semibold text-deep-forest transition hover:underline"
                href="#"
              >
                ← Back to Personal Details
              </a>
              <button className="group flex items-center justify-center rounded-lg bg-vibrant-lime py-5 px-12 text-lg font-bold uppercase tracking-wider text-deep-forest transition hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-vibrant-lime/50">
                REVIEW APPLICATION
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

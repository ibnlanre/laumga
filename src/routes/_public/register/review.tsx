import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/register/review")({
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
            <div className="relative flex flex-1 flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined absolute text-[250px] text-vibrant-lime/10">
                check_circle
              </span>
              <div className="relative z-10">
                <h2 className="font-serif text-4xl leading-relaxed">
                  Confirm Your Legacy.
                </h2>
                <p className="mt-4 text-lg text-white/80">
                  Please verify your details to ensure your membership card and
                  records are accurate.
                </p>
              </div>
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
        <div className="ml-[35%] w-[65%] bg-white">
          <div className="flex h-full min-h-screen w-full flex-col">
            <div className="grow p-12 md:p-20 pb-48">
              <div className="mb-12 w-full">
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex h-2 items-center justify-center rounded-full bg-sage-green">
                    <span className="material-symbols-outlined text-sm text-white">
                      check
                    </span>
                  </div>
                  <div className="flex h-2 items-center justify-center rounded-full bg-sage-green">
                    <span className="material-symbols-outlined text-sm text-white">
                      check
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-deep-forest"></div>
                </div>
                <p className="mt-3 text-xs font-bold uppercase tracking-wider text-deep-forest">
                  03. REVIEW &amp; CONFIRM
                </p>
              </div>
              <div className="space-y-8">
                <div className="relative rounded-lg bg-white p-6 shadow-lg">
                  <a
                    className="absolute top-4 right-4 text-vibrant-lime transition-transform hover:scale-110"
                    href="#"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </a>
                  <div className="flex items-center space-x-6">
                    <div className="shrink-0">
                      <img
                        alt="Passport Photo"
                        className="h-24 w-24 rounded-full border-4 border-institutional-green object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp8tPZem6_D0mEggw7LUmDwz5dlRJS4Dd9JDFaIR-8wbxMvxq4qW6zMlSHLEhwNSPU6abZbRJx5o4Xy4pXgktw8JLTEBcOIcfmR0aV__gAHklWJcsAvqiGTnAh8TCxbzx_N9rTUii1ZHSk8y3lHZnIXCUpW65mx_HQT3yIbqMHgf4_p_ntAO_HtyleHPKL4ki8soRVCjHrtIwOmwYhd2pZ-VTLW9cXSJiBUeQJpDZxanYvnpaVFtNKskhpOVn1gMtmbvGCcv0Bmb0"
                      />
                    </div>
                    <div className="grow">
                      <h3 className="font-serif text-3xl text-deep-forest">
                        Bro. Ahmed Alade
                      </h3>
                      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600 md:flex md:space-x-4">
                        <p>
                          <span className="font-semibold text-deep-forest">
                            Gender:
                          </span>
                          Male
                        </p>
                        <p className="md:border-l md:pl-4">
                          <span className="font-semibold text-deep-forest">
                            Phone:
                          </span>
                          +234 801 234 5678
                        </p>
                        <p className="md:border-l md:pl-4">
                          <span className="font-semibold text-deep-forest">
                            DOB:
                          </span>
                          Jan 1, 1990
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative rounded-lg bg-mist-green p-6">
                  <a
                    className="absolute top-4 right-4 text-vibrant-lime transition-transform hover:scale-110"
                    href="#"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </a>
                  <div className="flex items-start space-x-4">
                    <span className="material-symbols-outlined text-xl text-institutional-green">
                      location_on
                    </span>
                    <div className="grow">
                      <p className="font-semibold text-deep-forest">
                        Registered under the Lagos State Chapter.
                      </p>
                      <p className="text-sm text-gray-600">
                        Based on residence in Lagos, Nigeria.
                      </p>
                      <div className="mt-4 border-t border-sage-green pt-4">
                        <p>
                          <span className="font-semibold text-deep-forest">
                            Email:
                          </span>
                          ahmed@example.com
                        </p>
                        <p>
                          <span className="font-semibold text-deep-forest">
                            Password:
                          </span>
                          ••••••••
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="rounded-lg border border-sage-green p-6"
                  style={{
                    backgroundImage:
                      "url('data:image/svg+xml,%3Csvg width=&quot;100&quot; height=&quot;100&quot; viewBox=&quot;0 0 100 100&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cfilter id=&quot;noise&quot;%3E%3CfeTurbulence type=&quot;fractalNoise&quot; baseFrequency=&quot;0.8&quot; numOctaves=&quot;4&quot; stitchTiles=&quot;stitch&quot;/%3E%3CfeColorMatrix type=&quot;matrix&quot; values=&quot;0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0&quot;/%3E%3C/filter%3E%3Crect width=&quot;100%25&quot; height=&quot;100%25&quot; filter=&quot;url(%23noise)&quot;/%3E%3C/svg%3E')",
                  }}
                >
                  <h4 className="font-small-caps text-center font-bold tracking-widest text-deep-forest">
                    Membership Declaration
                  </h4>
                  <p className="mt-4 text-center text-deep-forest/80">
                    I hereby confirm that the information provided is accurate.
                    I pledge to honor the brotherhood and support the mission of
                    LAUMGA.
                  </p>
                  <div className="mt-6">
                    <label
                      className="block text-center text-xs font-semibold uppercase tracking-wide text-deep-forest"
                      htmlFor="signature"
                    >
                      Type your full name to sign electronically
                    </label>
                    <input
                      className="mt-2 w-full border-0 border-b border-institutional-green bg-transparent p-3 text-center font-signature text-3xl text-institutional-green placeholder-gray-400 focus:outline-none focus:ring-0"
                      id="signature"
                      placeholder="Your Full Name"
                      type="text"
                    />
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
                  ← Back to Account Details
                </a>
                <button className="group flex items-center justify-center gap-3 rounded-lg bg-deep-forest py-5 px-12 text-lg font-bold uppercase tracking-wider text-white transition hover:bg-opacity-90 focus:outline-none focus:ring-4 focus:ring-deep-forest/50">
                  <span className="material-symbols-outlined text-white">
                    lock
                  </span>
                  SUBMIT APPLICATION
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-white/80 opacity-0 backdrop-blur-sm transition-opacity duration-500">
        <div className="ml-[17.5%] text-center">
          <svg
            className="mx-auto h-24 w-24 text-vibrant-lime"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              className="path"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: "100",
                strokeDashoffset: "100",
                animation: "draw 1.5s ease-in-out forwards",
              }}
            ></path>
          </svg>
          <h2 className="mt-4 font-serif text-3xl text-deep-forest">
            Welcome Home, Bro. Ahmed.
          </h2>
          <p className="mt-2 text-gray-600">
            Your application is under review. Check your email for the
            verification link.
          </p>
          <a
            className="mt-8 inline-block rounded-lg border border-deep-forest px-8 py-3 font-bold text-deep-forest transition hover:bg-deep-forest hover:text-white"
            href="#"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

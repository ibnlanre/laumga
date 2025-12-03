import { createFileRoute } from "@tanstack/react-router";
import { AccountCredentialsForm } from "@/components/account-credentials-form";
import { Container } from "@mantine/core";

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
              <Container size="sm">
                <AccountCredentialsForm />
              </Container>
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

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/forgot-password')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-hidden bg-background-light dark:bg-background-dark font-display">
      <div className="grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          <div className="relative hidden lg:flex flex-col items-center justify-center p-12 bg-deep-forest text-white">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-10"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAAZuN-y9yfVPL-5eXBh4s-qom4q85J3MPP-NEIBsougM4NHm-GbaUr5TdkA3SOR0gxR-lSdN1xMiAl1FF2HW4MaUZZMc1BouF6bdLIcGj9RE1J1v3B_FMhnbi7H26j96sDCrMljQrhl31_o_6yKsLs5dVJWuxo8G_e2wmnLy8Ge-mjXedJNXw2IJuqnw0qLZs8aHEpfTZ0BY00iAX-EiagSwzpc3upyG37bV0fu55YKujpnFr5gguiFNQrX-m_tKORiBfLIJjf5ZA')",
              }}
            ></div>
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
              <span
                className="material-symbols-outlined text-sage-green text-9xl opacity-30 mb-8"
                style={{
                  fontVariationSettings:
                    "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 48",
                }}
              >
                shield
              </span>
              <h2 className="text-3xl font-bold mb-4">Account Security</h2>
              <p className="text-white/80 leading-relaxed">
                We help you get back on track so you don't miss out on community
                updates.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-background-light dark:bg-background-dark p-6 sm:p-8 lg:p-12">
            <div className="w-full max-w-md">
              <div className="bg-white dark:bg-[#1f2418] shadow-lg rounded-lg border border-sage-green/50 p-8 sm:p-12">
                <div className="text-center mb-8">
                  <h1 className="font-serif text-[32px] font-bold text-deep-forest dark:text-background-light leading-tight">
                    Forgot Password?
                  </h1>
                  <p className="text-[#151910] dark:text-white/70 text-base font-normal leading-normal pt-2">
                    Enter the email address associated with your membership. We
                    will send you a secure link to reset your credentials.
                  </p>
                </div>

                <div className="flex flex-col gap-6">
                  <label className="flex flex-col w-full">
                    <p className="text-[#151910] dark:text-white/90 text-sm font-medium leading-normal pb-2">
                      Email Address
                    </p>
                    <div className="flex w-full items-stretch rounded-lg">
                      <div className="relative w-full">
                        <input
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#151910] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:border-primary h-14 placeholder:text-gray-500 p-4 pr-12 text-base font-normal leading-normal"
                          placeholder="you@example.com"
                          value=""
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-sage-green">
                          <span className="material-symbols-outlined">
                            lock
                          </span>
                        </div>
                      </div>
                    </div>
                  </label>

                  <button className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 bg-institutional-green text-white text-sm font-bold uppercase leading-normal tracking-wider hover:bg-institutional-green/90 transition-colors duration-200 shadow-md hover:shadow-lg">
                    <span className="truncate">Send Reset Link</span>
                  </button>
                  <a
                    className="text-deep-forest dark:text-primary text-sm font-medium leading-normal text-center hover:font-bold transition-all"
                    href="#"
                  >
                    <span className="inline-block mr-1">←</span> Back to Login
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

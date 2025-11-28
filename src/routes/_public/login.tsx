import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-white group/design-root overflow-x-hidden">
      <div className="flex h-full min-h-screen grow flex-col">
        <div className="flex flex-1">
          <div className="flex w-full flex-wrap">
            <div className="relative hidden w-2/5 flex-col bg-deep-forest text-white lg:flex">
              <div
                className="absolute inset-0 bg-cover bg-center"
                data-alt="A grand university senate building with classical architecture."
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuChZklTu5YA4KRBqSGCa5q3ptPTYy_IZwSf_4j7SD-WN1rdW1UEMJSrJxMiEMb2KXDv4gJQeCKWt02zvivTlH-F1ps9w6l0urac4z40tMxWGkqzvVd_8pGMSdoSp4pPhZmqrflzhRA32E_YWXVhfR3B_HpXZw0yAW1cIbn-rxcP5blNzu_hBX1zQAfvoicyvgoQOgD6w2QoTKwXRJbpGSveEyI7lzCQ1Vi5vRwfA0_Xpu8_87ek7wU2KM3WngBxuoSNH5w5lPj1AkA')",
                }}
              ></div>
              <div className="absolute inset-0 bg-linear-to-t from-deep-forest/90 via-deep-forest/70 to-deep-forest/40"></div>
              <div className="relative z-10 flex h-full flex-col justify-between p-12">
                <div className="flex">
                  <img
                    alt="LAUMGA Crest"
                    className="h-16 w-16"
                    data-alt="LAUMGA association crest in pure white."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHBTD3WgPQvsf3uqULVrorUrr4lRZ1wX7rNNKYdG3dWqUMCm45rLyh8gkiJdQ2dnomhyD_rBtOSqRgkaviI7rmYI3pQ-wx6P4LFg_cYOMehn7-IL4-UiDo_polBKtShxwoCMfoZ_Tmw6SSZkFsBShKrxO8gp9u7gyKEr7PoUDU6kWPBN1VGk-kqlkJQ0YB_nnjeafLfAkW8VCzbTBEbmKDlQ8l2lFmSzsyfOkT8S9vy5nXC02fK4gfBNbVCE-THvhQMrixligYdI0"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h1 className="text-white tracking-light text-[32px] font-bold leading-tight font-display">
                    Strengthening the bonds of brotherhood.
                  </h1>
                  <p className="text-white/80 text-base font-normal leading-normal font-sans">
                    Access your profile, connect with peers, and manage your
                    membership.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col items-center justify-center bg-mist-green p-6 lg:w-3/5">
              <div className="w-full max-w-md space-y-8">
                <div className="flex w-full flex-col items-center justify-center rounded-lg border border-sage-green bg-white p-10 py-12 shadow-lg sm:p-14">
                  <div className="w-full text-center">
                    <h1 className="text-deep-forest text-[22px] font-bold leading-tight tracking-[-0.015em] font-display">
                      Member Login
                    </h1>
                    <p className="text-gray-600 text-base font-normal leading-normal pt-1">
                      Please enter your details.
                    </p>
                  </div>
                  <form className="mt-8 w-full space-y-6">
                    <div className="relative">
                      <input
                        autoComplete="email"
                        className="peer h-12 w-full rounded-md border border-gray-300 bg-transparent px-4 py-2 text-gray-900 placeholder-transparent focus:border-vibrant-lime focus:outline-none focus:ring-2 focus:ring-vibrant-lime/50"
                        id="email"
                        name="email"
                        placeholder="Email Address"
                        required
                        type="email"
                      />
                      <label
                        className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm peer-focus:text-vibrant-lime"
                        htmlFor="email"
                      >
                        Email Address
                      </label>
                      <span className="material-symbols-outlined absolute right-4 top-3.5 text-sage-green peer-focus:text-vibrant-lime">
                        mail
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        autoComplete="current-password"
                        className="peer h-12 w-full rounded-md border border-gray-300 bg-transparent px-4 py-2 text-gray-900 placeholder-transparent focus:border-vibrant-lime focus:outline-none focus:ring-2 focus:ring-vibrant-lime/50"
                        id="password"
                        name="password"
                        placeholder="Password"
                        required
                        type="password"
                      />
                      <label
                        className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm peer-focus:text-vibrant-lime"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <span className="material-symbols-outlined absolute right-4 top-3.5 text-sage-green peer-focus:text-vibrant-lime">
                        lock
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          className="h-4 w-4 rounded border-institutional-green text-vibrant-lime focus:ring-vibrant-lime"
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                        />
                        <label
                          className="ml-2 block text-sm text-gray-900"
                          htmlFor="remember-me"
                        >
                          Remember me
                        </label>
                      </div>
                      <div className="text-sm">
                        <a
                          className="font-medium text-institutional-green hover:underline"
                          href="#"
                        >
                          Forgot password?
                        </a>
                      </div>
                    </div>
                    <div>
                      <button
                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-institutional-green px-4 py-3 text-sm font-bold uppercase text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-institutional-green focus:ring-offset-2"
                        type="submit"
                      >
                        Log In
                      </button>
                    </div>
                  </form>
                  <div className="mt-6 w-full">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">
                          Or continue with
                        </span>
                      </div>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-3">
                      <div>
                        <a
                          className="inline-flex w-full justify-center rounded-full border border-gray-300 bg-white p-2 text-gray-500 shadow-sm hover:border-vibrant-lime hover:text-gray-900"
                          href="#"
                        >
                          <span className="sr-only">Sign in with Google</span>
                          <svg
                            aria-hidden="true"
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"></path>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
                          </svg>
                        </a>
                      </div>
                      <div>
                        <a
                          className="inline-flex w-full justify-center rounded-full border border-gray-300 bg-white p-2 text-gray-500 shadow-sm hover:border-vibrant-lime hover:text-gray-900"
                          href="#"
                        >
                          <span className="sr-only">Sign in with Facebook</span>
                          <svg
                            aria-hidden="true"
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              clip-rule="evenodd"
                              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                              fill-rule="evenodd"
                            ></path>
                          </svg>
                        </a>
                      </div>
                      <div>
                        <a
                          className="inline-flex w-full justify-center rounded-full border border-gray-300 bg-white p-2 text-gray-500 shadow-sm hover:border-vibrant-lime hover:text-gray-900"
                          href="#"
                        >
                          <span className="sr-only">Sign in with LinkedIn</span>
                          <svg
                            aria-hidden="true"
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 text-center text-sm text-gray-600">
                    <p>
                      Not a member yet?
                      <a
                        className="font-bold text-deep-forest hover:underline"
                        href="#"
                      >
                        Register for an account.
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

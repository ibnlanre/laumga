import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/mandate/pledge")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center p-4 sm:p-6 lg:p-8 font-display bg-background-light dark:bg-background-dark text-[#151910] dark:text-white">
      <div className="w-full max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center">
          <div className="flex flex-col items-center text-primary">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
              <span className="material-symbols-outlined text-base">check</span>
            </div>
            <p className="mt-2 text-sm font-medium text-primary">Selection</p>
          </div>
          <div className="flex-auto border-t-2 border-primary mx-4"></div>
          <div className="flex flex-col items-center text-deep-forest dark:text-white">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-deep-forest text-white ring-4 ring-primary/30">
              <span className="text-sm">2</span>
            </div>
            <p className="mt-2 text-sm font-bold text-deep-forest dark:text-white">
              Identity &amp; Frequency
            </p>
          </div>
          <div className="flex-auto border-t-2 border-gray-300 dark:border-gray-600 mx-4"></div>
          <div className="flex flex-col items-center text-gray-400 dark:text-gray-500">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                3
              </span>
            </div>
            <p className="mt-2 text-sm font-medium">Authorization</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 shadow-xl rounded-xl overflow-hidden">
        <div className="bg-deep-forest p-8 lg:p-12 text-white flex flex-col justify-between">
          <div>
            <h1 className="font-display tracking-light text-xl font-medium leading-tight text-white/80">
              You are establishing a mandate for:
            </h1>
            <h2 className="font-display tracking-tight text-5xl font-bold text-primary my-4">
              ₦10,000 / Monthly
            </h2>
            <p className="font-display text-base font-normal leading-normal text-white/70">
              This amount creates significant change over 12 months.
            </p>
          </div>
          <div>
            <label className="flex flex-col w-full max-w-xs mt-8">
              <p className="text-white/80 text-sm font-medium leading-normal pb-2">
                Frequency
              </p>
              <select
                defaultValue="Monthly"
                className="form-select w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-white/30 bg-white/10 focus:border-primary h-14 placeholder:text-sage-green p-[15px] text-base font-normal leading-normal"
              >
                <option value="Monthly">Monthly</option>
                <option>Quarterly</option>
                <option>Annually</option>
              </select>
            </label>
          </div>
        </div>

        <div className="bg-white dark:bg-background-dark p-8 lg:p-12">
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-lg font-semibold text-deep-forest dark:text-white mb-1">
                Link to Membership Account
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Enter your LAUMGA ID or Email to link this mandate.
              </p>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-deep-forest dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark focus:border-primary h-14 placeholder:text-sage-green p-[15px] text-base font-normal leading-normal"
                placeholder="LAUMGA ID or Email"
                type="text"
                value="ahmed.alade@example.com"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-deep-forest dark:text-white mb-4">
                Payment Gateway
              </h3>

              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 space-y-4 bg-gray-50 dark:bg-gray-800/20">
                <h4 className="font-medium text-deep-forest dark:text-white">
                  Card Details
                </h4>
                <div className="relative h-48 w-full max-w-sm rounded-xl bg-linear-to-br from-gray-700 to-gray-900 p-6 flex flex-col justify-between text-white shadow-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono">DEBIT</span>
                    <svg
                      className="w-12 h-8"
                      fill="none"
                      viewBox="0 0 48 32"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="16" cy="16" fill="#EB001B" r="16"></circle>
                      <circle
                        cx="32"
                        cy="16"
                        fill="#F79E1B"
                        fillOpacity={0.8}
                        r="16"
                      ></circle>
                    </svg>
                  </div>
                  <div className="font-mono text-xl tracking-widest">
                    <span>XXXX</span> <span>XXXX</span> <span>XXXX</span>
                    <span>XXXX</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono uppercase">
                    <span>Card Holder</span>
                    <span>Expires</span>
                  </div>
                  <div className="flex justify-between text-sm font-mono uppercase">
                    <span>Ahmed Alade</span>
                    <span>MM/YY</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-deep-forest dark:text-white mb-4">
                How long should this mandate run?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button className="text-center p-6 border-2 border-transparent ring-2 ring-primary bg-primary/10 rounded-xl hover:border-primary transition-all">
                  <span className="font-bold text-deep-forest dark:text-white">
                    12 Months
                  </span>
                </button>
                <button className="text-center p-6 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-primary transition-all">
                  <span className="font-bold text-deep-forest dark:text-white">
                    24 Months
                  </span>
                </button>
                <button className="text-center p-6 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-primary transition-all">
                  <span className="font-bold text-deep-forest dark:text-white">
                    Indefinitely
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto mt-6 flex justify-end items-center gap-4 px-4">
        <div className="text-right">
          <button className="bg-primary hover:bg-primary/90 text-deep-forest font-bold py-4 px-8 rounded-lg text-lg inline-flex items-center gap-3 transition-colors shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined">lock</span>
            ACTIVATE MANDATE
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Secure 256-bit encryption. You can pause or cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}

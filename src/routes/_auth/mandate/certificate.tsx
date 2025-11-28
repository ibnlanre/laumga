import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/mandate/certificate")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div
      className="fixed inset-0 bg-mist-green dark:bg-deep-forest/90 z-50 flex items-center justify-center p-4 transition-opacity duration-300 opacity-0 pointer-events-none"
      id="success-modal"
      style={{ opacity: 1, pointerEvents: "auto" }}
    >
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center">
        <div className="bg-white dark:bg-[#102a1d] shadow-2xl rounded-xl p-8 md:p-12 border-4 border-primary/20 relative w-full">
          <div className="absolute inset-2 border border-dashed border-sage-green/50 rounded-lg"></div>
          <div className="relative">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-deep-forest rounded-full flex items-center justify-center text-primary font-bold text-2xl">
                L
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-deep-forest dark:text-white uppercase tracking-widest">
              Certificate of Mandate
            </h2>
            <p className="mt-6 text-base text-gray-600 dark:text-gray-300">
              This certifies that
            </p>
            <p className="mt-2 text-xl md:text-2xl font-bold text-primary">
              Bro. Ahmed Alade
            </p>
            <p className="mt-4 text-base text-gray-600 dark:text-gray-300">
              has pledged a monthly mandate of
            </p>
            <p className="mt-2 text-xl md:text-2xl font-bold text-deep-forest dark:text-white">
              ₦10,000
            </p>
            <p className="mt-4 text-base text-gray-600 dark:text-gray-300">
              to the advancement of the brotherhood.
            </p>
            <div className="my-8 border-t border-gray-200 dark:border-gray-700 w-1/2 mx-auto"></div>
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <div>
                <p className="font-semibold">Started: April 18, 2024</p>
              </div>
              <div className="mt-4 sm:mt-0 text-center">
                <p className="font-serif italic text-lg text-deep-forest dark:text-white/80">
                  A. B. Chairman
                </p>
                <p className="text-xs">Foundation Chairman</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl">
          <button className="w-full sm:w-auto flex-1 text-deep-forest dark:text-primary font-semibold py-3 px-6 rounded-lg border-2 border-deep-forest dark:border-primary hover:bg-deep-forest/5 dark:hover:bg-primary/10 transition-colors">
            Download PDF Certificate
          </button>
          <button className="w-full sm:w-auto flex-1 bg-deep-forest text-white font-semibold py-3 px-6 rounded-lg hover:bg-deep-forest/90 transition-colors">
            Go to Donor Dashboard
          </button>
        </div>
        <div className="mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Inspire others to give
          </p>
        </div>
      </div>
    </div>
  );
}

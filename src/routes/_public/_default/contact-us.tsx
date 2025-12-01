import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/_default/contact-us")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative bg-mist-green">
      <header className="relative h-[30vh] bg-deep-forest topographic-pattern">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold">
            Let’s Start a Conversation.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">
            Have a question about membership, events, or the alumni network? We
            are here to help.
          </p>
        </div>
      </header>
      <div className="container mx-auto px-4 pt-16">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 bg-white shadow-2xl rounded-2xl overflow-hidden max-w-5xl mx-auto">
          <div className="lg:col-span-2 bg-institutional-green p-8 md:p-12 text-white relative overflow-hidden">
            <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-2xl text-vibrant-lime mt-1">
                  location_on
                </span>
                <div>
                  <h3 className="font-semibold">Our Location</h3>
                  <p className="text-gray-200">
                    University Campus, 123 Scholar Drive, Knowledge City, NG
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-2xl text-vibrant-lime mt-1">
                  call
                </span>
                <div>
                  <h3 className="font-semibold">Phone Number</h3>
                  <a
                    className="text-gray-200 hover:text-white transition-colors"
                    href="tel:+234012345678"
                  >
                    +234 (0) 123 456 78
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-2xl text-vibrant-lime mt-1">
                  email
                </span>
                <div>
                  <h3 className="font-semibold">Email Address</h3>
                  <a
                    className="text-gray-200 hover:text-white transition-colors"
                    href="mailto:info@mga.edu"
                  >
                    info@mga.edu
                  </a>
                </div>
              </li>
            </ul>
            <div className="mt-12 pt-8 border-t border-white/20">
              <h3 className="font-semibold text-center mb-4">Follow Us</h3>
              <div className="flex justify-center items-center gap-6">
                <a
                  className="text-white hover:text-vibrant-lime transition-colors"
                  data-alt="Facebook icon"
                  href="#"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3l-.5 3h-2.5v6.95c5.05-.5 9-4.76 9-9.95z"></path>
                  </svg>
                </a>
                <a
                  className="text-white hover:text-vibrant-lime transition-colors"
                  data-alt="Twitter icon"
                  href="#"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.73-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.22-1.95-.55v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.94.07 4.28 4.28 0 0 0 4 2.98 8.52 8.52 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21c7.35 0 11.37-6.08 11.37-11.37 0-.17 0-.34-.01-.51.78-.57 1.45-1.29 1.98-2.08z"></path>
                  </svg>
                </a>
                <a
                  className="text-white hover:text-vibrant-lime transition-colors"
                  data-alt="LinkedIn icon"
                  href="#"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-12 5v10h3V11H7zm1.5-2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm6.5 2v2h-1c-1.1 0-2 1.34-2 3v5h-3v-7c0-2.21 1.79-4 4-4h2z"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-sage-green/20 rounded-full"></div>
          </div>

          <div className="lg:col-span-3 bg-white p-8 md:p-12">
            <form action="#" className="space-y-8" method="POST">
              <div className="relative">
                <input
                  className="form-input-material w-full peer"
                  id="name"
                  name="name"
                  placeholder=" "
                  required
                  type="text"
                />
                <label className="form-label-float" htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="relative">
                <input
                  className="form-input-material w-full peer"
                  id="email"
                  name="email"
                  placeholder=" "
                  required
                  type="email"
                />
                <label className="form-label-float" htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="relative">
                <input
                  className="form-input-material w-full peer"
                  id="subject"
                  name="subject"
                  placeholder=" "
                  required
                  type="text"
                />
                <label className="form-label-float" htmlFor="subject">
                  Subject <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="relative">
                <textarea
                  className="form-input-material w-full peer resize-none"
                  id="message"
                  name="message"
                  placeholder=" "
                  required
                  rows={4}
                ></textarea>
                <label className="form-label-float" htmlFor="message">
                  Your Message <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    className="custom-checkbox h-5 w-5 rounded border-2 border-institutional-green bg-transparent text-vibrant-lime focus:ring-0 focus:ring-offset-0"
                    name="newsletter"
                    type="checkbox"
                  />
                  <span className="text-gray-700">
                    Subscribe to our newsletter
                  </span>
                </label>
              </div>
              <div>
                <button
                  className="w-full bg-vibrant-lime text-deep-forest font-bold py-3 px-6 rounded-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  type="submit"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <section className="mt-20 w-full h-96 grid border-y-2 border-vibrant-lime">
        <div className="h-full w-full [grid-area:1/1] relative">
          <iframe
            height="100%"
            width="100%"
            src="https://maps.google.com/maps?hl=en&amp;q=google.com/maps/place/Lautech+NEW+Central+MOSQUE/data=!4m2!3m1!1s0x0:0xd8e020f5be55209?sa=X&ved=1t:2428&ictx=111&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          />
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 max-w-3xl">
        <h2 className="text-3xl font-bold text-center text-deep-forest mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4" x-data="{ open: null }">
          <div className="border border-gray-200 rounded-lg">
            <button className="w-full flex justify-between items-center p-5 text-left">
              <span className="font-semibold text-deep-forest">
                How do I pay my alumni dues?
              </span>
              <span className="material-symbols-outlined text-vibrant-lime transition-transform">
                add
              </span>
            </button>
            <div className="px-5 pb-5 text-gray-600">
              <p>
                You can pay your alumni dues through our online portal in the
                'Membership' section. We accept all major credit cards and bank
                transfers. For assistance, please contact our finance department
                directly.
              </p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg">
            <button className="w-full flex justify-between items-center p-5 text-left">
              <span className="font-semibold text-deep-forest">
                What are the benefits of membership?
              </span>
              <span className="material-symbols-outlined text-vibrant-lime transition-transform">
                add
              </span>
            </button>
            <div
              className="px-5 pb-5 text-gray-600"
              x-collapse=""
              x-show="open === 2"
            >
              <p>
                Membership benefits include access to exclusive networking
                events, career development workshops, a subscription to our
                quarterly journal, and discounts with our corporate partners.
                It's a great way to stay connected and support the community.
              </p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg">
            <button className="w-full flex justify-between items-center p-5 text-left">
              <span className="font-semibold text-deep-forest">
                How can I get involved in upcoming events?
              </span>
              <span className="material-symbols-outlined text-vibrant-lime transition-transform">
                add
              </span>
            </button>
            <div
              className="px-5 pb-5 text-gray-600"
              x-collapse=""
              x-show="open === 3"
            >
              <p>
                All upcoming events are listed on our 'Events' page. Members can
                register directly online. If you'd like to volunteer or speak at
                an event, please reach out to us using the contact form above
                with the subject "Event Volunteering."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

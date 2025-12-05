import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle,
  Heart,
  GraduationCap,
  Handshake,
  Flower2,
  HardHat,
  Shield,
  Edit,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Vote,
  LayoutDashboard,
} from "lucide-react";

export const Route = createFileRoute("/_auth/mandate/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white font-display text-gray-800">
      <section className="relative min-h-[70vh] md:min-h-screen w-full flex flex-col items-center justify-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDQvavO5mTvVgvm5UCo7zdd7eVgLAjmAf4eX-CQBwr7z-yslXKptQeIrwQhgpsrOii4LIX_JLY7IHzD9P2XybWct1OtB78oUvINT8K2r1oUe4Fd7-SDXJV-5mVzpRcH5DX9cFlF0e3UmhdL-HfvM82z5Qd-tK7FJb36biSQHTkn1yvxtr0h_9Tx_H2F8JwvCft41mQ7gpX1V4F4UwQyOv55951tp5ifoo3-HqO4R0j5HlbmUHsTW23P4C7xjxvij8x0C4j00iEF800')",
          }}
        ></div>
        <div className="absolute inset-0 bg-linear-to-b from-deep-forest via-deep-forest/80 to-transparent"></div>
        <div className="relative z-10 text-center px-4 py-20">
          <h1 className="text-5xl md:text-7xl font-black font-serif">
            Establish Your Mandate.
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-200">
            A consistent pledge to uplift our brethren and build a legacy of
            ihsan.
          </p>
        </div>
      </section>
      <div className="relative z-20 -mt-16 w-full px-4">
        <div className="max-w-4xl mx-auto backdrop-blur-xl bg-white/70 rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-deep-forest">
            <div>
              <p className="text-3xl lg:text-4xl font-bold">1,240</p>
              <p className="text-sm font-semibold uppercase tracking-wider">
                Active Mandates
              </p>
            </div>
            <div>
              <p className="text-3xl lg:text-4xl font-bold">₦5.2M</p>
              <p className="text-sm font-semibold uppercase tracking-wider">
                Committed Monthly
              </p>
            </div>
            <div>
              <p className="text-3xl lg:text-4xl font-bold">500+</p>
              <p className="text-sm font-semibold uppercase tracking-wider">
                Lives Impacted
              </p>
            </div>
          </div>
        </div>
      </div>
      <main>
        <section className="bg-white py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-vibrant-lime font-bold tracking-widest uppercase">
                OUR PURPOSE
              </p>
              <h2 className="text-4xl md:text-5xl font-bold font-serif text-deep-forest mt-2">
                Building Code. Building Ummah.
              </h2>
              <p>
                We are a community united by faith and a shared academic
                journey. Our mission is to leverage our collective strength to
                foster spiritual growth, academic excellence, and socio-economic
                empowerment for Muslim graduates and the wider community. We
                believe in the power of consistent, collective action to create
                a lasting legacy of support, opportunity, and ihsan
                (excellence).
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="text-sage-green mt-1 mr-3 h-6 w-6 shrink-0" />
                  <span>
                    To provide scholarships and educational grants to deserving
                    students.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-sage-green mt-1 mr-3 h-6 w-6 shrink-0" />
                  <span>
                    To offer welfare and healthcare support to members in need.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-sage-green mt-1 mr-3 h-6 w-6 shrink-0" />
                  <span>
                    To create networking and mentorship opportunities for
                    professional growth.
                  </span>
                </li>
              </ul>
            </div>
            <div className="relative h-96 lg:h-auto lg:self-stretch">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-mist-green rounded-full opacity-50 blur-xl"></div>
              <img
                alt="Student studying"
                className="absolute top-0 left-0 w-2/3 h-full object-cover rounded-2xl shadow-xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDagZh0W8Kox9GliLH0P9yCMdNunJN7dWzBLU4RgQCsr5W9b6EkjeTMwecwLX5ZfrWXlPeIyKflTxWkt8R8qYs1PoEGeJXTrNhaNlYL2SgYbbnbFU7gzPfkIS9D5gv18pDZ4vtZrYlavKe2_BT5t7Nx_P_TAFYV5GO7hUGRw0FSenT1SfUCsVrUBtYqsyiQxrZ6qbgvf2oz5cxVJsm2iNKQgdGobzVgqv8jLMY1cYI0ORJHPe-gfCj_6mDebUlC9UV2GBqTgLwwU4g"
              />
              <img
                alt="Alumni handshake"
                className="absolute bottom-0 right-0 w-1/2 h-2/3 object-cover rounded-2xl border-8 border-white shadow-2xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDU2HENFOf4sVMApg7CUweolIWfYWcPBPa5WVlfcXbeTBd59NwxzrKFniM96ssrli9dwE2a9Av4qALs9qXC8higXB99YYH6RJb2hu7aRzfvi7Y6_JiUFpZuln3VggJtDZtvxvJQao9OjybLFACmlBEuuTqMoUVqxcvjebmofhstAYyydABCbxnkKEUj9SNQolabE0ZxI298U7CfXoinBQ4YEnbZxcto0LQcwnqajCxwdeLSriVUpPOTNWMvk_QqhamLsoTPLEelIWo"
              />
            </div>
          </div>
        </section>
        <section className="bg-mist-green py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-deep-forest text-center mb-16">
              How Your Mandate Transforms Lives
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-heavy shadow-2xl shadow-black/10 flex flex-col items-center p-8 text-center relative overflow-hidden">
                <div className="bg-institutional-green/10 p-5 rounded-full mb-6">
                  <Heart className="text-institutional-green h-12 w-12" />
                </div>
                <h3 className="text-xl font-bold text-deep-forest">
                  Welfare Support Fund
                </h3>
                <p className="mt-2 text-gray-600 grow">
                  Providing critical assistance for healthcare, emergencies, and
                  essential needs to members of our community facing hardship.
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-sage-green/20 to-transparent pointer-events-none"></div>
              </div>
              <div className="bg-white rounded-heavy shadow-2xl shadow-black/10 flex flex-col items-center p-8 text-center relative overflow-hidden">
                <div className="bg-institutional-green/10 p-5 rounded-full mb-6">
                  <GraduationCap className="text-institutional-green h-12 w-12" />
                </div>
                <h3 className="text-xl font-bold text-deep-forest">
                  Education &amp; Scholarship
                </h3>
                <p className="mt-2 text-gray-600 grow">
                  Fueling the future by funding scholarships, academic grants,
                  and educational resources for the next generation of leaders.
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-sage-green/20 to-transparent pointer-events-none"></div>
              </div>
              <div className="bg-white rounded-heavy shadow-2xl shadow-black/10 flex flex-col items-center p-8 text-center relative overflow-hidden">
                <div className="bg-institutional-green/10 p-5 rounded-full mb-6">
                  <Handshake className="text-institutional-green h-12 w-12" />
                </div>
                <h3 className="text-xl font-bold text-deep-forest">
                  Community Empowerment
                </h3>
                <p className="mt-2 text-gray-600 grow">
                  Investing in workshops, mentorship programs, and initiatives
                  that build skills and foster economic self-sufficiency.
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-sage-green/20 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-white py-20 md:py-32">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-deep-forest">
              The Power of Small, Consistent Actions
            </h2>
            <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-deep-forest">
              <div className="text-center">
                <p className="text-lg">If</p>
                <p className="text-3xl font-bold text-vibrant-lime">1,000</p>
                <p className="text-lg">members pledge</p>
              </div>
              <span className="text-3xl font-bold text-vibrant-lime">×</span>
              <div className="text-center">
                <p className="text-lg">just</p>
                <p className="text-3xl font-bold text-vibrant-lime">₦5,000</p>
                <p className="text-lg">monthly</p>
              </div>
              <span className="text-3xl font-bold text-vibrant-lime">=</span>
              <div className="text-center p-6 bg-mist-green rounded-2xl">
                <p className="text-lg">we raise</p>
                <p className="text-3xl font-bold text-institutional-green">
                  ₦5 Million/Month
                </p>
                <p className="text-lg">for the Ummah</p>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-white py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-deep-forest text-center mb-16">
              Choose Your Impact Level
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-mist-green rounded-2xl p-6 flex flex-col text-deep-forest relative scalloped">
                <Flower2 className="text-institutional-green h-6 w-6" />
                <h3 className="text-2xl font-bold mt-4">Supporter</h3>
                <p className="text-5xl font-black mt-auto">₦5,000</p>
                <p className="font-semibold">Per Month</p>
                <button className="absolute bottom-6 right-6 bg-deep-forest text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-institutional-green transition-colors">
                  <ArrowRight className="h-6 w-6" />
                </button>
              </div>
              <div className="bg-sage-green rounded-2xl p-6 flex flex-col text-deep-forest relative scalloped">
                <HardHat className="text-institutional-green h-6 w-6" />
                <h3 className="text-2xl font-bold mt-4">Builder</h3>
                <p className="text-5xl font-black mt-auto">₦10,000</p>
                <p className="font-semibold">Per Month</p>
                <button className="absolute bottom-6 right-6 bg-deep-forest text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-institutional-green transition-colors">
                  <ArrowRight className="h-6 w-6" />
                </button>
              </div>
              <div className="bg-institutional-green rounded-2xl p-6 flex flex-col text-white relative scalloped">
                <Shield className="h-6 w-6" />
                <h3 className="text-2xl font-bold mt-4">Guardian</h3>
                <p className="text-5xl font-black mt-auto">₦25,000</p>
                <p className="font-semibold">Per Month</p>
                <button className="absolute bottom-6 right-6 bg-white text-deep-forest rounded-full w-12 h-12 flex items-center justify-center hover:bg-vibrant-lime transition-colors">
                  <ArrowRight className="h-6 w-6" />
                </button>
              </div>
              <div className="bg-white rounded-2xl p-6 flex flex-col text-deep-forest relative border-2 border-dashed border-deep-forest scalloped">
                <Edit className="text-deep-forest h-6 w-6" />
                <h3 className="text-2xl font-bold mt-4">Custom Pledge</h3>
                <p className="text-lg mt-auto mb-2">Enter your own amount</p>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-deep-forest font-bold">
                    ₦
                  </span>
                  <input
                    className="w-full bg-mist-green border-0 rounded-md py-2 pl-8 text-center font-bold text-deep-forest focus:ring-2 focus:ring-vibrant-lime"
                    placeholder="Amount"
                    type="text"
                  />
                </div>
                <button className="absolute bottom-6 right-6 bg-deep-forest text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-institutional-green transition-colors">
                  <ArrowRight className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-sage-green/20 py-20 md:py-32">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center text-deep-forest">
              <div className="flex flex-col items-center">
                <BadgeCheck className="h-10 w-10 mb-3 text-institutional-green" />
                <h4 className="font-bold">Shariah Compliant</h4>
                <p className="text-sm mt-1">
                  All funds are managed according to Islamic principles.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <BarChart3 className="h-10 w-10 mb-3 text-institutional-green" />
                <h4 className="font-bold">Monthly Reports</h4>
                <p className="text-sm mt-1">
                  Receive detailed impact and financial reports every month.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Vote className="h-10 w-10 mb-3 text-institutional-green" />
                <h4 className="font-bold">Community Voting</h4>
                <p className="text-sm mt-1">
                  Mandate holders have a say in major project selections.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <LayoutDashboard className="h-10 w-10 mb-3 text-institutional-green" />
                <h4 className="font-bold">Digital Dashboard</h4>
                <p className="text-sm mt-1">
                  Track your contributions and see their impact in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-deep-forest text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-serif">
            Leave a digital Sadaqah legacy behind.
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Your consistent support is a continuous charity that builds a better
            future for our ummah.
          </p>
          <a
            className="mt-8 inline-block bg-vibrant-lime text-deep-forest font-bold py-4 px-10 rounded-full text-lg hover:bg-white transition-colors"
            href="#"
          >
            Start Your Mandate
          </a>
        </div>
      </footer>
    </div>
  );
}

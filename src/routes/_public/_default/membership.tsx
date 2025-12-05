import { Button } from "@mantine/core";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check,
  Star,
  Shield,
  Users,
  Sparkles,
  HandHeart,
  GraduationCap,
  Calendar,
  Landmark,
} from "lucide-react";

export const Route = createFileRoute("/_public/_default/membership")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-deep-forest text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCVTHR8-yq_8s7-rEB6E6pObws6LZIn3KK3FlXNoyhuBu36032eFeXl-NumLp87zBPk4NZ7NVXpbFDKR9Nf4VvrKCsLSn058NoEMN16Y1NLs8R5Ur-kGUYSgcpqGEDiAquPOfhJaZUtVZXk-SzrhKc6hbPYrEcr12rA_soTKlOquM0x-Qn1y_EtRs4Q3C92lPY87nh154XRMZBZuo4DVVhWFhg6LE-KvcTVHkrX6ZFwvXG55_NFDq40Y82kW8JkoMWXyPNVWyYoPfE')",
          }}
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:py-32">
          <p className="mb-4 font-bold uppercase tracking-widest text-vibrant-lime">
            Join Our Network
          </p>
          <h1 className="font-serif text-5xl font-bold leading-tight md:text-7xl lg:text-8xl">
            Membership
            <br />
            Benefits &amp; Tiers
          </h1>
          <p className="mt-6 max-w-2xl text-base text-white/80 md:text-lg">
            Choose the membership tier that best fits your commitment to our
            shared vision of excellence and brotherhood.
          </p>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="font-serif text-4xl font-bold text-deep-forest sm:text-5xl">
              Why Join LAUMGA?
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
              Membership opens doors to a lifetime of opportunities,
              connections, and spiritual growth.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-green">
                <Users className="h-8 w-8 text-institutional-green" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-deep-forest">
                Strong Network
              </h3>
              <p className="mt-2 text-gray-600">
                Connect with fellow alumni across industries and continents.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-green">
                <Star className="h-8 w-8 text-institutional-green" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-deep-forest">
                Exclusive Events
              </h3>
              <p className="mt-2 text-gray-600">
                Access members-only conventions, seminars, and networking
                events.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-green">
                <Shield className="h-8 w-8 text-institutional-green" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-deep-forest">
                Welfare Support
              </h3>
              <p className="mt-2 text-gray-600">
                Benefit from our welfare programs during times of need.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-green">
                <Sparkles className="h-8 w-8 text-institutional-green" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-deep-forest">
                Spiritual Growth
              </h3>
              <p className="mt-2 text-gray-600">
                Participate in programs designed to strengthen your faith.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="bg-mist-green py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="font-serif text-4xl font-bold text-deep-forest sm:text-5xl">
              Membership Tiers
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
              Select the tier that aligns with your commitment. All tiers
              include core membership benefits.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {/* Standard Tier */}
            <div className="flex flex-col rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
              <div>
                <h3 className="text-2xl font-bold text-deep-forest">
                  Standard
                </h3>
                <p className="mt-2 text-gray-600">
                  For alumni joining the network
                </p>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-deep-forest">
                    ₦5,000
                  </span>
                  <span className="text-gray-600">/year</span>
                </div>
              </div>

              <ul className="mt-8 flex-1 space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-institutional-green" />
                  <span className="text-gray-700">
                    Access to member directory
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-institutional-green" />
                  <span className="text-gray-700">
                    Quarterly newsletter updates
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-institutional-green" />
                  <span className="text-gray-700">
                    Invitation to annual convention
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-institutional-green" />
                  <span className="text-gray-700">Basic welfare support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-institutional-green" />
                  <span className="text-gray-700">Chapter membership</span>
                </li>
              </ul>

              <Button
                component={Link}
                to="/register"
                variant="outline"
                size="lg"
                radius="xl"
                fullWidth
                className="mt-8"
              >
                Get Started
              </Button>
            </div>

            {/* Premium Tier - Featured */}
            <div className="relative flex flex-col rounded-2xl bg-institutional-green p-8 shadow-xl ring-2 ring-institutional-green">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-vibrant-lime px-4 py-1 text-xs font-bold uppercase text-deep-forest">
                Most Popular
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white">Premium</h3>
                <p className="mt-2 text-white/80">
                  For engaged and active members
                </p>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-white">₦15,000</span>
                  <span className="text-white/80">/year</span>
                </div>
              </div>

              <ul className="mt-8 flex-1 space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-vibrant-lime" />
                  <span className="text-white">All Standard tier benefits</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-vibrant-lime" />
                  <span className="text-white">
                    Priority event registration
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-vibrant-lime" />
                  <span className="text-white">
                    Exclusive networking sessions
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-vibrant-lime" />
                  <span className="text-white">Enhanced welfare coverage</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-vibrant-lime" />
                  <span className="text-white">
                    Digital membership certificate
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-vibrant-lime" />
                  <span className="text-white">Monthly bulletin access</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-vibrant-lime" />
                  <span className="text-white">Career mentorship program</span>
                </li>
              </ul>

              <Button
                component={Link}
                to="/register"
                variant="filled"
                color="vibrant-lime"
                size="lg"
                radius="xl"
                fullWidth
                className="mt-8 text-deep-forest hover:scale-105 transition-transform"
              >
                Join Premium
              </Button>
            </div>

            {/* Lifetime Tier */}
            <div className="flex flex-col rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
              <div>
                <h3 className="text-2xl font-bold text-deep-forest">
                  Lifetime
                </h3>
                <p className="mt-2 text-gray-600">
                  One-time investment, forever connected
                </p>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-deep-forest">
                    ₦100,000
                  </span>
                  <span className="text-gray-600">/once</span>
                </div>
              </div>

              <ul className="mt-8 flex-1 space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-institutional-green" />
                  <span className="text-gray-700">
                    All Premium tier benefits
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-institutional-green" />
                  <span className="text-gray-700">
                    Lifetime membership status
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-institutional-green" />
                  <span className="text-gray-700">VIP event seating</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-institutional-green" />
                  <span className="text-gray-700">
                    Executive council voting rights
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-institutional-green" />
                  <span className="text-gray-700">Premium welfare package</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-institutional-green" />
                  <span className="text-gray-700">
                    Physical membership plaque
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-institutional-green" />
                  <span className="text-gray-700">
                    Legacy recognition program
                  </span>
                </li>
              </ul>

              <Button
                component={Link}
                to="/register"
                variant="outline"
                size="lg"
                radius="xl"
                fullWidth
                className="mt-8"
              >
                Secure Lifetime Access
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            All prices are in Nigerian Naira (₦). Discounts available for early
            bird registrations.
          </p>
        </div>
      </section>

      {/* Mandate Benefits */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="font-serif text-4xl font-bold text-deep-forest sm:text-5xl">
              What Your Membership Supports
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
              Your contribution directly funds programs and initiatives that
              benefit our entire community.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <div className="rounded-xl bg-mist-green p-8 text-center">
              <HandHeart className="h-10 w-10 text-institutional-green mx-auto" />
              <h3 className="mt-4 text-xl font-bold text-deep-forest">
                Welfare Programs
              </h3>
              <p className="mt-3 text-gray-700">
                Supporting members during life's challenges - from medical
                emergencies to bereavement support, your dues ensure no member
                faces difficulty alone.
              </p>
            </div>

            <div className="rounded-xl bg-mist-green p-8 text-center">
              <GraduationCap className="h-10 w-10 text-institutional-green mx-auto" />
              <h3 className="mt-4 text-xl font-bold text-deep-forest">
                Educational Support
              </h3>
              <p className="mt-3 text-gray-700">
                Scholarship programs for deserving students, mentorship
                initiatives, and career development workshops that empower the
                next generation.
              </p>
            </div>

            <div className="rounded-xl bg-mist-green p-8 text-center">
              <Calendar className="h-10 w-10 text-institutional-green mx-auto" />
              <h3 className="mt-4 text-xl font-bold text-deep-forest">
                Annual Convention
              </h3>
              <p className="mt-3 text-gray-700">
                Our flagship event bringing together alumni nationwide for
                spiritual renewal, networking, and celebrating our shared
                journey.
              </p>
            </div>

            <div className="rounded-xl bg-mist-green p-8 text-center">
              <Landmark className="h-10 w-10 text-institutional-green mx-auto" />
              <h3 className="mt-4 text-xl font-bold text-deep-forest">
                Campus MSSN Support
              </h3>
              <p className="mt-3 text-gray-700">
                Direct support to MSSN activities on campus, ensuring current
                students benefit from the same foundation that shaped us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-mist-green py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="font-serif text-4xl font-bold text-deep-forest sm:text-5xl">
              What Members Say
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-white p-8 shadow-sm">
              <p className="text-gray-700 italic">
                "Joining LAUMGA was one of the best decisions I made after
                graduation. The network has opened doors I never imagined
                possible."
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-institutional-green flex items-center justify-center text-white font-bold">
                  AB
                </div>
                <div>
                  <p className="font-bold text-deep-forest">
                    Abdullahi Balogun
                  </p>
                  <p className="text-sm text-gray-600">B.Tech Civil '15</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-8 shadow-sm">
              <p className="text-gray-700 italic">
                "The welfare support I received during a difficult time showed
                me the true meaning of brotherhood. LAUMGA is family."
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-institutional-green flex items-center justify-center text-white font-bold">
                  FM
                </div>
                <div>
                  <p className="font-bold text-deep-forest">Fatima Mohammed</p>
                  <p className="text-sm text-gray-600">M.Tech Computer '18</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-8 shadow-sm">
              <p className="text-gray-700 italic">
                "The spiritual programs and conventions have helped me maintain
                my faith while navigating professional life. Invaluable."
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-institutional-green flex items-center justify-center text-white font-bold">
                  IK
                </div>
                <div>
                  <p className="font-bold text-deep-forest">Ibrahim Kazeem</p>
                  <p className="text-sm text-gray-600">B.Tech Mechanical '12</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-deep-forest py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="font-serif text-4xl font-bold text-white sm:text-5xl">
            Ready to Join the Legacy?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Become part of a community that stands for excellence, brotherhood,
            and service. Your journey with LAUMGA starts today.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              component={Link}
              to="/register"
              variant="filled"
              color="vibrant-lime"
              size="xl"
              radius="xl"
              className="text-deep-forest hover:scale-105 transition-transform"
            >
              Start Your Membership
            </Button>
            <Button
              component={Link}
              to="/contact-us"
              variant="outline"
              size="xl"
              radius="xl"
              className="text-white border-white hover:bg-white/10"
            >
              Have Questions?
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

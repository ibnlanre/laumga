import { Badge, Button } from "@mantine/core";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/section";
import {
  ArrowRight,
  Shield,
  HeartHandshake,
  GraduationCap,
  CalendarCheck,
  Landmark,
  Sparkles,
  Compass,
  Check,
  Star,
  Users,
} from "lucide-react";
import { Fragment } from "react";
import clsx from "clsx";

const mandateTiers = [
  {
    id: "supporter",
    name: "Supporter",
    amount: "₦5,000",
    cadence: "/month",
    impact:
      "Help sustain students and community programs through consistent giving.",
    features: [
      "Chapter membership",
      "Invitations to conventions and events",
      "Participation in community polls",
      "Monthly bulletin access",
    ],
    search: { amount: 5000 },
  },
  {
    id: "builder",
    name: "Builder",
    amount: "₦10,000",
    cadence: "/month",
    impact: "Enable faster response to welfare needs across chapters.",
    features: [
      "Monthly field stories",
      "Early access to event registration",
      "Direct updates on funded initiatives",
      "Recognition as a sustaining contributor",
    ],
    search: { amount: 10000 },
  },
  {
    id: "guardian",
    name: "Guardian",
    amount: "₦25,000",
    cadence: "/month",
    impact: "Strengthen long-term initiatives and institutional continuity.",
    features: [
      "Periodic strategic briefings",
      "Invitation to networking sessions",
      "Closer insight into program direction",
      "Quarterly impact updates",
    ],
    search: { amount: 25000 },
  },
] as const;

const focusAreas = [
  {
    title: "Welfare Response",
    copy: "Emergency housing, groceries, medical retainers, and dignified support routed through trusted alumni.",
    icon: HeartHandshake,
  },
  {
    title: "Education & Scholarships",
    copy: "Mini-grants, exam fees, and mentorship that keep brilliant students on campus and on track.",
    icon: GraduationCap,
  },
  {
    title: "Community Infrastructure",
    copy: "Conventions, da'wah caravans, and MSSN campus support that strengthen our collective backbone.",
    icon: Landmark,
  },
  {
    title: "Entrepreneurship",
    copy: "Micro-capital and advisory circles for halal founders hiring within the Ummah first.",
    icon: Sparkles,
  },
];

const rhythm = [
  {
    title: "Listen & Verify",
    copy: "Regional volunteers submit verified cases weekly so no plea for help is ignored.",
    icon: Compass,
  },
  {
    title: "Allocate Smartly",
    copy: "Mandate tiers pool into welfare, scholarships, and empowerment based on urgency scores.",
    icon: CalendarCheck,
  },
  {
    title: "Report Back",
    copy: "You receive transparent ledgers, anonymised stories, and dashboards every month.",
    icon: ArrowRight,
  },
];

const testimonials = [
  {
    quote:
      "Pledging as a Builder meant our Lagos circle could cover a sister's surgery deposit in hours, not weeks.",
    name: "Maryam Adebayo",
    detail: "Architect · Class of 2014",
  },
  {
    quote:
      "The Mandate brief made it obvious where my ₦5,000 lands every month—one student, one story, full accountability.",
    name: "Ridwan Adeleke",
    detail: "Product Manager · Class of 2017",
  },
  {
    quote:
      "Guardian status plugged me into monthly strategy calls so I can help unblock regional projects in real time.",
    name: "Hajara Sulaimon",
    detail: "Investment Analyst · Class of 2010",
  },
];

export const Route = createFileRoute("/_public/_default/membership")({
  head: () => ({
    meta: [
      {
        title: "Membership - LAUMGA",
      },
      {
        name: "description",
        content:
          "Explore LAUMGA membership tiers and benefits. Choose from Supporter, Builder, Guardian, or Champion levels to support student welfare, scholarships, and community development.",
      },
      {
        name: "keywords",
        content:
          "LAUMGA membership, alumni membership tiers, join LAUMGA, supporter benefits, guardian tier, champion level",
      },
      {
        property: "og:title",
        content: "Membership - LAUMGA",
      },
      {
        property: "og:description",
        content:
          "Explore LAUMGA membership tiers and benefits. Support student welfare, scholarships, and community development.",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="bg-mist-green/30 text-deep-forest">
      <Hero />
      <MembershipNotice />
      <TierSection />
      <FocusGrid />
      <ImpactRhythm />
      <Testimonials />
      <MandateCta />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-deep-forest text-white">
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(141,198,63,0.45), transparent 60%), radial-gradient(circle at 80% 10%, rgba(203,229,167,0.3), transparent 65%)",
        }}
        aria-hidden
      />
      <Section className="relative flex flex-col items-center gap-6 py-24 text-center">
        <Badge
          radius="xl"
          variant="light"
          size="lg"
          className="bg-white/10 text-vibrant-lime"
        >
          Join Our Network
        </Badge>
        <h1 className="font-serif text-4xl font-bold leading-tight md:text-6xl">
          Membership Benefits & Tiers
        </h1>
        <p className="max-w-3xl text-lg text-white/80">
          LAUMGA is formalising a membership structure, but we are not waiting
          to serve. Engage today through the Mandate pledge tiers that already
          fund welfare, scholarships, and campus support.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            component={Link}
            to="/mandate/pledge"
            size="lg"
            radius="xl"
            className="bg-vibrant-lime text-deep-forest hover:bg-white"
          >
            Review Mandate tiers
          </Button>
          <Button
            component={Link}
            to="/contact-us"
            variant="outline"
            size="lg"
            radius="xl"
            className="border-white text-white hover:bg-white/10"
          >
            Talk to the team
          </Button>
        </div>
      </Section>
    </section>
  );
}

function MembershipNotice() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <Section>
        <div className="text-center">
          <h2 className="font-serif text-4xl font-bold text-deep-forest sm:text-5xl">
            Why Join LAUMGA?
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
            Membership opens doors to a lifetime of opportunities, connections,
            and spiritual growth.
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
              Access members-only conventions, seminars, and networking events.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-green">
              <Shield className="h-8 w-8 text-institutional-green" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-deep-forest">
              MSSN Support
            </h3>
            <p className="mt-2 text-gray-600">
              Ensuring current students benefit from the same foundation that
              shaped us.
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
      </Section>
    </div>
  );
}

function FocusGrid() {
  return (
    <Section className="py-16 sm:py-24">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-institutional-green">
          Why your pledge matters
        </p>
        <h2 className="mt-3 font-serif text-4xl font-bold">
          Every tier fuels practical workstreams
        </h2>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {focusAreas.map((area) => {
          const Icon = area.icon;
          return (
            <article
              key={area.title}
              className="rounded-3xl border border-sage-green/50 bg-white p-8 shadow-lg"
            >
              <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-mist-green text-deep-forest">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-semibold">{area.title}</h3>
              <p className="mt-3 text-gray-700">{area.copy}</p>
            </article>
          );
        })}
      </div>
    </Section>
  );
}

function TierSection() {
  return (
    <Fragment>
      {/* Pricing Tiers */}
      <section className="bg-mist-green py-16 sm:py-24">
        <Section>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-institutional-green">
              Your Commitment.
            </p>
            <h2 className="mt-3 font-serif text-4xl font-bold text-deep-forest sm:text-5xl">
              Membership Tiers
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
              All tiers include core membership benefits. Click through and the
              amount is pre-filled for you.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {mandateTiers.map((tier) => (
              <div
                key={tier.id}
                className={clsx(
                  "flex flex-col rounded-2xl p-8 shadow-sm relative",
                  {
                    "bg-institutional-green ring-2 ring-institutional-green shadow-xl":
                      tier.id === "builder",
                    "bg-white ring-1 ring-gray-200": tier.id !== "builder",
                  }
                )}
              >
                {tier.id === "builder" && (
                  <div
                    className={clsx(
                      "absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold uppercase",
                      {
                        "bg-vibrant-lime text-deep-forest":
                          tier.id === "builder",
                        "bg-gray-200 text-gray-800": tier.id !== "builder",
                      }
                    )}
                  >
                    Most Popular
                  </div>
                )}

                <div>
                  <h3
                    className={clsx("text-2xl font-bold", {
                      "text-white": tier.id === "builder",
                      "text-deep-forest": tier.id !== "builder",
                    })}
                  >
                    {tier.name}
                  </h3>
                  <p
                    className={clsx("mt-2", {
                      "text-white/80": tier.id === "builder",
                      "text-gray-600": tier.id !== "builder",
                    })}
                  >
                    {tier.impact}
                  </p>
                  <div className="mt-6">
                    <span
                      className={clsx(
                        "text-5xl font-bold",
                        tier.id === "builder"
                          ? "text-white"
                          : "text-deep-forest"
                      )}
                    >
                      {tier.amount}
                    </span>
                    <span
                      className={clsx(
                        tier.id === "builder"
                          ? "text-white/80"
                          : "text-gray-600"
                      )}
                    >
                      {tier.cadence}
                    </span>
                  </div>
                </div>

                <ul className="mt-8 flex-1 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        className={clsx("h-5 w-5 shrink-0", {
                          "text-vibrant-lime": tier.id === "builder",
                          "text-institutional-green": tier.id !== "builder",
                        })}
                      />
                      <span
                        className={clsx(
                          tier.id === "builder" ? "text-white" : "text-gray-700"
                        )}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/mandate/pledge"
                  search={tier.search}
                  className={clsx(
                    "group mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-4 text-sm font-semibold transition",
                    {
                      "bg-vibrant-lime text-deep-forest hover:bg-mist-green":
                        tier.id === "builder",
                      "border border-deep-forest text-deep-forest hover:bg-deep-forest hover:text-white":
                        tier.id !== "builder",
                    }
                  )}
                >
                  {tier.id === "builder" ? "Commit Now" : "Get Started"}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </Section>
      </section>
    </Fragment>
  );
}

function ImpactRhythm() {
  return (
    <section className="bg-mist-green py-20">
      <Section>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-deep-forest/70">
            Operating rhythm
          </p>
          <h2 className="mt-3 font-serif text-4xl font-bold text-deep-forest">
            How mandates move every month
          </h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {rhythm.map((step) => {
            const Icon = step.icon;
            return (
              <article
                key={step.title}
                className="rounded-3xl border border-deep-forest/10 bg-white p-8 text-center shadow-lg"
              >
                <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-mist-green text-deep-forest">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-gray-700">{step.copy}</p>
              </article>
            );
          })}
        </div>
      </Section>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="bg-white py-20">
      <Section>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-institutional-green">
            Member voices
          </p>
          <h2 className="mt-3 font-serif text-4xl font-bold text-deep-forest">
            "Membership" looks like consistency right now
          </h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((story) => (
            <article
              key={story.name}
              className="rounded-3xl border border-sage-green/50 bg-mist-green/40 p-8 shadow-lg"
            >
              <p className="text-gray-800">“{story.quote}”</p>
              <div className="mt-6">
                <p className="font-semibold text-deep-forest">{story.name}</p>
                <p className="text-sm text-gray-600">{story.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </section>
  );
}

function MandateCta() {
  return (
    <section className="bg-deep-forest py-20 text-white">
      <Section className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
          Next step
        </p>
        <h2 className="mt-3 font-serif text-4xl font-bold">
          Choose a mandate tier today. Formal membership will meet you there.
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-white/80">
          Become part of a community that stands for excellence, brotherhood,
          and service. Your journey with LAUMGA starts today.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            component={Link}
            to="/mandate/pledge"
            size="lg"
            radius="xl"
            className="bg-vibrant-lime text-deep-forest hover:bg-white"
          >
            Start a pledge
          </Button>
          <Button
            component={Link}
            to="/mandate/dashboard"
            variant="outline"
            size="lg"
            radius="xl"
            className="border-white text-white hover:bg-white/10"
          >
            View impact dashboard
          </Button>
        </div>
      </Section>
    </section>
  );
}

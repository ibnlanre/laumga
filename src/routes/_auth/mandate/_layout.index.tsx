import { createFileRoute, Link } from "@tanstack/react-router";
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
import { MandateHeader } from "@/layouts/mandate/header";
import { Section } from "@/components/section";

export const Route = createFileRoute("/_auth/mandate/_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  const heroHighlights = [
    {
      title: "Scholarship lifeline",
      detail:
        "Mini-grants and tuition bridges keep brilliant students enrolled when fees spike mid-semester.",
    },
    {
      title: "Welfare triage",
      detail:
        "Emergency housing, groceries, and hospital deposits are routed through trusted alumni in each zone.",
    },
    {
      title: "Community ventures",
      detail:
        "Mentorship circles and seed micros support halal businesses that hire within the Ummah first.",
    },
  ];

  const focusHighlights = [
    {
      title: "Welfare Support Fund",
      copy: "Immediate relief for healthcare, emergency housing, and dignified sustenance when members need it most.",
      icon: Heart,
    },
    {
      title: "Education & Scholarship",
      copy: "Scholarships, academic stipends, and essential resources for students determined to finish strong.",
      icon: GraduationCap,
    },
    {
      title: "Community Empowerment",
      copy: "Mentorship, skills bootcamps, and capital to unlock Muslim-owned ideas that uplift entire families.",
      icon: Handshake,
    },
  ];

  const momentum = [
    {
      step: "01",
      title: "Listen & Verify Needs",
      copy: "Regional volunteers surface verified cases weekly so no call for help remains unseen.",
    },
    {
      step: "02",
      title: "Match Resources",
      copy: "Mandate funds are allocated across scholarships, welfare, and empowerment based on urgency scores.",
    },
    {
      step: "03",
      title: "Report Back Transparently",
      copy: "Members receive monthly dashboards, anonymized stories, and audited ledgers for every naira.",
    },
  ];

  const tiers = [
    {
      name: "Supporter",
      amount: "₦5,000",
      caption: "Keep a student on campus.",
      icon: Flower2,
      accent: "from-sage-green/50 via-mist-green/40 to-transparent",
      search: { tier: "supporter", amount: 5000 },
      perks: ["Quarterly impact brief", "Community voting rights"],
    },
    {
      name: "Builder",
      amount: "₦10,000",
      caption: "Fund welfare emergencies.",
      icon: HardHat,
      accent: "from-vibrant-lime/40 via-white to-transparent",
      search: { tier: "builder", amount: 10000 },
      perks: ["Monthly field stories", "Priority event invites"],
    },
    {
      name: "Guardian",
      amount: "₦25,000",
      caption: "Underwrite an entire initiative.",
      icon: Shield,
      accent: "from-deep-forest/40 via-institutional-green/30 to-transparent",
      search: { tier: "guardian", amount: 25000 },
      perks: ["Executive briefings", "Seat on mandate council"],
    },
  ] as const;

  const trustBadges = [
    {
      title: "Shariah Compliant",
      copy: "End-to-end review with our advisory board.",
      icon: BadgeCheck,
    },
    {
      title: "Monthly Reports",
      copy: "Detailed ledgers, stories, and KPIs every 30 days.",
      icon: BarChart3,
    },
    {
      title: "Community Voting",
      copy: "Members decide on major annual projects.",
      icon: Vote,
    },
    {
      title: "Digital Dashboard",
      copy: "Track pledges, disbursements, and impact live.",
      icon: LayoutDashboard,
    },
  ];

  const mandateRhythm = [
    {
      title: "Shared cadence",
      copy: "Monthly impact calls and written digests keep every mandate holder aligned on priorities.",
    },
    {
      title: "Transparent tooling",
      copy: "A living dashboard outlines approvals, pledges, and open cases with context from zone leads.",
    },
    {
      title: "Small acts, big reach",
      copy: "Consistent micro-giving pools tuition, welfare, and seed capital so support never rests on one donor.",
    },
  ];

  return (
    <div className="relative flex-1 flex w-full flex-col overflow-hidden bg-[#f8faf4] text-gray-900">
      <section className="relative isolate overflow-hidden bg-linear-to-b from-[#05150d] via-deep-forest to-[#0f351f] text-white pt-6 sm:pt-8">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 10% 20%, rgba(141,198,63,0.35), transparent 45%), radial-gradient(circle at 80% 0%, rgba(203,229,167,0.2), transparent 55%)",
          }}
        />
        <MandateHeader isLanding className="px-4 sm:px-6 lg:px-8" />

        <Section className="relative grid gap-12 py-28 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-sage-green">
              Mandate · {new Date().getFullYear()}
            </p>
            <h1 className="mt-6 font-serif text-4xl font-black leading-tight md:text-6xl">
              Establish mercy. Engineer opportunity.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/80">
              A living fund by alumni for alumni—fueling scholarships, welfare
              relief, and community-led ventures with disciplined transparency.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/mandate/pledge"
                search={{ tier: "supporter", amount: 5000 }}
                className="rounded-full bg-vibrant-lime px-6 py-3 text-sm font-semibold uppercase tracking-wide text-deep-forest transition hover:bg-white"
              >
                Start a Mandate
              </Link>
              <Link
                to="/mandate/dashboard"
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white"
              >
                View impact dashboard
              </Link>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {heroHighlights.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-lg backdrop-blur"
                >
                  <p className="text-sm font-semibold text-white">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm text-white/75">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="relative rounded-4xl border border-white/20 bg-white/5 p-8 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur grid">
            <p className="text-sm uppercase tracking-[0.4em] text-white/60">
              Where funds flow
            </p>
            <div className="mt-6 space-y-6">
              {focusHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4">
                    <div className="rounded-2xl bg-white/15 p-4 max-h-fit">
                      <Icon className="h-6 w-6 text-vibrant-lime" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-sm text-white/75">{item.copy}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 rounded-2xl bg-white/10 p-4 text-sm text-white/80">
              <p className="font-semibold">
                Khadijah’s scholarship is fully underwritten.
              </p>
              <p className="text-white/70">
                A second-year medical student from the Lagos zone stayed
                enrolled without pausing clinicals.
              </p>
            </div>
          </div>
        </Section>
      </section>

      <main>
        <section className="bg-white py-20 md:py-32">
          <Section>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-vibrant-lime">
                Choose Your Impact Level
              </p>
              <h2 className="mt-3 font-serif text-4xl font-bold text-deep-forest">
                Pledge tiers with tangible outcomes
              </h2>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {tiers.map((tier) => {
                const Icon = tier.icon;
                return (
                  <div
                    key={tier.name}
                    className="relative flex h-full flex-col rounded-4xl border border-deep-forest/10 bg-white/90 p-8 shadow-xl"
                  >
                    <div
                      className={`pointer-events-none absolute inset-x-8 top-4 h-24 rounded-3xl bg-linear-to-r ${tier.accent} opacity-80 blur-2xl`}
                      aria-hidden="true"
                    />
                    <div className="relative flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-deep-forest/60">
                          Monthly
                        </p>
                        <h3 className="mt-3 text-2xl font-bold text-deep-forest">
                          {tier.name}
                        </h3>
                      </div>
                      <div className="rounded-2xl bg-deep-forest/10 p-4 text-deep-forest">
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{tier.caption}</p>
                    <div className="mt-6 border-t border-dashed border-deep-forest/20 pt-6">
                      <p className="text-4xl font-black text-deep-forest">
                        {tier.amount}
                      </p>
                      <p className="text-sm font-semibold text-deep-forest/70">
                        Recurring pledge
                      </p>
                    </div>
                    <ul className="mt-6 flex flex-col gap-3 text-sm text-gray-700">
                      {tier.perks.map((perk) => (
                        <li key={perk} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-institutional-green" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/mandate/pledge"
                      search={tier.search}
                      className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-deep-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-institutional-green"
                    >
                      Commit now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                );
              })}

              <div className="relative flex h-full flex-col rounded-4xl border border-deep-forest/20 bg-white/90 p-8 shadow-xl">
                <div
                  className="pointer-events-none absolute inset-x-8 top-4 h-24 rounded-3xl bg-linear-to-r from-sage-green/50 via-mist-green/40 to-transparent opacity-70 blur-2xl"
                  aria-hidden="true"
                />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-deep-forest/60">
                      Flexible
                    </p>
                    <h3 className="mt-3 text-2xl font-bold text-deep-forest">
                      Custom Pledge
                    </h3>
                  </div>
                  <div className="rounded-2xl bg-deep-forest/10 p-4 text-deep-forest">
                    <Edit className="h-6 w-6" />
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Set the rhythm that matches your cash flow.
                </p>
                <p className="text-sm text-gray-600">
                  Define an amount, set an automation, and grow generosity at
                  your pace.
                </p>
                <div className="mt-8 rounded-2xl border border-dashed border-deep-forest/30 bg-mist-green/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-deep-forest/70">
                    Minimum Amount
                  </p>
                  <p className="mt-2 text-3xl font-black text-deep-forest">
                    ₦1000
                  </p>
                </div>
                <Link
                  to="/mandate/pledge"
                  search={{ tier: "custom" }}
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-deep-forest px-5 py-3 text-sm font-semibold text-deep-forest transition hover:bg-deep-forest hover:text-white"
                >
                  Design your flow
                </Link>
              </div>
            </div>
          </Section>
        </section>

        <section className="bg-mist-green/60 py-20 md:py-28">
          <Section>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-deep-forest/70">
                Impact Streams
              </p>
              <h2 className="mt-3 font-serif text-4xl font-bold text-deep-forest">
                How your mandate moves quickly
              </h2>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {focusHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="group relative flex h-full flex-col rounded-3xl border border-deep-forest/10 bg-white p-8 text-center shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div className="mx-auto mb-6 rounded-2xl bg-mist-green/70 p-5 text-deep-forest">
                      <Icon className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-semibold text-deep-forest">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-gray-600">{item.copy}</p>
                    <div className="pointer-events-none absolute inset-x-10 bottom-0 h-24 bg-linear-to-t from-mist-green to-transparent opacity-0 transition group-hover:opacity-80" />
                  </div>
                );
              })}
            </div>
          </Section>
        </section>

        <section className="bg-white py-20 md:py-28">
          <Section className="flex flex-col gap-10 lg:flex-row">
            {momentum.map((item) => (
              <div
                key={item.step}
                className="flex-1 rounded-3xl border border-sage-green/40 bg-mist-green/40 p-6 shadow-inner"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-institutional-green">
                  {item.step}
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-deep-forest">
                  {item.title}
                </h3>
                <p className="mt-3 text-gray-600">{item.copy}</p>
              </div>
            ))}
          </Section>
        </section>

        <section className="bg-deep-forest text-white py-20 md:py-28">
          <Section>
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
                Operating Rhythm
              </p>
              <h2 className="mt-3 font-serif text-4xl font-bold">
                Consistency is our greatest safety net
              </h2>
              <p className="mt-4 text-white/70">
                Every pledge rides a transparent cadence so scholarships,
                welfare, and community ventures keep moving without guesswork.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {mandateRhythm.map((item) => (
                <article
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                    {item.title}
                  </p>
                  <p className="mt-4 text-sm text-white/80">{item.copy}</p>
                </article>
              ))}
            </div>
          </Section>
        </section>

        <section className="bg-white py-20 md:py-28">
          <Section className="grid gap-14 lg:grid-cols-2 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-vibrant-lime">
                Our Purpose
              </p>
              <h2 className="mt-3 font-serif text-4xl font-bold text-deep-forest">
                Building code. Building Ummah.
              </h2>
              <p className="mt-6 text-lg text-gray-700">
                We are a guild of Muslim technologists, professionals, and
                creators who choose disciplined generosity. Every consistent
                pledge unlocks tuition, relieves emergencies, and seeds ventures
                that honour Allah and serve society.
              </p>
              <ul className="mt-8 space-y-4 text-gray-700">
                {[
                  "Scholarships and research grants",
                  "Healthcare & welfare relief",
                  "Networks, mentorship, and venture support",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 text-institutional-green" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -left-6 top-6 h-40 w-40 rounded-full bg-mist-green blur-3xl" />
              <div className="relative overflow-hidden rounded-4xl border border-sage-green/40 bg-white shadow-2xl">
                <img
                  alt="Alumni collaboration"
                  className="h-80 w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDU2HENFOf4sVMApg7CUweolIWfYWcPBPa5WVlfcXbeTBd59NwxzrKFniM96ssrli9dwE2a9Av4qALs9qXC8higXB99YYH6RJb2hu7aRzfvi7Y6_JiUFpZuln3VggJtDZtvxvJQao9OjybLFACmlBEuuTqMoUVqxcvjebmofhstAYyydABCbxnkKEUj9SNQolabE0ZxI298U7CfXoinBQ4YEnbZxcto0LQcwnqajCxwdeLSriVUpPOTNWMvk_QqhamLsoTPLEelIWo"
                />
                <div className="space-y-3 bg-deep-forest px-6 py-6 text-sm text-white">
                  <p className="font-semibold uppercase tracking-[0.3em] text-sage-green">
                    Field note · Kano
                  </p>
                  <p>
                    “My mother’s surgery bill was cleared in 48 hours. I never
                    imagined alumni would turn into my safety net.”
                  </p>
                </div>
              </div>
            </div>
          </Section>
        </section>

        <section className="bg-sage-green/30 py-20 md:py-28">
          <Section className="max-w-5xl">
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
              {trustBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.title}
                    className="rounded-3xl border border-deep-forest/10 bg-white/80 p-6 text-center shadow-lg"
                  >
                    <Icon className="mx-auto h-10 w-10 text-institutional-green" />
                    <h4 className="mt-4 font-semibold text-deep-forest">
                      {badge.title}
                    </h4>
                    <p className="mt-2 text-sm text-gray-600">{badge.copy}</p>
                  </div>
                );
              })}
            </div>
          </Section>
        </section>
      </main>
    </div>
  );
}

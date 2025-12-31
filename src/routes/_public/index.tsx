import { createFileRoute } from "@tanstack/react-router";
import {
  GraduationCap,
  Calendar,
  Users,
  Award,
  Church,
  Briefcase,
  CheckCircle,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { formatDate, now } from "@/utils/date";
import { listArticleOptions } from "@/api/article/options";
import { useQuery } from "@tanstack/react-query";
import { listEventOptions } from "@/api/event/options";
import { Section } from "@/components/section";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useElementSize } from "@mantine/hooks";

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      {
        title: "LAUMGA - Uniting Alumni, Empowering the Ummah",
      },
      {
        name: "description",
        content:
          "Join a thriving network of LAUTECH Muslim alumni dedicated to spiritual growth and community development. Connect with professionals, mentors, and friends across generations.",
      },
      {
        name: "keywords",
        content:
          "LAUMGA, LAUTECH, Muslim alumni, Islamic community, alumni network, professional development, spiritual growth, Ogbomoso",
      },
      {
        property: "og:title",
        content: "LAUMGA - Uniting Alumni, Empowering the Ummah",
      },
      {
        property: "og:description",
        content:
          "Join a thriving network of LAUTECH Muslim alumni dedicated to spiritual growth and community development.",
      },
      {
        property: "og:url",
        content: "https://laumga.org",
      },
      {
        name: "twitter:title",
        content: "LAUMGA - Uniting Alumni, Empowering the Ummah",
      },
      {
        name: "twitter:description",
        content:
          "Join a thriving network of LAUTECH Muslim alumni dedicated to spiritual growth and community development.",
      },
    ],
  }),
  component: RouteComponent,
});

// useSpring(, {
//   stiffness: 100,
//   damping: 30,
//   restDelta: 0.001,
// });

function RouteComponent() {
  const target = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target });
  const { height, ref } = useElementSize();
  const y = useTransform(scrollYProgress, [0, 1], [0, height]);

  const { data: articles } = useQuery(
    listArticleOptions({
      filterBy: [{ field: "status", operator: "==", value: "published" }],
    })
  );

  const { data: events } = useQuery(
    listEventOptions({
      filterBy: [
        {
          field: "startDate",
          operator: ">=",
          value: now,
        },
      ],
      sortBy: [{ field: "startDate", direction: "asc" }],
    })
  );

  return (
    <main ref={target}>
      <section
        ref={ref}
        className="relative w-full flex items-center justify-center text-center bg-gray-900 overflow-hidden"
      >
        <motion.img
          alt="Diverse alumni and students on LAUTECH campus"
          className="absolute top-0 inset-0 w-full object-cover opacity-80 object-top"
          src="/images/lautech-main-gate.png"
          style={{ y, minHeight: height }}
        />

        <div className="absolute inset-0 bg-linear-to-r from-black/60 to-black/20"></div>

        <Section className="relative z-10 text-white justify-center grid py-20 sm:py-42 lg:pt-[18vw] justify-items-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-wider font-serif">
            Connecting Generations.
          </h1>
          <h2 className="text-4xl md:text-6xl font-black tracking-wider mt-2 font-serif">
            Empowering the Ummah.
          </h2>
          <p className="mt-6 text-lg font-light max-w-2xl mx-auto">
            Join a thriving network of professionals, mentors, and friends
            dedicated to spiritual growth and community development.
          </p>
        </Section>
      </section>

      <section className="bg-mist-green py-24 sm:py-32 relative overflow-hidden">
        <Section className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-deep-forest mb-4 font-serif">
                Welcome
              </h2>

              <div className="space-y-4 text-lg text-gray-700 leading-relaxed mb-6">
                <p>
                  &ldquo;All praise and adorations are due to Allah, the Lord of
                  all creatures. We send our salutation upon the noble soul of
                  our beloved Prophet Muhammad (SAW), his household, his
                  companions and the generality of the Muslims till the Day of
                  Judgment (Amin).
                </p>
                <p>
                  It is with great pleasure that I welcome you to the official
                  website of Ladoke Akintola University of Technology (LAUTECH)
                  Muslim Graduates' Association. The aim of the Association is
                  to build a united, virile brotherhood for the cause of
                  Almighty Allah, and common benefits of the Muslim
                  Ummah.&rdquo;
                </p>
              </div>

              <div className="mt-6">
                <p className="font-semibold text-institutional-green dark:text-text-primary-dark">
                  Mr. Goke Aruna
                </p>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Chairman
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center size-full">
              <img
                alt="Mr. Goke Aruna, Chairman LAUMGA Foundation"
                className="rounded-lg size-full object-cover shadow-2xl aspect-4/3"
                src="/images/laumga-chairman-photo.png"
              />
            </div>
          </div>
        </Section>
      </section>

      <section className="bg-institutional-green py-20 sm:py-16 text-white">
        <Section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center mb-3">
                <GraduationCap className="h-10 w-10" />
              </div>
              <p className="text-4xl font-bold">15,000+</p>
              <p className="mt-1 font-sans">Graduates</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center mb-3">
                <Calendar className="h-10 w-10" />
              </div>
              <p className="text-4xl font-bold">25</p>
              <p className="mt-1 font-sans">Years of Service</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center mb-3">
                <Users className="h-10 w-10" />
              </div>
              <p className="text-4xl font-bold">12</p>
              <p className="mt-1 font-sans">Active Chapters</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center mb-3">
                <Award className="h-10 w-10" />
              </div>
              <p className="text-4xl font-bold">50+</p>
              <p className="mt-1 font-sans">Scholarships</p>
            </div>
          </div>
        </Section>
      </section>

      <section className="bg-sage-green py-24 sm:py-32">
        <Section>
          <h2 className="text-4xl font-bold text-deep-forest text-center mb-12 font-serif">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-mist-green rounded-xl shadow-sm p-8 text-center group transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-b-4 border-transparent hover:border-vibrant-lime">
              <div className="flex justify-center mb-4">
                <Users className="h-16 w-16 text-institutional-green" />
              </div>
              <h3 className="font-bold text-2xl text-deep-forest mb-3">
                Brotherhood
              </h3>
              <p className="text-gray-600">
                Fostering a lifelong network of support, collaboration, and
                unity among all members.
              </p>
            </div>
            <div className="bg-mist-green rounded-xl shadow-sm p-8 text-center group transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-b-4 border-transparent hover:border-vibrant-lime">
              <div className="flex justify-center mb-4">
                <Church className="h-16 w-16 text-institutional-green" />
              </div>
              <h3 className="font-bold text-2xl text-deep-forest mb-3">
                Spirituality
              </h3>
              <p className="text-gray-600">
                Promoting Islamic values, knowledge, and spiritual growth as the
                foundation of our community.
              </p>
            </div>
            <div className="bg-mist-green rounded-xl shadow-sm p-8 text-center group transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-b-4 border-transparent hover:border-vibrant-lime">
              <div className="flex justify-center mb-4">
                <Briefcase className="h-16 w-16 text-institutional-green" />
              </div>
              <h3 className="font-bold text-2xl text-deep-forest mb-3">
                Professionalism
              </h3>
              <p className="text-gray-600">
                Empowering members with career development, mentorship, and
                networking opportunities.
              </p>
            </div>
          </div>
        </Section>
      </section>

      <section className="bg-deep-forest py-24 sm:py-32 text-white overflow-hidden">
        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-lg">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
                Your Passport to the Community
              </h2>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-vibrant-lime mr-3 mt-1 shrink-0" />
                  <span>Access a global professional and social network.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-vibrant-lime mr-3 mt-1 shrink-0" />
                  <span>
                    Get reminders about events, seminars, and workshops.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-vibrant-lime mr-3 mt-1 shrink-0" />
                  <span>
                    Contribute to scholarship and community development
                    projects.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-vibrant-lime mr-3 mt-1 shrink-0" />
                  <span>
                    Receive regular updates and our An-Naseehah newsletter.
                  </span>
                </li>
              </ul>

              <Link
                className="mt-8 self-start max-w-fit block rounded-full border-2 border-white px-8 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-deep-forest"
                to="/register"
              >
                Join LAUMGA Today
              </Link>
            </div>
            <div className="flex justify-center items-center">
              <img
                alt="LAUMGA Member ID Card Mockup"
                className="w-full max-w-md rounded-2xl aspect-square object-contain shadow-2xl filter-[drop-shadow(0_20px_25px_rgba(0,0,0,0.4))]"
                src="/images/membership-card.jpeg"
              />
            </div>
          </div>
        </Section>
      </section>

      {articles && articles.length > 0 && (
        <section className="bg-mist-green py-16 sm:py-24">
          <Section>
            <h2 className="font-serif text-3xl font-bold text-slate-grey text-center mb-10">
              News &amp; Bulletins
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles?.slice(0, 3).map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden group"
                >
                  <img
                    alt={article.title}
                    className="h-48 w-full object-cover"
                    src={article.coverImageUrl}
                  />
                  <div className="p-6">
                    <p className="text-sm text-gray-500 mb-2">
                      {formatDate(
                        article.published?.at || article.created?.at,
                        "MMMM d, yyyy"
                      )}
                    </p>
                    <h3 className="font-bold text-lg text-gray-800 mb-3">
                      {article.title}
                    </h3>
                    <Link
                      className="font-semibold text-olive hover:underline"
                      to={`/bulletin/${article.slug}` as any}
                    >
                      Read Article →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </section>
      )}

      {events && events.length > 0 && (
        <section className="bg-white py-16 sm:py-24">
          <Section>
            <h2 className="font-serif text-3xl font-bold text-slate-grey text-center mb-10">
              Upcoming Events
            </h2>
            <div className="max-w-4xl mx-auto space-y-4">
              {events?.map((event) => (
                <div
                  key={event.id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-6 p-4 border-b last:border-b-0"
                >
                  <div className="text-center w-20">
                    <p className="text-3xl font-bold text-olive">
                      {formatDate(event.startDate, "d")}
                    </p>
                    <p className="text-sm font-semibold text-gray-500 uppercase">
                      {formatDate(event.startDate, "MMM")}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600">{event.location}</p>
                  </div>
                  <Link
                    className="text-olive px-4 py-2 text-sm font-medium rounded-md border border-olive hover:bg-olive hover:text-white transition-colors"
                    to={`/events/${event.id}` as any}
                  >
                    Details
                  </Link>
                </div>
              ))}
            </div>
          </Section>
        </section>
      )}
    </main>
  );
}

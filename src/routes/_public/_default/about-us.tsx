import { Button } from "@mantine/core";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  HandHeart,
  Landmark,
  GraduationCap,
  Sparkles,
  Briefcase,
  Globe,
} from "lucide-react";

export const Route = createFileRoute("/_public/_default/about-us")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      <section className="relative bg-deep-forest text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          data-alt="Black and white architectural photo of a university campus building."
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCVTHR8-yq_8s7-rEB6E6pObws6LZIn3KK3FlXNoyhuBu36032eFeXl-NumLp87zBPk4NZ7NVXpbFDKR9Nf4VvrKCsLSn058NoEMN16Y1NLs8R5Ur-kGUYSgcpqGEDiAquPOfhJaZUtVZXk-SzrhKc6hbPYrEcr12rA_soTKlOquM0x-Qn1y_EtRs4Q3C92lPY87nh154XRMZBZuo4DVVhWFhg6LE-KvcTVHkrX6ZFwvXG55_NFDq40Y82kW8JkoMWXyPNVWyYoPfE')",
          }}
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:py-32">
          <p className="mb-4 font-bold uppercase tracking-widest text-vibrant-lime">
            Since 1997
          </p>
          <h1 className="font-serif text-5xl font-bold leading-tight md:text-7xl lg:text-8xl">
            A Legacy of Faith
            <br />
            &amp; Excellence.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-white/80 md:text-lg">
            Uniting over two decades of Muslim graduates in brotherhood and
            service.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2 lg:gap-24">
          <div className="relative">
            <div className="absolute -top-12 -left-12 font-serif text-[12rem] font-black text-institutional-green/10 z-0 lg:text-[16rem]">
              1997
            </div>
            <div className="relative z-10">
              <h2 className="font-serif text-4xl font-bold text-institutional-green sm:text-5xl">
                Our Origin Story
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-gray-700">
                Established as a beacon of knowledge, LAUMGA has grown from a
                campus initiative to a global network, fostering unity and
                progress among Muslim graduates worldwide.
              </p>
            </div>
          </div>

          <div className="relative pr-8 pb-10 p-1 bg-sage-green rounded-2xl overflow-hidden">
            <div
              className="relative rounded-xl overflow-hidden shadow-inner"
              style={{
                boxShadow:
                  "inset 0 8px 16px rgba(0, 0, 0, 0.15), inset 0 -8px 16px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Screen wrapper with perspective */}
              <div style={{ perspective: 1200 }}>
                <div
                  className="relative rounded-xl will-change-transform transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-1 origin-top-left"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* The image */}
                  <img
                    alt="Modern university senate building with glass facade."
                    className="relative z-10 aspect-video w-full rounded-xl object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxMLpFH-rcZDz8StKQJhAIYJXymMItgvwpmlPga-h61hPS5FTVjsl8J4aV21dh5HbtxFmQfy91auTyWOUAV2z8a_5MAbYIH0ARoMgseiPr6j3PUCBvP5BzJ4GNqhbRLgLeqsuXPGZDraMQ8uz7850Z8znO6OGC2w4QkwYiLbg_ytdBDqxl6cF5vX5gkoPPYO9ytBeQOy0lYi7NVXXLI_0isTkyVAxF5KGovL6voiDcyFrxHN0BK8prGwLDHgeh52gtixpbG67JgrU"
                    style={{ transform: "translateZ(32px)" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-mist-green py-16 sm:py-24 lg:py-32 flex flex-col gap-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-serif text-4xl font-bold text-deep-forest sm:text-5xl text-center">
            The Pillars of Purpose
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600 text-center">
            Our aims and objectives form the foundation of our association,
            guiding our efforts to serve our members and the wider community.
          </p>
        </div>

        <div className="relative">
          <section className="lg:grid absolute size-full inset-0 divide-y divide-sage-green border-y border-sage-green hidden">
            <div />
            <div />
            <div />
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-px mx-auto bg-sage-green py-px xl:px-px lg:max-w-7xl">
            <div className="bg-gray-50 p-8 text-left">
              <Users className="h-10 w-10 text-institutional-green" />
              <h3 className="mt-4 text-xl font-bold text-deep-forest">
                Foster Unity
              </h3>
              <p className="mt-2 text-gray-600">
                Strengthening the bonds of brotherhood among all members.
              </p>
            </div>
            <div className="bg-gray-50 p-8 text-left">
              <HandHeart className="h-10 w-10 text-institutional-green" />
              <h3 className="mt-4 text-xl font-bold text-deep-forest">
                Promote Welfare
              </h3>
              <p className="mt-2 text-gray-600">
                Providing support and assistance to members in times of need.
              </p>
            </div>
            <div className="bg-gray-50 p-8 text-left">
              <Landmark className="h-10 w-10 text-institutional-green" />
              <h3 className="mt-4 text-xl font-bold text-deep-forest">
                Support MSSN
              </h3>
              <p className="mt-2 text-gray-600">
                Upholding and supporting the activities of the campus MSSN.
              </p>
            </div>
            <div className="bg-gray-50 p-8 text-left">
              <GraduationCap className="h-10 w-10 text-institutional-green" />
              <h3 className="mt-4 text-xl font-bold text-deep-forest">
                Academic Excellence
              </h3>
              <p className="mt-2 text-gray-600">
                Encouraging and celebrating the academic achievements of
                members.
              </p>
            </div>
            <div className="bg-gray-50 p-8 text-left">
              <Sparkles className="h-10 w-10 text-institutional-green" />
              <h3 className="mt-4 text-xl font-bold text-deep-forest">
                Spiritual Development
              </h3>
              <p className="mt-2 text-gray-600">
                Organizing programs to enhance the spiritual growth of
                graduates.
              </p>
            </div>
            <div className="bg-gray-50 p-8 text-left">
              <Briefcase className="h-10 w-10 text-institutional-green" />
              <h3 className="mt-4 text-xl font-bold text-deep-forest">
                Professional Networking
              </h3>
              <p className="mt-2 text-gray-600">
                Creating opportunities for career growth and collaboration.
              </p>
            </div>
            <div className="bg-gray-50 p-8 text-left md:col-span-2 lg:col-span-3">
              <Globe className="h-10 w-10 text-institutional-green" />
              <h3 className="mt-4 text-xl font-bold text-deep-forest">
                Community Service
              </h3>
              <p className="mt-2 text-gray-600">
                Engaging in impactful service projects within our communities.
              </p>
            </div>
          </section>
        </div>
      </section>

      <section className="bg-deep-forest py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 text-center text-white">
          <h2 className="font-serif text-4xl font-bold sm:text-5xl">
            From Ogbomoso to the World
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-white/70">
            Our branches connect alumni across the nation, maintaining our
            strong bonds far beyond the university gates.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-sage-green flex flex-col justify-center p-8 sm:p-16 lg:p-24">
          <h2 className="font-serif text-4xl font-bold text-deep-forest sm:text-5xl">
            Who We Are
          </h2>
          <p className="mt-6 text-lg text-gray-700">
            Membership is open to all Muslims who have successfully graduated
            from Ladoke Akintola University of Technology (LAUTECH), Ogbomoso,
            with degrees including B.Tech, M.Tech, MBA, and PhD.
          </p>
          <Link to="/membership" className="mt-8 self-start rounded-full border-2 border-deep-forest px-8 py-3 text-sm font-bold text-deep-forest transition-colors hover:bg-deep-forest hover:text-white">
            Check Eligibility
          </Link>
        </div>
        <div className="bg-white p-8 sm:p-16 lg:p-24">
          <h2 className="font-serif text-4xl font-bold text-deep-forest sm:text-5xl">
            Our Programmes
          </h2>
          <p className="mt-6 text-lg text-gray-700">
            We host a variety of events and programmes to foster growth,
            connection, and spiritual development among our members.
          </p>
          <div className="mt-8 flex gap-6 overflow-x-auto pb-4">
            <div className="flex w-64 shrink-0 flex-col">
              <img
                className="h-40 w-full rounded-lg object-cover"
                data-alt="Large audience at an annual convention."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFiqbfz51hXtZhr6xul2ZU8WVcy2ssbzcN30TUTqefM49V4Vr5cEY5S-BHh3StN94FCeCFpf1oGKWCDG8cyGKJPXOukPFis1H7-jJ6HvtfUmB5ohOYbtUeQh9sp2ZFKEE3mGqAVF_uXKYOBNVPaZnD91EgYSSg6_D_fQo5iFb4ySCER-NqkXdjhVAC932kPXLuNbTWQn5gFVXv3XgP7VXLsm4MVgnPQovhHiZskLpYP-ZlNCw0QxLKlpBUuyc0GriKPD4ICZNDIuA"
              />
              <h3 className="mt-3 font-bold text-deep-forest">
                Annual Convention
              </h3>
              <p className="text-sm text-gray-600">
                A gathering of minds and souls for spiritual rejuvenation.
              </p>
            </div>
            <div className="flex w-64 shrink-0 flex-col">
              <img
                className="h-40 w-full rounded-lg object-cover"
                data-alt="People networking at a career seminar."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiiVjKHlQmGl6qWpxlLnCLzaV2kwmJuUcDmwRuq_kK5QuSiTprX6iPnRa6OcsPo1xZBR3ZOf5qQ09eCVqkE69LrO23xc2WcN6vYoegEIlFPSsjOQDRDkiC4yYxN4v-T5SUcg5vU45y0wFxPFBwNYehbR4wkBRux-hllF19ZdUh-ipxfBlOK2DlivD04nZY5U-NL4aD6ye7wYMC0B_tTrB5TecEpZ9slfcj-OvH-Lpi5BtpadCGCXqG357Ka3QQzaMabFI717f5ptE"
              />
              <h3 className="mt-3 font-bold text-deep-forest">
                Career Seminars
              </h3>
              <p className="text-sm text-gray-600">
                Empowering members with skills for professional excellence.
              </p>
            </div>
            <div className="flex w-64 shrink-0 flex-col">
              <img
                className="h-40 w-full rounded-lg object-cover"
                data-alt="A person reading the Quran during a Da'wah activity."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv6blOAxDnHKeNXTV5j_9VPdtxzn11ZRma0Vqgg_PNOEmBuZwds-KdSomAK2nNF1obx3vNw_ZJjPIoIdaOUmUNGtQSbze_IrCWhoX_IYM6Yw9LPKVQOMddxCYWDQN_uk_cfTaDmXt_j1-tiBHFWtMX2ID4y06jjMCSEABYbWgxE-XnHa9DibNuI_8CN9PaYFv13haCtbymtoO-aR_XWLRvmw9_3PywOs0l9pY49NwHAZBZXwV1iPguZ6t2V8UwIlaa1swpP9Rl57w"
              />
              <h3 className="mt-3 font-bold text-deep-forest">
                Da'wah Activities
              </h3>
              <p className="text-sm text-gray-600">
                Spreading the message of Islam through knowledge and action.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="font-serif text-4xl font-bold text-deep-forest sm:text-5xl">
            Be part of the roadmap
            <br />
            for the next decade.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Join us as we continue our journey of faith, excellence, and
            community service. Your participation strengthens our legacy.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              autoContrast
              variant="filled"
              className="hover:scale-101 transition-transform"
              size="xl"
              fz="md"
              radius="xl"
              component={Link}
              to="/register"
            >
              Become a Member
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

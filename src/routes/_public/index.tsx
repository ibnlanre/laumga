import { Button } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/")({
  component: RouteComponent,
});

//  <div className="absolute right-0 top-0 bottom-0 w-full md:w-2/5 bg-sage-green h-[40vh] md:h-auto my-auto md:my-0"></div>

function RouteComponent() {
  return (
    <main>
      <section className="relative w-full flex items-center justify-center text-center bg-gray-900">
        <img
          alt="Diverse alumni and students on LAUTECH campus"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsXODsNA_Hj4RWAPlRFfMgAXUpN3mxDLkwJBGhiGD_dk9C47kDamzg5sKnMMrdRkkcZIIL2ANIw4PqoxGa7VRgGTirvD1q2_FhiM0J_JwUCCgIvrkNsd40xQTa_fzd6ZeGFW03M5WDhc4n5YhIZrYoiYWzKP893FikoqFZ1g5ltL_wZaIfWbbSp-UX0txyBlKKD_wA93TOVDj7chcYw7F5XTkHjn5hUC16FRBf9ajclBxy9ukTwao8s4wH1dOKtxBTBlIOyX68Jsw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/60 to-black/20"></div>

        <div className="relative container mx-auto px-4 lg:px-6 z-10 text-white justify-center grid py-20 sm:py-42 justify-items-center">
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
        </div>
      </section>

      <section className="bg-mist-green py-24 sm:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-6 relative">
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
                  Prof. Taofik A. Adedosu
                </p>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  President
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <img
                alt="Prof. Taofik A. Adedosu, President of LAUMGA"
                className="rounded-lg w-full max-w-sm object-cover shadow-2xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBy5AkZtRXuXVoKbWPr_Sd9_K4UvDSzLQipxGQAxOBtBjHRg-CbPgVy2owe7TnJMLi_VV2FCeQs27IrKDi_PVa4mWomg2_ukrimbefuq13eQhsjfit-49TLRTS5KoOM07jtMwNAv1tpo4I8r8Y-gVX9MhU1NNenslxIO64zPZ_Gq2t8zGmWtUtJC90Mpj2M-Rj1T_LoJBL8Uz6HRdKbgbLpSFAOJAHPl_bUmkptyNLxb9qHiDD-6392JkmRNuTUmTwqxUUMFTOdsM"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-institutional-green py-20 sm:py-16 text-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-4xl">
                  school
                </span>
              </div>
              <p className="text-4xl font-bold">15,000+</p>
              <p className="mt-1 font-sans">Graduates</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-4xl">
                  calendar_today
                </span>
              </div>
              <p className="text-4xl font-bold">25</p>
              <p className="mt-1 font-sans">Years of Service</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-4xl">
                  groups
                </span>
              </div>
              <p className="text-4xl font-bold">12</p>
              <p className="mt-1 font-sans">Active Chapters</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-4xl">
                  workspace_premium
                </span>
              </div>
              <p className="text-4xl font-bold">50+</p>
              <p className="mt-1 font-sans">Scholarships</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sage-green py-24 sm:py-32">
        <div className="container mx-auto px-4 lg:px-6">
          <h2 className="text-4xl font-bold text-deep-forest text-center mb-12 font-serif">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-mist-green rounded-xl shadow-sm p-8 text-center group transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-b-4 border-transparent hover:border-vibrant-lime">
              <div className="flex justify-center mb-4">
                <span className="material-symbols-outlined text-6xl text-institutional-green">
                  diversity_3
                </span>
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
                <span className="material-symbols-outlined text-6xl text-institutional-green">
                  mosque
                </span>
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
                <span className="material-symbols-outlined text-6xl text-institutional-green">
                  work
                </span>
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
        </div>
      </section>

      <section className="bg-deep-forest py-24 sm:py-32 text-white overflow-hidden">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-lg">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
                Your Passport to the Community
              </h2>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start">
                  <span className="material-symbols-outlined text-vibrant-lime mr-3 mt-1">
                    check_circle
                  </span>
                  <span>Access a global professional and social network.</span>
                </li>
                <li className="flex items-start">
                  <span className="material-symbols-outlined text-vibrant-lime mr-3 mt-1">
                    check_circle
                  </span>
                  <span>
                    Get reminders about events, seminars, and workshops.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="material-symbols-outlined text-vibrant-lime mr-3 mt-1">
                    check_circle
                  </span>
                  <span>
                    Contribute to scholarship and community development
                    projects.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="material-symbols-outlined text-vibrant-lime mr-3 mt-1">
                    check_circle
                  </span>
                  <span>
                    Receive regular updates and our An-Naseehah newsletter.
                  </span>
                </li>
              </ul>

              <Button
                autoContrast
                variant="filled"
                className="mt-8"
                component={Link}
                to="/join"
              >
                Join LAUMGA Today
              </Button>
            </div>
            <div className="flex justify-center items-center">
              <img
                alt="LAUMGA Member ID Card Mockup"
                className="w-full max-w-md rounded-2xl rotate-3 shadow-2xl filter-[drop-shadow(0_20px_25px_rgba(0,0,0,0.4))]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHXd9K4nYV26NX_lOwuPJ72BmAPX8QY26kLE6H6MZlq5YpF4bnsnnpuDVoQtIw8qYtWOPtUPZXdSsBPhOycks9vQS-QzIkbXVqDMZl80mHq1epH-tz5cOo1_elc-mPOOx6j_-vTPRgWMYQvtY7XADPodogHScJ0rp5E7p4R4kr6y3FlBghzfcU8oBTPDGAJ1YkOaMeybh5zc9RW9CWQY3mpQkeuT20NxBZzh9yh9dYUsMLSbJsZGFolPRtswI_Fh3rFYNntRzckVk"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-mist-green py-16 sm:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <h2 className="font-serif text-3xl font-bold text-slate-grey text-center mb-10">
            News &amp; Bulletins
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden group">
              <img
                alt="Article thumbnail"
                className="h-48 w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZbN3rjZnb8Sd-eoQMM5CwbGI4DGVr_b2RfWlO7NbmimH4P7-NiirvvsxViy1fBJ4JfFXg91JSmKkBeJgzY8MYhXa36RZxGaXdvUJPKj5lK0AkY2rl8d_NTLnqi51w6QY_wrvN-N5uS2p8B6NlQ3mBTCqW8iN1vPQb5te07s4M_P5cADs5lIdpdNollE0t7fl0z5ZRqO1a_pwd_yxnbLafzHbd-Y6CdMGuADuZufQlL1MCLT1kjcmXxAlkqmVVi2Fc81tf096pQYs"
              />
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">April 22, 2019</p>
                <h3 className="font-bold text-lg text-gray-800 mb-3">
                  HUMAN UNDER THE SIEGE OF CRISIS
                </h3>
                <a
                  className="font-semibold text-olive hover:underline"
                  href="#"
                >
                  Read Article →
                </a>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden group">
              <img
                alt="Article thumbnail"
                className="h-48 w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIUeQu3tas8TenIY03EDUV1IVH6iFs2gIJPwyPvsNUYKeVZtIVVZDpQDdcR3OX3zgtQjPVvpgAD6kucbAyr3h4kXUUMCHrMMkNs-N23mHYRJu_j_XCzIB7mboB5YapJcvkEwUl8zA4zpZFu4MBitOE5qIV7AW_Q-XNFb_BVC6f6kXRcJendqY1ejSvQ940-A0ymt5VAcMQduDVsqAm-wuRYBrN4hqWv86uQXjl1sF9xYDF36Cu4FR_9ZBgMevn2wBNgzA8klR5m8k"
              />
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">March 23, 2016</p>
                <h3 className="font-bold text-lg text-gray-800 mb-3">
                  THE RETURN OF THE ISLAMIC CALIPHATE
                </h3>
                <a
                  className="font-semibold text-olive hover:underline"
                  href="#"
                >
                  Read Article →
                </a>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden group">
              <img
                alt="Article thumbnail"
                className="h-48 w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzbQ6b4vQoW3yFDO72LTmXuIHr7OsqK6u8COx7vurmqvB5nKneSWpT8IChwu7dbdFvMYjK-DbL5Q_TjQmNZGt_dyxvQQa6fGNabAwZQWNJpG1wk79ns0Bsoi0eW04GcNuGt-_7L7pp7rhFBnHY2v3Yec6aAX0jyeavzoLiHK9k43zLlDf3v5fgO4YAayLXm3bvqTEkW3yD4MvCTkrbAjipeMvMzzUVBYe9fkxM8shTcf3QxwwbTyycYngTYBygn-NT6t6DdP1OZ9E"
              />
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">March 23, 2016</p>
                <h3 className="font-bold text-lg text-gray-800 mb-3">
                  DENIGRATION OF THE SPECIAL GARMENT
                </h3>
                <a
                  className="font-semibold text-olive hover:underline"
                  href="#"
                >
                  Read Article →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <h2 className="font-serif text-3xl font-bold text-slate-grey text-center mb-10">
            Upcoming Events
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-6 p-4 border-b">
              <div className="text-center w-20">
                <p className="text-3xl font-bold text-olive">18</p>
                <p className="text-sm font-semibold text-gray-500">APR</p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  LAUMGA Convention 2019
                </h3>
                <p className="text-sm text-gray-600">Ogbomoso</p>
              </div>
              <a
                className="text-olive px-4 py-2 text-sm font-medium rounded-md border border-olive hover:bg-olive hover:text-white transition-colors"
                href="#"
              >
                Register
              </a>
            </div>
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-6 p-4 border-b">
              <div className="text-center w-20">
                <p className="text-3xl font-bold text-olive">14</p>
                <p className="text-sm font-semibold text-gray-500">APR</p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  12TH LAUMGA National Convention
                </h3>
                <p className="text-sm text-gray-600">
                  MKO Lecture Theatre, LAUTECH
                </p>
              </div>
              <a
                className="text-olive px-4 py-2 text-sm font-medium rounded-md border border-olive hover:bg-olive hover:text-white transition-colors"
                href="#"
              >
                Details
              </a>
            </div>
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-6 p-4">
              <div className="text-center w-20">
                <p className="text-3xl font-bold text-olive">11</p>
                <p className="text-sm font-semibold text-gray-500">JUN</p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  Ramadan Lecture - Economic Crunch
                </h3>
                <p className="text-sm text-gray-600">
                  250 Seater Lecture Theater, LAUTECH
                </p>
              </div>
              <a
                className="text-olive px-4 py-2 text-sm font-medium rounded-md border border-olive hover:bg-olive hover:text-white transition-colors"
                href="#"
              >
                Details
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

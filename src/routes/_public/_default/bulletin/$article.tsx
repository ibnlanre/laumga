import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/_default/bulletin/$article")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative w-full bg-mist-green font-display">
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div className="h-1 bg-vibrant-lime" style={{ width: "45%" }}></div>
      </div>

      <div className="relative">
        <header className="bg-deep-forest text-white py-20">
          <div className="max-w-3xl mx-auto text-center px-4">
            <p className="text-vibrant-lime text-sm font-normal leading-normal tracking-widest pb-3 pt-1">
              SOCIETY &amp; CRISIS
            </p>
            <h1 className="text-white tracking-tight text-5xl lg:text-6xl font-bold leading-tight pb-6">
              Human Under the Siege of Crisis
            </h1>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <span className="font-medium">By Author Name</span>
              <span className="text-sage-green">• Jan 20, 2024 •</span>
              <div className="flex items-center space-x-1 text-sage-green">
                <span className="material-symbols-outlined text-base">
                  timer
                </span>
                <span>5 min read</span>
              </div>
            </div>
          </div>
        </header>

        <div
          className="w-full h-64 md:h-96 bg-center bg-no-repeat bg-cover"
          data-alt="Black and white photo of a bustling city street under a dramatic sky, conveying a sense of crisis."
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD5s261CnaiuleKa20PbcYlpJhR9CXZSq7onSFhHE55ZSeWPpPDmx56SKL3_t5eyfqHbEiPeH5xLfCYGoi4rVZFmSBW5vZ0qd-HvggRJEOktA5YFCyF6qi539ggkXsSNQgAr85Yl1NYRkftWDFFM330dWGMWN7IJDzaFWvakUpdgJjQe08-t6XINBnBRJd2-3n61r-0_DW3dHTkE83hpMcJYoYCCE2mqraNIOyBcWHVzffK0PHX_ZX2RGnLQyJPn0OzXHYyZc2KyQI')",
          }}
        ></div>

        <main className="relative py-16 lg:py-24 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
            <aside className="hidden lg:block col-span-1 sticky top-32 h-screen">
              <div className="flex flex-col items-center space-y-4 pt-8">
                <a
                  className="group p-2 border border-institutional-green rounded-full hover:bg-vibrant-lime hover:border-vibrant-lime transition-colors duration-300"
                  href="#"
                >
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 text-institutional-green group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      clip-rule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      fill-rule="evenodd"
                    ></path>
                  </svg>
                </a>
                <a
                  className="group p-2 border border-institutional-green rounded-full hover:bg-vibrant-lime hover:border-vibrant-lime transition-colors duration-300"
                  href="#"
                >
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 text-institutional-green group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a
                  className="group p-2 border border-institutional-green rounded-full hover:bg-vibrant-lime hover:border-vibrant-lime transition-colors duration-300"
                  href="#"
                >
                  <span
                    className="material-symbols-outlined text-institutional-green group-hover:text-white"
                    style={{ fontSize: "20px" }}
                  >
                    link
                  </span>
                </a>
              </div>
            </aside>

            <article className="col-span-12 lg:col-start-3 lg:col-span-7 bg-white shadow-lg rounded-lg p-8 md:p-12 -mt-48 lg:-mt-64 z-10">
              <div className="prose prose-lg max-w-none text-dark-grey font-display text-xl leading-extra-loose">
                <p>
                  <span
                    className="float-left text-7xl font-bold text-institutional-green mr-3 mt-1"
                    style={{ lineHeight: "0.8" }}
                  >
                    I
                  </span>
                  n the heart of turmoil, where the dust of conflict settles on
                  every surface, a new narrative of human resilience is being
                  written. It’s a story not of grand armies or political chess,
                  but of individuals and communities navigating the labyrinth of
                  crisis. This is a journey through the landscapes of adversity,
                  finding light in the most shadowed corners of our world.
                </p>
                <p>
                  The dawn breaks not with the gentle caress of sunlight, but
                  with the distant echo of a world in flux. We witness this
                  unfolding drama in our daily lives, through the flickering
                  screens that connect us to the far reaches of the globe. From
                  the crowded refugee camps to the silent, abandoned streets of
                  once-thriving cities, the human spirit endures, adapts, and
                  strives for a semblance of normalcy.
                </p>
                <blockquote className="text-center text-3xl italic font-medium text-deep-forest my-12 py-4 border-y-2 border-mist-green">
                  "The scenario in Baghdad, Aleppo and Tripoli..."
                </blockquote>
                <p>
                  It is here, in the crucible of hardship, that the true essence
                  of community is forged. Neighbors share what little they have,
                  strangers offer a helping hand, and the bonds of shared
                  experience create a tapestry of support that defies the chaos.
                  This is not a passive acceptance of fate, but an active,
                  conscious choice to uphold dignity and hope.
                </p>
                <div className="my-10 pl-6 border-l-4 border-sage-green">
                  <p className="italic text-lg text-gray-600">
                    In fields of dust, a seed of hope we sow,
                    <br />
                    Where shadows fall, we learn to let it grow.
                    <br />
                    A whispered prayer, a story softly told,
                    <br />
                    More precious now than silver or than gold.
                  </p>
                </div>
                <p>
                  Understanding this resilience is not merely an academic
                  exercise; it is a moral imperative. It requires us to look
                  beyond the headlines and statistics, to see the faces and hear
                  the voices of those whose lives have been irrevocably altered.
                  It is in their stories that we find the lessons for our own
                  societies, a reminder of the fragility of peace and the
                  enduring power of faith and solidarity.
                </p>
              </div>

              <div className="mt-16 pt-10 border-t border-gray-200">
                <h2 className="text-3xl font-bold text-deep-forest mb-6">
                  Discussion (0)
                </h2>
                <div className="space-y-4">
                  <div className="relative">
                    <textarea
                      className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-vibrant-lime focus:ring-0 sm:text-sm sm:leading-6 transition-all"
                      id="comment"
                      name="comment"
                      placeholder="Add your perspective..."
                      rows={1}
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="rounded-md bg-institutional-green px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-institutional-green"
                      type="button"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </article>

            <aside className="hidden lg:block col-span-2 sticky top-32 h-screen">
              <div className="space-y-12 pt-8">
                <div>
                  <h3 className="font-semibold text-deep-forest mb-4">
                    About the Author
                  </h3>
                  <div className="flex items-center space-x-4">
                    <img
                      className="h-14 w-14 rounded-full"
                      data-alt="Profile picture of the author, a man with glasses and a friendly smile."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAk3g94dn0sTbUJwQL7ALsmZ30E8zC9lhqUJup9mKf8wm56YR6_NLgAxr6B8_zCtO-t6WEnK2zBAZwiWP9K_nLgTHSL7I6CE4rIEQtJoCNmtFQz9KiKgbVlgWG8Ly3KCDb-AH308C15KnYO-r0S5I1OkKcOri3Dgxbel2It7qQBPUn00HUJqsu9qvNFPcZprwjjN4CjCn1qv0VNymrJ2q9MOF2pxgSg5xVi-S8l2KMM9eNbFONZ_1kQm1hbMwQpHXd_fVZVfaeFuHo"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    A short bio describing the author's expertise and
                    background. Passionate about social justice and humanitarian
                    issues.
                  </p>
                  <button className="mt-3 text-sm font-semibold text-institutional-green hover:underline">
                    Follow
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold text-deep-forest mb-4">
                    Trending Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <a
                      className="text-sm font-medium text-institutional-green bg-sage-green/50 px-3 py-1 rounded-full hover:bg-sage-green transition-colors"
                      href="#"
                    >
                      #Palestine
                    </a>
                    <a
                      className="text-sm font-medium text-institutional-green bg-sage-green/50 px-3 py-1 rounded-full hover:bg-sage-green transition-colors"
                      href="#"
                    >
                      #Ummah
                    </a>
                    <a
                      className="text-sm font-medium text-institutional-green bg-sage-green/50 px-3 py-1 rounded-full hover:bg-sage-green transition-colors"
                      href="#"
                    >
                      #Health
                    </a>
                    <a
                      className="text-sm font-medium text-institutional-green bg-sage-green/50 px-3 py-1 rounded-full hover:bg-sage-green transition-colors"
                      href="#"
                    >
                      #Community
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>

        <footer className="bg-mist-green pt-16 pb-24">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-deep-forest mb-12">
              More from the Bulletin
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md overflow-hidden group">
                <div
                  className="h-48 bg-cover bg-center"
                  data-alt="A close-up shot of an open book with intricate calligraphy."
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA73PsMo8NbNbTKU6RaG7Bg7FgPRkKNYoyRqWcXmZtd5jR2ESGt7Mlp08sCGkHooe9D2YAaqUpPDyDZA6B-O2mUdQAMKux-ma8cO23nhGWX53BvBuoAKouFByrRX0I12lozna4ZXz7Vb8MTPCdAhwVAE3fY44bh9O8iUMtgaNqv_LRxEy5pg7N_-anNONmWMtiLGGnDNSw4M6Z4gVEwQ5x6j7mdNQw5gLUWuhFSufwjPqbooZFD0nuKZ8CJwMWbmj83JInIGj935qA')",
                  }}
                ></div>
                <div className="p-6">
                  <p className="text-institutional-green text-sm font-semibold">
                    FAITH &amp; SPIRITUALITY
                  </p>
                  <h3 className="text-xl font-bold text-deep-forest mt-2 mb-3 group-hover:text-institutional-green transition-colors">
                    The Art of Reflection in a Modern Age
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Rediscovering the profound impact of contemplation and
                    spiritual mindfulness in our fast-paced world.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden group">
                <div
                  className="h-48 bg-cover bg-center"
                  data-alt="A doctor in scrubs looking thoughtfully at a medical chart."
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBKyT-OD5uVWCmJsOEAl_FPIWQBadoU9XnpDkjHAKKu-fJXgXOFUTTzGuujrvhY8c4YRS6tWMMIcrXdB2Gdoekx16PnoOr7KoT1smGiwyINekejdF0hm2ZXHEpmmH5Fu9ay7UzrW_0BTyBnqZkbokQJMfirCubsMCV2prB0YMnJjAOmobLOgWbaZinipVgZOBf-Xh3voYAya3nPFwIcqP1jxC3Q_p5vKYtIs20A_ySPOreVpdBnv0yu1NGtdlliLq2jzTao6RF5acY')",
                  }}
                ></div>
                <div className="p-6">
                  <p className="text-institutional-green text-sm font-semibold">
                    HEALTH &amp; WELLBEING
                  </p>
                  <h3 className="text-xl font-bold text-deep-forest mt-2 mb-3 group-hover:text-institutional-green transition-colors">
                    Navigating Health Choices with Faith
                  </h3>
                  <p className="text-gray-600 text-sm">
                    An exploration of how Islamic principles can guide us toward
                    holistic health and wellness decisions.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden group">
                <div
                  className="h-48 bg-cover bg-center"
                  data-alt="A diverse group of university students collaborating on a project."
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCMpI-U5ve3Tth58XUY3c0b3oDEYA8upWlJF4-alrH4pRKeH0YLZi_nkHr4F0KOInXAj77YmPmIE3VLDYRFjKKfIVYZaQEtcksPaCEpwjmCdgWl2I6NcgOQ35AS0ke-21SqRJrBOiazq2ZIX_EkfYreTlbOVKbKs13okoUUcSuEKPqZKPnhtFUBCWFiuUYmTzShPUCrJ7GBNmVoLbznPb2biVeAXAN8jAo13veCIZEDKifpLrcHTOPlffTntYsDqXmX6Pzt0lxALwg')",
                  }}
                ></div>
                <div className="p-6">
                  <p className="text-institutional-green text-sm font-semibold">
                    CAREER &amp; EDUCATION
                  </p>
                  <h3 className="text-xl font-bold text-deep-forest mt-2 mb-3 group-hover:text-institutional-green transition-colors">
                    Leadership Lessons from the Seerah
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Applying prophetic wisdom to modern leadership challenges in
                    the workplace and community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
